"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FaceRecognition from "@/components/FaceRecognition";
import { Layout } from "@/components/Sidebar_siswa/Layout";

export default function Presensi() {
  const [registeredFaces, setRegisteredFaces] = useState([]);
  const router = useRouter();

  const handleRegisterClick = () => {
    router.push("/siswa/presensi/daftar");
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-pink-100 flex">
      <Layout>
        <div className="flex flex-col items-center justify-center w-full p-6">
          <div className="w-full max-w-4xl bg-white p-8 rounded shadow">
            <div className="flex flex-col items-center mb-8">
              <div className="border border-gray-300 w-3/5 flex items-center justify-center relative">
                <FaceRecognition registeredFaces={registeredFaces} />
              </div>
              <h1 className="text-black pt-5">
                Tidak ada wajah yang terdeteksi ?, daftar menggunakan tombol dibawah
              </h1>
              <button
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded shadow"
                onClick={handleRegisterClick}
              >
                Register Face
              </button>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
}
