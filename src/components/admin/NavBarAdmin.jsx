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
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import AvatarIcon from "../../../public/assets/navbar/Avatar.png";
import { removeAuthToken, getAuthToken } from "../../utils/page";
import { useLang } from "../../contexts/LangContext";
import { useMeQuery } from "../../services/apis/AuthApi";
import toast from "react-hot-toast";

// Static dashboard data
const staticDashboardData = {
  currentStatus: "Clocked In",
  todayAttendance: {
    clockIn: "09:00 AM",
    clockOut: null,
    workedHours: "4h 30m",
    status: "Present"
  }
};

const NavBar = ({ onMobileSidebarToggle, isMobileSidebarOpen }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { lang, setLang, isRtl } = useLang();

  // Check if user is authenticated before making API calls
  const isAuthenticated = !!getAuthToken();
  
  // Fetch user data from /me endpoint
  const { data: meResponse, isLoading: userLoading, error: userError } = useMeQuery(undefined, {
    skip: !isAuthenticated, // Skip API call if not authenticated
  });

  // Extract user data from API response (value wrapper)
  const userData = meResponse?.value || null;
  
  // Extract role name - handle both object format {id, name} and string format
  const firstRole = userData?.roles?.[0];
  const roleName = firstRole 
    ? (typeof firstRole === 'string' ? firstRole : firstRole?.name || '')
    : null;
  
  const user = userData ? {
    id: userData.id,
    firstName: userData.firstName || "",
    lastName: userData.lastName || "",
    userName: userData.userName || "",
    email: userData.email || "",
    jobTitle: userData.jobTitle || "",
    role: roleName || userData.jobTitle || "Employee", // Use first role name or jobTitle
    roles: userData.roles || [],
    profileImage: null, // API response doesn't include profileImage
  } : (isAuthenticated ? {
    firstName: "Loading...",
    lastName: "",
    role: "",
    profileImage: null
  } : {
    firstName: "Guest",
    lastName: "",
    role: "",
    profileImage: null
  });

  // Logout function - just remove token locally
  const logout = async () => {
    // No API call needed, just remove token locally
    removeAuthToken();
  };

  // Clock in/out functionality - use static data
  const dashboardData = isAuthenticated ? staticDashboardData : null;
  const refetchDashboard = () => {}; // Empty function for compatibility
  const isClockingIn = false;
  const isClockingOut = false;
  
  // Mock clock in/out handlers
  const clockIn = async () => ({ data: {} });
  const clockOut = async () => ({ data: {} });

  const [langOpen, setLangOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [profileOpen, setProfileOpen] = useState(false); // desktop only
  const [mobileProfileOpen, setMobileProfileOpen] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const langRef = useRef(null);
  const profileRef = useRef(null); // desktop only
  const mobileProfileRef = useRef(null);

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
      if (mobileProfileRef.current && !mobileProfileRef.current.contains(e.target)) {
        setMobileProfileOpen(false);
      }
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
    navigate("/");
  };

  // Clock in/out functionality
  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error(lang === "ar" ? 'المتصفح لا يدعم تحديد الموقع' : 'Browser does not support geolocation'));
        return;
      }

      setIsGettingLocation(true);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setIsGettingLocation(false);
          const { latitude, longitude } = position.coords;
          resolve({ latitude, longitude });
        },
        (error) => {
          setIsGettingLocation(false);
          reject(new Error(lang === "ar" ? 'خطأ في تحديد الموقع' : 'Location error'));
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 60000
        }
      );
    });
  };

  const handleClockInOut = async () => {
    const isAr = lang === "ar";
    const currentStatus = dashboardData?.currentStatus || "Clocked Out";
    const hasCompletedToday = dashboardData?.todayAttendance?.clockIn && dashboardData?.todayAttendance?.clockOut;

    // If already completed attendance today, show toast and return
    if (hasCompletedToday) {
      toast(
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-500" />
          <span>{isAr ? 'لقد سجلت الحضور والانصراف لهذا اليوم بالفعل' : 'You already clocked in today'}</span>
        </div>,
        {
          duration: 3000,
          style: {
            background: '#F0FDF4',
            border: '1px solid #10B981',
            color: '#065F46',
          },
        }
      );
      return;
    }

    // Add confirmation only for clock out
    if (currentStatus === "Clocked In") {
      const confirmClockOut = await new Promise((resolve) => {
        toast((t) => (
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-500" />
            <div>
              <div className="font-medium text-gray-900">
                {isAr ? 'هل أنت متأكد من تسجيل الخروج؟' : 'Are you sure you want to clock out?'}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  toast.dismiss(t.id);
                  resolve(true);
                }}
                className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
              >
                {isAr ? 'نعم' : 'Yes'}
              </button>
              <button
                onClick={() => {
                  toast.dismiss(t.id);
                  resolve(false);
                }}
                className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400"
              >
                {isAr ? 'لا' : 'No'}
              </button>
            </div>
          </div>
        ), {
          duration: 8000,
          style: {
            background: '#FEF3C7',
            border: '1px solid #F59E0B',
            borderRadius: '12px',
          },
        });
      });

      if (!confirmClockOut) return;
    }

    try {
      const location = await getCurrentLocation();

      if (currentStatus === "Clocked In") {
        await clockOut({
          latitude: location.latitude,
          longitude: location.longitude
        });

        toast.success(
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            <span>{isAr ? 'تم تسجيل الخروج بنجاح' : 'Successfully clocked out'}</span>
          </div>,
          {
            duration: 3000,
            style: {
              background: '#10B981',
              color: '#fff',
            },
          }
        );
      } else {
        await clockIn({
          location: "office",
          latitude: location.latitude,
          longitude: location.longitude
        });

        toast.success(
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            <span>{isAr ? 'تم تسجيل الحضور بنجاح' : 'Successfully clocked in'}</span>
          </div>,
          {
            duration: 3000,
            style: {
              background: '#10B981',
              color: '#fff',
            },
          }
        );
      }
      // Static data - no update needed
      refetchDashboard(); // Empty function for compatibility
    } catch (error) {
      console.error('Clock process error:', error);
      toast.error(
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <span>{isAr ? 'حدث خطأ في تسجيل الحضور' : 'Error recording attendance'}</span>
        </div>,
        {
          duration: 4000,
          style: {
            background: '#EF4444',
            color: '#fff',
          },
        }
      );
    }
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

  // Check if user has completed attendance today
  const hasCompletedToday = dashboardData?.todayAttendance?.clockIn && dashboardData?.todayAttendance?.clockOut;

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
      {/* Mobile Layout - First name, language, clock button, date, time, profile */}
      <div className="lg:hidden flex items-center justify-between w-full gap-2">
        {/* Left Section - First Name Only */}
        <div className="flex items-center flex-shrink-0">
          <h1 className="text-sm sm:text-base font-bold tracking-tight truncate">
            <span
              className="font-semibold"
              style={{ color: "var(--text-color)" }}
            >
              {userLoading ? "..." : user?.firstName}
            </span>
          </h1>
        </div>

        {/* Center Section - Clock Button */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {/* Clock In/Out Button */}
          <button
            onClick={handleClockInOut}
            disabled={isClockingIn || isClockingOut || isGettingLocation || hasCompletedToday}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-200 border text-xs font-semibold min-w-[80px] justify-center"
            style={{
              borderColor: hasCompletedToday
                ? "#9CA3AF"
                : dashboardData?.currentStatus === "Clocked In"
                  ? "#EF4444"
                  : "var(--accent-color)",
              backgroundColor: hasCompletedToday
                ? "#F3F4F6"
                : dashboardData?.currentStatus === "Clocked In"
                  ? "#FEF2F2"
                  : "var(--accent-color)",
              color: hasCompletedToday
                ? "#9CA3AF"
                : dashboardData?.currentStatus === "Clocked In"
                  ? "#EF4444"
                  : "#fff",
              cursor: hasCompletedToday ? "not-allowed" : "pointer",
            }}
          >
            {(isClockingIn || isClockingOut || isGettingLocation) ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Clock className="w-4 h-4" />
            )}
            <span className="text-xs">
              {hasCompletedToday
                ? (lang === "ar" ? "مكتمل" : "Done")
                : dashboardData?.currentStatus === "Clocked In"
                  ? (lang === "ar" ? "خروج" : "Out")
                  : (lang === "ar" ? "دخول" : "In")}
            </span>
          </button>
        </div>

        {/* Right Section - Profile Only */}
        <div className="flex items-center flex-shrink-0">
          {/* Profile Icon + Dropdown */}
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
                className="fixed left-1/2 top-16 z-[9999] w-56 rounded-2xl shadow-2xl border overflow-hidden"
                style={{
                  backgroundColor: "var(--bg-color)",
                  borderColor: "var(--border-color)",
                  minWidth: 220,
                  transform: "translateX(-20%)",
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
                      color: "var(--error-color)",
                    }}
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
          {/* Clock In/Out Button */}
          <button
            onClick={handleClockInOut}
            disabled={isClockingIn || isClockingOut || isGettingLocation || hasCompletedToday}
            className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl transition-all duration-200 border font-semibold text-sm"
            style={{
              borderColor: hasCompletedToday
                ? "#9CA3AF"
                : dashboardData?.currentStatus === "Clocked In"
                  ? "#EF4444"
                  : "var(--accent-color)",
              backgroundColor: hasCompletedToday
                ? "#F3F4F6"
                : dashboardData?.currentStatus === "Clocked In"
                  ? "#FEF2F2"
                  : "var(--accent-color)",
              color: hasCompletedToday
                ? "#9CA3AF"
                : dashboardData?.currentStatus === "Clocked In"
                  ? "#EF4444"
                  : "#fff",
              cursor: hasCompletedToday ? "not-allowed" : "pointer",
            }}
          >
            {(isClockingIn || isClockingOut || isGettingLocation) ? (
              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
            ) : (
              <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
            <span>
              {hasCompletedToday
                ? (lang === "ar" ? "مكتمل اليوم" : "Completed Today")
                : dashboardData?.currentStatus === "Clocked In"
                  ? (lang === "ar" ? "تسجيل خروج" : "Clock Out")
                  : (lang === "ar" ? "تسجيل دخول" : "Clock In")}
            </span>
          </button>

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