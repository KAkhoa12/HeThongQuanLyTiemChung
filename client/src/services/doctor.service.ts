import axios from 'axios';
import API_CONFIG from '../config/api.config';
import { ApiResponse, PagedResponse } from '../types/staff.types';
import { 
  Doctor, 
  DoctorCreateRequest, 
  DoctorDetail, 
  DoctorSchedule, 
  DoctorUpdateRequest,
  ScheduleAvailability,
  WorkSchedule,
  WorkScheduleCreateRequest,
  WorkScheduleDetail,
  WorkScheduleUpdateRequest
} from '../types/doctor.types';

const DOCTOR_BASE_URL = `${API_CONFIG.BASE_URL}${API_CONFIG.DOCTOR.BASE}`;
const SCHEDULE_BASE_URL = `${API_CONFIG.BASE_URL}${API_CONFIG.SCHEDULE.BASE}`;

/**
 * Get all doctors with pagination
 */
export const getAllDoctors = async (page: number = 1, pageSize: number = 20): Promise<PagedResponse<Doctor>> => {
  try {
    const response = await axios.get<ApiResponse<PagedResponse<Doctor>>>(`${DOCTOR_BASE_URL}?page=${page}&pageSize=${pageSize}`);
    return response.data.payload;
  } catch (error) {
    console.error('Error fetching doctors:', error);
    throw error;
  }
};

/**
 * Get all doctors without pagination
 */
export const getAllDoctorsNoPage = async (): Promise<Doctor[]> => {
  try {
    const response = await axios.get<ApiResponse<Doctor[]>>(`${DOCTOR_BASE_URL}/all`);
    return response.data.payload;
  } catch (error) {
    console.error('Error fetching all doctors:', error);
    throw error;
  }
};

/**
 * Get doctor by ID
 */
