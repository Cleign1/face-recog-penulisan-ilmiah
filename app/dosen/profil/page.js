"use client";

import { useState, useEffect } from 'react';
import { LayoutDosen } from "@/components/Sidebar_dosen/Layout-Dosen";
import { useSession } from 'next-auth/react';
import { toast, Toaster } from 'sonner';
import { z } from 'zod'; // Import Zod

// Define Zod schema for user data
const UserSchema = z.object({
  nama: z.string().regex(/^[A-Za-z\s]+$/, "Nama harus hanya mengandung huruf").min(1, "Nama is required"),
  kelas: z.string().min(1, "Kelas is required"),
  alamat: z.string().min(1, "Alamat is required"),
  nomorHp: z.string().regex(/^[0-9]+$/, "Nomor HP must contain only numbers").min(10, "Nomor HP must be at least 10 digits"),
});

export default function ProfilDosen() {
  const [userData, setUserData] = useState({
    nidn: '',
    nama: '',
    kelas: '',
    alamat: '',
    nomorHp: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.user?.npm) {
        try {
          setIsLoading(true);
          const response = await fetch(`/api/data?npm=${session.user.npm}`);
          if (!response.ok) {
            throw new Error('Failed to fetch user data');
          }
          const data = await response.json();
          setUserData(data);
        } catch (error) {
          console.error('Error fetching user data:', error);
          toast.error('Gagal mengambil data pengguna');
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchUserData();
  }, [session]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prevData => ({
      ...prevData,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      // Validate data with Zod
      UserSchema.parse(userData);
      
      const response = await fetch('/api/data', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error('Failed to update user data');
      }

      const result = await response.json();
      toast.success('Data berhasil diperbarui');
    } catch (error) {
      console.error('Error updating user data:', error);
      if (error instanceof z.ZodError) {
        // Handle Zod validation errors
        const newErrors = {};
        error.errors.forEach((err) => {
          newErrors[err.path[0]] = err.message;
        });
        setErrors(newErrors);
      } else {
        toast.error('Gagal memperbarui data');
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="items-center text-center p-96 text-2xl">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-pink-100 flex">
      <LayoutDosen>
        <Toaster richColors />
        <div className="flex flex-col items-center justify-center w-full p-6">
          <h1 className="text-4xl font-bold mb-8 text-black">Profil {userData.nama}</h1>
          <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white p-8 rounded shadow">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nidn">
                NIDN
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100"
                id="nidn"
                name="nidn"
                type="text"
                value={userData.npm}
                readOnly
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nama">
                Nama
              </label>
              <input
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.nama ? 'border-red-500' : ''}`}
                id="nama"
                name="nama"
                type="text"
                value={userData.nama}
                onChange={handleInputChange}
              />
              {errors.nama && <p className="text-red-500 text-xs italic">{errors.nama}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="kelas">
                Kelas
              </label>
              <input
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.kelas ? 'border-red-500' : ''}`}
                id="kelas"
                name="kelas"
                type="text"
                value={userData.kelas}
                onChange={handleInputChange}
              />
              {errors.kelas && <p className="text-red-500 text-xs italic">{errors.kelas}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="alamat">
                Alamat
              </label>
              <input
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.alamat ? 'border-red-500' : ''}`}
                id="alamat"
                name="alamat"
                type="text"
                value={userData.alamat}
                onChange={handleInputChange}
              />
              {errors.alamat && <p className="text-red-500 text-xs italic">{errors.alamat}</p>}
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nomorHp">
                Nomor HP
              </label>
              <input
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.nomorHp ? 'border-red-500' : ''}`}
                id="nomorHp"
                name="nomorHp"
                type="text"
                value={userData.nomorHp}
                onChange={handleInputChange}
              />
              {errors.nomorHp && <p className="text-red-500 text-xs italic">{errors.nomorHp}</p>}
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
                disabled={isSaving}
              >
                {isSaving ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
            <div>
              <h1 className='text-black pt-5 text-center'>Jika hanya NIDN yang muncul, hubungi admin.</h1>
            </div>
          </form>
        </div>
      </LayoutDosen>
    </div>
  );
}