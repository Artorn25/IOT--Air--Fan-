"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const loginTabRef = useRef(null);
  const registerTabRef = useRef(null);
  const loginFormRef = useRef(null);
  const registerFormRef = useRef(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/js/all.min.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const showLogin = () => {
    if (loginFormRef.current && registerFormRef.current) {
      loginFormRef.current.classList.remove(
        "hidden",
        "opacity-0",
        "translate-x-full"
      );
      loginFormRef.current.classList.add("opacity-100", "translate-x-0");
      registerFormRef.current.classList.add(
        "hidden",
        "opacity-0",
        "translate-x-full"
      );
    }

    if (loginTabRef.current && registerTabRef.current) {
      loginTabRef.current.classList.add("border-blue-500", "text-blue-600");
      registerTabRef.current.classList.remove(
        "border-blue-500",
        "text-blue-600"
      );
    }
  };

  const showRegister = () => {
    if (loginFormRef.current && registerFormRef.current) {
      registerFormRef.current.classList.remove(
        "hidden",
        "opacity-0",
        "translate-x-full"
      );
      registerFormRef.current.classList.add("opacity-100", "translate-x-0");
      loginFormRef.current.classList.add(
        "hidden",
        "opacity-0",
        "-translate-x-full"
      );
    }

    if (loginTabRef.current && registerTabRef.current) {
      registerTabRef.current.classList.add("border-blue-500", "text-blue-600");
      loginTabRef.current.classList.remove("border-blue-500", "text-blue-600");
    }
  };

  useEffect(() => {
    showLogin();
  }, []);

  const handleSignUp = (e) => {
    e.preventDefault();
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-cyan-500 p-4">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white p-12 md:w-1/2 lg:w-2/5">
          <div className="mb-8">
            <i className="fas fa-fan text-4xl mb-4"></i>
            <h2 className="text-3xl font-bold mb-4">IOT FAN HEALTHY</h2>
            <p className="text-blue-100">
              IoT-based air fan system designed to monitor air quality and
              control fan operation based on environmental conditions
            </p>
          </div>
          <div className="space-y-4 mt-12">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-500/20 p-3 rounded-lg">
                <i className="fas fa-shield-alt text-xl"></i>
              </div>
              <p>System check history</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-blue-500/20 p-3 rounded-lg">
                <i className="fas fa-sync text-xl"></i>
              </div>
              <p>Update Data Realtime</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-blue-500/20 p-3 rounded-lg">
                <i className="fas fa-mobile-alt text-xl"></i>
              </div>
              <p>Monitor on Web application</p>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Forms */}
        <div className="p-12 md:w-1/2 lg:w-3/5">
          {/* Tab Navigation */}
          <div className="flex space-x-4 mb-8">
            <button
              onClick={showLogin}
              ref={loginTabRef}
              id="loginTab"
              className="flex-1 py-2 border-b-2 font-medium text-sm transition-colors duration-300"
            >
              Login
            </button>
            <button
              onClick={showRegister}
              ref={registerTabRef}
              id="registerTab"
              className="flex-1 py-2 border-b-2 font-medium text-sm transition-colors duration-300"
            >
              Register
            </button>
          </div>

          {/* Login Form */}
          <div
            id="loginForm"
            ref={loginFormRef}
            className="transition-all duration-500 ease-in-out transform opacity-100 translate-x-0"
          >
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  E-mail
                </label>
                <div className="relative">
                  <i className="fas fa-envelope absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                  <input
                    type="email"
                    className="pl-10 w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <i className="fas fa-lock absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                  <input
                    type="password"
                    className="pl-10 w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
                <a
                  href="#"
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Remember password?
                </a>
              </div>
              <button
                type="submit"
                onClick={handleSignUp}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition transform hover:-translate-y-0.5"
              >
                Sign Up
              </button>
            </form>
          </div>

          {/* Register Form */}
          <div
            id="registerForm"
            ref={registerFormRef}
            className="hidden transition-all duration-500 ease-in-out transform opacity-0 translate-x-full"
          >
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <div className="relative">
                    <i className="fas fa-user absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                    <input
                      type="text"
                      className="pl-10 w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                      placeholder="ชื่อ"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Surname
                  </label>
                  <div className="relative">
                    <i className="fas fa-user absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                    <input
                      type="text"
                      className="pl-10 w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                      placeholder="นามสกุล"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  E-mail
                </label>
                <div className="relative">
                  <i className="fas fa-envelope absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                  <input
                    type="email"
                    className="pl-10 w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <i className="fas fa-lock absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                  <input
                    type="password"
                    className="pl-10 w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <i className="fas fa-lock absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                  <input
                    type="password"
                    className="pl-10 w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  Agree
                  <a href="#" className="text-blue-600 hover:text-blue-800">
                    Condition to use
                  </a>
                </label>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition transform hover:-translate-y-0.5"
              >
                Sign In
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
