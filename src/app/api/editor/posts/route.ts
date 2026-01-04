import { NextResponse } from 'next/server';
import { validateGitHubConfig } from '@/config/env';

export async function GET() {
  try {
    const { token, owner, repo, branch } = validateGitHubConfig();

    // Fetch the contents of the src/posts directory
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/src/posts?ref=${branch}`,
      {
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch posts from GitHub');
    }

    const contents = await response.json();
    
    // Filter only directories (posts)
    const posts = contents
      .filter((item: any) => item.type === 'dir')
      .map((item: any) => ({
        path: `src/posts/${item.name}/index.mdx`,
        name: item.name,
        category: '' // Category will be in frontmatter
      }));

    return NextResponse.json({ posts });
  } catch (error: any) {
    console.error('Failed to fetch posts:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch posts',
      details: error.message 
    }, { status: 500 });
  }
}