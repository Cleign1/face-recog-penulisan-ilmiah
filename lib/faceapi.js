import * as faceapi from '@vladmandic/face-api/dist/face-api.esm.js';

export const loadModels = async () => {
    const MODEL_URL = '/models';
  
    await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
    await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
    await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
    return faceapi;
  };
  
  export const detectFaces = async (video) => {
    const faceapi = await import('@vladmandic/face-api');
    const detections = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptors();
    return detections;
  };
  