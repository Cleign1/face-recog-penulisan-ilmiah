import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// Add this line to force the route to be dynamic
export const dynamic = 'force-dynamic';

export async function GET(request) {
    try {
        const faceData = await db.faceData.findMany({
            select: {
                npm: true,
                name: true,
                imageUrl: true,
                createdAt: true,
                updatedAt: true
            }
        });
        const response = faceData.map(face => ({
            npm: face.npm,
            nama: face.name,
            imageUrl: face.imageUrl,
            createdAt: face.createdAt.toISOString(),
            updatedAt: face.updatedAt.toISOString()
        }));
        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        console.error("Error fetching face data:", error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const { npm } = await request.json();

        if (!npm) {
            return NextResponse.json({ error: "NPM tidak disertakan" }, { status: 400 });
        }

        const existingFaceData = await db.faceData.findUnique({
            where: { npm },
        });

        if (!existingFaceData) {
            return NextResponse.json({ error: "Data wajah tidak ditemukan" }, { status: 404 });
        }

        await db.faceData.delete({
            where: { npm },
        });

        return NextResponse.json({ message: "Data wajah berhasil dihapus" });
    } catch (error) {
        console.error("Error deleting face data:", error);
        return NextResponse.json({ error: "Gagal menghapus data wajah: " + error.message }, { status: 500 });
    }
}