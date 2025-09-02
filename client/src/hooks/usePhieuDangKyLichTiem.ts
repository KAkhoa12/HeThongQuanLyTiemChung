import { useApiWithParams } from './useApi';
import { phieuDangKyLichTiemService, PhieuDangKyLichTiem, CreatePhieuDangKyLichTiemDto, CreateAppointmentFromOrderDto, UpdatePhieuDangKyLichTiemDto, ApproveAppointmentDto, PhieuDangKyLichTiemResponse } from '../services/phieuDangKyLichTiem.service';

// Hook để lấy danh sách phiếu đăng ký (có phân trang)
export const usePhieuDangKyLichTiems = () => {
  return useApiWithParams<PhieuDangKyLichTiemResponse, { page: number; pageSize: number }>(
    async (params) => phieuDangKyLichTiemService.getAll(params.page, params.pageSize),
    null
  );
};

// Hook để lấy thông tin phiếu đăng ký theo ID
export const usePhieuDangKyLichTiem = (id: string | null) => {
  return useApiWithParams<PhieuDangKyLichTiem, string>(
    async (id) => phieuDangKyLichTiemService.getById(id),
    null
  );
};

// Hook để lấy phiếu đăng ký theo khách hàng
export const usePhieuDangKyLichTiemByCustomer = (customerId: string | null) => {
  return useApiWithParams<PhieuDangKyLichTiem[], string>(
    async (customerId) => phieuDangKyLichTiemService.getByCustomer(customerId),
    null
  );
};

// Hook để lấy tất cả phiếu đăng ký tiêm chủng theo maNguoiDung (có phân trang)
export const usePhieuDangKyLichTiemByUser = () => {
  return useApiWithParams<PhieuDangKyLichTiemResponse, { maNguoiDung: string; page: number; pageSize: number }>(
    async (params) => phieuDangKyLichTiemService.getAllByUser(params.maNguoiDung, params.page, params.pageSize),
    null
  );
};

// Hook để tạo phiếu đăng ký từ đơn hàng
export const useCreatePhieuDangKyLichTiemFromOrder = () => {
  return useApiWithParams<PhieuDangKyLichTiem, CreateAppointmentFromOrderDto>(
    async (data) => phieuDangKyLichTiemService.createFromOrder(data),
    null
  );
};

// Hook để tạo phiếu đăng ký thông thường
export const useCreatePhieuDangKyLichTiem = () => {
  return useApiWithParams<PhieuDangKyLichTiem, CreatePhieuDangKyLichTiemDto>(
    async (data) => phieuDangKyLichTiemService.create(data),
    null
  );
};

// Hook để cập nhật phiếu đăng ký
export const useUpdatePhieuDangKyLichTiem = () => {
  return useApiWithParams<PhieuDangKyLichTiem, { id: string; data: UpdatePhieuDangKyLichTiemDto }>(
    async ({ id, data }) => phieuDangKyLichTiemService.update(id, data),
    null
  );
};

// Hook để duyệt phiếu đăng ký
export const useApprovePhieuDangKyLichTiem = () => {
  return useApiWithParams<PhieuDangKyLichTiem, { id: string; data: ApproveAppointmentDto }>(
    async ({ id, data }) => phieuDangKyLichTiemService.approve(id, data),
    null
  );
};

// Hook để xóa phiếu đăng ký
export const useDeletePhieuDangKyLichTiem = () => {
  return useApiWithParams<boolean, string>(
    async (id) => phieuDangKyLichTiemService.delete(id),
    null
  );
}; 