import Link from "next/link";
import Image from "next/image";

// AfterLogin
import Sidebar from "./AfterLogin/Sidebar";
import Header from "./AfterLogin/Header";

export default function History() {
  return (
    <>
      <div class="flex flex-col lg:flex-row w-screen h-screen">
        {/* <!-- Sidebar --> */}
        <Sidebar />

        {/* <!-- Dashboard --> */}
        <Header />

        <div
          id="modal_about"
          class="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center hidden z-20"
        >
          <div class="bg-white p-6 rounded-lg shadow-lg max-w-xl w-full">
            <h2 class="text-xl font-bold text-gray-900 mb-4">About Us</h2>
            <p class="text-gray-700 mb-2">
              Welcome to <strong>Healthy Air for All</strong>, your
              comprehensive solution for real-time air quality monitoring. Our
              platform provides essential data to ensure a healthier living
              environment for everyone.
            </p>
            <h3 class="text-lg font-semibold text-gray-800 mt-4">
              Our Mission
            </h3>
            <p class="text-gray-700">
              At Healthy Air for All, we aim to empower communities with
              reliable tools to monitor and improve air quality.
            </p>
            <h3 class="text-lg font-semibold text-gray-800 mt-4">
              Key Features
            </h3>
            <ul class="list-disc list-inside text-gray-700">
              <li>Real-Time Monitoring</li>
              <li>Interactive Dashboard</li>
              <li>Personalized Experience</li>
              <li>Historical Data</li>
            </ul>
            <h3 class="text-lg font-semibold text-gray-800 mt-4">
              Why Choose Us?
            </h3>
            <p class="text-gray-700">
              Healthy Air for All stands out with its intuitive design, reliable
              data, and commitment to creating a healthier environment.
            </p>
            <div class="mt-4 flex justify-end">
              <button
                onclick="closeModalAbout()"
                class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>

        <div
          id="modal_setting"
          class="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center hidden z-20"
        >
          <div class="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 class="text-2xl font-bold text-gray-800">Setting</h2>
            <p class="mt-3 text-gray-600">
              Customize your preferences here. Adjust the settings as needed.
            </p>

            {/* <!-- ตัวเลือกการตั้งค่า --> */}
            <div class="mt-4 space-y-4">
              <div>
                <label
                  for="themeSelect"
                  class="block text-gray-700 font-medium"
                >
                  Theme:
                </label>
                <select
                  id="themeSelect"
                  class="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System Default</option>
                </select>
              </div>
              <div>
                <label
                  for="languageSelect"
                  class="block text-gray-700 font-medium"
                >
                  Language:
                </label>
                <select
                  id="languageSelect"
                  class="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                >
                  <option value="en">English</option>
                  <option value="th">ภาษาไทย</option>
                  <option value="es">Español</option>
                </select>
              </div>
            </div>

            {/* <!-- ปุ่มจัดการ --> */}
            <div class="mt-6 flex justify-end gap-4">
              <button
                onclick="saveSettings()"
                class="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
              >
                Save
              </button>
              <button
                onclick="closeModalSetting()"
                class="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
