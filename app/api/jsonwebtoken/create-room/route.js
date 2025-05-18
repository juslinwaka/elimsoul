import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const APP_ID = process.env.NEXT_PUBLIC_JAAS_APP_ID; // Set in .env.local
const PRIVATE_KEY_RAW = process.env.NEXT_PUBLIC_JAAS_PRIVATE_KEY;
const PRIVATE_KEY = PRIVATE_KEY_RAW ? PRIVATE_KEY_RAW.replace(/\\n/g, '\n') : undefined; // Set in .env.local


export async function POST(req) {
  try {
    if (!APP_ID || !PRIVATE_KEY) {
      return NextResponse.json({ error: 'JAAS_APP_ID or JAAS_PRIVATE_KEY environment variable is missing.' }, { status: 500 });
    }
    const { roomName, userId, displayName} = await req.json();

    if (!roomName || !userId || !displayName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const payload = {
      aud: 'jitsi',
      iss: "chat",
      sub: "vpaas-magic-cookie-2353fabe982545eda026650e82946a9d",
      room: roomName,
      exp: Math.floor(Date.now() / 1000) + 24 * 3600, // 1 hour expiration
      context: {
        user: {
          id: userId,
          name: displayName,
          moderator: true
        },
      },
      features: {
        authentication: false,
        "lobby": false, 
        "room-lock": false, 
        
      }
    };
    console.log('JAAS_APP_ID:', APP_ID);
    console.log('JAAS_PRIVATE_KEY:', PRIVATE_KEY);

    const token = jwt.sign(payload, PRIVATE_KEY, {
      algorithm: 'RS256',
      header: {
        kid: 'vpaas-magic-cookie-2353fabe982545eda026650e82946a9d/d043a4-FORTEST', // replace with your key ID if needed
        alg: 'RS256',
        typ: 'JWT',
      },
    });

    return NextResponse.json({ token });
  } catch (error) {
    console.error('JWT generation error:', error);
    return NextResponse.json(
      { error: 'Token generation failed', details: error.message },
      { status: 500 }
    );
  }
}