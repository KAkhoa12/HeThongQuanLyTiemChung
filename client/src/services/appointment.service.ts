import { PagedResultDto } from '../types/common.types';
import apiService from './api.service';

export interface CreateAppointmentFromOrderRequest {
  orderId: string;
  maDiaDiem: string;
  ngayDangKy?: string;
  ghiChu?: string;
}

export interface VaccinationStatus {
  customerId: string;
  completedServices: Array<{
    serviceId: string;
    serviceName: string;
    completedDate: string;
    vaccineCount: number;
  }>;
  inProgressServices: Array<{
    serviceId: string;
    serviceName: string;
    totalDoses: number;
    completedDoses: number;
    nextDoseDate?: string;
  }>;
  availableServices: Array<{
    serviceId: string;
    serviceName: string;
    description?: string;
  }>;
  summary: {
    totalCompleted: number;
    totalInProgress: number;
    totalAvailable: number;
  };
}

export interface VaccinationSchedule {
  serviceName: string;
  totalDoses: number;
  completedDoses: number;
  doses: Array<{
    maKeHoachTiem: string;
    serviceName: string;
    vaccineName: string;
    muiThu: number;
    ngayDuKien: string;
    trangThai: string;
    phieuTiem?: {
      maPhieuTiem: string;
      ngayTiem: string;
      trangThai: string;
      doctorName?: string;
    };
  }>;
}

export interface CreatePhieuTiemFromKeHoachRequest {
  maKeHoachTiem: string;
  maBacSi?: string;
  ngayTiem?: string;
  phanUng?: string;
  moTaPhanUng?: string;
}

export interface ApproveAppointmentRequest {
  status: 'APPROVED' | 'REJECTED';
  reason?: string;
}

export interface AppointmentSchedule {
  phieuDangKy: {
    maPhieuDangKy: string;
    trangThai: string;
    ngayDangKy: string;
    dichVu: string;
  };
  keHoachTiems: Array<{
    maKeHoachTiem: string;
    muiThu: number;
    ngayDuKien: string;
    trangThai: string;
    vaccine: string;
    lichHen?: {
      maLichHen: string;
      ngayHen: string;
      trangThai: string;
    };
  }>;
}

export interface KeHoachTiem {
  maKeHoachTiem: string;
  maNguoiDung: string;
  customerName: string;
  maDichVu: string;
  serviceName: string;
  maDonHang: string;
  maVaccine: string;
  vaccineName: string;
  muiThu: number;
  ngayDuKien: string;
  trangThai: string;
  ngayTao: string;
}

export interface LichHen {
  maLichHen: string;
  maDonHang: string;
  customerName: string;
  maDiaDiem: string;
  locationName: string;
  ngayHen: string;
  trangThai: string;
  ghiChu?: string;
  ngayTao: string;
}

export interface PhieuTiem {
  maPhieuTiem: string;
  maNguoiDung: string;
  customerName: string;
  maBacSi: string;
  doctorName: string;
  maDichVu: string;
  serviceName: string;
  ngayTiem: string;
  trangThai: string;
  phanUng?: string;
  moTaPhanUng?: string;
  chiTietPhieuTiems: Array<{
    maChiTietPhieuTiem: string;
    maVaccine: string;
    vaccineName: string;
    muiTiemThucTe: number;
    thuTu: number;
  }>;
  ngayTao: string;
}

class AppointmentService {
  /**
   * Tạo phiếu đăng ký lịch tiêm từ đơn hàng
   */
  async createFromOrder(request: CreateAppointmentFromOrderRequest): Promise<string[]> {
    return await apiService.create<string[]>('/api/appointments/create-from-order', request);
  }

  /**
   * Duyệt phiếu đăng ký lịch tiêm
   */
  async approveAppointment(id: string, request: ApproveAppointmentRequest): Promise<any> {
    return await apiService.update(`/api/appointments/${id}/approve`, request);
  }

