// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import {
  getDatabase,
  ref,
  onValue,
  query,
  limitToLast,
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

  for (const key in data) {
    if (data.hasOwnProperty(key)) {
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

    // รีเซ็ตข้อมูลหลังจากแสดงผลแล้ว
    temperatureData = [];
    humidityData = [];
    smokeData = [];
    timestamps = [];
    accumulatedTime = 0; // รีเซ็ตเวลา
  }

  // updateBarChart(humidityData, temperatureData, smokeData);
});
