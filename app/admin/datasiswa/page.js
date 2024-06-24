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

const DataSiswa = () => {
  return (
    <div className="flex items-center justify-center text-black pt-24">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-4xl">
        <h1 className="text-2xl font-bold mb-4">Kelas 3IA15</h1>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2">Id</th>
              <th className="py-2">Nama</th>
              <th className="py-2">NPM</th>
              <th className="py-2">Kelas</th>
              <th className="py-2">Edit</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} className="border-t">
                <td className="py-2 text-center">{student.id}</td>
                <td className="py-2 text-center">{student.name}</td>
                <td className="py-2 text-center">{student.npm}</td>
                <td className="py-2 text-center">{student.kelas}</td>
                <td className="py-2 text-center">
                  <button className="bg-teal-500 text-white px-4 py-1 rounded hover:bg-teal-600">
                    <Link href='/admin/datasiswa/edit'>
                    Edit
                    </Link>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
