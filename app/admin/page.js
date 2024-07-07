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
          <h1 className="text-2xl font-bold mb-8 ">
            Selamat Datang, di panel {session.user?.username}!
          </h1>
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="flex flex-col items-center p-4 bg-gray-100 rounded shadow">
              <div className="text-4xl mb-2">🎓</div>
              <div className="text-xl font-semibold">Kelas</div>
              <div className="text-2xl mt-2">1</div>
            </div>
            <div className="flex flex-col items-center p-4 bg-gray-100 rounded shadow">
              <div className="text-4xl mb-2">👥</div>
              <div className="text-xl font-semibold">Total Siswa</div>
              <div className="text-2xl mt-2">32</div>
            </div>
            <div className="flex flex-col items-center p-4 bg-gray-100 rounded shadow">
              <div className="text-4xl mb-2">👥</div>
              <div className="text-xl font-semibold">Total Dosen</div>
              <div className="text-2xl mt-2">32</div>
            </div>
            <div className="flex flex-col items-center p-4 bg-gray-100 rounded shadow">
              <div className="text-4xl mb-2">👥</div>
              <div className="text-xl font-semibold">Total Wajah</div>
              <div className="text-2xl mt-2">25</div>
            </div>
          </div>
        </div>
      </LayoutAdmin>
    </div>
  );
}
