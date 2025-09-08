import apiService from './api.service';
import { UserCompleteProfileDto, UserProfileUpdateDto, HealthInfoUpdateDto } from '../types/user.types';

/**
 * Get all users with pagination (for admin)
 */
export const getAllUsers = async (page: number = 1, pageSize: number = 10, search?: string, roleId?: string) => {
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString()
  });
  
  if (search) params.append('search', search);
  if (roleId) params.append('roleId', roleId);
  
  return await apiService.get(`/api/users?${params.toString()}`);
};

/**
 * Get user by ID
 */
export const getUserById = async (id: string) => {
  return await apiService.get(`/api/users/${id}`);
};

/**
 * Create new user
 */
export const createUserDoctor = async (userData: any) => {
  return await apiService.create('/api/users/doctor', userData);
};
export const createUserManager = async (userData: any) => {
  return await apiService.create('/api/users/manager', userData);
};

/**
 * Update user
 */
export const updateUser = async (id: string, userData: any) => {
  return await apiService.update(`/api/users/${id}`, userData);
};

/**
 * Delete user
 */
export const deleteUser = async (id: string) => {
  return await apiService.delete(`/api/users/${id}`);
};

/**
 * Get my profile
 */
export const getMyProfile = async (): Promise<UserCompleteProfileDto> => {
  return await apiService.get('/api/users/profile');
};

/**
 * Update profile
 */
export const updateProfile = async (data: UserProfileUpdateDto): Promise<void> => {
  return await apiService.update('/api/users/profile', data);
};

/**
 * Update health info
 */
export const updateHealthInfo = async (data: HealthInfoUpdateDto): Promise<void> => {
  return await apiService.update('/api/users/health-info', data);
};

/**
 * Upload avatar
 */
export const uploadAvatar = async (file: File): Promise<{ maAnh: string }> => {
  const formData = new FormData();
  formData.append('file', file);
  return await apiService.create('/api/users/upload-avatar', formData);
};