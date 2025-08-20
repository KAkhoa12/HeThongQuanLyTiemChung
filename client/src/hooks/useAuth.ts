import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import authService, { UserInfo, LoginCredentials, RegisterData } from '../services/auth.service';

interface AuthState {
  isAuthenticated: boolean;
  user: UserInfo | null;
  isLoading: boolean;
  error: string | null;
}

export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true,
    error: null,
  });
  
  const navigate = useNavigate();

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          const user = await authService.getCurrentUser();
          setState({
            isAuthenticated: true,
            user,
            isLoading: false,
            error: null,
          });
        } else {
          setState({
            isAuthenticated: false,
            user: null,
            isLoading: false,
            error: null,
          });
        }
      } catch (error) {
        setState({
          isAuthenticated: false,
          user: null,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Lỗi xác thực',
        });
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = useCallback(async (credentials: LoginCredentials) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const user = await authService.login(credentials);
      setState({
        isAuthenticated: true,
        user,
        isLoading: false,
        error: null,
      });
      return true;
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Đăng nhập thất bại',
      }));
      return false;
    }
  }, []);

  // Register function
  const register = useCallback(async (userData: RegisterData) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      await authService.register(userData);
      setState(prev => ({
        ...prev,
        isLoading: false,
      }));
      return true;
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Đăng ký thất bại',
      }));
      return false;
    }
  }, []);

  // Logout function
  const logout = useCallback(() => {
    authService.logout();
    setState({
      isAuthenticated: false,
      user: null,
      isLoading: false,
      error: null,
    });
    navigate('/auth/signin');
  }, [navigate]);

  // Check user authentication status and redirect if needed
  const checkAuthAndRedirect = useCallback(async () => {
    if (!authService.isAuthenticated()) {
      navigate('/auth/signin');
      return false;
    }
    
    try {
      await authService.getCurrentUser();
      return true;
    } catch (error) {
      // Try to refresh token
      const refreshed = await authService.refreshToken();
      if (!refreshed) {
        logout();
        return false;
      }
      return true;
    }
  }, [navigate, logout]);

  return {
    ...state,
    login,
    register,
    logout,
    checkAuthAndRedirect,
  };
};

export default useAuth;