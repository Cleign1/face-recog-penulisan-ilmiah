import { db } from "@/app/lib/db";
import { hash } from "bcrypt";
import { NextResponse } from "next/server";
import * as z from "zod";

const userSchema = z.object({
    username: z
        .string()
        .min(3, { message: "Username minimal 3 karakter!" })
        .max(25, { message: "Username maksimal 25 karakter!" }),
    email: z
        .string()
        .min(3, { message: "Email minimal 3 karakter!" })
        .max(50, { message: "Email maksimal 50 karakter!" })
        .email({ message: "Email tidak valid!" }),
    password: z
        .string()
        .min(6, { message: "Password minimal 6 karakter!" })
        .max(50, { message: "Password maksimal 50 karakter!" }),
    role: z.enum(['admin', 'siswa', 'dosen'])
});

export async function POST(req) {
    try {
        const body = await req.json();
        const { username, email, password, role } = body;

        // Validate role
        const validRoles = ['siswa', 'dosen'];
        if (!validRoles.includes(role)) {
            return NextResponse.json({
                user: null,
                message: 'Role tidak valid!'
            }, { status: 400 });
        }

        // Check for existing user by email
        const existingUserByEmail = await db.User.findUnique({
            where: { email: email }
        });

        if (existingUserByEmail) {
            return NextResponse.json({
                user: null,
                message: 'User dengan email ini sudah ada!'
            }, { status: 409 });
        }

        // Check for existing user by username
        const existingUserByUsername = await db.User.findUnique({
            where: { username: username }
        });

        if (existingUserByUsername) {
            return NextResponse.json({
                user: null,
                message: 'User dengan username ini sudah ada!'
            }, { status: 409 });
        }

        // Hash the password
        const hashPassword = await hash(password, 10);

        // Create the new user with the role
        const newUser = await db.User.create({
            data: {
                username,
                email,
                password: hashPassword,
                role,
                createdAt: new Date()
            }
        });

        const { password: newUserPassword, ...rest } = newUser;

        return NextResponse.json({ user: rest, message: "User berhasil dibuat!" }, { status: 200 });
    } catch (error) {
        console.error("Error creating user:", error);
        return NextResponse.json({
            user: null,
            message: 'Terjadi Kesalahan pada saat membuat user'
        }, { status: 500 });
    }
}
