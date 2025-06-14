import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faChevronDown } from "@fortawesome/free-solid-svg-icons";

const translations = {
  en: { title: "Healthy Air for All", search: "Search...", short: "EN", full: "English" },
  th: { title: "Healthy Air for All", search: "ค้นหา...", short: "TH", full: "ไทย" },
};

type Language = "en" | "th";

type HeaderProps = {
  language: Language;
  setLanguage: (value: Language) => void;
};

export default function Header({ language, setLanguage }: HeaderProps) {
  const [dateTimeDisplay, setDateTimeDisplay] = useState<string>("");
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Bangkok",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      };
      const formatter = new Intl.DateTimeFormat(
        language === "th" ? "th-TH" : "en-US",
        options
      );
      const parts = formatter.formatToParts(now);

      let day = "",
        month = "",
        year = "",
        hour = "",
        minute = "",
        second = "";
      parts.forEach((part) => {
        switch (part.type) {
          case "day":
            day = part.value;
            break;
          case "month":
            month = part.value;
            break;
          case "year":
            year = part.value;
            break;
          case "hour":
            hour = part.value;
            break;
          case "minute":
            minute = part.value;
            break;
          case "second":
            second = part.value;
            break;
        }
      });

      const buddhistYear = language === "th" ? parseInt(year) : year;
      const formattedDisplay =
        language === "th"
          ? `วันที่: ${day} ${month} ${buddhistYear} เวลา: ${hour}:${minute}:${second}`
          : `${day} ${month} ${year}, ${hour}:${minute}:${second}`;
      setDateTimeDisplay(formattedDisplay);
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, [language]);

  const toggleLanguageDropdown = () => {
    setIsLanguageOpen(!isLanguageOpen);
  };

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setIsLanguageOpen(false);
  };

  return (
    <header className="flex flex-col lg:flex-row justify-between items-center mb-8 px-4 sm:px-6 lg:px-0 space-y-6 lg:space-y-0">
      <div className="flex flex-col items-center lg:items-start space-y-4">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-500 via-blue-500 to-green-500 animate-gradient-x flex items-center flex-row-reverse space-x-3 space-x-reverse">
          <Image
            src="/images/fresh-air.png"
            width={40}
            height={40}
            alt="Fresh Air Icon"
            className="animate-pulse"
          />
          <span>{translations[language].title}</span>
        </h1>
      </div>
      <div className="flex flex-col sm:flex-row items-center sm:space-x-4 space-y-4 sm:space-y-0">
        <p
          id="datetime"
          className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 py-2 px-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
        >
          {dateTimeDisplay}
        </p>
        <div className="flex items-center space-x-2">
          <div className="relative flex items-center">
            <input
              type="text"
              id="search"
              className="p-3 pl-10 pr-4 w-full sm:w-64 lg:w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full shadow-sm focus:ring-2 focus:ring-teal-400 focus:border-teal-400 dark:focus:ring-teal-500 dark:focus:border-teal-500 transition-all duration-300 text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500"
              placeholder={translations[language].search}
            />
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 text-lg"
            />
          </div>
          
          {/* Custom Dropdown for Language Selection */}
          <div className="relative">
            <button
              onClick={toggleLanguageDropdown}
              className="flex items-center justify-center p-2 w-16 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 text-gray-700 dark:text-gray-300 text-sm"
            >
              <span>{translations[language].short}</span>
              <FontAwesomeIcon 
                icon={faChevronDown} 
                className={`ml-1 text-gray-400 dark:text-gray-500 text-xs transition-transform duration-200 ${isLanguageOpen ? 'transform rotate-180' : ''}`} 
              />
            </button>
            
            {isLanguageOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10 overflow-hidden">
                <ul>
                  <li>
                    <button
                      onClick={() => handleLanguageChange('en')}
                      className={`w-full text-left px-4 py-2 hover:bg-teal-50 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center ${language === 'en' ? 'text-teal-500 font-medium' : 'text-gray-700 dark:text-gray-300'}`}
                    >
                      <span className="w-8 text-gray-400 dark:text-gray-500">EN</span>
                      <span>English</span>
                    </button>
                  </li>
                  <li className="border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => handleLanguageChange('th')}
                      className={`w-full text-left px-4 py-2 hover:bg-teal-50 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center ${language === 'th' ? 'text-teal-500 font-medium' : 'text-gray-700 dark:text-gray-300'}`}
                    >
                      <span className="w-8 text-gray-400 dark:text-gray-500">TH</span>
                      <span>ไทย</span>
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}