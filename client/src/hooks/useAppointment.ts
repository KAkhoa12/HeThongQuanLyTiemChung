import { useApiWithParams } from './useApi';
import { phieuDangKyLichTiemService, PhieuDangKyLichTiem } from '../services/phieuDangKyLichTiem.service';

export const useAppointment = (id: string | null) => {
  return useApiWithParams<PhieuDangKyLichTiem, string>(
    async (id) => phieuDangKyLichTiemService.getById(id),
    null
  );
}; 