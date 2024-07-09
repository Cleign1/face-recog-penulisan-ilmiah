import { db } from "@/lib/db";
import { hash } from "bcrypt";
import { NextResponse } from "next/server";
import * as z from "zod";

const userSchema = z.object({
    username: z
        .string()
        .min(3, { message: "Username minimal 3 karakter!" })
        .max(25, { message: "Username maksimal 25 karakter!" })
        .regex(/^\S+$/, { message: "Username tidak boleh mengandung spasi!" }), 
    email: z
        .string()
        .min(3, { message: "Email minimal 3 karakter!" })
        .max(50, { message: "Email maksimal 50 karakter!" })
        .email({ message: "Email tidak valid!" }),
    password: z
        .string()
        .min(6, { message: "Password minimal 6 karakter!" })
        .max(50, { message: "Password maksimal 50 karakter!" }),
    role: z.enum(['admin', 'siswa', 'dosen']),
    npm: z
        .string()
        .min(5, { message: "NPM minimal 5 karakter!" })
        .max(20, { message: "NPM maksimal 20 karakter!" })
        .optional()
        .nullable()
});

export async function POST(req) {
    try {
        const body = await req.json();
        const { username, email, password, role, npm } = userSchema.parse(body);

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

        // Check for existing NPM if provided
        if (npm) {
            const existingUserByNPM = await db.User.findUnique({
                where: { npm: npm }
            });
            if (existingUserByNPM) {
                return NextResponse.json({
                    user: null,
                    message: 'User dengan NPM ini sudah ada!'
                }, { status: 409 });
            }
        }

        // Hash the password
        const hashPassword = await hash(password, 10);

        // Create the new user with the role and NPM
        const newUser = await db.User.create({
            data: {
                username,
                email,
                password: hashPassword,
                role,
                npm,
                createdAt: new Date()
            }
        });

        const { password: newUserPassword, ...rest } = newUser;
        return NextResponse.json({ user: rest, message: "User berhasil dibuat!" }, { status: 200 });
    } catch (error) {
        console.error("Error creating user:", error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({
                user: null,
                message: 'Data tidak valid',
                errors: error.errors
            }, { status: 400 });
        }
        return NextResponse.json({
            user: null,
            message: 'Terjadi Kesalahan pada saat membuat user'
        }, { status: 500 });
    }
}

export async function GET(req) {
    try {
        const users = await db.User.findMany({
            where: {
                role: {
                    in: ['siswa', 'dosen'],
                },
            },
            include: {
                dataSiswa: true,
                dataDosen: true,
            },
        });

        const response = users.map(user => {
            const userData = user.dataSiswa || user.dataDosen;
            return {
                npm: user.npm,
                username: user.username,
                email: user.email,
                role: user.role,
                nama: userData ? userData.nama : null,
                kelas: userData ? userData.kelas : null,
                nomorHp: userData ? userData.nomorHp : null,
                alamat: userData ? userData.alamat : null,
                createdAt: user.createdAt,
            };
        });

        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        const { npm } = await req.json();

        const user = await db.User.findUnique({
            where: { npm },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        await db.User.delete({
            where: { npm },
        });

        return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting user:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}