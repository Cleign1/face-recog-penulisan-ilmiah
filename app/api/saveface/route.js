import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, npm, faceDescriptor } = body;

    if (!(name && npm && faceDescriptor)) {
      return NextResponse.json({ message: 'Incomplete data!' }, { status: 400 });
    }

    const newFaceData = await db.faceData.upsert({
      where: { npm: npm },
      update: { name, faceDescriptor },
      create: { name, npm, faceDescriptor },
    });

    return NextResponse.json(newFaceData, { status: 201 });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}

export async function GET() {
    try {
      const faceData = await db.faceData.findMany();
      return NextResponse.json(faceData, { status: 200 });
    } catch (error) {
      console.error('Server error:', error);
      return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
    }
  }