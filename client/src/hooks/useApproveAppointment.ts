import { useApiWithParams } from './useApi';
import { phieuDangKyLichTiemService, PhieuDangKyLichTiem, ApproveAppointmentDto } from '../services/phieuDangKyLichTiem.service';

export const useApproveAppointment = () => {
  return useApiWithParams<PhieuDangKyLichTiem, { id: string; data: ApproveAppointmentDto }>(
    async ({ id, data }) => phieuDangKyLichTiemService.approve(id, data),
    null
  );
}; 