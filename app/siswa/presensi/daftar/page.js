"use client";

import { useState } from "react";
import RegisterFace from "@/components/RegisterFace";
import { Layout } from "@/components/Sidebar_siswa/Layout";
import { useRouter } from "next/navigation";

export default function Daftar() {
  const [registeredFaces, setRegisteredFaces] = useState([]);
  const router = useRouter();

  const handleRegister = (descriptor) => {
    setRegisteredFaces([...registeredFaces, descriptor]);
    localStorage.setItem("registeredFaces", JSON.stringify([...registeredFaces, descriptor]));
    router.push("/siswa/presensi");  // Redirect to presensi page after registration
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-pink-100 flex">
      <Layout>
        <div className="flex flex-col items-center justify-center w-full p-6">
          <div className="w-full max-w-4xl bg-white p-8 rounded shadow">
            <RegisterFace onRegister={handleRegister} />
          </div>
        </div>
      </Layout>
    </div>
  );
}
