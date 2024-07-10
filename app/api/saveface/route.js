import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Storage } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';


const storage = new Storage({
  projectId: "buat-maen2-aja",
  credentials: {
    client_email: process.env.CLIENT_EMAIL,
    private_key: process.env.PRIVATE_KEY?.split(String.raw`\n`).join("\n"),
  }
});

const bucket = storage.bucket("face-recog-ibnu-stoage");

async function uploadToGoogleCloudStorage(imageData, fileName) {
  const file = bucket.file(`registeredface/${fileName}`);
  const stream = file.createWriteStream({
    metadata: {
      contentType: 'image/jpeg',
    },
    predefinedAcl: 'publicRead',
  });

  return new Promise((resolve, reject) => {
    stream.on('error', (err) => {
      reject(err);
    });

    stream.on('finish', async () => {
      // Make the file publicly readable
      await file.makePublic();

      // Get the public URL
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`;
      resolve(publicUrl);
    });

    // Write the base64 image data to the stream
    const buffer = Buffer.from(imageData.split(',')[1], 'base64');
    stream.end(buffer);
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, npm, faceDescriptor, imageData } = body;

    if (!(name && npm && faceDescriptor && imageData)) {
      return NextResponse.json({ message: 'Data Tidak Lengkap!' }, { status: 400 });
    }

    // Generate a unique filename for the image
    const fileName = `${npm}_${uuidv4()}.jpg`;

    // Upload the image to Google Cloud Storage
    const imageUrl = await uploadToGoogleCloudStorage(imageData, fileName);

    // Save or update the face data in the database
    const newFaceData = await db.faceData.upsert({
      where: { npm: npm },
      update: { 
        name, 
        faceDescriptor,
        imageUrl // Add the image URL to the update
      },
      create: { 
        name, 
        npm, 
        faceDescriptor,
        imageUrl // Add the image URL to the create
      },
    });

    return NextResponse.json(newFaceData, { status: 201 });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const faceData = await db.faceData.findMany();
    return NextResponse.json(faceData, { status: 200 });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}