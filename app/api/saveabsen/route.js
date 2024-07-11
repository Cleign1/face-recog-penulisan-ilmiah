import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Storage } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';

const storage = new Storage({
  projectId: process.env.PROJECT_ID,
  credentials: {
    client_email: process.env.CLIENT_EMAIL,
    private_key: process.env.PRIVATE_KEY?.split(String.raw`\n`).join("\n"),
    bucket: process.env.BUCKET_NAME
  }
});

const bucket = storage.bucket(process.env.BUCKET_NAME);

async function uploadToGoogleCloudStorage(imageData, fileName) {
  const file = bucket.file(`absensi_proof/${fileName}`);  // Changed folder name to 'absensi_proof'
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
    const { nama, npm ,waktuAbsen, status, imageData } = body;

    if (!(nama && npm && waktuAbsen && status && imageData)) {
      return NextResponse.json({ message: 'Data tidak lengkap!', receivedData: body }, { status: 400 });
    }

    const student = await db.dataSiswa.findUnique({
      where: { npm: npm }
    }); 

    if (!student) {
      return NextResponse.json({ message: 'Siswa tidak ditemukan!', npm: npm }, { status: 404 });
    }

    const currentDate = new Date(waktuAbsen);
    currentDate.setHours(0, 0, 0, 0);

    // Periksa apakah sudah ada presensi untuk siswa ini pada tanggal yang sama
    const existingAttendance = await db.presensi.findFirst({
      where: {
        npm: npm,
        tanggal: {
          gte: currentDate,
          lt: new Date(currentDate.getTime() + 24 * 60 * 60 * 1000), // Hari berikutnya
        },
      },
    });

    if (existingAttendance) {
      return NextResponse.json({
        message: 'Presensi sudah direkam untuk siswa ini pada tanggal ini.',
        existingRecord: existingAttendance
      }, { status: 409 });
    }

    const fileName = `${npm}_${uuidv4()}.jpg`;
    const imageUrl = await uploadToGoogleCloudStorage(imageData, fileName);

    const newAttendance = await db.presensi.create({
      data: {
        nama,
        npm,
        tanggal: currentDate,
        waktuAbsen: new Date(waktuAbsen),
        status,
        imageUrl,
      }
    });

    console.log('Presensi direkam:', newAttendance);
    return NextResponse.json(newAttendance, { status: 201 });
  } catch (error) {
    console.error('Server error:', error);
    if (error.code === 'P2002') {
      return NextResponse.json({
        message: 'Presensi sudah ada untuk siswa ini pada tanggal ini.',
        error: error.message
      }, { status: 409 });
    }
    return NextResponse.json({
      message: 'Server error',
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}