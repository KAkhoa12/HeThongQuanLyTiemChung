import apiService from './api.service';

// DTOs
export interface LoVaccineDto {
  maLo: string;
  maVaccine: string;
  maNhaCungCap: string;
  soLo?: string;
  ngaySanXuat?: string;
  ngayHetHan?: string;
  soLuongNhap?: number;
  soLuongHienTai?: number;
  giaNhap?: number;
  ngayTao?: string;
  ngayCapNhat?: string;
  tenVaccine?: string;
  tenNhaCungCap?: string;
}

export interface LoVaccineDetailDto {
  maLo: string;
  maVaccine: string;
  maNhaCungCap: string;
  soLo?: string;
  ngaySanXuat?: string;
  ngayHetHan?: string;
  soLuongNhap?: number;
  soLuongHienTai?: number;
  giaNhap?: number;
  ngayTao?: string;
  ngayCapNhat?: string;
  tenVaccine?: string;
  tenNhaCungCap?: string;
  tonKhoLos?: TonKhoLoDto[];
}

export interface TonKhoLoDto {
  maTonKho: string;
  maDiaDiem?: string;
  maLo?: string;
  soLuong?: number;
  ngayTao?: string;
  ngayCapNhat?: string;
  tenDiaDiem?: string;
  soLo?: string;
  tenVaccine?: string;
}

export interface LoVaccineCreateDto {
  maVaccine: string;
  maNhaCungCap: string;
  soLo?: string;
  ngaySanXuat?: string;
  ngayHetHan?: string;
  soLuongNhap: number;
  giaNhap: number;
}

export interface LoVaccineUpdateDto {
  soLo?: string;
  ngaySanXuat?: string;
  ngayHetHan?: string;
  soLuongHienTai?: number;
  giaNhap?: number;
}

export interface LoVaccineQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  maVaccine?: string;
  maNhaCungCap?: string;
}

// Service methods
export const loVaccineService = {
  // Lấy danh sách lô vaccine (có phân trang)
  getAll: (params: LoVaccineQueryParams = {}) => {
    return apiService.get<{
      totalCount: number;
      page: number;
      pageSize: number;
      totalPages: number;
      data: LoVaccineDto[];
    }>('/api/lo-vaccine', params);
  },

  // Lấy chi tiết lô vaccine theo ID
  getById: (id: string) => {
    return apiService.get<LoVaccineDetailDto>(`/api/lo-vaccine/${id}`);
  },

  // Tạo lô vaccine mới
  create: (data: LoVaccineCreateDto) => {
    return apiService.create<{ maLo: string }>('/api/lo-vaccine', data);
  },

  // Cập nhật lô vaccine
  update: (id: string, data: LoVaccineUpdateDto) => {
    return apiService.update(`/api/lo-vaccine/${id}`, data);
  },

  // Xóa lô vaccine (soft delete)
  delete: (id: string) => {
    return apiService.delete(`/api/lo-vaccine/${id}`);
  },

  // Lấy danh sách lô vaccine theo vaccine
  getByVaccine: (vaccineId: string) => {
    return apiService.get<LoVaccineDto[]>(`/api/lo-vaccine/by-vaccine/${vaccineId}`);
  },

  // Lấy danh sách lô vaccine sắp hết hạn
  getExpiringSoon: (days: number = 30) => {
    return apiService.get<LoVaccineDto[]>('/api/lo-vaccine/expiring-soon', { days });
  }
};

export default loVaccineService; 