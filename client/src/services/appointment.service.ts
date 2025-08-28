import apiService from './api.service';

// Interfaces
export interface AppointmentVM {
  maPhieuDangKy: string;
  maKhachHang: string;
  maDichVu: string;
  maBacSi: string;
  ngayDangKy: string;
  ngayHenTiem: string;
  gioHenTiem: string;
  trangThai: string;
  lyDoTuChoi?: string;
  ghiChu?: string;
  isDelete: boolean;
  isActive: boolean;
  ngayTao: string;
  ngayCapNhat: string;
  tenKhachHang: string;
  soDienThoaiKhachHang: string;
  emailKhachHang: string;
  tenDichVu: string;
  tenBacSi: string;
}

export interface AvailableSlot {
  maLichLamViec: string;
  ngayLam: string;
  gioBatDau: string;
  gioKetThuc: string;
  soLuongCho: number;
  availableSlots: number;
  trangThai: string;
}

export interface CreateAppointmentFromOrderDto {
  orderId: string;
  doctorId: string;
  scheduleId: string;
  appointmentDate: string; // DateOnly format: "YYYY-MM-DD"
  appointmentTime: string; // TimeOnly format: "HH:mm"
  ghiChu?: string;
}

export interface CreateAppointmentDto {
  maKhachHang: string;
  maDichVu: string;
  maBacSi: string;
  ngayHenTiem: string;
  gioHenTiem: string;
  ghiChu?: string;
}

export interface UpdateAppointmentDto {
  ngayHenTiem?: string;
  gioHenTiem?: string;
  ghiChu?: string;
}

export interface ApproveAppointmentDto {
  status: string; // "Chấp nhận" hoặc "Từ chối"
  reason?: string; // Lý do từ chối nếu có
}

export interface AppointmentListParams {
  page?: number;
  pageSize?: number;
}

export interface AppointmentListResponse {
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  data: AppointmentVM[];
}

// API Functions
export const getAllAppointments = async (params?: AppointmentListParams): Promise<AppointmentListResponse> => {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());
  
  const url = `/api/appointments${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  return await apiService.get<AppointmentListResponse>(url);
};

export const getAvailableSlots = async (
  doctorId: string,
  locationId: string,
  fromDate?: string,
  toDate?: string
): Promise<AvailableSlot[]> => {
  const queryParams = new URLSearchParams();
  queryParams.append('doctorId', doctorId);
  queryParams.append('locationId', locationId);
  if (fromDate) queryParams.append('fromDate', fromDate);
  if (toDate) queryParams.append('toDate', toDate);
  
  return await apiService.get<AvailableSlot[]>(`/api/appointments/available-slots?${queryParams.toString()}`);
};

export const getAppointmentById = async (id: string): Promise<AppointmentVM> => {
  return await apiService.get<AppointmentVM>(`/api/appointments/${id}`);
};

export const createAppointmentFromOrder = async (data: CreateAppointmentFromOrderDto): Promise<AppointmentVM> => {
  return await apiService.create<AppointmentVM>('/api/appointments/from-order', data);
};

export const createAppointment = async (data: CreateAppointmentDto): Promise<AppointmentVM> => {
  return await apiService.create<AppointmentVM>('/api/appointments', data);
};

export const updateAppointment = async (id: string, data: UpdateAppointmentDto): Promise<AppointmentVM> => {
  return await apiService.update<AppointmentVM>(`/api/appointments/${id}`, data);
};

export const approveAppointment = async (id: string, data: ApproveAppointmentDto): Promise<AppointmentVM> => {
  return await apiService.update<AppointmentVM>(`/api/appointments/${id}/approve`, data);
};

export const deleteAppointment = async (id: string): Promise<boolean> => {
  return await apiService.delete<boolean>(`/api/appointments/${id}`);
};

export const getAppointmentsByCustomer = async (customerId: string): Promise<AppointmentVM[]> => {
  return await apiService.get<AppointmentVM[]>(`/api/appointments/by-customer/${customerId}`);
};

export const getAppointmentsByDoctor = async (doctorId: string): Promise<AppointmentVM[]> => {
  return await apiService.get<AppointmentVM[]>(`/api/appointments/by-doctor/${doctorId}`);
}; 