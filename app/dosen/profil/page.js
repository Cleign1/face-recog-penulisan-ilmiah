import { LayoutDosen } from "@/components/Sidebar_dosen/Layout-Dosen";

export default function DataPresensi() {
  return (
    <div>
      <LayoutDosen>
        <div className="p-6">
          <h1 className="text-black mb-4 text-3xl text-center pt-28 p-5">Profil</h1>
          <div className="bg-gray-100 p-6 rounded-lg shadow-lg max-w-md mx-auto">
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="name"
              >
                Nama
              </label>
              <input
                id="name"
                type="text"
                placeholder="Nama"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="address"
              >
                Alamat
              </label>
              <input
                id="address"
                type="text"
                placeholder="Alamat"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="phone"
              >
                Nomor HP
              </label>
              <input
                id="phone"
                type="text"
                placeholder="Nomor HP"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      </LayoutDosen>
    </div>
  );
}
