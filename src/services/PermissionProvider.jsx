import React, { createContext, useContext, useMemo } from "react";
import { useMeQuery } from "./apis/AuthApi";
import { getAuthToken } from "../utils/page";
import { USE_STATIC_PERMISSIONS, getStaticPermissions } from "../utils/staticPermissions";

// Static permission mapping based on role
// TODO: Replace with API call when backend is ready
const ROLE_PERMISSIONS_MAP = {
  admin: [
    // Admin has all permissions
    "approveRejectLeaveRequests",
    "editLeaveBalance",
    "viewLeaveCalendar",
    "viewAttendanceReports",
    "editAttendanceLogs",
    "approveLateArrivalJustifications",
    "addEditEmployees",
    "assignRoles",
    "viewEmployeeProfiles",
    "deactivateEmployees",
    "viewReportsDashboard",
    "editCompanySettings",
    "manageBreakCategories",
    "accessPayrollData",
    "viewAllTasksProjects",
    "createProjects",
    "assignTasksToOthers",
  ],
  employee: [
    // Employees have basic permissions only
    "requestLeave",
    "clockInOut",
    "viewOwnAttendanceLogs",
  ],
  // Custom roles will have permissions passed dynamically (when API is ready)
};

const PermissionContext = createContext(null);

export const PermissionProvider = ({ children }) => {
  const token = getAuthToken();
  const { data: meResponse, isLoading, error } = useMeQuery(undefined, {
    skip: !token,
  });

  // Extract permissions for react-permission-guard
  const permissionsArray = useMemo(() => {
    const userData = meResponse?.value || null;
    
    if (!userData) {
      return [];
    }

    // Get user role - check MS identity claim or fallback
    const roles = userData.roles || [];
    const roleArray = Array.isArray(roles) ? roles : [roles];
    const userRole = roleArray[0]?.toLowerCase() || "employee";
    const isAdminRole = roleArray.some(
      (r) => typeof r === "string" && r.toLowerCase() === "admin"
    );

    // Get permissions based on role
    let permissions = [];
    if (isAdminRole) {
      // Admin gets all admin permissions + basic user permissions (for accessing user pages)
      const adminPerms = ROLE_PERMISSIONS_MAP.admin || [];
      const userPerms = ROLE_PERMISSIONS_MAP.employee || [];
      permissions = [...new Set([...adminPerms, ...userPerms])]; // Combine and deduplicate
    } else if (userRole === "employee") {
      // For employees: use static permissions if enabled, otherwise use default employee permissions
      if (USE_STATIC_PERMISSIONS) {
        // Use static test permissions for easy testing
        permissions = getStaticPermissions();
        // Always include basic employee permissions
        const basicEmployeePerms = ROLE_PERMISSIONS_MAP.employee || [];
        permissions = [...new Set([...basicEmployeePerms, ...permissions])];
      } else {
        permissions = ROLE_PERMISSIONS_MAP.employee || [];
      }
    } else {
      // Custom role - when API is ready, use: permissions = userData.permissions || []
      // For now, try to get from userData if available, otherwise use static if enabled
      if (userData.permissions && Array.isArray(userData.permissions)) {
        permissions = userData.permissions;
      } else if (userData.permissions && typeof userData.permissions === 'object') {
        // If permissions come as object, flatten to array of permission strings
        permissions = Object.values(userData.permissions).flatMap(cat => 
          typeof cat === 'object' ? Object.keys(cat).filter(key => cat[key] === true) : []
        );
      } else if (USE_STATIC_PERMISSIONS) {
        // Use static permissions for custom roles too when testing
        permissions = getStaticPermissions();
      } else {
        permissions = [];
      }
    }

    return permissions;
  }, [meResponse]);

  const contextValue = useMemo(() => {
    // Extract user data from API response
    const userData = meResponse?.value || null;
    
    if (!userData) {
      return {
        user: null,
        role: null,
        permissions: [],
        isLoading,
        error,
        hasPermission: () => false,
        isAdmin: () => false,
        isEmployee: () => false,
        getUserRole: () => null,
      };
    }

    // Get user role - check MS identity claim or fallback
    const roles = userData.roles || [];
    const roleArray = Array.isArray(roles) ? roles : [roles];
    const userRole = roleArray[0]?.toLowerCase() || "employee";
    const isAdminRole = roleArray.some(
      (r) => typeof r === "string" && r.toLowerCase() === "admin"
    );

    // Helper functions
    const hasPermission = (permission) => {
      if (!permission) return false;
      if (isAdminRole) return true; // Admin has all permissions
      return permissionsArray.includes(permission);
    };

    const isAdmin = () => isAdminRole;

    const isEmployee = () => !isAdminRole && userRole === "employee";

    const getUserRole = () => {
      if (isAdminRole) return "admin";
      return userRole;
    };

    return {
      user: userData,
      role: isAdminRole ? "admin" : userRole,
      permissions: permissionsArray,
      isLoading,
      error,
      hasPermission,
      isAdmin,
      isEmployee,
      getUserRole,
    };
  }, [meResponse, isLoading, error, permissionsArray]);

  return (
    <PermissionContext.Provider value={contextValue}>
      {children}
    </PermissionContext.Provider>
  );
};

export const usePermissions = () => {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error("usePermissions must be used within PermissionProvider");
  }
  return context;
};

