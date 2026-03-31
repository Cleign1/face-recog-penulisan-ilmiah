import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { deleteObjectFromR2, getObjectKeyFromUrl, uploadBase64ImageToR2 } from "@/lib/r2";

export const dynamic = 'force-dynamic';

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
            imageUrl = await uploadBase64ImageToR2(imageData, `absensi_proof/${fileName}`);
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
            const objectKey = getObjectKeyFromUrl(presensi.imageUrl, "absensi_proof");
            try {
                await deleteObjectFromR2(objectKey);
                console.log(`File ${objectKey} deleted from Cloudflare R2.`);
            } catch (deleteError) {
                console.error('Error deleting file from Cloudflare R2:', deleteError);
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