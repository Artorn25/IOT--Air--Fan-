"use client";

import { useState, useEffect, useRef } from "react";
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
  faThermometerHalf,
  faSmog,
  faTint,
} from "@fortawesome/free-solid-svg-icons";
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

export default function Dashboard() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isSettingModalOpen, setIsSettingModalOpen] = useState(false);
  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("en");
  const [date, setDate] = useState("");
  const [temperature, setTemperature] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [dust, setDust] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const lineChartInstance = useRef<ChartJS | null>(null);
  const barChartInstance = useRef<ChartJS | null>(null);

  // Apply theme to document
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

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
    if (!ctxLine) return;

    if (!lineChartInstance.current) {
      lineChartInstance.current = new ChartJS(ctxLine, {
        type: "line",
        data: {
          labels: timestamps,
          datasets: [
            {
              label: "Temperature (°C)",
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
              label: "Humidity (RH)",
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
              label: "Smoke Level (µg/m³)",
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
    if (!ctxBar) return;

    if (!barChartInstance.current) {
      barChartInstance.current = new ChartJS(ctxBar, {
        type: "bar",
        data: {
          labels,
          datasets: [
            {
              label: "Average Temperature (°C)",
              data: dailyTemperatureAvg,
              backgroundColor: "rgba(255, 165, 0, 0.6)",
              borderColor: "rgba(255, 165, 0, 1)",
              borderWidth: 2,
              hoverBackgroundColor: "rgba(255, 165, 0, 0.8)",
            },
            {
              label: "Average Humidity (RH)",
              data: dailyHumidityAvg,
              backgroundColor: "rgba(30, 144, 255, 0.6)",
              borderColor: "rgba(30, 144, 255, 1)",
              borderWidth: 2,
              hoverBackgroundColor: "rgba(30, 144, 255, 0.8)",
            },
            {
              label: "Average Smoke Level (µg/m³)",
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
    const diff = selectedDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    selectedDate.setDate(diff);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(selectedDate);
      d.setDate(selectedDate.getDate() + i);
      return d.toISOString().split("T")[0];
    });
  };

  const convertToBuddhistYear = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.error(`Invalid date provided to convertToBuddhistYear: ${dateString}`);
      return dateString;
    }
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear() + 543;
    return `${day}/${month}/${year}`;
  };

  const averageData = (data: number[]) => {
    const sum = data.reduce((acc, value) => acc + value, 0);
    return data.length ? sum / data.length : 0;
  };

  const parseTimestamp = (timestamp: string) => {
    const [datePart, timePart] = timestamp.split(" ");
    const [year, month, day] = datePart.split("-");
    return new Date(`${year}-${month}-${day}T${timePart}`);
  };

  useEffect(() => {
    // ตั้งค่าวันที่
    const today = new Date();
    const thailandOffset = 7 * 60 * 60 * 1000; // GMT+7
    const thaiTime = new Date(today.getTime() + thailandOffset);
    const formattedDate = [
      thaiTime.getFullYear(),
      String(thaiTime.getMonth() + 1).padStart(2, "0"),
      String(thaiTime.getDate()).padStart(2, "0"),
    ].join("-");
    setDate(formattedDate);

    // ขอสิทธิ์การแจ้งเตือน
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    // ดึงข้อมูลจาก Firebase
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
              `${new Date().getHours()}:${new Date()
                .getMinutes()
                .toString()
                .padStart(2, "0")}`,
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
          currentDate.toISOString().split("T")[0]
        ).sort();

        for (const key in data) {
          if (data.hasOwnProperty(key)) {
            const entry = data[key];
            if (!entry.timestamp) {
              console.error(`Missing timestamp for key: ${key}`);
              continue;
            }

            const timestamp = parseTimestamp(entry.timestamp);
            const dateKey = timestamp.toISOString().split("T")[0];
            results.push(entry);
            currentTimestamps.push(
              `${timestamp.getHours()}:${timestamp
                .getMinutes()
                .toString()
                .padStart(2, "0")}`
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
            `${new Date().getHours()}:${new Date()
              .getMinutes()
              .toString()
              .padStart(2, "0")}`,
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

  useEffect(() => {
    if (!date) return;
    const selectedWeek = getWeekFromDate(date).sort();
    const labels = selectedWeek.map((dateKey) => convertToBuddhistYear(dateKey));
    const dailyTemperatureAvg = labels.map(() => 0);
    const dailyHumidityAvg = labels.map(() => 0);
    const dailySmokeAvg = labels.map(() => 0);
    updateBarChart(labels, dailyHumidityAvg, dailyTemperatureAvg, dailySmokeAvg);
  }, [date]);

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

      {/* Dashboard */}
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
          <div className="metric-card bg-gradient-to-br from-orange-400 to-red-500 dark:from-orange-500 dark:to-red-600 shadow-lg rounded-2xl flex items-center hover:scale-[1.02] transition-transform duration-300 animate-fade-in backdrop-blur-sm bg-opacity-90">
            <div className="w-2 h-full bg-orange-600 dark:bg-orange-700 rounded-l-2xl"></div>
            <div className="p-5 text-white flex flex-col w-full">
              <div className="flex justify-between items-center">
                <p className="text-xs font-semibold tracking-wider uppercase">
                  อุณหภูมิ
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
                  ความหนาแน่นฝุ่น
                </p>
                <FontAwesomeIcon icon={faSmog} className="text-2xl" />
              </div>
              <h2 id="dust" className="text-3xl font-bold mt-2">
                {dust} µg/m³
              </h2>
              <p className="text-xs mt-1 opacity-90">
                ความเข้มข้นของฝุ่นละออง
              </p>
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
                  ความชื้น
                </p>
                <FontAwesomeIcon icon={faTint} className="text-2xl" />
              </div>
              <h2 id="humid" className="text-3xl font-bold mt-2">
                {humidity} RH
              </h2>
              <p className="text-xs mt-1 opacity-90">
                ความชื้นสัมพัทธ์ในอากาศ
              </p>
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
            ประวัติ
          </h3>
          <input
            type="date"
            id="datePicker"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-400 dark:focus:ring-teal-500 text-gray-700 dark:text-gray-300"
          />
          <div className="chart-container mt-4 mb-2 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-6 animate-fade-in">
            <canvas id="barChart" className="w-full h-[300px]"></canvas>
          </div>
        </section>
      </div>

      <div
        className={`${
          isAboutModalOpen ? "flex" : "hidden"
        } fixed inset-0 bg-gray-900 bg-opacity-60 flex justify-center items-center z-50 backdrop-blur-sm`}
      >
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

      <div
        className={`${
          isSettingModalOpen ? "flex" : "hidden"
        } fixed inset-0 bg-gray-900 bg-opacity-60 flex justify-center items-center z-50 backdrop-blur-sm`}
      >
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

      <Script
        src="https://cdn.jsdelivr.net/npm/chart.js"
        strategy="afterInteractive"
      />
    </div>
  );
}