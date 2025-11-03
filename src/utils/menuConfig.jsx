import {
  LayoutDashboard,
  Calendar,
  CalendarCheck,
  BarChart3,
  Wallet,
  Users,
  UserPlus,
  Shield,
  Building2,
  Building,
} from "lucide-react";

// Permission to menu item mapping for admin pages
// These are the additional menu items that appear for custom roles based on permissions
export const PERMISSION_MENU_ITEMS = [
  {
    key: "admin_leaves",
    name: "Leave Requests",
    path: "/pages/admin/leaves",
    permission: "approveRejectLeaveRequests",
    Icon: Calendar,
    category: "admin",
  },
  {
    key: "admin_attendance",
    name: "Attendance",
    path: "/pages/admin/attendance",
    permission: "viewAttendanceReports",
    Icon: CalendarCheck,
    category: "admin",
  },
  {
    key: "admin_performance",
    name: "Performance",
    path: "/pages/admin/Performance",
    permission: "viewReportsDashboard",
    Icon: BarChart3,
    category: "admin",
  },
  {
    key: "admin_wallet",
    name: "Team Wallet",
    path: "/pages/admin/TeamWallet",
    permission: "accessPayrollData",
    Icon: Wallet,
    category: "admin",
  },
  {
    key: "admin_employees",
    name: "All Employees",
    path: "/pages/admin/all-employees",
    permission: "viewEmployeeProfiles",
    Icon: Users,
    category: "admin",
  },
  {
    key: "admin_new_employee",
    name: "New Employee",
    path: "/pages/admin/new-employee",
    permission: "addEditEmployees",
    Icon: UserPlus,
    category: "admin",
  },
  {
    key: "admin_departments",
    name: "Departments",
    path: "/pages/admin/all-departments",
    permission: "editCompanySettings",
    Icon: Building2,
    category: "admin",
    children: [
      {
        key: "admin_new_department",
        name: "New Department",
        path: "/pages/admin/new-department",
        permission: "editCompanySettings",
        Icon: Building2,
      },
    ],
  },
  {
    key: "admin_company",
    name: "Company",
    path: "/pages/admin/company",
    permission: "editCompanySettings",
    Icon: Building,
    category: "admin",
  },
  {
    key: "admin_roles_permissions",
    name: "Roles & Permissions",
    path: "/pages/admin/Roles&Permissions",
    permission: "assignRoles",
    Icon: Shield,
    category: "admin",
    children: [
      {
        key: "admin_new_role",
        name: "New Role",
        path: "/pages/admin/New_Role",
        permission: "assignRoles",
        Icon: Shield,
      },
    ],
  },
];

// Helper function to get all admin menu items
// Permission filtering is now handled by react-permission-guard Guard components
export const getAdminMenuItemsByPermissions = () => {
  return PERMISSION_MENU_ITEMS;
};


