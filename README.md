### 글감

- [ ] ratelimiter 를 뚫을 수 있을까?
- [ ] scheme registry

### Book 기록 추가

`src/books/<legacy-slug>.mdx` 파일을 아래 형식으로 추가합니다.

```md
---
title: '책 제목'
slug: english-lowercase-slug
date: 2026-08-10
author: '저자'
publisher: '출판사'
publicationYear: 2025
originalTitle: 'Original Title (2024)'
---

자유로운 독서 기록
```

책 URL은 frontmatter의 `slug`를 사용해 `/book/<slug>` 형식으로 생성합니다.
slug에는 영문 소문자, 숫자, 하이픈만 사용할 수 있으며 모든 책에서 고유해야 합니다.
기존 파일명 기반 URL은 해당 slug URL로 영구 리다이렉트됩니다.

### 글 slug 관리

글 URL은 frontmatter의 `slug`를 사용해 `/blog/posts/<slug>` 형식으로 생성합니다.
한 번 공개한 slug는 기존 링크 호환성을 위해 변경하지 않습니다.

```md
---
title: '글 제목'
slug: english-lowercase-slug
date: 2026-09-07
category: go
open: true
---
```

slug에는 영문 소문자, 숫자, 하이픈만 사용할 수 있으며 모든 글에서 고유해야 합니다.
기존 제목 기반 URL은 해당 slug URL로 영구 리다이렉트됩니다.

### Thumbnail size guide

Post list thumbnails use a **16:10** aspect ratio with `object-cover` (fills the box and crops anything that doesn't fit).

- Container: `200 × 125` on `sm+`, `140 × 88` on mobile
- Recommended export: **800 × 500** (4×, retina-ready)
- Minimum: **400 × 250** (2×)

Set the path in a post's MDX frontmatter:

```bash
---
thumbnail: /img/your-image.png
---
```

### ref

- https://yoonminlee.com/
- https://www.d5br5.dev/blog
- https://junghyeonsu.com/posts/please-buy-the-blog-3/
- https://bepyan.me/
- https://kr.pinterest.com/pin/982558843698363432/
- https://gyeongsun.com/
- https://100pearlcent.github.io/
- https://www.gimsesu.me/blog
- https://kangju.dev/
