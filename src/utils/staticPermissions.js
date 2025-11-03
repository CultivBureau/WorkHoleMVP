/**
 * ===================================================================================
 * STATIC PERMISSIONS FOR ADMIN PAGES
 * ===================================================================================
 * 
 * This array contains all permissions needed to access admin pages.
 * Uncomment the permissions you want to test.
 * 
 * HOW TO USE:
 * -----------
 * 1. Uncomment permissions from the array below to grant access
 * 2. Comment out permissions to remove access
 * 3. Refresh the app to see changes
 * 
 * TO DISABLE STATIC PERMISSIONS:
 * ------------------------------
 * Set USE_STATIC_PERMISSIONS to false below
 */

// Admin page permissions - uncomment to enable access
export const STATIC_TEST_PERMISSIONS = [
  // ==================== LEAVE MANAGEMENT ====================
  "approveRejectLeaveRequests",  // /pages/admin/leaves

  
  // ==================== ATTENDANCE ====================
   "viewAttendanceReports",      // /pages/admin/attendance

  
  // ==================== PERFORMANCE ====================
  "viewReportsDashboard",        // /pages/admin/Performance
  
  // ==================== TEAM WALLET ====================
  "accessPayrollData",          // /pages/admin/TeamWallet
  
  // ==================== EMPLOYEE MANAGEMENT ====================
  "viewEmployeeProfiles",        // /pages/admin/all-employees
   "addEditEmployees",           // /pages/admin/new-employee

  
  // ==================== COMPANY & DEPARTMENTS ====================
  "editCompanySettings",        // /pages/admin/company
                                   // /pages/admin/all-departments
                                   // /pages/admin/new-department (shows under Departments dropdown)
                                   // /pages/admin/edit-department/:id
  
  // ==================== ROLES & PERMISSIONS ====================
  "assignRoles",                // /pages/admin/Roles&Permissions (shows in sidebar)
                                   // /pages/admin/New_Role (shows under Roles & Permissions dropdown)
  
  // ==================== BREAK MANAGEMENT ====================
  // "manageBreakCategories",      // /pages/admin/break
  
  // ==================== OTHER ADMIN PAGES ====================
  // Note: These pages don't have permission guards (admin-only):
  // - /pages/admin/dashboard (Main admin dashboard)
  // - /pages/admin/users (Users management)
  // - /pages/admin/all-teams (Teams management)
];

/**
 * Check if static permissions mode is enabled
 */
export const USE_STATIC_PERMISSIONS = true;

/**
 * Get static permissions for testing
 */
export const getStaticPermissions = () => {
  return [...STATIC_TEST_PERMISSIONS];
};
