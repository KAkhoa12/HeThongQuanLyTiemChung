import apiService from './api.service';

export interface PhieuDangKyLichTiem {
  maPhieuDangKy: string;
  maKhachHang: string;
  maDichVu: string;
  ngayDangKy: string;
  trangThai: string;
  lyDoTuChoi?: string;
  ghiChu?: string;
  isDelete?: boolean;
  isActive?: boolean;
  ngayTao?: string;
  ngayCapNhat?: string;
  tenKhachHang?: string;
  soDienThoaiKhachHang?: string;
  emailKhachHang?: string;
  tenDichVu?: string;
  maDonHangDisplay?: string;
}

export interface CreatePhieuDangKyLichTiemDto {
  maKhachHang: string;
  maDichVu: string;
  ghiChu?: string;
}

export interface CreateAppointmentFromOrderDto {
  orderId: string;
  ghiChu?: string;
}

// Helper type for DateOnly
export type DateOnly = string;

export interface UpdatePhieuDangKyLichTiemDto {
  ghiChu?: string;
}

export interface ApproveAppointmentDto {
  status: string; // "Approved" hoặc "Rejected"
  reason?: string; // Lý do từ chối nếu có
}

export interface PhieuDangKyLichTiemResponse {
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  data: PhieuDangKyLichTiem[];
}

// Service functions
export const phieuDangKyLichTiemService = {
  // Lấy danh sách phiếu đăng ký (có phân trang)
  getAll: async (page: number = 1, pageSize: number = 20) => {
    return await apiService.get<PhieuDangKyLichTiemResponse>('/api/appointments', { page, pageSize });
  },

  // Lấy thông tin phiếu đăng ký theo ID
  getById: async (id: string) => {
    return await apiService.get<PhieuDangKyLichTiem>(`/api/appointments/${id}`);
  },

  // Tạo phiếu đăng ký từ đơn hàng
  createFromOrder: (data: CreateAppointmentFromOrderDto): Promise<string[]> => {
    return apiService.create<string[]>('/api/appointments/create-from-order', data);
  },

  // Tạo phiếu đăng ký lịch tiêm thông thường
  create: async (data: CreatePhieuDangKyLichTiemDto) => {
    return await apiService.create<PhieuDangKyLichTiem>('/api/appointments', data);
  },

  // Cập nhật phiếu đăng ký
  update: async (id: string, data: UpdatePhieuDangKyLichTiemDto) => {
    return await apiService.update<PhieuDangKyLichTiem>(`/api/appointments/${id}`, data);
  },

  // Duyệt phiếu đăng ký
  approve: async (id: string, data: ApproveAppointmentDto) => {
    return await apiService.update<PhieuDangKyLichTiem>(`/api/appointments/${id}/approve`, data);
  },

  // Xóa phiếu đăng ký
  delete: async (id: string) => {
    return await apiService.delete<boolean>(`/api/appointments/${id}`);
  },

  // Lấy phiếu đăng ký theo khách hàng
  getByCustomer: async (customerId: string) => {
    return await apiService.get<PhieuDangKyLichTiem[]>(`/api/appointments/by-customer/${customerId}`);
  },

  // Lấy tất cả phiếu đăng ký tiêm chủng theo maNguoiDung (có phân trang)
  getAllByUser: async (maNguoiDung: string, page: number = 1, pageSize: number = 20) => {
    return await apiService.get<PhieuDangKyLichTiemResponse>(`/api/appointments/by-user/${maNguoiDung}`, { page, pageSize });
  }
}; 