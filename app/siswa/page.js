"use client";

import { Layout } from "@/components/Sidebar_siswa/Layout";
import { useSession } from "next-auth/react";
import Head from "next/head";


const students = [
  { date: '2023-06-20', name: 'Aldo Rizky Ramadhan', npm: 50421106, class: '3IA15', time: '08:00' },
  { date: '2023-06-20', name: 'Aura Khalisa Dini Lestari', npm: 50421238, class: '3IA15', time: '08:05' },
  { date: '2023-06-20', name: 'Dani Irsyad Maulana', npm: 50421327, class: '3IA15', time: '08:10' },
  // Add more student data as needed
];

export default function Dashboard() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="items-center text-center p-96 text-2xl">Loading...</div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="items-center text-center p-96 text-2xl">
        Not authenticated
      </div>
    );
  }

  return (
    <div>
      <Layout>
        <Head>
          <title>Student Dashboard</title>
        </Head>
        <div className="w-full max-w-4xl p-6 text-black">
          <h1 className="text-2xl font-bold mb-8">
            Selamat Datang, {session.user?.username} !
          </h1>
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="flex flex-col items-center p-4 bg-gray-100 rounded shadow">
              <div className="text-4xl mb-2">🎓</div>
              <div className="text-xl font-semibold">Kelas</div>
              <div className="text-2xl mt-2">3IA15</div>
            </div>
            <div className="flex flex-col items-center p-4 bg-gray-100 rounded shadow">
              <div className="text-4xl mb-2">👥</div>
              <div className="text-xl font-semibold">Total Siswa</div>
              <div className="text-2xl mt-2">30</div>
            </div>
            <div className="flex flex-col items-center p-4 bg-gray-100 rounded shadow">
              <div className="text-4xl mb-2">✔️</div>
              <div className="text-xl font-semibold">Total Presensi</div>
              <div className="text-2xl mt-2">25</div>
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
              {students.map((cls, index) => (
                <tr key={index} className="border-t">
                  <td className="py-2 px-4">{cls.date}</td>
                  <td className="py-2 px-4">{cls.name}</td>
                  <td className="py-2 px-4">{cls.npm}</td>
                  <td className="py-2 px-4">{cls.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Layout>
    </div>
  );
}
