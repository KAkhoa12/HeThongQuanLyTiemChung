// Export tất cả hooks
export { useApi, useApiWithParams } from './useApi';
export { useAuth } from './useAuth';
export { useAuthInit } from './useAuthInit';
export { useService } from './useService';
export { useServiceVaccines } from './useServiceVaccine';
export { useVaccine } from './useVaccine';
export { useToast } from './useToast';
export { default as useColorMode } from './useColorMode';
export { default as useLocalStorage } from './useLocalStorage';
export { useInvoice } from './useInvoice';
export { useOrders, useOrder, useUpdateOrderStatus } from './useOrders';

// Doctor Hooks
export { useDoctors, useAllDoctors, useDoctor } from './useDoctors';

// Location Hooks
export { useLocations, useAllLocations, useLocation } from './useLocations';

// Appointment Hooks
export { useAppointments } from './useAppointments';
export { useAppointment } from './useAppointment';
export { useCreateAppointment } from './useCreateAppointment';
export { useCreateAppointmentFromOrder } from './useCreateAppointmentFromOrder';
export { useUpdateAppointment } from './useUpdateAppointment';
export { useApproveAppointment } from './useApproveAppointment';
export { useDeleteAppointment } from './useDeleteAppointment';
export { useAppointmentsByCustomer } from './useAppointmentsByCustomer';
export { useAppointmentManagement } from './useAppointmentManagement';

// PhieuDangKyLichTiem Hooks
export {
  usePhieuDangKyLichTiems,
  usePhieuDangKyLichTiem,
  usePhieuDangKyLichTiemByCustomer,
  usePhieuDangKyLichTiemByUser,
  useCreatePhieuDangKyLichTiemFromOrder,
  useCreatePhieuDangKyLichTiem,
  useUpdatePhieuDangKyLichTiem,
  useApprovePhieuDangKyLichTiem,
  useDeletePhieuDangKyLichTiem
} from './usePhieuDangKyLichTiem';

// PhieuTiem Hooks
export {
  usePhieuTiems,
  usePhieuTiemByUser,
  useCreatePhieuTiem,
  useUpdatePhieuTiem,
  useDeletePhieuTiem
} from './usePhieuTiem';

// Schedule Hooks
export { 
  useSchedules, 
  useSchedule, 
  useCreateSchedule, 
  useUpdateSchedule, 
  useDeleteSchedule,
  useScheduleAvailability,
  useSchedulesByDoctorAndLocation
} from './useSchedules';

// KhuyenMai Hooks
export {
  useKhuyenMais,
  useKhuyenMai,
  useCreateKhuyenMai,
  useUpdateKhuyenMai,
  useDeleteKhuyenMai,
  useValidateKhuyenMaiCode
} from './useKhuyenMai';

// LoaiKhuyenMai Hooks
export {
  useLoaiKhuyenMais,
  useLoaiKhuyenMaisActive,
  useLoaiKhuyenMai,
  useCreateLoaiKhuyenMai,
  useUpdateLoaiKhuyenMai,
  useDeleteLoaiKhuyenMai,
  useKhuyenMaisByLoai
} from './useLoaiKhuyenMai';

// Quyen Hooks
export {
  useQuyens,
  useQuyen,
  useModules
} from './useQuyen';

// VaiTroQuyen Hooks
export {
  useVaiTroQuyens,
  useQuyensByVaiTro,
  useCheckVaiTroQuyen
} from './useVaiTroQuyen';

// NguoiDungQuyen Hooks
export {
  useNguoiDungQuyens,
  useQuyensByNguoiDung,
  useAllQuyensByNguoiDung,
  useCheckNguoiDungQuyen
} from './useNguoiDungQuyen';

// VaiTro Hooks
export {
  useVaiTros,
  useVaiTro,
  useActiveVaiTros
} from './useVaiTro';

// User Hooks
export {
  useUsers,
  useUser
} from './useUser';