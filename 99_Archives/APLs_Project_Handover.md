# APLs Website — Project Handover for Claude Code

> 이 문서는 Claude Code로 APLs 웹사이트 개발을 이어받기 위한 통합 사양서다.
> 브랜드 정체성, 인터랙션 규칙, 현재까지 구현된 코드 구조, 남은 작업을 모두 포함한다.

---

## 0. 프로젝트 개요

**회사**: APLs Co., Ltd. (주식회사 에이피엘스)
**목적**: 데이터 기반 이미지 컨설팅 법인 공식 웹사이트
**배포 대상**: Cloudflare Pages (GitHub repo 연동)
**에셋 호스팅**: Cloudflare R2 (영상·이미지)
**언어**: KR / EN / JP / CN (출시 시점부터)
**레퍼런스**: https://www.shareintensive.com/ — 구조 + 인터랙션 + 섹션 순서 차용

**현재 상태 (Claude Code 인계 시점)**:
- `index.html` 단일 파일로 Hero + About + Services 3개 섹션 완료
- 나머지 6~7개 섹션 추가 필요
- 다국어 분기 미구현
- 배포 미완료

---

## 1. Company Basics

| 항목 | 값 |
|---|---|
| 법인명 | 주식회사 에이피엘스 (APLs Co., Ltd.) |
| 대표자 | 임경은 (Lim Kyung Eun) |
| 설립일 | 2024년 12월 1일 |
| 사업자등록번호 | 102-81-48099 |
| 법인등록번호 | 110111-9110406 |
| 소재지 | 서울특별시 강남구 선릉로 428, 11층 |
| 업종 | 교육 컨설팅업 / 경영 컨설팅업 |

**포지셔닝**: 주관적 미학을 측정 가능한 기준으로 전환하는 데이터 기반 이미지 컨설팅 법인
**슬로건**: `Clearly Measured. Personally Set.` (번역 없이 영문 원문 4개 언어권 공통 사용)

---

## 2. Brand Architecture

```
APLs (지주·B2B·해외·기관)
 ├─ APLCOLOR    — B2C 진단 스튜디오 (부산·서울·오사카·상하이)
 ├─ KCFB        — 한국퍼스널컬러패션뷰티협회 (자격·인증)
 └─ KimVsTiger  — 기술·AI·데이터 인프라
```

APLs 웹사이트의 서브브랜드는 **Footer에서만** 언급된다. Hero 하단 스트립은 shareintensive식으로 5개 서비스 카테고리를 표시한다 (서브브랜드가 아님).

---

## 3. Target Audience

**1차 (80%)**: B2B — 기업 임원, 뷰티/헤어/패션 업계 사업자, 공공기관, 해외(일본·중국) 파트너
**2차 (20%)**: B2C 상위 인지 유입 (실제 B2C는 APLCOLOR가 담당)

톤: **기업 톤. 수강생 모집 사이트가 아님.**

---

## 4. 5 Integrated Practices (사이트 전반 축)

| # | 카테고리 | 영문 라벨 | 해당 서브브랜드 |
|---|---|---|---|
| 01 | 진단 | DIAGNOSIS | APLCOLOR |
| 02 | 자격 | CERTIFICATION | KCFB |
| 03 | 컨설팅 | CONSULTING | APLs 본체 |
| 04 | 교육 | TRAINING | APLs + KCFB |
| 05 | 도구·데이터 | TOOLS & DATA | KimVsTiger |

네비게이션, Hero 하단 스트립, Services 섹션 모두 이 5개 축으로 구성.

---

## 5. Tone & Aesthetic

**기준**: 컨설팅 펌 80% + 조용한 럭셔리 20%

**레퍼런스**:
- 구조·인터랙션·섹션 순서: shareintensive.com
- 톤·여백: McKinsey, Bain, Aesop, Hermès
- 학술·편집적 디테일: Pantone Color Institute

**차별화 키워드**: Measured / Integrated / Evidenced

**한 줄 캐릭터**: "상장사 연차보고서를 읽는데, 그 회사가 뷰티 컨설팅을 한다."

---

## 6. Design Tokens (CSS Variables)

### Colors

**Base**
```css
--bg-primary:    #FCFAF6;  /* warm ivory, 절대 순백 아님 */
--bg-secondary:  #FFFFFF;
--bg-tint:       #F6F1E8;
```

**Text**
```css
--text-primary:   #2A2A2A;
--text-secondary: #6B6560;
--text-tertiary:  #9A938B;
```

