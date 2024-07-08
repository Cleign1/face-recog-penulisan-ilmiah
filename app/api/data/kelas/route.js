import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const kelas = searchParams.get('kelas');

    if (!kelas) {
      return NextResponse.json({ error: 'Kelas is required' }, { status: 400 });
    }

    const students = await db.dataSiswa.findMany({
      where: { kelas: '3IA15' },
    });

    if (students.length === 0) {
      return NextResponse.json({ error: 'No students found in this class' }, { status: 404 });
    }

    const response = students.map(student => ({
      npm: student.npm,
      nama: student.nama,
      kelas: student.kelas,
      nomorHp: student.nomorHp,
      alamat: student.alamat,
    }));

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching students data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
