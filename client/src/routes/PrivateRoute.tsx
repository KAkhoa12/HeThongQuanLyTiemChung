import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import authService from '../services/auth.service';
import Loader from '../common/Loader';

interface PrivateRouteProps {
  children: ReactNode;
  requiredRoles?: string[];
}

const PrivateRoute = ({ children, requiredRoles = [] }: PrivateRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const location = useLocation();
  const [redirectPath, setRedirectPath] = useState<string | null>(null);
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!authService.isAuthenticated()) {
          setIsAuthenticated(false);
          setRedirectPath("/auth/signin");
          setIsLoading(false);
          return;
        }

        try {
          // Try to get current user
          const user = await authService.getCurrentUser();
          setIsAuthenticated(true);
          setUserRoles([user.vaiTro]);
          setIsLoading(false);
        } catch (error) {
          // Try to refresh token if getting user fails
          const refreshed = await authService.refreshToken();
          if (refreshed) {
            try {
              const user = await authService.getCurrentUser();
              setIsAuthenticated(true);
              
              setUserRoles([user.vaiTro]);
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
        setRedirectPath("/auth/signin");
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

  // Check if user has required roles
  if (requiredRoles.length > 0 && !requiredRoles.some(role => userRoles.includes(role))) {
    // Redirect to unauthorized page or dashboard
    return <Navigate to="/unauthorized" replace />;
  }

  // User is authenticated and has required roles
  return <>{children}</>;
};

export default PrivateRoute;