import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Storage } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';

const storage = new Storage({
  projectId: process.env.PROJECT_ID,
  credentials: {
    client_email: process.env.CLIENT_EMAIL,
    private_key: process.env.PRIVATE_KEY?.split(String.raw`\n`).join("\n"),
  }
});

const bucket = storage.bucket(process.env.BUCKET_NAME);

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
      await file.makePublic();
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`;
      resolve(publicUrl);
    });
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

    // Check if a record already exists
    const existingRecord = await db.faceData.findUnique({
      where: { npm: npm }
    });

    // Generate a unique filename for the image
    const fileName = `${npm}_${uuidv4()}.jpg`;

    // Upload the image to Google Cloud Storage
    const imageUrl = await uploadToGoogleCloudStorage(imageData, fileName);

    // Save or update the face data in the database
    const updatedFaceData = await db.faceData.upsert({
      where: { npm: npm },
      update: {
        name,
        faceDescriptor,
        imageUrl
      },
      create: {
        name,
        npm,
        faceDescriptor,
        imageUrl
      },
    });

    // Prepare the response message
    const message = existingRecord
      ? 'Data wajah berhasil diperbarui'
      : 'Data wajah baru berhasil didaftarkan';

    console.log(`Face data ${existingRecord ? 'updated' : 'created'} for NPM: ${npm}`);

    return NextResponse.json({ message, data: updatedFaceData }, { status: 201 });
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