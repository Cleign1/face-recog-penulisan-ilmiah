// app/api/dosen/route.js

import { NextResponse } from 'next/server';
import { db } from '@/lib/db'; // Ensure this path is correct for your project structure

export async function POST(request) {
  try {
    const body = await request.json();
    const { nama, nidn, kelas, nomorHp, alamat } = body;

    // Ensure all required data is present
    if (!(nama && nidn && kelas && nomorHp && alamat)) {
      return NextResponse.json({ message: 'Data tidak lengkap!' }, { status: 400 });
    }

    // Attempt to create a new dosen
    const newDosen = await db.dataDosen.create({
      data: {
        nama,
        nidn,
        kelas,
        nomorHp,
        alamat,
      }
    });

    return NextResponse.json(newDosen, { status: 201 });
  } catch (error) {
    // Handle potential errors, such as duplicate nama or nidn
    if (error.code === 'P2002') {
      return NextResponse.json({ message: 'Nama atau NIDN sudah terdaftar.' }, { status: 409 });
    }
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Fetch all dosen data
    const dosens = await db.dataDosen.findMany();
    return NextResponse.json(dosens, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
    try {
      const { nidn } = await request.json();
      // Ensure NIDN is provided
      if (!nidn) {
        return NextResponse.json({ message: 'NIDN tidak disertakan!' }, { status: 400 });
      }
      // Delete dosen data based on NIDN
      await db.dataDosen.delete({
        where: { nidn: nidn },
      });
      return NextResponse.json({ message: 'Data dosen berhasil dihapus.' }, { status: 200 });
    } catch (error) {
      if (error.code === 'P2025') {
        return NextResponse.json({ message: 'Dosen dengan NIDN tersebut tidak ditemukan.' }, { status: 404 });
      }
      return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
    }
}