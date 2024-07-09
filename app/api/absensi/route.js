import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod";

// API untuk membuat data absensi (POST)
export async function POST(req) {
    try {
        const body = await req.json();
        const { nama, npm, status, waktuAbsen } = body;

        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set ke awal hari

        // Cek apakah sudah ada absensi hari ini untuk NPM yang sama
        const existingAbsensi = await db.presensi.findFirst({
            where: {
                npm: npm,
                tanggal: {
                    gte: today,
                },
            },
        });

        if (existingAbsensi) {
            return NextResponse.json({
                presensi: null,
                message: 'Data absensi dengan NPM ini sudah ada untuk hari ini!'
            }, { status: 409 });
        }

        // Buat data absensi baru
        const newAbsensi = await db.presensi.create({
            data: {
                nama,
                npm,
                status,
                waktuAbsen: waktuAbsen ? new Date(waktuAbsen) : null,
                tanggal: new Date()
            }
        });

        return NextResponse.json({ presensi: newAbsensi, message: "Data absensi berhasil dibuat!" }, { status: 200 });
    } catch (error) {
        console.error("Error creating presensi:", error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({
                presensi: null,
                message: 'Data tidak valid',
                errors: error.errors
            }, { status: 400 });
        }
        return NextResponse.json({
            presensi: null,
            message: 'Terjadi kesalahan saat membuat data absensi, cek apakah Datasiswa sudah ada'
        }, { status: 500 });
    }
}

// API untuk mendapatkan data absensi (GET)
export async function GET(req) {
    try {
        const absensi = await db.presensi.findMany();

        return NextResponse.json(absensi, { status: 200 });
    } catch (error) {
        console.error("Error fetching presensi:", error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

// API untuk menghapus data absensi (DELETE)
export async function DELETE(req) {
    try {
        const { npm } = await req.json();

        const absensi = await db.presensi.findUnique({
            where: { npm },
        });

        if (!absensi) {
            return NextResponse.json({ error: 'Data absensi tidak ditemukan' }, { status: 404 });
        }

        await db.presensi.delete({
            where: { npm },
        });

        return NextResponse.json({ message: 'Data absensi berhasil dihapus' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting presensi:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
