import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request) {
  try {
    const body = await request.json();
    // console.log('Received attendance data:', body);  // Log received data

    const { nama, npm, waktuAbsen, status } = body;

    // Ensure all required data is present
    if (!(nama && npm && waktuAbsen && status)) {
      return NextResponse.json({ message: 'Data tidak lengkap!', receivedData: body }, { status: 400 });
    }

    // Check if the student exists
    const student = await db.dataSiswa.findUnique({
      where: { npm: npm }
    });

    if (!student) {
      return NextResponse.json({ message: 'Siswa tidak ditemukan!', npm: npm }, { status: 404 });
    }

    // Save attendance data to the database
    const newAttendance = await db.presensi.create({
      data: {
        nama,
        npm,
        waktuAbsen: new Date(waktuAbsen),
        status,
      }
    });

    console.log('Presensi direkam:', newAttendance);  // Catat presensi berhasil
    return NextResponse.json(newAttendance, { status: 201 });
  } catch (error) {
    console.error('Server error:', error);
    
    // Check for unique constraint violation
    if (error.code === 'P2002') {
      return NextResponse.json({ 
        message: 'Presensi sudah direkam untuk siswa ini hari ini.',
        error: error.message
      }, { status: 409 });
    }

    return NextResponse.json({ 
      message: 'Server error', 
      error: error.message,
      stack: error.stack  // Include stack trace for debugging
    }, { status: 500 });
  }
}