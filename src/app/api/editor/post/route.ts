import { NextRequest, NextResponse } from 'next/server';
import matter from 'gray-matter';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER;
const GITHUB_REPO = process.env.GITHUB_REPO;
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const postPath = searchParams.get('path');
    
    if (!postPath) {
      return NextResponse.json({ error: 'Path is required' }, { status: 400 });
    }

    if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO) {
      return NextResponse.json({ error: 'GitHub configuration missing' }, { status: 500 });
    }

    // Fetch file content from GitHub
    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${postPath}?ref=${GITHUB_BRANCH}`,
      {
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
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