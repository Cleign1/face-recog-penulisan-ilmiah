import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import * as faceapi from '@vladmandic/face-api/dist/face-api.esm.js';
import { loadModels, detectFaces } from "@/lib/faceapi";
import { toast, Toaster } from "sonner";

const RegisterFace = ({ onRegister }) => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [initialized, setInitialized] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    const setup = async () => {
      await loadModels();
      setInitialized(true);
    };

    setup();
  }, []);

  useEffect(() => {
    if (initialized && videoReady) {
      const video = webcamRef.current.video;
      const canvas = canvasRef.current;

      const displaySize = {
        width: video.videoWidth,
        height: video.videoHeight,
      };

      faceapi.matchDimensions(canvas, displaySize);

      const intervalId = setInterval(async () => {
        const detections = await detectFaces(video);

        const resizedDetections = faceapi.resizeResults(detections, displaySize);

        // Clear the canvas before drawing
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // If you want to draw something else, you can do it here

      }, 100);

      return () => clearInterval(intervalId); // Cleanup interval on component unmount
    }
  }, [initialized, videoReady]);

  const handleRegister = async () => {
    const video = webcamRef.current.video;
    const detections = await detectFaces(video);

    if (detections.length > 0) {
      const descriptor = detections[0].descriptor;
      onRegister(descriptor);
      toast.success("Face registered successfully!");
    } else {
      toast.warning("No face detected!");
    }
  };

  return (
    <div className="relative w-full h-full">
      <Toaster richColors />
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        className="w-full h-full object-cover"
        onLoadedMetadata={() => setVideoReady(true)}
      />
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
      <button
        onClick={handleRegister}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded shadow absolute bottom-4 left-1/2 transform -translate-x-1/2"
      >
        Register Face
      </button>
    </div>
  );
};

export default RegisterFace;
