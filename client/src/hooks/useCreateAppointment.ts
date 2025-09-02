import { useApiWithParams } from './useApi';
import { phieuDangKyLichTiemService, PhieuDangKyLichTiem, CreatePhieuDangKyLichTiemDto } from '../services/phieuDangKyLichTiem.service';

export const useCreateAppointment = () => {
  return useApiWithParams<PhieuDangKyLichTiem, CreatePhieuDangKyLichTiemDto>(
    async (data) => phieuDangKyLichTiemService.create(data),
    null
  );
}; 