import apiService from './api.service';

// DTOs
export interface ChiTietNhapDto {
  maChiTiet: string;
  maPhieuNhap: string;
  maLo: string;
  soLuong?: number;
  gia?: number;
  soLo?: string;
  tenVaccine?: string;
  tenNhaCungCap?: string;
}

export interface ChiTietNhapCreateDto {
  maLo: string;
  soLuong: number;
  gia: number;
}

export interface ChiTietNhapQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  maPhieuNhap?: string;
  maLo?: string;
}

// Service methods
export const chiTietNhapService = {
  // Lấy danh sách chi tiết nhập (có phân trang)
  getAll: (params: ChiTietNhapQueryParams = {}) => {
    return apiService.get<{
      totalCount: number;
      page: number;
      pageSize: number;
      totalPages: number;
      data: ChiTietNhapDto[];
    }>('/api/chi-tiet-nhap', params);
  },

  // Lấy chi tiết nhập theo ID
  getById: (id: string) => {
    return apiService.get<ChiTietNhapDto>(`/api/chi-tiet-nhap/${id}`);
  },

  // Tạo chi tiết nhập mới
  create: (data: ChiTietNhapCreateDto) => {
    return apiService.create<{ maChiTiet: string }>('/api/chi-tiet-nhap', data);
  },

  // Cập nhật chi tiết nhập
  update: (id: string, data: ChiTietNhapCreateDto) => {
    return apiService.update(`/api/chi-tiet-nhap/${id}`, data);
  },

  // Xóa chi tiết nhập (soft delete)
  delete: (id: string) => {
    return apiService.delete(`/api/chi-tiet-nhap/${id}`);
  },

  // Lấy chi tiết nhập theo phiếu nhập
  getByPhieuNhap: (maPhieuNhap: string) => {
    return apiService.get<ChiTietNhapDto[]>(`/api/chi-tiet-nhap/phieu-nhap/${maPhieuNhap}`);
  }
};

export default chiTietNhapService;