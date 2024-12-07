import dynamic from 'next/dynamic';

const FaceRecognition = dynamic(() => import('@/components/FaceRecognition'), {
  ssr: false,
});

export default function DaftarPresensi() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-[#FFD659] to-[#FFFFFF] flex flex-col items-center justify-center p-6">
      <FaceRecognition />
    </div>
  );
}