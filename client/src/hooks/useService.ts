import { useApiWithParams } from './useApi';
import serviceService from '../services/service.service';
import { 
  Service, 
  ServiceDetail,
  ServiceCreateRequest, 
  ServiceUpdateRequest 
} from '../types/service.types';

// Lấy tất cả dịch vụ
export function useServices() {
  return useApiWithParams<any, { page: number; pageSize: number }>(
    ({ page, pageSize }) => serviceService.getAll(page, pageSize),
    null
  );
}

// Lấy dịch vụ theo ID
export function useService() {
  return useApiWithParams<ServiceDetail, string>(
    serviceService.getById,
    null
  );
}

// Tạo dịch vụ mới
export function useCreateService() {
  return useApiWithParams<any, ServiceCreateRequest>(
    serviceService.create,
    null
  );
}

// Cập nhật dịch vụ
export function useUpdateService() {
  return useApiWithParams<any, { id: string; data: ServiceUpdateRequest }>(
    ({ id, data }) => serviceService.update(id, data),
    null
  );
}

// Xóa dịch vụ
export function useDeleteService() {
  return useApiWithParams<any, string>(
    serviceService.delete,
    null
  );
} 