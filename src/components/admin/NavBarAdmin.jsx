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
  Settings,
  Shield,
  Users,
  BarChart3,
} from "lucide-react";
import AvatarIcon from "../../../public/assets/navbar/Avatar.png";
import { useMeQuery, useLogoutMutation } from "../../services/apis/AuthApi";
import { useGetAllUsersQuery } from "../../services/apis/UsersApi";
import { useGetAllUsersAttendanceQuery } from "../../services/apis/AtteandanceApi";
import { useGetAllLeavesQuery } from "../../services/apis/LeavesApi";
import { removeAuthToken } from "../../utils/page";

const NavBarAdmin = ({ lang, setLang }) => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  // جلب بيانات المستخدم من /me
  const { data: user, isLoading: userLoading } = useMeQuery();
  const [logout] = useLogoutMutation();

  // جلب البيانات للإحصائيات
  const { data: usersData, isLoading: usersLoading } = useGetAllUsersQuery();
  const { data: attendanceData, isLoading: attendanceLoading } = useGetAllUsersAttendanceQuery();
  const { data: leavesData } = useGetAllLeavesQuery();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [langOpen, setLangOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const searchRef = useRef(null);
  const langRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const inputRef = useRef(null);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Sync language from localStorage
  useEffect(() => {
    const storedLang = localStorage.getItem("lang") || "en";
    if (i18n.language !== storedLang) i18n.changeLanguage(storedLang);
    document.documentElement.dir = storedLang === "ar" ? "rtl" : "ltr";
  }, [i18n]);

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
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const popSideLang = lang === "ar" ? "left-0" : "right-0";

  // Change language and save to localStorage
  const handleLangChange = (lng) => {
    setLang(lng);
    i18n.changeLanguage(lng);
    document.documentElement.dir = lng === "ar" ? "rtl" : "ltr";
    localStorage.setItem("lang", lng);
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
    const isRtl = lang === "ar";

    const timeOptions = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: !isRtl,
    };

    const dateOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    const locale = isRtl ? "ar-SA" : "en-US";
    const time = now.toLocaleTimeString(locale, timeOptions);
    const date = now.toLocaleDateString(locale, dateOptions);

    return { time, date };
  };

  // Calculate dynamic stats
  const getQuickStats = () => {
    const totalUsers = usersData?.length || 0;
    
    // Count active users (users who checked in today)
    const today = new Date().toISOString().split('T')[0];
    const activeUsers = attendanceData?.filter(attendance => 
      attendance.date?.includes(today) && attendance.checkedIn
    )?.length || 0;
    
    // Count pending leaves for notifications
    const pendingLeaves = leavesData?.filter(leave => 
      leave.status === 'pending'
    )?.length || 0;

    return {
      totalUsers,
      activeUsers,
      pendingLeaves
    };
  };

  const { time, date } = formatDateTime();
  const stats = getQuickStats();

  // Create dynamic notifications based on real data
  const getNotifications = () => {
    const notifications = [];
    
    // Add pending leaves as notifications
    if (leavesData) {
      const pendingLeaves = leavesData.filter(leave => leave.status === 'pending').slice(0, 3);
      pendingLeaves.forEach(leave => {
        notifications.push({
          id: leave._id,
          type: 'leave',
          title: 'New Leave Request',
          message: `${leave.userName || 'Employee'} requested ${leave.leaveDays || 1} days leave`,
          time: new Date(leave.createdAt).toLocaleDateString(),
          isNew: true
        });
      });
    }

    // Add late attendance notifications
    if (attendanceData) {
      const today = new Date().toISOString().split('T')[0];
      const lateToday = attendanceData.filter(attendance => {
        if (!attendance.date?.includes(today) || !attendance.checkedIn) return false;
        const checkInTime = new Date(attendance.checkInTime);
        const nineAM = new Date();
        nineAM.setHours(9, 0, 0, 0);
        return checkInTime > nineAM;
      }).slice(0, 2);

      lateToday.forEach(attendance => {
        notifications.push({
          id: attendance._id,
          type: 'late',
          title: 'Late Arrival',
          message: `${attendance.userName || 'Employee'} arrived late today`,
          time: new Date(attendance.checkInTime).toLocaleTimeString(),
          isNew: true
        });
      });
    }

    return notifications.slice(0, 5); // Show max 5 notifications
  };

  const notifications = getNotifications();

  return (
    <nav
      className="w-full h-16 border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-40 backdrop-blur-sm"
      style={{
        background: "var(--bg-color)",
        borderColor: "var(--border-color)",
      }}
    >
      {/* Left Section - Admin Badge & Search */}
      <div className="flex items-center gap-4">
        {/* Admin Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border" style={{ 
          backgroundColor: "var(--hover-color)", 
          borderColor: "var(--accent-color)",
          color: "var(--accent-color)"
        }}>
          <Shield className="w-4 h-4" />
          <span className="text-sm font-semibold">Admin Panel</span>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          style={{ color: "var(--text-color)" }}
        >
          <Menu size={20} />
        </button>

        {/* Search */}
        <div className="relative hidden md:block" ref={searchRef}>
          {!isSearchOpen ? (
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border transition-all duration-300 hover:shadow-sm"
              style={{
                backgroundColor: "var(--bg-color)",
                borderColor: "var(--border-color)",
                color: "var(--sub-text-color)",
              }}
            >
              <Search size={16} />
              <span className="text-sm">Search admin panel...</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 animate-popup-scale">
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2"
                  style={{ color: "var(--sub-text-color)" }}
                />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search users, attendance, leaves..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-80 pl-10 pr-4 py-2 rounded-xl border outline-none transition-all duration-300"
                  style={{
                    backgroundColor: "var(--bg-color)",
                    borderColor: "var(--accent-color)",
                    color: "var(--text-color)",
                  }}
                />
              </div>
              <button
                onClick={() => {
                  setIsSearchOpen(false);
                  setQuery("");
                }}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                style={{ color: "var(--sub-text-color)" }}
              >
                <X size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Center Section - Date & Time */}
      <div className="hidden lg:flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2" style={{ color: "var(--text-color)" }}>
          <Calendar size={16} style={{ color: "var(--accent-color)" }} />
          <span className="font-medium">{date}</span>
        </div>
        <div className="flex items-center gap-2" style={{ color: "var(--text-color)" }}>
          <Clock size={16} style={{ color: "var(--accent-color)" }} />
          <span className="font-mono font-semibold">{time}</span>
        </div>
      </div>

      {/* Right Section - Dynamic Stats, Notifications, Language, Profile */}
      <div className="flex items-center gap-3">
        {/* Dynamic Quick Stats */}
        <div className="hidden xl:flex items-center gap-4 px-4 py-2 rounded-lg border" style={{
          backgroundColor: "var(--hover-color)",
          borderColor: "var(--border-color)"
        }}>
          <div className="flex items-center gap-2">
            <Users size={16} style={{ color: "var(--accent-color)" }} />
            <span className="text-sm font-medium" style={{ color: "var(--text-color)" }}>
              Users: {usersLoading ? "..." : stats.totalUsers}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <BarChart3 size={16} style={{ color: "var(--accent-color)" }} />
            <span className="text-sm font-medium" style={{ color: "var(--text-color)" }}>
              Active: {attendanceLoading ? "..." : stats.activeUsers}
            </span>
          </div>
        </div>

        {/* Dynamic Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 rounded-xl transition-all duration-200 hover:shadow-sm"
            style={{
              backgroundColor: "var(--hover-color)",
              color: "var(--text-color)",
            }}
          >
            <Bell size={20} />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {notifications.length}
              </span>
            )}
          </button>

          {notifOpen && (
            <div
              className={`absolute top-12 ${popSideLang} w-80 rounded-xl border shadow-xl backdrop-blur-sm z-50 animate-popup-scale`}
              style={{
                backgroundColor: "var(--bg-color)",
                borderColor: "var(--border-color)",
              }}
            >
              <div className="p-4 border-b" style={{ borderColor: "var(--border-color)" }}>
                <h3 className="font-semibold" style={{ color: "var(--text-color)" }}>
                  Admin Notifications ({notifications.length})
                </h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="p-4 border-b hover:bg-gray-50 transition-colors cursor-pointer"
                      style={{ borderColor: "var(--border-color)" }}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                          notification.type === 'leave' ? 'bg-blue-500' : 'bg-red-500'
                        }`}></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium" style={{ color: "var(--text-color)" }}>
                            {notification.title}
                          </p>
                          <p className="text-xs mt-1" style={{ color: "var(--sub-text-color)" }}>
                            {notification.message}
                          </p>
                          <p className="text-xs mt-1" style={{ color: "var(--sub-text-color)" }}>
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center" style={{ color: "var(--sub-text-color)" }}>
                    <p className="text-sm">No new notifications</p>
                  </div>
                )}
              </div>
              <div className="p-4 text-center">
                <button
                  className="text-sm font-medium"
                  style={{ color: "var(--accent-color)" }}
                  onClick={() => {
                    navigate("/pages/admin/leaves");
                    setNotifOpen(false);
                  }}
                >
                  View All Notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Language Selector */}
        <div className="relative" ref={langRef}>
          <button
            onClick={() => setLangOpen(!langOpen)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200 hover:shadow-sm"
            style={{
              backgroundColor: "var(--hover-color)",
              color: "var(--text-color)",
            }}
          >
            <Globe size={16} />
            <span className="text-sm font-medium hidden sm:block">
              {lang === "ar" ? "العربية" : "English"}
            </span>
            <ChevronDown size={14} />
          </button>

          {langOpen && (
            <div
              className={`absolute top-12 ${popSideLang} w-48 rounded-xl border shadow-xl backdrop-blur-sm z-50 animate-popup-scale`}
              style={{
                backgroundColor: "var(--bg-color)",
                borderColor: "var(--border-color)",
              }}
            >
              <button
                onClick={() => handleLangChange("en")}
                className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 ${
                  lang === "en" ? "font-semibold" : ""
                }`}
                style={{ color: "var(--text-color)" }}
              >
                <span className="text-lg">🇺🇸</span>
                English
                {lang === "en" && (
                  <span className="ml-auto text-xs" style={{ color: "var(--accent-color)" }}>
                    ✓
                  </span>
                )}
              </button>
              <button
                onClick={() => handleLangChange("ar")}
                className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 ${
                  lang === "ar" ? "font-semibold" : ""
                }`}
                style={{ color: "var(--text-color)" }}
              >
                <span className="text-lg">🇸🇦</span>
                العربية
                {lang === "ar" && (
                  <span className="ml-auto text-xs" style={{ color: "var(--accent-color)" }}>
                    ✓
                  </span>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 hover:shadow-sm"
            style={{
              backgroundColor: "var(--hover-color)",
              color: "var(--text-color)",
            }}
          >
            <div className="flex items-center gap-3">
              <img
                src={
                  user?.profileImage
                    ? `${import.meta.env.VITE_API_URL}${user.profileImage}`
                    : AvatarIcon
                }
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium">
                  {userLoading ? "..." : user?.firstName + " " + user?.lastName}
                </p>
                <p className="text-xs" style={{ color: "var(--sub-text-color)" }}>
                  Administrator
                </p>
              </div>
            </div>
            <ChevronDown size={14} />
          </button>

          {profileOpen && (
            <div
              className={`absolute top-12 ${popSideLang} w-64 rounded-xl border shadow-xl backdrop-blur-sm z-50 animate-popup-scale`}
              style={{
                backgroundColor: "var(--bg-color)",
                borderColor: "var(--border-color)",
              }}
            >
              {/* Profile Header */}
              <div className="p-4 border-b" style={{ borderColor: "var(--border-color)" }}>
                <div className="flex items-center gap-3">
                  <img
                    src={
                      user?.profileImage
                        ? `${import.meta.env.VITE_API_URL}${user.profileImage}`
                        : AvatarIcon
                    }
                    alt="Profile"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold" style={{ color: "var(--text-color)" }}>
                      {userLoading ? "..." : user?.firstName + " " + user?.lastName}
                    </p>
                    <p className="text-sm" style={{ color: "var(--sub-text-color)" }}>
                      Administrator
                    </p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-2">
                <button
                  onClick={() => {
                    navigate("/pages/User/profile");
                    setProfileOpen(false);
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3"
                  style={{ color: "var(--text-color)" }}
                >
                  <User size={16} />
                  Profile Settings
                </button>
                <button
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3"
                  style={{ color: "var(--text-color)" }}
                >
                  <Settings size={16} />
                  Admin Settings
                </button>
                <hr className="my-2" style={{ borderColor: "var(--border-color)" }} />
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-3 text-left hover:bg-red-50 transition-colors flex items-center gap-3 text-red-600"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBarAdmin;
