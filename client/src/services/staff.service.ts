import apiService from './api.service';
import { ApiResponse, PagedResponse, Staff, StaffCreateRequest, StaffDetail, StaffUpdateRequest } from '../types/staff.types';

/**
 * Get all staff with pagination
 */
export const getAllStaff = async (page: number = 1, pageSize: number = 20): Promise<PagedResponse<Staff>> => {
  return await apiService.get(`/api/staff?page=${page}&pageSize=${pageSize}`);
};

/**
 * Get staff by ID
 */
export const getStaffById = async (id: string): Promise<StaffDetail> => {
  return await apiService.get(`/api/staff/${id}`);
};

/**
 * Create new staff
 */
export const createStaff = async (staffData: StaffCreateRequest): Promise<{ id: string }> => {
  return await apiService.create('/api/staff', staffData);
};

/**
 * Update staff
 */
export const updateStaff = async (id: string, staffData: StaffUpdateRequest): Promise<void> => {
  await apiService.update(`/api/staff/${id}`, staffData);
};

/**
 * Delete staff (soft delete)
 */
export const deleteStaff = async (id: string): Promise<void> => {
  await apiService.delete(`/api/staff/${id}`);
};

/**
 * Search staff by name or email
 */
export const searchStaff = async (query: string, page: number = 1, pageSize: number = 20): Promise<PagedResponse<Staff>> => {
  return await apiService.get(`/api/staff/search?query=${query}&page=${page}&pageSize=${pageSize}`);
};