export interface SensorData {
  timestamp: string;
  temperature: number;
  humidity: number;
  smoke_level: number;
}

export function generateMockData(count: number): SensorData[] {
  const data: SensorData[] = [];
  const now = new Date();
  for (let i = 0; i < count; i++) {
    const timestamp = new Date(now.getTime() - (count - i) * 60 * 1000);
    const dateStr = timestamp.toISOString().split("T")[0];
    const timeStr = timestamp.toTimeString().split(" ")[0];
    data.push({
      timestamp: `${dateStr} ${timeStr}`,
      temperature: 20 + Math.random() * 10, // 20-30°C
      humidity: 50 + Math.random() * 20, // 50-70 RH
      smoke_level: 25 + Math.random() * 15, // 25-40 µg/m³
    });
  }
  return data;
}