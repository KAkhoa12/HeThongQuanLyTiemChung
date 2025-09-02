import apiService from './api.service';

// Types
export interface LoaiKhuyenMaiDto {
  maLoaiKhuyenMai: string;
  tenLoai?: string;
  moTa?: string;
  isDelete?: boolean;
  isActive?: boolean;
  ngayTao?: string;
  ngayCapNhat?: string;
}

export interface CreateLoaiKhuyenMaiDto {
  tenLoai?: string;
  moTa?: string;
}

export interface UpdateLoaiKhuyenMaiDto {
  tenLoai?: string;
  moTa?: string;
}

export interface PagedResultDto<T> {
  data: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// API Functions
export const getAllLoaiKhuyenMais = async (params?: {
  page?: number;
  pageSize?: number;
  searchTerm?: string;
}): Promise<PagedResultDto<LoaiKhuyenMaiDto>> => {
  return await apiService.get<PagedResultDto<LoaiKhuyenMaiDto>>('/api/LoaiKhuyenMai', params);
};

export const getAllLoaiKhuyenMaisActive = async (): Promise<LoaiKhuyenMaiDto[]> => {
  return await apiService.get<LoaiKhuyenMaiDto[]>('/api/LoaiKhuyenMai/all');
};

export const getLoaiKhuyenMaiById = async (id: string): Promise<LoaiKhuyenMaiDto> => {
  return await apiService.get<LoaiKhuyenMaiDto>(`/api/LoaiKhuyenMai/${id}`);
};

export const createLoaiKhuyenMai = async (data: CreateLoaiKhuyenMaiDto): Promise<string> => {
  return await apiService.create<string>('/api/LoaiKhuyenMai', data);
};

export const updateLoaiKhuyenMai = async (id: string, data: UpdateLoaiKhuyenMaiDto): Promise<void> => {
  return await apiService.update<void>(`/api/LoaiKhuyenMai/${id}`, data);
};

export const deleteLoaiKhuyenMai = async (id: string): Promise<void> => {
  return await apiService.delete<void>(`/api/LoaiKhuyenMai/${id}`);
};

export const getKhuyenMaisByLoai = async (id: string, params?: {
  page?: number;
  pageSize?: number;
}): Promise<PagedResultDto<any>> => {
  return await apiService.get<PagedResultDto<any>>(`/api/LoaiKhuyenMai/${id}/khuyen-mai`, params);
}; 