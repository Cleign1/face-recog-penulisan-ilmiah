"use client";

import React, { useEffect, useState, useRef } from 'react';
import * as faceapi from '@vladmandic/face-api';
import { useRouter } from 'next/navigation';

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

  async function loadModels() {
    await faceapi.nets.ssdMobilenetv1.loadFromUri(modelPath);
    await faceapi.nets.faceLandmark68Net.loadFromUri(modelPath);
    await faceapi.nets.faceRecognitionNet.loadFromUri(modelPath);
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
      console.error("Error starting camera:", error);
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

      const detections = await faceapi.detectAllFaces(video)
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
    if (!name || !faceDescriptor) {
      alert('Please enter a name and ensure a face is detected before saving.');
      return;
    }

    const data = {
        name: name,
        npm: npm,
        faceDescriptor: Array.from(faceDescriptor)
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
        alert('Face data saved successfully!');
        setName('');
        setNPM('');
        setFaceDescriptor(null);
        router.push("/siswa/presensi");
      } else {
        console.error('Failed to save face data:', result);
        alert(`Failed to save face data: ${result.message}`);
      }
    } catch (error) {
      console.error('Error saving face data:', error);
      alert('An error occurred while saving face data.');
    }
  };

  return (
    <div className="w-full max-w-3xl bg-white p-8 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Pendaftaran Wajah</h1>
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
          className="w-full px-3 py-2 border rounded"
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
      </div>
      {faceDescriptor && (
        <p className="text-green-600">
          Wajah Terdeteksi! Klik simpan untuk menyimpan Wajah.
        </p>
      )}
    </div>
  );
}