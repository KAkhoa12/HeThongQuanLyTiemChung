import authService from './auth.service';
import API_CONFIG from '../config/api.config';

class ApiService {
  async get<T>(endpoint: string, params: Record<string, any> = {}): Promise<T> {  
    console.log("API GET:", endpoint, "params:", params);
    return this.request<T>('GET', endpoint, params);
  }

  async create<T>(endpoint: string, data: any = {}): Promise<T> {
    return this.request<T>('POST', endpoint, data);
  }

  async post<T>(endpoint: string, data: any = {}): Promise<T> {
    return this.request<T>('POST', endpoint, data);
  }

  async update<T>(endpoint: string, data: any = {}): Promise<T> {
    return this.request<T>('PUT', endpoint, data);
  }

  async put<T>(endpoint: string, data: any = {}): Promise<T> {
    return this.request<T>('PUT', endpoint, data);
  }

  async delete<T>(endpoint: string, params: Record<string, any> = {}): Promise<T> {
    return this.request<T>('DELETE', endpoint, params);
  }

  private async request<T>(
    method: string,
    endpoint: string,
    data: any = {},
    retried: boolean = false
  ): Promise<T> {
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
      options.body = JSON.stringify(data);
    }
    
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;
    
    try {
      const response = await fetch(url, options);
      
      if (response.status === 401 && !retried) {
        // Try to refresh the token
        const refreshed = await authService.refreshToken();
        
        if (refreshed) {
          return this.request<T>(method, endpoint, data, true);
        } else {
          authService.logout();
          throw new Error('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại');
        }
      }
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Có lỗi xảy ra');
      }
      
      // Trả về toàn bộ response để hook có thể xử lý lỗi
      return result.payload as T;
    } catch (error) {
      console.error(`API ${method} request error:`, error);
      throw error;
    }
  }
}

export const apiService = new ApiService();
export default apiService;