**Accents**
```css
--accent-beige:    #C4B5A0;  /* 헤어라인, 장식 */
--accent-indi:     #C9A9A6;  /* Primary CTA + 활성 상태 전용 */
--accent-indi-ink: #9E7D7A;  /* indi hover */
```

**Lines**
```css
--line:        #EFE9DD;
--line-strong: #D6CCBD;
```

**Category Accents (nav hover + tile 점 전용, 배경 사용 금지)**
```css
--accent-diagnosis:     #A8927A;  /* muted ochre */
--accent-certification: #7D6B8A;  /* muted plum */
--accent-consulting:    #4A5A5E;  /* deep teal-gray */
--accent-training:      #8A6F5A;  /* warm cocoa */
--accent-tools:         #6B7A5E;  /* sage */
```

### Typography

**Latin**
- Serif (display): Cormorant Garamond — **roman 전용, italic 금지**
- Sans (body/UI): Inter
- Mono (captions): JetBrains Mono

**Korean**
- Serif: Noto Serif KR
- Sans: Pretendard

**Scale (Desktop)**
| 용도 | 크기 | 폰트 / 웨이트 |
|---|---|---|
| Display (Hero) | clamp(56px, 6.4vw, 104px) | Cormorant 300 |
| H2 | 40-48px | Cormorant 400 |
| H3 | 24-28px | Cormorant 500 |
| Body | 16-18px | Inter 400, line-height 1.65 |
| Eyebrow | 11-12px | Inter 500, uppercase, letter-spacing 0.18em |
| Nav label | 25px | Inter 600, uppercase |
| Nav tagline | 11px | Inter 400 |
| Mono caption | 10-13px | JetBrains Mono, letter-spacing 0.2em |

### Motion

```css
--ease-soft: cubic-bezier(0.22, 1, 0.36, 1);
--duration-fast:   200ms;
--duration-base:   400ms;
--duration-slow:   800ms;
--duration-reveal: 600ms;
```

### Layout

```css
--content-max: 1280px;
--side-pad:    clamp(24px, 6vw, 80px);
```

- 12-column grid 기준
- 섹션 간 세로 리듬: 120-160px desktop
- Card radius: 최대 8px (권장 2-4px)
- Borders: 1px solid var(--line). **box-shadow 금지.**

---

## 7. Interaction & Motion Rules (CRITICAL)

**배경 애니메이션 금지.** 블롭 드리프트, 그라데이션 드리프트, 루프 키프레임 전부 금지.
배경 움직임은 오직 (a) 업로드된 영상, (b) 스크롤 리액션에서만 나온다.

### A. 스크롤 리빌 (IntersectionObserver 기반)

```html
<div class="reveal reveal--eyebrow">...</div>
<h2 class="reveal reveal--heading">...</h2>
<p class="reveal reveal--body">...</p>
```

- threshold 0.15, trigger once
- eyebrow: fade + translateY(8px → 0), duration-base
- heading: fade + translateY(16px → 0), duration-slow, delay 100ms
- body: fade, duration-base, delay 200ms

### B. Word-by-word reveal (Apple식 블러 캐스케이드)

```html
<h1 class="reveal--words" data-words>
  Clearly Measured. Personally Set.
</h1>
```

- JS가 로드 시 각 단어를 `<span class="reveal__word">`로 래핑
- 각 단어: 초기 opacity 0, translateY(20px), filter blur(8px)
- is-visible 시 60-80ms 스태거로 순차 등장, blur → 0

### C. Drift (스크롤보다 느린 시차)

```html
<p class="reveal reveal--body reveal--drift" data-drift>...</p>
```

- 스크롤 시 요소가 약 0.85× 속도로 이동 (최대 ±20px)
- requestAnimationFrame 기반

### D. Hero 커서 패럴랙스

- Hero 배경이 마우스 반대 방향으로 ±10px 이동
- 터치 디바이스 + prefers-reduced-motion 감지 시 비활성화

### E. Navigation hover

- 5개 메뉴 각각 카테고리 액센트 색 할당
- hover 시 label 색 전환 + 1px 밑줄 왼→오 draw
- duration-fast (200ms)

### F. 접근성

```css
@media (prefers-reduced-motion: reduce) {
  .reveal, .reveal--words, .reveal__word, .reveal--drift {
    opacity: 1 !important;
    transform: none !important;
    filter: none !important;
    transition: none !important;
  }
}
```

---

## 8. Hero Video (Cloudflare R2)

