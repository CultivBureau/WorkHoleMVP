import React, { useState ,useEffect, useCallback} from "react";
import NavBarAdmin from "../../../components/admin/NavBarAdmin";
import SideBarAdmin from "../../../components/admin/SideBarAdmin";
import { useTranslation } from "react-i18next";
import {
  Users,
  UserCheck,
  Clock,
  Calendar,
  Coffee,
  AlertTriangle,
  Activity,
  MapPin,
} from "lucide-react";
import { useGetAllUsersAttendanceQuery } from "../../../services/apis/AtteandanceApi";
import { useGetAllLeavesQuery } from "../../../services/apis/LeavesApi";
import { useGetAllUsersQuery } from "../../../services/apis/UsersApi";
import { useGetActiveBreaksCountQuery } from "../../../services/apis/BreakApi";
import { useNavigate } from "react-router-dom";
import { useLang } from "../../../contexts/LangContext";

const DashboardAdmin = () => {
  const { lang, isRtl } = useLang();
  const { i18n } = useTranslation();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

// أضف هذا لجعل الـtoggle button يشتغل
useEffect(() => {
  window.onMobileSidebarOpen = () => setIsMobileSidebarOpen(true);
  return () => {
    window.onMobileSidebarOpen = null;
  };
}, []);
  // Fetch admin data
  const { data: attendanceData = [], isLoading: attendanceLoading } = useGetAllUsersAttendanceQuery();
  const { data: leavesData = [], isLoading: leavesLoading } = useGetAllLeavesQuery();
  const { data: usersData = [], isLoading: usersLoading } = useGetAllUsersQuery();
  const { data: activeBreaksCount = 0 } = useGetActiveBreaksCountQuery();
  const navigate = useNavigate();

  // Stats calculations (all dynamic)
  const totalUsers = usersData.length;
  const activeUsers = attendanceData.filter(user => user.status === 'present' || user.status === 'late').length;
  const pendingLeaves = leavesData.filter(leave => leave.status === 'pending').length;
  const lateUsers = attendanceData.filter(user => user.status === 'late').length;

  const statsCards = [
    {
      title: isRtl ? "إجمالي الموظفين" : "Total Users",
      value: totalUsers,
      icon: Users,
      color: "#3B82F6",
      bgColor: "#EFF6FF",
      change: "+0",
      changeType: "positive"
    },
    {
      title: isRtl ? "الحاضرون اليوم" : "Present Today",
      value: activeUsers,
      icon: UserCheck,
      color: "#10B981",
      bgColor: "#ECFDF5",
      change: `${totalUsers ? Math.round((activeUsers/totalUsers)*100) : 0}%`,
      changeType: "positive"
    },
    {
      title: isRtl ? "طلبات الإجازات المعلقة" : "Pending Leaves",
      value: pendingLeaves,
      icon: Calendar,
      color: "#F59E0B",
      bgColor: "#FFFBEB",
      change: "",
      changeType: "neutral"
    },
    {
      title: isRtl ? "المتأخرون" : "Late Arrivals",
      value: lateUsers,
      icon: AlertTriangle,
      color: "#EF4444",
      bgColor: "#FEF2F2",
      change: "",
      changeType: "neutral"
    }
  ];

  // Create stable toggle functions using useCallback
  const toggleMobileSidebar = useCallback(() => {
    setIsMobileSidebarOpen(prev => !prev);
  }, []);

  const closeMobileSidebar = useCallback(() => {
    setIsMobileSidebarOpen(false);
  }, []);

  return (
    <div className="w-full h-screen flex flex-col" style={{ background: "var(--bg-all)" }}>
      {/* Navigation Bar */}
      <NavBarAdmin
        onMobileSidebarToggle={toggleMobileSidebar}
        isMobileSidebarOpen={isMobileSidebarOpen}
      />

      {/* Content Area */}
      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
    <SideBarAdmin
  lang={lang}
  isMobileOpen={isMobileSidebarOpen}
  onMobileClose={closeMobileSidebar}
/>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6" style={{ background: "var(--bg-all)" }}>
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Welcome Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold gradient-text">
                  {isRtl ? "لوحة تحكم المدير" : "Admin Dashboard"}
                </h1>
                <p className="text-lg mt-2" style={{ color: "var(--sub-text-color)" }}>
                  {isRtl ? "نظرة شاملة على أداء الموظفين والعمليات" : "Complete overview of employee performance and operations"}
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg border" style={{
                  backgroundColor: "var(--hover-color)",
                  borderColor: "var(--accent-color)",
                  color: "var(--accent-color)"
                }}>
                  <Activity size={20} />
                  <span className="font-semibold">
                    {isRtl ? "النظام نشط" : "System Active"}
                  </span>
                </div>
              </div>
            </div>

            {/* Stats Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {statsCards.map((card, index) => (
                <div
                  key={index}
                  className="p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
                  style={{
                    backgroundColor: "var(--bg-color)",
                    borderColor: "var(--border-color)",
                  }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div 
                      className="p-3 rounded-xl"
                      style={{ backgroundColor: card.bgColor }}
                    >
                      <card.icon size={24} style={{ color: card.color }} />
                    </div>
                    {card.change !== "" && (
                      <div className={`text-sm px-2 py-1 rounded-full ${
                        card.changeType === 'positive' ? 'bg-green-100 text-green-600' : 
                        card.changeType === 'negative' ? 'bg-red-100 text-red-600' : ''
                      }`}>
                        {card.change}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-bold mb-1" style={{ color: "var(--text-color)" }}>
                      {card.value}
                    </h3>
                    <p className="text-sm" style={{ color: "var(--sub-text-color)" }}>
                      {card.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              
              {/* Today's Attendance */}
              <div className="xl:col-span-2">
                <div 
                  className="p-6 rounded-2xl border"
                  style={{
                    backgroundColor: "var(--bg-color)",
                    borderColor: "var(--border-color)",
                  }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold" style={{ color: "var(--text-color)" }}>
                      {isRtl ? "حضور اليوم" : "Today's Attendance"}
                    </h2>
                    <button 
                      className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      style={{
                        backgroundColor: "var(--hover-color)",
                        color: "var(--accent-color)"
                      }}
                      onClick={() => navigate("/pages/admin/attendance")}
                    >
                      {isRtl ? "عرض الكل" : "View All"}
                    </button>
                  </div>

                  {attendanceLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: "var(--accent-color)" }}></div>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {attendanceData.slice(0, 8).map((attendance, index) => (
                        <div 
                          key={index}
                          className="flex items-center justify-between p-4 rounded-xl border"
                          style={{
                            backgroundColor: "var(--hover-color)",
                            borderColor: "var(--border-color)"
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <div 
                              className={`w-3 h-3 rounded-full ${
                                attendance.status === 'present' ? 'bg-green-500' :
                                attendance.status === 'late' ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                            />
                            <div>
                              <p className="font-medium" style={{ color: "var(--text-color)" }}>
                                {attendance.user?.firstName} {attendance.user?.lastName}
                              </p>
                              <p className="text-sm" style={{ color: "var(--sub-text-color)" }}>
                                {attendance.user?.email}
                              </p>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="flex items-center gap-2">
                              <Clock size={16} style={{ color: "var(--sub-text-color)" }} />
                              <span className="text-sm font-medium" style={{ color: "var(--text-color)" }}>
                                {attendance.clockIn || 'N/A'}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <MapPin size={16} style={{ color: "var(--sub-text-color)" }} />
                              <span className="text-xs" style={{ color: "var(--sub-text-color)" }}>
                                {attendance.location === 'office' ? 
                                  (isRtl ? 'المكتب' : 'Office') : 
                                  (isRtl ? 'من المنزل' : 'Remote')
                                }
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Actions & Quick Stats */}
              <div className="space-y-6">
                
                {/* Pending Actions */}
                <div 
                  className="p-6 rounded-2xl border"
                  style={{
                    backgroundColor: "var(--bg-color)",
                    borderColor: "var(--border-color)",
                  }}
                >
                  <h2 className="text-xl font-bold mb-4" style={{ color: "var(--text-color)" }}>
                    {isRtl ? "الإجراءات المعلقة" : "Pending Actions"}
                  </h2>
                  
                  <div className="space-y-4">
                    {[
                      {
                        icon: Calendar,
                        title: isRtl ? "طلبات إجازة جديدة" : "New Leave Requests",
                        count: pendingLeaves,
                        color: "#F59E0B"
                      },
                      {
                        icon: Coffee,
                        title: isRtl ? "فترات راحة مفتوحة" : "Active Breaks",
                        count: activeBreaksCount,
                        color: "#8B5CF6"
                      },
                      {
                        icon: AlertTriangle,
                        title: isRtl ? "تنبيهات متأخرة" : "Late Alerts",
                        count: lateUsers,
                        color: "#EF4444"
                      }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div 
                            className="p-2 rounded-lg"
                            style={{ backgroundColor: `${item.color}20` }}
                          >
                            <item.icon size={16} style={{ color: item.color }} />
                          </div>
                          <span className="text-sm font-medium" style={{ color: "var(--text-color)" }}>
                            {item.title}
                          </span>
                        </div>
                        <span 
                          className="text-sm font-bold px-2 py-1 rounded-full"
                          style={{ 
                            backgroundColor: `${item.color}20`, 
                            color: item.color 
                          }}
                        >
                          {item.count}
                        </span>
                      </div>
                    ))} 
                  </div>
                </div>

                {/* System Status */}
                <div 
                  className="p-6 rounded-2xl border"
                  style={{
                    backgroundColor: "var(--bg-color)",
                    borderColor: "var(--border-color)",
                  }}
                >
                  <h2 className="text-xl font-bold mb-4" style={{ color: "var(--text-color)" }}>
                    {isRtl ? "حالة النظام" : "System Status"}
                  </h2>
                  
                  <div className="space-y-4">
                    {[
                      {
                        label: isRtl ? "خادم التطبيق" : "Application Server",
                        status: "online",
                        uptime: "99.9%"
                      },
                      {
                        label: isRtl ? "قاعدة البيانات" : "Database",
                        status: "online", 
                        uptime: "99.8%"
                      },
                      {
                        label: isRtl ? "خدمة الإشعارات" : "Notification Service",
                        status: "online",
                        uptime: "99.5%"
                      }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${
                            item.status === 'online' ? 'bg-green-500' : 'bg-red-500'
                          }`} />
                          <span className="text-sm" style={{ color: "var(--text-color)" }}>
                            {item.label}
                          </span>
                        </div>
                        <span className="text-xs" style={{ color: "var(--sub-text-color)" }}>
                          {item.uptime}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Leave Requests */}
            <div 
              className="p-6 rounded-2xl border"
              style={{
                backgroundColor: "var(--bg-color)",
                borderColor: "var(--border-color)",
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold" style={{ color: "var(--text-color)" }}>
                  {isRtl ? "طلبات الإجازات الأخيرة" : "Recent Leave Requests"}
                </h2>
                <button 
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  style={{
                    backgroundColor: "var(--hover-color)",
                    color: "var(--accent-color)"
                  }}
                  onClick={() => navigate("/pages/admin/leaves")}
                >
                  {isRtl ? "إدارة الإجازات" : "Manage Leaves"}
                </button>
              </div>

              {leavesLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: "var(--accent-color)" }}></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b" style={{ borderColor: "var(--border-color)" }}>
                        <th className="text-left py-3 px-4 font-medium" style={{ color: "var(--sub-text-color)" }}>
                          {isRtl ? "الموظف" : "Employee"}
                        </th>
                        <th className="text-left py-3 px-4 font-medium" style={{ color: "var(--sub-text-color)" }}>
                          {isRtl ? "نوع الإجازة" : "Leave Type"}
                        </th>
                        <th className="text-left py-3 px-4 font-medium" style={{ color: "var(--sub-text-color)" }}>
                          {isRtl ? "التاريخ" : "Date"}
                        </th>
                        <th className="text-left py-3 px-4 font-medium" style={{ color: "var(--sub-text-color)" }}>
                          {isRtl ? "المدة" : "Duration"}
                        </th>
                        <th className="text-left py-3 px-4 font-medium" style={{ color: "var(--sub-text-color)" }}>
                          {isRtl ? "الحالة" : "Status"}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {leavesData.slice(0, 5).map((leave, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50 transition-colors" style={{ borderColor: "var(--border-color)" }}>
                          <td className="py-4 px-4">
                            <div>
                              <p className="font-medium" style={{ color: "var(--text-color)" }}>
                                {leave.user}
                              </p>
                              <p className="text-sm" style={{ color: "var(--sub-text-color)" }}>
                                {leave.userEmail}
                              </p>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-sm" style={{ color: "var(--text-color)" }}>
                              {leave.leaveType}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-sm" style={{ color: "var(--text-color)" }}>
                              {leave.startDate} - {leave.endDate}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-sm" style={{ color: "var(--text-color)" }}>
                              {leave.days} {isRtl ? "يوم" : "days"}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              leave.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              leave.status === 'approved' ? 'bg-green-100 text-green-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {leave.status === 'pending' ? (isRtl ? 'معلق' : 'Pending') :
                               leave.status === 'approved' ? (isRtl ? 'موافق عليه' : 'Approved') :
                               (isRtl ? 'مرفوض' : 'Rejected')}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Users List Section */}
            <div className="p-6 rounded-2xl border" style={{
              backgroundColor: "var(--bg-color)",
              borderColor: "var(--border-color)",
            }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold" style={{ color: "var(--text-color)" }}>
                  {isRtl ? "المستخدمون" : "Users"}
                </h2>
                {/* زر إدارة المستخدمين لو عندك صفحة خاصة */}
                <button
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  style={{
                    backgroundColor: "var(--hover-color)",
                    color: "var(--accent-color)"
                  }}
                  onClick={() => navigate("/pages/admin/users")}
                >
                  {isRtl ? "إدارة المستخدمين" : "Manage Users"}
                </button>
              </div>
              {usersLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: "var(--accent-color)" }}></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b" style={{ borderColor: "var(--border-color)" }}>
                        <th className="text-left py-3 px-4 font-medium" style={{ color: "var(--sub-text-color)" }}>
                          {isRtl ? "الاسم" : "Name"}
                        </th>
                        <th className="text-left py-3 px-4 font-medium" style={{ color: "var(--sub-text-color)" }}>
                          {isRtl ? "البريد الإلكتروني" : "Email"}
                        </th>
                        <th className="text-left py-3 px-4 font-medium" style={{ color: "var(--sub-text-color)" }}>
                          {isRtl ? "الدور" : "Role"}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {usersData.slice(0, 8).map((user, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50 transition-colors" style={{ borderColor: "var(--border-color)" }}>
                          <td className="py-4 px-4">
                            <span className="font-medium" style={{ color: "var(--text-color)" }}>
                              {user.firstName} {user.lastName}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-sm" style={{ color: "var(--sub-text-color)" }}>
                              {user.email}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-sm" style={{ color: "var(--sub-text-color)" }}>
                              {user.role}
                            </span>
                          </td>
                        </tr>
                      ))}
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

export default DashboardAdmin;