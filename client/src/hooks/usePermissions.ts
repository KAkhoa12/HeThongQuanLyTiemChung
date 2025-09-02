import { useState, useEffect } from 'react';
import authService from '../services/auth.service';

export interface UserInfo {
  maNguoiDung: string;
  ten: string;
  email: string;
  soDienThoai?: string;
  ngaySinh?: string;
  diaChi?: string;
  role: string;
  moTaVaiTro: string;
  registeredAt: string;
  avatarUrl?: string;
  permissions: string[];
}

export const usePermissions = () => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUserPermissions = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        if (!authService.isAuthenticated()) {
          setUser(null);
          setPermissions([]);
          return;
        }

        const userData = await authService.getCurrentUser();
        setUser(userData);
        setPermissions(userData.permissions || []);
      } catch (err) {
        console.error('Error loading user permissions:', err);
        setError('Không thể tải thông tin người dùng');
        setUser(null);
        setPermissions([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserPermissions();
  }, []);

  const hasPermission = (requiredPermission: string): boolean => {
    if (!permissions.length) return false;
    
    // Check for _ALL permission first
    const allPermission = `${requiredPermission}_ALL`;
    if (permissions.includes(allPermission)) {
      return true;
    }
    
    // Check for _VIEW permission
    const viewPermission = `${requiredPermission}_VIEW`;
    if (permissions.includes(viewPermission)) {
      return true;
    }
    
    return false;
  };

  const hasAnyPermission = (requiredPermissions: string[]): boolean => {
    return requiredPermissions.some(permission => hasPermission(permission));
  };

  const hasAllPermissions = (requiredPermissions: string[]): boolean => {
    return requiredPermissions.every(permission => hasPermission(permission));
  };

  const hasRole = (requiredRole: string): boolean => {
    return user?.role === requiredRole;
  };

  const hasAnyRole = (requiredRoles: string[]): boolean => {
    return requiredRoles.includes(user?.role || '');
  };

  return {
    user,
    permissions,
    isLoading,
    error,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAnyRole,
    isAuthenticated: !!user
  };
}; 