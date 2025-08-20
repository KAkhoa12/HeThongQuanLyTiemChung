import axios from 'axios';
import API_CONFIG from '../config/api.config';
import { ApiResponse, PagedResponse, Staff, StaffCreateRequest, StaffDetail, StaffUpdateRequest } from '../types/staff.types';

const BASE_URL = `${API_CONFIG.BASE_URL}${API_CONFIG.STAFF.BASE}`;

/**
 * Get all staff with pagination
 */
export const getAllStaff = async (page: number = 1, pageSize: number = 20): Promise<PagedResponse<Staff>> => {
  try {
    const response = await axios.get<ApiResponse<PagedResponse<Staff>>>(`${BASE_URL}?page=${page}&pageSize=${pageSize}`);
    return response.data.payload;
  } catch (error) {
    console.error('Error fetching staff:', error);
    throw error;
  }
};

/**
 * Get staff by ID
 */
export const getStaffById = async (id: string): Promise<StaffDetail> => {
  try {
    const response = await axios.get<ApiResponse<StaffDetail>>(`${BASE_URL}/${id}`);
    return response.data.payload;
  } catch (error) {
    console.error(`Error fetching staff with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Create new staff
 */
export const createStaff = async (staffData: StaffCreateRequest): Promise<{ id: string }> => {
  try {
    const response = await axios.post<ApiResponse<{ id: string }>>(BASE_URL, staffData);
    return response.data.payload;
  } catch (error) {
    console.error('Error creating staff:', error);
    throw error;
  }
};

/**
 * Update staff
 */
export const updateStaff = async (id: string, staffData: StaffUpdateRequest): Promise<void> => {
  try {
    await axios.put<ApiResponse<null>>(`${BASE_URL}/${id}`, staffData);
  } catch (error) {
    console.error(`Error updating staff with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Delete staff (soft delete)
 */
export const deleteStaff = async (id: string): Promise<void> => {
  try {
    await axios.delete<ApiResponse<null>>(`${BASE_URL}/${id}`);
  } catch (error) {
    console.error(`Error deleting staff with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Search staff by name or email
 */
export const searchStaff = async (query: string, page: number = 1, pageSize: number = 20): Promise<PagedResponse<Staff>> => {
  try {
    const response = await axios.get<ApiResponse<PagedResponse<Staff>>>(`${BASE_URL}/search?query=${query}&page=${page}&pageSize=${pageSize}`);
    return response.data.payload;
  } catch (error) {
    console.error('Error searching staff:', error);
    throw error;
  }
};