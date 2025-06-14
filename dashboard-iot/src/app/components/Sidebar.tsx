// Sidebar.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faHome,
  faCog,
  faClock,
  faInfoCircle,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";

type Language = "en" | "th";

type SidebarProps = {
  setIsAboutModalOpen: (value: boolean) => void;
  setIsSettingModalOpen: (value: boolean) => void;
  language: Language;
  setLanguage: (value: Language) => void;
};

const translations = {
  en: {
    home: "Home",
    settings: "Settings",
    history: "History",
    about: "About",
    logout: "Logout",
  },
  th: {
    home: "หน้าแรก",
    settings: "การตั้งค่า",
    history: "ประวัติ",
    about: "เกี่ยวกับ",
    logout: "ออกจากระบบ",
  },
};

export default function Sidebar({
  setIsAboutModalOpen,
  setIsSettingModalOpen,
  language,
//   setLanguage,
}: SidebarProps) {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    router.push("/login");
  };

  return (
    <div className="sidebar flex-shrink-0 w-full lg:w-64 bg-gradient-to-b from-gray-800 to-gray-900 p-6 shadow-xl z-10">
      <div className="lg:hidden flex items-center justify-between">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-white text-2xl hover:text-teal-400 transition-colors duration-200"
          aria-label="Toggle menu"
        >
          <FontAwesomeIcon icon={faBars} />
        </button>
        <div className="flex items-center space-x-2">
          <Image
            src="/images/profile.png"
            alt="Profile Picture"
            width={40}
            height={40}
            className="rounded-full border-2 border-teal-400"
          />
          <span className="text-white text-sm font-medium">User</span>
        </div>
      </div>
      <div className="hidden lg:flex items-center space-x-3 mt-6">
        <Image
          src="/images/profile.png"
          alt="Profile Picture"
          width={50}
          height={50}
          className="rounded-full border-2 border-teal-400"
        />
        <span className="text-white text-lg font-semibold">User</span>
      </div>
      <div
        className={`${
          isMobileMenuOpen ? "flex" : "hidden"
        } lg:flex flex-col gap-4 mt-8`}
      >
        <Link
          href="/dashboard"
          className="flex items-center space-x-3 text-white hover:bg-gray-700 hover:text-teal-400 rounded-lg p-3 transition-all duration-200 group"
        >
          <FontAwesomeIcon
            icon={faHome}
            className="text-xl group-hover:scale-110 transition-transform duration-200"
          />
          <span className="text-base">{translations[language].home}</span>
        </Link>
        <button
          onClick={() => setIsSettingModalOpen(true)}
          className="flex items-center space-x-3 text-white hover:bg-gray-700 hover:text-orange-400 rounded-lg p-3 transition-all duration-200 group text-left"
        >
          <FontAwesomeIcon
            icon={faCog}
            className="text-xl group-hover:scale-110 transition-transform duration-200"
          />
          <span className="text-base">{translations[language].settings}</span>
        </button>
        <Link
          href="/history"
          className="flex items-center space-x-3 text-white hover:bg-gray-700 hover:text-pink-400 rounded-lg p-3 transition-all duration-200 group text-left"
        >
          <FontAwesomeIcon
            icon={faClock}
            className="text-xl group-hover:scale-110 transition-transform duration-200"
          />
          <span className="text-base">{translations[language].history}</span>
        </Link>
        <button
          onClick={() => setIsAboutModalOpen(true)}
          className="flex items-center space-x-3 text-white hover:bg-gray-700 hover:text-blue-400 rounded-lg p-3 transition-all duration-200 group text-left"
        >
          <FontAwesomeIcon
            icon={faInfoCircle}
            className="text-xl group-hover:scale-110 transition-transform duration-200"
          />
          <span className="text-base">{translations[language].about}</span>
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 text-white hover:bg-gray-700 hover:text-red-400 rounded-lg p-3 transition-all duration-200 group"
        >
          <FontAwesomeIcon
            icon={faSignOutAlt}
            className="text-xl group-hover:scale-110 transition-transform duration-200"
          />
          <span className="text-base">{translations[language].logout}</span>
        </button>
      </div>
    </div>
  );
}