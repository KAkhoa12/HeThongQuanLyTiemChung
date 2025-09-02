import { useApiWithParams } from './useApi';
import phieuTiemService, { PhieuTiemCreateDto, PhieuTiemUpdateDto, PhieuTiemResponse } from '../services/phieuTiem.service';

// Hook lấy tất cả phiếu tiêm
export const usePhieuTiems = () => {
  return useApiWithParams<PhieuTiemResponse, { page: number; pageSize: number }>(
    async (params) => phieuTiemService.getAll(params.page, params.pageSize),
    null
  );
};

// Hook lấy phiếu tiêm theo người dùng
export const usePhieuTiemByUser = () => {
  return useApiWithParams<PhieuTiemResponse, { maNguoiDung: string; page: number; pageSize: number }>(
    async (params) => phieuTiemService.getByUser(params.maNguoiDung, params.page, params.pageSize),
    null
  );
};

// Hook tạo phiếu tiêm mới
export const useCreatePhieuTiem = () => {
  return useApiWithParams<string, PhieuTiemCreateDto>(
    async (data) => phieuTiemService.create(data),
    null
  );
};

// Hook cập nhật phiếu tiêm
export const useUpdatePhieuTiem = () => {
  return useApiWithParams<void, { id: string; data: PhieuTiemUpdateDto }>(
    async (params) => phieuTiemService.update(params.id, params.data),
    null
  );
};

// Hook xóa phiếu tiêm
export const useDeletePhieuTiem = () => {
  return useApiWithParams<void, string>(
    async (id) => phieuTiemService.delete(id),
    null
  );
}; 