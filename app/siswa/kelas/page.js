"use client";

// components/DataSiswa.js
import React, { useState, useEffect } from 'react';
import { Layout } from "@/components/Sidebar_siswa/Layout";
import Link from "next/link";
import { toast } from 'sonner';
import { Toaster } from 'sonner';
import Swal from 'sweetalert2';

const DataSiswa = () => {
  const [students, setStudents] = useState([]);
  const [sortField, setSortField] = useState('npm');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedClass, setSelectedClass] = useState('3IA15');
  const classes = ['3IA15']; // Contoh kelas lain

  const fetchData = async (kelas) => {
    try {
      const response = await fetch(`/api/data/kelas?kelas=${classes}`);
      if (!response.ok) {
        throw new Error('Failed to fetch students');
      }
      const data = await response.json();
      setStudents(data);
      toast.success("Berhasil untuk Refresh");
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchData(selectedClass);
  }, [selectedClass]);

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


  return (
    <div className="flex flex-col items-center justify-center text-black pt-24">
      <Toaster richColors />
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-7xl">
        <h1 className="text-2xl font-bold mb-4">Data Siswa</h1>
        <div className="mb-4">
          <label htmlFor="kelas" className="mr-2">Pilih Kelas:</label>
          <select
            id="kelas"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="p-2 border rounded"
          >
            {classes.map((kelas) => (
              <option key={kelas} value={kelas}>
                {kelas}
              </option>
            ))}
          </select>
        </div>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 cursor-pointer" onClick={() => handleSort('npm')}>NPM</th>
              <th className="py-2 cursor-pointer" onClick={() => handleSort('nama')}>Nama</th>
              <th className="py-2 cursor-pointer" onClick={() => handleSort('kelas')}>Kelas</th>
              <th className="py-2 cursor-pointer" onClick={() => handleSort('nomorHp')}>Nomor Hp</th>
              <th className="py-2 cursor-pointer" onClick={() => handleSort('alamat')}>Alamat</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={student.npm} className="border-t">
                <td className="py-2 text-center">{index + 1}</td>
                <td className="py-2 text-center">{student.nama}</td>
                <td className="py-2 text-center">{student.kelas}</td>
                <td className="py-2 text-center">{student.nomorHp}</td>
                <td className="py-2 text-center">{student.alamat}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4 flex justify-end">
          <a onClick={() => fetchData(selectedClass)} className='pr-3 cursor-pointer'>
            <span className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Refresh Data
            </span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default function DataSiswaPage() {
  return (
    <Layout>
      <DataSiswa />
    </Layout>
  );
}
