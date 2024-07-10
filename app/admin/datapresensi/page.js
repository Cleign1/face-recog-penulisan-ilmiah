"use client";

import React, { useState, useEffect } from "react";
import { LayoutAdmin } from "@/components/Sidebar_admin/Layout-Admin";
import { toast } from "sonner";
import { Toaster } from "sonner";
import Link from "next/link";
import Swal from "sweetalert2";

const DataPresensi = () => {
  const [presensi, setPresensi] = useState([]);
  const [sortField, setSortField] = useState("npm");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showModal, setShowModal] = useState(false);
  const [currentImage, setCurrentImage] = useState("");
  const [currentStatus, setCurrentStatus] = useState("");

  const fetchData = async () => {
    try {
      const response = await fetch(`/api/absensi`);
      if (!response.ok) {
        throw new Error("Failed to fetch presensi");
      }
      const data = await response.json();
      setPresensi(data);
      toast.success("Data presensi berhasil dimuat!");
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSort = (field) => {
    const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(order);
    setPresensi(
      presensi.slice().sort((a, b) => {
        if (a[field] < b[field]) return order === "asc" ? -1 : 1;
        if (a[field] > b[field]) return order === "asc" ? 1 : -1;
        return 0;
      })
    );
  };

  const handleDelete = async (npm) => {
    const confirmed = await Swal.fire({
      title: 'Apakah Anda yakin?',
      text: "Data absensi ini akan dihapus secara permanen!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, hapus!'
    });

    if (confirmed.isConfirmed) {
      try {
        const response = await fetch(`/api/absensi`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ npm }),
        });

        if (!response.ok) {
          throw new Error('Failed to delete presensi');
        }

        fetchData();
        Swal.fire({
          title: "Berhasil",
          text: "Berhasil Menghapus Data",
          icon: "success",
        });
      } catch (error) {
        toast.error(`Error: ${error.message}`);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toISOString().split('T')[0];
  };
  
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    date.setUTCHours(date.getUTCHours() + 7); // Menambah 7 jam ke waktu UTC
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  const handleImagePreview = (imageUrl, status) => {
    setCurrentImage(imageUrl);
    setCurrentStatus(status);
    setShowModal(true);
  };


  return (
    <div className="flex flex-col items-center justify-center text-black pt-24">
      <Toaster richColors />
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-7xl">
        <h1 className="text-2xl font-bold mb-4">Data Presensi</h1>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 cursor-pointer" onClick={() => handleSort("npm")}>NPM</th>
              <th className="py-2 cursor-pointer" onClick={() => handleSort("nama")}>Nama</th>
              <th className="py-2 cursor-pointer" onClick={() => handleSort("tanggal")}>Tanggal</th>
              <th className="py-2 cursor-pointer" onClick={() => handleSort("waktuAbsen")}>Waktu Absen</th>
              <th className="py-2 cursor-pointer" onClick={() => handleSort("status")}>Status</th>
              <th className="py-2 cursor-pointer">Bukti</th>
              <th>Hapus</th>
            </tr>
          </thead>
          <tbody>
            {presensi.map((entry, index) => (
              <tr key={index} className="border-t">
                <td className="py-2 px-4 text-center">{entry.npm}</td>
                <td className="py-2 px-4 text-center">{entry.nama}</td>
                <td className="py-2 px-4 text-center">{formatDate(entry.tanggal)}</td>
                <td className="py-2 px-4 text-center">{formatTime(entry.waktuAbsen)}</td>
                <td className="py-2 px-4 text-center">{entry.status}</td>
                <td className="py-2 px-4 text-center">
                {entry.status.toLowerCase() === "masuk" ? (
                  <button 
                    onClick={() => handleImagePreview(entry.imageUrl, entry.status)}
                    className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-700"
                  >
                    Lihat Bukti
                  </button>
                ) : (
                  <span className="text-gray-500">Tidak ada bukti</span>
                )}
                </td>
                <td className="py-2 text-center">
                  <button
                  onClick={() => handleDelete(entry.npm)}
                    className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-700">
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4 flex justify-end">
          <a onClick={() => fetchData()} className="pr-3 cursor-pointer">
            <span className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Refresh Data
            </span>
          </a>
          <Link href="/admin/datapresensi/absen">
            <span className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Tambah Absen Manual
            </span>
          </Link>
        </div>
      </div>
      {showModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-4 rounded-lg max-w-3xl max-h-[90vh] overflow-auto">
          {currentStatus.toLowerCase() === "masuk" ? (
            <>
              <img src={currentImage} alt="Bukti Presensi" className="max-w-full h-auto"/>
              <button 
                onClick={() => setShowModal(false)}
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Tutup
              </button>
            </>
          ) : (
            <div className="text-center p-4">
              <p className="text-xl font-semibold mb-4">Tidak ada bukti gambar</p>
              <p>Status: {currentStatus}</p>
              <button 
                onClick={() => setShowModal(false)}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Tutup
              </button>
            </div>
          )}
        </div>
      </div>
    )}
    </div>
  );
};

export default function PresensiAdmin() {
  return (
    <LayoutAdmin>
      <DataPresensi />
    </LayoutAdmin>
  );
}
