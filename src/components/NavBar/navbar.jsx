import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Bell,
  Globe,
  Clock,
  Calendar,
  ChevronDown,
  X,
  Menu,
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

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [langOpen, setLangOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false); // desktop
  const [mobileProfileOpen, setMobileProfileOpen] = useState(false); // mobile

  const searchRef = useRef(null);
  const langRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const inputRef = useRef(null);
  const notifRef = useRef(null);
  const profileRef = useRef(null); // desktop
  const mobileProfileRef = useRef(null); // mobile

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isSearchOpen) setTimeout(() => inputRef.current?.focus(), 0);
  }, [isSearchOpen]);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target))
        setIsSearchOpen(false);
      if (langRef.current && !langRef.current.contains(e.target))
        setLangOpen(false);
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target))
        setIsMobileMenuOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target))
        setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target))
        setProfileOpen(false);
      if (mobileProfileRef.current && !mobileProfileRef.current.contains(e.target))
        setMobileProfileOpen(false);
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

  const FakeNotifications = [
    {
      id: 1,
      message: "New message from John",
      time: "2 mins ago",
    },
    {
      id: 2,
      message: "Your order has been shipped",
      time: "1 hour ago",
    },
    {
      id: 3,
      message: "New comment on your post",
      time: "3 hours ago",
    },
  ];

  return (
    <nav
      className="w-full h-16 flex items-center justify-between px-6 border-b border-gray-200/50 relative z-40"
      style={{
        background: "var(--bg-color)",
        borderColor: "var(--border-color)",
      }}
    >
      {/* Mobile Left Section - Hamburger + Profile */}
      <div className="lg:hidden flex items-center gap-3">
        {/* Mobile Profile */}
        <div className="relative" ref={mobileProfileRef}>
          <button
            onClick={() => setMobileProfileOpen((v) => !v)}
            className="w-10 h-10 rounded-full overflow-hidden ring-2 transition-all duration-200 cursor-pointer hover:ring-4"
            style={{ borderColor: "var(--border-color)" }}
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
                border: "3px solid var(--bg-color)",
              }}
            />
          </button>

          {/* Mobile Profile Dropdown */}
          {mobileProfileOpen && (
            <div
              className={`absolute ${isRtl ? "right-0" : "left-0"
                } mt-2 w-56 rounded-2xl shadow-2xl border z-50 overflow-hidden`}
              style={{
                backgroundColor: "var(--bg-color)",
                borderColor: "var(--border-color)",
                minWidth: 220,
                animation: "fadeInScale 0.2s ease-out",
              }}
            >
              {/* Header Section */}
              <div
                className="px-4 py-3 border-b"
                style={{
                  backgroundColor: "var(--hover-color)",
                  borderColor: "var(--border-color)",
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={
                        user?.profileImage
                          ? `${import.meta.env.VITE_API_URL}${user.profileImage}`
                          : AvatarIcon
                      }
                      alt="Avatar"
                      className="w-10 h-10 rounded-full object-cover shadow-md"
                      style={{
                        border: "3px solid var(--bg-color)",
                      }}
                    />
                    <div
                      className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2"
                      style={{
                        backgroundColor: "var(--success-color)",
                        borderColor: "var(--bg-color)",
                      }}
                    ></div>
                  </div>
                  <div className="flex-1">
                    <h3
                      className="font-bold text-sm leading-tight"
                      style={{ color: "var(--text-color)" }}
                    >
                      {userLoading ? "..." : user?.firstName + " " + user?.lastName}
                    </h3>
                    <p
                      className="text-xs"
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
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all duration-200 group"
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
                    setMobileProfileOpen(false);
                    navigate("/pages/User/profile");
                  }}
                >
                  <User
                    className="w-5 h-5"
                    style={{ color: "var(--accent-color)" }}
                  />
                  <span className="font-semibold text-sm">
                    {t("navbar.profile")}
                  </span>
                </button>

                <div
                  className="mx-4 my-1 border-t"
                  style={{ borderColor: "var(--border-color)" }}
                ></div>

                <button
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all duration-200 group"
                  style={{
                    backgroundColor: "transparent",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.backgroundColor = "var(--hover-color)")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.backgroundColor = "transparent")
                  }
                  onClick={async () => {
                    setMobileProfileOpen(false);
                    await handleLogout();
                  }}
                >
                  <LogOut
                    className="w-5 h-5"
                    style={{ color: "var(--error-color)" }}
                  />
                  <span
                    className="font-semibold text-sm"
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

      {/* Desktop Greeting */}
      <div className="flex items-center gap-6 max-lg:hidden">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold tracking-tight">
            <span className="gradient-text">{getGreeting()}</span>
            <span
              className="font-semibold pl-2"
              style={{ color: "var(--text-color)" }}
            >
              {/* ديناميكي من الـ API */}
              {userLoading ? "..." : user?.firstName}
            </span>
          </h1>
        </div>
        <div className="flex items-center gap-5">
          {/* Online Status */}
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border shadow-sm"
            style={{
              backgroundColor: "var(--hover-color)",
              borderColor: "var(--border-color)",
            }}
          >
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
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
              className="flex items-center gap-2 px-3 py-1.5 rounded-2xl transition-all duration-200 border"
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
                className="w-4 h-4"
                style={{ color: "var(--sub-text-color)" }}
              />
              <ChevronDown
                className={`w-3 h-3 transition-transform duration-200 ${langOpen ? "rotate-180" : ""
                  }`}
                style={{ color: "var(--sub-text-color)" }}
              />
            </button>
            {langOpen && (
              <div
                className={`absolute top-full mt-2 ${popSideLang} w-36 border shadow-xl rounded-2xl overflow-hidden z-50`}
                style={{
                  backgroundColor: "var(--bg-color)",
                  borderColor: "var(--border-color)",
                }}
              >
                <button
                  onClick={() => handleLangChange("en")}
                  className="w-full text-left px-4 py-2.5 text-xs transition-colors"
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
                  className="w-full text-left px-4 py-2.5 text-xs transition-colors"
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

      {/* Mobile Center - Just Greeting */}
      <div className="lg:hidden">
        <h1 className="text-lg font-bold tracking-tight">
          <span className="gradient-text">{getGreeting()}</span>
        </h1>
      </div>

      {/* Mobile Right Section - Notifications */}
      <div className="lg:hidden flex items-center gap-2">
        {/* Mobile Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            className="relative p-2.5 rounded-2xl border transition-all duration-200"
            style={{
              borderColor: "var(--border-color)",
              backgroundColor: "var(--bg-color)",
            }}
            onClick={() => setNotifOpen((v) => !v)}
            aria-label="Notifications"
          >
            <Bell
              className="w-4 h-4"
              style={{ color: "var(--sub-text-color)" }}
            />
            <div className="absolute -top-1 -right-1 w-3 h-3 gradient-bg rounded-full animate-pulse"></div>
          </button>
          {/* Notification Dropdown */}
          {notifOpen && (
            <div
              className={`absolute ${isRtl ? "left-0" : "right-0"
                } mt-2 w-80 max-w-[90vw] bg-white dark:bg-[var(--bg-color)] border border-[var(--border-color)] rounded-2xl shadow-xl z-50 animate-fade-in`}
              style={{ minWidth: 360 }}
            >
              <div className="p-4 border-b border-[var(--border-color)] flex items-center justify-between">
                <span
                  className="font-bold text-base"
                  style={{ color: "var(--text-color)" }}
                >
                  {t("navbar.notifications")}
                </span>
                <button
                  className="p-1 rounded hover:bg-[var(--hover-color)] transition-colors"
                  onClick={() => setNotifOpen(false)}
                  aria-label="Close"
                >
                  <X
                    className="w-4 h-4"
                    style={{ color: "var(--sub-text-color)" }}
                  />
                </button>
              </div>
              <ul className="max-h-72 overflow-y-auto divide-y divide-[var(--border-color)]">
                {FakeNotifications.length === 0 ? (
                  <li className="p-6 text-center text-sm text-[var(--sub-text-color)]">
                    {t("navbar.noNotifications")}
                  </li>
                ) : (
                  FakeNotifications.map((notif) => (
                    <li
                      key={notif.id}
                      className="flex items-start gap-3 px-4 py-3 hover:bg-[var(--hover-color)] transition-colors cursor-pointer"
                    >
                      <div className="flex-shrink-0 mt-1">
                        <Bell className="w-5 h-5 text-[var(--accent-color)]" />
                      </div>
                      <div className="flex-1">
                        <div
                          className="text-sm font-medium"
                          style={{ color: "var(--text-color)" }}
                        >
                          {notif.message}
                        </div>
                        <div
                          className="text-xs mt-1"
                          style={{ color: "var(--sub-text-color)" }}
                        >
                          {notif.time}
                        </div>
                      </div>
                    </li>
                  ))
                )}
              </ul>
              <div className="p-2 text-center">
                <button
                  className="text-xs font-semibold text-[var(--accent-color)] hover:underline"
                  onClick={() => setNotifOpen(false)}
                >
                  {t("navbar.viewAll")}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Desktop Right Section */}
      <div className="flex items-center gap-4 max-lg:hidden">
        {/* Search and Notifications */}
        <div
          ref={searchRef}
          className={`flex items-center gap-3 ${isRtl ? "flex-row-reverse" : ""
            }`}
        >
          {/* Search Toggle */}
          <button
            onClick={() => setIsSearchOpen((v) => !v)}
            className="p-2.5 rounded-2xl border transition-all duration-200"
            style={{
              borderColor: "var(--border-color)",
              backgroundColor: "var(--bg-color)",
            }}
          >
            <Search
              className="w-4 h-4"
              style={{ color: "var(--sub-text-color)" }}
            />
          </button>
          {/* Expanding Search Field */}
          <div
            className={`overflow-hidden transition-all duration-300 ${isSearchOpen ? "opacity-100" : "opacity-0 pointer-events-none"
              } ${isSearchOpen ? "w-64" : "w-0"}`}
          >
            <div
              className={`flex items-center gap-3 border rounded-2xl px-3 py-2 shadow-sm ${isRtl ? "flex-row-reverse" : ""
                }`}
              style={{
                backgroundColor: "var(--bg-color)",
                borderColor: "var(--border-color)",
              }}
            >
              <Search
                className="w-3.5 h-3.5"
                style={{ color: "var(--sub-text-color)" }}
              />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("navbar.searchPlaceholder")}
                dir={lang === "ar" ? "rtl" : "ltr"}
                onKeyDown={(e) => e.key === "Escape" && setIsSearchOpen(false)}
                className="flex-1 bg-transparent outline-none text-sm font-medium"
                style={{ color: "var(--text-color)" }}
              />
              <button
                onClick={() => setIsSearchOpen(false)}
                className="p-1 rounded-lg transition-colors"
                style={{ color: "var(--sub-text-color)" }}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
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
            className="flex items-center gap-3 rounded-2xl border px-4 py-2 transition-all duration-200 cursor-pointer group"
            style={{
              borderColor: "var(--border-color)",
              backgroundColor: "var(--bg-color)",
            }}
            onClick={() => setProfileOpen((v) => !v)}
            tabIndex={0}
          >
            <div
              className="w-8 h-8 rounded-full overflow-hidden ring-2 transition-all duration-200 cursor-pointer hover:ring-4"
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
                className="w-10 h-10 rounded-full object-cover shadow-md"
                style={{
                  border: "3px solid var(--bg-color)",
                }}
              />
            </div>
            <div className="flex flex-col items-start">
              <h3
                className="text-sm font-bold transition-colors duration-200"
                style={{ color: "var(--text-color)" }}
              >
                {userLoading ? "..." : user?.firstName + " " + user?.lastName}
              </h3>
              <p
                className="text-xs font-medium"
                style={{ color: "var(--sub-text-color)" }}
              >
                {userLoading ? "..." : user?.role}
              </p>
            </div>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180 ${profileOpen ? "rotate-180" : ""
                }`}
              style={{ color: "var(--sub-text-color)" }}
            />
          </div>
          {profileOpen && (
            <div
              className={`absolute ${isRtl ? "left-0" : "right-0"
                } mt-2 w-56 rounded-2xl shadow-2xl border z-50 overflow-hidden`}
              style={{
                backgroundColor: "var(--bg-color)",
                borderColor: "var(--border-color)",
                minWidth: 220,
                animation: "fadeInScale 0.2s ease-out",
              }}
            >
              {/* Header Section */}
              <div
                className="px-4 py-3 border-b"
                style={{
                  backgroundColor: "var(--hover-color)",
                  borderColor: "var(--border-color)",
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={
                        user?.profileImage
                          ? `${import.meta.env.VITE_API_URL}${user.profileImage}`
                          : AvatarIcon
                      }
                      alt="Avatar"
                      className="w-10 h-10 rounded-full object-cover shadow-md"
                      style={{
                        border: "3px solid var(--bg-color)",
                      }}
                    />
                    <div
                      className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2"
                      style={{
                        backgroundColor: "var(--success-color)",
                        borderColor: "var(--bg-color)",
                      }}
                    ></div>
                  </div>
                  <div className="flex-1">
                    <h3
                      className="font-bold text-sm leading-tight"
                      style={{ color: "var(--text-color)" }}
                    >
                      {userLoading ? "..." : user?.firstName + " " + user?.lastName}
                    </h3>
                    <p
                      className="text-xs"
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
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all duration-200 group"
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
                    className="w-5 h-5"
                    style={{ color: "var(--accent-color)" }}
                  />
                  <span className="font-semibold text-sm">
                    {t("navbar.profile")}
                  </span>
                </button>

                <div
                  className="mx-4 my-1 border-t"
                  style={{ borderColor: "var(--border-color)" }}
                ></div>

                <button
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all duration-200 group"
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
                    className="w-5 h-5"
                    style={{ color: "var(--error-color)" }}
                  />
                  <span
                    className="font-semibold text-sm"
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
    </nav>
  );
};

export default NavBar;