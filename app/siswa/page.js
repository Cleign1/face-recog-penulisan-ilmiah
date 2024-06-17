"use client";

import { Layout } from "@/components/Sidebar_siswa/Layout";
import { useSession } from "next-auth/react";
import Head from "next/head";

export default function Dashboard() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="items-center text-center p-96 text-2xl">Loading...</div>;
  }

  if (status === "unauthenticated") {
    return <div className="items-center text-center p-96 text-2xl">Not authenticated</div>;
  }

  return (
    <div>
      <Layout>
      <div className="w-full max-w-4xl p-6 text-black">
          <h1 className="text-2xl font-bold mb-8">
            Selamat Datang, {session.user?.username} !
          </h1>
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="flex flex-col items-center p-4 bg-gray-100 rounded shadow">
              <div className="text-4xl mb-2">🎓</div>
              <div className="text-xl font-semibold">Kelas</div>
              <div className="text-2xl mt-2">####</div>
            </div>
            <div className="flex flex-col items-center p-4 bg-gray-100 rounded shadow">
              <div className="text-4xl mb-2">👥</div>
              <div className="text-xl font-semibold">Siswa</div>
              <div className="text-2xl mt-2">##</div>
            </div>
            <div className="flex flex-col items-center p-4 bg-gray-100 rounded shadow">
              <div className="text-4xl mb-2">✔️</div>
              <div className="text-xl font-semibold">Total Presensi</div>
              <div className="text-2xl mt-2">##</div>
            </div>
          </div>

          <table className="w-full bg-white rounded shadow">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-2 px-4">Tanggal</th>
                <th className="py-2 px-4">Nama</th>
                <th className="py-2 px-4">NPM</th>
                <th className="py-2 px-4">Waktu Presensi</th>
              </tr>
            </thead>
            <tbody>
              {Array(6).fill(0).map((_, index) => (
                <tr key={index} className="border-t">
                  <td className="py-2 px-4">####</td>
                  <td className="py-2 px-4">####</td>
                  <td className="py-2 px-4">####</td>
                  <td className="py-2 px-4">####</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Layout>
    </div>
  );
}
