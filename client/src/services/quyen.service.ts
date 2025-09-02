import apiService from './api.service';

export interface Quyen {
  maQuyen: string;
  tenQuyen: string;
  moTa?: string;
  module: string;
  isDelete?: boolean;
  isActive?: boolean;
  ngayTao?: string;
  ngayCapNhat?: string;
}

export interface QuyenListResponse {
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  data: Quyen[];
}

export interface QuyenListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  module?: string;
}

// Get all permissions with pagination and filters
export const getQuyens = async (params?: QuyenListParams): Promise<QuyenListResponse> => {
  console.log("quyen.service - getQuyens called with params:", params);
  return await apiService.get<QuyenListResponse>('/api/quyen', params);
};

// Get permission by ID
export const getQuyen = async (maQuyen: string): Promise<Quyen> => {
  return await apiService.get<Quyen>(`/api/quyen/${maQuyen}`);
};

// Get all modules
export const getModules = async (): Promise<string[]> => {
  return await apiService.get<string[]>('/api/quyen/modules');
}; 