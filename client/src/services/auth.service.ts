import Cookies from 'js-cookie';
import apiService from './api.service';

// Cookie settings
const TOKEN_COOKIE_NAME = 'auth_token';
const REFRESH_TOKEN_COOKIE_NAME = 'refresh_token';
const USER_ID_COOKIE_NAME = 'user_id';
// Cookie expiry in days (should match the token expiry from backend)
const ACCESS_TOKEN_EXPIRY = 1; // 1 day for access token
const REFRESH_TOKEN_EXPIRY = 7; 

// Types
export interface LoginCredentials {
  email: string;
  matKhau: string;
}

export interface RegisterData {
  ten: string;
  email: string;
  matKhau: string;
  soDienThoai?: string;
  ngaySinh?: string; // Format: YYYY-MM-DD
  diaChi?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  userId: string;
}

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

// Auth Service
class AuthService {
  /**
   * Login user and store tokens in cookies
   */
  async login(credentials: LoginCredentials): Promise<UserInfo> {
    try {
      const data = await apiService.post<AuthResponse>('/api/auth/login', credentials);
      
      if (data && data.accessToken) {
        this.setTokens(data);
        const userInfo = await this.getCurrentUser();
        return userInfo;
      }
      
      throw new Error('Đăng nhập thất bại');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Register a new user
   */
  async register(userData: RegisterData): Promise<any> {
    try {
      return await apiService.create('/api/auth/register', userData);
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  }

  /**
   * Get current logged in user information
   */
  async getCurrentUser(): Promise<UserInfo> {
    try {
      const token = this.getToken();
      
      if (!token) {
        throw new Error('Không có token đăng nhập');
      }
      
      return await apiService.get('/api/auth/me');
    } catch (error) {
      console.error('Get user error:', error);
      this.logout();
      throw error;
    }
  }

  /**
   * Refresh the access token using refresh token
   */
  async refreshToken(): Promise<boolean> {
    try {
      const refreshToken = this.getRefreshToken();
      
      if (!refreshToken) {
        return false;
      }
      
      const data = await apiService.post<AuthResponse>('/api/auth/refresh', { refreshToken });
      
      if (data && data.accessToken) {
        this.setTokens(data);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Refresh token error:', error);
      this.logout();
      return false;
    }
  }

  /**
   * Logout user by calling backend API and clearing cookies
   */
  async logoutFromServer(): Promise<boolean> {
    try {
      const token = this.getToken();
      
      if (token) {
        await apiService.post('/api/auth/logout', {});
      }
      
      // Always clear local data regardless of response
      this.clearLocalData();
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      // Even if API call fails, clear local data
      this.clearLocalData();
      return false;
    }
  }

  /**
   * Logout user and clear cookies (legacy method, now calls logoutFromServer)
   */
  logout(): void {
    this.logoutFromServer();
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Get access token from cookie
   */
  getToken(): string | null {
    return Cookies.get(TOKEN_COOKIE_NAME) || null;
  }

  /**
   * Get refresh token from cookie
   */
  getRefreshToken(): string | null {
    return Cookies.get(REFRESH_TOKEN_COOKIE_NAME) || null;
  }

  /**
   * Get user ID from cookie
   */
  getUserId(): string | null {
    return Cookies.get(USER_ID_COOKIE_NAME) || null;
  }

  /**
   * Set tokens in cookies
   */
  private setTokens(authData: AuthResponse): void {
    Cookies.set(TOKEN_COOKIE_NAME, authData.accessToken, { expires: ACCESS_TOKEN_EXPIRY, secure: true, sameSite: 'strict' });
    Cookies.set(REFRESH_TOKEN_COOKIE_NAME, authData.refreshToken, { expires: REFRESH_TOKEN_EXPIRY, secure: true, sameSite: 'strict' });
    Cookies.set(USER_ID_COOKIE_NAME, authData.userId, { expires: REFRESH_TOKEN_EXPIRY, secure: true, sameSite: 'strict' });
  }

  /**
   * Clear all local authentication data
   */
  private clearLocalData(): void {
    Cookies.remove(TOKEN_COOKIE_NAME);
    Cookies.remove(REFRESH_TOKEN_COOKIE_NAME);
    Cookies.remove(USER_ID_COOKIE_NAME);
  }
}

export const authService = new AuthService();
export default authService;