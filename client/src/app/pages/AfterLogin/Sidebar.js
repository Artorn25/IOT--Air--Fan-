'use client';

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Sidebar() {
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isSettingModalOpen, setIsSettingModalOpen] = useState(false);

  const openModalSetting = () => {
    setIsSettingModalOpen(true);
  };

  const openModalAbout = () => {
    setIsAboutModalOpen(true);
  };

  return (
    <>
      {/* <!-- Sidebar --> */}
      <div className="sidebar flex-shrink-0 w-full lg:w-[250px] bg-gray-800 p-6 shadow-lg z-10">
        {/* <!-- Mobile Menu Button --> */}
        <div className="lg:hidden justify-between flex items-center">
          <button id="menuButton" className="text-white text-2xl">
            <i className="fas fa-bars"></i>
          </button>

          {/* <!-- Profile Section mobile--> */}
          <div className="profile-container justify-end">
            <Image
              src="/profile.png"
              width={50}
              height={50}
              alt="Profile Picture"
              className="profile-image"
            />
            <span className="profile-name">User</span>
          </div>
        </div>

        {/* <!-- Profile Section --> */}
        <div className="profile-container hidden lg:flex">
          <Image
            src="/profile.png"
            width={50}
            height={50}
            alt="Profile Picture"
            className="profile-image"
          />
          <span className="profile-name">User</span>
        </div>

        {/* <!-- Menu Items --> */}
        <div
          className="hidden lg:flex icon-group flex-col justify-center gap-6 lg:gap-8 mt-6"
          id="menuItems"
        >
          {/* <!-- Home --> */}
          <Link
            href="/dashboard"
            className="icon text-white hover:text-green-500 transition-colors duration-300 flex items-center space-x-3"
          >
            <i className="fas fa-home text-2xl"></i>
            <span className="text-sm lg:text-base">Home</span>
          </Link>

          {/* <!-- Settings --> */}
          <Link
            href="/settings"
            className="icon text-white hover:text-orange-500 transition-colors duration-300 flex items-center space-x-3"
            onClick={openModalSetting} 
          >
            <i className="fas fa-cog text-2xl"></i>
            <span className="text-sm lg:text-base">Settings</span>
          </Link>

          {/* <!-- History --> */}
          <Link
            href="/history"
            className="icon text-white hover:text-pink-500 transition-colors duration-300 flex items-center space-x-3"
          >
            <i className="fas fa-clock text-2xl"></i>
            <span className="text-sm lg:text-base">History</span>
          </Link>

          {/* <!-- About --> */}
          <Link
            href="#"
            className="icon text-white hover:text-blue-500 transition-colors duration-300 flex items-center space-x-3 mt-4"
            onClick={openModalAbout}
          >
            <i className="fas fa-info-circle text-2xl"></i>
            <span className="text-sm lg:text-base">About</span>
          </Link>

          {/* <!-- Logout --> */}
          <Link
            href="/"
            className="icon text-white hover:text-red-500 transition-colors duration-300 flex items-center space-x-3 mt-4"
          >
            <i className="fas fa-sign-out-alt text-2xl"></i>
            <span className="text-sm lg:text-base">Logout</span>
          </Link>
        </div>

        {/* <!-- Menu Items mobile--> */}
        <div
          className="fixed bg-gray-600 p-6 hidden flex icon-group flex-col justify-center gap-6 lg:gap-8 mt-6"
          id="menuItemsmobile"
        >
          {/* <!-- Home --> */}
          <Link
            href="/dashboard"
            className="icon text-white hover:text-green-500 transition-colors duration-300 flex items-center space-x-3"
          >
            <i className="fas fa-home text-2xl"></i>
            <span className="text-sm lg:text-base">Home </span>
          </Link>

          {/* <!-- Settings --> */}
          <Link
            href="#"
            className="icon text-white hover:text-orange-500 transition-colors duration-300 flex items-center space-x-3"
            onClick={openModalSetting}
          >
            <i className="fas fa-cog text-2xl"></i>
            <span className="text-sm lg:text-base">Settings</span>
          </Link>

          {/* <!-- History --> */}
          <Link
            href="/history"
            className="icon text-white hover:text-pink-500 transition-colors duration-300 flex items-center space-x-3"
          >
            <i className="fas fa-clock text-2xl"></i>
            <span className="text-sm lg:text-base">History</span>
          </Link>

          {/* <!-- About --> */}
          <Link
            href="#"
            className="icon text-white hover:text-blue-500 transition-colors duration-300 flex items-center space-x-3 mt-4"
            onClick={openModalAbout}
          >
            <i className="fas fa-info-circle text-2xl"></i>
            <span className="text-sm lg:text-base">About</span>
          </Link>

          {/* <!-- Logout --> */}
          <Link
            href="/"
            className="icon text-white hover:text-red-500 transition-colors duration-300 flex items-center space-x-3 mt-4"
          >
            <i className="fas fa-sign-out-alt text-2xl"></i>
            <span className="text-sm lg:text-base">Logout</span>
          </Link>
        </div>
      </div>
    </>
  );
}