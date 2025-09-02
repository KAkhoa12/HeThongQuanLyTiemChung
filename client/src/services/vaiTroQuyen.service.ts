import apiService from './api.service';

export interface VaiTroQuyen {
  maVaiTro: string;
  maQuyen: string;
  ngayTao?: string;
  isDelete?: boolean;
  isActive?: boolean;
  ngayCapNhat?: string;
  tenQuyen?: string;
  module?: string;
}

export interface VaiTroQuyenListResponse {
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  data: VaiTroQuyen[];
}

export interface VaiTroQuyenListParams {
  page?: number;
  pageSize?: number;
  maVaiTro?: string;
  maQuyen?: string;
}

export interface VaiTroQuyenCreateRequest {
  maVaiTro: string;
  maQuyen: string;
}

export interface VaiTroQuyenUpdateRequest {
  isActive?: boolean;
}

export interface PhanQuyenRequest {
  maVaiTro: string;
  danhSachMaQuyen: string[];
}

// Get all role permissions with pagination and filters
export const getVaiTroQuyens = async (params?: VaiTroQuyenListParams): Promise<VaiTroQuyenListResponse> => {
  return await apiService.get<VaiTroQuyenListResponse>('/api/vaitroquyen', params);
};

// Get permissions by role
export const getQuyensByVaiTro = async (maVaiTro: string): Promise<Quyen[]> => {
  return await apiService.get<Quyen[]>(`/api/vaitroquyen/vaitro/${maVaiTro}`);
};

// Create role permission
export const createVaiTroQuyen = async (request: VaiTroQuyenCreateRequest): Promise<VaiTroQuyen> => {
  return await apiService.create<VaiTroQuyen>('/api/vaitroquyen', request);
};

// Assign permissions to role (bulk)
export const phanQuyen = async (request: PhanQuyenRequest): Promise<void> => {
  return await apiService.create<void>('/api/vaitroquyen/phanquyen', request);
};

// Update role permission
export const updateVaiTroQuyen = async (maVaiTro: string, maQuyen: string, request: VaiTroQuyenUpdateRequest): Promise<VaiTroQuyen> => {
  return await apiService.update<VaiTroQuyen>(`/api/vaitroquyen/${maVaiTro}/${maQuyen}`, request);
};

// Delete role permission
export const deleteVaiTroQuyen = async (maVaiTro: string, maQuyen: string): Promise<void> => {
  return await apiService.delete<void>(`/api/vaitroquyen/${maVaiTro}/${maQuyen}`);
};

// Check if role has permission
export const checkVaiTroQuyen = async (maVaiTro: string, maQuyen: string): Promise<{ hasQuyen: boolean }> => {
  return await apiService.get<{ hasQuyen: boolean }>(`/api/vaitroquyen/check/${maVaiTro}/${maQuyen}`);
};

// Import Quyen interface from quyen.service
import { Quyen } from './quyen.service'; 