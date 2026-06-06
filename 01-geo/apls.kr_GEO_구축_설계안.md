# apls.kr GEO 구축 설계안 (CLI 실행용)

> **최종 목표:** 외국(대만·중국·일본·서구) 고객이 LLM/검색에 "한국 퍼스널컬러 전문가 과정"을 물었을 때 APL이 인용·추천되는 사이트.
> **스택:** Astro + Cloudflare Pages (정적 HTML = 크롤러가 본문 직독 / content collections = 자료실 / sitemap·RSS·i18n 공식 통합)
> **실행 방식:** Phase 0 → 5 순차. 각 Phase 끝에 ✅ 체크포인트. 한 단계씩 완료 후 다음으로.

---

## ⚠️ 발견된 전략 이슈 (먼저 인지)

- **"APLS / APL" 브랜드 토큰이 나스닥 제약사 Apellis(APLS) + 신경과 학회(APLS 2025)와 충돌.** → 브랜드명 SEO로는 못 이김.
- **대응:** 콘텐츠는 "카테고리+지역+언어" 키워드로 최적화하고, **Organization schema의 `sameAs`로 엔티티를 명확히 구분**해서 "APL Color = 퍼스널컬러 회사"임을 검색/LLM에 못박는다. (Phase 4에서 처리)

---

# Phase 0 — 진단 & 크롤링 토대 (반나절)

**목표:** 사이트가 색인 가능한 상태인지 확인하고, 크롤러를 들여보낸다. 이게 안 되면 이후 전부 무의미.

### 0-1. 현재 배포 상태 진단
```bash
curl -sI https://apls.kr                 # HTTP 상태코드 확인 (200이어야 정상)
curl -s https://apls.kr/robots.txt       # robots.txt 존재/내용 확인
curl -s https://apls.kr | head -c 2000   # 실제 내려오는 HTML 확인 (빈 div만 오면 JS렌더 문제)
```
- `curl`로 받은 HTML에 본문 텍스트가 안 보이고 빈 컨테이너만 있으면 → 크롤러도 똑같이 빈 페이지를 봄. 정적 렌더로 가야 하는 이유.

### 0-2. Cloudflare Pages 배포 정상화
- 현재 "잘못된" 배포 원인 파악: 빌드 실패 / 출력 디렉토리(`dist`) 경로 / 커스텀 도메인 연결.
- Cloudflare 대시보드 → Pages → 프로젝트 → 빌드 로그 확인.

### 0-3. robots.txt 작성
```
User-agent: *
Allow: /

Sitemap: https://apls.kr/sitemap-index.xml
```
- 모든 크롤러에 전체 허용 + sitemap 위치 명시. Astro가 sitemap을 자동 생성하므로 경로만 맞춰둠.

### 0-4. 검색엔진 등록
- **Google Search Console** (search.google.com/search-console) → 도메인 속성 추가 → DNS TXT 인증 → sitemap 제출.
- **Naver Search Advisor** (searchadvisor.naver.com) → 사이트 등록 → 소유확인 → sitemap 제출.

### ✅ 체크포인트 0
- [ ] `https://apls.kr` 200 응답 + 본문 텍스트가 HTML에 포함됨
- [ ] robots.txt가 `Allow: /` 상태
- [ ] Search Console / Naver 둘 다 소유확인 완료

---

# Phase 1 — 사이트 구조 & 스택 셋업 (1일)

**목표:** Astro 프로젝트를 만들고 Cloudflare Pages에 자동배포 파이프라인을 건다.

### 1-1. 프로젝트 생성
```bash
npm create astro@latest apls-site -- --template minimal --typescript
cd apls-site
npx astro add sitemap         # sitemap 자동생성
npx astro add tailwind        # 스타일 (기존 브랜드 토큰 이식용)
```
- `astro add`는 통합 패키지 설치 + 설정파일 자동 수정까지 해줌.

### 1-2. i18n 라우팅 설정 (`astro.config.mjs`)
```js
export default defineConfig({
  site: 'https://apls.kr',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ja', 'zh', 'ko'],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [sitemap()],
});
```
- `site`는 sitemap 절대경로 생성에 필수. locales는 영문 우선(외국 고객 타겟).

