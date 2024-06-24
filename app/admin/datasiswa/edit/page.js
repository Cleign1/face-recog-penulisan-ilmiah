import { LayoutAdmin } from "@/components/Sidebar_admin/Layout-Admin";

const EditData = () => {
  return (
    <LayoutAdmin>
      <div className="flex items-center justify-center text-black pt-16">
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
          <h1 className="text-2xl font-bold mb-4 text-center">Edit Data</h1>
          <form>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="npm">NPM</label>
              <input
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="text"
                id="npm"
                name="npm"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="nama">Nama</label>
              <input
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="text"
                id="nama"
                name="nama"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="alamat">Alamat</label>
              <textarea
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                id="alamat"
                name="alamat"
              ></textarea>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="kelas">Kelas</label>
              <input
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="text"
                id="kelas"
                name="kelas"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="nomorHp">Nomor HP</label>
              <input
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="text"
                id="nomorHp"
                name="nomorHp"
              />
            </div>
            <div className="text-center">
              <button
                className="bg-teal-500 text-white px-6 py-2 rounded-lg hover:bg-teal-600"
                type="submit"
              >
                Simpan
              </button>
            </div>
          </form>
        </div>
      </div>
    </LayoutAdmin>
  );
};

export default EditData;
