import dynamic from 'next/dynamic';

const Presensi = dynamic(() => import('@/components/Presensi'), {
  ssr: false,
});

export default function PresensiPage() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-pink-100 flex flex-col items-center justify-center p-6">
      <Presensi />
    </div>
  );
}