import { NextResponse } from 'next/server';
import { verifyIdToken } from '@/lib/firebase-admin';
import { serialize } from 'cookie';

export async function POST(req) {
  const { token } = await req.json();

  try {
    const decodedToken = await verifyIdToken(token);

    const cookie = serialize('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 5, // 5 days
    });

    const res = NextResponse.json({ message: 'Token set', uid: decodedToken.uid });
    res.headers.set('Set-Cookie', cookie);
    return res;
  } catch (error) {
    console.error('Token verification failed:', error);
    return NextResponse.json({ message: 'Invalid or expired token' }, { status: 401 });
  }
}
