# Stuff To Do

## Face-api stuff
- [x] Implement Face-API Face Detection 
- [x] create backend for registering face json when register face atau something like that
- [x] face verification using face-api face recognition

## Backends
- [x] Create backend api for crud data siswa
- [x] create backend api for crud data dosen
- [x] create backend api for data presensi in sync with face-api face-recognition
- [x] create api for linking user database and datasiswa database, 
      if npm match show the data diri siswa, if not you can create from scratch and it updated the database
- [x] create api for linking user database and datadosen database, 
      if nidn match show the data diri dosen, if not you can create from scratch and it updated the database
- [x] show data kelas table from datasiswa database using api
- [x] create data presensi api for manual presensi dosen
- [x] create data presensi api for manual presensi admin
- [x] update siswa dashboard
- [x] update dosen dashboard
- [x] update admin dashboard

## Polishing
- [x] apply sweetalert2 and sonner to project
- [ ] comment code for better readability

## Debugging
- fix this warning
``` bash
⚠ ./node_modules/.pnpm/@vladmandic+face-api@1.7.13/node_modules/@vladmandic/face-api/dist/face-api.esm.js Critical dependency: require function is used in a way in which dependencies cannot be statically extracted

Import trace for requested module:
./node_modules/.pnpm/@vladmandic+face-api@1.7.13/node_modules/@vladmandic/face-api/dist/face-api.esm.js
./app/siswa/presensi/page.js

./node_modules/.pnpm/@vladmandic+face-api@1.7.13/node_modules/@vladmandic/face-api/dist/face-api.esm.js
Critical dependency: require function is used in a way in which dependencies cannot be statically extracted

Import trace for requested module:
./node_modules/.pnpm/@vladmandic+face-api@1.7.13/node_modules/@vladmandic/face-api/dist/face-api.esm.js
./app/siswa/presensi/page.js```