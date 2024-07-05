import { useEffect, useRef, useState } from 'react';
import * as faceapi from '@vladmandic/face-api/dist/face-api.esm.js';
import Webcam from 'react-webcam';
import { loadModels, detectFaces } from '@/lib/faceapi';
import { toast, Toaster } from 'sonner';

const FaceRecognition = ({ registeredFaces }) => {
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
        if (!video.videoWidth || !video.videoHeight) {
          console.warn('Video dimensions are not available yet');
          return;
        }

        const detections = await detectFaces(video);

        if (detections.length === 0) {
          toast.warning("Tidak ada wajah yang terdeteksi");
          return;
        }

        const resizedDetections = faceapi.resizeResults(detections, displaySize);

        // Clear the canvas before drawing
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Face recognition logic
        const labeledFaceDescriptors = new faceapi.LabeledFaceDescriptors(
          'User',
          registeredFaces.map((desc) => new Float32Array(desc))
        );

        const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6);

        resizedDetections.forEach((detection) => {
          const bestMatch = faceMatcher.findBestMatch(detection.descriptor);

          // Here you can add logic for recognized faces if needed

        });
      }, 100);

      return () => clearInterval(intervalId); // Cleanup interval on component unmount
    }
  }, [initialized, videoReady, registeredFaces]);

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
    </div>
  );
};

export default FaceRecognition;
