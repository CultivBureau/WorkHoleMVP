import {
  LayoutDashboard,
  Calendar,
  CalendarCheck,
  BarChart3,
  Wallet,
  Users,
  Shield,
  Building2,
  Building,
  Coffee,
  UsersRound,
} from "lucide-react";
import { hasBackendPermission } from "./permissionMapping";
import { getPermissions } from "./page";

// Permission to menu item mapping for admin pages
// These are the additional menu items that appear for custom roles based on permissions
// Each menu item now maps to backend permission codes
export const PERMISSION_MENU_ITEMS = [
  {
    key: "admin_leaves",
    name: "Leave Requests",
    path: "/pages/admin/leaves",
    permission: "approveRejectLeaveRequests", // Frontend permission name
    backendPermissions: ["LeaveRequest.Review", "LeaveRequest.Confirm", "LeaveRequest.Override"], // Backend codes
    Icon: Calendar,
    category: "admin",
  },
  {
    key: "admin_attendance",
    name: "Attendance",
    path: "/pages/admin/attendance",
    permission: "viewAttendanceReports",
    backendPermissions: ["ClockinLog.View"],
    Icon: CalendarCheck,
    category: "admin",
  },
  {
    key: "admin_break",
    name: "Break Management",
    path: "/pages/admin/break",
    permission: "manageBreakCategories", // Frontend permission name
    backendPermissions: ["Break.View", "Break.Create", "Break.Update", "Break.Delete", "Break.Restore"], // Backend codes
    Icon: Coffee,
    category: "admin",
  },
  {
    key: "admin_employees",
    name: "All Employees",
    path: "/pages/admin/all-employees",
    permission: "viewEmployeeProfiles",
    backendPermissions: ["User.View"],
    Icon: Users,
    category: "admin",
  },
  {
    key: "admin_departments",
    name: "Departments",
    path: "/pages/admin/all-departments",
    permission: "editCompanySettings",
    backendPermissions: ["Department.View", "Department.Create", "Department.Update", "Department.Delete"],
    Icon: Building2,
    category: "admin",
  },
  {
    key: "admin_company",
    name: "Company",
    path: "/pages/admin/company",
    permission: "editCompanySettings",
    backendPermissions: ["Company.View", "Company.Update"],
    Icon: Building,
    category: "admin",
  },
  {
    key: "admin_roles_permissions",
    name: "Roles & Permissions",
    path: "/pages/admin/Roles&Permissions",
    permission: "assignRoles",
    backendPermissions: ["Role.View", "Role.Create", "Role.Update", "Role.ViewPermissions"],
    Icon: Shield,
    category: "admin",
  },
];

// Helper function to get all admin menu items
// Permission filtering is now handled by react-permission-guard Guard components
export const getAdminMenuItemsByPermissions = () => {
  return PERMISSION_MENU_ITEMS;
};

/**
 * Check if user has permission for a menu item based on backend permission codes
 * @param {Object} menuItem - Menu item object with backendPermissions array
 * @returns {boolean}
 */
export const hasMenuItemPermission = (menuItem) => {
  if (!menuItem.backendPermissions || menuItem.backendPermissions.length === 0) {
    return true; // No backend permissions required, show item
  }
  
  const userPermissions = getPermissions() || [];
  return hasBackendPermission(userPermissions, menuItem.backendPermissions);
};


