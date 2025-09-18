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
import { useGetAllUsersAttendanceQuery, useGetAllOfficesQuery, useEditOfficeMutation, useDeleteOfficeMutation, useSetOfficeLocationMutation } from "../../../services/apis/AtteandanceApi";
import SetOfficeLocation from "../../../components/admin/SetOfficeLocation";
import { useAttendanceUpdate } from "../../../contexts/AttendanceUpdateContext";
import EditOfficeModal from "../../../components/admin/EditOfficeModal";
import ConfirmModal from "../../../components/admin/ConfirmModal";
import toast from 'react-hot-toast';
import { useLang } from "../../../contexts/LangContext";

const AttendanceAdmin = () => {
  const { lang, isRtl } = useLang();
  const { i18n } = useTranslation();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Create stable toggle functions using useCallback
  const toggleMobileSidebar = useCallback(() => {
    setIsMobileSidebarOpen(prev => !prev);
  }, []);

  const closeMobileSidebar = useCallback(() => {
    setIsMobileSidebarOpen(false);
  }, []);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterLocation, setFilterLocation] = useState("all");
  const [dateFilter, setDateFilter] = useState("today");
  const { lastUpdate } = useAttendanceUpdate();
  const { data: attendanceData, isLoading, refetch } = useGetAllUsersAttendanceQuery(
    dateFilter
  );
  const { data: offices = [], refetch: refetchOffices } = useGetAllOfficesQuery();
  const [editOffice] = useEditOfficeMutation();
  const [deleteOffice] = useDeleteOfficeMutation();
  const [setOfficeLocation] = useSetOfficeLocationMutation();
  const [showOfficeLocationModal, setShowOfficeLocationModal] = useState(false);
  const [editModal, setEditModal] = useState(null); // {office, open}
  const [deleteModal, setDeleteModal] = useState(null); // {office, open}
  // Add this state for active card
  const [activeCard, setActiveCard] = useState(null);

  // 1. State لليوم المختار في الأسبوع
  const [selectedWeekDay, setSelectedWeekDay] = useState(null);

  // 1. استخرج كل الموظفين الفريدين
  const uniqueUsers = React.useMemo(() => {
    if (!attendanceData) return [];
    const map = new Map();
    attendanceData.forEach(a => {
      if (a.user && a.user._id) map.set(a.user._id, a.user);
    });
    return Array.from(map.values());
  }, [attendanceData]);

  // 2. استخرج كل الأيام الفريدة في الأسبوع
  const weekDays = React.useMemo(() => {
    if (dateFilter !== "lastWeek" || !attendanceData) return [];
    return Array.from(new Set(attendanceData.map(a => a.date))).sort();
  }, [attendanceData, dateFilter]);

  const getAttendanceForUserAndDay = (userId, date) => {
    return attendanceData?.find(a => a.user?._id === userId && a.date === date);
  };

  useEffect(() => {
    refetch();
  }, [lastUpdate]);

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
    
    // لو الفلتر lastWeek وفي يوم مختار، اعرض اليوم ده فقط
    if (dateFilter === "lastWeek" && selectedWeekDay) {
      return matchesSearch && matchesStatus && matchesLocation && matchesCard && attendance.date === selectedWeekDay;
    }
    // باقي الفلاتر العادية
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
      // Allow live calculation for both present and late
      const isCurrentlyWorking = 
        (attendance.status === 'present' || attendance.status === 'late') &&
        (!attendance.clockOut || attendance.clockOut === 'N/A');

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
    <div className="w-full h-screen flex flex-col" style={{ background: "var(--bg-all)" }}>
      <NavBarAdmin
        onMobileSidebarToggle={toggleMobileSidebar}
        isMobileSidebarOpen={isMobileSidebarOpen}
      />
      <div className="flex flex-1 min-h-0">
        <SideBarAdmin
          lang={lang}
          isMobileOpen={isMobileSidebarOpen}
          onMobileClose={closeMobileSidebar}
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
              ) : dateFilter === "lastWeek" ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead style={{ backgroundColor: "var(--hover-color)" }}>
                      <tr>
                        <th className="text-left py-4 px-6 font-semibold" style={{ color: "var(--text-color)" }}>
                          {isRtl ? "الموظف" : "Employee"}
                        </th>
                        <th className="text-left py-4 px-6 font-semibold" style={{ color: "var(--text-color)" }}>
                          {isRtl ? "اليوم" : "Day"}
                        </th>
                        <th className="text-left py-4 px-6 font-semibold" style={{ color: "var(--text-color)" }}>
                          {isRtl ? "التاريخ" : "Date"}
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
                      {uniqueUsers.map(user => {
                        // بيانات الموظف لكل الأيام (بدون holidays)
                        const userLogs = attendanceData
                          ?.filter(a => a.user?._id === user._id && a.status !== "holiday")
                          .sort((a, b) => a.date.localeCompare(b.date));
                        
                        if (!userLogs || userLogs.length === 0) return null;

                        return (
                          <React.Fragment key={user._id}>
                            {userLogs.map((att, idx) => {
                              const statusStyle = getStatusColor(att.status);
                              return (
                                <tr key={att.date + user._id} className="border-b hover:bg-opacity-30 transition-colors duration-200" style={{ borderColor: "var(--border-color)" }}>
                                  {/* عمود الموظف - يظهر فقط في أول صف */}
                                  {idx === 0 && (
                                    <td
                                      className="py-4 px-6 font-medium align-top border-r-2"
                                      rowSpan={userLogs.length}
                                      style={{ 
                                        color: "var(--text-color)", 
                                        minWidth: 200,
                                        borderColor: "var(--accent-color)",
                                        backgroundColor: "var(--hover-color)"
                                      }}
                                    >
                                      <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                                          {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                                        </div>
                                        <div>
                                          <div className="font-semibold text-sm">
                                            {user.firstName} {user.lastName}
                                          </div>
                                          <div className="text-xs" style={{ color: "var(--sub-text-color)" }}>
                                            {user.email}
                                          </div>
                                        </div>
                                      </div>
                                    </td>
                                  )}
                                  
                                  {/* باقي الأعمدة */}
                                  <td className="py-3 px-6" style={{ color: "var(--text-color)" }}>
                                    <div className="flex items-center gap-2">
                                      <Calendar size={14} style={{ color: "var(--sub-text-color)" }} />
                                      <span className="text-sm font-medium">{att.day}</span>
                                    </div>
                                  </td>
                                  
                                  <td className="py-3 px-6" style={{ color: "var(--sub-text-color)" }}>
                                    <span className="text-sm">{att.date}</span>
                                  </td>
                                  
                                  <td className="py-3 px-6">
                                    <div className="flex items-center gap-2">
                                      <Clock size={14} style={{ color: "var(--sub-text-color)" }} />
                                      <span className="text-sm" style={{ color: "var(--text-color)" }}>
                                        {att.clockIn}
                                      </span>
                                    </div>
                                  </td>
                                  
                                  <td className="py-3 px-6">
                                    <div className="flex items-center gap-2">
                                      <Clock size={14} style={{ color: "var(--sub-text-color)" }} />
                                      <span className="text-sm" style={{ color: "var(--text-color)" }}>
                                        {att.clockOut}
                                      </span>
                                    </div>
                                  </td>
                                  
                                  <td className="py-3 px-6">
                                    <span className="text-sm font-medium" style={{ color: "var(--text-color)" }}>
                                      {att.workHours}
                                    </span>
                                  </td>
                                  
                                  <td className="py-3 px-6">
                                    <div className="flex items-center gap-2">
                                      {getLocationIcon(att.location)}
                                      <span className="text-sm" style={{ color: "var(--text-color)" }}>
                                        {att.location === 'office' ? (isRtl ? 'المكتب' : 'Office') : (isRtl ? 'من المنزل' : 'Remote')}
                                      </span>
                                    </div>
                                  </td>
                                  
                                  <td className="py-3 px-6">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}>
                                      {att.status === 'present'
                                        ? (isRtl ? 'حاضر' : 'Present')
                                        : att.status === 'late'
                                        ? (isRtl ? 'متأخر' : 'Late')
                                        : (isRtl ? 'غائب' : 'Absent')}
                                    </span>
                                  </td>
                                </tr>
                              );
                            })}
                            
                            {/* خط فاصل نضيف بين كل موظف والتاني */}
                            <tr>
                              <td colSpan={8} className="py-2">
                                <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                              </td>
                            </tr>
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : dateFilter === "lastMonth" ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead style={{ backgroundColor: "var(--hover-color)" }}>
                      <tr>
                        <th className="text-left py-4 px-6 font-semibold" style={{ color: "var(--text-color)" }}>
                          {isRtl ? "الموظف" : "Employee"}
                        </th>
                        <th className="text-left py-4 px-6 font-semibold" style={{ color: "var(--text-color)" }}>
                          {isRtl ? "حاضر" : "Present"}
                        </th>
                        <th className="text-left py-4 px-6 font-semibold" style={{ color: "var(--text-color)" }}>
                          {isRtl ? "غائب" : "Absent"}
                        </th>
                        <th className="text-left py-4 px-6 font-semibold" style={{ color: "var(--text-color)" }}>
                          {isRtl ? "متأخر" : "Late"}
                        </th>
                        <th className="text-left py-4 px-6 font-semibold" style={{ color: "var(--text-color)" }}>
                          {isRtl ? "متوسط وقت الحضور" : "Avg Clock In"}
                        </th>
                        <th className="text-left py-4 px-6 font-semibold" style={{ color: "var(--text-color)" }}>
                          {isRtl ? "من المكتب" : "Office"}
                        </th>
                        <th className="text-left py-4 px-6 font-semibold" style={{ color: "var(--text-color)" }}>
                          {isRtl ? "من المنزل" : "Home"}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendanceData?.map((row, idx) => (
                        <tr key={row.user._id} className="border-b" style={{ borderColor: "var(--border-color)" }}>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                                {row.user.firstName?.charAt(0)}{row.user.lastName?.charAt(0)}
                              </div>
                              <div>
                                <p className="font-medium" style={{ color: "var(--text-color)" }}>
                                  {row.user.firstName} {row.user.lastName}
                                </p>
                                <p className="text-sm" style={{ color: "var(--sub-text-color)" }}>
                                  {row.user.email}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">{row.present}</td>
                          <td className="py-4 px-6">{row.absent}</td>
                          <td className="py-4 px-6">{row.late}</td>
                          <td className="py-4 px-6">{row.avgClockIn}</td>
                          <td className="py-4 px-6">{row.office}</td>
                          <td className="py-4 px-6">{row.home}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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

            {/* Offices Management Section */}
            <div className="rounded-2xl border overflow-hidden"
              style={{
                backgroundColor: "var(--bg-color)",
                borderColor: "var(--border-color)",
              }}
            >
              <div className="p-6 border-b" style={{ borderColor: "var(--border-color)" }}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold" style={{ color: "var(--text-color)" }}>
                      {isRtl ? "إدارة الفروع" : "Offices Management"}
                    </h2>
                    <p className="text-sm mt-1" style={{ color: "var(--sub-text-color)" }}>
                      {isRtl ? `${offices.length} فرع` : `${offices.length} offices`}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowOfficeLocationModal(true)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-medium transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 transform active:scale-95"
                    style={{
                      background: "linear-gradient(135deg, var(--accent-hover) 0%, var(--accent-color) 100%)",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)"
                    }}
                  >
                    <MapPin size={18} />
                    {isRtl ? "إضافة فرع جديد" : "Add New Office"}
                  </button>
                </div>
              </div>

              {offices.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                    style={{ backgroundColor: "var(--hover-color)" }}
                  >
                    <MapPin size={32} style={{ color: "var(--sub-text-color)" }} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--text-color)" }}>
                    {isRtl ? "لا توجد فروع" : "No Offices Found"}
                  </h3>
                  <p className="text-sm mb-6" style={{ color: "var(--sub-text-color)" }}>
                    {isRtl ? "ابدأ بإضافة أول فرع لشركتك" : "Start by adding your first office location"}
                  </p>
                  <button
                    onClick={() => setShowOfficeLocationModal(true)}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-medium transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 transform active:scale-95"
                    style={{
                      background: "linear-gradient(135deg, var(--accent-hover) 0%, var(--accent-color) 100%)"
                    }}
                  >
                    <MapPin size={18} />
                    {isRtl ? "إضافة فرع" : "Add Office"}
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead style={{ backgroundColor: "var(--hover-color)" }}>
                      <tr>
                        <th className={`text-${isRtl ? 'right' : 'left'} py-4 px-6 font-semibold`} style={{ color: "var(--text-color)" }}>
                          {isRtl ? "اسم الفرع" : "Office Name"}
                        </th>
                        <th className={`text-${isRtl ? 'right' : 'left'} py-4 px-6 font-semibold`} style={{ color: "var(--text-color)" }}>
                          {isRtl ? "العنوان" : "Address"}
                        </th>
                        <th className={`text-${isRtl ? 'right' : 'left'} py-4 px-6 font-semibold`} style={{ color: "var(--text-color)" }}>
                          {isRtl ? "الإحداثيات" : "Location"}
                        </th>
                        <th className={`text-${isRtl ? 'right' : 'left'} py-4 px-6 font-semibold`} style={{ color: "var(--text-color)" }}>
                          {isRtl ? "نطاق التغطية" : "Coverage Radius"}
                        </th>
                        <th className={`text-${isRtl ? 'right' : 'left'} py-4 px-6 font-semibold`} style={{ color: "var(--text-color)" }}>
                          {isRtl ? "الإجراءات" : "Actions"}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {offices.map((office, index) => (
                        <tr 
                          key={office._id}
                          className="border-b hover:bg-opacity-50 transition-colors duration-200"
                          style={{ 
                            borderColor: "var(--border-color)",
                            '&:hover': { backgroundColor: "var(--hover-color)" }
                          }}
                        >
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div 
                                className="w-10 h-10 rounded-xl flex items-center justify-center"
                                style={{ backgroundColor: "var(--accent-color)" }}
                              >
                                <MapPin size={20} className="text-white" />
                              </div>
                              <div>
                                <p className="font-semibold" style={{ color: "var(--text-color)" }}>
                                  {office.name}
                                </p>
                                <p className="text-xs" style={{ color: "var(--sub-text-color)" }}>
                                  Office #{index + 1}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span style={{ color: "var(--text-color)" }}>
                              {office.address || 
                                <span style={{ color: "var(--sub-text-color)" }} className="italic">
                                  {isRtl ? "غير محدد" : "Not specified"}
                                </span>
                              }
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="font-mono text-sm p-2 rounded-lg" style={{ backgroundColor: "var(--hover-color)", color: "var(--text-color)" }}>
                              <div>{office.latitude.toFixed(6)}°N</div>
                              <div>{office.longitude.toFixed(6)}°E</div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: office.radius > 150 ? "#10B981" : office.radius > 100 ? "#F59E0B" : "#EF4444" }}
                              ></div>
                              <span className="font-medium" style={{ color: "var(--text-color)" }}>
                                {office.radius}m
                              </span>
                              <span className="text-xs" style={{ color: "var(--sub-text-color)" }}>
                                {isRtl ? "نطاق" : "radius"}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setEditModal({ office, open: true })}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                                style={{
                                  backgroundColor: "#3B82F6",
                                  color: "white"
                                }}
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                  <path d="m18.5 2.5 2.1 2.1L13 12H11v-2l7.5-7.5z"/>
                                </svg>
                                {isRtl ? "تعديل" : "Edit"}
                              </button>
                              <button
                                onClick={() => setDeleteModal({ office, open: true })}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                                style={{
                                  backgroundColor: "#EF4444",
                                  color: "white"
                                }}
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <polyline points="3,6 5,6 21,6"/>
                                  <path d="m19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2v2"/>
                                  <line x1="10" y1="11" x2="10" y2="17"/>
                                  <line x1="14" y1="11" x2="14" y2="17"/>
                                </svg>
                                {isRtl ? "حذف" : "Delete"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Edit Modal */}
            {editModal?.open && (
              <EditOfficeModal
                office={editModal.office}
                onClose={() => setEditModal(null)}
                onSave={async (values) => {
                  await editOffice({ id: editModal.office._id, ...values });
                  setEditModal(null);
                  refetchOffices();
                }}
              />
            )}

            {/* Delete Modal */}
            {deleteModal?.open && (
              <ConfirmModal
                title={isRtl ? "تأكيد الحذف" : "Confirm Delete"}
                message={isRtl ? "هل أنت متأكد من حذف هذا الفرع؟" : "Are you sure you want to delete this office?"}
                onCancel={() => setDeleteModal(null)}
                onConfirm={async () => {
                  await deleteOffice({ id: deleteModal.office._id });
                  setDeleteModal(null);
                  refetchOffices();
                }}
              />
            )}
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