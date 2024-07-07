"use client";

import React, { useState } from 'react';
import { LayoutAdmin } from "@/components/Sidebar_admin/Layout-Admin";
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { z } from 'zod';

// Define the schema for form validation
const formSchema = z.object({
  nama: z.string().min(1, "Nama Harus Di isi").max(50, "Nama Panjang Maksimal 50 Karakter"),
  nidn: z.string().min(5, "NIDN Minimal 5 Digit").max(20, "NIDN Maksimal 10 Digit").regex(/^\d+$/, "NIDN harus berupa angka"),
  kelas: z.string().min(1, "Kelas harus di isi").max(5, "Kelas Harus 5 Digit"),
  nomorHp: z.string().min(11, "Nomor HP harus di isi").regex(/^\d+$/, "Nomor HP harus berupa angka"),
  alamat: z.string().min(1, "Alamat harus di isi"),
});

const TambahDataDosen = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nama: '',
    nidn: '',
    kelas: '',
    nomorHp: '',
    alamat: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Validate the form data
      formSchema.parse(formData);
      
      // If validation passes, proceed with form submission
      const response = await fetch('/api/dosen', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        Swal.fire({
          title: "Berhasil",
          text: "Berhasil Menambahkan Data Dosen",
          icon: "success",
        });
        router.push("/admin/datadosen");
      } else {
        Swal.fire({
          title: "Error",
          text: result.message,
          icon: "error",
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
        console.error("An unexpected error occurred:", error);
      }
    }
  };

  return (
    <LayoutAdmin>
      <div className="flex items-center justify-center text-black pt-16">
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
          <h1 className="text-2xl font-bold mb-4 text-center">Tambah Data Dosen</h1>
          <form onSubmit={handleSubmit}>
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
              <label className="block text-gray-700 mb-2" htmlFor="nidn">NIDN</label>
              <input
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.nidn ? 'border-red-500' : ''}`}
                type="text"
                id="nidn"
                name="nidn"
                value={formData.nidn}
                onChange={handleChange}
              />
              {errors.nidn && <p className="text-red-500 text-sm mt-1">{errors.nidn}</p>}
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

export default TambahDataDosen;