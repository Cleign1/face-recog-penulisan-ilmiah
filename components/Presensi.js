"use client";

import React, { useEffect, useState, useRef } from 'react';
import * as faceapi from '@vladmandic/face-api';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

const modelPath = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/';

export default function Presensi() {
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [recognizedName, setRecognizedName] = useState('');
  const [recognizedNPM, setRecognizedNPM] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [attendanceSubmitted, setAttendanceSubmitted] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [labeledFaceDescriptors, setLabeledFaceDescriptors] = useState([]);
  const router = useRouter();

  useEffect(() => {
    loadModelsAndData();
  }, []);

  useEffect(() => {
    if (isCameraOn) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isCameraOn]);

  async function loadModelsAndData() {
    await faceapi.nets.tinyFaceDetector.loadFromUri(modelPath);
    await faceapi.nets.faceLandmark68Net.loadFromUri(modelPath);
    await faceapi.nets.faceRecognitionNet.loadFromUri(modelPath);

    const response = await fetch('/api/saveface');
    const faceData = await response.json();
    const labeledDescriptors = await Promise.all(
      faceData.map(async (data) => {
        const descriptors = [new Float32Array(data.faceDescriptor)];
        return new faceapi.LabeledFaceDescriptors(`${data.name} (${data.npm})`, descriptors);
      })
    );
    setLabeledFaceDescriptors(labeledDescriptors);
  }

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
        };
      }
      startFaceDetection();
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: `Error Memulai Kamera: ${error}`,
        icon: "error",
      })
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setFaceDetected(false);
  };

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

  const startFaceDetection = () => {
    if (!videoRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;

    const detectFaces = async () => {
      if (video.videoWidth === 0 || video.videoHeight === 0) {
        requestAnimationFrame(detectFaces);
        return;
      }

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const displaySize = { width: video.videoWidth, height: video.videoHeight };
      faceapi.matchDimensions(canvas, displaySize);

      const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks();

      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
      faceapi.draw.drawDetections(canvas, resizedDetections);

      setFaceDetected(detections.length > 0);

      if (isCameraOn) {
        requestAnimationFrame(detectFaces);
      }
    };

    detectFaces();
  };

  const recognizeFace = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsProcessing(true);
    const video = videoRef.current;
    const canvas = canvasRef.current;

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
      const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6);
      const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor));

      results.forEach((result, i) => {
        const box = resizedDetections[i].detection.box;
        const drawBox = new faceapi.draw.DrawBox(box, { label: result.toString() });
        drawBox.draw(canvas);

        if (result.label !== 'unknown') {
          const [name, npm] = result.label.split(' (');
          setRecognizedName(name);
          setRecognizedNPM(npm.slice(0, -1)); // Remove the closing parenthesis
          submitAttendance(name, npm.slice(0, -1));
        }
      });
    } else {
      Swal.fire({
        title: "Error",
        text: "Tidak ada wajah yang terdeteksi. Silahkan coba lagi.",
        icon: "error",
      })
    }

    setIsProcessing(false);
  };

  const submitAttendance = async (name, npm) => {
    if (!name || !npm) {
      Swal.fire({
        title: "Error",
        text: "Tidak ada wajah yang dikenal. Silahkan coba lagi",
        icon: "error"
      })
      return;
    }

    const imageData = captureImage();
    if (!imageData) {
      Swal.fire({
        title: "Error",
        text: "Gagal mengambil gambar. Pastikan kamera aktif.",
        icon: "error"
      })
      return;
    }

    try {
      const response = await fetch('/api/saveabsen', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nama: name,
          npm: npm,
          waktuAbsen: new Date().toISOString(),
          status: 'Masuk',
          imageData: imageData
        }),
      });

      const result = await response.json();

      if (response.ok) {
        Swal.fire({
          title: "Berhasil",
          text: "Presensi berhasil direkam",
          icon: "success"
        })
        setAttendanceSubmitted(true);
      } else {
        Swal.fire({
          title: "Error",
          text:`Gagal untuk merekam presensi: ${result.message}`,
          icon: "error"
        })
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: `Terjadi error ketika mengirim presensi: ${error}`,
        icon: "error"
      })
    }
  };

  const toggleCamera = () => {
    setIsCameraOn(!isCameraOn);
    setAttendanceSubmitted(false);
    setRecognizedName('');
    setRecognizedNPM('');
    setFaceDetected(false);
  };

  const handlePresensi = () => {
    if (!isCameraOn) {
      Swal.fire({
        title: "Error",
        text: "Mohon Hidupkan Kamera Dahulu",
        icon: "error",
      });
      return;
    }
    if (attendanceSubmitted) {
      Swal.fire({
        title: "Info",
        text: "Presensi sudah direkam untuk sesi ini.",
        icon: "info"
      });
      return;
    }
    recognizeFace();
  };

  const handleBack = () => {
    stopCamera();
    setIsCameraOn(false);
    router.push("/siswa");
  };

  return (
    <div className="w-full max-w-3xl bg-white p-8 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Presensi menggunakan wajah</h1>
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
      {faceDetected && (
        <p className="text-green-600 font-bold mb-2">
          Wajah Terdeteksi
        </p>
      )}
      <div className="mb-4">
        <p>Nama yang Teridentifikasi: {recognizedName}</p>
        <p>NPM yang Teridentifikasi: {recognizedNPM}</p>
      </div>
      <div className="flex space-x-4 mb-4">
        <button
          onClick={toggleCamera}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {isCameraOn ? 'Matikan Kamera' : 'Hidupkan Kamera'}
        </button>
        <button
          onClick={handlePresensi}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          disabled={!isCameraOn || isProcessing || attendanceSubmitted}
        >
          {isProcessing ? 'Memproses...' : 'Presensi'}
        </button>
        <button
          onClick={handleBack}
          className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'>
            Kembali
        </button>
      </div>
      <h1 className='text-black'>Untuk melakukan presensi, mohon tekan tombol Presensi.</h1>
      <h1 className='text-black'>Setelah Presensi mohon matikan kamera kembali.</h1>
    </div>
  );
}