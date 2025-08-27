import apiService from './api.service';

// DTOs
export interface PhieuThanhLyDto {
  maPhieuThanhLy: string;
  maDiaDiem?: string;
  ngayThanhLy?: string;
  trangThai?: string;
  ngayTao?: string;
  ngayCapNhat?: string;
  tenDiaDiem?: string;
}

export interface PhieuThanhLyDetailDto {
  maPhieuThanhLy: string;
  maDiaDiem?: string;
  ngayThanhLy?: string;
  trangThai?: string;
  ngayTao?: string;
  ngayCapNhat?: string;
  tenDiaDiem?: string;
  chiTietThanhLies?: ChiTietThanhLyDto[];
}

export interface ChiTietThanhLyDto {
  maChiTietThanhLy: string;
  maPhieuThanhLy: string;
  maLo: string;
  soLuong?: number;
  lyDo?: string;
  soLo?: string;
  tenVaccine?: string;
}

export interface PhieuThanhLyCreateDto {
  maDiaDiem?: string;
  ngayThanhLy?: string;
  chiTietThanhLies: ChiTietThanhLyCreateDto[];
}

export interface ChiTietThanhLyCreateDto {
  maLo: string;
  soLuong: number;
  lyDo?: string;
}

export interface PhieuThanhLyUpdateDto {
  maDiaDiem?: string;
  ngayThanhLy?: string;
  trangThai?: string;
}

export interface PhieuThanhLyQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  maDiaDiem?: string;
  trangThai?: string;
}

// Service methods
export const phieuThanhLyService = {
  // Lấy danh sách phiếu thanh lý (có phân trang)
  getAll: (params: PhieuThanhLyQueryParams = {}) => {
    return apiService.get<{
      totalCount: number;
      page: number;
      pageSize: number;
      totalPages: number;
      data: PhieuThanhLyDto[];
    }>('/api/phieu-thanh-ly', params);
  },

  // Lấy chi tiết phiếu thanh lý theo ID
  getById: (id: string) => {
    return apiService.get<PhieuThanhLyDetailDto>(`/api/phieu-thanh-ly/${id}`);
  },

  // Tạo phiếu thanh lý mới
  create: (data: PhieuThanhLyCreateDto) => {
    return apiService.create<{ maPhieuThanhLy: string }>('/api/phieu-thanh-ly', data);
  },

  // Cập nhật phiếu thanh lý
  update: (id: string, data: PhieuThanhLyUpdateDto) => {
    return apiService.update(`/api/phieu-thanh-ly/${id}`, data);
  },

  // Xóa phiếu thanh lý (soft delete)
  delete: (id: string) => {
    return apiService.delete(`/api/phieu-thanh-ly/${id}`);
  },

  // Xác nhận phiếu thanh lý
  confirm: (id: string) => {
    return apiService.create(`/api/phieu-thanh-ly/${id}/confirm`, {});
  }
};

export default phieuThanhLyService; 