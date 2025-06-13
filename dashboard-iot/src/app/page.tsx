"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/js/all.min.js";
    script.async = true;
    document.body.appendChild(script);

    AOS.init({
      duration: 1000,
      once: true,
    });

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <>
      {/* <!-- Navigation --> */}
      <nav className="bg-white shadow-lg fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <i className="fas fa-fan text-blue-600 text-2xl mr-2"></i>
              <span className="font-bold text-xl text-blue-600">
                IOT FAN HEALTHY
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <Link
                href="#features"
                className="text-gray-600 hover:text-blue-600"
              >
                Feature
              </Link>
              <Link
                href="#benefits"
                className="text-gray-600 hover:text-blue-600"
              >
                Useful
              </Link>
              <Link
                href="#contact"
                className="text-gray-600 hover:text-blue-600"
              >
                Contact
              </Link>
              <Link
                href="/login"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Sign up
              </Link>
            </div>
            <div className="md:hidden flex items-center">
              {/* Mobile Menu Button */}
              <button
                className="text-gray-600 hover:text-blue-600"
                onClick={toggleMenu}
              >
                <i className="fas fa-bars text-2xl"></i>
              </button>
              <div
                className={`md:hidden absolute top-16 right-0 w-full bg-white shadow-lg transition-all duration-300 ${
                  isMenuOpen
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 -translate-y-4"
                }`}
              >
                {/* เมนู Mobile */}
                {isMenuOpen && (
                  <div className="md:hidden absolute right-0 w-full bg-white shadow-lg">
                    <div className="flex flex-col space-y-4 p-4">
                      <Link
                        href="#features"
                        className="text-gray-600 hover:text-blue-600"
                        onClick={toggleMenu}
                      >
                        Feature
                      </Link>
                      <Link
                        href="#benefits"
                        className="text-gray-600 hover:text-blue-600"
                        onClick={toggleMenu}
                      >
                        Useful
                      </Link>
                      <Link
                        href="#contact"
                        className="text-gray-600 hover:text-blue-600"
                        onClick={toggleMenu}
                      >
                        Contact
                      </Link>
                      <Link
                        href="/login"
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition text-center"
                        onClick={toggleMenu}
                      >
                        Sign up
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* <!-- Hero Section --> */}
      <div className="pt-16">
        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div data-aos="fade-right">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                  IoT-based air fan system designed to monitor air quality and
                  control fan operation based on environmental conditions.
                </h1>
                <p className="text-lg md:text-xl mb-8 text-justify">
                  Control to Web Application Real-time Air Quality Monitoring
                  System
                </p>
                <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                  <Link
                    href="login.html"
                    className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition text-center"
                  >
                    Get Started
                  </Link>
                  <Link
                    href="#features"
                    className="border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-blue-600 transition text-center"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
              <div className="flex justify-center" data-aos="fade-left">
                <div className="relative">
                  <div className="w-48 h-48 md:w-72 md:h-72 bg-blue-400/30 rounded-full absolute animate-spin-slow"></div>
                  <i className="fas fa-fan text-white text-6xl md:text-9xl"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <!-- Features Section --> */}
      <div id="features" className="py-12 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16" data-aos="fade-up">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Features
            </h2>
            <p className="text-gray-600 text-center">
              Technology that can help you to monitor air quality and control
              fan
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div
              className="p-6 border border-gray-200 rounded-xl hover:shadow-lg transition"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <i className="fas fa-mobile-alt text-blue-600 text-xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Control to Web Application
              </h3>
              <p className="text-gray-600 text-center">
                Control to Web Application Real-time Air Quality Monitoring
              </p>
            </div>
            <div
              className="p-6 border border-gray-200 rounded-xl hover:shadow-lg transition"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <i className="fas fa-chart-line text-blue-600 text-xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">Create plot graph</h3>
              <p className="text-gray-600 text-justify">
                measure the temperature, humidity, and dust in the air
              </p>
            </div>
            <div
              className="p-6 border border-gray-200 rounded-xl hover:shadow-lg transition"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <i className="fas fa-clock text-blue-600 text-xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">Data Realtime</h3>
              <p className="text-gray-600 text-justify">
                Data to display in real-time
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* <!-- Benefits Section --> */}
      <div id="benefits" className="py-12 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div data-aos="fade-right">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                Useful for you
              </h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <i className="fas fa-check text-blue-600"></i>
                  </div>
                  <p className="text-gray-600 text-justify">
                    Don&apos;t have to worry about the heat
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <i className="fas fa-check text-blue-600"></i>
                  </div>
                  <p className="text-gray-600 text-justify">
                    Fan automatically to decease the temperature & Humidity &
                    Dust
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <i className="fas fa-check text-blue-600"></i>
                  </div>
                  <p className="text-gray-600 text-justify">
                    Notification when value too high
                  </p>
                </div>
              </div>
            </div>
            <div
              className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 md:p-8 text-white"
              data-aos="fade-left"
            >
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-500/20 p-3 rounded-lg">
                    <i className="fas fa-shield-alt text-2xl"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">System check history</h3>
                    <p className="text-blue-100 text-justify">
                      Can check the history of the system
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-500/20 p-3 rounded-lg">
                    <i className="fas fa-sync text-2xl"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Update Real-time</h3>
                    <p className="text-blue-100 text-justify">
                      information are updated in real-time
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <!-- Contact Section --> */}
      <div
        id="contact"
        className="py-12 md:py-24 bg-gradient-to-br from-blue-50 to-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
              Contact
            </h2>
            <p className="text-lg text-gray-600 text-center">
              Have a question or need help? Contact us anytime
            </p>
          </div>
          <div
            className="max-w-2xl mx-auto bg-white p-6 md:p-8 rounded-lg shadow-lg"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Name-Surname
                </label>
                <input
                  type="text"
                  placeholder="Please enter your name and surname"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  E-mail
                </label>
                <input
                  type="email"
                  placeholder="example@email.com"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  placeholder="Please enter your message"
                  className="w-full h-32 md:h-40 px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors shadow-sm resize-none"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium shadow-md hover:shadow-lg"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* <!-- Footer --> */}
      <footer className="bg-primary text-white py-10 bg-gradient-to-br from-blue-600 to-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div data-aos="fade-up">
              <h3 className="text-lg font-bold mb-4">About me</h3>
              <p className="text-sm text-justify">
                IOT FAN HEALTHY can help you to monitor air quality and control
                fan operation based on environmental conditions.
              </p>
            </div>
            <div data-aos="fade-up" data-aos-delay="100">
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#features" className="hover:underline">
                    Feature
                  </a>
                </li>
                <li>
                  <a href="#benefits" className="hover:underline">
                    Usage
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:underline">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Question ?
                  </a>
                </li>
              </ul>
            </div>
            <div data-aos="fade-up" data-aos-delay="200">
              <h3 className="text-lg font-bold mb-4">Follow Me</h3>
              <div className="flex justify-center md:justify-start space-x-4">
                <a href="#" className="hover:text-secondary">
                  <i className="fab fa-facebook-f text-2xl"></i>
                </a>
                <a href="#" className="hover:text-secondary">
                  <i className="fab fa-twitter text-2xl"></i>
                </a>
                <a href="#" className="hover:text-secondary">
                  <i className="fab fa-instagram text-2xl"></i>
                </a>
                <a href="#" className="hover:text-secondary">
                  <i className="fab fa-youtube text-2xl"></i>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-600 my-6"></div>
          <div className="flex flex-col md:flex-row justify-between items-center text-sm">
            <p>© 2025 IOT FAN HEALTHY. Copyright</p>
            <div className="mt-4 md:mt-0 space-x-4">
              <a href="#" className="hover:underline">
                Private Policy{" "}
              </a>
              <a href="#" className="hover:underline">
                Terms of use{" "}
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
