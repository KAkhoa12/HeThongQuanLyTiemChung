import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { hasPermission, hasRole, hasAllPermissions, hasAnyPermission } from '../utils/permissionUtils';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermissions?: string[];
  requiredRoles?: string[];
  requireAllPermissions?: boolean; // true = AND logic, false = OR logic
  fallback?: React.ReactNode;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredPermissions = [],
  requiredRoles = [],
  requireAllPermissions = false,
  fallback = <div>Bạn không có quyền truy cập trang này</div>,
  redirectTo = '/login'
}) => {
  const { isAuthenticated } = useAuthStore();

  // Kiểm tra xác thực
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // Kiểm tra vai trò
  if (requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.some(role => hasRole(role));
    if (!hasRequiredRole) {
      return <>{fallback}</>;
    }
  }

  // Kiểm tra quyền
  if (requiredPermissions.length > 0) {
    const hasRequiredPermission = requireAllPermissions
      ? hasAllPermissions(requiredPermissions)
      : hasAnyPermission(requiredPermissions);

    if (!hasRequiredPermission) {
      return <>{fallback}</>;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute; 