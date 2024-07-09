import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const nidn = searchParams.get('nidn');

    if (!nidn) {
      return NextResponse.json({ error: 'NIDN is required' }, { status: 400 });
    }

    const user = await db.user.findUnique({
      where: { npm: nidn },
      include: {
        dataDosen: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userData = user.dataDosen;
    if (!userData) {
      return NextResponse.json({ error: 'User data not found' }, { status: 404 });
    }

    const kelasUser = userData.kelas;
    const today = new Date();

    const totalSiswa = await db.dataSiswa.count({
      where: { kelas: kelasUser },
    });

    const siswaNpmList = await db.dataSiswa.findMany({
        where: { kelas: kelasUser },
        select: { npm: true }
      }).then(siswaList => siswaList.map(siswa => siswa.npm));

    const totalPresensi = await db.presensi.count({
        where: {
          npm: {
            in: siswaNpmList
          }
        }
      });


    const response = {
      tanggal: today.toISOString().split('T')[0],
      kelas: userData.kelas,
      totalSiswa: totalSiswa,
      totalPresensi: totalPresensi,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}