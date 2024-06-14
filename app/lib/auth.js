import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/app/lib/prisma";


export const authOptions = {
    adapter: PrismaAdapter(prisma),
    pages: {
      signIn: '/login'
    },
    providers: [
      CredentialsProvider({
        name: "credentials",
        credentials: {
          username: { label: "username", type: "text" },
          password: { label: "Password", type: "password" },
        },
        // Stopped at 37:40
        // https://youtu.be/bicCg4GxOP8?t=2260
        async authorize(credentials) {
            if(!credentials?.username || !credentials?.password) {
                return null;
            }

            const existingUser = await prisma.user.findUnique({
                where: { username: credentials?.username },
            })
        },
      }),
    ],
    debug: process.env.NODE_ENV === "development",
    session: { stragegy: "jwt" },
    secret: "secret"
  };