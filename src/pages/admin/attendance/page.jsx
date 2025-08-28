import React, { useState, useEffect } from "react";
import NavBarAdmin from "../../../components/admin/NavBarAdmin";
import SideBarAdmin from "../../../components/admin/SideBarAdmin";
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

const AttendanceAdmin = ({ lang, setLang }) => {
  const { i18n } = useTranslation();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterLocation, setFilterLocation] = useState("all");

  useEffect(() => {
    i18n.changeLanguage(lang);
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    localStorage.setItem("lang", lang);
  }, [lang, i18n]);

  const { data: attendanceData, isLoading, refetch } = useGetAllUsersAttendanceQuery();

  const isRtl = lang === "ar";

  // Filter attendance data
  const filteredData = attendanceData?.filter(attendance => {
    const matchesSearch = 
      attendance.user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attendance.user?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attendance.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || attendance.status === filterStatus;
    const matchesLocation = filterLocation === "all" || attendance.location === filterLocation;
    
    return matchesSearch && matchesStatus && matchesLocation;
  }) || [];

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

  // Stats calculations
  const totalPresent = filteredData.filter(a => a.status === 'present').length;
  const totalLate = filteredData.filter(a => a.status === 'late').length;
  const totalAbsent = filteredData.filter(a => a.status === 'absent').length;
  const officeUsers = filteredData.filter(a => a.location === 'office').length;

  const statsCards = [
    {
      title: isRtl ? "حاضر" : "Present",
      value: totalPresent,
      icon: CheckCircle,
      color: "#10B981",
      bgColor: "#ECFDF5"
    },
    {
      title: isRtl ? "متأخر" : "Late",
      value: totalLate,
      icon: AlertTriangle,
      color: "#F59E0B", 
      bgColor: "#FFFBEB"
    },
    {
      title: isRtl ? "غائب" : "Absent",
      value: totalAbsent,
      icon: XCircle,
      color: "#EF4444",
      bgColor: "#FEF2F2"
    },
    {
      title: isRtl ? "في المكتب" : "In Office",
      value: officeUsers,
      icon: MapPin,
      color: "#3B82F6",
      bgColor: "#EFF6FF"
    }
  ];

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
                  onClick={refetch}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors"
                  style={{
                    backgroundColor: "var(--bg-color)",
                    borderColor: "var(--border-color)",
                    color: "var(--text-color)"
                  }}
                >
                  <RefreshCw size={16} />
                  {isRtl ? "تحديث" : "Refresh"}
                </button>
                <button 
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium gradient-bg"
                >
                  <Download size={16} />
                  {isRtl ? "تصدير" : "Export"}
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {statsCards.map((card, index) => (
                <div
                  key={index}
                  className="p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg"
                  style={{
                    backgroundColor: "var(--bg-color)",
                    borderColor: "var(--border-color)",
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
              ))}
            </div>

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
                        <th className="text-left py-4 px-6 font-semibold" style={{ color: "var(--text-color)" }}>
                          {isRtl ? "الإجراءات" : "Actions"}
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
                                  {attendance.clockIn || 'N/A'}
                                </span>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-2">
                                <Clock size={16} style={{ color: "var(--sub-text-color)" }} />
                                <span style={{ color: "var(--text-color)" }}>
                                  {attendance.clockOut || 'N/A'}
                                </span>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <span style={{ color: "var(--text-color)" }}>
                                {attendance.workHours || '0h'}
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
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-2">
                                <button 
                                  className="p-2 rounded-lg transition-colors"
                                  style={{
                                    backgroundColor: "var(--hover-color)",
                                    color: "var(--text-color)"
                                  }}
                                >
                                  <Eye size={16} />
                                </button>
                                <button 
                                  className="p-2 rounded-lg transition-colors"
                                  style={{
                                    backgroundColor: "var(--hover-color)",
                                    color: "var(--text-color)"
                                  }}
                                >
                                  <MoreVertical size={16} />
                                </button>
                              </div>
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
        </main>
      </div>
    </div>
  );
};

export default AttendanceAdmin; 