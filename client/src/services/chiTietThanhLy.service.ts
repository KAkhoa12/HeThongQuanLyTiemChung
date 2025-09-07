import apiService from './api.service';

// DTOs
export interface ChiTietThanhLyDto {
  maChiTiet: string;
  maPhieuThanhLy?: string;
  maLo?: string;
  soLuong?: number;
  lyDo?: string;
  isDelete?: boolean;
  isActive?: boolean;
  ngayTao?: string;
  ngayCapNhat?: string;
  tenVaccine?: string;
  soLo?: string;
  ngayHetHan?: string;
}

export interface ChiTietThanhLyCreateDto {
  maLo: string;
  soLuong: number;
  lyDo: string;
}

export interface ChiTietThanhLyQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  maPhieuThanhLy?: string;
  maLo?: string;
}

export interface VaccineExpiringSoonDto {
  maTonKho: string;
  maLo: string;
  soLo?: string;
  tenVaccine?: string;
  ngayHetHan?: string;
  soLuong?: number;
  tenDiaDiem?: string;
  soNgayConLai?: number;
}

// Service methods
export const chiTietThanhLyService = {
  // Lấy danh sách chi tiết thanh lý (có phân trang)
  getAll: (params: ChiTietThanhLyQueryParams = {}) => {
    return apiService.get<{
      totalCount: number;
      page: number;
      pageSize: number;
      totalPages: number;
      data: ChiTietThanhLyDto[];
    }>('/api/chi-tiet-thanh-ly', params);
  },

  // Lấy chi tiết thanh lý theo ID
  getById: (id: string) => {
    return apiService.get<ChiTietThanhLyDto>(`/api/chi-tiet-thanh-ly/${id}`);
  },

  // Tạo chi tiết thanh lý mới
  create: (data: ChiTietThanhLyCreateDto) => {
    return apiService.create<{ maChiTiet: string }>('/api/chi-tiet-thanh-ly', data);
  },

  // Cập nhật chi tiết thanh lý
  update: (id: string, data: ChiTietThanhLyCreateDto) => {
    return apiService.update(`/api/chi-tiet-thanh-ly/${id}`, data);
  },

  // Xóa chi tiết thanh lý (soft delete)
  delete: (id: string) => {
    return apiService.delete(`/api/chi-tiet-thanh-ly/${id}`);
  },

  // Lấy chi tiết thanh lý theo phiếu thanh lý
  getByPhieuThanhLy: (maPhieuThanhLy: string) => {
    return apiService.get<ChiTietThanhLyDto[]>(`/api/chi-tiet-thanh-ly/phieu-thanh-ly/${maPhieuThanhLy}`);
  },

  // Lấy danh sách vaccine sắp hết hạn
  getVaccinesExpiringSoon: (days: number = 30, maDiaDiem?: string) => {
    const params: any = { days };
    if (maDiaDiem) {
      params.maDiaDiem = maDiaDiem;
    }
    return apiService.get<VaccineExpiringSoonDto[]>('/api/chi-tiet-thanh-ly/vaccine-sap-het-han', params);
  }
};

export default chiTietThanhLyService;