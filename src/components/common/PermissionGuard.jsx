import React from "react";
import { PermissionGuard as RpgPermissionGuard } from "react-permission-guard";
import { usePermissions } from "../../services/PermissionProvider";
import Unauthorized from "../unauthorized/unauthorized";

/**
 * PermissionGuard component - Wrapper around react-permission-guard
 * Handles admin override and loading states while using react-permission-guard for permission checking
 * Works with both static permissions (for testing) and backend permission codes
 * 
 * Default behavior: Shows Unauthorized component when user doesn't have permission
 * You can override by passing a custom fallback prop
 */
export const PermissionGuard = ({ 
  children, 
  permission, 
  permissions, 
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

  // If no permission specified, render children (allow access)
  if (!permission && !permissions) {
    return children;
  }

  // Use react-permission-guard's PermissionGuard component
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

