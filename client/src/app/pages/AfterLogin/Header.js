import Image from "next/image";

export default function Header() {
  return (
    <>
      <div className="dashboard flex-grow p-6 lg:w-[93%] overflow-auto">
        <header className="flex flex-col lg:flex-row justify-between items-center mb-8 px-4 lg:px-10 space-y-6 lg:space-y-0">
          <div className="flex flex-col items-center lg:items-start space-y-4 lg:space-y-0">
            {/* <!-- Title Section --> */}
            <h1 className="text-4xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-500 via-blue-500 to-teal-400 flex items-center space-x-3 animate-fade-in">
              <Image
                src="/fresh-air.png"
                width={50}
                height={50}
                className="animate-bounce"
                alt="Fresh Air Logo"
              />
              <span className="animate-slide-right">Healthy Air for All</span>
            </h1>
          </div>

          <div className="flex flex-col lg:flex-row items-center lg:space-x-6 space-y-4 lg:space-y-0">
            {/* <!-- Date Time Section with Gradient Background --> */}
            <p
              className="text-base lg:text-lg font-medium text-black bg-white-600 py-2 px-4 rounded-md inline-block mt-3 border border-gray-300 transition-all duration-300 ease-in-out transform hidden lg:block"
              id="datetime"
            >
              Date Time : วันที่ เดือน พ.ศ. เวลา น.
            </p>

            {/* <!-- Search Section --> */}
            <div className="relative flex items-center">
              <input
                type="text"
                id="search"
                className="p-3 pl-12 pr-4 w-full sm:w-72 lg:w-96 border-2 border-gray-300 rounded-full shadow-l focus:ring-4 focus:ring-teal-400 focus:outline-none text-gray-700 placeholder-gray-500 transition duration-300 ease-in-out"
                placeholder="Search..."
              />
              <i className="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg"></i>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <div className="metric-card bg-gradient-to-r from-orange-500 to-red-400 shadow-lg rounded-lg flex items-center hover:scale-105 transition-transform duration-300">
            <div className="w-2 h-full bg-orange-500 rounded-l"></div>
            <div className="p-6 text-white flex flex-col w-full">
              <div className="flex justify-between items-center">
                <p className="text-xs font-semibold tracking-wide uppercase">
                  Temperature
                </p>
                <i className="fas fa-thermometer-half text-3xl text-white"></i>
              </div>
              <h2 className="text-4xl font-bold text-white" id="temp">
                0 °C
              </h2>
              <p className="text-sm mt-2 opacity-80">
                Current temperature in your area.
              </p>
              <div className="w-full mt-4 bg-white h-1 rounded-lg">
                <div className="w-1/3 bg-yellow-400 h-full rounded-lg"></div>
              </div>
            </div>
          </div>

          <div className="metric-card bg-gradient-to-r from-pink-500 to-purple-600 shadow-lg rounded-lg flex items-center hover:scale-105 transition-transform duration-300">
            <div className="w-2 h-full bg-pink-500 rounded-l"></div>
            <div className="p-6 text-white flex flex-col w-full">
              <div className="flex justify-between items-center">
                <p className="text-xs font-semibold tracking-wide uppercase">
                  Dust Density
                </p>
                <i className="fas fa-smog text-3xl text-white"></i>
              </div>
              <h2 className="text-4xl font-bold text-white" id="dust">
                0 µg/m³
              </h2>
              <p className="text-sm mt-2 opacity-80">
                Fine particulate matter concentration.
              </p>
              <div className="w-full mt-4 bg-white h-1 rounded-lg">
                <div className="w-2/3 bg-purple-400 h-full rounded-lg"></div>
              </div>
            </div>
          </div>

          <div className="metric-card bg-gradient-to-r from-blue-500 to-teal-400 shadow-lg rounded-lg flex items-center hover:scale-105 transition-transform duration-300">
            <div className="w-2 h-full bg-blue-500 rounded-l"></div>
            <div className="p-6 text-white flex flex-col w-full">
              <div className="flex justify-between items-center">
                <p className="text-xs font-semibold tracking-wide uppercase">
                  Humidity
                </p>
                <i className="fas fa-tint text-3xl text-white"></i>
              </div>
              <h2 className="text-4xl font-bold text-white" id="humid">
                0 RH
              </h2>
              <p className="text-sm mt-2 opacity-80">
                Relative humidity in the air.
              </p>
              <div className="w-full mt-4 bg-white h-1 rounded-lg">
                <div className="w-1/2 bg-teal-400 h-full rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="chart-container mb-6">
          <canvas id="lineChart" className="w-full h-[250px]"></canvas>
        </div>

        <section>
          <h3 className="text-lg font-bold mb-4">History</h3>
          <input type="date" id="datePicker" />
          <div className="chart-container mb-6">
            <canvas id="barChart" className="w-full h-[250px]"></canvas>
          </div>
        </section>
      </div>
    </>
  );
}
