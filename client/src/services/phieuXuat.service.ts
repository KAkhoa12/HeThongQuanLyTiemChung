import apiService from './api.service';

// DTOs
export interface PhieuXuatDto {
  maPhieuXuat: string;
  maDiaDiemXuat?: string;
  maDiaDiemNhap?: string;
  maQuanLy?: string;
  ngayXuat?: string;
  loaiXuat?: string;
  trangThai?: string;
  ngayTao?: string;
  ngayCapNhat?: string;
  tenDiaDiemXuat?: string;
  tenDiaDiemNhap?: string;
  tenQuanLy?: string;
}

export interface PhieuXuatDetailDto {
  maPhieuXuat: string;
  maDiaDiemXuat?: string;
  maDiaDiemNhap?: string;
  maQuanLy?: string;
  ngayXuat?: string;
  loaiXuat?: string;
  trangThai?: string;
  ngayTao?: string;
  ngayCapNhat?: string;
  tenDiaDiemXuat?: string;
  tenDiaDiemNhap?: string;
  tenQuanLy?: string;
  chiTietXuats?: ChiTietXuatDto[];
}

export interface ChiTietXuatDto {
  maChiTietXuat: string;
  maPhieuXuat: string;
  maLo: string;
  soLuong?: number;
  soLo?: string;
  tenVaccine?: string;
}

export interface PhieuXuatCreateDto {
  maDiaDiemXuat?: string;
  maDiaDiemNhap?: string;
  maQuanLy?: string;
  ngayXuat?: string;
  loaiXuat?: string;
  chiTietXuats: ChiTietXuatCreateDto[];
}

export interface ChiTietXuatCreateDto {
  maLo: string;
  soLuong: number;
}

export interface PhieuXuatUpdateDto {
  maDiaDiemXuat?: string;
  maDiaDiemNhap?: string;
  maQuanLy?: string;
  ngayXuat?: string;
  loaiXuat?: string;
  trangThai?: string;
}

export interface PhieuXuatQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  loaiXuat?: string;
  trangThai?: string;
}

// Service methods
export const phieuXuatService = {
  // Lấy danh sách phiếu xuất (có phân trang)
  getAll: (params: PhieuXuatQueryParams = {}) => {
    return apiService.get<{
      totalCount: number;
      page: number;
      pageSize: number;
      totalPages: number;
      data: PhieuXuatDto[];
    }>('/api/phieu-xuat', params);
  },

  // Lấy chi tiết phiếu xuất theo ID
  getById: (id: string) => {
    return apiService.get<PhieuXuatDetailDto>(`/api/phieu-xuat/${id}`);
  },

  // Tạo phiếu xuất mới
  create: (data: PhieuXuatCreateDto) => {
    return apiService.create<{ maPhieuXuat: string }>('/api/phieu-xuat', data);
  },

  // Cập nhật phiếu xuất
  update: (id: string, data: PhieuXuatUpdateDto) => {
    return apiService.update(`/api/phieu-xuat/${id}`, data);
  },

  // Xóa phiếu xuất (soft delete)
  delete: (id: string) => {
    return apiService.delete(`/api/phieu-xuat/${id}`);
  },

  // Xác nhận phiếu xuất
  confirm: (id: string) => {
    return apiService.create(`/api/phieu-xuat/${id}/confirm`, {});
  }
};

export default phieuXuatService; 