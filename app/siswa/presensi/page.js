"use client";

import { useRef } from "react";
import Webcam from "react-webcam";
import { Layout } from "@/components/Sidebar_siswa/Layout";

export default function Presensi() {
  const webcamRef = useRef(null);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-pink-100 flex">
      <Layout>
        <div className="flex flex-col items-center justify-center w-full p-6">
          <div className="w-full max-w-4xl bg-white p-8 rounded shadow">
            <div className="flex flex-col items-center mb-8">
              <div className="border border-gray-300 w-3/5 flex items-center justify-center">
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <form className="w-full max-w-md mx-auto">
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="nama"
                >
                  Nama
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="nama"
                  type="text"
                  placeholder="Nama"
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="npm"
                >
                  NPM
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="npm"
                  type="text"
                  placeholder="NPM"
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="kelas"
                >
                  Kelas
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="kelas"
                  type="text"
                  placeholder="Kelas"
                />
              </div>
              <div className="flex items-center justify-center">
                <button
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="button"
                >
                  Kembali
                </button>
              </div>
            </form>
          </div>
        </div>
      </Layout>
    </div>
  );
}