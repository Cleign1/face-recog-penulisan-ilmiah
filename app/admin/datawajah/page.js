"use client";

import React, { useState, useEffect } from "react";
import { LayoutAdmin } from "@/components/Sidebar_admin/Layout-Admin";
import { toast, Toaster } from "sonner";

const DataWajah = () => {
  const [faces, setFaces] = useState([]);
  const [sortField, setSortField] = useState("npm");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showModal, setShowModal] = useState(false);
  const [currentImage, setCurrentImage] = useState("");

  const fetchData = async () => {
    try {
      const response = await fetch("/api/admindata");
      if (!response.ok) {
        throw new Error("Failed to fetch face data");
      }
      const data = await response.json();
      setFaces(data);
      toast.success("Data wajah berhasil dimuat!");
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
    setFaces(
      faces.slice().sort((a, b) => {
        if (a[field] < b[field]) return order === "asc" ? -1 : 1;
        if (a[field] > b[field]) return order === "asc" ? 1 : -1;
        return 0;
      })
    );
  };

  const handleImagePreview = (imageUrl) => {
    setCurrentImage(imageUrl);
    setShowModal(true);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit' 
    }).split('/').join('-');
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit', 
      hour12: false 
    });
  };

  return (
    <div className="flex flex-col items-center justify-center text-black pt-24">
      <Toaster richColors />
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-7xl">
        <h1 className="text-2xl font-bold mb-4">Data Wajah</h1>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 cursor-pointer" onClick={() => handleSort("npm")}>NPM</th>
              <th className="py-2 cursor-pointer" onClick={() => handleSort("nama")}>Nama</th>
              <th className="py-2 cursor-pointer">Gambar Wajah</th>
              <th className="py-2 cursor-pointer" onClick={() => handleSort("createdAt")}>Dibuat</th>
              <th className="py-2 cursor-pointer" onClick={() => handleSort("createdAt")}>Waktu Dibuat</th>
              <th className="py-2 cursor-pointer" onClick={() => handleSort("updatedAt")}>Update</th>
              <th className="py-2 cursor-pointer" onClick={() => handleSort("updatedAt")}>Waktu Update</th>
            </tr>
          </thead>
          <tbody>
            {faces.map((entry, index) => (
              <tr key={index} className="border-t">
                <td className="py-2 px-4 text-center">{entry.npm}</td>
                <td className="py-2 px-4 text-center">{entry.nama}</td>
                <td className="py-2 px-4 text-center">
                  {entry.imageUrl ? (
                    <button 
                      onClick={() => handleImagePreview(entry.imageUrl)}
                      className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-700"
                    >
                      Lihat Gambar
                    </button>
                  ) : (
                    <span className="text-gray-500">Tidak ada gambar</span>
                  )}
                </td>
                <td className="py-2 px-4 text-center">{formatDate(entry.createdAt)}</td>
                <td className="py-2 px-4 text-center">{formatTime(entry.createdAt)}</td>
                <td className="py-2 px-4 text-center">{formatDate(entry.updatedAt)}</td>
                <td className="py-2 px-4 text-center">{formatTime(entry.updatedAt)}</td>
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
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg max-w-3xl max-h-[90vh] overflow-auto">
            <img src={currentImage} alt="Gambar Wajah" className="max-w-full h-auto"/>
            <button 
              onClick={() => setShowModal(false)}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default function DataWajahAdmin() {
  return (
    <LayoutAdmin>
      <DataWajah />
    </LayoutAdmin>
  );
}