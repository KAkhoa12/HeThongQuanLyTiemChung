import apiService from './api.service';

export interface VaccineDto {
  maVaccine: string;
  ten: string;
  nhaSanXuat?: string;
  tuoiBatDauTiem?: number;
  tuoiKetThucTiem?: number;
  huongDanSuDung?: string;
  phongNgua?: string;
  isActive: boolean;
  ngayTao?: string;
  ngayCapNhat?: string;
}

export interface VaccineCreateRequest {
  ten: string;
  nhaSanXuat?: string;
  tuoiBatDauTiem?: number;
  tuoiKetThucTiem?: number;
  huongDanSuDung?: string;
  phongNgua?: string;
  isActive: boolean;
}

export interface VaccineUpdateRequest {
  ten: string;
  nhaSanXuat?: string;
  tuoiBatDauTiem?: number;
  tuoiKetThucTiem?: number;
  huongDanSuDung?: string;
  phongNgua?: string;
  isActive?: boolean;
}

export interface VaccineStatusRequest {
  isActive: boolean;
}

export interface VaccineUsageDto {
  maVaccine: string;
  ten: string;
  soLuongSuDung: number;
  soLuongLichHen: number;
  soLuongLichTiemChuan: number;
  soLuongLoVaccine: number;
  soLuongDichVu: number;
  soLuongDonHang: number;
}

export interface PagedResultDto<T> {
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  data: T[];
}

export interface ApiResponse<T> {
  status: string;
  code: number;
  message: string;
  payload: T;
}

class VaccineService {
  /**
   * Lấy danh sách vaccine có phân trang
   */
  async getVaccines(params: {
    page?: number;
    pageSize?: number;
    searchTerm?: string;
    manufacturer?: string;
    isActive?: boolean;
  }): Promise<PagedResultDto<VaccineDto>> {
    return await apiService.get<PagedResultDto<VaccineDto>>('/api/Vaccine', params);
  }

  /**
   * Lấy thông tin vaccine theo ID
   */
  async getVaccine(id: string): Promise<VaccineDto> {
    return await apiService.get<VaccineDto>(`/api/Vaccine/${id}`);
  }

  /**
   * Lấy danh sách vaccine hoạt động
   */
  async getActiveVaccines(): Promise<VaccineDto[]> {
    return await apiService.get<VaccineDto[]>('/api/Vaccine/active');
  }

  /**
   * Lấy danh sách nhà sản xuất
   */
  async getManufacturers(): Promise<string[]> {
    return await apiService.get<string[]>('/api/Vaccine/manufacturers');
  }

  /**
   * Tạo vaccine mới
   */
  async createVaccine(data: VaccineCreateRequest): Promise<VaccineDto> {
    return await apiService.create<VaccineDto>('/api/Vaccine', data);
  }

  /**
   * Cập nhật vaccine
   */
  async updateVaccine(id: string, data: VaccineUpdateRequest): Promise<VaccineDto> {
    return await apiService.update<VaccineDto>(`/api/Vaccine/${id}`, data);
  }

  /**
   * Xóa vaccine (soft delete)
   */
  async deleteVaccine(id: string): Promise<void> {
    await apiService.delete(`/api/Vaccine/${id}`);
  }

  /**
   * Cập nhật trạng thái vaccine
   */
  async updateVaccineStatus(id: string, isActive: boolean): Promise<void> {
    await apiService.update(`/api/Vaccine/${id}/status`, { IsActive: isActive });
  }

  /**
   * Lấy thông tin sử dụng vaccine
   */
  async getVaccineUsage(id: string): Promise<VaccineUsageDto> {
    return await apiService.get<VaccineUsageDto>(`/api/Vaccine/${id}/usage`);
  }
}

export default new VaccineService();  