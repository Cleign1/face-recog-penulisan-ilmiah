import { db } from "@/lib/db";
import { NextResponse } from "next/server";

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