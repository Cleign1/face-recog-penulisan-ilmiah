'use client';

import Head from "next/head";
import { useState } from "react";
import { signIn } from "next-auth/react";

const LoginPage = () => {

  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  })

  const [alert, setAlert] = useState({
    status: "",
    message: "",
  })

  const onChange = e => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault()
    try {
      await signIn("credentials", loginData)
      setAlert({ status: "success", message: "Login successfully" })
      setLoginData({ email: "", password: "" })
    } catch (error) {
      console.log({ error })
      setAlert({ status: "error", message: "Something went wrong" })
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-rose-100 to-sky-100">
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
              name="Username"
              type="text"
              placeholder="Username"
              onChange={onChange}
              value={loginData.username}
              required
            />
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
          </div>
          <div className="flex items-center justify-center">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
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
