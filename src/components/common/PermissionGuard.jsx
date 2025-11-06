import React from "react";
import { PermissionGuard as RpgPermissionGuard } from "react-permission-guard";
import { usePermissions } from "../../services/PermissionProvider";
import { getPermissions } from "../../utils/page";
import { hasBackendPermission } from "../../utils/permissionMapping";
import Unauthorized from "../unauthorized/unauthorized";

/**
 * PermissionGuard component - Wrapper around react-permission-guard
 * Handles admin override and loading states while using react-permission-guard for permission checking
 * Works with both static permissions (for testing) and backend permission codes
 * 
 * Default behavior: Shows Unauthorized component when user doesn't have permission
 * You can override by passing a custom fallback prop
 * 
 * Supports both:
 * - permission/permissions: Frontend permission names (for react-permission-guard)
 * - backendPermissions: Backend permission codes (direct check)
 */
export const PermissionGuard = ({ 
  children, 
  permission, 
  permissions, 
  backendPermissions, // New: Array of backend permission codes like ["Break.View", "Break.Create"]
  fallback = null, 
  loadingFallback = null 
}) => {
  const { isLoading, isAdmin } = usePermissions();

  // Show loading fallback while loading
  if (isLoading) {
    return loadingFallback;
  }

  // Admin has all permissions - bypass guard
  if (isAdmin()) {
    return children;
  }

  // If backend permissions are provided, check them directly
  if (backendPermissions && backendPermissions.length > 0) {
    const userBackendPermissions = getPermissions() || [];
    const hasPermission = hasBackendPermission(userBackendPermissions, backendPermissions);
    
    if (!hasPermission) {
      return fallback !== null ? fallback : <Unauthorized />;
    }
    
    return children;
  }

  // If no permission specified, render children (allow access)
  if (!permission && !permissions) {
    return children;
  }

  // Use react-permission-guard's PermissionGuard component for frontend permissions
  // It will use permissions from PermissionsProvider (which gets static or backend permissions)
  // Default fallback: Show Unauthorized component instead of redirecting
  // You can override by passing a custom fallback prop (e.g., Navigate component)
  const fallbackComponent = fallback !== null ? fallback : <Unauthorized />;

  return (
    <RpgPermissionGuard 
      permission={permission}
      permissions={permissions}
      fallback={fallbackComponent}
      loadingFallback={loadingFallback}
    >
      {children}
    </RpgPermissionGuard>
  );
};

