import dynamic from 'next/dynamic';

const Presensi = dynamic(() => import('@/components/Presensi'), {
  ssr: false,
});

export default function PresensiPage() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-[#FFD659] to-[#FFFFFF] flex flex-col items-center justify-center p-6">
      <Presensi />
    </div>
  );
}