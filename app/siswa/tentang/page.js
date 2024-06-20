import { Layout } from "@/components/Sidebar_siswa/Layout";

export default function Tentang() {
  return (
    <div>
      <Layout>
        <div className="p-6 text-black">
          <div className="pt-24">
            <div className="max-w-2xl mx-auto border-black border-4 rounded-3xl p-8">
              <h1 className="text-4xl font-bold mb-4">Tentang Website ini</h1>
              <p className="text-lg mb-6">
                Nama : Muhamad Ibnu Khaidar Hafiz <br />
                Kelas : 3IA15 <br />
                NPM : 50421867
              </p>
              <p className="text-lg mb-6">
                Website ini dibuat untuk persyaratan penyelesaian Penulisan
                Ilmiah pada semester 6
              </p>
              <p className="text-lg mb-6 justify-evenly">
              Website ini dibuat dengan Framework Next.js 14 dan Tailwind CSS. Dengan tambahan fitur authentikasi dengan NextAuth, Penyimpanan Database dengan PostgreSQL dengan platform Neon Database dengan dan face recognition dan face verification menggunakan library Face-Api.js
              </p>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
}
