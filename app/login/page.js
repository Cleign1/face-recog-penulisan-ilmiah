import Head from "next/head";
import Link from "next/link";

const LoginPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-rose-100 to-sky-100">
      <Head>
        <title>Login Page</title>
      </Head>
      <div className="bg-white p-8 rounded-xl shadow-md max-w-md">
        <h1 className="text-2xl font-medium text-center mb-8">Login</h1>
        <form>
          <div className="mb-4">
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-center"
              id="username"
              type="text"
              placeholder="Username"
              required
            />
          </div>
          <div className="mb-6">
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-center"
              id="Password"
              type="Password"
              placeholder="Password"
              required
            />
          </div>
          <div className="flex items-center justify-center">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              <Link href="/siswa">
                Masuk
              </Link>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
