import { LayoutAdmin } from "@/components/Sidebar_admin/Layout-Admin";

export default function TentangAdmin() {
  return (
    <div>
      <LayoutAdmin>
        <div className="p-6">
          <div className=" p-8 text-black">
            <div className="max-w-2xl mx-auto p-10 border-4 rounded-3xl border-black">
              <h1 className="text-4xl font-bold mb-4">Tentang Proyek ini</h1>
              <p className="text-lg mb-6">
                Nama : Muhamad Ibnu Khaidar Hafiz <br />
                Kelas : 3IA15 <br />
                NPM : 50421867
              </p>
              <p className="text-lg mb-6 text-justify">
                Website ini dibuat untuk persyaratan penyelesaian Penulisan
                Ilmiah pada semester 6
              </p>
              <p className="text-lg mb-6 text-justify">
                Website ini dibuat dengan Framework Next.js 14 dan Tailwind CSS.
                Dengan tambahan fitur authentikasi dengan NextAuth, Penyimpanan
                Database dengan PostgreSQL dengan platform Neon Database,
                komponen bantuan dari shacdn-ui, dan face recognition dan face
                verification menggunakan library Face-Api.js
              </p>
            </div>
          </div>
        </div>
      </LayoutAdmin>
    </div>
  );
}
