import apiService from './api.service';
import { 
  UserCompleteProfileDto, 
  UserProfileUpdateDto, 
  HealthInfoUpdateDto,
  HealthInfoDto 
} from '../types/user.types';

export interface ChangePasswordDto {
  oldPassword: string;
  newPassword: string;
}

export interface UserService {
  // Lấy thông tin profile của người dùng đã đăng nhập
  getMyProfile(): Promise<UserCompleteProfileDto>;
  
  // Cập nhật thông tin cá nhân
  updateProfile(data: UserProfileUpdateDto): Promise<void>;
  
  // Cập nhật thông tin sức khỏe
  updateHealthInfo(data: HealthInfoUpdateDto): Promise<void>;
  
  // Đổi mật khẩu
  changePassword(data: ChangePasswordDto): Promise<void>;
  
  // Lấy thông tin người dùng theo ID (cho admin)
  getUserById(id: string): Promise<UserCompleteProfileDto>;
}

class UserServiceImpl implements UserService {
  
  /* ---------- 1. Lấy thông tin profile của người dùng đã đăng nhập ---------- */
  async getMyProfile(): Promise<UserCompleteProfileDto> {
    return await apiService.get<UserCompleteProfileDto>('/api/users/profile');
  }

  /* ---------- 2. Cập nhật thông tin cá nhân ---------- */
  async updateProfile(data: UserProfileUpdateDto): Promise<void> {
    return await apiService.update<void>('/api/users/profile', data);
  }

  /* ---------- 3. Cập nhật thông tin sức khỏe ---------- */
  async updateHealthInfo(data: HealthInfoUpdateDto): Promise<void> {
    return await apiService.update<void>('/api/users/health-info', data);
  }

  /* ---------- 4. Đổi mật khẩu ---------- */
  async changePassword(data: ChangePasswordDto): Promise<void> {
    return await apiService.update<void>('/api/users/change-password', data);
  }

  /* ---------- 5. Lấy thông tin người dùng theo ID (cho admin) ---------- */
  async getUserById(id: string): Promise<UserCompleteProfileDto> {
    return await apiService.get<UserCompleteProfileDto>(`/api/users/${id}`);
  }
}

// Export instance
const userService = new UserServiceImpl();
export default userService;

// Export individual functions for convenience
export const {
  getMyProfile,
  updateProfile,
  updateHealthInfo,
  changePassword,
  getUserById
} = userService; 