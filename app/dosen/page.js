"use client";
import { LayoutDosen } from "@/components/Sidebar_dosen/Layout-Dosen";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useState, useEffect } from "react";
import { Toaster } from "sonner";
import { toast } from "sonner";

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
      toast.success("Berhasil memuat data");
    } catch (err) {
      setError(err.message);
      toast.error(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
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

  if (error) {
    return <div className="items-center text-center p-96 text-2xl">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen">
      <Toaster richColors/>
      <LayoutDosen>
        <Head>
          <title>Dosen Dashboard</title>
        </Head>
        <div className="p-6 text-black">
          <h1 className="text-2xl font-bold mb-8">
            Selamat Datang, Dosen {session.user?.username}!
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 md:mb-8">
            <div className="flex flex-col items-center rounded-lg p-4 bg-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="text-3xl md:text-4xl mb-2">📅</div>
              <div className="text-lg md:text-xl font-semibold text-gray-700">Tanggal</div>
              <div className="text-xl md:text-2xl mt-2 text-gray-900">{dashboardData?.tanggal || 'N/A'}</div>
            </div>
            <div className="flex flex-col items-center rounded-lg p-4 bg-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="text-3xl md:text-4xl mb-2">🎓</div>
              <div className="text-lg md:text-xl font-semibold text-gray-700">Kelas</div>
              <div className="text-xl md:text-2xl mt-2 text-gray-900">{dashboardData?.kelas || 'N/A'}</div>
            </div>
            <div className="flex flex-col items-center rounded-lg p-4 bg-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="text-3xl md:text-4xl mb-2">👥</div>
              <div className="text-lg md:text-xl font-semibold text-gray-700">Total Siswa</div>
              <div className="text-xl md:text-2xl mt-2 text-gray-900">{dashboardData?.totalSiswa || 0}</div>
            </div>
            <div className="flex flex-col items-center rounded-lg p-4 bg-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="text-3xl md:text-4xl mb-2">✔️</div>
              <div className="text-lg md:text-xl font-semibold text-gray-700">Total Presensi</div>
              <div className="text-xl md:text-2xl mt-2 text-gray-900">{dashboardData?.totalPresensi || 0}</div>
            </div>
          </div>
          {/* You can add a table or list here to display the presensi data if needed */}
        </div>
      </LayoutDosen>
    </div>
  );
}