import { useApiWithParams } from './useApi';
import { phieuDangKyLichTiemService, PhieuDangKyLichTiemResponse } from '../services/phieuDangKyLichTiem.service';

export const useAppointments = () => {
  return useApiWithParams<PhieuDangKyLichTiemResponse, { page: number; pageSize: number }>(
    async (params) => phieuDangKyLichTiemService.getAll(params.page, params.pageSize),
    null
  );
}; 