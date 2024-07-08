"use client";

import { useState } from "react";
import Head from "next/head";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Toaster, toast } from 'sonner'
import Swal from "sweetalert2";

const SignUpSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username minimal 3 karakter!" })
    .max(25, { message: "Username maksimal 25 karakter!" }),
  email: z
    .string()
    .min(3, { message: "Email minimal 3 karakter!" })
    .max(50, { message: "Email maksimal 50 karakter!" })
    .email({ message: "Email tidak valid!" }),
  password: z
    .string()
    .min(6, { message: "Password minimal 6 karakter!" })
    .max(50, { message: "Password maksimal 50 karakter!" }),
  role: z.enum(["siswa"]),
  npm: z
    .string()
    .min(5, { message: "NPM minimal 5 karakter!" })
    .max(8, { message: "NPM maksimal 8 karakter!" })
    .regex(/^\d+$/, "NPM Harus Bermomor"),
});

export default function Daftar() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "siswa",
    npm: ""
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      SignUpSchema.parse(formData);
      setErrors({});

      const response = await fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response?.ok) {
        // toast.success("User berhasil dibuat");
        Swal.fire({
          title: "Berhasil",
          text: "Berhasil Membuat akun, silahkan Login. Jika anda dosen hubungi Admin",
          icon: "success",
        })
        setTimeout(() => {
          router.push('/login');
        }, 500);
      } else {
        // toast.error(result.message || "Terjadi Kesalahan pada saat membuat user");
        Swal.fire({
          title: "Terjadi Kesalahan",
          message: "Terjadi Kesalahan pada saat membuat user",
          icon: "error",
        })
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.errors.reduce((acc, curr) => {
          acc[curr.path[0]] = curr.message;
          return acc;
        }, {});
        setErrors(fieldErrors);
      } else {
        toast.error("Terjadi Kesalahan")
        Swal.fire({
          title: "Kesalahan",
          text: "Terjadi Kesalahan",
          icon: "error",
        })
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-rose-100 to-sky-100">
      <Toaster richColors />
      <Head>
        <title>Daftar</title>
      </Head>
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">Daftar</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Username Anda"
              value={formData.username}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            {errors.username && (
              <p className="text-red-500 text-xs">{errors.username}</p>
            )}
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Alamat Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="johndoe@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            {errors.email && (
              <p className="text-red-500 text-xs">{errors.email}</p>
            )}
          </div>
          <div>
            <label htmlFor="npm" className="block text-sm font-medium text-gray-700">
              NPM
            </label>
            <input
              id="npm"
              name="npm"
              type="text"
              placeholder="NPM Anda"
              value={formData.npm}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            {errors.npm && (
              <p className="text-red-500 text-xs">{errors.npm}</p>
            )}
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Kata Sandi
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                placeholder="Kata Sandi Anda"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-sm text-gray-600 focus:outline-none"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs">{errors.password}</p>
            )}
          </div>
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
              Peran
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="siswa">Siswa</option>
            </select>
            {errors.role && (
              <p className="text-red-500 text-xs">{errors.role}</p>
            )}
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Daftar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}