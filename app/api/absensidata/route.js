import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { Storage } from '@google-cloud/storage';

export const dynamic = 'force-dynamic';

const storage = new Storage({
    projectId: process.env.PROJECT_ID,
    credentials: {
      client_email: process.env.CLIENT_EMAIL,
      private_key: process.env.PRIVATE_KEY?.split(String.raw`\n`).join("\n"),
    }
});

const bucketName = process.env.BUCKET_NAME;

export async function GET(req) {
    try {
        const absensi = await db.presensi.findMany();
        return NextResponse.json(absensi, { status: 200 });
    } catch (error) {
        console.error("Error fetching presensi:", error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

// POST: Create new presensi record
export async function POST(req) {
    try {
        const body = await req.json();
        const { npm, status, waktuAbsen, imageData } = body;

        const student = await db.dataSiswa.findUnique({ where: { npm } });
        if (!student) {
            return NextResponse.json({ message: 'Siswa tidak ditemukan' }, { status: 404 });
        }

        let imageUrl = null;
        if (imageData) {
            const fileName = `${npm}_${Date.now()}.jpg`;
            const file = storage.bucket(bucketName).file(`absensi_proof/${fileName}`);
            await file.save(Buffer.from(imageData.split(',')[1], 'base64'), {
                metadata: { contentType: 'image/jpeg' }
            });
            imageUrl = `https://storage.googleapis.com/${bucketName}/absensi_proof/${fileName}`;
        }

        const newPresensi = await db.presensi.create({
            data: {
                npm,
                nama: student.nama,
                status,
                waktuAbsen: new Date(waktuAbsen),
                tanggal: new Date(),
                imageUrl
            }
        });

        return NextResponse.json({ presensi: newPresensi, message: "Data presensi berhasil dibuat!" }, { status: 201 });
    } catch (error) {
        console.error("Error creating presensi:", error);
        return NextResponse.json({ message: 'Terjadi kesalahan saat membuat data presensi' }, { status: 500 });
    }
}

// DELETE: Delete presensi record
export async function DELETE(req) {
    try {
        const { id } = await req.json();

        const presensi = await db.presensi.findUnique({
            where: { id: parseInt(id) },
            select: { imageUrl: true }
        });

        if (!presensi) {
            return NextResponse.json({ error: 'Data presensi tidak ditemukan' }, { status: 404 });
        }

        if (presensi.imageUrl) {
            const fileName = presensi.imageUrl.split('/').pop();
            const file = storage.bucket(bucketName).file(`absensi_proof/${fileName}`);
            try {
                await file.delete();
                console.log(`File ${fileName} deleted from Google Cloud Storage.`);
            } catch (deleteError) {
                console.error('Error deleting file from Google Cloud Storage:', deleteError);
            }
        }

        await db.presensi.delete({
            where: { id: parseInt(id) },
        });

        return NextResponse.json({ message: 'Data presensi berhasil dihapus' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting presensi:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}