import { ReactNode } from 'react';
import { usePermissions } from '../hooks/usePermissions';

interface PermissionGuardProps {
  children: ReactNode;
  requiredPermissions?: string[];
  fallback?: ReactNode;
  requireAll?: boolean;
}

const PermissionGuard = ({ 
  children, 
  requiredPermissions = [], 
  fallback = null,
  requireAll = false 
}: PermissionGuardProps) => {
  const { hasAnyPermission, hasAllPermissions, isLoading } = usePermissions();

  if (isLoading) {
    return null; // hoặc loading spinner
  }

  if (requiredPermissions.length === 0) {
    return <>{children}</>;
  }

  const hasAccess = requireAll 
    ? hasAllPermissions(requiredPermissions)
    : hasAnyPermission(requiredPermissions);

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default PermissionGuard; 