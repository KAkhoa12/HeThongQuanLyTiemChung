import { useApiWithParams } from './useApi';
import { phieuDangKyLichTiemService, PhieuDangKyLichTiem, CreateAppointmentFromOrderDto } from '../services/phieuDangKyLichTiem.service';

export const useCreateAppointmentFromOrder = () => {
  return useApiWithParams<PhieuDangKyLichTiem, CreateAppointmentFromOrderDto>(
    async (data) => phieuDangKyLichTiemService.createFromOrder(data),
    null
  );
}; 