import { useApiWithParams } from './useApi';
import { 
  getAllDoctors, 
  getAllDoctorsNoPage,
  getDoctorById,
  createDoctor,
  createDoctorWithUser,
  updateDoctor,
  deleteDoctor,
  getDoctorSchedules,
  searchDoctors
} from '../services/doctor.service';
import { 
  Doctor, 
  DoctorDetail,
  DoctorCreateRequest,
  DoctorCreateWithUserRequest,
  DoctorUpdateRequest,
  DoctorSchedule
} from '../types/doctor.types';
import { PagedResponse } from '../types/staff.types';

// Hook để lấy danh sách bác sĩ có phân trang
export const useDoctors = () => {
  return useApiWithParams<PagedResponse<Doctor>, {
    page?: number;
    pageSize?: number;
  }>(
    async (params) => getAllDoctors(params.page || 1, params.pageSize || 20),
    null
  );
};

// Hook để lấy tất cả bác sĩ không phân trang
export const useAllDoctors = () => {
  return useApiWithParams<Doctor[], void>(getAllDoctorsNoPage, null);
};

// Hook để lấy chi tiết bác sĩ theo ID
export const useDoctor = () => {
  return useApiWithParams<DoctorDetail, string>(getDoctorById, null);
};

// Hook để tạo bác sĩ mới
export const useCreateDoctor = () => {
  return useApiWithParams<{ id: string }, DoctorCreateRequest>(createDoctor, null);
};

// Hook để tạo bác sĩ mới với user mới
export const useCreateDoctorWithUser = () => {
  return useApiWithParams<{ 
    doctorId: string; 
    userId: string; 
    userName: string; 
    email: string; 
  }, DoctorCreateWithUserRequest>(createDoctorWithUser, null);
};

// Hook để cập nhật thông tin bác sĩ
export const useUpdateDoctor = () => {
  return useApiWithParams<void, { id: string; data: DoctorUpdateRequest }>(
    async ({ id, data }) => updateDoctor(id, data),
    null
  );
};

// Hook để xóa bác sĩ (soft delete)
export const useDeleteDoctor = () => {
  return useApiWithParams<void, string>(deleteDoctor, null);
};

// Hook để lấy lịch làm việc của bác sĩ
export const useDoctorSchedules = () => {
  return useApiWithParams<PagedResponse<DoctorSchedule>, {
    doctorId: string;
    fromDate?: string;
    toDate?: string;
    page?: number;
    pageSize?: number;
  }>(
    async (params) => getDoctorSchedules(
      params.doctorId,
      params.fromDate,
      params.toDate,
      params.page || 1,
      params.pageSize || 20
    ),
    null
  );
};

// Hook để tìm kiếm bác sĩ
export const useSearchDoctors = () => {
  return useApiWithParams<PagedResponse<Doctor>, {
    query: string;
    page?: number;
    pageSize?: number;
  }>(
    async (params) => searchDoctors(params.query, params.page || 1, params.pageSize || 20),
    null
  );
}; 