let lineChartInstance, barChartInstance;

function updateLineChart(timestamps, humidityData, temperatureData, smokeData) {
  console.log("Updating chart with:", {
    timestamps,
    humidityData,
    temperatureData,
    smokeData,
  });
  const ctxLine = document.getElementById("lineChart").getContext("2d");

  if (!lineChartInstance) {
    lineChartInstance = new Chart(ctxLine, {
      type: "line",
      data: {
        labels: timestamps,
        datasets: [
          {
            label: "Temperature (°C)",
            data: temperatureData,
            borderColor: "rgba(255, 165, 0, 1)",
            backgroundColor: "transparent", // No background fill
            fill: false, // Disable the background fill
            tension: 0.3,
            borderWidth: 3,
            pointStyle: "circle",
            pointRadius: 5,
            pointBackgroundColor: "rgba(255, 165, 0, 1)",
          },
          {
            label: "Humidity (%)",
            data: humidityData,
            borderColor: "rgba(30, 144, 255, 1)",
            backgroundColor: "transparent", // No background fill
            fill: false, // Disable the background fill
            tension: 0.3,
            borderWidth: 3,
            pointStyle: "circle",
            pointRadius: 5,
            pointBackgroundColor: "rgba(30, 144, 255, 1)",
          },
          {
            label: "Smoke Level",
            data: smokeData,
            borderColor: "rgba(138, 43, 226, 1)",
            backgroundColor: "transparent", // No background fill
            fill: false, // Disable the background fill
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
            labels: {
              font: { size: 16, weight: "bold" },
              color: "#333",
            },
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
            title: {
              display: true,
              text: "Time",
              font: { size: 16, weight: "bold" },
              color: "#333",
            },
            ticks: {
              color: "#555",
              font: { size: 12 },
            },
            grid: {
              color: "#ddd",
              lineWidth: 1,
            },
          },
          y: {
            title: {
              display: true,
              text: "Values",
              font: { size: 16, weight: "bold" },
              color: "#333",
            },
            ticks: {
              color: "#555",
              font: { size: 12 },
            },
            grid: {
              color: "#ddd",
              lineWidth: 1,
            },
          },
        },
      },
    });
  } else {
    lineChartInstance.data.labels = [
      ...lineChartInstance.data.labels,
      ...timestamps,
    ];
    lineChartInstance.data.datasets[0].data = [
      ...lineChartInstance.data.datasets[0].data,
      ...temperatureData,
    ];
    lineChartInstance.data.datasets[1].data = [
      ...lineChartInstance.data.datasets[1].data,
      ...humidityData,
    ];
    lineChartInstance.data.datasets[2].data = [
      ...lineChartInstance.data.datasets[2].data,
      ...smokeData,
    ];
    lineChartInstance.update();
  }
}

function updateBarChart(
  labels,
  dailyHumidityAvg,
  dailyTemperatureAvg,
  dailySmokeAvg
) {
  const ctxBar = document.getElementById("barChart").getContext("2d");

  if (!barChartInstance) {
    barChartInstance = new Chart(ctxBar, {
      type: "bar",
      data: {
        labels: labels,
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
            label: "Average Humidity (%)",
            data: dailyHumidityAvg,
            backgroundColor: "rgba(30, 144, 255, 0.6)",
            borderColor: "rgba(30, 144, 255, 1)",
            borderWidth: 2,
            hoverBackgroundColor: "rgba(30, 144, 255, 0.8)",
          },
          {
            label: "Average Smoke Level",
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
            labels: {
              font: { size: 14, weight: "bold" },
              color: "#333",
            },
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
            grid: {
              display: false,
            },
            ticks: {
              color: "#555",
              font: { size: 12 },
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              color: "#555",
              font: { size: 12 },
            },
            grid: {
              color: "#ddd",
              lineWidth: 1,
            },
          },
        },
      },
    });
  } else {
    barChartInstance.data.labels = labels;
    barChartInstance.data.datasets[0].data = dailyTemperatureAvg;
    barChartInstance.data.datasets[1].data = dailyHumidityAvg;
    barChartInstance.data.datasets[2].data = dailySmokeAvg;
    barChartInstance.update();
  }
}

function updateDateTime() {
  const datetimeElement = document.getElementById("datetime"),
    now = new Date(),
    day = now.getDate(),
    month = now.toLocaleString("th-TH", { month: "long" }),
    year = now.getFullYear() + 543,
    time = now.toLocaleTimeString("th-TH");

  datetimeElement.textContent = `Date Time : ${day} ${month} ${year} เวลา : ${time}`;
}

setInterval(updateDateTime, 1000);

updateDateTime();
