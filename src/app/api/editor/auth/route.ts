import { NextRequest, NextResponse } from 'next/server';

const EDITOR_PASSWORD = process.env.EDITOR_PASSWORD;

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    
    if (!EDITOR_PASSWORD) {
      console.error('EDITOR_PASSWORD environment variable is not set');
      return NextResponse.json({ error: 'Editor password not configured' }, { status: 500 });
    }
    
    if (password === EDITOR_PASSWORD) {
      // Create a simple session token
      const token = Buffer.from(`editor:${Date.now()}`).toString('base64');
      
      const response = NextResponse.json({ success: true });
      
      // Set HTTP-only cookie that expires in 24 hours
      response.cookies.set('editor-session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 24 hours
        path: '/',
      });
      
      return response;
    } else {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}