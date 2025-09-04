import React, { useState, useEffect, useCallback } from "react";
import NavBarAdmin from "../../../components/admin/NavBarAdmin";
import SideBarAdmin from "../../../components/admin/SideBarAdmin";
import ClockinAdmin from "../../../components/admin/clockinAdmin";
import { useTranslation } from "react-i18next";
import {
  Users,
  UserCheck,
  Clock,
  MapPin,
  Calendar,
  Download,
  Filter,
  Search,
  RefreshCw,
  Eye,
  MoreVertical,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { useGetAllUsersAttendanceQuery } from "../../../services/apis/AtteandanceApi";
import SetOfficeLocation from "../../../components/admin/SetOfficeLocation";

const AttendanceAdmin = ({ lang, setLang }) => {
  const { i18n } = useTranslation();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterLocation, setFilterLocation] = useState("all");
  const [dateFilter, setDateFilter] = useState("today");
  const { data: attendanceData, isLoading, refetch } = useGetAllUsersAttendanceQuery(dateFilter);
  const [showOfficeLocationModal, setShowOfficeLocationModal] = useState(false);
  // Add this state for active card
  const [activeCard, setActiveCard] = useState(null);

  useEffect(() => {
    i18n.changeLanguage(lang);
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    localStorage.setItem("lang", lang);
  }, [lang, i18n]);

  const isRtl = lang === "ar";

  // فلترة حسب الفترة المختارة
  const filterByDate = (attendance) => {
    const date = new Date(attendance.date); // تأكد أن لديك حقل date في attendance
    const now = new Date();
    if (dateFilter === "today") {
      return date.toDateString() === now.toDateString();
    }
    if (dateFilter === "lastWeek") {
      const lastWeek = new Date(now);
      lastWeek.setDate(now.getDate() - 7);
      return date >= lastWeek && date <= now;
    }
    if (dateFilter === "lastMonth") {
      const lastMonth = new Date(now);
      lastMonth.setMonth(now.getMonth() - 1);
      return date >= lastMonth && date <= now;
    }
    return true;
  };

  // Keep original stats calculations for display (don't change these)
  const totalPresent = attendanceData?.filter(a => a.status === 'present').length || 0;
  const totalLate = attendanceData?.filter(a => a.status === 'late').length || 0;
  const totalAbsent = attendanceData?.filter(a => a.status === 'absent').length || 0;
  const officeUsers = attendanceData?.filter(a => a.location === 'office').length || 0;

  // Filtered data for table (this changes based on active card)
  const filteredData = attendanceData?.filter(attendance => {
    const matchesSearch = 
      attendance.user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attendance.user?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attendance.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || attendance.status === filterStatus;
    const matchesLocation = filterLocation === "all" || attendance.location === filterLocation;
    
    // Add card filter
    const matchesCard = !activeCard || 
      (activeCard === 'present' && attendance.status === 'present') ||
      (activeCard === 'late' && attendance.status === 'late') ||
      (activeCard === 'absent' && attendance.status === 'absent') ||
      (activeCard === 'office' && attendance.location === 'office');
    
    return matchesSearch && matchesStatus && matchesLocation && filterByDate(attendance) && matchesCard;
  }) || [];

  // Stats cards using original numbers (these never change)
  const statsCards = [
    {
      title: isRtl ? "حاضر" : "Present",
      value: totalPresent, // Always shows original count
      icon: CheckCircle,
      color: "#10B981",
      bgColor: "#ECFDF5"
    },
    {
      title: isRtl ? "متأخر" : "Late", 
      value: totalLate, // Always shows original count
      icon: AlertTriangle,
      color: "#F59E0B", 
      bgColor: "#FFFBEB"
    },
    {
      title: isRtl ? "غائب" : "Absent",
      value: totalAbsent, // Always shows original count
      icon: XCircle,
      color: "#EF4444",
      bgColor: "#FEF2F2"
    },
    {
      title: isRtl ? "في المكتب" : "In Office",
      value: officeUsers, // Always shows original count
      icon: MapPin,
      color: "#3B82F6",
      bgColor: "#EFF6FF"
    }
  ];

  // Handle card click
  const handleCardClick = (cardType) => {
    if (activeCard === cardType) {
      setActiveCard(null); // Deselect if already active
    } else {
      setActiveCard(cardType);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return { bg: 'bg-green-100', text: 'text-green-800', color: '#10B981' };
      case 'late': return { bg: 'bg-yellow-100', text: 'text-yellow-800', color: '#F59E0B' };
      case 'absent': return { bg: 'bg-red-100', text: 'text-red-800', color: '#EF4444' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-800', color: '#6B7280' };
    }
  };

  const getLocationIcon = (location) => {
    return location === 'office' ? 
      <MapPin size={16} className="text-blue-500" /> : 
      <MapPin size={16} className="text-purple-500" />;
  };

  // Custom hook for dynamic time calculation
  const useDynamicTime = (attendanceData) => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
      const timer = setInterval(() => {
        setCurrentTime(new Date());
      }, 1000);

      return () => clearInterval(timer);
    }, []);

    const formatTime = (timeString) => {
      if (!timeString || timeString === 'N/A') return 'N/A';
      
      // If it's already a time string like "09:30", convert to 12-hour format
      if (typeof timeString === 'string' && timeString.includes(':')) {
        try {
          const [hours, minutes] = timeString.split(':').map(Number);
          const date = new Date();
          date.setHours(hours, minutes, 0, 0);
          return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          });
        } catch (error) {
          return timeString; // fallback to original if conversion fails
        }
      }
      
      // If it's a full datetime, extract time in 12-hour format
      try {
        const date = new Date(timeString);
        if (isNaN(date.getTime())) return 'N/A';
        return date.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });
      } catch (error) {
        return 'N/A';
      }
    };

    const calculateWorkHours = useCallback((clockIn, clockOut, isCurrentlyWorking = false) => {
      if (!clockIn || clockIn === 'N/A') return '0h 0m';
      
      try {
        let startTime, endTime;
        
        // Parse clock in time
        if (typeof clockIn === 'string' && clockIn.includes(':')) {
          // It's a time string like "09:30"
          const [hours, minutes] = clockIn.split(':').map(Number);
          startTime = new Date();
          startTime.setHours(hours, minutes, 0, 0);
        } else {
          // It's a full datetime
          startTime = new Date(clockIn);
          if (isNaN(startTime.getTime())) return '0h 0m';
        }
        
        // Parse clock out time
        if (clockOut && clockOut !== 'N/A') {
          if (typeof clockOut === 'string' && clockOut.includes(':')) {
            // It's a time string like "17:30"
            const [hours, minutes] = clockOut.split(':').map(Number);
            endTime = new Date();
            endTime.setHours(hours, minutes, 0, 0);
          } else {
            // It's a full datetime
            endTime = new Date(clockOut);
            if (isNaN(endTime.getTime())) return '0h 0m';
          }
        } else if (isCurrentlyWorking) {
          // User is currently working, use current time
          endTime = currentTime;
        } else {
          return '0h 0m';
        }
        
        const diffMs = endTime - startTime;
        if (diffMs < 0) return '0h 0m';
        
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        
        return `${diffHours}h ${diffMinutes}m`;
      } catch (error) {
        console.error('Error calculating work hours:', error);
        return '0h 0m';
      }
    }, [currentTime]);

    const getDynamicClockIn = (attendance) => {
      return formatTime(attendance.clockIn);
    };

    const getDynamicClockOut = (attendance) => {
      if (attendance.clockOut && attendance.clockOut !== 'N/A') {
        return formatTime(attendance.clockOut);
      }
      // If user is currently working (status is present and no clock out), show live time
      if (attendance.status === 'present' && (!attendance.clockOut || attendance.clockOut === 'N/A')) {
        return currentTime.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        }) + ' (Live)';
      }
      return 'N/A';
    };

    const getDynamicWorkHours = (attendance) => {
      const isCurrentlyWorking = attendance.status === 'present' && (!attendance.clockOut || attendance.clockOut === 'N/A');
      
      if (isCurrentlyWorking) {
        // Calculate live work hours
        return calculateWorkHours(attendance.clockIn, attendance.clockOut, true);
      } else {
        // Use the work hours from backend for completed shifts
        return attendance.workHours || '0h 0m';
      }
    };

    return {
      currentTime,
      getDynamicClockIn,
      getDynamicClockOut,
      getDynamicWorkHours
    };
  };

  const { getDynamicClockIn, getDynamicClockOut, getDynamicWorkHours } = useDynamicTime(filteredData);

  return (
    <div 
      className="w-full h-screen flex flex-col"
      style={{ background: "var(--bg-all)" }}
    >
      {/* Navigation Bar */}
      <NavBarAdmin 
        lang={lang} 
        setLang={setLang}
        onMobileSidebarToggle={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        isMobileSidebarOpen={isMobileSidebarOpen}
      />

      {/* Content Area */}
      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <SideBarAdmin 
          lang={lang}
          isMobileOpen={isMobileSidebarOpen}
          onMobileClose={() => setIsMobileSidebarOpen(false)}
        />

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6" style={{ background: "var(--bg-all)" }}>
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold gradient-text">
                  {isRtl ? "إدارة الحضور والانصراف" : "Attendance Management"}
                </h1>
                <p className="text-lg mt-2" style={{ color: "var(--sub-text-color)" }}>
                  {isRtl ? "تتبع وإدارة حضور الموظفين" : "Track and manage employee attendance"}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowOfficeLocationModal(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 transform active:scale-95"
                  style={{
                    background: "linear-gradient(135deg, var(--accent-hover) 0%, var(--accent-color) 100%)"
                  }}
                >
                  <MapPin size={16} />
                  {isRtl ? "تحديد موقع المكتب" : "Set Office Location"}
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {statsCards.map((card, index) => {
                const cardTypes = ['present', 'late', 'absent', 'office'];
                const cardType = cardTypes[index];
                const isActive = activeCard === cardType;
                
                return (
                  <div
                    key={index}
                    onClick={() => handleCardClick(cardType)}
                    className="p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg cursor-pointer"
                    style={{
                      backgroundColor: "var(--bg-color)",
                      borderColor: isActive ? "var(--accent-color)" : "var(--border-color)",
                      borderWidth: isActive ? "2px" : "1px",
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm mb-2" style={{ color: "var(--sub-text-color)" }}>
                          {card.title}
                        </p>
                        <p className="text-3xl font-bold" style={{ color: "var(--text-color)" }}>
                          {card.value}
                        </p>
                      </div>
                      <div 
                        className="p-3 rounded-xl"
                        style={{ backgroundColor: card.bgColor }}
                      >
                        <card.icon size={24} style={{ color: card.color }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Reset Filter Button */}
            {activeCard && (
              <div className="flex justify-center">
                <button
                  onClick={() => setActiveCard(null)}
                  className="px-4 py-2 rounded-xl border transition-all duration-200 hover:shadow-md flex items-center gap-2"
                  style={{
                    backgroundColor: "var(--bg-color)",
                    borderColor: "var(--border-color)",
                    color: "var(--text-color)",
                  }}
                >
                  <RefreshCw size={16} />
                  <span className="text-sm font-medium">
                    {isRtl ? 'إعادة تعيين الفلتر' : 'Reset Filter'}
                  </span>
                </button>
              </div>
            )}

            {/* Filters and Search */}
            <div 
              className="p-6 rounded-2xl border"
              style={{
                backgroundColor: "var(--bg-color)",
                borderColor: "var(--border-color)",
              }}
            >
              <div className="flex flex-col lg:flex-row gap-4">
                
                {/* Search */}
                <div className="flex-1">
                  <div className="relative">
                    <Search 
                      size={20} 
                      className="absolute left-3 top-1/2 transform -translate-y-1/2"
                      style={{ color: "var(--sub-text-color)" }}
                    />
                    <input
                      type="text"
                      placeholder={isRtl ? "البحث عن موظف..." : "Search employee..."}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border outline-none transition-all duration-200"
                      style={{
                        backgroundColor: "var(--bg-color)",
                        borderColor: "var(--border-color)",
                        color: "var(--text-color)",
                      }}
                    />
                  </div>
                </div>

                {/* Status Filter */}
                <div className="lg:w-48">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border outline-none transition-all duration-200"
                    style={{
                      backgroundColor: "var(--bg-color)",
                      borderColor: "var(--border-color)",
                      color: "var(--text-color)",
                    }}
                  >
                    <option value="all">{isRtl ? "جميع الحالات" : "All Status"}</option>
                    <option value="present">{isRtl ? "حاضر" : "Present"}</option>
                    <option value="late">{isRtl ? "متأخر" : "Late"}</option>
                    <option value="absent">{isRtl ? "غائب" : "Absent"}</option>
                  </select>
                </div>

                {/* Location Filter */}
                <div className="lg:w-48">
                  <select
                    value={filterLocation}
                    onChange={(e) => setFilterLocation(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border outline-none transition-all duration-200"
                    style={{
                      backgroundColor: "var(--bg-color)",
                      borderColor: "var(--border-color)",
                      color: "var(--text-color)",
                    }}
                  >
                    <option value="all">{isRtl ? "جميع المواقع" : "All Locations"}</option>
                    <option value="office">{isRtl ? "المكتب" : "Office"}</option>
                    <option value="home">{isRtl ? "من المنزل" : "Remote"}</option>
                  </select>
                </div>

                {/* Date Filter */}
                <div className="lg:w-48">
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border outline-none transition-all duration-200"
                    style={{
                      backgroundColor: "var(--bg-color)",
                      borderColor: "var(--border-color)",
                      color: "var(--text-color)",
                    }}
                  >
                    <option value="today">{isRtl ? "اليوم" : "Today"}</option>
                    <option value="lastWeek">{isRtl ? "الأسبوع الماضي" : "Last Week"}</option>
                    <option value="lastMonth">{isRtl ? "الشهر الماضي" : "Last Month"}</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Attendance Table */}
            <div 
              className="rounded-2xl border overflow-hidden"
              style={{
                backgroundColor: "var(--bg-color)",
                borderColor: "var(--border-color)",
              }}
            >
              <div className="p-6 border-b" style={{ borderColor: "var(--border-color)" }}>
                <h2 className="text-xl font-bold" style={{ color: "var(--text-color)" }}>
                  {isRtl ? "سجل الحضور اليوم" : "Today's Attendance Log"}
                </h2>
                <p className="text-sm mt-1" style={{ color: "var(--sub-text-color)" }}>
                  {isRtl ? `${filteredData.length} موظف` : `${filteredData.length} employees`}
                </p>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: "var(--accent-color)" }}></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead style={{ backgroundColor: "var(--hover-color)" }}>
                      <tr>
                        <th className="text-left py-4 px-6 font-semibold" style={{ color: "var(--text-color)" }}>
                          {isRtl ? "الموظف" : "Employee"}
                        </th>
                        <th className="text-left py-4 px-6 font-semibold" style={{ color: "var(--text-color)" }}>
                          {isRtl ? "وقت الحضور" : "Clock In"}
                        </th>
                        <th className="text-left py-4 px-6 font-semibold" style={{ color: "var(--text-color)" }}>
                          {isRtl ? "وقت الانصراف" : "Clock Out"}
                        </th>
                        <th className="text-left py-4 px-6 font-semibold" style={{ color: "var(--text-color)" }}>
                          {isRtl ? "ساعات العمل" : "Work Hours"}
                        </th>
                        <th className="text-left py-4 px-6 font-semibold" style={{ color: "var(--text-color)" }}>
                          {isRtl ? "الموقع" : "Location"}
                        </th>
                        <th className="text-left py-4 px-6 font-semibold" style={{ color: "var(--text-color)" }}>
                          {isRtl ? "الحالة" : "Status"}
                        </th>
  
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.map((attendance, index) => {
                        const statusStyle = getStatusColor(attendance.status);
                        
                        return (
                          <tr 
                            key={index}
                            className="border-b hover:bg-gray-50 transition-colors"
                            style={{ borderColor: "var(--border-color)" }}
                          >
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                                  {attendance.user?.firstName?.charAt(0)}{attendance.user?.lastName?.charAt(0)}
                                </div>
                                <div>
                                  <p className="font-medium" style={{ color: "var(--text-color)" }}>
                                    {attendance.user?.firstName} {attendance.user?.lastName}
                                  </p>
                                  <p className="text-sm" style={{ color: "var(--sub-text-color)" }}>
                                    {attendance.user?.email}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-2">
                                <Clock size={16} style={{ color: "var(--sub-text-color)" }} />
                                <span style={{ color: "var(--text-color)" }}>
                                  {getDynamicClockIn(attendance)}
                                </span>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-2">
                                <Clock size={16} style={{ color: "var(--sub-text-color)" }} />
                                <span style={{ color: "var(--text-color)" }}>
                                  {getDynamicClockOut(attendance)}
                                </span>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <span style={{ color: "var(--text-color)" }}>
                                {getDynamicWorkHours(attendance)}
                              </span>
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-2">
                                {getLocationIcon(attendance.location)}
                                <span style={{ color: "var(--text-color)" }}>
                                  {attendance.location === 'office' ? 
                                    (isRtl ? 'المكتب' : 'Office') : 
                                    (isRtl ? 'من المنزل' : 'Remote')
                                  }
                                </span>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}>
                                {attendance.status === 'present' ? (isRtl ? 'حاضر' : 'Present') :
                                 attendance.status === 'late' ? (isRtl ? 'متأخر' : 'Late') :
                                 (isRtl ? 'غائب' : 'Absent')}
                              </span>
                            </td>

                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
      <div className="w-[100%] bg-[var(--bg-color)] h-max flex justify-center items-center p-6">
        <ClockinAdmin />
      </div>
        </main>
      </div>

      {/* Office Location Modal */}
      {showOfficeLocationModal && (
        <SetOfficeLocation onClose={() => setShowOfficeLocationModal(false)} />
      )}
    </div>
  );
};

export default AttendanceAdmin;