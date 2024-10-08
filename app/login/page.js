"use client";

import Head from "next/head";
import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "sonner";
import Swal from "sweetalert2";

const LoginSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username minimal 3 karakter!" })
    .max(25, { message: "Username maksimal 25 karakter!" }),

  password: z
    .string()
    .min(6, { message: "Password minimal 6 karakter!" })
    .max(50, { message: "Password maksimal 50 karakter!" }),
});

const LoginPage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role) {
      redirectBasedOnRole(session.user.role);
    }
  }, [session, status, router]);

  const redirectBasedOnRole = (role) => {
    switch (role) {
      case "siswa":
        router.push("/siswa");
        break;
      case "dosen":
        router.push("/dosen");
        break;
      case "admin":
        router.push("/admin");
        break;
      default:
        console.error("Unexpected user role:", role);
        toast.error("Terjadi kesalahan. Silakan coba lagi.");
    }
  };

  const onChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      LoginSchema.parse(loginData);
      setErrors({});
      setIsClicked(true);

      const result = await signIn("credentials", {
        redirect: false,
        username: loginData.username,
        password: loginData.password,
      });

      if (result?.ok) {
        Swal.fire({
          title: "Berhasil",
          text: "Berhasil Login",
          icon: "success",
        });
        setLoginData({ username: "", password: "" });
      } else {
        toast.error("Username atau password salah");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.errors.reduce((acc, curr) => {
          acc[curr.path[0]] = curr.message;
          return acc;
        }, {});
        setErrors(fieldErrors);
      } else {
        Swal.fire({
          title: "Error",
          text: "Terjadi Kesalahan",
          icon: "error"
        });
      }
    } finally {
      setIsClicked(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-rose-100 to-sky-100">
      <Toaster richColors />
      <Head>
        <title>Login Page</title>
      </Head>
      <div className="bg-white p-8 rounded-xl shadow-md max-w-md">
        <h1 className="text-2xl font-medium text-center mb-8">Login</h1>
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label htmlFor="username">Username</label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-center"
              name="username"
              type="text"
              placeholder="Username"
              onChange={onChange}
              value={loginData.username}
              required
            />
            {errors.username && (
              <p className="text-red-500 text-xs">{errors.username}</p>
            )}
          </div>
          <div className="mb-6">
            <label htmlFor="password">Kata Sandi</label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-center"
              name="password"
              type="password"
              value={loginData.password}
              onChange={onChange}
              placeholder="Kata Sandi"
              autoComplete="current-password"
              required
            />
            {errors.password && (
              <p className="text-red-500 text-xs">{errors.password}</p>
            )}
          </div>
          <div className="flex items-center justify-center">
            <button
              className={`${
                isClicked ? "bg-green-500" : "bg-blue-500"
              } hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-300 ease-in-out`}
              type="submit"
            >
              Masuk
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;