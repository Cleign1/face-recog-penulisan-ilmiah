"use client";

// pages/admin/datasiswa/tambahdata.js
import React, { useState } from 'react';
import { LayoutAdmin } from "@/components/Sidebar_admin/Layout-Admin";
import { useRouter } from 'next/navigation';


const TambahData = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    npm: '',
    nama: '',
    alamat: '',
    kelas: '',
    nomorHp: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('/api/siswa', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const result = await response.json();
    if (response.ok) {
      alert('Data siswa berhasil ditambahkan!');
      // Optionally redirect or clear form
      router.push("/admin/datasiswa");
    } else {
      alert(`Error: ${result.message}`);
    }
  };

  return (
    <LayoutAdmin>
      <div className="flex items-center justify-center text-black pt-16">
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
          <h1 className="text-2xl font-bold mb-4 text-center">Tambah Data</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="npm">NPM</label>
              <input
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="text"
                id="npm"
                name="npm"
                value={formData.npm}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="nama">Nama</label>
              <input
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="text"
                id="nama"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="alamat">Alamat</label>
              <textarea
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                id="alamat"
                name="alamat"
                value={formData.alamat}
                onChange={handleChange}
              ></textarea>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="kelas">Kelas</label>
              <input
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="text"
                id="kelas"
                name="kelas"
                value={formData.kelas}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="nomorHp">Nomor HP</label>
              <input
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="text"
                id="nomorHp"
                name="nomorHp"
                value={formData.nomorHp}
                onChange={handleChange}
              />
            </div>
            <div className="text-center">
              <button
                className="bg-teal-500 text-white px-6 py-2 rounded-lg hover:bg-teal-600"
                type="submit"
              >
                Tambah
              </button>
            </div>
          </form>
        </div>
      </div>
    </LayoutAdmin>
  );
};

export default TambahData;
