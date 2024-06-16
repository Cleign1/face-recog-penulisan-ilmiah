'use client';

import { Layout } from "@/components/Sidebar_siswa/Layout";
import { useSession } from "next-auth/react";

export default function Dashboard() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated") {
    return <div>Not authenticated</div>;
  }

  return (
    <div>
      <Layout>
        <div className="p-6">
          <h1 className="text-black text-2xl">Selamat datang {session.user?.username} !</h1>

        </div>
      </Layout>
    </div>
  );
}
