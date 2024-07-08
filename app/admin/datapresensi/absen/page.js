"use client";

import { useState } from "react";
import { LayoutAdmin } from "@/components/Sidebar_admin/Layout-Admin";
import { toast } from 'sonner';
import { Toaster } from 'sonner';
import { useRouter } from "next/navigation";
import { z } from "zod";

// Schema validasi untuk data absensi
const absensiSchema = z.object({
    nama: z
        .string()
        .min(3, { message: "Nama minimal 3 karakter!" })
        .max(50, { message: "Nama maksimal 50 karakter!" }),
    npm: z
        .string()
        .min(5, { message: "NPM minimal 5 karakter!" })
        .max(8, { message: "NPM maksimal 8 karakter!" })
        .regex(/^\d+$/, { message: "NPM harus berupa angka!" }), 
    status: z
        .enum(['Izin', 'Alfa', 'Sakit']),
});

export default function TambahPresensiManual() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nama: "",
    npm: "",
    status: "Izin", // Default value
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      ...formData,
      waktuAbsen: new Date().toISOString(),
    };

    try {
      // Validasi menggunakan zod
      absensiSchema.parse(data);

      const response = await fetch(`/api/absensi`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add presensi');
      }

      const result = await response.json();
      toast.success(result.message);
      router.push("/admin/datapresensi");
      
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(`Validation Error: ${error.errors.map(err => err.message).join(', ')}`);
      } else {
        toast.error(`Error: ${error.message}`);
      }
    }
  };

  return (
    <div>
      <LayoutAdmin>
        <Toaster richColors />
        <div className="flex items-center justify-center text-black pt-32">
          <form onSubmit={handleSubmit} className="bg-gray-100 p-8 rounded shadow-md w-full max-w-md">
            <h1 className="text-2xl font-bold mb-6 text-center">Tambah Presensi Manual</h1>
            <div className="mb-4">
              <label className="block text-gray-700">Nama</label>
              <input
                type="text"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded"
                required
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
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded"
                required
              >
                <option value="Izin">Izin</option>
                <option value="Alfa">Alfa</option>
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
