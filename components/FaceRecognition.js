"use client";

import React, { useEffect, useState, useRef } from 'react';
import * as faceapi from '@vladmandic/face-api';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { toast } from 'sonner';
import { Toaster } from 'sonner';

const modelPath = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/';

export default function FaceRecognition() {
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [name, setName] = useState('');
  const [npm, setNPM] = useState('');
  const [faceDescriptor, setFaceDescriptor] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const detectionIntervalRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    loadModels();
  }, []);

  useEffect(() => {
    if (isCameraOn) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isCameraOn]);
  
  const captureImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
      return canvas.toDataURL('image/jpeg');
    }
    return null;
  };

  async function loadModels() {
    try {
      await faceapi.nets.tinyFaceDetector.loadFromUri(modelPath);
      await faceapi.nets.faceLandmark68Net.loadFromUri(modelPath);
      await faceapi.nets.faceRecognitionNet.loadFromUri(modelPath);
      // console.log('Models loaded successfully');
      toast.success('Models loaded successfully');
    } catch (error) {
      // console.error('Error loading models:', error);
      toast.error('Failed to load face recognition models');
    }
  }

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          startFaceDetection();
        };
      }
    } catch (error) {
      toast.error("Error Memulai Kamera: " + error);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    if (detectionIntervalRef.current) {
      cancelAnimationFrame(detectionIntervalRef.current);
    }
  };

  const startFaceDetection = () => {
    if (!videoRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;

    const detectFaces = async () => {
      if (video.videoWidth === 0 || video.videoHeight === 0) {
        detectionIntervalRef.current = requestAnimationFrame(detectFaces);
        return;
      }

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const displaySize = { width: video.videoWidth, height: video.videoHeight };
      faceapi.matchDimensions(canvas, displaySize);

      const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptors();

      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
      faceapi.draw.drawDetections(canvas, resizedDetections);

      if (detections.length > 0) {
        setFaceDescriptor(detections[0].descriptor);
      } else {
        setFaceDescriptor(null);
      }

      detectionIntervalRef.current = requestAnimationFrame(detectFaces);
    };

    detectFaces();
  };

  const toggleCamera = () => {
    setIsCameraOn(!isCameraOn);
  };

  const saveToJSON = async () => {
    if (!name || !npm || !faceDescriptor) {
      toast.warning("Mohon masukkan nama, NPM, dan pastikan wajah terdeteksi sebelum menyimpan.");
      return;
    }

    const imageData = captureImage();
    if (!imageData) {
      toast.error("Gagal mengambil gambar. Pastikan kamera aktif.");
      return;
    }

    const data = {
      name: name,
      npm: npm,
      faceDescriptor: Array.from(faceDescriptor),
      imageData: imageData
    };

    try {
      const response = await fetch('/api/saveface', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        Swal.fire({
          title: "Sukses",
          text: "Data wajah berhasil disimpan!",
          icon: "success",
        });
        setName('');
        setNPM('');
        setFaceDescriptor(null);
        toast.warning("Sebelum keluar dari halaman ini, harap matikan kamera terlebih dahulu");
      } else {
        toast.error(`Failed to save face data: ${result.message}`);
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat menyimpan data wajah.');
    }
  };

  const handleBack = () => {
    stopCamera();
    setIsCameraOn(false);
    router.push("/siswa/profil");
  };

  return (
    <div className="w-full max-w-3xl bg-white p-8 rounded shadow">
      <Toaster richColors />
      <h1 className="text-2xl font-bold mb-4">Pendaftaran/Perbaharui Wajah</h1>
      <div className="relative border border-gray-300 w-full h-96 flex items-center justify-center mb-4">
        <video
          ref={videoRef}
          className="absolute w-full h-full object-cover"
          autoPlay
          muted
          playsInline
        ></video>
        <canvas ref={canvasRef} className="absolute w-full h-full"></canvas>
      </div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Masukkan nama"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border rounded mb-2"
        />
        <input
          type="text"
          placeholder="Masukkan NPM"
          value={npm}
          onChange={(e) => setNPM(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      <div className="flex space-x-4 mb-4">
        <button
          onClick={toggleCamera}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {isCameraOn ? "Matikan Kamera" : "Hidupkan Kamera"}
        </button>
        <button
          onClick={saveToJSON}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          disabled={!faceDescriptor}
        >
          Simpan
        </button> 
        <button
          onClick={handleBack}
          className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
        >
          Kembali
        </button>
      </div>
      {faceDescriptor && (
        <p className="text-green-600">
          Wajah Terdeteksi! Klik simpan untuk menyimpan Wajah.
        </p>
      )}
    </div>
  );
}