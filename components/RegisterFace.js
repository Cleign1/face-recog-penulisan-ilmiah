import { useEffect, useRef, useState } from "react";
import * as faceapi from '@vladmandic/face-api/dist/face-api.esm.js';
import Webcam from "react-webcam";
import { loadModels, detectFaces } from "@/lib/faceapi";
import { toast } from "sonner";

const RegisterFace = ({ onRegister }) => {
  const webcamRef = useRef(null);
  const [initialized, setInitialized] = useState(false);
  const [faceDescriptor, setFaceDescriptor] = useState(null);

  useEffect(() => {
    const setup = async () => {
      await loadModels();
      setInitialized(true);
    };
    setup();
  }, []);

  const captureFace = async () => {
    const video = webcamRef.current.video;
    const detections = await detectFaces(video);

    if (detections.length > 0) {
      const descriptor = detections[0].descriptor;
      setFaceDescriptor(descriptor);
      onRegister(descriptor);
    } else {
      toast.error("No Face Detected");
    }
  };

  return (
    <div className="register-face">
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        className="w-full h-full object-cover"
      />
      <button onClick={captureFace} className="btn btn-primary mt-4">
        Register Face
      </button>
      {!initialized && <p>Loading models...</p>}
    </div>
  );
};

export default RegisterFace;
