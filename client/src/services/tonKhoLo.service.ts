import apiService from './api.service';

// DTOs
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

export interface TonKhoLoCreateDto {
  maDiaDiem: string;
  maLo: string;
  soLuong: number;
}

export interface TonKhoLoUpdateDto {
  soLuong?: number;
  maDiaDiem?: string;
  maLo?: string;
}

export interface TonKhoSummaryDto {
  maDiaDiem: string;
  tenDiaDiem: string;
  tongSoLo: number;
  tongSoLuong: number;
  tongGiaTri: number;
}

export interface TonKhoLoQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  maDiaDiem?: string;
  maLo?: string;
}

// Service methods
export const tonKhoLoService = {
  // Lấy danh sách tồn kho lô (có phân trang)
  getAll: (params: TonKhoLoQueryParams = {}) => {
    return apiService.get<{
      totalCount: number;
      page: number;
      pageSize: number;
      totalPages: number;
      data: TonKhoLoDto[];
    }>('/api/ton-kho-lo', params);
  },

  // Lấy chi tiết tồn kho lô theo ID
  getById: (id: string) => {
    return apiService.get<TonKhoLoDto>(`/api/ton-kho-lo/${id}`);
  },

  // Tạo tồn kho lô mới
  create: (data: TonKhoLoCreateDto) => {
    return apiService.create<{ maTonKho: string }>('/api/ton-kho-lo', data);
  },

  // Cập nhật tồn kho lô
  update: (id: string, data: TonKhoLoUpdateDto) => {
    return apiService.update(`/api/ton-kho-lo/${id}`, data);
  },

  // Xóa tồn kho lô (soft delete)
  delete: (id: string) => {
    return apiService.delete(`/api/ton-kho-lo/${id}`);
  },

  // Lấy tồn kho theo địa điểm
  getByDiaDiem: (diaDiemId: string) => {
    return apiService.get<TonKhoLoDto[]>(`/api/ton-kho-lo/by-dia-diem/${diaDiemId}`);
  },

  // Lấy tồn kho theo lô vaccine
  getByLo: (loId: string) => {
    return apiService.get<TonKhoLoDto[]>(`/api/ton-kho-lo/by-lo/${loId}`);
  },

  // Lấy tổng quan tồn kho
  getSummary: () => {
    return apiService.get<TonKhoSummaryDto[]>('/api/ton-kho-lo/summary');
  },

  // Cập nhật số lượng tồn kho (dùng cho nhập/xuất)
  updateQuantity: (data: TonKhoLoUpdateDto) => {
    return apiService.create('/api/ton-kho-lo/update-quantity', data);
  }
};

export default tonKhoLoService; 