**R2 설정**
- Public URL: `https://pub-11ab88f795554550b062d5ad9bda0a83.r2.dev`
- 영상 경로: `/hero-loop.mp4`
- 최종 URL: `https://pub-11ab88f795554550b062d5ad9bda0a83.r2.dev/hero-loop.mp4`

**영상 사양**
- 1280×720, H.264 Main profile, yuv420p, CRF 26
- 오디오 제거, faststart 활성화, 12-15초 loop, 2-4MB 목표

**인코딩 명령어**
```bash
ffmpeg -i input.mov \
  -c:v libx264 -profile:v main -pix_fmt yuv420p \
  -crf 26 -preset slow \
  -vf "scale=1280:-2" \
  -an \
  -movflags +faststart \
  hero-loop.mp4
```

**CSS 처리**
- 영상이 로드되면 `blur(22px) saturate(0.85) scale(1.1)` 자동 적용
- 워시 레이어: 40-55% ivory (절대 초과 금지 — 움직임 가려짐)
- 영상 없을 때 정적 그라데이션 폴백 유지

**향후 커스텀 도메인 연결 예정**: `assets.apls.co` 등 서브도메인 고려

---

## 9. Imagery Policy

**사용 가능**: 다큐멘터리 스타일, 따뜻한 아이보리 그레이딩, "Fig. 01" mono 캡션 스타일, 측색기/진단천 제품샷

**절대 금지**:
- 스톡 포토 (웃는 여성, 과장된 컨설팅 제스처)
- AI 생성 일러스트, 그라데이션 메시
- 플랫 일러스트 아이콘
- 라운드 코너 큰 거, 그림자, 이모지

**플레이스홀더**: 실사진 들어오기 전까진 diagonal stripe 패턴 + mono 라벨
예: `STUDIO · APLCOLOR BUSAN · 16:9`

**필요 이미지 비율**
| 자산 | 메인 | 서브 |
|---|---|---|
| APLCOLOR 지점 내부 | 16:9 | 3:4 |
| 측색기 LS170 클로즈업 | 1:1 | 4:5 |
| 진단천·교구 플랫레이 | 1:1 | 4:5 |
| 강의 현장·전문가 양성 | 16:9 | 3:4 |
| 대표 프로필 | 3:4 | 1:1 |
| 진단 과정 (고객+전문가+측색기) | 16:9 | 3:4 |
| Hero 와이드 배너 | 21:9 | — |

---

## 10. Sitemap (shareintensive 구조 기반)

```
01 Hero (완료)
    — Nav (2단 스택: 태그라인 + 대문자 라벨)
    — Slogan "Clearly Measured. Personally Set."
    — Lede + CTAs (Request Consultation / Explore Services)
    — 하단 5 카테고리 스트립 (shareintensive식)
    — 배경: R2 영상 + 폴백 그라데이션

02 About — Step Into the Standard (완료)
    — shareintensive의 "STEP INTO THE WORK" 위치
    — 대형 미션 헤드라인 (word-by-word reveal)
    — 서브 카피
    — 회사 소개 3문장
    — 4개 stat (Studios / Records / Languages / Established)
    — 법인 정보 mono 블록
    — 3장 16:9 사진 플레이스홀더

03 How We Work — our programs (미구현)
    — shareintensive의 "Work / our programs" 위치
    — 4단계 메서드: MEASURE → ANALYZE → CONSULT → SET STANDARD
    — 각 단계: 숫자 원 + 동사(대형 serif) + 제목 + 설명 + 디테일 라벨
    — 연결 hairline (beige)
    — 배경: #FFFFFF (ivory 사이 호흡)

04 Services — Five Integrated Practices (완료)
    — shareintensive의 "Work / our courses" 위치
    — 5개 타일 그리드 (Diagnosis / Certification / Consulting / Training / Tools & Data)
    — 각 타일: 태그(카테고리 점 포함) + 이름 + 설명 + 링크
    — hover: 흰색 채움 + translateY(-2px)

05 Experts & Partners — workshop leaders (미구현)
    — shareintensive의 "workshop leaders" 위치
    — KCFB 인증 전문가 8명 포트레이트 그리드 (4:5, 그레이스케일→컬러)
    — 파트너 로고 월 (5×2, 그레이스케일→컬러)

06 KCFB Community — THE COMMUNITY (미구현)
    — shareintensive의 "THE COMMUNITY" 위치
    — 좌우 분할: 좌측 미션 + CTA / 우측 3개 혜택 타일
    — 배경: bg-tint (#F6F1E8)

07 Testimonials — from the dancers (미구현)
    — shareintensive의 "from the dancers" 위치
    — 3개 후기 블록, 좌측 beige 퀏 바
    — 이름 + 소속 mono

08 Journal (미구현, shareintensive에 직접 대응 없음 — 추가 섹션)
    — 3개 아티클 카드 (Methodology / Case Study / Technology)

09 FAQ (미구현)
    — 좌우 분할: 좌측 헤드라인 + 연락 / 우측 아코디언 7개
    — 배경: bg-tint

10 Footer (미구현)
    — 4열: Brand + Explore + Network + Contact
    — 하단 바: 저작권 + 언어 스위처 + 법적 링크
    — 배경: bg-tint, 사업자 정보 mono 블록 포함
```

