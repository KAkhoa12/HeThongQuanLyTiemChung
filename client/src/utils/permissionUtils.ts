import { useAuthStore } from '../store/useAuthStore';

// Kiểm tra quyền từ UserInfo (lấy từ /api/me)
export const hasPermission = (requiredPermission: string): boolean => {
  const { user } = useAuthStore.getState();
  if (!user || !user.permissions) return false;
  
  return user.permissions.includes(requiredPermission);
};

// Kiểm tra nhiều quyền (AND logic - phải có tất cả)
export const hasAllPermissions = (requiredPermissions: string[]): boolean => {
  return requiredPermissions.every(permission => hasPermission(permission));
};

// Kiểm tra nhiều quyền (OR logic - chỉ cần có 1)
export const hasAnyPermission = (requiredPermissions: string[]): boolean => {
  return requiredPermissions.some(permission => hasPermission(permission));
};

// Kiểm tra vai trò
export const hasRole = (requiredRole: string): boolean => {
  const { user } = useAuthStore.getState();
  if (!user) return false;
  
  return user.role === requiredRole;
};

// Lấy tất cả quyền của user từ UserInfo
export const getUserPermissions = (): string[] => {
  const { user } = useAuthStore.getState();
  if (!user || !user.permissions) return [];
  
  return user.permissions;
};

// Lấy vai trò của user từ UserInfo
export const getUserRole = (): string | null => {
  const { user } = useAuthStore.getState();
  if (!user) return null;
  
  return user.role;
}; 