import { useApiWithParams } from './useApi';
import { phieuDangKyLichTiemService, PhieuDangKyLichTiem, UpdatePhieuDangKyLichTiemDto } from '../services/phieuDangKyLichTiem.service';

export const useUpdateAppointment = () => {
  return useApiWithParams<PhieuDangKyLichTiem, { id: string; data: UpdatePhieuDangKyLichTiemDto }>(
    async ({ id, data }) => phieuDangKyLichTiemService.update(id, data),
    null
  );
}; 