---

## 11. Don'ts (절대 금지 리스트)

- **italic 헤드라인 금지** (Cormorant italic이 예뻐도 뷰티 매거진 톤으로 기울어짐)
- **배경 키프레임 애니메이션 금지** (블롭, 그라데이션 드리프트 전부)
- **박스 섀도 금지** (1px hairline만)
- **라운드 코너 8px 초과 금지**
- **이모지 금지**
- **스톡 포토 금지**
- **순백 #FFFFFF 메인 배경 금지** (warm ivory #FCFAF6 유지)
- **카테고리 액센트 5색을 배경 채우기로 사용 금지** (오직 nav hover + 점 표시)
- **"Hospital chart" 과다 디테일 금지** (좌표·측정 눈금·과도한 세션 번호 금지)
- **페이지 로드 시 전체 오버레이 인트로 금지**
- **스크롤 하이재킹 금지**

---

## 12. 현재 `index.html` 코드 구조

**단일 HTML 파일**: CSS + JS 모두 인라인. CDN 의존성은 Google Fonts + Pretendard만.

**주요 CSS 구역**:
```
1. BRAND TOKENS (:root variables)
2. RESET
3. NO ITALIC HEADLINES 강제
4. REVEAL UTILITIES (scroll reactions)
5. NAVIGATION (two-line stacked format)
6. HERO (video bg + wash + content + bottom strip)
7. SERVICES (5 tiles grid)
8. ABOUT (mission + detail + stats + photos)
9. RESPONSIVE (1080 / 768 / 640 breakpoints)
10. FOCUS + SELECTION
```

**주요 JS 구역** (IIFE로 래핑):
```
1. Nav scroll state (is-scrolled class on scroll > 8px)
2. Language switcher (active class toggle)
3. Word-by-word splitter (data-words 요소 자동 처리)
4. IntersectionObserver for all reveals
5. Drift (requestAnimationFrame scroll parallax)
6. Hero video load (R2 URL 사용, 404 시 fallback 유지)
7. Cursor parallax on hero (±10px, 터치·reduced-motion 제외)
```

---

## 13. Claude Code에서 이어받을 작업

### 우선순위 1: 남은 섹션 추가 (순차)
`index.html`에 아래 섹션을 순서대로 추가. 각 섹션 완성 후 로컬 확인.

1. **How We Work (03)** — About과 Services 사이에 삽입
   - 4단계 타임라인 (MEASURE → ANALYZE → CONSULT → SET STANDARD)
   - 흰색 배경
   - 각 단계: 숫자 원 + 동사(대형 serif uppercase) + 제목 + 설명 + detail label

2. **Experts & Partners (05)** — Services 뒤
   - KCFB 인증 전문가 8명 (4:5 플레이스홀더)
   - 파트너 로고 월 (5×2)

3. **KCFB Community (06)** — Experts 뒤
   - 배경 bg-tint
   - 좌측: 대형 미션 + Apply CTA
   - 우측: 3개 혜택 타일

4. **Testimonials (07)** — Community 뒤
   - 3개 인용 블록, 좌측 beige 퀏 바

5. **Journal (08)** — Testimonials 뒤
   - 3개 아티클 카드 (16:9 플레이스홀더)

6. **FAQ (09)** — Journal 뒤
   - 좌우 분할, 아코디언 7개
   - 배경 bg-tint

7. **Footer (10)** — 최하단
   - 4열 + 하단 바
   - 사업자 정보 mono 포함

### 우선순위 2: 다국어 구조
- KR/EN/JP/CN 언어 전환 구현
- 현재 더미 언어 스위처만 있음 (클릭 시 active 토글만)
- 권장: HTML에 `data-i18n` 속성 + JS lookup 테이블
- 파일 분리 고려: `/locales/ko.json`, `/locales/en.json` 등
- 슬로건 `Clearly Measured. Personally Set.`은 번역하지 않고 영문 원문 유지

