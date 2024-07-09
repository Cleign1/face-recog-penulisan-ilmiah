"use client";

import { Layout } from "@/components/Sidebar_siswa/Layout";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [data, setData] = useState({
    kelas: '',
    totalSiswa: 0,
    totalPresensi: 0,
    presensi: []
  });

  useEffect(() => {
    if (status === "authenticated" && session?.user?.npm) {
      const fetchData = async () => {
        try {
          const res = await fetch(`/api/siswa/data?npm=${session.user.npm}`);
          const result = await res.json();
          setData(result);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData();
    }
  }, [status, session]);

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

  const formatDate = (dateString) => {
    return new Date(dateString).toISOString().split('T')[0];
  };
  
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    date.setUTCHours(date.getUTCHours() + 7); // Menambah 7 jam ke waktu UTC
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <div>
      <Layout>
        <Head>
          <title>Student Dashboard</title>
        </Head>
        <div className="w-full max-w-4xl p-6 text-black">
          <h1 className="text-2xl font-bold mb-8">
            Selamat Datang, Siswa {session.user?.username}!
          </h1>
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="flex flex-col items-center p-4 bg-gray-100 rounded shadow">
              <div className="text-4xl mb-2">🎓</div>
              <div className="text-xl font-semibold">Kelas</div>
              <div className="text-2xl mt-2">{data.kelas}</div>
            </div>
            <div className="flex flex-col items-center p-4 bg-gray-100 rounded shadow">
              <div className="text-4xl mb-2">👥</div>
              <div className="text-xl font-semibold">Total Siswa</div>
              <div className="text-2xl mt-2">{data.totalSiswa}</div>
            </div>
            <div className="flex flex-col items-center p-4 bg-gray-100 rounded shadow">
              <div className="text-4xl mb-2">✔️</div>
              <div className="text-xl font-semibold">Total Presensi</div>
              <div className="text-2xl mt-2">{data.totalPresensi}</div>
            </div>
          </div>

          <table className="min-w-full bg-white rounded shadow">
            <thead>
              <tr>
                <th className="py-2 px-4 cursor-pointer" >Tanggal</th>
                <th className="py-2 px-4 cursor-pointer">Nama</th>
                <th className="py-2 px-4 cursor-pointer">NPM</th>
                <th className="py-2 px-4 cursor-pointer">Waktu Presensi</th>
                <th className="py-2 px-4 cursor-pointer">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.presensi &&
                data.presensi.map((entry, index) => (
                  <tr key={index} className="border-t">
                    <td className="py-2 px-4 text-center">{formatDate(entry.tanggal)}</td>
                    <td className="py-2 px-4 text-center">{entry.nama}</td>
                    <td className="py-2 px-4 text-center">{entry.npm}</td>
                    <td className="py-2 px-4 text-center">{formatTime(entry.waktuAbsen)}</td>
                    <td className="py-2 px-4 text-center">{entry.status}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </Layout>
    </div>
  );
}
