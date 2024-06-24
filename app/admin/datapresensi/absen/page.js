"use client";

import { useState } from "react";
import { LayoutAdmin } from "@/components/Sidebar_admin/Layout-Admin";

export default function TambahPresensiManual() {
  const [formData, setFormData] = useState({
    name: "",
    class: "",
    npm: "",
    status: "Masuk", // default value
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData); // Handle form submission logic here
  };

  return (
    <div>
      <LayoutAdmin>
        <div className="flex items-center justify-center text-black pt-32">
          <form onSubmit={handleSubmit} className="bg-gray-100 p-8 rounded shadow-md w-full max-w-md">
            <h1 className="text-2xl font-bold mb-6 text-center">Tambah Presensi Manual</h1>
            <div className="mb-4">
              <label className="block text-gray-700">Nama</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Kelas</label>
              <input
                type="text"
                name="class"
                value={formData.class}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">NPM</label>
              <input
                type="text"
                name="npm"
                value={formData.npm}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded"
              >
                <option value="Masuk">Masuk</option>
                <option value="Absen">Absen</option>
                <option value="Sakit">Sakit</option>
              </select>
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Simpan
              </button>
            </div>
          </form>
        </div>
      </LayoutAdmin>
    </div>
  );
}
