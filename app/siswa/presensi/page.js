"use client";

import { useEffect, useState } from 'react';
import * as faceapi from '@vladmandic/face-api';
import { Layout } from "@/components/Sidebar_siswa/Layout";
import { SsdMobilenetv1Options } from '@vladmandic/face-api';

const modelPath = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/';
const minScore = 0.2;
const maxResults = 5;
let optionsSSDMobileNet;
let optionsTinyFaceDetector;

function str(json) {
  let text = '<font color="lightblue">';
  text += json ? JSON.stringify(json).replace(/{|}|"|\]/g, '').replace(/,/g, ', ') : '';
  text += '</font>';
  return text;
}

function log(...txt) {
console.log(...txt); // eslint-disable-line no-console
const div = document.getElementById('log');
if (div) div.innerHTML += `<br>${txt}`;
}

function drawFaces(canvas, data, fps) {
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = 'small-caps 20px "Segoe UI"';
  ctx.fillStyle = 'white';
  ctx.fillText(`FPS: ${fps}`, 10, 25);
  for (const person of data) {
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'deepskyblue';
    ctx.fillStyle = 'deepskyblue';
    ctx.globalAlpha = 0.6;
    ctx.beginPath();
    ctx.rect(person.detection.box.x, person.detection.box.y, person.detection.box.width, person.detection.box.height);
    ctx.stroke();
    ctx.globalAlpha = 1;
    const expression = Object.entries(person.expressions).sort((a, b) => b[1] - a[1]);
    ctx.fillStyle = 'black';
    ctx.fillText(`gender: ${Math.round(100 * person.genderProbability)}% ${person.gender}`, person.detection.box.x, person.detection.box.y - 59);
    // ctx.fillText(`expression: ${Math.round(100 * expression[0][1])}% ${expression[0][0]}`, person.detection.box.x, person.detection.box.y - 41);
    ctx.fillText(`age: ${Math.round(person.age)} years`, person.detection.box.x, person.detection.box.y - 23);
    // ctx.fillText(`roll:${person.angle.roll}° pitch:${person.angle.pitch}° yaw:${person.angle.yaw}°`, person.detection.box.x, person.detection.box.y - 5);
    ctx.fillStyle = 'lightblue';
    ctx.fillText(`gender: ${Math.round(100 * person.genderProbability)}% ${person.gender}`, person.detection.box.x, person.detection.box.y - 60);
    // ctx.fillText(`expression: ${Math.round(100 * expression[0][1])}% ${expression[0][0]}`, person.detection.box.x, person.detection.box.y - 42);
    ctx.fillText(`age: ${Math.round(person.age)} years`, person.detection.box.x, person.detection.box.y - 24);
    // ctx.fillText(`roll:${person.angle.roll}° pitch:${person.angle.pitch}° yaw:${person.angle.yaw}°`, person.detection.box.x, person.detection.box.y - 6);
    ctx.globalAlpha = 0.8;
    ctx.fillStyle = 'lightblue';
    const pointSize = 2;
    for (let i = 0; i < person.landmarks.positions.length; i++) {
      ctx.beginPath();
      ctx.arc(person.landmarks.positions[i].x, person.landmarks.positions[i].y, pointSize, 0, 2 * Math.PI);
      ctx.fill();
    }
  }
}

async function detectVideo(video, canvas) {
    if (!video || video.paused) return false;
    const t0 = performance.now();
    faceapi
      // .detectAllFaces(video, optionsSSDMobileNet)
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions()
      .withAgeAndGender()
      .then((result) => {
        const fps = 1000 / (performance.now() - t0);
        drawFaces(canvas, result, fps.toLocaleString());
        requestAnimationFrame(() => detectVideo(video, canvas));
        return true;
      })
      .catch((err) => {
        log(`Detect Error: ${str(err)}`);
        return false;
      });
    return false;
}

async function setupCamera() {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    if (!video || !canvas) return null;
  
    log('Setting up camera');
    if (!navigator.mediaDevices) {
      log('Camera Error: access not supported');
      return null;
    }
    let stream;
    const constraints = { audio: false, video: { facingMode: 'user', resizeMode: 'crop-and-scale' } };
    if (window.innerWidth > window.innerHeight) constraints.video.width = { ideal: window.innerWidth };
    else constraints.video.height = { ideal: window.innerHeight };
    try {
      stream = await navigator.mediaDevices.getUserMedia(constraints);
    } catch (err) {
      if (err.name === 'PermissionDeniedError' || err.name === 'NotAllowedError') log(`Camera Error: camera permission denied: ${err.message || err}`);
      if (err.name === 'SourceUnavailableError') log(`Camera Error: camera not available: ${err.message || err}`);
      return null;
    }
    if (stream) {
      video.srcObject = stream;
    } else {
      log('Camera Error: stream empty');
      return null;
    }
    const track = stream.getVideoTracks()[0];
    const settings = track.getSettings();
    if (settings.deviceId) delete settings.deviceId;
    if (settings.groupId) delete settings.groupId;
    if (settings.aspectRatio) settings.aspectRatio = Math.trunc(100 * settings.aspectRatio) / 100;
    log(`Camera active: ${track.label}`);
    log(`Camera settings: ${str(settings)}`);
    
    return new Promise((resolve) => {
      video.onloadeddata = async () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        resolve(true);
      };
    });
}

