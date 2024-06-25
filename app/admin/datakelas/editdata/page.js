'use client';

import { useState } from "react";
import { LayoutAdmin } from "@/components/Sidebar_admin/Layout-Admin";

export default function EditDataKelas() {
  const [formData, setFormData] = useState({
    npm: "",
    name: "",
    kelas: "",
    alamat: "",
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
    <LayoutAdmin>
      <div className="flex items-center justify-center text-black pt-24">
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center">Edit Data Kelas</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="npm">NPM</label>
              <input
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="text"
                id="npm"
                name="npm"
                value={formData.npm}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="name">Nama</label>
              <input
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="kelas">Kelas</label>
              <input
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="text"
                id="kelas"
                name="kelas"
                value={formData.kelas}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="alamat">Alamat</label>
              <textarea
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                id="alamat"
                name="alamat"
                value={formData.alamat}
                onChange={handleChange}
              ></textarea>
            </div>
            <div className="text-center">
              <button
                className="bg-teal-500 text-white px-6 py-2 rounded-lg hover:bg-teal-600"
                type="submit"
              >
                Simpan
              </button>
            </div>
          </form>
        </div>
      </div>
    </LayoutAdmin>
  );
}
