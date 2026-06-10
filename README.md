# mec-auto-login

Medallia CX/HTL 데모 사이트 자동 로그인 매크로입니다.  
일정 기간 로그인하지 않으면 데모 사이트가 만료되는 문제를 방지하기 위해 GitHub Actions로 매일 자동 실행됩니다.

## 실행 주기

매일 오전 9시 (KST) 자동 실행되며, GitHub Actions 탭에서 수동 실행도 가능합니다.

## 기술 스택

- Node.js 24
- [Playwright](https://playwright.dev/) — 브라우저 자동화
- GitHub Actions — 스케줄 실행

## 실패 시

로그인에 실패하면 스크린샷이 Actions Artifacts에 자동 저장됩니다. (보관 기간 90일)
