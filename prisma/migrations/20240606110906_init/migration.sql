-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataSiswa" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "npm" TEXT NOT NULL,
    "kelas" TEXT NOT NULL,
    "nomor_hp" TEXT NOT NULL,

    CONSTRAINT "DataSiswa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataDosen" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "nidn" TEXT NOT NULL,
    "nomor_hp" TEXT NOT NULL,

    CONSTRAINT "DataDosen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MataKuliah" (
    "id" SERIAL NOT NULL,
    "dosen" TEXT NOT NULL,
    "kode_mata_kuliah" TEXT NOT NULL,
    "nama_mata_kuliah" TEXT NOT NULL,

    CONSTRAINT "MataKuliah_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Presensi" (
    "id" SERIAL NOT NULL,
    "tanggal" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nama" TEXT NOT NULL,
    "npm" TEXT NOT NULL,
    "sudah_absen" BOOLEAN NOT NULL,
    "waktu_absen" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Presensi_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "DataSiswa_npm_key" ON "DataSiswa"("npm");

-- CreateIndex
CREATE UNIQUE INDEX "DataDosen_nama_key" ON "DataDosen"("nama");

-- CreateIndex
CREATE UNIQUE INDEX "MataKuliah_kode_mata_kuliah_key" ON "MataKuliah"("kode_mata_kuliah");

-- AddForeignKey
ALTER TABLE "MataKuliah" ADD CONSTRAINT "MataKuliah_dosen_fkey" FOREIGN KEY ("dosen") REFERENCES "DataDosen"("nama") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Presensi" ADD CONSTRAINT "Presensi_npm_fkey" FOREIGN KEY ("npm") REFERENCES "DataSiswa"("npm") ON DELETE RESTRICT ON UPDATE CASCADE;
