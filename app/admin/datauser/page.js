"use client";

import React, { useState, useEffect } from 'react';
import { LayoutAdmin } from "@/components/Sidebar_admin/Layout-Admin";
import Link from "next/link";
import { toast } from 'sonner';
import { Toaster } from 'sonner';
import Swal from 'sweetalert2';

const DataUser = () => {
  const [users, setUsers] = useState([]);
  const [sortField, setSortField] = useState('npm');
  const [sortOrder, setSortOrder] = useState('asc');

  const fetchData = async () => {
    const response = await fetch('/api/user');
    const data = await response.json();
    setUsers(data);
    toast.success("Berhasil untuk Refresh");
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSort = (field) => {
    const order = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(order);
    setUsers(users.slice().sort((a, b) => {
      if (a[field] < b[field]) return order === 'asc' ? -1 : 1;
      if (a[field] > b[field]) return order === 'asc' ? 1 : -1;
      return 0;
    }));
  };

  const handleDelete = async (npm) => {
    const result = await Swal.fire({
      title: 'Apakah Anda yakin?',
      text: "Anda tidak akan bisa mengembalikan ini!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal'
    });
  
    if (!result.isConfirmed) return;
  
    try {
      const response = await fetch('/api/user', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ npm }),
      });
  
      if (response.ok) {
        setUsers(users.filter(user => user.npm !== npm));
        Swal.fire({
          title: "Berhasil",
          text: "Berhasil Menghapus Data",
          icon: "success",
        });
      } else {
        const errorData = await response.json();
        Swal.fire({
          title: "Gagal Menghapus Data",
          text: `Gagal menghapus data, Hapus datasiswa/datadosen terlebih dahulu.`,
          icon: "error"
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Gagal",
        text: `Gagal menghapus data: ${error.message}`,
        icon: "error"
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-black pt-24">
      <Toaster richColors />
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-7xl">
        <h1 className="text-2xl font-bold mb-4">Data User</h1>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 cursor-pointer" onClick={() => handleSort('npm')}>NPM/NIDN</th>
              <th className="py-2 cursor-pointer" onClick={() => handleSort('username')}>username</th>
              <th className="py-2 cursor-pointer" onClick={() => handleSort('role')}>Role</th>
              <th className="py-2 cursor-pointer" onClick={() => handleSort('email')}>Email</th>
              <th className="py-2">Hapus</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.npm} className="border-t">
                <td className="py-2 text-center">{user.npm}</td>
                <td className="py-2 text-center">{user.username}</td>
                <td className="py-2 text-center">{user.role}</td>
                <td className="py-2 text-center">{user.email}</td>
                <td className="py-2 text-center">
                  <button
                    className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-700"
                    onClick={() => handleDelete(user.npm)}
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4 flex justify-end">
          <a onClick={fetchData} className='pr-3 cursor-pointer'>
            <span className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Refresh Data
            </span>
          </a>
          <Link href="/daftar">
            <span className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Tambah Data
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default function DataUserAdmin() {
  return (
    <LayoutAdmin>
      <DataUser />
    </LayoutAdmin>
  );
}
