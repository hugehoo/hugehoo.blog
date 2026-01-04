## Blog Editor Setup

### Environment Variables
To use the blog editor, create a `.env.local` file with the following variables:

```env
# GitHub Personal Access Token with repo permissions
GITHUB_TOKEN=your_github_personal_access_token

# GitHub Repository Information
GITHUB_OWNER=your_github_username
GITHUB_REPO=your_repo_name
GITHUB_BRANCH=main
```

### Creating a GitHub Personal Access Token
1. Go to GitHub Settings > Developer settings > Personal access tokens
2. Click "Generate new token" (classic)
3. Give it a name and select the `repo` scope
4. Copy the token and add it to your `.env.local` file

### Accessing the Editor
The editor is available at `/editor-secret-2024` (keep this URL private)

### Todo

- 도메인 사야징 룰루
- Post routing
- Post 서버에서 불러오기

### 글감

- [ ] ratelimiter 를 뚫을 수 있을까?
- [ ] scheme registry

### ref

- https://yoonminlee.com/
- https://www.d5br5.dev/blog
- https://junghyeonsu.com/posts/please-buy-the-blog-3/
- https://bepyan.me/
- https://enjoydev.life/blog
- https://kr.pinterest.com/pin/982558843698363432/
- https://gyeongsun.com/
- https://100pearlcent.github.io/
- https://www.gimsesu.me/blog
- https://kangju.dev/
