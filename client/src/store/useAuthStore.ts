import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import authService from '../services/auth.service';

// Types
export interface UserInfo {
  maNguoiDung: string;
  ten: string;
  email: string;
  soDienThoai?: string;
  ngaySinh?: string;
  diaChi?: string;
  vaiTro: string;
  ngayTao: string;
}

export interface AuthState {
  // State
  user: UserInfo | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  fetchCurrentUser: () => Promise<void>;
  clearError: () => void;
  setUser: (user: UserInfo) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Login action
      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });
          
          const userInfo = await authService.login({ email, matKhau: password });
          
          set({
            user: userInfo,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
          
          return true;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Đăng nhập thất bại';
          set({
            error: errorMessage,
            isLoading: false,
            user: null,
            isAuthenticated: false
          });
          return false;
        }
      },

      // Logout action
      logout: async () => {
        try {
          set({ isLoading: true });
          
          // Call backend logout API
          await authService.logoutFromServer();
          
          // Clear local state
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null
          });
        } catch (error) {
          console.error('Logout error:', error);
          // Even if API fails, clear local state
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null
          });
        }
      },

      // Fetch current user from /me API
      fetchCurrentUser: async () => {
        try {
          set({ isLoading: true, error: null });
          
          const userInfo = await authService.getCurrentUser();
          
          set({
            user: userInfo,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
        } catch (error) {
          console.error('Fetch user error:', error);
          // If fetching user fails, user might not be authenticated
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null
          });
        }
      },

      // Clear error
      clearError: () => {
        set({ error: null });
      },

      // Set user directly (useful for testing or manual updates)
      setUser: (user: UserInfo) => {
        set({
          user,
          isAuthenticated: true,
          error: null
        });
      }
    }),
    {
      name: 'auth-storage', // unique name for localStorage key
      partialize: (state) => ({
        // Only persist user and isAuthenticated, not loading states
        user: state.user,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
); 