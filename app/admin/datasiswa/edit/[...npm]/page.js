'use client';

import React, { useState, useEffect } from 'react';
import { LayoutAdmin } from "@/components/Sidebar_admin/Layout-Admin";
import { useRouter, usePathname } from 'next/navigation';

const EditData = () => {
  const router = useRouter();
  const pathname = usePathname();

  // Extract the npm parameter from the URL path
  const npm = pathname.split('/').pop();

  const [formData, setFormData] = useState({
    npm: '',
    nama: '',
    alamat: '',
    kelas: '',
    nomorHp: ''
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (npm) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const response = await fetch(`/api/siswa/edit?npm=${npm}`);
          if (!response.ok) {
            throw new Error('Data not found');
          }
          const data = await response.json();
          setFormData({
            npm: data.npm,
            nama: data.nama,
            alamat: data.alamat,
            kelas: data.kelas,
            nomorHp: data.nomorHp
          });
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [npm]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/siswa/edit?npm=${npm}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Data berhasil disimpan');
        router.push('/admin/datasiswa');
      } else {
        alert('Gagal menyimpan data');
      }
    } catch (error) {
      alert('Terjadi kesalahan: ' + error.message);
    }
  };

  if (loading) {
    return (
      <LayoutAdmin>
        <div className="flex items-center justify-center text-black pt-16">
          <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
            <h1 className="text-2xl font-bold mb-4 text-center">Loading...</h1>
          </div>
        </div>
      </LayoutAdmin>
    );
  }

  return (
    <LayoutAdmin>
      <div className="flex items-center justify-center text-black pt-16">
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
          <h1 className="text-2xl font-bold mb-4 text-center">Edit Data</h1>
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
                readOnly
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
                Simpan
              </button>
            </div>
          </form>
        </div>
      </div>
    </LayoutAdmin>
  );
};

export default EditData;
