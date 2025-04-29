import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.JWT_SECRET });

  const protectedPaths = ['/dashboard'];

  if (protectedPaths.includes(req.nextUrl.pathname)) {
    if (!token) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  return NextResponse.next();
}