### 1-3. 디렉토리 구조
```
src/
├─ layouts/BaseLayout.astro      # <head> meta·schema 공통
├─ pages/
│  ├─ index.astro                # 영문 홈
│  ├─ professional-course.astro  # 핵심 랜딩 (Phase 2)
│  ├─ ja/ , zh/ , ko/            # 언어별 분기
│  └─ resources/                 # 자료실 (Phase 3)
├─ content/
│  └─ resources/                 # 글 마크다운 저장소
└─ components/  Schema.astro, FAQ.astro, ...
```

### 1-4. 브랜드 토큰 이식
- 기존 apls 아이덴티티 적용: Cormorant Garamond + Inter + Pretendard, ivory / dusty indi-pink / luxury beige.
- `BaseLayout.astro`에 폰트 링크 + Tailwind 테마 변수로 색상 정의.

### 1-5. Cloudflare Pages 연결
- GitHub repo 푸시 → Cloudflare Pages가 repo 감지 → 빌드명령 `npm run build`, 출력 `dist`.
- 이후 `git push`만 하면 자동 재배포.

### ✅ 체크포인트 1
- [ ] `npm run build` 성공, `dist/`에 정적 HTML 생성
- [ ] Cloudflare 자동배포 작동 (푸시 → 라이브 반영)
- [ ] 4개 언어 라우팅 동작

---

# Phase 2 — 핵심 랜딩: 전문가과정 페이지 (1~2일)

**목표:** 앞서 만든 1~6 블루프린트를 실제 페이지로. 이게 LLM이 인용할 1순위 자산.

### 2-1. H1 정의문
> "APL is a professional personal color training program in Busan, Korea — operated by nationally certified 컬러리스트 기사 (Korea National Colorist Engineer) instructors, with studios in Busan, Seoul, Osaka, and Shanghai."
- "APL is ~" 단정문. 도시·자격·국가 고유명사 첫 문장에.

### 2-2. 권위 블록 (텍스트로!)
- 국가공인 컬러리스트기사/산업기사 강사진 · KCFB 첫 공식 인정 교육기관 · LS170 분광측색계 LAB 진단 · 4개국 운영.
- ⚠️ 이미지에 박지 말 것. 전부 본문 `<p>` 텍스트.

### 2-3. 과정 스펙 표 (`<table>`)
| 항목 | 내용 |
|---|---|
| 기간 | 4 days |
| 시간 | (확정 필요) |
| 언어 | KR / EN / JA / ZH |
| 수료증 | (국제 인정 표기 근거 확인 후) |
| 가격 | ₩4,500,000 |
| 정원 | (소수정예) |

### 2-4. FAQ 섹션 (`FAQ.astro` 컴포넌트 + FAQPage schema)
- "Do I need prior qualification?" / "Is the certificate internationally recognized?" / "What makes APL different?" (→ LAB·4개국)

### 2-5. 제3자 신뢰 신호
- Creatrip·Trazy 등재 링크, 후기, KCFB 역링크.

### 2-6. Course schema (JSON-LD) 삽입 (Phase 4와 연계)

### ✅ 체크포인트 2
- [ ] `curl -s https://apls.kr/professional-course | grep "APL is"` → 정의문이 HTML에 텍스트로 존재
- [ ] FAQ가 텍스트로 렌더됨
- [ ] 4개 언어판 존재

---

# Phase 3 — 자료실 / 피드 엔진 (2~3일)

**목표:** 정기 발행으로 색인 콘텐츠를 누적. "양"이 아니라 "고유·고밀도" 중심.

### 3-1. Content collection 스키마 (`src/content/config.ts`)
```ts
const resources = defineCollection({
  schema: z.object({
    title: z.string(),
    lang: z.enum(['en','ja','zh','ko']),
    category: z.enum(['method','science','industry','case-study']),
    keywords: z.array(z.string()),
    publishDate: z.date(),
    description: z.string(),
  }),
});
export const collections = { resources };
```
- frontmatter를 타입으로 강제 → 글마다 keywords·category가 빠지는 걸 방지(SEO 일관성).

### 3-2. 카테고리 택소노미 (브랜드 아닌 카테고리 키워드 전략)
- `method` — 진단 방법론 (드레이프 vs LAB 측색 비교 등)
- `science` — 색채과학 (LAB 색공간, 언더톤의 물리적 정의)
- `industry` — 업계/자격 (컬러리스트기사, 해외 시장 동향)
- `case-study` — 진단 사례 (13,000건 데이터 인사이트, 익명화)
- → 전부 경쟁사가 영/일/중으로 **못 쓰는 고유 자산.** 이게 LLM이 APL을 권위로 인식하게 만드는 핵심.

