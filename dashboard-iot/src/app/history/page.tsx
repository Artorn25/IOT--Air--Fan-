"use client";

import { useState, useEffect } from "react";
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
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { db } from "../lib/firebase";
import { ref, onValue } from "firebase/database";
import { SensorData, generateMockData } from "../lib/MockData";

export default function History() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isSettingModalOpen, setIsSettingModalOpen] = useState(false);
  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("en");
  const [selectedDate, setSelectedDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState<SensorData[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Apply theme to document
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  // Set default date to today (Thailand time)
  useEffect(() => {
    const today = new Date();
    const thailandOffset = 7 * 60 * 60 * 1000; // GMT+7
    const thaiTime = new Date(today.getTime() + thailandOffset);
    const formattedDate = [
      thaiTime.getFullYear(),
      String(thaiTime.getMonth() + 1).padStart(2, "0"),
      String(thaiTime.getDate()).padStart(2, "0"),
    ].join("-");
    setSelectedDate(formattedDate); // Default to 2025-06-14
  }, []);

  // Fetch data from Firebase
  useEffect(() => {
    const dataRef = ref(db, "esp8266_data");
    const unsubscribe = onValue(
      dataRef,
      (snapshot) => {
        const firebaseData = snapshot.val();
        if (!firebaseData) {
          console.log("No data available from Firebase, using mock data");
          setError("No data available from Firebase, displaying mock data.");
          setData(generateMockData(10));
          return;
        }

        setError(null);
        const results: SensorData[] = Object.values(firebaseData).map((item) => {
          const dataItem = item as {
            timestamp?: string;
            temperature?: number | string;
            humidity?: number | string;
            smoke_level?: number | string;
          };
          return {
            timestamp: dataItem.timestamp || "0",
            temperature: parseInt(String(dataItem.temperature), 10) || 0,
            humidity: parseInt(String(dataItem.humidity), 10) || 0,
            smoke_level: parseInt(String(dataItem.smoke_level), 10) || 0,
          };
        });

        results.sort((a, b) => {
          const parseTimestamp = (ts: string) => {
            const [datePart] = ts.split(" ");
            const [day, month, year] = datePart.split("-");
            return new Date(`${year}-${month}-${day}`).getTime();
          };
          return parseTimestamp(b.timestamp) - parseTimestamp(a.timestamp);
        });

        console.log("Raw data from Firebase:", results); // Debug raw data
        setData(results);
      },
      (error) => {
        console.error("Firebase error:", error);
        setError("Failed to fetch data from Firebase. Displaying mock data.");
        setData(generateMockData(10));
      }
    );

    return () => unsubscribe();
  }, []);

  // Update date/time display
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const thailandOffset = 7 * 60 * 60 * 1000; // GMT+7
      const thaiTime = new Date(now.getTime() + thailandOffset);
      const day = thaiTime.getDate();
      const month = thaiTime.toLocaleString("th-TH", { month: "long" });
      const year = thaiTime.getFullYear() + 543;
      const time = thaiTime.toLocaleTimeString("th-TH");
      document.getElementById(
        "datetime"
      )!.textContent = `วันที่: ${day} ${month} ${year} เวลา: ${time}`;
    };
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Convert timestamp to Buddhist Era format
  const formatTimestamp = (timestamp: string) => {
    try {
      const [datePart, timePart] = timestamp.split(" ");
      const [day, month, year] = datePart.split("-");
      const buddhistYear = parseInt(year) + 543;
      return `${timePart} ${day}/${month}/${buddhistYear}`; // e.g., "12:38:36 30/11/2567"
    } catch {
      return timestamp;
    }
  };

  // Filter data by selected date and search query
  const filteredData = data.filter((item) => {
    const [datePart] = item.timestamp.split(" ");
    const [day, month, year] = datePart.split("-");
    const itemDate = new Date(`${year}-${month}-${day}`).toISOString().split("T")[0]; // e.g., "2024-11-30"
    const matchesDate = selectedDate ? itemDate === selectedDate : true;
    const matchesSearch = searchQuery
      ? item.timestamp.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.temperature.toString().includes(searchQuery) ||
        item.humidity.toString().includes(searchQuery) ||
        item.smoke_level.toString().includes(searchQuery)
      : true;

    console.log("Item Date:", itemDate, "Selected Date:", selectedDate, "Match:", matchesDate); // Debug
    return matchesDate && matchesSearch;
  });

  const handleLogout = () => {
    router.push("/login");
  };

  const saveSettings = () => {
    console.log("Theme:", theme);
    console.log("Language:", language);
    setIsSettingModalOpen(false);
  };

  return (
    <div className="flex flex-col lg:flex-row w-screen h-screen font-sans bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Sidebar */}
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
            <FontAwesomeIcon icon={faHome} className="text-xl group-hover:scale-110 transition-transform duration-200" />
            <span className="text-base">Home</span>
          </Link>
          <button
            onClick={() => setIsSettingModalOpen(true)}
            className="flex items-center space-x-3 text-white hover:bg-gray-700 hover:text-orange-400 rounded-lg p-3 transition-all duration-200 group text-left"
          >
            <FontAwesomeIcon icon={faCog} className="text-xl group-hover:scale-110 transition-transform duration-200" />
            <span className="text-base">Settings</span>
          </button>
          <Link
            href="/history"
            className="flex items-center space-x-3 text-white hover:bg-gray-700 hover:text-pink-400 rounded-lg p-3 transition-all duration-200 group"
          >
            <FontAwesomeIcon icon={faClock} className="text-xl group-hover:scale-110 transition-transform duration-200" />
            <span className="text-base">History</span>
          </Link>
          <button
            onClick={() => setIsAboutModalOpen(true)}
            className="flex items-center space-x-3 text-white hover:bg-gray-700 hover:text-blue-400 rounded-lg p-3 transition-all duration-200 group text-left"
          >
            <FontAwesomeIcon icon={faInfoCircle} className="text-xl group-hover:scale-110 transition-transform duration-200" />
            <span className="text-base">About</span>
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 text-white hover:bg-gray-700 hover:text-red-400 rounded-lg p-3 transition-all duration-200 group"
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="text-xl group-hover:scale-110 transition-transform duration-200" />
            <span className="text-base">Logout</span>
          </button>
        </div>
      </div>

      {/* History Content */}
      <div className="dashboard flex-grow p-4 sm:p-6 lg:p-8 lg:w-[calc(100%-16rem)] overflow-auto bg-gray-50 dark:bg-gray-900">
        {error && (
          <div className="text-red-600 dark:text-red-400 p-4 bg-red-100 dark:bg-red-800/30 rounded-lg mb-6 animate-fade-in">
            {error}
          </div>
        )}
        <header className="flex flex-col lg:flex-row justify-between items-center mb-8 px-4 sm:px-6 lg:px-0 space-y-6 lg:space-y-0">
          <div className="flex flex-col items-center lg:items-start space-y-4">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-500 via-blue-500 to-green-500 animate-gradient-x flex items-center space-x-3">
              <Image
                src="/images/fresh-air.png"
                width={40}
                height={40}
                alt="Fresh Air Icon"
                className="animate-pulse"
              />
              <span>Healthy Air for All</span>
            </h1>
          </div>
          <div className="flex flex-col sm:flex-row items-center sm:space-x-4 space-y-4 sm:space-y-0">
            <p
              id="datetime"
              className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 py-2 px-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
            >
              วันที่: Loading...
            </p>
            <div className="relative flex items-center w-full sm:w-auto">
              <input
                type="text"
                id="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="p-3 pl-10 pr-4 w-full sm:w-64 lg:w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full shadow-sm focus:ring-2 focus:ring-teal-400 focus:border-teal-400 dark:focus:ring-teal-500 dark:focus:border-teal-500 transition-all duration-300 text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500"
                placeholder="ค้นหา..."
              />
              <FontAwesomeIcon
                icon={faSearch}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 text-lg"
              />
            </div>
          </div>
        </header>

        <section>
          <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">
            ประวัติข้อมูล
          </h3>
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
            <input
              type="date"
              id="datePicker"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-400 dark:focus:ring-teal-500 text-gray-700 dark:text-gray-300"
            />
          </div>
          <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-6 animate-fade-in">
            <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300 border-collapse">
              <thead className="bg-teal-600 dark:bg-teal-700 text-white">
                <tr>
                  <th className="px-6 py-3 text-center rounded-tl-lg">Timestamp</th>
                  <th className="px-6 py-3 text-center">Temperature (°C)</th>
                  <th className="px-6 py-3 text-center">Humidity (RH)</th>
                  <th className="px-6 py-3 text-center rounded-tr-lg">Smoke Level (µg/m³)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredData.length > 0 ? (
                  filteredData.map((item, index) => (
                    <tr
                      key={index}
                      className="hover:bg-teal-50 dark:hover:bg-teal-900 transition ease-in-out duration-300"
                    >
                      <td className="px-6 py-3 text-center">{formatTimestamp(item.timestamp)}</td>
                      <td className="px-6 py-3 text-center">{item.temperature}</td>
                      <td className="px-6 py-3 text-center">{item.humidity}</td>
                      <td className="px-6 py-3 text-center">{item.smoke_level}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-3 text-center text-red-500 dark:text-red-400">
                      ไม่มีข้อมูลสำหรับวันที่เลือก
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* About Modal */}
      {isAboutModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-60 flex justify-center items-center z-50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-2xl max-w-lg w-full transform transition-all duration-300 scale-100 animate-slide-in">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              เกี่ยวกับเรา
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              ยินดีต้อนรับสู่ <strong>Healthy Air for All</strong> โซลูชันครบวงจรสำหรับการตรวจสอบคุณภาพอากาศแบบเรียลไทม์
            </p>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-4">
              ภารกิจของเรา
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              ที่ Healthy Air for All เรามุ่งมั่นที่จะเสริมพลังให้ชุมชนด้วยเครื่องมือที่เชื่อถือได้เพื่อตรวจสอบและปรับปรุงคุณภาพอากาศ
            </p>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-4">
              คุณสมบัติหลัก
            </h3>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300">
              <li>การตรวจสอบแบบเรียลไทม์</li>
              <li>แดชบอร์ดแบบโต้ตอบ</li>
              <li>ประสบการณ์ที่ปรับแต่งได้</li>
              <li>ข้อมูลย้อนหลัง</li>
            </ul>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-4">
              ทำไมต้องเลือกเรา?
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Healthy Air for All โดดเด่นด้วยการออกแบบที่ใช้งานง่าย ข้อมูลที่เชื่อถือได้ และความมุ่งมั่นในการสร้างสภาพแวดล้อมที่สุขภาพดี
            </p>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setIsAboutModalOpen(false)}
                className="bg-teal-500 text-white px-5 py-2 rounded-lg hover:bg-teal-600 transition-colors duration-200 shadow-sm"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Setting Modal */}
      {isSettingModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-60 flex justify-center items-center z-50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300 scale-100 animate-slide-in">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              การตั้งค่า
            </h2>
            <p className="mt-3 text-gray-600 dark:text-gray-300">
              ปรับแต่งการตั้งค่าของคุณที่นี่
            </p>
            <div className="mt-4 space-y-6">
              <div>
                <label
                  htmlFor="themeSelect"
                  className="block text-gray-700 dark:text-gray-300 font-medium"
                >
                  ธีม:
                </label>
                <select
                  id="themeSelect"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="mt-1 w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-400 dark:focus:ring-teal-500 text-gray-700 dark:text-gray-300"
                >
                  <option value="light">สว่าง</option>
                  <option value="dark">มืด</option>
                  <option value="system">ตามระบบ</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="languageSelect"
                  className="block text-gray-700 dark:text-gray-300 font-medium"
                >
                  ภาษา:
                </label>
                <select
                  id="languageSelect"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="mt-1 w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-400 dark:focus:ring-teal-500 text-gray-700 dark:text-gray-300"
                >
                  <option value="en">English</option>
                  <option value="th">ภาษาไทย</option>
                  <option value="es">Español</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={saveSettings}
                className="bg-green-500 text-white px-5 py-2 rounded-lg hover:bg-green-600 transition-colors duration-200 shadow-sm"
              >
                บันทึก
              </button>
              <button
                onClick={() => setIsSettingModalOpen(false)}
                className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200 shadow-sm"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}