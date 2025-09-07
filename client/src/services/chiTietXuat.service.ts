import apiService from './api.service';

// DTOs
export interface ChiTietXuatDto {
  maChiTiet: string;
  maPhieuXuat: string;
  maLo: string;
  soLuong?: number;
  soLo?: string;
  tenVaccine?: string;
}

export interface ChiTietXuatCreateDto {
  maLo: string;
  soLuong: number;
}

export interface ChiTietXuatQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  maPhieuXuat?: string;
  maLo?: string;
}

// Service methods
export const chiTietXuatService = {
  // Lấy danh sách chi tiết xuất (có phân trang)
  getAll: (params: ChiTietXuatQueryParams = {}) => {
    return apiService.get<{
      totalCount: number;
      page: number;
      pageSize: number;
      totalPages: number;
      data: ChiTietXuatDto[];
    }>('/api/chi-tiet-xuat', params);
  },

  // Lấy chi tiết xuất theo ID
  getById: (id: string) => {
    return apiService.get<ChiTietXuatDto>(`/api/chi-tiet-xuat/${id}`);
  },

  // Tạo chi tiết xuất mới
  create: (data: ChiTietXuatCreateDto) => {
    return apiService.create<{ maChiTiet: string }>('/api/chi-tiet-xuat', data);
  },

  // Cập nhật chi tiết xuất
  update: (id: string, data: ChiTietXuatCreateDto) => {
    return apiService.update(`/api/chi-tiet-xuat/${id}`, data);
  },

  // Xóa chi tiết xuất (soft delete)
  delete: (id: string) => {
    return apiService.delete(`/api/chi-tiet-xuat/${id}`);
  },

  // Lấy chi tiết xuất theo phiếu xuất
  getByPhieuXuat: (maPhieuXuat: string) => {
    return apiService.get<ChiTietXuatDto[]>(`/api/chi-tiet-xuat/phieu-xuat/${maPhieuXuat}`);
  }
};

export default chiTietXuatService;