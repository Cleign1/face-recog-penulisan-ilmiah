import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between pt-20 bg-gradient-to-br from-rose-100 to-sky-200">
      <Link
        href="/siswa"
        className="border bg-white p-4 rounded-lg border-black">
        go to siswa
      </Link>
    </main>
  );
}
