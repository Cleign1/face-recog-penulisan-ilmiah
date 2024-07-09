import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const npm = searchParams.get('npm');

    if (!npm) {
      return NextResponse.json({ error: 'NPM is required' }, { status: 400 });
    }

    const user = await db.user.findUnique({
      where: { npm },
      include: {
        dataSiswa: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userData = user.dataSiswa;
    if (!userData) {
      return NextResponse.json({ error: 'User data not found' }, { status: 404 });
    }

    const kelasUser = userData.kelas;

    const totalSiswa = await db.dataSiswa.count({
      where: { kelas: kelasUser },
    });

    const totalPresensi = await db.presensi.count({
      where: {
        npm: {
          in: await db.dataSiswa.findMany({
            where: { kelas: kelasUser },
            select: { npm: true }
          }).then(siswaList => siswaList.map(siswa => siswa.npm))
        }
      }
    });

    const presensiList = await db.presensi.findMany({
      where: {
        npm: {
          in: await db.dataSiswa.findMany({
            where: { kelas: kelasUser },
            select: { npm: true }
          }).then(siswaList => siswaList.map(siswa => siswa.npm))
        }
      },
      orderBy: {
        tanggal: 'desc',
      }
    });

    const response = {
      kelas: userData.kelas,
      totalSiswa: totalSiswa,
      totalPresensi: totalPresensi,
      presensi: presensiList,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
