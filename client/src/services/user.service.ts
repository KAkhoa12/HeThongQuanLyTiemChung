import apiService from './api.service';
import type {
  UserCompleteProfileDto,
  UserProfileUpdateDto,
  HealthInfoUpdateDto,
  ChangePasswordDto,
  UserDto
} from '../types/user.types';

// Interface cho response pagination
export interface UserListResponse {
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  data: UserDto[];
}

// Interface cho params
export interface UserListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  roleId?: string;
}

// Interface cho upload ảnh
export interface UploadImageResponse {
  maAnh: string;
  urlAnh: string;
  altText?: string;
  maNhan?: string;
  tenNhan?: string;
  ngayTao: string;
}

interface UserService {
  getMyProfile(): Promise<UserCompleteProfileDto>;
  updateProfile(data: UserProfileUpdateDto): Promise<void>;
  updateHealthInfo(data: HealthInfoUpdateDto): Promise<void>;
  changePassword(data: ChangePasswordDto): Promise<void>;
  getUserById(id: string): Promise<UserCompleteProfileDto>;
  getUsers(params?: UserListParams): Promise<UserListResponse>;
  uploadAvatar(file: File): Promise<UploadImageResponse>;
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

  /* ---------- 6. Lấy danh sách tất cả người dùng (cho admin) ---------- */
  async getUsers(params?: UserListParams): Promise<UserListResponse> {
    return await apiService.get<UserListResponse>('/api/users', params);
  }

  /* ---------- 7. Upload ảnh đại diện ---------- */
  async uploadAvatar(file: File): Promise<UploadImageResponse> {
    const formData = new FormData();
    formData.append('files', file);
    formData.append('maNhan', 'AVATAR');
    formData.append('altText', 'Avatar người dùng');

    const response = await apiService.create<UploadImageResponse[]>('/api/images/upload', formData);
    return response[0]; // Trả về ảnh đầu tiên
  }
}

// Export instance
const userService = new UserServiceImpl();
export default userService;

// Export functions
export const getMyProfile = () => userService.getMyProfile();
export const updateProfile = (data: UserProfileUpdateDto) => userService.updateProfile(data);
export const updateHealthInfo = (data: HealthInfoUpdateDto) => userService.updateHealthInfo(data);
export const changePassword = (data: ChangePasswordDto) => userService.changePassword(data);
export const getUserById = (id: string) => userService.getUserById(id);
export const getUsers = (params?: UserListParams) => userService.getUsers(params);
export const uploadAvatar = (file: File) => userService.uploadAvatar(file); 