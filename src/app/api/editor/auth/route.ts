import { NextRequest, NextResponse } from 'next/server';
import { validateEditorConfig, ENV } from '@/config/env';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    
    const { password: editorPassword } = validateEditorConfig();
    
    if (password === editorPassword) {
      // Create a simple session token
      const token = Buffer.from(`editor:${Date.now()}`).toString('base64');
      
      const response = NextResponse.json({ success: true });
      
      // Set HTTP-only cookie that expires in 24 hours
      response.cookies.set('editor-session', token, {
        httpOnly: true,
        secure: ENV.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 24 hours
        path: '/',
      });
      
      return response;
    } else {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }
  } catch (error: any) {
    console.error('Auth error:', error);
    return NextResponse.json({ 
      error: 'Authentication failed',
      details: error.message 
    }, { status: 500 });
  }
}