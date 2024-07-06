import { LayoutAdmin } from "@/components/Sidebar_admin/Layout-Admin";
import Link from "next/link";
import React from 'react';

const students = [
  { id: 1, name: 'Aldo Rizky Ramadhan', npm: '50421106', kelas: '3IA15' },
  { id: 2, name: 'Aura Khalisa Dini Lestari', npm: '50421238', kelas: '3IA15' },
  { id: 3, name: 'Dani Irsyad Maulana', npm: '50421327', kelas: '3IA15' },
  { id: 4, name: 'Faiz Rizki Azmi', npm: '50421454', kelas: '3IA15' },
  { id: 5, name: 'Fikri Fahrozi', npm: '50421518', kelas: '3IA15' },
  { id: 6, name: 'Muhamad Ibnu Khaidar Hafiz', npm: '50421867', kelas: '3IA15' },
  { id: 7, name: 'Nopriansyah', npm: '51421150', kelas: '3IA15' },
  { id: 8, name: 'Reyhan Daffa Dhiaulhaq', npm: '51421289', kelas: '3IA15' },
  { id: 9, name: 'Sahganda Guna Dharma Saragih', npm: '51421378', kelas: '3IA15' },
];

const DataKelas = () => {
  return (
    <LayoutAdmin>
      <div className="flex flex-col items-center justify-center text-black pt-24">
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-4xl">
          <h1 className="text-2xl font-bold mb-4 text-center">Kelas 3IA15</h1>
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2">Id</th>
                <th className="py-2">Nama</th>
                <th className="py-2">NPM</th>
                <th className="py-2">Kelas</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id} className="border-t">
                  <td className="py-2 text-center">{student.id}</td>
                  <td className="py-2 text-center">{student.name}</td>
                  <td className="py-2 text-center">{student.npm}</td>
                  <td className="py-2 text-center">{student.kelas}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="text-center mt-6">
            <button className="bg-gray-300 text-black px-6 py-2 rounded-lg hover:bg-gray-400">
              <Link href='/admin/datakelas/editdata'>
              Edit Data
              </Link>
            </button>
          </div>
        </div>
      </div>
    </LayoutAdmin>
  );
};

export default DataKelas;
