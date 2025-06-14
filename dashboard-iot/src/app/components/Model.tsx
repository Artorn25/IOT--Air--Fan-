"use client";

import { useEffect } from "react";

type Language = 'en' | 'th';

type ModelProps = {
  isAboutModalOpen: boolean;
  setIsAboutModalOpen: (value: boolean) => void;
  isSettingModalOpen: boolean;
  setIsSettingModalOpen: (value: boolean) => void;
  theme: string;
  setTheme: (value: string) => void;
  language: Language;
  setLanguage: (value: Language) => void;
};

const translations: Record<Language, {
  aboutTitle: string;
  aboutWelcome: string;
  missionTitle: string;
  missionText: string;
  featuresTitle: string;
  featuresList: string[];
  whyUsTitle: string;
  whyUsText: string;
  close: string;
  settingsTitle: string;
  settingsDescription: string;
  themeLabel: string;
  save: string;
}> = {
  en: {
    aboutTitle: "About Us",
    aboutWelcome: "Welcome to <strong>Healthy Air for All</strong>, a comprehensive solution for real-time air quality monitoring.",
    missionTitle: "Our Mission",
    missionText: "At Healthy Air for All, we are committed to empowering communities with reliable tools to monitor and improve air quality.",
    featuresTitle: "Key Features",
    featuresList: ["Real-time monitoring", "Interactive dashboard", "Customizable experience", "Historical data"],
    whyUsTitle: "Why Choose Us?",
    whyUsText: "Healthy Air for All stands out with its user-friendly design, reliable data, and commitment to creating a healthier environment.",
    close: "Close",
    settingsTitle: "Settings",
    settingsDescription: "Customize the display theme",
    themeLabel: "Theme:",
    save: "Save",
  },
  th: {
    aboutTitle: "เกี่ยวกับเรา",
    aboutWelcome: "ยินดีต้อนรับสู่ <strong>Healthy Air for All</strong> โซลูชันครบวงจรสำหรับการตรวจสอบคุณภาพอากาศแบบเรียลไทม์",
    missionTitle: "ภารกิจของเรา",
    missionText: "ที่ Healthy Air for All เรามุ่งมั่นที่จะเสริมพลังให้ชุมชนด้วยเครื่องมือที่เชื่อถือได้เพื่อตรวจสอบและปรับปรุงคุณภาพอากาศ",
    featuresTitle: "คุณสมบัติหลัก",
    featuresList: ["การตรวจสอบแบบเรียลไทม์", "แดชบอร์ดแบบโต้ตอบ", "ประสบการณ์ที่ปรับแต่งได้", "ข้อมูลย้อนหลัง"],
    whyUsTitle: "ทำไมต้องเลือกเรา?",
    whyUsText: "Healthy Air for All โดดเด่นด้วยการออกแบบที่ใช้งานง่าย ข้อมูลที่เชื่อถือได้ และความมุ่งมั่นในการสร้างสภาพแวดล้อมที่สุขภาพดี",
    close: "ปิด",
    settingsTitle: "การตั้งค่า",
    settingsDescription: "ปรับแต่งธีมของการแสดงผล",
    themeLabel: "ธีม:",
    save: "บันทึก",
  },
};

export default function Model({
  isAboutModalOpen,
  setIsAboutModalOpen,
  isSettingModalOpen,
  setIsSettingModalOpen,
  theme,
  setTheme,
  language,
//   setLanguage,
}: ModelProps) {
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const saveSettings = () => {
    localStorage.setItem("theme", theme);
    setIsSettingModalOpen(false);
  };

  return (
    <>
      <div
        className={`${
          isAboutModalOpen ? "flex" : "hidden"
        } fixed inset-0 bg-gray-900 bg-opacity-60 flex justify-center items-center z-50 backdrop-blur-sm`}
      >
        <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-2xl max-w-lg w-full transform transition-all duration-300 scale-100 animate-slide-in">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {translations[language].aboutTitle}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4" dangerouslySetInnerHTML={{ __html: translations[language].aboutWelcome }} />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-4">
            {translations[language].missionTitle}
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            {translations[language].missionText}
          </p>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-4">
            {translations[language].featuresTitle}
          </h3>
          <ul className="list-disc list-inside text-gray-600 dark:text-gray-300">
            {translations[language].featuresList.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-4">
            {translations[language].whyUsTitle}
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            {translations[language].whyUsText}
          </p>
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setIsAboutModalOpen(false)}
              className="bg-teal-500 text-white px-5 py-2 rounded-lg hover:bg-teal-600 transition-colors duration-200 shadow-sm"
            >
              {translations[language].close}
            </button>
          </div>
        </div>
      </div>

      <div
        className={`${
          isSettingModalOpen ? "flex" : "hidden"
        } fixed bottom-4 right-4 bg-gray-900 bg-opacity-60 flex justify-center items-center z-50 backdrop-blur-sm`}
      >
        <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-2xl max-w-sm w-full transform transition-all duration-300 scale-100 animate-slide-in">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {translations[language].settingsTitle}
          </h2>
          <p className="mt-3 text-gray-600 dark:text-gray-300">
            {translations[language].settingsDescription}
          </p>
          <div className="mt-4 space-y-6">
            <div>
              <label
                htmlFor="themeSelect"
                className="block text-gray-700 dark:text-gray-300 font-medium"
              >
                {translations[language].themeLabel}
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
          </div>
          <div className="mt-6 flex justify-end gap-4">
            <button
              onClick={saveSettings}
              className="bg-green-500 text-white px-5 py-2 rounded-lg hover:bg-green-600 transition-colors duration-200 shadow-sm"
            >
              {translations[language].save}
            </button>
            <button
              onClick={() => setIsSettingModalOpen(false)}
              className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200 shadow-sm"
            >
              {translations[language].close}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}