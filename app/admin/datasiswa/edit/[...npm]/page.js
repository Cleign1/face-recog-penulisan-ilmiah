'use client';

import React, { useState, useEffect } from 'react';
import { LayoutAdmin } from "@/components/Sidebar_admin/Layout-Admin";
import { useRouter, usePathname } from 'next/navigation';
import Swal from 'sweetalert2';
import { z } from 'zod';

// Define the schema for form validation
const formSchema = z.object({
  npm: z.string().min(5, "NPM Minimal 5 Digit").max(8, "NPM harus 8 Digit").regex(/^\d+$/, "NPM Harus Angka"),
  nama: z.string().min(1, "Nama Harus Di isi").max(50, "Nama Panjang Maksimal 50 Karakter"),
  alamat: z.string().min(1, "Alamat harus di isi"),
  kelas: z.string().min(1, "Kelas harus di isi").max(5, "Kelas Harus 5 Digit"),
  nomorHp: z.string().min(11, "Nomor HP is required").regex(/^\d+$/, "Nomor HP harus Angka")
});

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
  const [errors, setErrors] = useState({});

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
          Swal.fire({
            title: "Error",
            text: "Failed to fetch data",
            icon: "error"
          });
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
    // Clear the error for this field when the user starts typing
    setErrors((prevErrors) => ({ ...prevErrors, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Validate the form data
      formSchema.parse(formData);

      const response = await fetch(`/api/siswa/edit?npm=${npm}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        Swal.fire({
          title: "Berhasil",
          text: "Data berhasil disimpan",
          icon: "success",
        });
        router.push('/admin/datasiswa');
      } else {
        Swal.fire({
          title: "Gagal",
          text: "Gagal menyimpan data",
          icon: "error"
        });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        // If there are validation errors, update the errors state
        const errorMessages = {};
        error.errors.forEach((err) => {
          errorMessages[err.path[0]] = err.message;
        });
        setErrors(errorMessages);
      } else {
        Swal.fire({
          title: "Terjadi Kesalahan",
          text: error.message,
          icon: "error"
        });
      }
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
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.npm ? 'border-red-500' : ''}`}
                type="text"
                id="npm"
                name="npm"
                value={formData.npm}
                onChange={handleChange}
                readOnly
              />
              {errors.npm && <p className="text-red-500 text-sm mt-1">{errors.npm}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="nama">Nama</label>
              <input
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.nama ? 'border-red-500' : ''}`}
                type="text"
                id="nama"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
              />
              {errors.nama && <p className="text-red-500 text-sm mt-1">{errors.nama}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="alamat">Alamat</label>
              <textarea
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.alamat ? 'border-red-500' : ''}`}
                id="alamat"
                name="alamat"
                value={formData.alamat}
                onChange={handleChange}
              ></textarea>
              {errors.alamat && <p className="text-red-500 text-sm mt-1">{errors.alamat}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="kelas">Kelas</label>
              <input
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.kelas ? 'border-red-500' : ''}`}
                type="text"
                id="kelas"
                name="kelas"
                value={formData.kelas}
                onChange={handleChange}
              />
              {errors.kelas && <p className="text-red-500 text-sm mt-1">{errors.kelas}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="nomorHp">Nomor HP</label>
              <input
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.nomorHp ? 'border-red-500' : ''}`}
                type="text"
                id="nomorHp"
                name="nomorHp"
                value={formData.nomorHp}
                onChange={handleChange}
              />
              {errors.nomorHp && <p className="text-red-500 text-sm mt-1">{errors.nomorHp}</p>}
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