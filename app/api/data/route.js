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
        dataDosen: true,
      },
    });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    const userData = user.dataSiswa || user.dataDosen;

    // Check for registered faces
    const faceData = await db.faceData.findMany({
      where: { npm: user.npm },
    });

    let faceRegistrationStatus;
    if (faceData.length === 0) {
      faceRegistrationStatus = "Wajah belum terdaftar";
    } else {
      faceRegistrationStatus = "Wajah sudah terdaftar";
    }

    const response = {
      npm: user.npm,
      username: user.username,
      nama: userData.nama,
      kelas: userData.kelas,
      nomorHp: userData.nomorHp,
      alamat: userData.alamat,
      faceRegistrationStatus: faceRegistrationStatus,
    };
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


export async function PUT(request) {
  try {
    const body = await request.json();
    const { npm, nama, kelas, nomorHp, alamat } = body;

    if (!npm) {
      return NextResponse.json({ error: 'NPM is required' }, { status: 400 });
    }

    const user = await db.user.findUnique({
      where: { npm },
      include: {
        dataSiswa: true,
        dataDosen: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    let updatedUser;

    if (user.dataSiswa) {
      updatedUser = await db.dataSiswa.update({
        where: { npm },
        data: {
          nama,
          kelas,
          nomorHp,
          alamat,
        },
      });
    } else if (user.dataDosen) {
      updatedUser = await db.dataDosen.update({
        where: { nidn: npm }, // Assuming NIDN is stored in NPM field for dosen
        data: {
          nama,
          kelas,
          nomorHp,
          alamat,
        },
      });
    }

    return NextResponse.json({
      message: 'User data updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Error updating user data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { npm, nama, kelas, nomorHp, alamat } = body;

    if (!npm) {
      return NextResponse.json({ error: 'NPM is required' }, { status: 400 });
    }

    const userExists = await db.user.findUnique({
      where: { npm },
      include: {
        dataSiswa: true,
        dataDosen: true,
      },
    });

    if (userExists) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const newUser = await db.dataSiswa.create({
      data: {
        npm,
        nama,
        kelas,
        nomorHp,
        alamat,
      },
    });

    return NextResponse.json({
      message: 'User data added successfully',
      user: newUser,
    });
  } catch (error) {
    console.error('Error adding user data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
