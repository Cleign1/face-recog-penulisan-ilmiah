"use client";

import { useState } from "react";
import FaceRecognition from "@/components/FaceRecognition";
import { Layout } from "@/components/Sidebar_siswa/Layout";

export default function Presensi() {
  const [registeredFaces, setRegisteredFaces] = useState([]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-pink-100 flex">
      <Layout>
        <div className="flex flex-col items-center justify-center w-full p-6">
          <div className="w-full max-w-4xl bg-white p-8 rounded shadow">
            <div className="flex flex-col items-center mb-8">
              <div className="border border-gray-300 w-3/5 flex items-center justify-center relative">
                <FaceRecognition registeredFaces={registeredFaces} />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
}
