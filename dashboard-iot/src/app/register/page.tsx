"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import AuthLayout from "../components/AuthLayout";
import { addUser } from "../lib/users";

export default function Register() {
  const router = useRouter();
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const surname = formData.get("surname") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Add user to mock store
    addUser({ email, password, name, surname });
    router.push("/dashboard");
  };

  return (
    <AuthLayout>
      <div className="flex space-x-4 mb-8">
        <Link
          href="/login"
          className="flex-1 py-2 border-b-2 font-medium text-sm transition-colors duration-300 text-gray-700 hover:text-blue-600"
        >
          Login
        </Link>
        <Link
          href="/register"
          className="flex-1 py-2 border-b-2 border-blue-500 text-blue-600 font-medium text-sm transition-colors duration-300"
        >
          Register
        </Link>
      </div>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      <form className="space-y-6" onSubmit={handleRegister}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Name
            </label>
            <div className="relative">
              <FontAwesomeIcon
                icon={faUser}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                id="name"
                name="name"
                className="pl-10 w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                placeholder="First Name"
                required
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="surname"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Surname
            </label>
            <div className="relative">
              <FontAwesomeIcon
                icon={faUser}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                id="surname"
                name="surname"
                className="pl-10 w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                placeholder="Last Name"
                required
              />
            </div>
          </div>
        </div>
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
        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Confirm Password
          </label>
          <div className="relative">
            <FontAwesomeIcon
              icon={faLock}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="pl-10 w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
              placeholder="••••••••"
              required
            />
          </div>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="agree"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            required
          />
          <label htmlFor="agree" className="ml-2 block text-sm text-gray-700">
            Agree
            <Link href="#" className="text-blue-600 hover:text-blue-800">
              Condition to use
            </Link>
          </label>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition transform hover:-translate-y-0.5"
        >
          Sign Up
        </button>
      </form>
    </AuthLayout>
  );
}
