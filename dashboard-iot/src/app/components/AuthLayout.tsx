"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFan, faShieldAlt, faSync, faMobileAlt } from "@fortawesome/free-solid-svg-icons";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-cyan-500 p-4">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Left Side - Informational Panel */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white p-12 md:w-1/2 lg:w-2/5">
          <div className="mb-8">
            <FontAwesomeIcon icon={faFan} className="text-4xl mb-4" />
            <h2 className="text-3xl font-bold mb-4">IOT FAN HEALTHY</h2>
            <p className="text-blue-100">
              IoT-based air fan system designed to monitor air quality and
              control fan operation based on environmental conditions
            </p>
          </div>
          <div className="space-y-4 mt-12">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-500/20 p-3 rounded-lg">
                <FontAwesomeIcon icon={faShieldAlt} className="text-xl" />
              </div>
              <p>System check history</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-blue-500/20 p-3 rounded-lg">
                <FontAwesomeIcon icon={faSync} className="text-xl" />
              </div>
              <p>Update Data Realtime</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-blue-500/20 p-3 rounded-lg">
                <FontAwesomeIcon icon={faMobileAlt} className="text-xl" />
              </div>
              <p>Monitor on Web application</p>
            </div>
          </div>
        </div>
        {/* Right Side - Form Content */}
        <div className="p-12 md:w-1/2 lg:w-3/5">{children}</div>
      </div>
    </div>
  );
}