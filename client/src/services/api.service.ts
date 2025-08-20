import authService from './auth.service';
import API_CONFIG from '../config/api.config';

/**
 * Base API service for making authenticated HTTP requests
 */
class ApiService {
  /**
   * Make a GET request
   */
  async get<T>(endpoint: string, params: Record<string, any> = {}): Promise<T> {
    return this.request<T>('GET', endpoint, params);
  }

  /**
   * Make a POST request
   */
  async post<T>(endpoint: string, data: any = {}): Promise<T> {
    return this.request<T>('POST', endpoint, data);
  }

  /**
   * Make a PUT request
   */
  async put<T>(endpoint: string, data: any = {}): Promise<T> {
    return this.request<T>('PUT', endpoint, data);
  }

  /**
   * Make a DELETE request
   */
  async delete<T>(endpoint: string, params: Record<string, any> = {}): Promise<T> {
    return this.request<T>('DELETE', endpoint, params);
  }

  /**
   * Make an HTTP request with authentication
   */
  private async request<T>(
    method: string,
    endpoint: string,
    data: any = {},
    retried: boolean = false
  ): Promise<T> {
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;
    const token = authService.getToken();
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const options: RequestInit = {
      method,
      headers,
    };
    
    if (method === 'GET' || method === 'DELETE') {
      // For GET and DELETE requests, convert data to query parameters
      const queryParams = new URLSearchParams();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
      
      const queryString = queryParams.toString();
      if (queryString) {
        endpoint = `${endpoint}?${queryString}`;
      }
    } else {
      // For POST and PUT requests, add data to the body
      options.body = JSON.stringify(data);
    }
    
    try {
      const response = await fetch(url, options);
      
      // Handle 401 Unauthorized errors
      if (response.status === 401 && !retried) {
        // Try to refresh the token
        const refreshed = await authService.refreshToken();
        
        if (refreshed) {
          // Retry the request with the new token
          return this.request<T>(method, endpoint, data, true);
        } else {
          // Logout if refresh token is invalid
          authService.logout();
          throw new Error('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại');
        }
      }
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Có lỗi xảy ra');
      }
      
      return result.payload;
    } catch (error) {
      console.error(`API ${method} request error:`, error);
      throw error;
    }
  }
}

export const apiService = new ApiService();
export default apiService;