async function setupFaceAPI() {
    await faceapi.nets.ssdMobilenetv1.load(modelPath);
    await faceapi.nets.tinyFaceDetector.load(modelPath);
    await faceapi.nets.ageGenderNet.load(modelPath);
    await faceapi.nets.faceLandmark68Net.load(modelPath);
    await faceapi.nets.faceRecognitionNet.load(modelPath);
    await faceapi.nets.faceExpressionNet.load(modelPath);
    optionsSSDMobileNet = new faceapi.SsdMobilenetv1Options({ minConfidence: minScore, maxResults });
    // optionsTinyFaceDetector = new faceapi.TinyFaceDetectorOptions({ minConfidence: minScore, maxResults })
    log(`Models loaded: ${str(faceapi.tf.engine().state.numTensors)} tensors`);
}

export default function Presensi() {
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);

  useEffect(() => {
    async function main() {
      log('FaceAPI WebCam Test');
      await faceapi.tf.setBackend('webgl');
      await faceapi.tf.ready();
      if (faceapi.tf?.env().flagRegistry.CANVAS2D_WILL_READ_FREQUENTLY) faceapi.tf.env().set('CANVAS2D_WILL_READ_FREQUENTLY', true);
      if (faceapi.tf?.env().flagRegistry.WEBGL_EXP_CONV) faceapi.tf.env().set('WEBGL_EXP_CONV', true);
      log(`Version: FaceAPI ${str(faceapi?.version || '(not loaded)')} TensorFlow/JS ${str(faceapi.tf?.version_core || '(not loaded)')} Backend: ${str(faceapi.tf?.getBackend() || '(not loaded)')}`);
      await setupFaceAPI();
    }

    main();
  }, []);

  const toggleCamera = async () => {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');

    if (isCameraOn) {
      // Turn off camera
      const stream = video.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      video.srcObject = null;
      setIsCameraOn(false);
      setIsDetecting(false);
    } else {
      // Turn on camera
      await setupCamera();
      setIsCameraOn(true);
    }
  };

  const toggleDetection = () => {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');

    if (isDetecting) {
      // Stop detection
      video.pause();
      setIsDetecting(false);
    } else {
      // Start detection
      video.play();
      detectVideo(video, canvas);
      setIsDetecting(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-pink-100 flex">
      <Layout>
        <div className="flex flex-col items-center justify-center p-6">
          <div className="w-full max-w-3xl h-full max-h-full bg-white p-8 rounded shadow">
            <div className="relative border border-gray-300 w-full h-96 flex items-center justify-center">
              <video id="video" playsInline className="absolute w-full h-full object-cover"></video>
              <canvas id="canvas" className="absolute w-full h-full"></canvas>
            </div>
            <div className="mt-4 flex justify-center space-x-4">
              <button 
                onClick={toggleCamera}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                {isCameraOn ? 'Matikan Kamera' : 'Hidupkan Kamera'}
              </button>
              {isCameraOn && (
                <button 
                  onClick={toggleDetection}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  {isDetecting ? 'Hentikan Deteksi' : 'Mulai Deteksi'}
                </button>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
}