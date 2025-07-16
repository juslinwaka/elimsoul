// app/api/r2/upload-url/route.ts
import { NextRequest, NextResponse } from 'next/server';
import AWS from 'aws-sdk';

console.log("R2 Endpoint:", process.env.R2_ENDPOINT);
console.log("R2 Bucket:", process.env.R2_BUCKET);

const s3 = new AWS.S3({
  accessKeyId: process.env.R2_ACCESS_KEY!,
  secretAccessKey: process.env.R2_SECRET_KEY!,
  endpoint: process.env.R2_ENDPOINT!,
  region: 'auto',
  signatureVersion: 'v4',
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const filename = searchParams.get('filename');
  if (!filename) return NextResponse.json({ error: "No filename" }, { status: 400 });

  const key = `videos/${Date.now()}-${filename}`;


  // Debug logs
  console.log('R2 Endpoint:', process.env.R2_ENDPOINT);
  console.log('R2 Bucket:', process.env.R2_BUCKET);

  const uploadURL = s3.getSignedUrl('putObject', {
    Bucket: process.env.R2_BUCKET!,
    Key: key,
    Expires: 600,
    ContentType: 'video/mp4',
  });

  console.log('Generated uploadURL:', uploadURL);

  return NextResponse.json({ uploadURL, key });
}
