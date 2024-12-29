import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import {
  getDatabase,
  ref,
  onValue,
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

const dataRef = ref(db, "esp8266_data");
let rawData = []; // เก็บข้อมูลดั้งเดิม
let filteredData = []; // เก็บข้อมูลที่ถูกกรอง
let currentPage = 1; // หน้าปัจจุบัน
const itemsPerPage = 200; // จำนวนข้อมูลต่อหน้า

onValue(dataRef, (snapshot) => {
  const data = snapshot.val();
  if (data) {
    // แปลงข้อมูลที่ดึงมาจาก Firebase
    rawData = Object.values(data).map((item) => ({
      timestamp: item.timestamp || "0",
      temperature: item.temperature ?? 0,
      smoke_level: item.smoke_level ?? 0,
      humidity: item.humidity ?? 0,
    }));

    // ฟังก์ชันแปลง timestamp เป็น Date object
    const parseTimestamp = (timestamp) => {
      const parts = timestamp.split(" "); // แยกวันที่และเวลา
      const dateParts = parts[0].split("-"); // แยกวัน, เดือน, ปี
      const timeParts = parts[1].split(":"); // แยกชั่วโมง, นาที, วินาที

      // สร้าง Date object จากวันที่และเวลา
      return new Date(
        parseInt(dateParts[2]), // ปี
        parseInt(dateParts[1]) - 1, // เดือน (เดือนใน JavaScript เริ่มจาก 0)
        parseInt(dateParts[0]), // วัน
        parseInt(timeParts[0]), // ชั่วโมง
        parseInt(timeParts[1]), // นาที
        parseInt(timeParts[2]) // วินาที
      );
    };

    // จัดเรียงข้อมูลใหม่จากล่าสุดไปเก่า (จากใหม่ไปเก่า)
    rawData.sort(
      (a, b) => parseTimestamp(b.timestamp) - parseTimestamp(a.timestamp)
    );

    // กำหนดให้ filteredData เป็นข้อมูลที่ถูกกรองแล้ว
    filteredData = [...rawData];
    renderTable(); // เรียกใช้ฟังก์ชัน renderTable เพื่อแสดงข้อมูล
  } else {
    document.getElementById("table-output").innerHTML = `
        <p class="text-red-500 text-center py-6">ไม่มีข้อมูลใน Firebase</p>
      `;
  }
});

function renderTable() {
  const tableDiv = document.getElementById("table-output");
  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const pageData = filteredData.slice(startIdx, endIdx); // กรองข้อมูลเฉพาะหน้าปัจจุบัน

  let table = `
      <div class="overflow-x-auto mx-auto w-full bg-white">
        <table class="table-auto border-collapse border border-gray-300 w-full text-sm">
          <thead class="bg-indigo-600 text-white">
            <tr>
              <th class="px-6 py-3 text-center">Timestamp</th>
              <th class="px-6 py-3 text-center">Temperature</th>
              <th class="px-6 py-3 text-center">Smoke Level</th>
              <th class="px-6 py-3 text-center">Humidity</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-gray-50">
    `;

  pageData.forEach((item) => {
    table += `
        <tr class="hover:bg-indigo-50 transition ease-in-out duration-300">
          <td class="px-6 py-3 text-center">${item.timestamp}</td>
          <td class="px-6 py-3 text-center">${item.temperature}</td>
          <td class="px-6 py-3 text-center">${item.smoke_level}</td>
          <td class="px-6 py-3 text-center">${item.humidity}</td>
        </tr>
      `;
  });

  table += `
          </tbody>
        </table>
      </div>
    `;
  tableDiv.innerHTML = table;
  updatePagination(); // อัพเดตปุ่ม pagination และแสดงเลขหน้า
}

function updatePagination() {
  const prevBtn = document.getElementById("prevPageBtn");
  const nextBtn = document.getElementById("nextPageBtn");
  const pageNumber = document.getElementById("page-number");

  // ถ้าเป็นหน้าแรกจะไม่สามารถย้อนกลับไปหน้าแรกได้
  prevBtn.disabled = currentPage === 1;

  // ถ้าหน้าถัดไปไม่มีข้อมูลก็ปิดปุ่ม "Next"
  nextBtn.disabled = currentPage * itemsPerPage >= filteredData.length;

  // แสดงเลขหน้า
  pageNumber.textContent = `Page ${currentPage}`;
}

document.getElementById("nextPageBtn").addEventListener("click", () => {
  if (currentPage * itemsPerPage < filteredData.length) {
    currentPage++;
    renderTable();
  }
});

document.getElementById("prevPageBtn").addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    renderTable();
  }
});

const searchInput = document.getElementById("search-input");
searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase(); // คำที่ค้นหา
  filteredData = rawData.filter((item) => {
    return (
      item.timestamp.toLowerCase().includes(query) ||
      item.temperature.toString().includes(query) ||
      item.smoke_level.toString().includes(query) ||
      item.humidity.toString().includes(query)
    );
  });
  currentPage = 1; // เริ่มที่หน้าแรกเมื่อค้นหาใหม่
  renderTable(); // แสดงข้อมูลที่กรองแล้ว
});

