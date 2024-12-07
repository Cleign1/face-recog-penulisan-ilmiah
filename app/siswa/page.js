"use client";

import { Layout } from "@/components/Sidebar_siswa/Layout";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useEffect, useState } from "react";
import { Toaster } from "sonner";
import { toast } from "sonner";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [data, setData] = useState({
    kelas: "",
    totalSiswa: 0,
    totalPresensi: 0,
    presensi: [],
  });

  useEffect(() => {
    if (status === "authenticated" && session?.user?.npm) {
      const fetchData = async () => {
        try {
          const res = await fetch(`/api/siswa/data?npm=${session.user.npm}`);
          const result = await res.json();
          setData(result);
          toast.success("Berhasil memuat data");
        } catch (error) {
          // console.error("Error fetching data:", error);
          toast.error(`Error: ${error.message}`);
        }
      };

      fetchData();
    }
  }, [status, session]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl md:text-2xl text-red-500">Not authenticated</div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    date.setUTCHours(date.getUTCHours() + 7); // Menambah 7 jam ke waktu UTC
    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");
    const seconds = String(date.getUTCSeconds()).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="min-h-screen">
      <Toaster richColors />
      <Layout>
        <Head>
          <title>Student Dashboard</title>
        </Head>
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-black">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-6 md:mb-8">
            Selamat Datang, Siswa {session.user?.username}!
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 md:mb-8">
            <div className="flex flex-col items-center rounded-lg p-4 bg-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="text-3xl md:text-4xl mb-2">🎓</div>
              <div className="text-lg md:text-xl font-semibold text-gray-700">
                Kelas
              </div>
              <div className="text-xl md:text-2xl mt-2 text-gray-900">
                {data.kelas}
              </div>
            </div>
            <div className="flex flex-col items-center rounded-lg p-4 bg-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="text-3xl md:text-4xl mb-2">👥</div>
              <div className="text-lg md:text-xl font-semibold text-gray-700">
                Total Siswa
              </div>
              <div className="text-xl md:text-2xl mt-2 text-gray-900">
                {data.totalSiswa}
              </div>
            </div>
            <div className="flex flex-col items-center rounded-lg p-4 bg-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="text-3xl md:text-4xl mb-2">✔️</div>
              <div className="text-lg md:text-xl font-semibold text-gray-700">
                Total Presensi
              </div>
              <div className="text-xl md:text-2xl mt-2 text-gray-900">
                {data.totalPresensi}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg shadow-">
            <table className="min-w-full bg-white divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr className="text-left">
                  <th className="px-4 py-3 text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                  <th className="px-4 py-3 text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                  <th className="px-4 py-3 text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider">NPM</th>
                  <th className="px-4 py-3 text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider">Waktu Presensi</th>
                  <th className="px-4 py-3 text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.presensi &&
                  data.presensi.map((entry, index) => (
                    <tr key={index} className="hover:bg-gray-100">
                      <td className="px-4 py-3 text-xs md:text-sm text-gray-900">
                        {formatDate(entry.tanggal)}
                      </td>
                      <td className="px-4 py-3 text-xs md:text-sm text-gray-900">{entry.nama}</td>
                      <td className="px-4 py-3 text-xs md:text-sm text-gray-900">{entry.npm}</td>
                      <td className="px-4 py-3 text-xs md:text-sm text-gray-900">
                        {formatTime(entry.waktuAbsen)}
                      </td>
                      <td className="px-4 py-3 text-xs md:text-sm">{entry.status}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </Layout>
    </div>
  );
}
