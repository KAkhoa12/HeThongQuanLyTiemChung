import apiService from './api.service';

// DTOs
export interface PhieuNhapDto {
  maPhieuNhap: string;
  maNhaCungCap?: string;
  maQuanLy?: string;
  ngayNhap?: string;
  tongTien?: number;
  trangThai?: string;
  ngayTao?: string;
  ngayCapNhat?: string;
  tenNhaCungCap?: string;
  tenQuanLy?: string;
}

export interface PhieuNhapDetailDto {
  maPhieuNhap: string;
  maNhaCungCap?: string;
  maQuanLy?: string;
  ngayNhap?: string;
  tongTien?: number;
  trangThai?: string;
  ngayTao?: string;
  ngayCapNhat?: string;
  tenNhaCungCap?: string;
  tenQuanLy?: string;
  chiTietNhaps?: ChiTietNhapDto[];
}

export interface ChiTietNhapDto {
  maChiTietNhap: string;
  maPhieuNhap: string;
  maLo: string;
  soLuong?: number;
  giaNhap?: number;
  soLo?: string;
  tenVaccine?: string;
  tenNhaCungCap?: string;
}

export interface PhieuNhapCreateDto {
  maNhaCungCap?: string;
  maQuanLy?: string;
  ngayNhap?: string;
  chiTietNhaps: ChiTietNhapCreateDto[];
}

export interface ChiTietNhapCreateDto {
  maLo: string;
  soLuong: number;
  giaNhap: number;
}

export interface PhieuNhapUpdateDto {
  maNhaCungCap?: string;
  maQuanLy?: string;
  ngayNhap?: string;
  trangThai?: string;
}

export interface PhieuNhapQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  maNhaCungCap?: string;
  trangThai?: string;
}

// Service methods
export const phieuNhapService = {
  // Lấy danh sách phiếu nhập (có phân trang)
  getAll: (params: PhieuNhapQueryParams = {}) => {
    return apiService.get<{
      totalCount: number;
      page: number;
      pageSize: number;
      totalPages: number;
      data: PhieuNhapDto[];
    }>('/api/phieu-nhap', params);
  },

  // Lấy chi tiết phiếu nhập theo ID
  getById: (id: string) => {
    return apiService.get<PhieuNhapDetailDto>(`/api/phieu-nhap/${id}`);
  },

  // Tạo phiếu nhập mới
  create: (data: PhieuNhapCreateDto) => {
    return apiService.create<{ maPhieuNhap: string }>('/api/phieu-nhap', data);
  },

  // Cập nhật phiếu nhập
  update: (id: string, data: PhieuNhapUpdateDto) => {
    return apiService.update(`/api/phieu-nhap/${id}`, data);
  },

  // Xóa phiếu nhập (soft delete)
  delete: (id: string) => {
    return apiService.delete(`/api/phieu-nhap/${id}`);
  },

  // Xác nhận phiếu nhập
  confirm: (id: string) => {
    return apiService.create(`/api/phieu-nhap/${id}/confirm`, {});
  }
};

export default phieuNhapService; 