#include <ESP8266WiFi.h>
#include <FirebaseESP8266.h>
#include <DHT.h>
#include <NTPClient.h>
#include <WiFiUdp.h>

#define WIFI_SSID "YOUR_WIFI_SSID"
#define WIFI_PASSWORD "YOUR_WIFI_PASSWORD"
// #define API_KEY "AIzaSyCsLbgaIiGDIFSOFS79BhfjgfZNjJixk2Y"
#define API_KEY "YOUR_API_KEY"
// #define DATABASE_URL "https://esp8266project-2ce1e-default-rtdb.asia-southeast1.firebasedatabase.app/"
#define DATABASE_URL "YOUR_DATABASE_URL"

#define DHTPIN D2
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

FirebaseData firebaseData;
FirebaseAuth auth;
FirebaseConfig config;

WiFiUDP udp;
NTPClient timeClient(udp, "pool.ntp.org", 3600 * 7); // UTC+7 for Thailand

int measurePin = A0;
int relay = D5;

const float dustThreshold = 50.0, humidityThreshold = 70.0, temperatureThreshold = 30.0;

bool signupOK = false;

void ensureWiFiConnected() {
  while (WiFi.status() != WL_CONNECTED) {
    Serial.println(F("Reconnecting to WiFi..."));
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
    delay(500);
  }
  Serial.println(F("WiFi connected."));
}

void setup() {
  Serial.begin(9600);

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  ensureWiFiConnected();

  config.api_key = API_KEY;
  config.database_url = DATABASE_URL;

  if (Firebase.signUp(&config, &auth, "", "")) {
    signupOK = true;
  }
  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);

  dht.begin();
  pinMode(relay, OUTPUT);
  digitalWrite(relay, LOW);
  timeClient.begin();
}

void loop() {
  ensureWiFiConnected();

  timeClient.update();
  time_t rawTime = timeClient.getEpochTime();
  struct tm *timeinfo = localtime(&rawTime);
  char Startdate[20];
  strftime(Startdate, sizeof(Startdate), "%d-%m-%Y %H:%M:%S", timeinfo);

  // Read sensors
  int voMeasured = analogRead(measurePin);
  float calcVoltage = voMeasured * (3.3 / 1024.0);
  float smokeLevel = max(0.0, (0.17 * calcVoltage - 0.1) * 1000);

  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();

  if (isnan(temperature) || isnan(humidity)) {
    Serial.println(F("Error: Invalid sensor data."));
    return;
  }

  if (temperature > temperatureThreshold) {
    Serial.println(F("Warning: Temperature exceeds safety limit!"));
    digitalWrite(relay, HIGH);
    return;
  }

  if (smokeLevel > dustThreshold && humidity > humidityThreshold) {
    digitalWrite(relay, HIGH);
    Serial.println(F("Fan ON"));
  } else {
    digitalWrite(relay, LOW);
    Serial.println(F("Fan OFF"));
  }

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