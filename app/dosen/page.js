"use client";

import { LayoutDosen } from "@/components/Sidebar_dosen/Layout-Dosen";
import { useSession } from "next-auth/react";

export default function DashboardDosen() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated") {
    return <div>Not authenticated</div>;
  }
  return (
    <div>
      <LayoutDosen>
        <div className="p-6">
          <h1 className="text-black text-2xl">
            Selamat Datang {session.user?.username} !
          </h1>
          <div className="p-10">
            <h1>tes</h1>
          </div>
        </div>
      </LayoutDosen>
    </div>
  );
}
