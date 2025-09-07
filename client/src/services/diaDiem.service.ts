import apiService from './api.service';

// DTOs
export interface DiaDiemDto {
  maDiaDiem: string;
  ten: string;
  diaChi: string;
  soDienThoai?: string;
  email?: string;
  moTa?: string;
  gioMoCua?: string;
  sucChua?: number;
  loaiDiaDiem?: string;
  isDelete?: boolean;
  isActive?: boolean;
  ngayTao?: string;
  ngayCapNhat?: string;
}

export interface DiaDiemCreateDto {
  ten: string;
  diaChi: string;
  soDienThoai?: string;
  email?: string;
  moTa?: string;
  gioMoCua?: string;
  sucChua?: number;
  loaiDiaDiem?: string;
}

export interface DiaDiemUpdateDto {
  ten?: string;
  diaChi?: string;
  soDienThoai?: string;
  email?: string;
  moTa?: string;
  gioMoCua?: string;
  sucChua?: number;
  loaiDiaDiem?: string;
  isActive?: boolean;
}

export interface DiaDiemQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  loaiDiaDiem?: string;
}

// Service methods
export const diaDiemService = {
  // Lấy danh sách địa điểm (có phân trang)
  getAll: (params: DiaDiemQueryParams = {}) => {
    return apiService.get<{
      totalCount: number;
      page: number;
      pageSize: number;
      totalPages: number;
      data: DiaDiemDto[];
    }>('/api/dia-diem', params);
  },

  // Lấy chi tiết địa điểm theo ID
  getById: (id: string) => {
    return apiService.get<DiaDiemDto>(`/api/dia-diem/${id}`);
  },

  // Tạo địa điểm mới
  create: (data: DiaDiemCreateDto) => {
    return apiService.create<{ maDiaDiem: string }>('/api/dia-diem', data);
  },

  // Cập nhật địa điểm
  update: (id: string, data: DiaDiemUpdateDto) => {
    return apiService.update(`/api/dia-diem/${id}`, data);
  },

  // Xóa địa điểm (soft delete)
  delete: (id: string) => {
    return apiService.delete(`/api/dia-diem/${id}`);
  }
};

export default diaDiemService;