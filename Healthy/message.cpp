#include <ESP8266WiFi.h>
#include <FirebaseESP8266.h>
#include <DHT.h>
#include <NTPClient.h>
#include <WiFiUdp.h>
#include "config.h"

// DHT Sensor configuration
#define DHTPIN D2
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

// Firebase and NTP variables
FirebaseData firebaseData;
FirebaseAuth auth;
FirebaseConfig config;

WiFiUDP udp;
NTPClient timeClient(udp, "pool.ntp.org", 3600 * 7); // UTC+7 for Thailand

// PM2.5 sensor and fan configuration
int measurePin = A0;
int step_to_fan = D5;

const float dustThreshold = 50.0;     // PM2.5 threshold in ug/m3
const float humidityThreshold = 70.0; // Humidity threshold in percentage
const float temperatureThreshold = 40.0; // Temperature safety limit in Celsius

bool signupOK = false;

// Helper functions
void setPinLow(int pin) {
  digitalWrite(pin, LOW);
}

void setPinHigh(int pin) {
  digitalWrite(pin, HIGH);
}

void ensureWiFiConnected() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println(F("Reconnecting to WiFi..."));
    WiFi.disconnect();
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
    while (WiFi.status() != WL_CONNECTED) {
      delay(500);
      Serial.print(F("."));
    }
    Serial.println(F("Reconnected to WiFi."));
  }
}

void ensureFirebaseReady() {
  if (!Firebase.ready()) {
    Serial.println(F("Firebase not ready. Retrying..."));
    Firebase.begin(&config, &auth);
    Firebase.reconnectWiFi(true);
  }
}

void setup() {
  Serial.begin(9600);

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(F("."));
  }
  Serial.println(F("\nConnected!"));

  config.api_key = API_KEY;
  config.database_url = DATABASE_URL;

  if (Firebase.signUp(&config, &auth, "", "")) {
    signupOK = true;
  }

  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);

  dht.begin();
  pinMode(step_to_fan, OUTPUT);
  setPinLow(step_to_fan);
  timeClient.begin();
}

void loop() {
  ensureWiFiConnected();
  ensureFirebaseReady();

  timeClient.update();
  time_t rawTime = timeClient.getEpochTime();
  struct tm *timeinfo = localtime(&rawTime);
  char Startdate[20];
  strftime(Startdate, sizeof(Startdate), "%d-%m-%Y %H:%M:%S", timeinfo);

  int voMeasured = analogRead(measurePin);
  delayMicroseconds(40);

  float calcVoltage = voMeasured * (3.3 / 1024.0);
  float smokeLevel = max(0.0, (0.17 * calcVoltage - 0.1) * 1000);

  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();

  // Validate sensor readings
  if (isnan(temperature) || isnan(humidity) || smokeLevel < 0 || smokeLevel > 1000) {
    Serial.println(F("Error: Invalid sensor data."));
    return;
  }

  // Check safety thresholds
  if (temperature > temperatureThreshold) {
    Serial.println(F("Warning: Temperature exceeds safety limit!"));
    setPinLow(step_to_fan);
    return;
  }

  // Control fan based on thresholds
  if (smokeLevel > dustThreshold && humidity > humidityThreshold) {
    setPinHigh(step_to_fan);
    Serial.println(F("Fan ON"));
  } else {
    setPinLow(step_to_fan);
    Serial.println(F("Fan OFF"));
  }

  // Push data to Firebase
  if (Firebase.ready() && signupOK) {
    FirebaseJson json;
    json.set("/timestamp", Startdate);
    json.set("/temperature", constrain(temperature, -40.0, 80.0));
    json.set("/humidity", constrain(humidity, 0.0, 100.0));
    json.set("/smoke_level", constrain(smokeLevel, 0.0, 1000.0));

    if (Firebase.pushJSON(firebaseData, "/esp8266_data", json)) {
      Serial.println(F("Data pushed to Firebase successfully."));
    } else {
      Serial.print(F("Failed to push data to Firebase: "));
      Serial.println(firebaseData.errorReason());
    }
  }

  delay(5000);
}
