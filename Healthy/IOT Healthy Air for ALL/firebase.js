import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import {
  getDatabase,
  ref,
  onValue,
  query,
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCsLbgaIiGDIFSOFS79BhfjgfZNjJixk2Y",
  authDomain: "esp8266project-2ce1e.firebaseapp.com",
  databaseURL:
    "https://esp8266project-2ce1e-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "esp8266project-2ce1e",
  storageBucket: "esp8266project-2ce1e.firebasestorage.app",
  messagingSenderId: "791464834401",
  appId: "1:791464834401:web:393558b1cc366deb898120",
  measurementId: "G-MGF74WRL44",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const starCountRef = ref(db, "esp8266_data");
const limitedQuery = query(starCountRef);

let lastTimestamp = null,
  accumulatedTime = 0,
  temperatureData = [],
  humidityData = [],
  smokeData = [],
  timestamps = [];

onValue(limitedQuery, (snapshot) => {
  const data = snapshot.val(),
    results = [],
    currentTimestamps = [],
    dailyData = {};

  const currentDate = new Date();
  const currentWeek = getWeekFromDate(currentDate).sort((a, b) => {
    return new Date(a) - new Date(b);
  });

  console.log("Current Week: ", currentWeek);

  const dataCount = data ? Object.keys(data).length : 0; // นับจำนวนข้อมูลในฐานข้อมูล
  console.log("Number of records in Firebase: ", dataCount);
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const entry = data[key];
      const timestamp = parseTimestamp(entry.timestamp);
      const dateKey = timestamp.toISOString().split("T")[0];
      results.push(data[key]);

      // แปลงและเก็บค่า timestamp
      if (entry.timestamp) {
        const timestamp = parseTimestamp(entry.timestamp);
        currentTimestamps.push(
          `${timestamp.getHours()}:${timestamp
            .getMinutes()
            .toString()
            .padStart(2, "0")}`
        );

        if (lastTimestamp) {
          const timeDiff = (timestamp - lastTimestamp) / 1000;
          accumulatedTime += timeDiff;
        }

        lastTimestamp = timestamp;
      } else {
        console.error(`Missing timestamp for key: ${key}`);
        currentTimestamps.push("Invalid Time");
      }

      if (currentWeek.includes(dateKey)) {
        if (!dailyData[dateKey]) {
          dailyData[dateKey] = { temperature: [], humidity: [], smoke: [] };
        }

        dailyData[dateKey].temperature.push(parseInt(entry.temperature, 10));
        dailyData[dateKey].humidity.push(parseInt(entry.humidity, 10));
        dailyData[dateKey].smoke.push(parseInt(entry.smoke_level, 10));
      }
    }
  }

  // เก็บข้อมูลในแต่ละวินาที
  temperatureData.push(
    ...results.map((item) => parseInt(item.temperature, 10))
  );
  humidityData.push(...results.map((item) => parseInt(item.humidity, 10)));
  smokeData.push(...results.map((item) => parseInt(item.smoke_level, 10)));
  timestamps.push(...currentTimestamps);

  document.getElementById("temp").innerHTML = `${parseInt(
    temperatureData[temperatureData.length - 1]
  )} °C`;
  document.getElementById("humid").innerHTML = `${parseInt(
    humidityData[humidityData.length - 1]
  )} RH`;
  document.getElementById("dust").innerHTML = `${parseInt(smokeData)} µg/m³`;

  console.log(accumulatedTime);

  if (accumulatedTime >= 60) {
    const avgTemperature = averageData(temperatureData),
      avgHumidity = averageData(humidityData),
      avgSmoke = averageData(smokeData);

    updateLineChart(
      [currentTimestamps[currentTimestamps.length - 1]], // ส่ง timestamp ล่าสุด
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

  // คำนวณค่าเฉลี่ย
  const labels = currentWeek.map((dateKey) => convertToBuddhistYear(dateKey));

  const dailyTemperatureAvg = labels.map((label) => {
    const dateKey = currentWeek[labels.indexOf(label)];
    const temperatureData = dailyData[dateKey]?.temperature || [];
    return temperatureData.length ? averageData(temperatureData) : 0;
  });

  const dailyHumidityAvg = labels.map((label) => {
    const dateKey = currentWeek[labels.indexOf(label)];
    const humidityData = dailyData[dateKey]?.humidity || [];
    return humidityData.length ? averageData(humidityData) : 0;
  });

  const dailySmokeAvg = labels.map((label) => {
    const dateKey = currentWeek[labels.indexOf(label)];
    const smokeData = dailyData[dateKey]?.smoke || [];
    return smokeData.length ? averageData(smokeData) : 0;
  });

  updateBarChart(labels, dailyHumidityAvg, dailyTemperatureAvg, dailySmokeAvg);
});

// ============================
function averageData(data) {
  const sum = data.reduce((acc, value) => acc + value, 0);
  return sum / data.length;
}

function parseTimestamp(timestamp) {
  const [datePart, timePart] = timestamp.split(" "),
    [day, month, year] = datePart.split("-");
  return new Date(`${year}-${month}-${day}T${timePart}`);
}

function getWeekFromDate(date) {
  const selectedDate = new Date(date);
  const dayOfWeek = selectedDate.getDay(); // คำนวณวันของสัปดาห์
  const diff = selectedDate.getDate() - dayOfWeek; // แก้ไขให้เริ่มจากวันอาทิตย์
  selectedDate.setDate(diff); // กำหนดวันที่เริ่มต้นสัปดาห์เป็นวันอาทิตย์
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(selectedDate);
    d.setDate(selectedDate.getDate() + i); // เพิ่มวันที่ตามลำดับ
    return d.toISOString().split("T")[0]; // แปลงเป็นรูปแบบ YYYY-MM-DD
  });
}

function convertToBuddhistYear(dateString) {
  const date = new Date(dateString),
    day = String(date.getDate()).padStart(2, "0"),
    month = String(date.getMonth() + 1).padStart(2, "0"), // เดือนเริ่มจาก 0
    year = date.getFullYear() + 543;
  return `${day}/${month}/${year}`;
}
