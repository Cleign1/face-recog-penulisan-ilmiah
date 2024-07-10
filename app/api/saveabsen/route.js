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
    const { nama, npm, waktuAbsen, status, imageData } = body;

    // Ensure all required data is present
    if (!(nama && npm && waktuAbsen && status && imageData)) {
      return NextResponse.json({ message: 'Data tidak lengkap!', receivedData: body }, { status: 400 });
    }

    // Check if the student exists
    const student = await db.dataSiswa.findUnique({
      where: { npm: npm }
    });

    if (!student) {
      return NextResponse.json({ message: 'Siswa tidak ditemukan!', npm: npm }, { status: 404 });
    }

    // Get the current date (without time)
    const currentDate = new Date(waktuAbsen);
    currentDate.setHours(0, 0, 0, 0);

    // Check if an attendance record already exists for this student on the current date
    const existingAttendance = await db.presensi.findFirst({
      where: {
        npm: npm,
        tanggal: {
          gte: currentDate,
          lt: new Date(currentDate.getTime() + 24 * 60 * 60 * 1000), // Next day
        },
      },
    });

    if (existingAttendance) {
      return NextResponse.json({
        message: 'Presensi sudah direkam untuk siswa ini hari ini.',
        existingRecord: existingAttendance
      }, { status: 409 });
    }

    // Generate a unique filename for the image
    const fileName = `${npm}_${uuidv4()}.jpg`;

    // Upload the image to Google Cloud Storage
    const imageUrl = await uploadToGoogleCloudStorage(imageData, fileName);

    // Save attendance data to the database
    const newAttendance = await db.presensi.create({
      data: {
        nama,
        npm,
        tanggal: currentDate,
        waktuAbsen: new Date(waktuAbsen),
        status,
        imageUrl, // Add the image URL to the attendance record
      }
    });

    console.log('Presensi direkam:', newAttendance);  // Log successful attendance
    return NextResponse.json(newAttendance, { status: 201 });

  } catch (error) {
    console.error('Server error:', error);
   
    return NextResponse.json({
      message: 'Server error',
      error: error.message,
      stack: error.stack  // Include stack trace for debugging
    }, { status: 500 });
  }
}