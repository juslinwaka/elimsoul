const mega = require('megajs');
const { NextResponse } = require('next/server');

exports.POST = async function (req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    return new Promise((resolve) => {
      mega.upload(
        {
          name: file.name,
          email: process.env.MEGA_EMAIL,
          password: process.env.MEGA_PASSWORD,
        },
        buffer,
        (err, uploadedFile) => {
          if (err) {
            console.error('Upload failed:', err);
            resolve(NextResponse.json({ error: err.message }, { status: 500 }));
          } else {
            uploadedFile.link((linkErr, url) => {
              if (linkErr) {
                console.error('Link creation error:', linkErr);
                resolve(NextResponse.json({ error: 'Link generation failed' }, { status: 500 }));
              } else {
                resolve(NextResponse.json({ url }));
              }
            });
          }
        }
      );
    });
  } catch (err) {
    console.error('Mega Upload API Error:', err);
    return NextResponse.json({ error: err.message || 'Upload failed' }, { status: 500 });
  }
};
