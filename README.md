# IOT--Air--Fan

This project is an IoT-based air fan system designed to monitor air quality and control fan operation based on environmental conditions. The system collects data from various sensors and sends it to a web application, which provides a dashboard for real-time monitoring and historical data visualization. Firebase is used as the database to support real-time data updates, ensuring a responsive and user-friendly experience.

The microcontroller (Node MCU ESP8266) is responsible for processing sensor data and requires a stable WiFi connection to send data to the Firebase database and enable communication with the web application.

## Accessories

- **Node MCU ESP8266 V.2**: The main microcontroller for connecting to WiFi and managing the system.
- **Shield Nodemcu AB-Maker V1.3 For Nodemcu Esp8266 V2**: Provides an easier way to connect components to the Node MCU ESP8266 with fewer wiring issues.
- **DHT11**: A sensor for measuring temperature and humidity.
- **Relay 3.3 V 1 Channels**: Used to control the fan operation.
- **Fan Cooling 3.3 V**: The cooling fan controlled by the relay.
- **Sharp GP2Y1010AU0F Dust Sensor**: Measures air quality by detecting dust particles in the environment.
- **Adapter 9V**: Powers the system components.
- **Jumper Wires**: For connecting the components to the microcontroller.

## Features

- **Real-Time Monitoring**: Displays temperature, humidity, and air quality data on a web application dashboard.
- **WiFi Connectivity**: The microcontroller connects to a WiFi network to send data to Firebase and communicate with the web application.
- **Historical Data**: Allows users to view previously recorded data for analysis and trend observation.
- **Automatic Control**: Automatically operates the fan based on air quality thresholds to maintain a clean environment.
- **Firebase Integration**: Ensures real-time data updates and storage for seamless user interaction.
- **Web Dashboard**: A visually appealing and interactive web interface to monitor and manage the system.

## Benefits

- **Improved Air Quality**: Ensures optimal air quality in the environment by activating the fan when needed.
- **Energy Efficiency**: Operates the fan only when required, reducing energy consumption.
- **Data Insights**: Offers valuable insights into air quality trends over time.
- **Scalability**: Can be expanded with additional sensors or features as needed.

## How to Use

1. **Hardware Setup**: 
   - Assemble all components using the shield and connect them as per the circuit diagram.
   - Ensure proper connections for the dust sensor, DHT11, relay, and fan.

2. **Firmware Upload**: 
   - Write and upload the code to the Node MCU ESP8266 using the Arduino IDE or PlatformIO.
   - Include the necessary libraries for DHT11, Firebase, and dust sensor in your code.

3. **WiFi Configuration**: 
   - Configure the Node MCU ESP8266 with your WiFi credentials in the firmware.
   - Ensure the microcontroller has a stable WiFi connection for sending data to Firebase.

4. **Firebase Setup**: 
   - Set up your Firebase database and configure it with your web application.
   - Update the Firebase credentials in the firmware to enable real-time data transfer.

5. **Web Application**: 
   - Access the web dashboard using a browser to monitor live data.
   - Use the interface to view historical data and system status.

6. **Power On**: 
   - Power the system using the Adapter 9V.
   - The system will automatically start collecting and sending data to Firebase.

## System Architecture

The system architecture is designed to ensure seamless data flow and operation:

- Sensors collect temperature, humidity, and dust levels.
- The Node MCU ESP8266 processes the data and sends it to Firebase in real-time via WiFi.
- The web application fetches the data from Firebase and displays it on a user-friendly dashboard.
- The relay activates the fan when air quality thresholds are breached, ensuring optimal air conditions.

![System Architecture](/images/System%20Architecture.png)

---

This document provides a comprehensive overview of the project, guiding users through the setup and operation process. If you have further questions or encounter issues, feel free to contact the project maintainers.
