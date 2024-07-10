import { NextResponse } from 'next/server';
import { db } from '@/lib/db'; // Pastikan path ini benar sesuai dengan lokasi file db.js Anda

export async function POST(request) {
  try {
    const body = await request.json();
    const { nama, npm, kelas, nomorHp, alamat } = body;

    // Memastikan semua data yang diperlukan ada
    if (!(nama && npm && kelas && nomorHp && alamat)) {
      return NextResponse.json({ message: 'Data tidak lengkap!' }, { status: 400 });
    }

    // Mencoba membuat data siswa baru
    const newStudent = await db.dataSiswa.create({
      data: {
        nama,
        npm,
        kelas,
        nomorHp,
        alamat,
        image_url
      }
    });

    return NextResponse.json(newStudent, { status: 201 });
  } catch (error) {
    // Menangani error yang mungkin terjadi, seperti NPM yang sudah terdaftar
    if (error.code === 'P2002') {
      return NextResponse.json({ message: 'NPM sudah terdaftar.' }, { status: 409 });
    }
    return NextResponse.json({ message: 'Server error, tambahkan data user terlebih dahulu' }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Mengambil semua data siswa
    const students = await db.dataSiswa.findMany();
    return NextResponse.json(students, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { npm } = await request.json();

    // Memastikan NPM ada
    if (!npm) {
      return NextResponse.json({ message: 'NPM tidak disertakan!' }, { status: 400 });
    }

    // Menghapus data siswa berdasarkan NPM
    await db.dataSiswa.delete({
      where: { npm: npm },
    });

    return NextResponse.json({ message: 'Data siswa berhasil dihapus.' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}