  /**
   * Lấy lịch tiêm của phiếu đăng ký
   */
  async getVaccinationSchedule(id: string): Promise<AppointmentSchedule> {
    return await apiService.get<AppointmentSchedule>(`/api/appointments/${id}/vaccination-schedule`);
  }

  /**
   * Lấy tình trạng tiêm chủng của người dùng
   */
  async getVaccinationStatus(customerId: string): Promise<VaccinationStatus> {
    return await apiService.get<VaccinationStatus>(`/api/appointments/vaccination-status/${customerId}`);
  }

  /**
   * Lấy lịch tiêm chủng chi tiết của người dùng
   */
  async getCustomerVaccinationSchedule(customerId: string): Promise<VaccinationSchedule[]> {
    return await apiService.get<VaccinationSchedule[]>(`/api/appointments/vaccination-schedule/${customerId}`);
  }

  /**
   * Lấy danh sách phiếu đăng ký lịch tiêm
   */
  async getAppointments(params: {
    page?: number;
    pageSize?: number;
    customerId?: string;
    status?: string;
  }): Promise<PagedResultDto<any>> {
    return await apiService.get<PagedResultDto<any>>('/api/appointments', params);
  }

  /**
   * Lấy thông tin phiếu đăng ký theo ID
   */
  async getAppointmentById(id: string): Promise<any> {
    return await apiService.get<any>(`/api/appointments/${id}`);
  }
}

class KeHoachTiemService {
  /**
   * Lấy danh sách kế hoạch tiêm
   */
  async getKeHoachTiems(params: {
    page?: number;
    pageSize?: number;
    customerId?: string;
    orderId?: string;
    status?: string;
  }): Promise<PagedResultDto<KeHoachTiem>> {
    return await apiService.get<PagedResultDto<KeHoachTiem>>('/api/ke-hoach-tiem', params);
  }

  /**
   * Lấy kế hoạch tiêm theo ID
   */
  async getKeHoachTiemById(id: string): Promise<KeHoachTiem> {
    return await apiService.get<KeHoachTiem>(`/api/ke-hoach-tiem/${id}`);
  }

  /**
   * Cập nhật trạng thái kế hoạch tiêm
   */
  async updateStatus(id: string, status: string, note?: string): Promise<void> {
    return await apiService.update(`/api/ke-hoach-tiem/${id}/status`, { status, note });
  }

  /**
   * Lấy kế hoạch tiêm theo đơn hàng
   */
  async getByOrder(orderId: string): Promise<KeHoachTiem[]> {
    return await apiService.get<KeHoachTiem[]>(`/api/ke-hoach-tiem/by-order/${orderId}`);
  }

  /**
   * Lấy kế hoạch tiêm theo khách hàng
   */
  async getByCustomer(customerId: string): Promise<KeHoachTiem[]> {
    return await apiService.get<KeHoachTiem[]>(`/api/ke-hoach-tiem/by-customer/${customerId}`);
  }
}

class LichHenService {
  /**
   * Lấy danh sách lịch hẹn
   */
  async getLichHens(params: {
    page?: number;
    pageSize?: number;
    orderId?: string;
    locationId?: string;
    status?: string;
    fromDate?: string;
    toDate?: string;
  }): Promise<PagedResultDto<LichHen>> {
    return await apiService.get<PagedResultDto<LichHen>>('/api/lich-hen', params);
  }

  /**
   * Lấy lịch hẹn theo ID
   */
  async getLichHenById(id: string): Promise<LichHen> {
    return await apiService.get<LichHen>(`/api/lich-hen/${id}`);
  }

  /**
   * Cập nhật trạng thái lịch hẹn
   */
  async updateStatus(id: string, status: string, note?: string): Promise<void> {
    return await apiService.update(`/api/lich-hen/${id}/status`, { status, note });
  }

