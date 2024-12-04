import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import {
  getDatabase,
  ref,
  onValue,
  query,
  limitToLast,
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
const db = getDatabase();

const starCountRef = ref(db, "esp8266_data");
const limitedQuery = query(starCountRef, limitToLast(25));

let lastTimestamp = null; // ตัวแปรเก็บเวลา timestamp ล่าสุด
let accumulatedTime = 0; // เวลาที่สะสมจากแต่ละ timestamp
let temperatureData = [];
let humidityData = [];
let smokeData = [];
let timestamps = [];

function averageData(data) {
  const sum = data.reduce((acc, value) => acc + value, 0);
  return sum / data.length;
}

onValue(limitedQuery, (snapshot) => {
  const data = snapshot.val();
  const results = [];
  const currentTimestamps = [];
  const dailyData = {}; // เก็บข้อมูลแยกตามวัน

  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const entry = data[key];
      const timestamp = parseTimestamp(entry.timestamp);
      const dateKey = timestamp.toISOString().split("T")[0];
      results.push(data[key]);

      // แปลงและเก็บค่า timestamp
      if (data[key].timestamp) {
        const timestamp = parseTimestamp(data[key].timestamp);
        currentTimestamps.push(
          `${timestamp.getHours()}:${timestamp
            .getMinutes()
            .toString()
            .padStart(2, "0")}`
        );

        if (lastTimestamp) {
          // คำนวณเวลาผ่านไป
          const timeDiff = (timestamp - lastTimestamp) / 1000; // เวลาเป็นวินาที
          accumulatedTime += timeDiff;
        }

        lastTimestamp = timestamp;
      } else {
        console.error(`Missing timestamp for key: ${key}`);
        currentTimestamps.push("Invalid Time");
      }

      if (!dailyData[dateKey]) {
        dailyData[dateKey] = { temperature: [], humidity: [], smoke: [] };
      }

      dailyData[dateKey].temperature.push(parseInt(entry.temperature, 10));
      dailyData[dateKey].humidity.push(parseInt(entry.humidity, 10));
      dailyData[dateKey].smoke.push(parseInt(entry.smoke_level, 10));
    }
  }

  // เก็บข้อมูลในแต่ละวินาที
  temperatureData.push(
    ...results.map((item) => parseInt(item.temperature, 10))
  );
  humidityData.push(...results.map((item) => parseInt(item.humidity, 10)));
  smokeData.push(...results.map((item) => parseInt(item.smoke_level, 10)));
  timestamps.push(...currentTimestamps);

  // แสดงข้อมูลล่าสุดในหน้าเว็บ
  document.getElementById("temp").innerHTML = `${parseInt(
    temperatureData[temperatureData.length - 1]
  )} °C`;
  document.getElementById("humid").innerHTML = `${parseInt(
    humidityData[humidityData.length - 1]
  )} RH`;
  document.getElementById("dust").innerHTML = `${parseInt(smokeData)} µg/m³`;

  console.log(accumulatedTime);

  if (accumulatedTime >= 60) {
    // คำนวณค่าเฉลี่ยของข้อมูล
    const avgTemperature = averageData(temperatureData);
    const avgHumidity = averageData(humidityData);
    const avgSmoke = averageData(smokeData);

    // อัปเดตกราฟ
    updateLineChart(
      [currentTimestamps[currentTimestamps.length - 1]], // ส่ง timestamp ล่าสุด
      [avgHumidity], // ส่งค่าเฉลี่ยความชื้น
      [avgTemperature], // ส่งค่าเฉลี่ยอุณหภูมิ
      [avgSmoke] // ส่งค่าเฉลี่ยควัน
    );

    temperatureData = [];
    humidityData = [];
    smokeData = [];
    timestamps = [];
    accumulatedTime = 0;
  }

  // คำนวณค่าเฉลี่ยรายวัน
  const labels = Object.keys(dailyData).map((dateKey) =>
    convertToBuddhistYear(dateKey)
  );
  const dailyTemperatureAvg = labels.map((_, index) => {
    const temperatureData = dailyData[Object.keys(dailyData)[index]]?.temperature;
    return temperatureData ? averageData(temperatureData) : 0; // ใช้ค่าเริ่มต้นเป็น 0 หากไม่พบข้อมูล
  });
  
  const dailyHumidityAvg = labels.map((_, index) => {
    const humidityData = dailyData[Object.keys(dailyData)[index]]?.humidity;
    return humidityData ? averageData(humidityData) : 0; // ใช้ค่าเริ่มต้นเป็น 0 หากไม่พบข้อมูล
  });
  
  const dailySmokeAvg = labels.map((_, index) => {
    const smokeData = dailyData[Object.keys(dailyData)[index]]?.smoke;
    return smokeData ? averageData(smokeData) : 0; // ใช้ค่าเริ่มต้นเป็น 0 หากไม่พบข้อมูล
  });

  // อัปเดตกราฟ
  updateBarChart(labels, dailyHumidityAvg, dailyTemperatureAvg, dailySmokeAvg);
});

function averageDailyData(data) {
  const sum = data.reduce((acc, value) => acc + value, 0);
  return data.length ? sum / data.length : 0;
}

function parseTimestamp(timestamp) {
  const [datePart, timePart] = timestamp.split(" "); // แยกวันที่และเวลา
  const [day, month, year] = datePart.split("-"); // แยกส่วนของวันที่
  return new Date(`${year}-${month}-${day}T${timePart}`);
}

function convertToBuddhistYear(dateString) {
  const date = new Date(dateString); // แปลงเป็น Date object
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // เดือนเริ่มจาก 0
  const year = date.getFullYear() + 543; // แปลงเป็น พ.ศ.
  return `${day}/${month}/${year}`;
}

