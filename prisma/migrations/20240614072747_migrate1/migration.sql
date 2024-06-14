/*
  Warnings:

  - A unique constraint covering the columns `[nidn]` on the table `DataDosen` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[dosen]` on the table `MataKuliah` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[npm]` on the table `Presensi` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "DataDosen_nidn_key" ON "DataDosen"("nidn");

-- CreateIndex
CREATE UNIQUE INDEX "MataKuliah_dosen_key" ON "MataKuliah"("dosen");

-- CreateIndex
CREATE UNIQUE INDEX "Presensi_npm_key" ON "Presensi"("npm");
