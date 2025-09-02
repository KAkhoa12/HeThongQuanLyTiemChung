import apiService from './api.service';

export interface NguoiDungQuyen {
  maNguoiDung: string;
  maQuyen: string;
  ngayTao?: string;
  isDelete?: boolean;
  isActive?: boolean;
  ngayCapNhat?: string;
  tenNguoiDung?: string;
  email?: string;
  tenQuyen?: string;
  module?: string;
}

export interface NguoiDungQuyenListResponse {
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  data: NguoiDungQuyen[];
}

export interface NguoiDungQuyenListParams {
  page?: number;
  pageSize?: number;
  maNguoiDung?: string;
  maQuyen?: string;
}

export interface NguoiDungQuyenCreateRequest {
  maNguoiDung: string;
  maQuyen: string;
}

export interface NguoiDungQuyenUpdateRequest {
  isActive?: boolean;
}

export interface PhanQuyenNguoiDungRequest {
  maNguoiDung: string;
  danhSachMaQuyen: string[];
}

export interface QuyenNguoiDung {
  maQuyen: string;
  tenQuyen: string;
  moTa?: string;
  module: string;
  isDelete?: boolean;
  isActive?: boolean;
  ngayTao?: string;
  ngayCapNhat?: string;
  coQuyen: boolean;
}

// Get all user permissions with pagination and filters
export const getNguoiDungQuyens = async (params?: NguoiDungQuyenListParams): Promise<NguoiDungQuyenListResponse> => {
  return await apiService.get<NguoiDungQuyenListResponse>('/api/nguoidungquyen', params);
};

// Get permissions by user
export const getQuyensByNguoiDung = async (maNguoiDung: string): Promise<Quyen[]> => {
  return await apiService.get<Quyen[]>(`/api/nguoidungquyen/nguoidung/${maNguoiDung}`);
};

// Get all permissions for user (including role permissions)
export const getAllQuyensByNguoiDung = async (maNguoiDung: string): Promise<QuyenNguoiDung[]> => {
  return await apiService.get<QuyenNguoiDung[]>(`/api/nguoidungquyen/nguoidung/${maNguoiDung}/all`);
};

// Create user permission
export const createNguoiDungQuyen = async (request: NguoiDungQuyenCreateRequest): Promise<NguoiDungQuyen> => {
  return await apiService.create<NguoiDungQuyen>('/api/nguoidungquyen', request);
};

// Assign permissions to user (bulk)
export const phanQuyenNguoiDung = async (request: PhanQuyenNguoiDungRequest): Promise<void> => {
  return await apiService.create<void>('/api/nguoidungquyen/phanquyen', request);
};

// Update user permission
export const updateNguoiDungQuyen = async (maNguoiDung: string, maQuyen: string, request: NguoiDungQuyenUpdateRequest): Promise<NguoiDungQuyen> => {
  return await apiService.update<NguoiDungQuyen>(`/api/nguoidungquyen/${maNguoiDung}/${maQuyen}`, request);
};

// Delete user permission
export const deleteNguoiDungQuyen = async (maNguoiDung: string, maQuyen: string): Promise<void> => {
  return await apiService.delete<void>(`/api/nguoidungquyen/${maNguoiDung}/${maQuyen}`);
};

// Check if user has permission (including role permissions)
export const checkNguoiDungQuyen = async (maNguoiDung: string, maQuyen: string): Promise<{ hasQuyen: boolean; source: string }> => {
  return await apiService.get<{ hasQuyen: boolean; source: string }>(`/api/nguoidungquyen/check/${maNguoiDung}/${maQuyen}`);
};

// Import Quyen interface from quyen.service
import { Quyen } from './quyen.service'; 