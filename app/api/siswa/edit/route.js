import { NextResponse } from 'next/server';
import { db } from '@/lib/db'; // Pastikan path ini benar sesuai dengan lokasi file db.js Anda

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const npm = searchParams.get('npm');

  if (!npm) {
    return NextResponse.json({ message: 'NPM tidak disertakan' }, { status: 400 });
  }

  try {
    const student = await db.dataSiswa.findUnique({
      where: { npm },
    });

    if (!student) {
      return NextResponse.json({ message: 'Data siswa tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json(student, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  const { searchParams } = new URL(request.url);
  const npm = searchParams.get('npm');

  if (!npm) {
    return NextResponse.json({ message: 'NPM tidak disertakan' }, { status: 400 });
  }

  const body = await request.json();

  try {
    const updatedStudent = await db.dataSiswa.update({
      where: { npm },
      data: body,
    });

    return NextResponse.json(updatedStudent, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}
