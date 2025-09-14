import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  Globe,
  Clock,
  Calendar,
  ChevronDown,
  User,
  LogOut,
} from "lucide-react";
import AvatarIcon from "../../../public/assets/navbar/Avatar.png";
import { useMeQuery, useLogoutMutation } from "../../services/apis/AuthApi";
import { removeAuthToken } from "../../utils/page";
import { useLang } from "../../contexts/LangContext";

const NavBar = ({ onMobileSidebarToggle, isMobileSidebarOpen }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { lang, setLang, isRtl } = useLang();

  // جلب بيانات المستخدم من /me
  const { data: user, isLoading: userLoading } = useMeQuery();
  const [logout] = useLogoutMutation();

  const [langOpen, setLangOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [profileOpen, setProfileOpen] = useState(false); // desktop only

  const langRef = useRef(null);
  const profileRef = useRef(null); // desktop only

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (langRef.current && !langRef.current.contains(e.target))
        setLangOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target))
        setProfileOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const popSideLang = isRtl ? "left-0" : "right-0";

  // Change language and save to localStorage
  const handleLangChange = (lng) => {
    setLang(lng);
    setLangOpen(false);
  };

  // زرار تسجيل الخروج
  const handleLogout = async () => {
    await logout();
    removeAuthToken();
    navigate("/");
  };

  // Format time and date based on language and locale
  const formatDateTime = () => {
    const now = currentTime;

    if (lang === "ar") {
      // Arabic format
      const day = now.getDate();
      const month = t(`navbar.months.${now.getMonth()}`);
      const year = now.getFullYear();
      const hours = now.getHours();
      const minutes = now.getMinutes();

      // Convert to Arabic numerals
      const arabicNumerals = (num) => {
        const arabicNumbers = [
          "٠",
          "١",
          "٢",
          "٣",
          "٤",
          "٥",
          "٦",
          "٧",
          "٨",
          "٩",
        ];
        return num
          .toString()
          .split("")
          .map((digit) => arabicNumbers[digit])
          .join("");
      };

      const formattedTime = `${arabicNumerals(
        hours % 12 || 12
      )}:${arabicNumerals(minutes.toString().padStart(2, "0"))} ${hours >= 12 ? "م" : "ص"
        }`;
      const formattedDate = `${arabicNumerals(day)} ${month} ${arabicNumerals(
        year
      )}`;

      return { time: formattedTime, date: formattedDate };
    } else {
      // English format
      const day = now.getDate();
      const month = t(`navbar.months.${now.getMonth()}`);
      const year = now.getFullYear();
      const hours = now.getHours();
      const minutes = now.getMinutes();

      const formattedTime = `${hours % 12 || 12}:${minutes
        .toString()
        .padStart(2, "0")} ${hours >= 12 ? "PM" : "AM"}`;
      const formattedDate = `${month} ${day
        .toString()
        .padStart(2, "0")}, ${year}`;

      return { time: formattedTime, date: formattedDate };
    }
  };

  const { time, date } = formatDateTime();

  // Dynamic greeting based on time
  const getGreeting = () => {
    const hour = currentTime.getHours();

    if (lang === "ar") {
      if (hour < 12) return "صباح الخير";
      else if (hour < 18) return "مساء الخير";
      else return "مساء الخير";
    } else {
      if (hour < 12) return "Good Morning";
      else if (hour < 18) return "Good Afternoon";
      else return "Good Evening";
    }
  };

  return (
    <nav
      className="w-full h-12 sm:h-14 md:h-16 flex items-center justify-between px-2 sm:px-4 lg:px-6 border-b border-gray-200/50 relative z-40"
      style={{
        background: "var(--bg-color)",
        borderColor: "var(--border-color)",
      }}
    >
      {/* Mobile Layout - Only greeting, first name, language, date, time */}
      <div className="lg:hidden flex items-center justify-between w-full">
        {/* Left Section - Greeting + First Name */}
        <div className="flex items-center gap-1 sm:gap-2 flex-1 min-w-0">
          <h1 className="text-sm sm:text-base font-bold tracking-tight truncate">
            <span className="gradient-text">{getGreeting()}</span>
            <span
              className="font-semibold ml-1 sm:ml-2"
              style={{ color: "var(--text-color)" }}
            >
              {userLoading ? "..." : user?.firstName}
            </span>
          </h1>
        </div>

        {/* Center Section - Language Selector */}
        <div ref={langRef} className="relative flex-shrink-0 mx-2">
          <button
            onClick={() => setLangOpen((v) => !v)}
            className="flex items-center gap-1 px-2 py-1 rounded-lg sm:rounded-xl transition-all duration-200 border"
            style={{
              borderColor: "var(--border-color)",
              backgroundColor: "var(--bg-color)",
              color: "var(--text-color)",
            }}
          >
            <Globe
              className="w-3 h-3 sm:w-4 sm:h-4"
              style={{ color: "var(--sub-text-color)" }}
            />
            <span className="text-xs font-semibold hidden xs:inline">
              {lang === "ar" ? "عر" : "EN"}
            </span>
            <ChevronDown
              className={`w-2.5 h-2.5 transition-transform duration-200 ${langOpen ? "rotate-180" : ""
                }`}
              style={{ color: "var(--sub-text-color)" }}
            />
          </button>
          {langOpen && (
            <div
              className={`absolute top-full mt-2 ${popSideLang} w-24 sm:w-28 border shadow-xl rounded-lg sm:rounded-xl overflow-hidden`}
              style={{
                backgroundColor: "var(--bg-color)",
                borderColor: "var(--border-color)",
                zIndex: 9999, // أضف z-index عالي
              }}
            >
              <button
                onClick={() => handleLangChange("en")}
                className="w-full text-left px-2 sm:px-3 py-1.5 sm:py-2 text-xs transition-colors hover:bg-[var(--hover-color)]"
                style={{
                  color: "var(--text-color)",
                  backgroundColor:
                    lang === "en" ? "var(--hover-color)" : "transparent",
                  fontWeight: lang === "en" ? "bold" : "medium",
                }}
              >
                English
              </button>
              <button
                onClick={() => handleLangChange("ar")}
                className="w-full text-left px-2 sm:px-3 py-1.5 sm:py-2 text-xs transition-colors hover:bg-[var(--hover-color)]"
                style={{
                  color: "var(--text-color)",
                  backgroundColor:
                    lang === "ar" ? "var(--hover-color)" : "transparent",
                  fontWeight: lang === "ar" ? "bold" : "medium",
                }}
              >
                العربية
              </button>
            </div>
          )}
        </div>

        {/* Right Section - Date & Time + Profile */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Date & Time */}
          <div
            className="flex flex-col items-end gap-0.5"
            style={{
              direction: lang === "ar" ? "rtl" : "ltr",
            }}
          >
            {/* Time */}
            <div className="flex items-center gap-1">
              <Clock
                className="w-3 h-3 sm:w-3.5 sm:h-3.5"
                style={{ color: "var(--sub-text-color)" }}
              />
              <span
                className="text-xs sm:text-sm font-bold"
                style={{ color: "var(--text-color)" }}
              >
                {time}
              </span>
            </div>
            {/* Date */}
            <div className="flex items-center gap-1">
              <Calendar
                className="w-2.5 h-2.5 sm:w-3 sm:h-3"
                style={{ color: "var(--sub-text-color)" }}
              />
              <span
                className="text-[10px] sm:text-xs font-medium truncate max-w-[80px] sm:max-w-[100px]"
                style={{ color: "var(--sub-text-color)" }}
                title={date}
              >
                {date.length > 12 ? date.substring(0, 10) + "..." : date}
              </span>
            </div>
          </div>

          {/* Profile Icon + Dropdown */}
          <div className="relative">
            <button
              className="ml-2 w-8 h-8 rounded-full overflow-hidden border-2 border-[var(--border-color)] flex items-center justify-center"
              onClick={() => setProfileOpen((v) => !v)}
            >
              <img
                src={
                  user?.profileImage
                    ? `${import.meta.env.VITE_API_URL}${user.profileImage}`
                    : AvatarIcon
                }
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </button>
            {profileOpen && (
              <div
                className={`absolute ${isRtl ? "left-0" : "right-0"} mt-2 w-44 rounded-xl shadow-xl border z-50 overflow-hidden`}
                style={{
                  backgroundColor: "var(--bg-color)",
                  borderColor: "var(--border-color)",
                }}
              >
                <button
                  className="w-full flex items-center gap-2 px-4 py-2 text-left transition-all duration-200 hover:bg-[var(--hover-color)]"
                  onClick={() => {
                    setProfileOpen(false);
                    navigate("/pages/User/profile");
                  }}
                >
                  <User className="w-4 h-4" style={{ color: "var(--accent-color)" }} />
                  <span className="font-semibold text-xs">{t("navbar.profile")}</span>
                </button>
                <div className="mx-4 my-1 border-t" style={{ borderColor: "var(--border-color)" }}></div>
                <button
                  className="w-full flex items-center gap-2 px-4 py-2 text-left transition-all duration-200 hover:bg-[var(--hover-color)]"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4" style={{ color: "var(--error-color)" }} />
                  <span className="font-semibold text-xs" style={{ color: "var(--error-color)" }}>
                    {t("navbar.logout")}
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Layout - Keep exactly as original */}
      <div className="hidden lg:flex items-center justify-between w-full">
        {/* Desktop Greeting */}
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <h1 className="text-lg sm:text-xl font-bold tracking-tight">
              <span className="gradient-text">{getGreeting()}</span>
              <span
                className="font-semibold pl-1 sm:pl-2"
                style={{ color: "var(--text-color)" }}
              >
                {/* ديناميكي من الـ API */}
                {userLoading ? "..." : user?.firstName}
              </span>
            </h1>
          </div>
          <div className="flex items-center gap-3 sm:gap-5">
            {/* Online Status */}
            <div
              className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border shadow-sm"
              style={{
                backgroundColor: "var(--hover-color)",
                borderColor: "var(--border-color)",
              }}
            >
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span
                className="text-xs font-semibold"
                style={{ color: "var(--accent-color)" }}
              >
                {t("navbar.online")}
              </span>
            </div>
            {/* Language Selector */}
            <div ref={langRef} className="relative">
              <button
                onClick={() => setLangOpen((v) => !v)}
                className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl sm:rounded-2xl transition-all duration-200 border"
                style={{
                  borderColor: "var(--border-color)",
                  backgroundColor: "var(--bg-color)",
                  color: "var(--text-color)",
                }}
              >
                <span className="text-xs font-semibold">
                  {lang === "ar" ? t("navbar.arabic") : t("navbar.english")}
                </span>
                <Globe
                  className="w-3 h-3 sm:w-4 sm:h-4"
                  style={{ color: "var(--sub-text-color)" }}
                />
                <ChevronDown
                  className={`w-2.5 h-2.5 sm:w-3 sm:h-3 transition-transform duration-200 ${langOpen ? "rotate-180" : ""
                    }`}
                  style={{ color: "var(--sub-text-color)" }}
                />
              </button>
              {langOpen && (
                <div
                  className={`absolute top-full mt-2 ${popSideLang} w-32 sm:w-36 border shadow-xl rounded-xl sm:rounded-2xl overflow-hidden z-50`}
                  style={{
                    backgroundColor: "var(--bg-color)",
                    borderColor: "var(--border-color)",
                  }}
                >
                  <button
                    onClick={() => handleLangChange("en")}
                    className="w-full text-left px-3 sm:px-4 py-2 sm:py-2.5 text-xs transition-colors"
                    style={{
                      color: "var(--text-color)",
                      backgroundColor:
                        lang === "en" ? "var(--hover-color)" : "transparent",
                      fontWeight: lang === "en" ? "bold" : "medium",
                    }}
                  >
                    {t("navbar.english")}
                  </button>
                  <button
                    onClick={() => handleLangChange("ar")}
                    className="w-full text-left px-3 sm:px-4 py-2 sm:py-2.5 text-xs transition-colors"
                    style={{
                      color: "var(--text-color)",
                      backgroundColor:
                        lang === "ar" ? "var(--hover-color)" : "transparent",
                      fontWeight: lang === "ar" ? "bold" : "medium",
                    }}
                  >
                    {t("navbar.arabic")}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Desktop Right Section */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Date and Time - Dynamic - Compact */}
          <div
            className="flex flex-col items-center gap-1"
            style={{
              direction: lang === "ar" ? "rtl" : "ltr",
            }}
          >
            {/* Time */}
            <div className="flex items-center gap-1.5 w-full">
              <Clock
                className="w-3.5 h-3.5"
                style={{ color: "var(--sub-text-color)" }}
              />
              <span
                className="text-sm font-bold"
                style={{ color: "var(--text-color)" }}
              >
                {time}
              </span>
            </div>

            {/* Date */}
            <div className="flex items-center gap-1.5">
              <Calendar
                className="w-3.5 h-3.5"
                style={{ color: "var(--sub-text-color)" }}
              />
              <span
                className="text-xs font-medium"
                style={{ color: "var(--sub-text-color)" }}
              >
                {date}
              </span>
            </div>
          </div>

          {/* Profile Section */}
          <div className="relative" ref={profileRef}>
            <div
              className="flex items-center gap-2 sm:gap-3 rounded-xl sm:rounded-2xl border px-3 sm:px-4 py-1.5 sm:py-2 transition-all duration-200 cursor-pointer group"
              style={{
                borderColor: "var(--border-color)",
                backgroundColor: "var(--bg-color)",
              }}
              onClick={() => setProfileOpen((v) => !v)}
              tabIndex={0}
            >
              <div
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden ring-2 transition-all duration-200 cursor-pointer hover:ring-4"
                style={{ borderColor: "var(--border-color)" }}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/pages/User/profile");
                }}
              >
                <img
                  src={
                    user?.profileImage
                      ? `${import.meta.env.VITE_API_URL}${user.profileImage}`
                      : AvatarIcon
                  }
                  alt="Avatar"
                  className="w-full h-full rounded-full object-cover shadow-md"
                  style={{
                    border: "2px solid var(--bg-color)",
                  }}
                />
              </div>
              <div className="flex flex-col items-start">
                <h3
                  className="text-xs sm:text-sm font-bold transition-colors duration-200 truncate max-w-24 sm:max-w-32"
                  style={{ color: "var(--text-color)" }}
                >
                  {userLoading ? "..." : user?.firstName + " " + user?.lastName}
                </h3>
                <p
                  className="text-xs font-medium truncate max-w-24 sm:max-w-32"
                  style={{ color: "var(--sub-text-color)" }}
                >
                  {userLoading ? "..." : user?.role}
                </p>
              </div>
              <ChevronDown
                className={`w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform duration-200 group-hover:rotate-180 ${profileOpen ? "rotate-180" : ""
                  }`}
                style={{ color: "var(--sub-text-color)" }}
              />
            </div>
            {profileOpen && (
              <div
                className={`absolute ${isRtl ? "left-0" : "right-0"
                  } mt-2 w-52 sm:w-56 rounded-xl sm:rounded-2xl shadow-2xl border z-50 overflow-hidden`}
                style={{
                  backgroundColor: "var(--bg-color)",
                  borderColor: "var(--border-color)",
                  minWidth: 200,
                  animation: "fadeInScale 0.2s ease-out",
                }}
              >
                {/* Header Section */}
                <div
                  className="px-3 sm:px-4 py-2 sm:py-3 border-b"
                  style={{
                    backgroundColor: "var(--hover-color)",
                    borderColor: "var(--border-color)",
                  }}
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="relative">
                      <img
                        src={
                          user?.profileImage
                            ? `${import.meta.env.VITE_API_URL}${user.profileImage}`
                            : AvatarIcon
                        }
                        alt="Avatar"
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover shadow-md"
                        style={{
                          border: "2px sm:border-3 solid var(--bg-color)",
                        }}
                      />
                      <div
                        className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full border-2"
                        style={{
                          backgroundColor: "var(--success-color)",
                          borderColor: "var(--bg-color)",
                        }}
                      ></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3
                        className="font-bold text-xs sm:text-sm leading-tight truncate"
                        style={{ color: "var(--text-color)" }}
                      >
                        {userLoading ? "..." : user?.firstName + " " + user?.lastName}
                      </h3>
                      <p
                        className="text-xs truncate"
                        style={{ color: "var(--sub-text-color)" }}
                      >
                        {userLoading ? "..." : user?.role}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-1">
                  <button
                    className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-2.5 text-left transition-all duration-200 group"
                    style={{
                      color: "var(--text-color)",
                      backgroundColor: "transparent",
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.backgroundColor = "var(--hover-color)")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.backgroundColor = "transparent")
                    }
                    onClick={() => {
                      setProfileOpen(false);
                      navigate("/pages/User/profile");
                    }}
                  >
                    <User
                      className="w-4 h-4 sm:w-5 sm:h-5"
                      style={{ color: "var(--accent-color)" }}
                    />
                    <span className="font-semibold text-xs sm:text-sm">
                      {t("navbar.profile")}
                    </span>
                  </button>

                  <div
                    className="mx-3 sm:mx-4 my-1 border-t"
                    style={{ borderColor: "var(--border-color)" }}
                  ></div>

                  <button
                    className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-2.5 text-left transition-all duration-200 group"
                    style={{
                      backgroundColor: "transparent",
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.backgroundColor = "var(--hover-color)")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.backgroundColor = "transparent")
                    }
                    onClick={handleLogout}
                  >
                    <LogOut
                      className="w-4 h-4 sm:w-5 sm:h-5"
                      style={{ color: "var(--error-color)" }}
                    />
                    <span
                      className="font-semibold text-xs sm:text-sm"
                      style={{ color: "var(--error-color)" }}
                    >
                      {t("navbar.logout")}
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;