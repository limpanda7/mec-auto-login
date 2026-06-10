import { chromium } from 'playwright';

const TIMEOUT = 20_000;

const SITES = [
  {
    name: 'MEC',
    url: 'https://cx-crflx.demo.sc4.medallia.com/cxmedallia/',
    username: process.env.MEC_USERNAME,
    password: process.env.MEC_PASSWORD,
  },
  {
    name: 'HTL',
    url: 'https://htl-crflx.demo.sc4.medallia.com/htl/',
    username: process.env.HTL_USERNAME,
    password: process.env.HTL_PASSWORD,
  },
];

function log(level, site, msg) {
  const time = new Date().toISOString().replace('T', ' ').slice(0, 19);
  console.log(`${time} [${level}] [${site}] ${msg}`);
}

async function loginSite({ name, url, username, password }) {
  log('INFO', name, `로그인 시도 → ${url}`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) ' +
      'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  });
  const page = await context.newPage();

  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: TIMEOUT });
    log('INFO', name, '페이지 로드 완료');

    const usernameField = page.locator('input[name="username"]');
    await usernameField.waitFor({ timeout: TIMEOUT });
    await usernameField.fill(username);
    log('INFO', name, 'ID 입력 완료');

    const passwordField = page.locator('input[name="password"]');
    await passwordField.fill(password);
    log('INFO', name, 'PW 입력 완료');

    const loginBtn = page.locator('button#logBtn');
    await loginBtn.click();
    log('INFO', name, '로그인 버튼 클릭');

    await page.waitForURL(
      (u) => !u.toString().includes('logon'),
      { timeout: TIMEOUT }
    );

    log('INFO', name, `로그인 성공 ✅  현재 URL: ${page.url()}`);
    return true;

  } catch (err) {
    log('ERROR', name, `로그인 실패: ${err.message}`);

    const filename = `login_fail_${name}_${Date.now()}.png`;
    await page.screenshot({ path: filename, fullPage: true });
    log('INFO', name, `실패 스크린샷 저장: ${filename}`);

    return false;

  } finally {
    await browser.close();
  }
}

const results = [];
for (const site of SITES) {
  const ok = await loginSite(site);
  results.push({ name: site.name, ok });
}

console.log('\n──────────────────────────');
for (const { name, ok } of results) {
  console.log(`  ${ok ? '✅' : '❌'}  ${name}`);
}
console.log('──────────────────────────\n');

const allOk = results.every((r) => r.ok);
process.exit(allOk ? 0 : 1);
