import {
  Clock,
  CalendarCheck,
  Coffee,
  BarChart3,
  LogOut,
  Wallet,
} from "lucide-react";

/**
 * User menu items with permission mappings
 * These are shown to admins if they have the corresponding permissions
 */
export const USER_MENU_ITEMS = [
  {
    key: "user_time_tracking",
    name: "Time Tracking",
    path: "/pages/User/time_tracking",
    permission: "clockInOut",
    Icon: Clock,
    category: "user",
    children: [
      {
        key: "user_attendance",
        name: "Attendance",
        path: "/pages/User/attendance-logs",
        permission: "viewOwnAttendanceLogs",
        Icon: CalendarCheck,
      },
      {
        key: "user_break_tracking",
        name: "Break Tracking",
        path: "/pages/User/break-tracking",
        permission: "clockInOut", // Same as parent
        Icon: Coffee,
      },
    ],
  },
  {
    key: "user_leaves",
    name: "Leaves",
    path: "/pages/User/leaves",
    permission: "requestLeave",
    Icon: LogOut,
    category: "user",
  },
  {
    key: "user_performance",
    name: "Performance",
    path: "/pages/User/Performance",
    permission: "viewOwnAttendanceLogs", // Basic permission to view own data
    Icon: BarChart3,
    category: "user",
  },
  {
    key: "user_wallet",
    name: "Team Wallet",
    path: "/pages/User/team-wallet",
    permission: "clockInOut", // Basic permission for employees
    Icon: Wallet,
    category: "user",
  },
];

/**
 * Get all user menu items
 * Permission filtering is handled by PermissionGuard components
 */
export const getUserMenuItems = () => {
  return USER_MENU_ITEMS;
};

