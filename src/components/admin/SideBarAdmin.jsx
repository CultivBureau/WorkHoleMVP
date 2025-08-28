import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Coffee,
  Shield,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import logo from "../../assets/side-menu-icons/logo.svg?url";
import { useTheme } from "../../contexts/ThemeContext";
import { useGetAllUsersQuery } from "../../services/apis/UsersApi";
import { useGetAllLeavesQuery } from "../../services/apis/LeavesApi";
import { useGetAllUsersAttendanceQuery } from "../../services/apis/AtteandanceApi";

const adminMenuItems = [
  { 
    key: "dashboard", 
    Icon: LayoutDashboard, 
    path: "/pages/admin/dashboard",
    color: "#09D1C7"
  },
  { 
    key: "users", 
    Icon: Users, 
    path: "/pages/admin/users",
    color: "#8B5CF6"
  },
  { 
    key: "attendance", 
    Icon: UserCheck, 
    path: "/pages/admin/attendance",
    color: "#3B82F6"
  },
  { 
    key: "break", 
    Icon: Coffee, 
    path: "/pages/admin/break",
    color: "#F59E0B"
  },
  { 
    key: "leaves", 
    Icon: Calendar, 
    path: "/pages/admin/leaves",
    color: "#10B981"
  },
];

const SideBarAdmin = ({ lang, isMobileOpen, onMobileClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);

  // Fetch data for quick overview
  const { data: usersData, isLoading: usersLoading } = useGetAllUsersQuery();
  const { data: leavesData, isLoading: leavesLoading } = useGetAllLeavesQuery();
  const { data: attendanceData, isLoading: attendanceLoading } = useGetAllUsersAttendanceQuery();

  const isRtl = lang === "ar";

  // Close mobile sidebar when route changes
  useEffect(() => {
    if (onMobileClose) onMobileClose();
  }, [location.pathname, onMobileClose]);

  // Get active menu item
  const getActiveItem = () => {
    const path = location.pathname;
    if (path.startsWith("/pages/admin/users")) return "users";
    if (path.startsWith("/pages/admin/attendance")) return "attendance";
    if (path.startsWith("/pages/admin/break")) return "break";
    if (path.startsWith("/pages/admin/leaves")) return "leaves";
    if (path.startsWith("/pages/admin/dashboard")) return "dashboard";
    return "";
  };

  const activeItem = getActiveItem();

  const handleNavigation = (item) => {
    navigate(item.path);
  };

  const getMenuItemText = (key) => {
    const texts = {
      dashboard: isRtl ? "لوحة التحكم" : "Dashboard",
      users: isRtl ? "إدارة المستخدمين" : "User Management",
      attendance: isRtl ? "الحضور والانصراف" : "Attendance",
      break: isRtl ? "فترات الراحة" : "Break Management", 
      leaves: isRtl ? "طلبات الإجازات" : "Leave Requests",
    };
    return texts[key] || key;
  };

  // Calculate statistics
  const getQuickStats = () => {
    const totalUsers = usersData?.length || 0;
    
    // Count active users (users who checked in today)
    const today = new Date().toISOString().split('T')[0];
    const activeUsers = attendanceData?.filter(attendance => 
      attendance.date?.includes(today) && attendance.checkedIn
    )?.length || 0;
    
    // Count pending leaves
    const pendingLeaves = leavesData?.filter(leave => 
      leave.status === 'pending'
    )?.length || 0;
    
    // Count late users (checked in after 9 AM today)
    const lateUsers = attendanceData?.filter(attendance => {
      if (!attendance.date?.includes(today) || !attendance.checkedIn) return false;
      const checkInTime = new Date(attendance.checkInTime);
      const nineAM = new Date();
      nineAM.setHours(9, 0, 0, 0);
      return checkInTime > nineAM;
    })?.length || 0;

    return {
      totalUsers,
      activeUsers,
      pendingLeaves,
      lateUsers
    };
  };

  const stats = getQuickStats();
  const sidebarWidth = isCollapsed ? "w-16" : "w-64";
  const mobileOverlay = isMobileOpen ? "fixed inset-0 bg-black bg-opacity-50 z-50" : "";

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className={mobileOverlay}
          onClick={onMobileClose}
        />
      )}
      
      {/* Sidebar */}
      <div
        className={`
          ${sidebarWidth} 
          h-full 
          flex flex-col 
          border-r 
          transition-all duration-300 ease-in-out
          ${isMobileOpen ? 'fixed left-0 top-16 z-50 lg:relative lg:top-0' : 'hidden lg:flex'}
        `}
        style={{
          backgroundColor: "var(--bg-color)",
          borderColor: "var(--border-color)",
        }}
      >
        {/* Header */}
        <div className="p-4 border-b" style={{ borderColor: "var(--border-color)" }}>
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <img src={logo} alt="WorkHole" className="w-8 h-8" />
                  {!isCollapsed && (
                    <div>
                      <h2 className="text-lg font-bold gradient-text">WorkHole</h2>
                      <p className="text-xs" style={{ color: "var(--sub-text-color)" }}>
                        Admin Panel
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Mobile close button */}
            <button
              onClick={onMobileClose}
              className="lg:hidden p-1 rounded hover:bg-gray-100"
              style={{ color: "var(--sub-text-color)" }}
            >
              <X size={20} />
            </button>

            {/* Desktop collapse button */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:block p-1 rounded hover:bg-gray-100 transition-colors"
              style={{ color: "var(--sub-text-color)" }}
            >
              {isCollapsed ? 
                (isRtl ? <ChevronLeft size={20} /> : <ChevronRight size={20} />) : 
                (isRtl ? <ChevronRight size={20} /> : <ChevronLeft size={20} />)
              }
            </button>
          </div>
        </div>

        {/* Admin Badge */}
        {!isCollapsed && (
          <div className="p-4">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg border" style={{
              backgroundColor: "var(--hover-color)",
              borderColor: "var(--accent-color)",
              color: "var(--accent-color)"
            }}>
              <Shield size={16} />
              <span className="text-sm font-semibold">
                {isRtl ? "مدير النظام" : "Administrator"}
              </span>
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-2">
          {adminMenuItems.map((item) => {
            const isActive = activeItem === item.key;
            const isHovered = hoveredItem === item.key;
            
            return (
              <button
                key={item.key}
                data-key={item.key}
                onClick={() => handleNavigation(item)}
                onMouseEnter={() => setHoveredItem(item.key)}
                onMouseLeave={() => setHoveredItem(null)}
                className={`
                  w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200
                  ${isActive ? 'shadow-sm' : 'hover:shadow-sm'}
                  group
                `}
                style={{
                  backgroundColor: isActive ? "var(--hover-color)" : 
                                 isHovered ? "var(--hover-color)" : "transparent",
                  color: isActive ? "var(--accent-color)" : "var(--text-color)",
                  borderLeft: isActive && !isRtl ? `3px solid ${item.color}` : "3px solid transparent",
                  borderRight: isActive && isRtl ? `3px solid ${item.color}` : "3px solid transparent",
                }}
              >
                <item.Icon 
                  size={20} 
                  style={{ 
                    color: isActive ? item.color : "var(--sub-text-color)",
                    transition: "color 0.2s"
                  }}
                />
                
                {!isCollapsed && (
                  <span className={`font-medium ${isActive ? 'font-semibold' : ''}`}>
                    {getMenuItemText(item.key)}
                  </span>
                )}

                {/* Active indicator */}
                {isActive && !isCollapsed && (
                  <div 
                    className="ml-auto w-2 h-2 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Dynamic Stats Overview */}
        {!isCollapsed && (
          <div className="p-4 border-t" style={{ borderColor: "var(--border-color)" }}>
            <div className="space-y-3">
              <h3 className="text-sm font-semibold" style={{ color: "var(--text-color)" }}>
                {isRtl ? "نظرة سريعة" : "Quick Overview"}
              </h3>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded border" style={{ 
                  backgroundColor: "var(--hover-color)",
                  borderColor: "var(--border-color)"
                }}>
                  <div className="font-semibold" style={{ color: "#3B82F6" }}>
                    {usersLoading ? "..." : stats.totalUsers}
                  </div>
                  <div style={{ color: "var(--sub-text-color)" }}>
                    {isRtl ? "موظف" : "Users"}
                  </div>
                </div>
                
                <div className="p-2 rounded border" style={{ 
                  backgroundColor: "var(--hover-color)",
                  borderColor: "var(--border-color)"
                }}>
                  <div className="font-semibold" style={{ color: "#10B981" }}>
                    {attendanceLoading ? "..." : stats.activeUsers}
                  </div>
                  <div style={{ color: "var(--sub-text-color)" }}>
                    {isRtl ? "نشط" : "Active"}
                  </div>
                </div>
                
                <div className="p-2 rounded border" style={{ 
                  backgroundColor: "var(--hover-color)",
                  borderColor: "var(--border-color)"
                }}>
                  <div className="font-semibold" style={{ color: "#F59E0B" }}>
                    {leavesLoading ? "..." : stats.pendingLeaves}
                  </div>
                  <div style={{ color: "var(--sub-text-color)" }}>
                    {isRtl ? "إجازات" : "Leaves"}
                  </div>
                </div>
                
                <div className="p-2 rounded border" style={{ 
                  backgroundColor: "var(--hover-color)",
                  borderColor: "var(--border-color)"
                }}>
                  <div className="font-semibold" style={{ color: "#EF4444" }}>
                    {attendanceLoading ? "..." : stats.lateUsers}
                  </div>
                  <div style={{ color: "var(--sub-text-color)" }}>
                    {isRtl ? "متأخر" : "Late"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Collapsed tooltip */}
        {isCollapsed && hoveredItem && (
          <div
            className={`fixed z-50 px-3 py-2 rounded-lg shadow-lg border animate-popup-scale ${
              isRtl ? 'right-20' : 'left-20'
            }`}
            style={{
              backgroundColor: "var(--bg-color)",
              borderColor: "var(--border-color)",
              color: "var(--text-color)",
              top: `${document.querySelector(`[data-key="${hoveredItem}"]`)?.offsetTop + 40}px`,
            }}
          >
            <span className="text-sm font-medium whitespace-nowrap">
              {getMenuItemText(hoveredItem)}
            </span>
          </div>
        )}
      </div>
    </>
  );
};

export default SideBarAdmin;
