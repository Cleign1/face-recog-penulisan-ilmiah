import Link from "next/link";

export default function Home() {
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
