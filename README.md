## Blog Editor Setup

### Security Features
- Password-protected access
- Session-based authentication
- Environment variables for sensitive data

### Local Development Setup
Create a `.env.local` file with:

```env
# Editor Password (choose a strong password)
EDITOR_PASSWORD=your_secure_password

# GitHub Personal Access Token (get from GitHub settings)
GITHUB_TOKEN=your_github_personal_access_token

# Repository Information
GITHUB_OWNER=hugehoo
GITHUB_REPO=hugehoo.blog
GITHUB_BRANCH=main
```

### Deployment to Vercel
1. Deploy your repository to Vercel
2. In Vercel project settings, add these environment variables:
   - `EDITOR_PASSWORD` - A strong password
   - `GITHUB_TOKEN` - Your GitHub personal access token
   - `GITHUB_OWNER` - hugehoo
   - `GITHUB_REPO` - hugehoo.blog
   - `GITHUB_BRANCH` - main

### Creating a GitHub Personal Access Token
1. Go to https://github.com/settings/tokens
2. Click "Generate new token" (classic)
3. Name it (e.g., "blog-editor")
4. Select the `repo` scope
5. Generate and copy the token

### Accessing the Editor
1. Navigate to `/editor-login`
2. Enter your editor password
3. You'll be redirected to the editor

**Security Notes:**
- Never commit your GitHub token or password
- The editor URL is hidden but the login provides actual security
- Sessions expire after 24 hours

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
