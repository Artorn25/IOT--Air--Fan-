"use client";

import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThermometerHalf,
  faSmog,
  faTint,
} from "@fortawesome/free-solid-svg-icons";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Model from "../components/Model";
import Script from "next/script";
import { SensorData, generateMockData } from "../lib/MockData";
import { db } from "../lib/firebase";
import { ref, onValue, query } from "firebase/database";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const translations = {
  en: {
    title: "Healthy Air for All",
    history: "History",
    temperature: "Temperature",
    dust: "Dust Density",
    humidity: "Humidity",
  },
  th: {
    title: "Healthy Air for All",
    history: "ประวัติ",
    temperature: "อุณหภูมิ",
    dust: "ความหนาแน่นฝุ่น",
    humidity: "ความชื้น",
  },
};

export default function Dashboard() {
  const [theme, setTheme] = useState("light"); // ค่าเริ่มต้นคงที่สำหรับ SSR
  const [language, setLanguage] = useState<"en" | "th">("en"); // ค่าเริ่มต้นคงที่สำหรับ SSR
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isSettingModalOpen, setIsSettingModalOpen] = useState(false);
  const [temperature, setTemperature] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [dust, setDust] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const lineChartInstance = useRef<ChartJS | null>(null);
  const barChartInstance = useRef<ChartJS | null>(null);

  // ซิงค์ theme และ language จาก localStorage หลัง hydration
  useEffect(() => {
    const savedTheme =
      typeof window !== "undefined" ? localStorage.getItem("theme") : null;
    if (savedTheme) setTheme(savedTheme);

    const savedLanguage =
      typeof window !== "undefined"
        ? (localStorage.getItem("language") as "en" | "th")
        : null;
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

  const updateLineChart = (
    timestamps: string[],
    humidityData: number[],
    temperatureData: number[],
    smokeData: number[]
  ) => {
    console.log("Updating line chart with:", {
      timestamps,
      humidityData,
      temperatureData,
      smokeData,
    });
    const ctxLine = (
      document.getElementById("lineChart") as HTMLCanvasElement | null
    )?.getContext("2d");
    if (!ctxLine) {
      console.error("Line chart canvas not found");
      return;
    }

    if (!lineChartInstance.current) {
      lineChartInstance.current = new ChartJS(ctxLine, {
        type: "line",
        data: {
          labels: timestamps,
          datasets: [
            {
              label: translations[language].temperature + " (°C)",
              data: temperatureData,
              borderColor: "rgba(255, 165, 0, 1)",
              backgroundColor: "transparent",
              fill: false,
              tension: 0.3,
              borderWidth: 3,
              pointStyle: "circle",
              pointRadius: 5,
              pointBackgroundColor: "rgba(255, 165, 0, 1)",
            },
            {
              label: translations[language].humidity + " (RH)",
              data: humidityData,
              borderColor: "rgba(30, 144, 255, 1)",
              backgroundColor: "transparent",
              fill: false,
              borderWidth: 3,
              pointStyle: "circle",
              pointRadius: 5,
              pointBackgroundColor: "rgba(30, 144, 255, 1)",
            },
            {
              label: translations[language].dust + " (µg/m³)",
              data: smokeData,
              borderColor: "rgba(138, 43, 226, 1)",
              backgroundColor: "transparent",
              fill: false,
              tension: 0.3,
              borderWidth: 3,
              pointStyle: "circle",
              pointRadius: 5,
              pointBackgroundColor: "rgba(138, 43, 226, 1)",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "top",
              labels: { font: { size: 16, weight: "bold" }, color: "#333" },
            },
            tooltip: {
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              titleFont: { size: 14, weight: "bold" },
              bodyFont: { size: 12 },
              footerFont: { size: 10 },
              titleColor: "#fff",
              bodyColor: "#fff",
            },
          },
          scales: {
            x: {
              type: "category",
              title: {
                display: true,
                text: "Time",
                font: { size: 16, weight: "bold" },
                color: "#333",
              },
              ticks: { color: "#555", font: { size: 12 } },
              grid: { color: "#ddd", lineWidth: 1 },
            },
            y: {
              type: "linear",
              title: {
                display: true,
                text: "Values",
                font: { size: 16, weight: "bold" },
                color: "#333",
              },
              ticks: { color: "#555", font: { size: 12 } },
              grid: { color: "#ddd", lineWidth: 1 },
            },
          },
        },
      });
    } else {
      lineChartInstance.current.data.labels = [
        ...(lineChartInstance.current.data.labels ?? []),
        ...timestamps,
      ];
      lineChartInstance.current.data.datasets[0].data = [
        ...lineChartInstance.current.data.datasets[0].data,
        ...temperatureData,
      ];
      lineChartInstance.current.data.datasets[1].data = [
        ...lineChartInstance.current.data.datasets[1].data,
        ...humidityData,
      ];
      lineChartInstance.current.data.datasets[2].data = [
        ...lineChartInstance.current.data.datasets[2].data,
        ...smokeData,
      ];
      lineChartInstance.current.update();
    }
  };

  const updateBarChart = (
    labels: string[],
    dailyHumidityAvg: number[],
    dailyTemperatureAvg: number[],
    dailySmokeAvg: number[]
  ) => {
    const ctxBar = (
      document.getElementById("barChart") as HTMLCanvasElement | null
    )?.getContext("2d");
    if (!ctxBar) {
      console.error("Bar chart canvas not found");
      return;
    }

    if (!barChartInstance.current) {
      barChartInstance.current = new ChartJS(ctxBar, {
        type: "bar",
        data: {
          labels,
          datasets: [
            {
              label: "Average " + translations[language].temperature + " (°C)",
              data: dailyTemperatureAvg,
              backgroundColor: "rgba(255, 165, 0, 0.6)",
              borderColor: "rgba(255, 165, 0, 1)",
              borderWidth: 2,
              hoverBackgroundColor: "rgba(255, 165, 0, 0.8)",
            },
            {
              label: "Average " + translations[language].humidity + " (RH)",
              data: dailyHumidityAvg,
              backgroundColor: "rgba(30, 144, 255, 0.6)",
              borderColor: "rgba(30, 144, 255, 1)",
              borderWidth: 2,
              hoverBackgroundColor: "rgba(30, 144, 255, 0.8)",
            },
            {
              label: "Average " + translations[language].dust + " (µg/m³)",
              data: dailySmokeAvg,
              backgroundColor: "rgba(138, 43, 226, 0.6)",
              borderColor: "rgba(138, 43, 226, 1)",
              borderWidth: 2,
              hoverBackgroundColor: "rgba(138, 43, 226, 0.8)",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "top",
              labels: { font: { size: 14, weight: "bold" }, color: "#333" },
            },
            tooltip: {
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              titleFont: { size: 14, weight: "bold" },
              bodyFont: { size: 12 },
              footerFont: { size: 10 },
              titleColor: "#fff",
              bodyColor: "#fff",
            },
          },
          scales: {
            x: {
              type: "category",
              grid: { display: false },
              ticks: { color: "#555", font: { size: 12 } },
            },
            y: {
              type: "linear",
              beginAtZero: true,
              ticks: { color: "#555", font: { size: 12 } },
              grid: { color: "#ddd", lineWidth: 1 },
            },
          },
        },
      });
    } else {
      barChartInstance.current.data.labels = labels;
      barChartInstance.current.data.datasets[0].data = dailyTemperatureAvg;
      barChartInstance.current.data.datasets[1].data = dailyHumidityAvg;
      barChartInstance.current.data.datasets[2].data = dailySmokeAvg;
      barChartInstance.current.update();
      console.log("Bar chart updated with new data");
    }
  };

  const getWeekFromDate = (date: string) => {
    const selectedDate = new Date(date);
    if (isNaN(selectedDate.getTime())) {
      console.error(`Invalid date provided to getWeekFromDate: ${date}`);
      return [];
    }
    const dayOfWeek = selectedDate.getDay();
    const diff =
      selectedDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    selectedDate.setDate(diff);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(selectedDate);
      d.setDate(selectedDate.getDate() + i);
      return new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Bangkok",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(d);
    });
  };

  const convertToBuddhistYear = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.error(
        `Invalid date provided to convertToBuddhistYear: ${dateString}`
      );
      return dateString;
    }
    const thaiDate = new Intl.DateTimeFormat("th-TH", {
      timeZone: "Asia/Bangkok",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).formatToParts(date);

    let day = "";
    let month = "";
    let year = "";

    thaiDate.forEach((part) => {
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
        default:
          break;
      }
    });

    const buddhistYear = parseInt(year);
    return `${day}/${month}/${buddhistYear}`;
  };

  const averageData = (data: number[]) => {
    const sum = data.reduce((acc, value) => acc + value, 0);
    return data.length ? sum / data.length : 0;
  };

  const parseTimestamp = (timestamp: string) => {
    const [datePart, timePart] = timestamp.split(" ");
    const [year, month, day] = datePart.split("-");
    return new Date(`${year}-${month}-${day}T${timePart}+07:00`);
  };

  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    const starCountRef = ref(db, "esp8266_data");
    const limitedQuery = query(starCountRef);

    let lastTimestamp: Date | null = null;
    let accumulatedTime = 0;
    let temperatureData: number[] = [];
    let humidityData: number[] = [];
    let smokeData: number[] = [];
    let timestamps: string[] = [];

    const unsubscribe = onValue(
      limitedQuery,
      (snapshot) => {
        const data = snapshot.val();
        if (!data) {
          console.log("No data available from Firebase, using mock data");
          setError("No data available from Firebase, displaying mock data.");
          const mockData = generateMockData(1)[0];
          setTemperature(Math.round(mockData.temperature));
          setHumidity(Math.round(mockData.humidity));
          setDust(Math.round(mockData.smoke_level));
          updateLineChart(
            [
              new Intl.DateTimeFormat("th-TH", {
                timeZone: "Asia/Bangkok",
                hour: "2-digit",
                minute: "2-digit",
              }).format(new Date()),
            ],
            [mockData.humidity],
            [mockData.temperature],
            [mockData.smoke_level]
          );
          return;
        }

        setError(null);
        const results: SensorData[] = [];
        const currentTimestamps: string[] = [];
        const dailyData: {
          [key: string]: {
            temperature: number[];
            humidity: number[];
            smoke: number[];
          };
        } = {};

        const currentDate = new Date();
        const currentWeek = getWeekFromDate(
          new Intl.DateTimeFormat("en-CA", {
            timeZone: "Asia/Bangkok",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          }).format(currentDate)
        ).sort();

        for (const key in data) {
          if (data.hasOwnProperty(key)) {
            const entry = data[key];
            if (!entry.timestamp) {
              console.error(`Missing timestamp for key: ${key}`);
              continue;
            }

            const timestamp = parseTimestamp(entry.timestamp);
            const dateKey = new Intl.DateTimeFormat("en-CA", {
              timeZone: "Asia/Bangkok",
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            }).format(timestamp);
            results.push(entry);
            currentTimestamps.push(
              new Intl.DateTimeFormat("th-TH", {
                timeZone: "Asia/Bangkok",
                hour: "2-digit",
                minute: "2-digit",
              }).format(timestamp)
            );

            if (lastTimestamp) {
              const timeDiff =
                (timestamp.getTime() - lastTimestamp.getTime()) / 1000;
              accumulatedTime += timeDiff;
            }
            lastTimestamp = timestamp;

            if (currentWeek.includes(dateKey)) {
              if (!dailyData[dateKey]) {
                dailyData[dateKey] = {
                  temperature: [],
                  humidity: [],
                  smoke: [],
                };
              }
              dailyData[dateKey].temperature.push(
                parseInt(entry.temperature, 10)
              );
              dailyData[dateKey].humidity.push(parseInt(entry.humidity, 10));
              dailyData[dateKey].smoke.push(parseInt(entry.smoke_level, 10));
            }
          }
        }

        if (results.length === 0) return;

        temperatureData.push(
          ...results.map((item) => parseInt(String(item.temperature), 10))
        );
        humidityData.push(
          ...results.map((item) => parseInt(String(item.humidity), 10))
        );
        smokeData.push(
          ...results.map((item) => parseInt(String(item.smoke_level), 10))
        );
        timestamps.push(...currentTimestamps);

        setTemperature(temperatureData[temperatureData.length - 1]);
        setHumidity(humidityData[humidityData.length - 1]);
        setDust(smokeData[smokeData.length - 1]);

        if (temperatureData[temperatureData.length - 1] > 30) {
          if (Notification.permission === "granted") {
            new Notification("Fan is on", {
              body: `The temperature is ${
                temperatureData[temperatureData.length - 1]
              } °C.`,
              icon: "/images/warning.png",
            });
          } else {
            console.log("Notification permission not granted.");
          }
          console.log("Fan is on");
        } else {
          console.log("Fan is off");
        }

        if (accumulatedTime >= 60) {
          const avgTemperature = averageData(temperatureData);
          const avgHumidity = averageData(humidityData);
          const avgSmoke = averageData(smokeData);
          updateLineChart(
            [timestamps[timestamps.length - 1]],
            [avgHumidity],
            [avgTemperature],
            [avgSmoke]
          );
          temperatureData = [];
          humidityData = [];
          smokeData = [];
          timestamps = [];
          accumulatedTime = 0;
        }

        const labels = currentWeek.map((dateKey) =>
          convertToBuddhistYear(dateKey)
        );
        const dailyTemperatureAvg = labels.map((_, i) => {
          const dateKey = currentWeek[i];
          const temps = dailyData[dateKey]?.temperature || [];
          return temps.length ? averageData(temps) : 0;
        });
        const dailyHumidityAvg = labels.map((_, i) => {
          const dateKey = currentWeek[i];
          const hums = dailyData[dateKey]?.humidity || [];
          return hums.length ? averageData(hums) : 0;
        });
        const dailySmokeAvg = labels.map((_, i) => {
          const dateKey = currentWeek[i];
          const smokes = dailyData[dateKey]?.smoke || [];
          return smokes.length ? averageData(smokes) : 0;
        });

        updateBarChart(
          labels,
          dailyHumidityAvg,
          dailyTemperatureAvg,
          dailySmokeAvg
        );
      },
      (error) => {
        console.error("Firebase error:", error);
        setError("Failed to fetch data from Firebase. Displaying mock data.");
        const mockData = generateMockData(1)[0];
        setTemperature(Math.round(mockData.temperature));
        setHumidity(Math.round(mockData.humidity));
        setDust(Math.round(mockData.smoke_level));
        updateLineChart(
          [
            new Intl.DateTimeFormat("th-TH", {
              timeZone: "Asia/Bangkok",
              hour: "2-digit",
              minute: "2-digit",
            }).format(new Date()),
          ],
          [mockData.humidity],
          [mockData.temperature],
          [mockData.smoke_level]
        );
      }
    );

    return () => {
      unsubscribe();
      if (lineChartInstance.current) {
        lineChartInstance.current.destroy();
        lineChartInstance.current = null;
      }
      if (barChartInstance.current) {
        barChartInstance.current.destroy();
        barChartInstance.current = null;
      }
    };
  }, []);

  return (
    <div className="flex flex-col lg:flex-row w-screen h-screen font-sans bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Sidebar
        setIsAboutModalOpen={setIsAboutModalOpen}
        setIsSettingModalOpen={setIsSettingModalOpen}
        language={language}
        setLanguage={setLanguage}
      />
      <div className="dashboard flex-grow p-4 sm:p-6 lg:p-8 lg:w-[calc(100%-16rem)] overflow-auto bg-gray-50 dark:bg-gray-900">
        {error && (
          <div className="text-red-600 dark:text-red-400 p-4 bg-red-100 dark:bg-red-800/30 rounded-lg mb-6 animate-fade-in">
            {error}
          </div>
        )}
        <Header language={language} setLanguage={setLanguage} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
          <div className="metric-card bg-gradient-to-br from-orange-400 to-red-500 dark:from-orange-500 dark:to-red-600 shadow-lg rounded-2xl flex items-center hover:scale-[1.02] transition-transform duration-300 animate-fade-in backdrop-blur-sm bg-opacity-90">
            <div className="w-2 h-full bg-orange-600 dark:bg-orange-700 rounded-l-2xl"></div>
            <div className="p-5 text-white flex flex-col w-full">
              <div className="flex justify-between items-center">
                <p className="text-xs font-semibold tracking-wider uppercase">
                  {translations[language].temperature}
                </p>
                <FontAwesomeIcon
                  icon={faThermometerHalf}
                  className="text-2xl"
                />
              </div>
              <h2 id="temp" className="text-3xl font-bold mt-2">
                {temperature} °C
              </h2>
              <p className="text-xs mt-1 opacity-90">
                อุณหภูมิปัจจุบันในพื้นที่ของคุณ
              </p>
              <div className="w-full mt-3 bg-white/30 h-1 rounded-full">
                <div
                  className="bg-yellow-300 h-full rounded-full"
                  style={{
                    width: `${Math.min((temperature / 50) * 100, 100)}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
          <div className="metric-card bg-gradient-to-br from-pink-400 to-purple-500 dark:from-pink-500 dark:to-purple-600 shadow-lg rounded-2xl flex items-center hover:scale-[1.02] transition-transform duration-300 animate-fade-in backdrop-blur-sm bg-opacity-90">
            <div className="w-2 h-full bg-pink-600 dark:bg-pink-700 rounded-l-2xl"></div>
            <div className="p-5 text-white flex flex-col w-full">
              <div className="flex justify-between items-center">
                <p className="text-xs font-semibold tracking-wider uppercase">
                  {translations[language].dust}
                </p>
                <FontAwesomeIcon icon={faSmog} className="text-2xl" />
              </div>
              <h2 id="dust" className="text-3xl font-bold mt-2">
                {dust} µg/m³
              </h2>
              <p className="text-xs mt-1 opacity-90">ความเข้มข้นของฝุ่นละออง</p>
              <div className="w-full mt-3 bg-white/30 h-1 rounded-full">
                <div
                  className="bg-purple-300 h-full rounded-full"
                  style={{ width: `${Math.min((dust / 100) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
          <div className="metric-card bg-gradient-to-br from-blue-400 to-teal-500 dark:from-blue-500 dark:to-teal-600 shadow-lg rounded-2xl flex items-center hover:scale-[1.02] transition-transform duration-300 animate-fade-in backdrop-blur-sm bg-opacity-90">
            <div className="w-2 h-full bg-blue-600 dark:bg-blue-700 rounded-l-2xl"></div>
            <div className="p-5 text-white flex flex-col w-full">
              <div className="flex justify-between items-center">
                <p className="text-xs font-semibold tracking-wider uppercase">
                  {translations[language].humidity}
                </p>
                <FontAwesomeIcon icon={faTint} className="text-2xl" />
              </div>
              <h2 id="humid" className="text-3xl font-bold mt-2">
                {humidity} RH
              </h2>
              <p className="text-xs mt-1 opacity-90">ความชื้นสัมพัทธ์ในอากาศ</p>
              <div className="w-full mt-3 bg-white/30 h-1 rounded-full">
                <div
                  className="bg-teal-300 h-full rounded-full"
                  style={{ width: `${Math.min((humidity / 100) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="chart-container mb-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-6 animate-fade-in">
          <canvas id="lineChart" className="w-full h-[300px]"></canvas>
        </div>

        <section>
          <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">
            {translations[language].history}
          </h3>
          <div className="chart-container mt-4 mb-2 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-6 animate-fade-in">
            <canvas id="barChart" className="w-full h-[300px]"></canvas>
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
      <Script
        src="https://cdn.jsdelivr.net/npm/chart.js"
        strategy="afterInteractive"
      />
    </div>
  );
}
