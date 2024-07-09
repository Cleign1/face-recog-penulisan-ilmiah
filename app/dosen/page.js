"use client";
import { LayoutDosen } from "@/components/Sidebar_dosen/Layout-Dosen";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useState, useEffect } from "react";

export default function DashboardDosen() {
  const { data: session, status } = useSession();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (session?.user?.npm) {
      fetchDashboardData(session.user.npm);
    }
  }, [session]);

  const fetchDashboardData = async (nidn) => {
    try {
      const response = await fetch(`api/dosen/dashboard?nidn=${nidn}`);
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }
      const data = await response.json();
      setDashboardData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return <div className="items-center text-center p-96 text-2xl">Loading...</div>;
  }

  if (status === "unauthenticated") {
    return <div className="items-center text-center p-96 text-2xl">Not authenticated</div>;
  }

  if (error) {
    return <div className="items-center text-center p-96 text-2xl">Error: {error}</div>;
  }

  return (
    <div>
      <LayoutDosen>
        <Head>
          <title>Dosen Dashboard</title>
        </Head>
        <div className="p-6 text-black">
          <h1 className="text-2xl font-bold mb-8">
            Selamat Datang, Dosen {session.user?.username}!
          </h1>
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="flex flex-col items-center p-4 bg-gray-100 rounded shadow">
              <div className="text-4xl mb-2">📅</div>
              <div className="text-xl font-semibold">Tanggal</div>
              <div className="text-2xl mt-2">{dashboardData?.tanggal || 'N/A'}</div>
            </div>
            <div className="flex flex-col items-center p-4 bg-gray-100 rounded shadow">
              <div className="text-4xl mb-2">🎓</div>
              <div className="text-xl font-semibold">Kelas</div>
              <div className="text-2xl mt-2">{dashboardData?.kelas || 'N/A'}</div>
            </div>
            <div className="flex flex-col items-center p-4 bg-gray-100 rounded shadow">
              <div className="text-4xl mb-2">👥</div>
              <div className="text-xl font-semibold">Total Siswa</div>
              <div className="text-2xl mt-2">{dashboardData?.totalSiswa || 0}</div>
            </div>
            <div className="flex flex-col items-center p-4 bg-gray-100 rounded shadow">
              <div className="text-4xl mb-2">✔️</div>
              <div className="text-xl font-semibold">Total Presensi</div>
              <div className="text-2xl mt-2">{dashboardData?.totalPresensi || 0}</div>
            </div>
          </div>
          {/* You can add a table or list here to display the presensi data if needed */}
        </div>
      </LayoutDosen>
    </div>
  );
}