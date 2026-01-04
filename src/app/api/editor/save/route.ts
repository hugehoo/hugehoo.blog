import { NextRequest, NextResponse } from 'next/server';
import { validateGitHubConfig } from '@/config/env';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, title, date, description, category, slug, open, isNewPost, existingPath, sha } = body;

    const { token, owner, repo, branch } = validateGitHubConfig();

    const frontmatter = `---
title: "${title}"
date: ${date}
desc: "${description}"
category: "${category}"
open: ${open}
---

${content}`;

    // Encode content to base64
    const encodedContent = Buffer.from(frontmatter).toString('base64');
    
    let filePath: string;
    if (isNewPost) {
      filePath = `src/posts/${slug}/index.mdx`;
    } else {
      filePath = existingPath;
    }

    // Prepare the API request body
    const requestBody: any = {
      message: `Update post: ${title}`,
      content: encodedContent,
      branch: branch,
    };

    // If updating existing file, include SHA
    if (!isNewPost && sha) {
      requestBody.sha = sha;
    }

    // Create or update file via GitHub API
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('GitHub API error:', errorData);
      throw new Error(errorData.message || 'Failed to save post to GitHub');
    }

    const data = await response.json();
    
    return NextResponse.json({ 
      success: true, 
      path: filePath,
      sha: data.content.sha 
    });
  } catch (error: any) {
    console.error('Failed to save post:', error);
    return NextResponse.json({ 
      error: 'Failed to save post', 
      details: error.message 
    }, { status: 500 });
  }
}