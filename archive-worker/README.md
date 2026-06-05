# ksat-archive — 기출문제 자료실 파일 게이트웨이

Cloudflare Worker + R2로 기출문제 PDF·MP3를 저장/배포한다.
**다운로드(egress) 비용이 0원**이라 자료실에 적합하다.

```
[관리자 페이지] ──업로드(Firebase 토큰)──▶ [Worker] ──▶ [R2 버킷]
[일반 사용자]   ──다운로드(공개 GET)──────▶ [Worker] ──▶ [R2 버킷]
```

- 업로드/삭제: Firebase ID 토큰의 UID가 관리자(`ffDuv…`)일 때만 허용
- 다운로드: 공개 (현재는 비공개 단계라 archive 페이지 자체가 관리자에게만 보임)

---

## 셋업 (최초 1회)

### 0. 준비
- Cloudflare 계정 (무료) — 이미 있음
- Node.js 설치 (wrangler 실행용)

### 1. R2 버킷 만들기
1. Cloudflare 대시보드 → **R2** → **Create bucket**
2. 이름: `ksat-archive` (wrangler.toml의 `bucket_name`과 동일해야 함)
3. 지역: Automatic (또는 APAC)
4. R2를 처음 켤 때 **결제 카드 등록**을 요구할 수 있음 — 무료 한도(저장 10GB,
   읽기 1천만/월, 쓰기 1백만/월, **egress 무료**) 안에서는 0원. 예산 알림 걸어두면 안전.

### 2. Worker 배포
이 폴더(`archive-worker/`)에서:

```bash
npm install -g wrangler      # 최초 1회
wrangler login               # 브라우저로 Cloudflare 로그인
wrangler deploy              # worker.js 배포
```

배포가 끝나면 주소가 출력된다:

```
https://ksat-archive.<your-subdomain>.workers.dev
```

> 대시보드로도 가능: Workers & Pages → Create → 코드에 worker.js 붙여넣기 →
> Settings → Variables → **R2 Bucket Bindings**에 `BUCKET` = `ksat-archive` 추가.
> wrangler 쪽이 훨씬 간단하니 가능하면 CLI 권장.

### 3. 사이트에 Worker 주소 연결
`shared.js`의 다음 줄을 배포된 주소로 교체:

```js
const ARCHIVE_BASE = 'https://ksat-archive.YOUR-SUBDOMAIN.workers.dev';
```

커밋·푸시하면 끝. 관리자 페이지 업로드가 이 주소로 전송된다.

### 4. (선택) 출처 제한 확인
`worker.js`의 `ALLOWED_ORIGINS`에 `https://chaehun1.github.io`가 들어있는지 확인.
로컬 테스트가 필요하면 localhost 항목도 이미 포함돼 있음.

---

## 동작 방식

| 경로 | 메서드 | 인증 | 설명 |
|------|--------|------|------|
| `/archive/<key>` | GET | 없음 | R2 파일 서빙. `?dl=1` 붙이면 강제 다운로드 |
| `/upload` | POST | Firebase 토큰 | `file`+`key`(multipart) → R2 저장, 공개 URL 반환 |
| `/delete` | POST | Firebase 토큰 | `{prefix}` → 해당 prefix 파일 일괄 삭제 |

키 구조: `archive/{examId}/{group}/{subject}/{kind}.{ext}`
예) `archive/2027-pyeongga-g3-suneung/korean/공통/문제.pdf`

---

## 비용 / 한도 (R2 무료 티어)

- 저장: 10GB/월 무료 → 회분당 ~40MB면 250회분
- 읽기(Class B): 1천만/월 무료
- 쓰기(Class A): 1백만/월 무료
- **다운로드 트래픽(egress): 무제한 무료** ← R2의 핵심 장점

초과해도 저렴($0.015/GB·월 저장). 안심하려면 R2 대시보드에서 알림 설정.

---

## 공개 전환 (자료 5회분 이상 쌓인 뒤)

1. `archive/index.html`, `robots.txt`의 noindex/Disallow 해제
2. Firestore Rules `archive_exams`의 `read`를 `if true`로 변경 (관리자 페이지에서 재생성·게시)
3. `sitemap.xml`에 `/archive/` 추가
4. 다운로드는 이미 공개 GET이라 Worker 수정 불필요
