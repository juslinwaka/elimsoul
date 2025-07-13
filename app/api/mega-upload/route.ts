import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { uploadCb } from 'megajs';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file: File | null = formData.get('file') as unknown as File;

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new Promise((resolve) => {
      upload(
        {
          name: file.name,
          email: process.env.MEGA_EMAIL!,
          password: process.env.MEGA_PASSWORD!,
        },
        buffer,
        (err: any, megaFile: any) => {
          if (err) return resolve(NextResponse.json({ error: err.message }, { status: 500 }));
          resolve(NextResponse.json({ url: megaFile.downloadLink }));
        }
      );
    });
  } catch (err) {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
function upload(arg0: { name: string; email: string; password: string; }, buffer: Buffer<ArrayBuffer>, arg2: (err: any, megaFile: any) => void) {
    throw new Error('Function not implemented.');
}

