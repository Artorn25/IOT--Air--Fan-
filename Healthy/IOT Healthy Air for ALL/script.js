let lineChartInstance; // ตัวแปรสำหรับเก็บ instance ของ Line Chart

function updateLineChart(timestamps, humidityData, temperatureData, smokeData) {
  console.log("Updating chart with:", {
    timestamps,
    humidityData,
    temperatureData,
    smokeData,
  });
  const ctxLine = document.getElementById("lineChart").getContext("2d");

  // ตรวจสอบว่ากราฟถูกสร้างไว้แล้วหรือไม่
  if (!lineChartInstance) {
    // หากกราฟยังไม่มี ก็สร้างกราฟใหม่
    lineChartInstance = new Chart(ctxLine, {
      type: "line",
      data: {
        labels: timestamps, // ใช้ timestamps ที่ส่งเข้ามา
        datasets: [
          {
            label: "Temperature (°C)",
            data: temperatureData,
            borderColor: "rgba(255, 165, 0, 0.8)",
            backgroundColor: "rgba(255, 165, 0, 0.3)",
            fill: true,
            tension: 0.4,
            borderWidth: 2,
            pointStyle: "circle",
            pointRadius: 4,
            pointBackgroundColor: "rgba(255, 165, 0, 0.8)",
          },
          {
            label: "Humidity (%)",
            data: humidityData,
            borderColor: "rgba(30, 144, 255, 0.8)",
            backgroundColor: "rgba(30, 144, 255, 0.3)",
            fill: true,
            tension: 0.4,
            borderWidth: 2,
            pointStyle: "circle",
            pointRadius: 4,
            pointBackgroundColor: "rgba(30, 144, 255, 0.8)",
          },
          {
            label: "Smoke Level",
            data: smokeData,
            borderColor: "rgba(138, 43, 226, 0.8)",
            backgroundColor: "rgba(138, 43, 226, 0.3)",
            fill: true,
            tension: 0.4,
            borderWidth: 2,
            pointStyle: "circle",
            pointRadius: 4,
            pointBackgroundColor: "rgba(138, 43, 226, 0.8)",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
            labels: {
              font: { size: 14 },
              color: "#333",
            },
          },
          tooltip: {
            enabled: true,
            backgroundColor: "rgba(0, 0, 0, 0.8)",
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: "Time",
              font: { size: 16, weight: "bold" },
              color: "#333",
            },
            ticks: { color: "#555", font: { size: 12 } },
          },
          y: {
            title: {
              display: true,
              text: "Values",
              font: { size: 16, weight: "bold" },
              color: "#333",
            },
            ticks: { color: "#555", font: { size: 12 } },
          },
        },
      },
    });
  } else {
    // หากกราฟมีอยู่แล้ว, อัปเดตข้อมูลของกราฟ
    lineChartInstance.data.labels = [
      ...lineChartInstance.data.labels,
      ...timestamps,
    ]; // เพิ่ม timestamps ใหม่เข้าไปใน labels
    lineChartInstance.data.datasets[0].data = [
      ...lineChartInstance.data.datasets[0].data,
      ...temperatureData,
    ]; // เพิ่มข้อมูล temperature ใหม่
    lineChartInstance.data.datasets[1].data = [
      ...lineChartInstance.data.datasets[1].data,
      ...humidityData,
    ]; // เพิ่มข้อมูล humidity ใหม่
    lineChartInstance.data.datasets[2].data = [
      ...lineChartInstance.data.datasets[2].data,
      ...smokeData,
    ]; // เพิ่มข้อมูล smoke ใหม่
    lineChartInstance.update(); // อัปเดตกราฟ
  }
}

function updateBarChart(humidityData, temperatureData, smokeData) {
  const ctxBar = document.getElementById("barChart").getContext("2d");
  new Chart(ctxBar, {
    type: "bar",
    data: {
      labels: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5"], // ตัวอย่าง labels
      datasets: [
        {
          label: "Temperature (°C)",
          data: temperatureData.slice(0, 5), // ใช้เฉพาะ 5 ค่าแรก
          backgroundColor: "rgba(255, 165, 0, 0.7)", // สีส้ม
        },
        {
          label: "Humidity (%)",
          data: humidityData.slice(0, 5), // ใช้เฉพาะ 5 ค่าแรก
          backgroundColor: "rgba(0, 0, 255, 0.7)", // สีน้ำเงิน
        },
        {
          label: "Smoke Level",
          data: smokeData.slice(0, 5), // ใช้เฉพาะ 5 ค่าแรก
          backgroundColor: "rgba(128, 0, 128, 0.7)", // สีม่วง
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: "top",
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
        },
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

function formatDateTime() {
  const optionsDate = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const optionsTime = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };

  // วันที่ในรูปแบบภาษาไทย
  const date = new Date().toLocaleDateString("th-TH", optionsDate);
  const time = new Date().toLocaleTimeString("th-TH", optionsTime);

  // แสดงผลในรูปแบบ วันที่ และ เวลา
  const fullDateTime = `วันที่ ${date} เวลา ${time} น.`;

  document.getElementById("datetime").innerHTML = `Date Time : ${fullDateTime}`;
}

function parseTimestamp(timestamp) {
  const [datePart, timePart] = timestamp.split(" "); // แยกวันที่และเวลา
  const [day, month, year] = datePart.split("-"); // แยกส่วนของวันที่
  return new Date(`${year}-${month}-${day}T${timePart}`);
}

// เรียกใช้งานฟังก์ชั่นเมื่อโหลดหน้า
window.onload = function () {
  formatDateTime(); // เรียกใช้ฟังก์ชั่นแสดงวันที่และเวลา
};
