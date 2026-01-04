import { NextRequest, NextResponse } from 'next/server';
import matter from 'gray-matter';
import { validateGitHubConfig } from '@/config/env';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const postPath = searchParams.get('path');
    
    if (!postPath) {
      return NextResponse.json({ error: 'Path is required' }, { status: 400 });
    }

    const { token, owner, repo, branch } = validateGitHubConfig();

    // Fetch file content from GitHub
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${postPath}?ref=${branch}`,
      {
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch post from GitHub');
    }

    const fileData = await response.json();
    
    // Decode base64 content
    const fileContent = Buffer.from(fileData.content, 'base64').toString('utf-8');
    const { data, content } = matter(fileContent);
    
    return NextResponse.json({
      content,
      title: data.title || '',
      date: data.date || '',
      description: data.desc || data.description || '',
      category: data.category || '',
      open: data.open !== undefined ? data.open : true,
      sha: fileData.sha // We'll need this for updating the file
    });
  } catch (error) {
    console.error('Failed to read post:', error);
    return NextResponse.json({ error: 'Failed to read post' }, { status: 500 });
  }
}