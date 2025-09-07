import apiService from './api.service';

// DTOs
export interface NhaCungCapDto {
  maNhaCungCap: string;
  ten: string;
  nguoiLienHe?: string;
  soDienThoai?: string;
  diaChi?: string;
  maAnh?: string;
  isDelete?: boolean;
  isActive?: boolean;
  ngayTao?: string;
  ngayCapNhat?: string;
  tenAnh?: string;
  urlAnh?: string;
}

export interface NhaCungCapDetailDto {
  maNhaCungCap: string;
  ten: string;
  nguoiLienHe?: string;
  soDienThoai?: string;
  diaChi?: string;
  maAnh?: string;
  isDelete?: boolean;
  isActive?: boolean;
  ngayTao?: string;
  ngayCapNhat?: string;
  tenAnh?: string;
  urlAnh?: string;
  anhNhaCungCaps?: AnhNhaCungCapDto[];
}

export interface AnhNhaCungCapDto {
  maAnhNhaCungCap: string;
  maNhaCungCap: string;
  maAnh: string;
  thuTuHienThi?: number;
  isDelete?: boolean;
  isActive?: boolean;
  ngayTao?: string;
  ngayCapNhat?: string;
  tenAnh?: string;
  urlAnh?: string;
}

export interface NhaCungCapCreateDto {
  ten: string;
  nguoiLienHe?: string;
  soDienThoai?: string;
  diaChi?: string;
  maAnh?: string;
}

export interface NhaCungCapUpdateDto {
  ten?: string;
  nguoiLienHe?: string;
  soDienThoai?: string;
  diaChi?: string;
  maAnh?: string;
}

export interface AnhNhaCungCapCreateDto {
  maNhaCungCap: string;
  maAnh: string;
  thuTuHienThi?: number;
}

export interface AnhNhaCungCapUpdateDto {
  maAnh?: string;
  thuTuHienThi?: number;
}

export interface NhaCungCapQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
}

// Service methods
export const nhaCungCapService = {
  // Lấy danh sách nhà cung cấp (có phân trang)
  getAll: (params: NhaCungCapQueryParams = {}) => {
    return apiService.get<{
      totalCount: number;
      page: number;
      pageSize: number;
      totalPages: number;
      data: NhaCungCapDto[];
    }>('/api/nha-cung-cap', params);
  },

  // Lấy chi tiết nhà cung cấp theo ID
  getById: (id: string) => {
    return apiService.get<NhaCungCapDetailDto>(`/api/nha-cung-cap/${id}`);
  },

  // Tạo nhà cung cấp mới
  create: (data: NhaCungCapCreateDto) => {
    return apiService.create<{ maNhaCungCap: string }>('/api/nha-cung-cap', data);
  },

  // Cập nhật nhà cung cấp
  update: (id: string, data: NhaCungCapUpdateDto) => {
    return apiService.update(`/api/nha-cung-cap/${id}`, data);
  },

  // Xóa nhà cung cấp (soft delete)
  delete: (id: string) => {
    return apiService.delete(`/api/nha-cung-cap/${id}`);
  },

  // Thêm ảnh cho nhà cung cấp
  addImage: (id: string, data: AnhNhaCungCapCreateDto) => {
    return apiService.create<{ maAnhNhaCungCap: string }>(`/api/nha-cung-cap/${id}/images`, data);
  },

  // Cập nhật ảnh nhà cung cấp
  updateImage: (id: string, imageId: string, data: AnhNhaCungCapUpdateDto) => {
    return apiService.update(`/api/nha-cung-cap/${id}/images/${imageId}`, data);
  },

  // Xóa ảnh nhà cung cấp
  deleteImage: (id: string, imageId: string) => {
    return apiService.delete(`/api/nha-cung-cap/${id}/images/${imageId}`);
  }
};

export default nhaCungCapService;