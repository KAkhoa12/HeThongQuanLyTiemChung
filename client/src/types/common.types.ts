// Common types used across the application

export interface PagedResultDto<T> {
  data: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiResponse<T = any> {
  code: number;
  message: string;
  payload: T;
  status: string;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface BaseEntity {
  id: string;
  isActive?: boolean;
  isDelete?: boolean;
  ngayTao?: string;
  ngayCapNhat?: string;
}

export interface User {
  maNguoiDung: string;
  ten: string;
  email: string;
  soDienThoai?: string;
  ngaySinh?: string;
  maVaiTro: string;
}

export interface Location {
  maDiaDiem: string;
  ten: string;
  diaChi: string;
  soDienThoai?: string;
  email?: string;
}

export interface Service {
  maDichVu: string;
  ten: string;
  moTa?: string;
  gia: number;
  isActive: boolean;
}

export interface Vaccine {
  maVaccine: string;
  ten: string;
  moTa?: string;
  nhaSanXuat?: string;
  isActive: boolean;
}

export interface Doctor {
  maBacSi: string;
  maNguoiDung: string;
  chuyenMon?: string;
  soGiayPhep?: string;
  isActive: boolean;
}

export interface Order {
  maDonHang: string;
  maNguoiDung: string;
  tongTien: number;
  trangThai: string;
  ngayTao: string;
}

export interface OrderDetail {
  maDonHangChiTiet: string;
  maDonHang: string;
  maDichVu: string;
  soLuong: number;
  gia: number;
  thanhTien: number;
}

// Status enums
export enum AppointmentStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  SCHEDULED = 'SCHEDULED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  MISSED = 'MISSED'
}

export enum VaccinationStatus {
  PENDING = 'PENDING',
  SCHEDULED = 'SCHEDULED',
  COMPLETED = 'COMPLETED',
  MISSED = 'MISSED',
  CANCELLED = 'CANCELLED'
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}