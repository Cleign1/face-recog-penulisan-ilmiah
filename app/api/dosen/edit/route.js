// app/api/dosen/edit/route.js
import { NextResponse } from 'next/server';
import { db } from '@/lib/db'; // Ensure this path is correct for your project structure

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const nidn = searchParams.get('nidn');

  if (!nidn) {
    return NextResponse.json({ message: 'NIDN tidak disertakan' }, { status: 400 });
  }

  try {
    const dosen = await db.dataDosen.findUnique({
      where: { nidn },
    });

    if (!dosen) {
      return NextResponse.json({ message: 'Data dosen tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json(dosen, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  const { searchParams } = new URL(request.url);
  const nidn = searchParams.get('nidn');

  if (!nidn) {
    return NextResponse.json({ message: 'NIDN tidak disertakan' }, { status: 400 });
  }

  const body = await request.json();

  try {
    const updatedDosen = await db.dataDosen.update({
      where: { nidn },
      data: body,
    });

    return NextResponse.json(updatedDosen, { status: 200 });
  } catch (error) {
    if (error.code === 'P2025') {
      return NextResponse.json({ message: 'Data dosen tidak ditemukan' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}