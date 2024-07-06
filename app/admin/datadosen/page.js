import { LayoutAdmin } from "@/components/Sidebar_admin/Layout-Admin";
import Link from "next/link";
import React from 'react';

const lecturers = [
  { id: 1, name: 'Ary Bima Kurniawan' }
];

const DataDosen = () => {
  return (
    <LayoutAdmin>
      <div className="flex items-center justify-center text-black pt-24">
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-4xl">
          <h1 className="text-2xl font-bold mb-4">Data Dosen</h1>
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2">Id</th>
                <th className="py-2">Nama Dosen</th>
                <th className="py-2">Edit</th>
              </tr>
            </thead>
            <tbody>
              {lecturers.map((lecturer) => (
                <tr key={lecturer.id} className="border-t">
                  <td className="py-2 text-center">{lecturer.id}</td>
                  <td className="py-2 text-center">{lecturer.name}</td>
                  <td className="py-2 text-center">
                    <button className="bg-teal-500 text-white px-4 py-1 rounded hover:bg-teal-600">
                      <Link href='/admin/datadosen/edit'>
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
    </LayoutAdmin>
  );
};

export default DataDosen;
