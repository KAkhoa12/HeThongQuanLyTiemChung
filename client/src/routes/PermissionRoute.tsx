import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import authService from '../services/auth.service';
import Loader from '../common/Loader';

interface PermissionRouteProps {
  children: ReactNode;
  requiredPermissions?: string[];
  fallbackPath?: string;
}

const PermissionRoute = ({ 
  children, 
  requiredPermissions = [], 
  fallbackPath = "/unauthorized" 
}: PermissionRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userPermissions, setUserPermissions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!authService.isAuthenticated()) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        try {
          // Try to get current user
          const user = await authService.getCurrentUser();
          setIsAuthenticated(true);
          setUserPermissions(user.permissions || []);
          setIsLoading(false);
        } catch (error) {
          // Try to refresh token if getting user fails
          const refreshed = await authService.refreshToken();
          if (refreshed) {
            try {
              const user = await authService.getCurrentUser();
              setIsAuthenticated(true);
              setUserPermissions(user.permissions || []);
            } catch (e) {
              setIsAuthenticated(false);
            }
          } else {
            setIsAuthenticated(false);
          }
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [location.pathname]);

  // Show loading while checking authentication
  if (isLoading) {
    return <Loader />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth/signin" state={{ from: location }} replace />;
  }

  // Check if user has required permissions
  if (requiredPermissions.length > 0) {
    const hasPermission = requiredPermissions.some(requiredPermission => {
      const allPermission = `${requiredPermission}_ALL`;
      if (userPermissions.includes(allPermission)) {
        return true;
      }
      
      // Check for _VIEW permission
      const viewPermission = `${requiredPermission}_VIEW`;
      if (userPermissions.includes(viewPermission)) {
        return true;
      }
      
      return false;
    });

    if (!hasPermission) {
      return <Navigate to={fallbackPath} replace />;
    }
  }

  // User is authenticated and has required permissions
  return <>{children}</>;
};

export default PermissionRoute; 