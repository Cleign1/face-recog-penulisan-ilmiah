"use client";

// components/DataSiswa.js
import React, { useState, useEffect } from 'react';
import { LayoutAdmin } from "@/components/Sidebar_admin/Layout-Admin";
import Link from "next/link";
import { toast } from 'sonner';
import { Toaster } from 'sonner';
import Swal from 'sweetalert2';

const DataSiswa = () => {
  const [students, setStudents] = useState([]);
  const [sortField, setSortField] = useState('id');
  const [sortOrder, setSortOrder] = useState('asc');

  const fetchData = async () => {
    const response = await fetch('/api/siswa');
    const data = await response.json();
    setStudents(data);
    toast.success("Berhasil untuk Refresh");
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSort = (field) => {
    const order = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(order);
    setStudents(students.slice().sort((a, b) => {
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
      const response = await fetch('/api/siswa', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ npm }),
      });
  
      if (response.ok) {
        setStudents(students.filter(student => student.npm !== npm));
        Swal.fire({
          title: "Berhasil",
          text: "Berhasil Menghapus Data",
          icon: "success",
        });
      } else {
        const errorData = await response.json();
        Swal.fire({
          title: "Gagal Menghapus Data",
          text: `Gagal menghapus data: ${errorData.message}`,
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
        <h1 className="text-2xl font-bold mb-4">Data Siswa</h1>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 cursor-pointer" onClick={() => handleSort('npm')}>NPM</th>
              <th className="py-2 cursor-pointer" onClick={() => handleSort('nama')}>Nama</th>
              <th className="py-2 cursor-pointer" onClick={() => handleSort('kelas')}>Kelas</th>
              <th className="py-2 cursor-pointer" onClick={() => handleSort('nomorHp')}>Nomor Hp</th>
              <th className="py-2 cursor-pointer" onClick={() => handleSort('alamat')}>Alamat</th>
              <th className="py-2">Edit</th>
              <th className="py-2">Hapus</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} className="border-t">
                <td className="py-2 text-center">{student.npm}</td>
                <td className="py-2 text-center">{student.nama}</td>
                <td className="py-2 text-center">{student.kelas}</td>
                <td className="py-2 text-center">{student.nomorHp}</td>
                <td className="py-2 text-center">{student.alamat}</td>
                <td className="py-2 text-center">
                  <button className="bg-teal-500 text-white px-4 py-1 rounded hover:bg-teal-600">
                    <Link href={`/admin/datasiswa/edit/${student.npm}`}>
                      Edit
                    </Link>
                  </button>
                </td>
                <td className="py-2 text-center">
                  <button
                    className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-700"
                    onClick={() => handleDelete(student.npm)}
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
          <Link href="/admin/datasiswa/tambah">
            <span className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Tambah Data
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default function DataSiswaAdmin() {
  return (
    <LayoutAdmin>
      <DataSiswa />
    </LayoutAdmin>
  );
}
