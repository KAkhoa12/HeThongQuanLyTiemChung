import { useApiWithParams } from './useApi';
import { 
  getAllSchedules, 
  getScheduleById, 
  createSchedule, 
  updateSchedule, 
  deleteSchedule,
  getScheduleAvailability,
  getSchedulesByDoctorAndLocation
} from '../services/doctor.service';
import { WorkSchedule, WorkScheduleDetail, WorkScheduleCreateRequest, WorkScheduleUpdateRequest, ScheduleAvailability } from '../types/doctor.types';
import { PagedResponse } from '../types/staff.types';

// Hook để lấy danh sách lịch làm việc
export const useSchedules = () => {
  return useApiWithParams<PagedResponse<WorkSchedule>, {
    fromDate?: string;
    toDate?: string;
    locationId?: string;
    doctorId?: string;
    page?: number;
    pageSize?: number;
  }>(
    async (params) => getAllSchedules(params.fromDate, params.toDate, params.locationId, params.doctorId, params.page, params.pageSize),
    null
  );
};

// Hook để lấy chi tiết lịch làm việc
export const useSchedule = () => {
  return useApiWithParams<WorkScheduleDetail, { id: string; includeAppointments: boolean }>(
    async ({ id, includeAppointments }) => getScheduleById(id, includeAppointments),
    null
  );
};

// Hook để tạo lịch làm việc mới
export const useCreateSchedule = () => {
  return useApiWithParams<{ id: string }, WorkScheduleCreateRequest>(createSchedule, null);
};

// Hook để cập nhật lịch làm việc
export const useUpdateSchedule = () => {
  return useApiWithParams<void, { id: string; scheduleData: WorkScheduleUpdateRequest }>(
    async ({ id, scheduleData }) => updateSchedule(id, scheduleData),
    null
  );
};

// Hook để xóa lịch làm việc
export const useDeleteSchedule = () => {
  return useApiWithParams<void, string>(deleteSchedule, null);
};

// Hook để lấy lịch trống
export const useScheduleAvailability = () => {
  return useApiWithParams<ScheduleAvailability[], {
    fromDate?: string;
    toDate?: string;
    locationId?: string;
    doctorId?: string;
  }>(
    async (params) => getScheduleAvailability(params.fromDate, params.toDate, params.locationId, params.doctorId),
    null
  );
};

// Hook để lấy lịch làm việc theo bác sĩ và địa điểm
export const useSchedulesByDoctorAndLocation = () => {
  return useApiWithParams<PagedResponse<WorkSchedule>, {
    doctorId: string;
    locationId: string;
    fromDate?: string;
    toDate?: string;
    page?: number;
    pageSize?: number;
  }>(
    async (params) => getSchedulesByDoctorAndLocation(params.doctorId, params.locationId, params.fromDate, params.toDate, params.page, params.pageSize),
    null
  );
}; 