  /**
   * Lấy lịch hẹn theo đơn hàng
   */
  async getByOrder(orderId: string): Promise<LichHen[]> {
    return await apiService.get<LichHen[]>(`/api/lich-hen/by-order/${orderId}`);
  }

  /**
   * Lấy lịch hẹn theo địa điểm và ngày
   */
  async getByLocationAndDate(locationId: string, date: string): Promise<LichHen[]> {
    return await apiService.get<LichHen[]>(`/api/lich-hen/by-location-date?locationId=${locationId}&date=${date}`);
  }

  /**
   * Tạo lịch hẹn mới
   */
  async createLichHen(request: {
    orderId: string;
    locationId: string;
    appointmentDate: string;
    note?: string;
  }): Promise<string> {
    return await apiService.create<string>('/api/lich-hen', request);
  }

  /**
   * Xóa lịch hẹn
   */
  async deleteLichHen(id: string): Promise<void> {
    return await apiService.delete(`/api/lich-hen/${id}`);
  }
}

class PhieuTiemService {
  /**
   * Lấy danh sách phiếu tiêm
   */
  async getPhieuTiems(params: {
    page?: number;
    pageSize?: number;
    customerId?: string;
    doctorId?: string;
    status?: string;
  }): Promise<PagedResultDto<PhieuTiem>> {
    return await apiService.get<PagedResultDto<PhieuTiem>>('/api/phieu-tiem', params);
  }

  /**
   * Lấy phiếu tiêm theo ID
   */
  async getPhieuTiemById(id: string): Promise<PhieuTiem> {
    return await apiService.get<PhieuTiem>(`/api/phieu-tiem/${id}`);
  }

  /**
   * Tạo phiếu tiêm mới
   */
  async createPhieuTiem(request: {
    ngayTiem?: string;
    maBacSi?: string;
    maDichVu?: string;
    maNguoiDung?: string;
    maKeHoachTiem?: string;
    trangThai?: string;
    phanUng?: string;
    moTaPhanUng?: string;
    chiTietPhieuTiems: Array<{
      maVaccine: string;
      muiTiemThucTe: number;
      thuTu: number;
    }>;
  }): Promise<string> {
    return await apiService.create<string>('/api/phieu-tiem', request);
  }

  /**
   * Cập nhật phiếu tiêm
   */
  async updatePhieuTiem(id: string, request: {
    ngayTiem?: string;
    maBacSi?: string;
    trangThai?: string;
    phanUng?: string;
    moTaPhanUng?: string;
  }): Promise<void> {
    return await apiService.update(`/api/phieu-tiem/${id}`, request);
  }

  /**
   * Lấy phiếu tiêm theo khách hàng
   */
  async getByCustomer(customerId: string): Promise<PhieuTiem[]> {
    return await apiService.get<PhieuTiem[]>(`/api/phieu-tiem/by-customer/${customerId}`);
  }

  /**
   * Lấy phiếu tiêm theo bác sĩ
   */
  async getByDoctor(doctorId: string): Promise<PhieuTiem[]> {
    return await apiService.get<PhieuTiem[]>(`/api/phieu-tiem/by-doctor/${doctorId}`);
  }

  /**
   * Tạo phiếu tiêm từ kế hoạch tiêm
   */
  async createFromKeHoach(request: CreatePhieuTiemFromKeHoachRequest): Promise<string> {
    return await apiService.create<string>('/api/phieu-tiem/create-from-ke-hoach', request);
  }

  /**
   * Lấy danh sách kế hoạch tiêm sẵn sàng cho tiêm
   */
  async getReadyToVaccinate(customerId: string): Promise<any[]> {
    return await apiService.get<any[]>(`/api/phieu-tiem/ready-to-vaccinate/${customerId}`);
  }
}

// Export services
export const appointmentService = new AppointmentService();
export const keHoachTiemService = new KeHoachTiemService();
export const lichHenService = new LichHenService();
export const phieuTiemService = new PhieuTiemService();

export default appointmentService;