"use client";

import { LayoutDosen } from "@/components/Sidebar_dosen/Layout-Dosen";
import { Table } from "@/components/ui/table";
import Link from "next/link";

const attendanceData = [
  { id: 1, name: "Aldo Rizky", npm: 50421, class: "3IA15", time: "10.00" },
  { id: 1, name: "Aldo Rizky", npm: 50421, class: "3IA15", time: "10.00" },
  { id: 1, name: "Aldo Rizky", npm: 50421, class: "3IA15", time: "10.00" },
  { id: 1, name: "Aldo Rizky", npm: 50421, class: "3IA15", time: "10.00" },
  { id: 1, name: "Aldo Rizky", npm: 50421, class: "3IA15", time: "10.00" },
  { id: 1, name: "Aldo Rizky", npm: 50421, class: "3IA15", time: "10.00" },
  { id: 1, name: "Aldo Rizky", npm: 50421, class: "3IA15", time: "10.00" },
  { id: 1, name: "Aldo Rizky", npm: 50421, class: "3IA15", time: "10.00" },
  { id: 1, name: "Aldo Rizky", npm: 50421, class: "3IA15", time: "10.00" },
];

export default function DataPresensi() {
  return (
    <div>
      <LayoutDosen>
        <div className="p-6 text-black">
          <h1 className="text-2xl font-bold mb-8 text-black">Data Presensi</h1>
          <Table className="text-lg">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-2 px-4">Id</th>
                <th className="py-2 px-4">Nama</th>
                <th className="py-2 px-4">NPM</th>
                <th className="py-2 px-4">Kelas</th>
                <th className="py-2 px-4">Waktu Absen</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.map((entry, index) => (
                <tr key={index} className="border-t">
                  <td className="py-2 px-4">{entry.id}</td>
                  <td className="py-2 px-4">{entry.name}</td>
                  <td className="py-2 px-4">{entry.npm}</td>
                  <td className="py-2 px-4">{entry.class}</td>
                  <td className="py-2 px-4">{entry.time}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <div className="mt-6">
            <button className="bg-gray-300 px-4 py-2 rounded">
              <Link href='/dosen/datapresensi/absen'>
              Tambah Absen Manual
              </Link>
              </button>
          </div>
        </div>
      </LayoutDosen>
    </div>
  );
}
