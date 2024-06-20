// pages/students.js
import { Layout } from "@/components/Sidebar_siswa/Layout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const students = [
  { id: 1, name: "Aldo Rizky Ramadhan", npm: 50421106, class: "3IA15" },
  { id: 2, name: "Aura Khalisa Dini Lestari", npm: 50421238, class: "3IA15" },
  { id: 3, name: "Dani Irsyad Maulana", npm: 50421327, class: "3IA15" },
  { id: 4, name: "Faiz Rizki Azmi", npm: 50421454, class: "3IA15" },
  { id: 5, name: "Fikri Fahrozi", npm: 50421518, class: "3IA15" },
  { id: 6, name: "Muhamad Ibnu Khaidar Hafiz", npm: 50421867, class: "3IA15" },
  { id: 7, name: "Nopriansyah", npm: 51421150, class: "3IA15" },
  { id: 8, name: "Reyhan Daffa Dhiaulhaq", npm: 51421289, class: "3IA15" },
  { id: 9, name: "Sahganda Guna Dharma Saragih", npm: 51421378, class: "3IA15"},
];

export default function Kelas() {
  return (
    <div>
      <Layout>
        <div className="p-6 text-black">
          <h1 className="text-black text-2xl font-bold mb-4">Kelas 3IA15</h1>
          <Table>
            <TableHeader>
              <TableRow className="text-lg">
                <TableHead className="w-[100px]">Id</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>NPM</TableHead>
                <TableHead>Kelas</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-lg">
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.id}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.npm}</TableCell>
                  <TableCell>{student.class}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Layout>
    </div>
  );
}
