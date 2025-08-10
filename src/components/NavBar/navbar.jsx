import React from "react";
import LanguageIcon from "../../../public/assets/navbar/world.svg";
import SearchIcon from "../../../public/assets/navbar/search.svg";
import ClockIcon from "../../../public/assets/navbar/clock.svg";
import DateIcon from "../../../public/assets/navbar/date.svg";
import NotificationIcon from "../../../public/assets/navbar/notfi.svg";

const NavBar = () => {
  return (
    <nav className="w-full h-[80px] bg-white shadow-sm border-b border-gray-100 flex items-center justify-between px-6">
      {/* Left Section - Greeting and Status */}
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <h1 className="text-[32px] font-semibold">
            <span className="text-[#E596C5]">Good Morning</span>
            <span className="text-[#777D86]">, Adam</span>
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium text-gray-700">Online</span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">عربي</span>
            <img
              src={LanguageIcon}
              alt="Language"
              className="w-4 h-4 opacity-70"
            />
          </div>
        </div>
      </div>

      {/* Right Section - Actions, Time, and Profile */}
      <div className="flex items-center space-x-6">
        {/* Search and Notifications */}
        <div className="flex items-center space-x-3">
          <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer">
            <img src={SearchIcon} alt="Search" className="w-5 h-5 opacity-70" />
          </div>
          <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer relative">
            <img
              src={NotificationIcon}
              alt="Notification"
              className="w-5 h-5 opacity-70"
            />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#E596C5] rounded-full"></div>
          </div>
        </div>

        {/* Date and Time */}
        <div className="flex flex-col items-center">
          <div className="flex items-center space-x-2">
            <img src={ClockIcon} alt="Clock" className="w-4 h-4 opacity-70" />
            <span className="text-[16px] font-bold text-gray-900">3:00 PM</span>
          </div>

          <div className="flex items-center space-x-2 mt-1">
            <img src={DateIcon} alt="Date" className="w-4 h-4 opacity-70" />
            <span className="text-[12px] font-normal text-gray-600">
              Mar,07,2025
            </span>
          </div>
        </div>

        {/* Profile Section */}
        <div className="flex items-center space-x-3 bg-gray-50 rounded-xl px-4 py-2 hover:bg-gray-100 transition-colors duration-200 cursor-pointer">
          <div className="w-10 h-10 bg-gradient-to-br from-[#E596C5] to-[#B87AA3] rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">SW</span>
          </div>

          <div className="flex flex-col items-start">
            <h3 className="text-sm font-semibold text-gray-900">Sara Wael</h3>
            <p className="text-xs text-gray-500">Role</p>
          </div>

          <svg
            className="w-4 h-4 text-gray-400 ml-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
