"use client";

import { useState, useEffect } from 'react';
import { Layout } from "@/components/Sidebar_siswa/Layout";
import { useSession } from 'next-auth/react';
import Swal from 'sweetalert2';

export default function Profil() {
  const [userData, setUserData] = useState({
    npm: '',
    nama: '',
    alamat: '',
    kelas: '',
    nomorHp: ''
  });
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
          // toast.error('Gagal mengambil data pengguna');
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const response = await fetch('/api/data', {
        method: userData.npm ? 'PUT' : 'POST', // Gunakan PUT jika data ada, POST jika data baru
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
  
      if (!response.ok) {
        throw new Error('Failed to save user data');
      }
  
        const result = await response.json();
        // console.log('Data updated successfully:', result);
        // toast.success('Data berhasil diperbarui');
        Swal.fire({
          title: "Berhasil",
          text: "Berhasil Memperbaharui data",
          icon: "success",
        })
      } catch (error) {
        console.error('Error updating user data:', error);
        // toast.error('Gagal memperbarui data');
      } finally {
        setIsSaving(false);
      }
    };

  if (isLoading) {
    return <div className="items-center text-center p-96 text-2xl">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-pink-100 flex">
      <Layout>
        <div className="flex flex-col items-center justify-center w-full p-6">
          <h1 className="text-4xl font-bold mb-8 text-black">Profil {userData.nama}</h1>
          <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white p-8 rounded shadow">
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="npm"
              >
                NPM
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100"
                id="npm"
                name="npm"
                type="text"
                value={session.user?.npm}
                readOnly
              />
            </div>
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
                name="nama"
                type="text"
                value={userData.nama}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="alamat"
              >
                Alamat
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="alamat"
                name="alamat"
                type="text"
                value={userData.alamat}
                onChange={handleInputChange}
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
                name="kelas"
                type="text"
                value={userData.kelas}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="nomorHp"
              >
                Nomor HP
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="nomorHp"
                name="nomorHp"
                type="text"
                value={userData.nomorHp}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
              >
                Daftar Wajah
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
                disabled={isSaving}
              >
                {isSaving ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          <div>
            <h1 className='text-black text-center pt-5'>Jika Data yang muncul hanya NPM, Hubungi Admin</h1>
          </div>
          </form>
        </div>
      </Layout>
    </div>
  );
}