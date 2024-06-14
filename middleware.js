import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // If user is not authenticated and trying to access a protected route, redirect to login
  if (!token) {
    if (pathname !== "/login" && pathname !== "/daftar") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  }

  // Role-based redirection after login
  if (pathname === "/login") {
    if (token.role === "siswa") {
      return NextResponse.redirect(new URL("/siswa", req.url));
    } else if (token.role === "dosen") {
      return NextResponse.redirect(new URL("/dosen", req.url));
    } else if (token.role === "admin") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  }

  // Prevent unauthorized access to specific roles' pages
  if (pathname.startsWith("/siswa") && token.role !== "siswa") {
    return NextResponse.redirect(new URL("/", req.url));
  }
  if (pathname.startsWith("/dosen") && token.role !== "dosen") {
    return NextResponse.redirect(new URL("/", req.url));
  }
  if (pathname.startsWith("/admin") && token.role !== "admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/siswa/:path*", "/dosen/:path*", "/admin/:path*", "/login", "/"],
};
