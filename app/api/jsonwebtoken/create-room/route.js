import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { config } from 'process';

const APP_ID = process.env.NEXT_PUBLIC_JAAS_APP_ID; // Set in .env.local
const PRIVATE_KEY = process.env.NEXT_PUBLIC_JAAS_PRIVATE_KEY.replace(/\\n/g, '\n'); // Set in .env.local
const PUBLIC_KEY = process.env.NEXT_PUBLIC_JAAS_API_KEY


export async function POST(req) {
    
  try {
    const { roomName, userId, displayName, email, isModerator } = await req.json();

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