### 우선순위 3: 배포 (Cloudflare Pages)
1. GitHub repo 생성 (예: `apls-website`)
2. `index.html` + `/assets/` 구조로 업로드
3. Cloudflare Pages에서 repo 연결
4. 빌드 설정: 정적 HTML (빌드 명령 없음)
5. 커스텀 도메인 연결 (예: `apls.co`)

### 우선순위 4: 실이미지 교체
- 본 문서 9번 섹션의 필요 이미지 비율 표 참고
- 촬영/수급 완료되는 대로 플레이스홀더 교체
- R2 또는 GitHub repo의 `/assets/images/`에 업로드

### 우선순위 5 (옵션): 콘텐츠 관리
- Journal 섹션이 생기면 블로그 글 관리 필요
- 단순하게: `/journal/` 폴더에 개별 HTML 파일 추가
- 복잡하게: Headless CMS (Sanity, Contentful) 연동

---

## 14. Claude Code 시작 프롬프트 (복사용)

Claude Code 시작 시 아래 프롬프트로 시작:

```
This project is a corporate website for APLs Co., Ltd.
(주식회사 에이피엘스), a data-driven image consulting firm in Seoul.

I have a single index.html file that contains Hero + About + Services
sections fully implemented, and I need to add the remaining sections
following the shareintensive.com structure applied with APLs brand identity.

Read the attached APLs_Project_Handover.md for full specs:
- Brand tokens (colors, typography, motion)
- Interaction rules (reveal utilities, video slot, cursor parallax)
- Absolute Don'ts (no italic headlines, no background animations,
  no box-shadows, no stock photos, etc.)
- Sitemap with 10 sections (3 done, 7 remaining)

Start by reading index.html to understand the current structure, then
proceed to add the next section: How We Work (03), which sits between
About and Services. Use the specs from the handover doc.

Work section by section. After each section, start a local dev server
(`python3 -m http.server 8000` or similar) so I can verify visually
before moving on.

Critical: do not deviate from the hard constraints. No italic, no
background animations, no hospital-chart over-measurement details.
Apple-style scroll reactions (word-by-word, drift) are the primary
interaction layer.
```

---

## 15. 파일 이관 체크리스트

Claude Code로 이관할 때 가져가야 할 파일:

1. **`index.html`** — 현재까지 구현된 단일 HTML (Hero + About + Services)
2. **`APLs_Project_Handover.md`** — 이 문서
3. **`APLs_Brand_Identity.md`** — 브랜드 정체성 상세 (선택, 이 문서에 요약 포함됨)
4. **영상 파일** — 이미 R2에 업로드 완료 (`pub-11ab88f795554550b062d5ad9bda0a83.r2.dev/hero-loop.mp4`)

Claude Code 작업 폴더 구조 권장:
```
apls-website/
├── index.html
├── assets/
│   ├── images/     (실이미지 들어갈 자리)
│   └── fonts/      (필요 시)
├── locales/        (다국어 도입 시)
│   ├── ko.json
│   ├── en.json
│   ├── ja.json
│   └── zh.json
├── docs/
│   ├── APLs_Project_Handover.md
│   └── APLs_Brand_Identity.md
├── .gitignore
└── README.md
```

---

## 16. 연락 및 법적 정보 (Footer에 들어갈 내용)

**법인 정보**
```
APLs Co., Ltd. (주식회사 에이피엘스)
CEO: Lim Kyung Eun
Corporate Registration: 102-81-48099
11F, 428 Seolleung-ro, Gangnam-gu, Seoul, Republic of Korea
```

**연락처** (추후 확정)
- 이메일: contact@apls.co (도메인 확보 시)
- 전화: +82 (0)2-XXXX-XXXX

**소셜** (Instagram, LinkedIn, YouTube 등)

**법적 링크**
- Privacy Policy
- Terms of Service
- Cookie Policy

---

## 17. 참고 레퍼런스 링크

- **shareintensive.com** — 구조·섹션 순서·인터랙션 주요 레퍼런스
- **aesop.com** — 여백 운용, 타이포 리듬
- **mckinsey.com** — 컨설팅펌 톤, 그리드 운용
- **pantone.com / color.pantone.com** — 학술적 타이포그래피, 색 설명 방식

---

*문서 최종 업데이트: 2025년 4월*
*작성: Claude (APLs 웹사이트 초기 개발 세션)*
