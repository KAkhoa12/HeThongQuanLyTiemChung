import { useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import authService from '../services/auth.service';

export const useAuthInit = () => {
  const { fetchCurrentUser, isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    // Only fetch user data if we have a token but no user data
    if (authService.isAuthenticated() && !user) {
      fetchCurrentUser();
    }
  }, [fetchCurrentUser, user]);

  return {
    isAuthenticated,
    user,
    isLoading: useAuthStore((state) => state.isLoading)
  };
}; 