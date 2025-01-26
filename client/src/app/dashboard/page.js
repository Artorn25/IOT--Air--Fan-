"use client";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import { useState, useEffect } from "react";

// AfterLogin
import Sidebar from "../pages/AfterLogin/Sidebar";
import Header from "../pages/AfterLogin/Header";
import Loading from "../pages/AfterLogin/Loading";

export default function Dashboard() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isSettingModalOpen, setIsSettingModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // จำลองการโหลดข้อมูลด้วย setTimeout
      setTimeout(() => {
        setIsLoading(false); // โหลดเสร็จแล้ว
      }, 2000); // จำลองเวลาโหลด 2 วินาที
    };

    fetchData();
  }, []);

  // ใช้ useEffect เพื่อให้โค้ดที่เกี่ยวข้องกับ document ทำงานเฉพาะบนไคลเอนต์
  useEffect(() => {
    const menuButton = document.getElementById("menuButton");
    const menuItems = document.getElementById("menuItemsmobile");

    if (menuButton && menuItems) {
      menuButton.addEventListener("click", () => {
        menuItems.classList.toggle("hidden");
      });
    }

    // ทำความสะอาด event listener เมื่อคอมโพเนนต์ถูกถอดออก
    return () => {
      if (menuButton) {
        menuButton.removeEventListener("click", () => {
          menuItems.classList.toggle("hidden");
        });
      }
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const openModalAbout = () => {
    setIsAboutModalOpen(true);
  };

  const closeModalAbout = () => {
    setIsAboutModalOpen(false);
  };

  const openModalSetting = () => {
    setIsSettingModalOpen(true);
  };

  const closeModalSetting = () => {
    setIsSettingModalOpen(false);
  };

  const saveSettings = () => {
    const theme = document.getElementById("themeSelect").value;
    const language = document.getElementById("languageSelect").value;

    console.log("Theme:", theme);
    console.log("Language:", language);

    closeModalSetting();
  };

  const setThaiDate = () => {
    const today = new Date();
    const thailandOffset = 7 * 60 * 60 * 1000; // 7 ชั่วโมงในหน่วยมิลลิวินาที
    const thaiTime = new Date(today.getTime() + thailandOffset);
    const thaiYear = thaiTime.getFullYear() + 543;
    const formattedDate = [
      thaiYear,
      String(thaiTime.getMonth() + 1).padStart(2, "0"),
      String(thaiTime.getDate()).padStart(2, "0"),
    ].join("-");

    const datePicker = document.getElementById("datePicker");
    if (datePicker) {
      datePicker.value = formattedDate;
    }
  };

  // เรียก setThaiDate เมื่อโหลดหน้าเว็บ
  useEffect(() => {
    setThaiDate();
  }, []);
  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      {/* โหลด Chart.js จาก CDN */}
      <Script
        src="https://cdn.jsdelivr.net/npm/chart.js"
        strategy="lazyOnload" // โหลดสคริปต์เมื่อหน้าเว็บโหลดเสร็จ
        onLoad={() => {
          console.log("Chart.js has been loaded");
        }}
      />

      <div className="flex flex-col lg:flex-row w-screen h-screen">
        {/* <!-- Sidebar --> */}
        <Sidebar />

        {/* <!-- Dashboard --> */}
        <Header />
      </div>

      {/* About Modal */}
      <div
        id="modal_about"
        className={`fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center ${
          isAboutModalOpen ? "" : "hidden"
        } z-20`}
      >
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-xl w-full">
          <h2 className="text-xl font-bold text-gray-900 mb-4">About Us</h2>
          <p className="text-gray-700 mb-2">
            Welcome to <strong>Healthy Air for All</strong>, your comprehensive
            solution for real-time air quality monitoring. Our platform provides
            essential data to ensure a healthier living environment for
            everyone.
          </p>
          <h3 className="text-lg font-semibold text-gray-800 mt-4">
            Our Mission
          </h3>
          <p className="text-gray-700">
            At Healthy Air for All, we aim to empower communities with reliable
            tools to monitor and improve air quality.
          </p>
          <h3 className="text-lg font-semibold text-gray-800 mt-4">
            Key Features
          </h3>
          <ul className="list-disc list-inside text-gray-700">
            <li>Real-Time Monitoring</li>
            <li>Interactive Dashboard</li>
            <li>Personalized Experience</li>
            <li>Historical Data</li>
          </ul>
          <h3 className="text-lg font-semibold text-gray-800 mt-4">
            Why Choose Us?
          </h3>
          <p className="text-gray-700">
            Healthy Air for All stands out with its intuitive design, reliable
            data, and commitment to creating a healthier environment.
          </p>
          <div className="mt-4 flex justify-end">
            <button
              onClick={closeModalAbout}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Setting Modal */}
      <div
        id="modal_setting"
        className={`fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center ${
          isSettingModalOpen ? "" : "hidden"
        } z-20`}
      >
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-800">Setting</h2>
          <p className="mt-3 text-gray-600">
            Customize your preferences here. Adjust the settings as needed.
          </p>

          {/* <!-- ตัวเลือกการตั้งค่า --> */}
          <div className="mt-4 space-y-4">
            <div>
              <label
                htmlFor="themeSelect"
                className="block text-gray-700 font-medium"
              >
                Theme:
              </label>
              <select
                id="themeSelect"
                className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System Default</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="languageSelect"
                className="block text-gray-700 font-medium"
              >
                Language:
              </label>
              <select
                id="languageSelect"
                className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
              >
                <option value="en">English</option>
                <option value="th">ภาษาไทย</option>
                <option value="es">Español</option>
              </select>
            </div>
          </div>

          {/* <!-- ปุ่มจัดการ --> */}
          <div className="mt-6 flex justify-end gap-4">
            <button
              onClick={saveSettings}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
            >
              Save
            </button>
            <button
              onClick={closeModalSetting}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