### 3-3. 글 템플릿 + Article schema
- listing 페이지(`/resources/`), 글 상세, 태그/카테고리 페이지.
- 각 글에 `Article` + 해당되면 `FAQPage` JSON-LD.
- 내부 링크: 글 → 전문가과정 랜딩, 글 ↔ 관련 글 (topical authority).

### 3-4. RSS 피드
```bash
npx astro add rss
```
- `/rss.xml` 자동 생성. RSS는 크롤러·LLM이 신규 콘텐츠를 빠르게 발견하는 통로.

### ✅ 체크포인트 3
- [ ] 글 1편 발행 → sitemap·RSS에 자동 등재
- [ ] 카테고리/태그 페이지 동작
- [ ] 글 본문이 정적 HTML로 직독 가능

---

# Phase 4 — 구조화 데이터 & GEO 강화 (1~2일)

**목표:** LLM/검색이 APL을 "정확한 엔티티"로 인식하게 + 인용 친화적 구조.

### 4-1. Organization schema (엔티티 충돌 해소 — 중요)
```json
{
  "@type": "Organization",
  "name": "APL Color",
  "url": "https://apls.kr",
  "description": "Personal color analysis & training company based in Busan, Korea.",
  "sameAs": [
    "https://www.instagram.com/aplcolor_official/",
    "https://kcfb.kr"
  ]
}
```
- `sameAs`로 인스타·KCFB를 묶어 "이 APL = 퍼스널컬러 회사"임을 못박음 → 제약사 APLS와 분리.

### 4-2. 페이지별 schema
- 전문가과정 → `Course`, 자료실 글 → `Article`, FAQ → `FAQPage`, 경로 → `BreadcrumbList`.

### 4-3. hreflang + Open Graph + meta
- 언어판 상호 연결 hreflang, OG 태그(SNS·LLM 미리보기), 각 페이지 고유 title·description.

### 4-4. llms.txt (신규 표준)
- 루트에 `/llms.txt` — LLM 크롤러용 사이트 요약·핵심 페이지 안내. 채택 늘고 있어 선제 적용 권장.

### 4-5. 성능 점검
- Lighthouse / PageSpeed 90+ 목표 (느리면 색인 우선순위 하락).

### ✅ 체크포인트 4
- [ ] Google Rich Results Test 통과 (schema 유효)
- [ ] hreflang 4개 언어 상호참조 확인
- [ ] Lighthouse 90+

---

# Phase 5 — 발행 운영 & 측정 (지속)

**목표:** 꾸준히 쌓고, 실제로 검색/LLM에 잡히는지 측정·교정.

### 5-1. 발행 리듬
- 주 1~2편, 빈도보다 밀도. 영문 우선 → 일·중 번역 확장.
- 콘텐츠 백로그(우선순위 높은 고유 주제):
  - "LAB colorimetry vs drape: scientific personal color diagnosis"
  - "14-season personal color system explained"
  - "How to become a certified personal color analyst in Korea (for foreigners)"

### 5-2. 백링크 확보
- Creatrip·Trazy 과정 등재(역링크 + 외국인 유입), KCFB↔apls 상호링크, 인스타 프로필·게시물에 apls.kr 링크.

### 5-3. 측정 루프
- Search Console: 색인 커버리지 / 어떤 쿼리로 노출되는지 / 클릭.
- LLM 인용 점검: ChatGPT·Claude에 타겟 질문 던져서 APL이 나오는지 주기적 확인.
- 안 잡히는 글 → 제목·키워드·내부링크 보강.

### ✅ 체크포인트 5
- [ ] Search Console에 색인된 페이지 수 증가 추세
- [ ] 타겟 쿼리로 노출 발생
- [ ] LLM 질의 시 APL 인용 등장 (장기 목표)

---

## 진행 순서 요약
`Phase 0(토대)` → `1(스택)` → `2(핵심 랜딩)` → `3(자료실)` → `4(schema)` → `5(운영)`

> 💬 각 Phase 들어갈 때 그 단계만 CLI 명령·코드까지 풀어서 같이 진행. 한 단계 끝나면 체크포인트 확인하고 다음으로.
