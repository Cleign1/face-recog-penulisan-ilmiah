import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { uploadBase64ImageToR2 } from '@/lib/r2';
import { v4 as uuidv4 } from 'uuid';

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
    const imageUrl = await uploadBase64ImageToR2(imageData, `absensi_proof/${fileName}`);

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