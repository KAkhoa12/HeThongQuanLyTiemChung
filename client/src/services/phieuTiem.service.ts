import apiService from './api.service';

export interface ChiTietPhieuTiemDto {
  maChiTietPhieuTiem: string;
  maPhieuTiem: string;
  maVaccine: string;
  muiTiemThucTe: number;
  thuTu: number;
  isDelete?: boolean;
  isActive?: boolean;
  ngayTao?: string;
  ngayCapNhat?: string;
  tenVaccine?: string;
  nhaSanXuat?: string;
}

export interface PhieuTiem {
  maPhieuTiem: string;
  ngayTiem?: string;
  maBacSi?: string;
  maDichVu?: string;
  maNguoiDung?: string;
  trangThai?: string;
  phanUng?: string;
  moTaPhanUng?: string;
  isActive?: boolean;
  isDelete?: boolean;
  ngayTao?: string;
  ngayCapNhat?: string;
  tenBacSi?: string;
  tenDichVu?: string;
  tenNguoiDung?: string;
  chiTietPhieuTiems: ChiTietPhieuTiemDto[];
}

export interface ChiTietPhieuTiemCreateDto {
  maPhieuTiem: string;
  maVaccine: string;
  muiTiemThucTe: number;
  thuTu: number;
}

export interface PhieuTiemCreateDto {
  ngayTiem: string;
  maBacSi?: string;
  maDichVu: string;
  maNguoiDung: string;
  trangThai: string;
  phanUng?: string;
  moTaPhanUng?: string;
  chiTietPhieuTiems: ChiTietPhieuTiemCreateDto[];
}

export interface PhieuTiemUpdateDto {
  ngayTiem?: string;
  maBacSi?: string;
  maDichVu?: string;
  trangThai?: string;
  phanUng?: string;
  moTaPhanUng?: string;
  isActive?: boolean;
}

export interface PhieuTiemResponse {
  data: PhieuTiem[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

const phieuTiemService = {
  // Lấy tất cả phiếu tiêm với phân trang
  getAll: (page?: number, pageSize?: number): Promise<PhieuTiemResponse> => {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (pageSize) params.append('pageSize', pageSize.toString());
    
    return apiService.get<PhieuTiemResponse>(`/api/phieu-tiem?${params.toString()}`);
  },

  // Lấy phiếu tiêm theo ID
  getById: (id: string): Promise<PhieuTiem> => {
    return apiService.get<PhieuTiem>(`/api/phieu-tiem/${id}`);
  },

  // Lấy phiếu tiêm theo người dùng
  getByUser: (maNguoiDung: string, page?: number, pageSize?: number): Promise<PhieuTiemResponse> => {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (pageSize) params.append('pageSize', pageSize.toString());
    
    return apiService.get<PhieuTiemResponse>(`/api/phieu-tiem/by-user/${maNguoiDung}?${params.toString()}`);
  },

  // Lấy danh sách đợt tiêm sắp tới
  getUpcomingVaccinations: (page?: number, pageSize?: number): Promise<PhieuTiemResponse> => {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (pageSize) params.append('pageSize', pageSize.toString());
    
    return apiService.get<PhieuTiemResponse>(`/api/phieu-tiem/upcoming?${params.toString()}`);
  },

  // Tạo phiếu tiêm mới
  create: (data: PhieuTiemCreateDto): Promise<string> => {
    return apiService.create<string>('/api/phieu-tiem', data);
  },

  // Cập nhật phiếu tiêm
  update: (id: string, data: PhieuTiemUpdateDto): Promise<void> => {
    return apiService.update<void>(`/api/phieu-tiem/${id}`, data);
  },

  // Xóa phiếu tiêm
  delete: (id: string): Promise<void> => {
    return apiService.delete<void>(`/api/phieu-tiem/${id}`);
  }
};

export default phieuTiemService; 