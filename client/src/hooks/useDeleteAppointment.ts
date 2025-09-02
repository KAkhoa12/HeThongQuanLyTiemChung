import { useApiWithParams } from './useApi';
import { phieuDangKyLichTiemService } from '../services/phieuDangKyLichTiem.service';

export const useDeleteAppointment = () => {
  return useApiWithParams<boolean, string>(
    async (id) => phieuDangKyLichTiemService.delete(id),
    null
  );
}; 