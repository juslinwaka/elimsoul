import { NextResponse } from 'next/server';

export async function middleware(req) {
  const token = req.cookies.get('token')?.value;

  const protectedPaths = ['/dashboard'];

  if (protectedPaths.includes(req.nextUrl.pathname)) {
    if (!token) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  return NextResponse.next();
}


export const config = {
  matcher: ['/dashboard'], 
};
