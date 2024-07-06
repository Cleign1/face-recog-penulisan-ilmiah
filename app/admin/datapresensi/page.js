import { LayoutAdmin } from "@/components/Sidebar_admin/Layout-Admin";
import Link from "next/link";
import React from 'react';

const presensi = [
  { id: 1, name: 'Aldo Rizky', npm: '50421', kelas: '3IA15', waktu: '10.00' },
  { id: 2, name: 'Aldo Rizky', npm: '50421', kelas: '3IA15', waktu: '10.00' },
  { id: 3, name: 'Aldo Rizky', npm: '50421', kelas: '3IA15', waktu: '10.00' },
  { id: 4, name: 'Aldo Rizky', npm: '50421', kelas: '3IA15', waktu: '10.00' },
  { id: 5, name: 'Aldo Rizky', npm: '50421', kelas: '3IA15', waktu: '10.00' },
  { id: 6, name: 'Aldo Rizky', npm: '50421', kelas: '3IA15', waktu: '10.00' },
  { id: 7, name: 'Aldo Rizky', npm: '50421', kelas: '3IA15', waktu: '10.00' },
  { id: 8, name: 'Aldo Rizky', npm: '50421', kelas: '3IA15', waktu: '10.00' },
  { id: 9, name: 'Aldo Rizky', npm: '50421', kelas: '3IA15', waktu: '10.00' },
  { id: 10, name: 'Aldo Rizky', npm: '50421', kelas: '3IA15', waktu: '10.00' },
];

const DataPresensi = () => {
  return (
    <LayoutAdmin>
      <div className="flex flex-col items-center justify-center text-black pt-20">
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-4xl">
          <h1 className="text-2xl font-bold mb-4 text-center">Data Presensi</h1>
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2">Id</th>
                <th className="py-2">Nama</th>
                <th className="py-2">NPM</th>
                <th className="py-2">Kelas</th>
                <th className="py-2">Waktu Absen</th>
              </tr>
            </thead>
            <tbody>
              {presensi.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="py-2 text-center">{item.id}</td>
                  <td className="py-2 text-center">{item.name}</td>
                  <td className="py-2 text-center">{item.npm}</td>
                  <td className="py-2 text-center">{item.kelas}</td>
                  <td className="py-2 text-center">{item.waktu}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="text-center mt-6">
            <button className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600">
                <Link href='/admin/datapresensi/absen'>
                Tambah Absen Manual
                </Link>
            </button>
          </div>
        </div>
      </div>
    </LayoutAdmin>
  );
};

export default DataPresensi;
