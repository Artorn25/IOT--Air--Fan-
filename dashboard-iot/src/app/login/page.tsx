"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import AuthLayout from "../components/AuthLayout";
import { findUser } from "../lib/users";
export default function Login() {
  const router = useRouter();
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const user = findUser(email, password);
    if (user) {
      // In a real app, set session/auth token here
      router.push("/dashboard");
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <AuthLayout>
      <div className="flex space-x-4 mb-8">
        <Link
          href="/login"
          className="flex-1 py-2 border-b-2 border-blue-500 text-blue-600 font-medium text-sm transition-colors duration-300"
        >
          Login
        </Link>
        <Link
          href="/register"
          className="flex-1 py-2 border-b-2 font-medium text-sm transition-colors duration-300 text-gray-700 hover:text-blue-600"
        >
          Register
        </Link>
      </div>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      <form className="space-y-6" onSubmit={handleLogin}>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            E-mail
          </label>
          <div className="relative">
            <FontAwesomeIcon
              icon={faEnvelope}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="email"
              id="email"
              name="email"
              className="pl-10 w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
              placeholder="your@email.com"
              required
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Password
          </label>
          <div className="relative">
            <FontAwesomeIcon
              icon={faLock}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="password"
              id="password"
              name="password"
              className="pl-10 w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
              placeholder="••••••••"
              required
            />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="remember"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="remember"
              className="ml-2 block text-sm text-gray-700"
            >
              Remember me
            </label>
          </div>
          <Link href="#" className="text-sm text-blue-600 hover:text-blue-800">
            Remember password?
          </Link>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition transform hover:-translate-y-0.5"
        >
          Sign In
        </button>
      </form>
    </AuthLayout>
  );
}
