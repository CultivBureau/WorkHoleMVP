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
import { useLang } from "../../contexts/LangContext";

const NavBarAdmin = () => {
  const { lang, setLang, isRtl } = useLang();
  const { t, i18n } = useTranslation();
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

  const popSideLang = isRtl ? "left-0" : "right-0";

  // Change language and save to localStorage
  const handleLangChange = (lng) => {
    setLang(lng); // فقط استخدم context
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
          title: isRtl ? 'طلب إجازة جديد' : 'New Leave Request',
          message: isRtl 
            ? `${leave.userName || 'موظف'} طلب ${leave.leaveDays || 1} أيام إجازة`
            : `${leave.userName || 'Employee'} requested ${leave.leaveDays || 1} days leave`,
          time: new Date(leave.createdAt).toLocaleDateString(isRtl ? 'ar-SA' : 'en-US'),
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
          title: isRtl ? 'وصول متأخر' : 'Late Arrival',
          message: isRtl 
            ? `${attendance.userName || 'موظف'} وصل متأخراً اليوم`
            : `${attendance.userName || 'Employee'} arrived late today`,
          time: new Date(attendance.checkInTime).toLocaleTimeString(isRtl ? 'ar-SA' : 'en-US'),
          isNew: true
        });
      });
    }

    return notifications.slice(0, 5); // Show max 5 notifications
  };

  const notifications = getNotifications();

  return (
    <nav
      className={`w-full h-16 border-b border-gray-200 flex items-center justify-between px-3 sm:px-6 sticky top-0 z-40 backdrop-blur-sm ${isRtl ? 'flex-row-reverse' : ''}`}
      style={{
        background: "var(--bg-color)",
        borderColor: "var(--border-color)",
      }}
    >
      {/* Left Section - Admin Badge & Search */}
      <div className={`flex items-center gap-2 sm:gap-4 ${isRtl ? 'flex-row-reverse' : ''}`}>
        {/* Admin Badge */}
        <div className={`flex items-center gap-2 px-2 sm:px-3 py-1.5 rounded-lg border ${isRtl ? 'flex-row-reverse' : ''}`} style={{ 
          backgroundColor: "var(--hover-color)", 
          borderColor: "var(--accent-color)",
          color: "var(--accent-color)"
        }}>
          <Shield className="w-4 h-4" />
          <span className="text-xs sm:text-sm font-semibold hidden sm:inline">
            {isRtl ? 'لوحة الإدارة' : 'Admin Panel'}
          </span>
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
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl border transition-all duration-300 hover:shadow-sm ${isRtl ? 'flex-row-reverse' : ''}`}
              style={{
                backgroundColor: "var(--bg-color)",
                borderColor: "var(--border-color)",
                color: "var(--sub-text-color)",
              }}
            >
              <Search size={16} />
              <span className="text-sm hidden lg:inline">
                {isRtl ? 'البحث في لوحة الإدارة...' : 'Search admin panel...'}
              </span>
            </button>
          ) : (
            <div className={`flex items-center gap-2 animate-popup-scale ${isRtl ? 'flex-row-reverse' : ''}`}>
              <div className="relative">
                <Search
                  size={16}
                  className={`absolute top-1/2 transform -translate-y-1/2 ${isRtl ? 'right-3' : 'left-3'}`}
                  style={{ color: "var(--sub-text-color)" }}
                />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder={isRtl ? 'البحث في المستخدمين، الحضور، الإجازات...' : 'Search users, attendance, leaves...'}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className={`w-64 sm:w-80 py-2 rounded-xl border outline-none transition-all duration-300 ${isRtl ? 'pr-10 pl-4 text-right' : 'pl-10 pr-4'}`}
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

      {/* Center Section - Date & Time (Hidden on mobile) */}
      <div className={`hidden lg:flex items-center gap-4 text-sm ${isRtl ? 'flex-row-reverse' : ''}`}>
        <div className={`flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`} style={{ color: "var(--text-color)" }}>
          <Calendar size={16} style={{ color: "var(--accent-color)" }} />
          <span className="font-medium">{date}</span>
        </div>
        <div className={`flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`} style={{ color: "var(--text-color)" }}>
          <Clock size={16} style={{ color: "var(--accent-color)" }} />
          <span className="font-mono font-semibold">{time}</span>
        </div>
      </div>

      {/* Right Section - Stats, Notifications, Language, Profile */}
      <div className={`flex items-center gap-2 sm:gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
        {/* Dynamic Quick Stats (Hidden on smaller screens) */}
        <div className={`hidden xl:flex items-center gap-4 px-4 py-2 rounded-lg border ${isRtl ? 'flex-row-reverse' : ''}`} style={{
          backgroundColor: "var(--hover-color)",
          borderColor: "var(--border-color)"
        }}>
          <div className={`flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
            <Users size={16} style={{ color: "var(--accent-color)" }} />
            <span className="text-sm font-medium" style={{ color: "var(--text-color)" }}>
              {isRtl ? `المستخدمون: ${usersLoading ? "..." : stats.totalUsers}` : `Users: ${usersLoading ? "..." : stats.totalUsers}`}
            </span>
          </div>
          <div className={`flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
            <BarChart3 size={16} style={{ color: "var(--accent-color)" }} />
            <span className="text-sm font-medium" style={{ color: "var(--text-color)" }}>
              {isRtl ? `نشط: ${attendanceLoading ? "..." : stats.activeUsers}` : `Active: ${attendanceLoading ? "..." : stats.activeUsers}`}
            </span>
          </div>
        </div>



        {/* Language Selector */}
        <div className="relative" ref={langRef}>
          <button
            onClick={() => setLangOpen(!langOpen)}
            className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded-xl transition-all duration-200 hover:shadow-sm ${isRtl ? 'flex-row-reverse' : ''}`}
            style={{
              backgroundColor: "var(--hover-color)",
              color: "var(--text-color)",
            }}
          >
            <Globe size={16} />
            <span className="text-sm font-medium hidden sm:block">
              {lang === "ar" ? "العربية" : "English"}
            </span>
            <ChevronDown size={14} className="hidden sm:block" />
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
                className={`w-full px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3 ${
                  lang === "en" ? "font-semibold" : ""
                } ${isRtl ? 'flex-row-reverse text-right' : 'text-left'}`}
                style={{ color: "var(--text-color)" }}
              >
                <span className="text-lg">🇺🇸</span>
                English
                {lang === "en" && (
                  <span className={`text-xs ${isRtl ? 'mr-auto' : 'ml-auto'}`} style={{ color: "var(--accent-color)" }}>
                    ✓
                  </span>
                )}
              </button>
              <button
                onClick={() => handleLangChange("ar")}
                className={`w-full px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3 ${
                  lang === "ar" ? "font-semibold" : ""
                } ${isRtl ? 'flex-row-reverse text-right' : 'text-left'}`}
                style={{ color: "var(--text-color)" }}
              >
                <span className="text-lg">🇸🇦</span>
                العربية
                {lang === "ar" && (
                  <span className={`text-xs ${isRtl ? 'mr-auto' : 'ml-auto'}`} style={{ color: "var(--accent-color)" }}>
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
            className={`flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 rounded-xl transition-all duration-200 hover:shadow-sm ${isRtl ? 'flex-row-reverse' : ''}`}
            style={{
              backgroundColor: "var(--hover-color)",
              color: "var(--text-color)",
            }}
          >
            <div className={`flex items-center gap-2 sm:gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
              <img
                src={
                  user?.profileImage
                    ? `${import.meta.env.VITE_API_URL}${user.profileImage}`
                    : AvatarIcon
                }
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className={`hidden sm:block ${isRtl ? 'text-right' : 'text-left'}`}>
                <p className="text-sm font-medium">
                  {userLoading ? "..." : `${user?.firstName || ''} ${user?.lastName || ''}`.trim()}
                </p>
                <p className="text-xs" style={{ color: "var(--sub-text-color)" }}>
                  {isRtl ? 'مدير النظام' : 'Administrator'}
                </p>
              </div>
            </div>
            <ChevronDown size={14} className="hidden sm:block" />
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
                <div className={`flex items-center gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
                  <img
                    src={
                      user?.profileImage
                        ? `${import.meta.env.VITE_API_URL}${user.profileImage}`
                        : AvatarIcon
                    }
                    alt="Profile"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className={isRtl ? 'text-right' : 'text-left'}>
                    <p className="font-semibold" style={{ color: "var(--text-color)" }}>
                      {userLoading ? "..." : `${user?.firstName || ''} ${user?.lastName || ''}`.trim()}
                    </p>
                    <p className="text-sm" style={{ color: "var(--sub-text-color)" }}>
                      {isRtl ? 'مدير النظام' : 'Administrator'}
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
                  className={`w-full px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3 ${isRtl ? 'flex-row-reverse text-right' : 'text-left'}`}
                  style={{ color: "var(--text-color)" }}
                >
                  <User size={16} />
                  {isRtl ? 'إعدادات الملف الشخصي' : 'Profile Settings'}
                </button>
                <button
                  className={`w-full px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3 ${isRtl ? 'flex-row-reverse text-right' : 'text-left'}`}
                  style={{ color: "var(--text-color)" }}
                >
                  <Settings size={16} />
                  {isRtl ? 'إعدادات الإدارة' : 'Admin Settings'}
                </button>
                <hr className="my-2" style={{ borderColor: "var(--border-color)" }} />
                <button
                  onClick={handleLogout}
                  className={`w-full px-4 py-3 hover:bg-red-50 transition-colors flex items-center gap-3 text-red-600 ${isRtl ? 'flex-row-reverse text-right' : 'text-left'}`}
                >
                  <LogOut size={16} />
                  {isRtl ? 'تسجيل الخروج' : 'Sign Out'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
          <div 
            ref={mobileMenuRef}
            className={`h-full w-80 shadow-xl transform transition-transform duration-300 ${isRtl ? 'mr-auto' : 'ml-auto'}`}
            style={{ backgroundColor: "var(--bg-color)" }}
          >
            <div className="p-4 border-b" style={{ borderColor: "var(--border-color)" }}>
              <div className={`flex items-center justify-between ${isRtl ? 'flex-row-reverse' : ''}`}>
                <h2 className="text-lg font-semibold" style={{ color: "var(--text-color)" }}>
                  {isRtl ? 'لوحة الإدارة' : 'Admin Panel'}
                </h2>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  style={{ color: "var(--sub-text-color)" }}
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            {/* Mobile Search */}
            <div className="p-4 border-b" style={{ borderColor: "var(--border-color)" }}>
              <div className="relative">
                <Search
                  size={16}
                  className={`absolute top-1/2 transform -translate-y-1/2 ${isRtl ? 'right-3' : 'left-3'}`}
                  style={{ color: "var(--sub-text-color)" }}
                />
                <input
                  type="text"
                  placeholder={isRtl ? 'البحث...' : 'Search...'}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className={`w-full py-2 rounded-xl border ${isRtl ? 'pr-10 pl-4 text-right' : 'pl-10 pr-4'}`}
                  style={{
                    backgroundColor: "var(--bg-color)",
                    borderColor: "var(--border-color)",
                    color: "var(--text-color)",
                  }}
                />
              </div>
            </div>

            {/* Mobile Date/Time */}
            <div className="p-4 border-b" style={{ borderColor: "var(--border-color)" }}>
              <div className={`flex items-center gap-3 mb-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
                <Calendar size={16} style={{ color: "var(--accent-color)" }} />
                <span className="text-sm font-medium" style={{ color: "var(--text-color)" }}>
                  {date}
                </span>
              </div>
              <div className={`flex items-center gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
                <Clock size={16} style={{ color: "var(--accent-color)" }} />
                <span className="text-sm font-mono font-semibold" style={{ color: "var(--text-color)" }}>
                  {time}
                </span>
              </div>
            </div>

            {/* Mobile Stats */}
            <div className="p-4">
              <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--text-color)" }}>
                {isRtl ? 'إحصائيات سريعة' : 'Quick Stats'}
              </h3>
              <div className="space-y-3">
                <div className={`flex items-center justify-between ${isRtl ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
                    <Users size={16} style={{ color: "var(--accent-color)" }} />
                    <span className="text-sm" style={{ color: "var(--text-color)" }}>
                      {isRtl ? 'المستخدمون' : 'Total Users'}
                    </span>
                  </div>
                  <span className="text-sm font-semibold" style={{ color: "var(--text-color)" }}>
                    {usersLoading ? "..." : stats.totalUsers}
                  </span>
                </div>
                <div className={`flex items-center justify-between ${isRtl ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
                    <BarChart3 size={16} style={{ color: "var(--accent-color)" }} />
                    <span className="text-sm" style={{ color: "var(--text-color)" }}>
                      {isRtl ? 'المستخدمون النشطون' : 'Active Users'}
                    </span>
                  </div>
                  <span className="text-sm font-semibold" style={{ color: "var(--text-color)" }}>
                    {attendanceLoading ? "..." : stats.activeUsers}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBarAdmin;
