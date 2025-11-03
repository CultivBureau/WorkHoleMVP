import React from "react";
import { usePermissions } from "../../services/PermissionProvider";

/**
 * PermissionGuard component - wraps react-permission-guard API
 * Uses our custom PermissionProvider instead of react-permission-guard's provider
 */
export const PermissionGuard = ({ 
  children, 
  permission, 
  permissions, 
  fallback = null, 
  loadingFallback = null 
}) => {
  const { permissions: userPermissions, isLoading, isAdmin } = usePermissions();

  // Show loading fallback while loading
  if (isLoading) {
    return loadingFallback;
  }

  // Admin has all permissions
  if (isAdmin()) {
    return children;
  }

  // If no permission specified, show warning and render children
  if (!permission && !permissions) {
    console.warn('PermissionGuard: No permissions specified');
    return children;
  }

  // Determine required permissions
  const requiredPermissions = permissions || (permission ? [permission] : []);

  // Check if user has at least one of the required permissions
  const hasPermission = requiredPermissions.some(perm => 
    userPermissions.includes(perm)
  );

  // If user doesn't have permission, show fallback
  if (!hasPermission) {
    return fallback;
  }

  // User has permission, render children
  return children;
};

