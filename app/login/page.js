"use client";

import Head from "next/head";
import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "sonner";

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
  const [alert, setAlert] = useState({ status: "", message: "" });
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    if (session?.user?.role) {
      if (session.user.role === "siswa") {
        router.push("/siswa");
      } else if (session.user.role === "dosen") {
        router.push("/dosen");
      } else if (session.user.role === "admin") {
        router.push("/admin");
      }
    }
  }, [session, router]);

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
        // redirect: false,
        username: loginData.username,
        password: loginData.password,
      });

      if (result?.ok) {
        // setAlert({ status: "success", message: "Masuk berhasil" });
        toast.success("Masuk Berhasil");
        setLoginData({ username: "", password: "" });
        setTimeout(() => {
          if (session.user.role === "siswa") {
            router.push("/siswa");
          } else if (session.user.role === "dosen") {
            router.push("/dosen");
          } else if (session.user.role === "admin") {
            router.push("/admin");
          }
        }, 10000);
      } else {
        // setAlert({ status: "error", message: "Masuk gagal" });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.errors.reduce((acc, curr) => {
          acc[curr.path[0]] = curr.message;
          return acc;
        }, {});
        setErrors(fieldErrors);
      } else {
        // setAlert({ status: "error", message: "Something went wrong" });
        toast.error("Something went wrong");
      }
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
        {alert.message && (
          <div
            className={`alert ${
              alert.status === "error" ? "alert-danger" : "alert-success"
            }`}
          >
            {alert.message}
          </div>
        )}
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
              onClick={() => setIsClicked(true)}
            >
              Masuk
            </button>
          </div>
        </form>
        <div className="mt-4 text-center">
          <p className="text-gray-700">
            Belum punya akun?
            <button
              className="ml-1 text-blue-500 hover:text-blue-700 font-semibold focus:outline-none"
              onClick={() => router.push("/daftar")}
            >
              Daftar disini
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
