"use client";

import { LayoutAdmin } from "@/components/Sidebar_admin/Layout-Admin";
import { useSession } from "next-auth/react";
import Head from "next/head";

export default function DashboardAdmin() {
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
      <LayoutAdmin>
        <div className="p-6 text-black">
          <h1 className="text-2xl font-bold mb-8">
            Selamat Datang, di panel {session.user?.username}!
          </h1>
          <div className="bg-white text-black rounded-lg text-center p-8 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">
              Halaman ini adalah Landing Page Dashboard Admin
            </h2>
            <p className="text-lg mb-4">
              Dashboard ini dibuat sebagai pusat kontrol utama untuk
              administrator sistem.
            </p>
            <p className="text-md mb-4">
              Dari sini, Anda dapat mengakses berbagai fitur administratif dan
              memantau aktivitas sistem.
            </p>
            <ul className="text-left list-disc list-inside mb-4">
              <li>Kelola Data Pengguna/User</li>
              <li>Kelola Data Mahasiswa</li>
              <li>Kelola Data Dosen</li>
              <li>Kelola Data Presensi Siswa beserta buktinya</li>
              <li>Kelola Data Registrasi Wajah Siswa beserta buktinya</li>
            </ul>
          </div>
        </div>
      </LayoutAdmin>
    </div>
  );
}
