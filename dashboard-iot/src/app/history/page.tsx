"use client";

import { useState, useEffect } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Model from "../components/Model";
import { db } from "../lib/firebase";
import { ref, onValue } from "firebase/database";
import { SensorData, generateMockData } from "../lib/MockData";

const translations = {
  en: {
    title: "Healthy Air for All",
    historyData: "History Data",
    noData: "No data available for the selected date",
  },
  th: {
    title: "Healthy Air for All",
    historyData: "ประวัติข้อมูล",
    noData: "ไม่มีข้อมูลสำหรับวันที่เลือก",
  },
};

type Language = keyof typeof translations;

export default function History() {
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isSettingModalOpen, setIsSettingModalOpen] = useState(false);
  const [theme, setTheme] = useState("light"); // ค่าเริ่มต้นคงที่สำหรับ SSR
  const [language, setLanguage] = useState<Language>("en"); // ค่าเริ่มต้นคงที่สำหรับ SSR
  const [selectedDate, setSelectedDate] = useState("");
  const [data, setData] = useState<SensorData[]>([]);
  const [error, setError] = useState<string | null>(null);

  // ซิงค์ theme และ language จาก localStorage หลัง hydration
  useEffect(() => {
    const savedTheme = typeof window !== "undefined" ? localStorage.getItem("theme") : null;
    if (savedTheme) setTheme(savedTheme);

    const savedLanguage = typeof window !== "undefined" ? (localStorage.getItem("language") as Language) : null;
    if (savedLanguage) setLanguage(savedLanguage);
  }, []);

  // Apply theme to document
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", theme);
    }
  }, [theme]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("language", language);
    }
  }, [language]);

  // ตั้งค่า selectedDate เริ่มต้นจากไคลเอ็นต์
  useEffect(() => {
    if (typeof window !== "undefined" && !selectedDate) {
      const now = new Date();
      const thaiDateStr = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Bangkok",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(now);
      setSelectedDate(thaiDateStr);
    }
  }, [selectedDate]);

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
        const results: SensorData[] = Object.values(firebaseData).map(
          (item) => {
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
          }
        );

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

  // Filter data by selected date
  const filteredData = data.filter((item) => {
    const [datePart] = item.timestamp.split(" ");
    const [day, month, year] = datePart.split("-");
    const itemDate = new Date(`${year}-${month}-${day}`).toISOString().split("T")[0];
    return selectedDate ? itemDate === selectedDate : true;
  });

  return (
    <div className="flex flex-col lg:flex-row w-screen h-screen font-sans bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Sidebar */}
      <Sidebar
        setIsAboutModalOpen={setIsAboutModalOpen}
        setIsSettingModalOpen={setIsSettingModalOpen}
        language={language}
        setLanguage={setLanguage}
      />

      {/* History Content */}
      <div className="dashboard flex-grow p-4 sm:p-6 lg:p-8 lg:w-[calc(100%-16rem)] overflow-auto bg-gray-50 dark:bg-gray-900">
        {error && (
          <div className="text-red-600 dark:text-red-400 p-4 bg-red-100 dark:bg-red-800/30 rounded-lg mb-6 animate-fade-in">
            {error}
          </div>
        )}
        <Header language={language} setLanguage={setLanguage} />

        <section>
          <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">
            {translations[language].historyData}
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
                  <th className="px-6 py-3 text-center rounded-tl-lg">
                    Timestamp
                  </th>
                  <th className="px-6 py-3 text-center">Temperature (°C)</th>
                  <th className="px-6 py-3 text-center">Humidity (RH)</th>
                  <th className="px-6 py-3 text-center rounded-tr-lg">
                    Smoke Level (µg/m³)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredData.length > 0 ? (
                  filteredData.map((item, index) => (
                    <tr
                      key={index}
                      className="hover:bg-teal-50 dark:hover:bg-teal-900 transition ease-in-out duration-300"
                    >
                      <td className="px-6 py-3 text-center">
                        {formatTimestamp(item.timestamp)}
                      </td>
                      <td className="px-6 py-3 text-center">
                        {item.temperature}
                      </td>
                      <td className="px-6 py-3 text-center">{item.humidity}</td>
                      <td className="px-6 py-3 text-center">
                        {item.smoke_level}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-3 text-center text-red-500 dark:text-red-400"
                    >
                      {translations[language].noData}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <Model
        isAboutModalOpen={isAboutModalOpen}
        setIsAboutModalOpen={setIsAboutModalOpen}
        isSettingModalOpen={isSettingModalOpen}
        setIsSettingModalOpen={setIsSettingModalOpen}
        theme={theme}
        setTheme={setTheme}
        language={language}
        setLanguage={setLanguage}
      />
    </div>
  );
}