export const getDoctorById = async (id: string): Promise<DoctorDetail> => {
  try {
    const response = await axios.get<ApiResponse<DoctorDetail>>(`${DOCTOR_BASE_URL}/${id}`);
    return response.data.payload;
  } catch (error) {
    console.error(`Error fetching doctor with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Create new doctor
 */
export const createDoctor = async (doctorData: DoctorCreateRequest): Promise<{ id: string }> => {
  try {
    const response = await axios.post<ApiResponse<{ id: string }>>(DOCTOR_BASE_URL, doctorData);
    return response.data.payload;
  } catch (error) {
    console.error('Error creating doctor:', error);
    throw error;
  }
};

/**
 * Update doctor
 */
export const updateDoctor = async (id: string, doctorData: DoctorUpdateRequest): Promise<void> => {
  try {
    await axios.put<ApiResponse<null>>(`${DOCTOR_BASE_URL}/${id}`, doctorData);
  } catch (error) {
    console.error(`Error updating doctor with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Delete doctor (soft delete)
 */
export const deleteDoctor = async (id: string): Promise<void> => {
  try {
    await axios.delete<ApiResponse<null>>(`${DOCTOR_BASE_URL}/${id}`);
  } catch (error) {
    console.error(`Error deleting doctor with ID ${id}:`, error);
    throw error;
  }
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
  try {
    let url = `${DOCTOR_BASE_URL}/${doctorId}/schedules?page=${page}&pageSize=${pageSize}`;
    if (fromDate) url += `&fromDate=${fromDate}`;
    if (toDate) url += `&toDate=${toDate}`;
    
    const response = await axios.get<ApiResponse<PagedResponse<DoctorSchedule>>>(url);
    return response.data.payload;
  } catch (error) {
    console.error(`Error fetching schedules for doctor with ID ${doctorId}:`, error);
    throw error;
  }
};

/**
 * Search doctors by name or specialty
 */
export const searchDoctors = async (query: string, page: number = 1, pageSize: number = 20): Promise<PagedResponse<Doctor>> => {
  try {
    const response = await axios.get<ApiResponse<PagedResponse<Doctor>>>(`${DOCTOR_BASE_URL}/search?query=${query}&page=${page}&pageSize=${pageSize}`);
    return response.data.payload;
  } catch (error) {
    console.error('Error searching doctors:', error);
    throw error;
  }
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
  try {
    let url = `${SCHEDULE_BASE_URL}?page=${page}&pageSize=${pageSize}`;
    if (fromDate) url += `&fromDate=${fromDate}`;
    if (toDate) url += `&toDate=${toDate}`;
    if (locationId) url += `&locationId=${locationId}`;
    if (doctorId) url += `&doctorId=${doctorId}`;
    
    const response = await axios.get<ApiResponse<PagedResponse<WorkSchedule>>>(url);
    return response.data.payload;
  } catch (error) {
    console.error('Error fetching work schedules:', error);
    throw error;
  }
};

/**
 * Get work schedule by ID
 */
export const getScheduleById = async (id: string, includeAppointments: boolean = false): Promise<WorkScheduleDetail> => {
  try {
    const response = await axios.get<ApiResponse<WorkScheduleDetail>>(`${SCHEDULE_BASE_URL}/${id}?includeAppointments=${includeAppointments}`);
    return response.data.payload;
  } catch (error) {
    console.error(`Error fetching work schedule with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Create new work schedule
 */
export const createSchedule = async (scheduleData: WorkScheduleCreateRequest): Promise<{ id: string }> => {
  try {
    const response = await axios.post<ApiResponse<{ id: string }>>(SCHEDULE_BASE_URL, scheduleData);
    return response.data.payload;
  } catch (error) {
    console.error('Error creating work schedule:', error);
    throw error;
  }
};

/**
 * Update work schedule
 */
export const updateSchedule = async (id: string, scheduleData: WorkScheduleUpdateRequest): Promise<void> => {
  try {
    await axios.put<ApiResponse<null>>(`${SCHEDULE_BASE_URL}/${id}`, scheduleData);
  } catch (error) {
    console.error(`Error updating work schedule with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Delete work schedule (soft delete)
 */
export const deleteSchedule = async (id: string): Promise<void> => {
  try {
    await axios.delete<ApiResponse<null>>(`${SCHEDULE_BASE_URL}/${id}`);
  } catch (error) {
    console.error(`Error deleting work schedule with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Get available schedule slots
 */
export const getScheduleAvailability = async (
  fromDate?: string,
  toDate?: string,
  locationId?: string,
  doctorId?: string
): Promise<ScheduleAvailability[]> => {
  try {
    let url = `${API_CONFIG.BASE_URL}${API_CONFIG.SCHEDULE.AVAILABILITY}`;
    const params = new URLSearchParams();
    
    if (fromDate) params.append('fromDate', fromDate);
    if (toDate) params.append('toDate', toDate);
    if (locationId) params.append('locationId', locationId);
    if (doctorId) params.append('doctorId', doctorId);
    
    if (params.toString()) url += `?${params.toString()}`;
    
    const response = await axios.get<ApiResponse<ScheduleAvailability[]>>(url);
    return response.data.payload;
  } catch (error) {
    console.error('Error fetching schedule availability:', error);
    throw error;
  }
};

/**
 * Get schedules by doctor and location
 */
export const getSchedulesByDoctorAndLocation = async (
  doctorId: string,
  locationId: string,
  fromDate?: string,
  toDate?: string,
  page: number = 1,
  pageSize: number = 20
): Promise<PagedResponse<WorkSchedule>> => {
  try {
    let url = `${API_CONFIG.BASE_URL}${API_CONFIG.SCHEDULE.BY_DOCTOR_LOCATION}?doctorId=${doctorId}&locationId=${locationId}&page=${page}&pageSize=${pageSize}`;
    if (fromDate) url += `&fromDate=${fromDate}`;
    if (toDate) url += `&toDate=${toDate}`;
    
    const response = await axios.get<ApiResponse<PagedResponse<WorkSchedule>>>(url);
    return response.data.payload;
  } catch (error) {
    console.error(`Error fetching schedules for doctor ${doctorId} at location ${locationId}:`, error);
    throw error;
  }
};