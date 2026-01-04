import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if the request is for the editor or editor API
  const isEditorRoute = request.nextUrl.pathname.startsWith('/editor-secret-2024') ||
                        request.nextUrl.pathname.startsWith('/api/editor');
  
  // Skip auth check for the auth endpoint itself
  const isAuthRoute = request.nextUrl.pathname === '/api/editor/auth';
  
  if (isEditorRoute && !isAuthRoute) {
    const session = request.cookies.get('editor-session');
    
    if (!session) {
      // Redirect to login page for page requests
      if (!request.nextUrl.pathname.startsWith('/api/')) {
        return NextResponse.redirect(new URL('/editor-login', request.url));
      }
      // Return 401 for API requests
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/editor-secret-2024/:path*', '/api/editor/:path*'],
};