import apiService from './api.service';

// Types
export interface KhuyenMaiDto {
  maKhuyenMai: string;
  maLoaiKhuyenMai?: string;
  tenKhuyenMai?: string;
  code?: string;
  loaiGiam?: string;
  giaTriGiam?: number;
  giamToiDa?: number;
  dieuKienToiThieu?: number;
  giaTriToiThieu?: number;
  ngayBatDau?: string;
  ngayKetThuc?: string;
  soLuotDung?: number;
  soLuotDaDung?: number;
  trangThai?: string;
  isDelete?: boolean;
  isActive?: boolean;
  ngayTao?: string;
  ngayCapNhat?: string;
  tenLoaiKhuyenMai?: string;
}

export interface CreateKhuyenMaiDto {
  maLoaiKhuyenMai?: string;
  tenKhuyenMai?: string;
  code?: string;
  loaiGiam?: string;
  giaTriGiam?: number;
  giamToiDa?: number;
  dieuKienToiThieu?: number;
  giaTriToiThieu?: number;
  ngayBatDau?: string;
  ngayKetThuc?: string;
  soLuotDung?: number;
  trangThai?: string;
}

export interface UpdateKhuyenMaiDto {
  maLoaiKhuyenMai?: string;
  tenKhuyenMai?: string;
  code?: string;
  loaiGiam?: string;
  giaTriGiam?: number;
  giamToiDa?: number;
  dieuKienToiThieu?: number;
  giaTriToiThieu?: number;
  ngayBatDau?: string;
  ngayKetThuc?: string;
  soLuotDung?: number;
  trangThai?: string;
}

export interface PagedResultDto<T> {
  data: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// API Functions
export const getAllKhuyenMais = async (params?: {
  page?: number;
  pageSize?: number;
  searchTerm?: string;
  maLoaiKhuyenMai?: string;
  trangThai?: string;
}): Promise<PagedResultDto<KhuyenMaiDto>> => {
  return await apiService.get<PagedResultDto<KhuyenMaiDto>>('/api/KhuyenMai', params);
};

export const getKhuyenMaiById = async (id: string): Promise<KhuyenMaiDto> => {
  return await apiService.get<KhuyenMaiDto>(`/api/KhuyenMai/${id}`);
};

export const createKhuyenMai = async (data: CreateKhuyenMaiDto): Promise<string> => {
  return await apiService.create<string>('/api/KhuyenMai', data);
};

export const updateKhuyenMai = async (id: string, data: UpdateKhuyenMaiDto): Promise<void> => {
  return await apiService.update<void>(`/api/KhuyenMai/${id}`, data);
};

export const deleteKhuyenMai = async (id: string): Promise<void> => {
  return await apiService.delete<void>(`/api/KhuyenMai/${id}`);
};

export const validateKhuyenMaiCode = async (code: string): Promise<KhuyenMaiDto> => {
  return await apiService.get<KhuyenMaiDto>(`/api/KhuyenMai/validate-code/${code}`);
}; 