import apiService from './api.service';

export interface VaiTro {
  maVaiTro: string;
  tenVaiTro: string;
  moTa?: string;
  isDelete?: boolean;
  isActive?: boolean;
  ngayTao?: string;
  ngayCapNhat?: string;
}

export interface VaiTroListResponse {
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  data: VaiTro[];
}

export interface VaiTroListParams {
  page?: number;
  pageSize?: number;
  search?: string;
}

// Get all roles with pagination and filters
export const getVaiTros = async (params?: VaiTroListParams): Promise<VaiTroListResponse> => {
  return await apiService.get<VaiTroListResponse>('/api/vaitro', params);
};

// Get role by ID
export const getVaiTro = async (maVaiTro: string): Promise<VaiTro> => {
  return await apiService.get<VaiTro>(`/api/vaitro/${maVaiTro}`);
};

// Get all active roles
export const getActiveVaiTros = async (): Promise<VaiTro[]> => {
  return await apiService.get<VaiTro[]>('/api/vaitro/active');
}; 