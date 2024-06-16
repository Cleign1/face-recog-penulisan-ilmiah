'use client';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link"; 

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();
  useEffect(() => {

    if (status === "loading") return; // Do nothing while loading



    if (session?.user?.role) {

      if (session.user.role === "siswa") {

        router.push("/siswa");

      } else if (session.user.role === "dosen") {

        router.push("/dosen");

      } else if (session.user.role !== "admin") {

        router.push("/");

      }

    } else {

      router.push("/login");
    }
  }, [session, status, router]);
  if (status === "loading") {
    return <div>Loading...</div>; 
  }

  return (
    <main className="flex min-h-screen items-center justify-center pt-20 bg-gradient-to-br from-rose-100 to-sky-200">
      <div className="flex items-center justify-center flex-col space-y-2">
        <Link
          href="/siswa"
          className="border bg-white p-4 rounded-lg border-black"
        >
          go to siswa
        </Link>
        <Link
          href="/dosen"
          className="border bg-white p-4 rounded-lg border-black"
        >
          go to dosen
        </Link>
        <Link
          href="/admin"
          className="border bg-white p-4 rounded-lg border-black"
        >
          {" "}
          go to admin
        </Link>
      </div>
    </main>
  );
}
