import apiService from './api.service';
import { ApiResponse, PagedResponse } from '../types/staff.types';
import { 
  Doctor, 
  DoctorCreateRequest, 
  DoctorCreateWithUserRequest,
  DoctorDetail, 
  DoctorSchedule, 
  DoctorUpdateRequest,
  ScheduleAvailability,
  WorkSchedule,
  WorkScheduleCreateRequest,
  WorkScheduleDetail,
  WorkScheduleUpdateRequest
} from '../types/doctor.types';

/**
 * Get all doctors with pagination
 */
export const getAllDoctors = async (page: number = 1, pageSize: number = 20): Promise<PagedResponse<Doctor>> => {
  return await apiService.get(`/api/doctors?page=${page}&pageSize=${pageSize}`);
};

/**
 * Get all doctors without pagination
 */
export const getAllDoctorsNoPage = async (): Promise<Doctor[]> => {
  return await apiService.get('/api/doctors/all');
};

/**
 * Get doctor by ID
 */
export const getDoctorById = async (id: string): Promise<DoctorDetail> => {
  return await apiService.get(`/api/doctors/${id}`);
};

/**
 * Create new doctor
 */
export const createDoctor = async (doctorData: DoctorCreateRequest): Promise<{ id: string }> => {
  return await apiService.create('/api/doctors', doctorData);
};

/**
 * Create new doctor with new user
 */
export const createDoctorWithUser = async (doctorData: DoctorCreateWithUserRequest): Promise<{ 
  doctorId: string; 
  userId: string; 
  userName: string; 
  email: string; 
}> => {
  return await apiService.create('/api/doctors/create-with-user', doctorData);
};

/**
 * Update doctor
 */
export const updateDoctor = async (id: string, doctorData: DoctorUpdateRequest): Promise<void> => {
  await apiService.update(`/api/doctors/${id}`, doctorData);
};

/**
 * Delete doctor (soft delete)
 */
export const deleteDoctor = async (id: string): Promise<void> => {
  await apiService.delete(`/api/doctors/${id}`);
};

/**
 * Get doctor schedules
 */
export const getDoctorSchedules = async (
  doctorId: string, 
  fromDate?: string, 
  toDate?: string, 
  page: number = 1, 
  pageSize: number = 20
): Promise<PagedResponse<DoctorSchedule>> => {
  let params: any = { page, pageSize };
  if (fromDate) params.fromDate = fromDate;
  if (toDate) params.toDate = toDate;
  
  return await apiService.get(`/api/doctors/${doctorId}/schedules`, params);
};

/**
 * Search doctors by name or specialty
 */
export const searchDoctors = async (query: string, page: number = 1, pageSize: number = 20): Promise<PagedResponse<Doctor>> => {
  return await apiService.get(`/api/doctors/search?query=${query}&page=${page}&pageSize=${pageSize}`);
};

// Work Schedule API functions

/**
 * Get all work schedules with pagination and filters
 */
export const getAllSchedules = async (
  fromDate?: string,
  toDate?: string,
  locationId?: string,
  doctorId?: string,
  page: number = 1,
  pageSize: number = 20
): Promise<PagedResponse<WorkSchedule>> => {
  let params: any = { page, pageSize };
  if (fromDate) params.fromDate = fromDate;
  if (toDate) params.toDate = toDate;
  if (locationId) params.locationId = locationId;
  if (doctorId) params.doctorId = doctorId;
  
  return await apiService.get('/api/schedules', params);
};

/**
 * Get work schedule by ID
 */
export const getScheduleById = async (id: string, includeAppointments: boolean = false): Promise<WorkScheduleDetail> => {
  return await apiService.get(`/api/schedules/${id}?includeAppointments=${includeAppointments}`);
};

/**
 * Create new work schedule
 */
export const createSchedule = async (scheduleData: WorkScheduleCreateRequest): Promise<{ id: string }> => {
  return await apiService.create('/api/schedules', scheduleData);
};

/**
 * Update work schedule
 */
export const updateSchedule = async (id: string, scheduleData: WorkScheduleUpdateRequest): Promise<void> => {
  await apiService.update(`/api/schedules/${id}`, scheduleData);
};

/**
 * Delete work schedule
 */
export const deleteSchedule = async (id: string): Promise<void> => {
  await apiService.delete(`/api/schedules/${id}`);
};

/**
 * Get schedule availability
 */
export const getScheduleAvailability = async (
  doctorId: string,
  date: string,
  locationId?: string
): Promise<ScheduleAvailability[]> => {
  let params: any = { date };
  if (locationId) params.locationId = locationId;
  
  return await apiService.get(`/api/schedules/availability/${doctorId}`, params);
};

/**
 * Update schedule availability
 */
export const updateScheduleAvailability = async (
  scheduleId: string,
  availability: ScheduleAvailability[]
): Promise<void> => {
  await apiService.update(`/api/schedules/${scheduleId}/availability`, { availability });
};