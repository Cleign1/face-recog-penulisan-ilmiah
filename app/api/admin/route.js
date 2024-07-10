import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// API untuk mendapatkan data wajah (GET)
export async function GET(req) {
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

        const response = faceData.map(face => {
            const createdAt = new Date(face.createdAt);
            createdAt.setUTCHours(createdAt.getUTCHours());
            
            const updatedAt = new Date(face.updatedAt);
            updatedAt.setUTCHours(updatedAt.getUTCHours());

            return {
                npm: face.npm,
                nama: face.name,
                imageUrl: face.imageUrl,
                tanggalCreatedAt: createdAt.toISOString().split('T')[0],
                waktuCreatedAt: createdAt.toTimeString().split(' ')[0],
                tanggalUpdatedAt: updatedAt.toISOString().split("T")[0],
                waktuUpdatedAt: updatedAt.toTimeString().split(" ")[0],

            };
        });
        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        console.error("Error fetching face data:", error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
