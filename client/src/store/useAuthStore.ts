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
  role: string;
  moTaVaiTro: string;
  registeredAt: string;
  avatarUrl?: string;
  permissions: string[];
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
  checkAuthStatus: () => boolean;
  updateAvatar: (avatarUrl: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Check authentication status using authService
      checkAuthStatus: () => {
        const isAuth = authService.isAuthenticated();
        console.log('useAuthStore - checkAuthStatus:', isAuth);
        
        // Update local state if it's different
        if (isAuth !== get().isAuthenticated) {
          set({ isAuthenticated: isAuth });
        }
        
        return isAuth;
      },

      // Login action
      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });
          
          // Login và lưu token
          await authService.login({ email, matKhau: password });
          
          // Sau khi lưu token, lấy thông tin user
          const userInfo = await authService.getCurrentUser();
          
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
          
          // Clear cart from localStorage
          localStorage.removeItem('vaccineCart');
          
          // Dispatch custom event to notify cart components
          window.dispatchEvent(new CustomEvent('cartCleared'));
          
          // Clear local state
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null
          });
          
          // Dispatch custom event to notify navigation
          window.dispatchEvent(new CustomEvent('logoutSuccess'));
        } catch (error) {
          console.error('Logout error:', error);
          // Even if API fails, clear local state and cart
          localStorage.removeItem('vaccineCart');
          
          // Dispatch custom event to notify cart components
          window.dispatchEvent(new CustomEvent('cartCleared'));
          
          // Dispatch custom event to notify navigation
          window.dispatchEvent(new CustomEvent('logoutSuccess'));
          
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
          console.log('useAuthStore - fetchCurrentUser: Starting...');
          
          // First check if we have a valid token
          if (!authService.isAuthenticated()) {
            console.log('useAuthStore - fetchCurrentUser: No valid token found');
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: null
            });
            return;
          }
          
          set({ isLoading: true, error: null });
          
          const userInfo = await authService.getCurrentUser();
          console.log('useAuthStore - fetchCurrentUser: Success:', userInfo);
          
          set({
            user: userInfo,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
        } catch (error) {
          console.error('useAuthStore - fetchCurrentUser: Error:', error);
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
      },

      // Update user avatar
      updateAvatar: (avatarUrl: string) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: {
              ...currentUser,
              avatarUrl: avatarUrl
            }
          });
        }
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