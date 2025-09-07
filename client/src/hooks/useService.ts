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

// ========== SERVICE CONDITIONS HOOKS ==========

// Lấy tất cả điều kiện dịch vụ
export function useServiceConditions() {
  return useApiWithParams<any, { page: number; pageSize: number }>(
    ({ page, pageSize }) => serviceService.getServiceConditions(page, pageSize),
    null
  );
}

// Lấy điều kiện theo ID
export function useServiceCondition() {
  return useApiWithParams<any, string>(
    serviceService.getServiceConditionById,
    null
  );
}

// Lấy điều kiện theo dịch vụ
export function useServiceConditionsByService() {
  return useApiWithParams<any, string>(
    serviceService.getServiceConditionsByService,
    null
  );
}

// Tạo điều kiện mới
export function useCreateServiceCondition() {
  return useApiWithParams<any, any>(
    serviceService.createServiceCondition,
    null
  );
}

// Tạo nhiều điều kiện cùng lúc
export function useCreateServiceConditionsBatch() {
  return useApiWithParams<any, any>(
    serviceService.createServiceConditionsBatch,
    null
  );
}

// Cập nhật điều kiện
export function useUpdateServiceCondition() {
  return useApiWithParams<any, { id: string; data: any }>(
    ({ id, data }) => serviceService.updateServiceCondition(id, data),
    null
  );
}

// Xóa điều kiện
export function useDeleteServiceCondition() {
  return useApiWithParams<any, string>(
    serviceService.deleteServiceCondition,
    null
  );
}

// Kiểm tra điều kiện
export function useCheckEligibility() {
  return useApiWithParams<any, any>(
    serviceService.checkEligibility,
    null
  );
} 