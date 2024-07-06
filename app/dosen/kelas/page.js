"use client";

import { LayoutDosen } from "@/components/Sidebar_dosen/Layout-Dosen";

const students = [
  { id: 1, name: "Aldo Rizky Ramadhan", npm: 50421106, class: "3IA15" },
  { id: 2, name: "Aura Khalisa Dini Lestari", npm: 50421238, class: "3IA15" },
  { id: 3, name: "Dani Irsyad Maulana", npm: 50421327, class: "3IA15" },
  { id: 4, name: "Faiz Rizki Azmi", npm: 50421454, class: "3IA15" },
  { id: 5, name: "Fikri Fahrozi", npm: 50421518, class: "3IA15" },
  { id: 6, name: "Muhamad Ibnu Khaidar Hafiz", npm: 50421867, class: "3IA15" },
  { id: 7, name: "Nopriansyah", npm: 51421150, class: "3IA15" },
  { id: 8, name: "Reyhan Daffa Dhiaulhaq", npm: 51421289, class: "3IA15" },
  { id: 9, name: "Sahganda Guna Dharma Saragih", npm: 51421378, class: "3IA15"},
];

export default function KelasDosen() {
  return (
    <div>
      <LayoutDosen>
        <div className="p-6 text-black">
          <h1 className="text-2xl font-bold mb-8 ">Kelas 3IA15</h1>
          <table className="w-full bg-white rounded shadow">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-2 px-4">Id</th>
                <th className="py-2 px-4">Nama</th>
                <th className="py-2 px-4">NPM</th>
                <th className="py-2 px-4">Kelas</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id} className="border-t">
                  <td className="py-2 px-4">{student.id}</td>
                  <td className="py-2 px-4">{student.name}</td>
                  <td className="py-2 px-4">{student.npm}</td>
                  <td className="py-2 px-4">{student.class}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LayoutDosen>
    </div>
  );
}
