import { useApiWithParams } from './useApi';
import { phieuDangKyLichTiemService, PhieuDangKyLichTiem } from '../services/phieuDangKyLichTiem.service';

export const useAppointmentsByCustomer = (customerId: string | null) => {
  return useApiWithParams<PhieuDangKyLichTiem[], string>(
    async (customerId) => phieuDangKyLichTiemService.getByCustomer(customerId),
    null
  );
}; 