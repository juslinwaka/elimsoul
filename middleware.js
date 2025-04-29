import { NextResponse } from 'next/server';
import {NextRequest} from 'next/server';
//import {verifyIdToken} from '/lib/firebaseAdmin';

export async function middleware(req) {
  const token = req.cookies.get('token')?.value;

  const protectedPaths = ['/dashboard'];

  if (protectedPaths.includes(req.nextUrl.pathname)) {
    if (!token) {
      return NextResponse.redirect(new URL('/', req.url));
    }
    try {
      awaiverififyIdToken(token);
    }catch (error) {
      return NextResponse/redirect(new URL('/', req.url));
    }
  }

  return NextResponse.next();
}
