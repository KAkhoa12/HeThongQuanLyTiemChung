import { useApiWithParams } from './useApi';
import serviceVaccineService, { 
  ServiceVaccineDto, 
  ServiceVaccineCreateDto, 
  ServiceVaccineUpdateDto 
} from '../services/serviceVaccine.service';

// Lấy vaccine theo dịch vụ
export function useServiceVaccines(serviceId: string) {
  return useApiWithParams<ServiceVaccineDto[], string>(
    serviceVaccineService.getByServiceId,
    []
  );
}

// Thêm vaccine vào dịch vụ
export function useAddVaccineToService() {
  return useApiWithParams<any, ServiceVaccineCreateDto>(
    serviceVaccineService.addVaccineToService,
    null
  );
}

// Cập nhật vaccine trong dịch vụ
export function useUpdateServiceVaccine() {
  return useApiWithParams<any, { id: string; data: ServiceVaccineUpdateDto }>(
    ({ id, data }) => serviceVaccineService.update(id, data),
    null
  );
}

// Xóa vaccine khỏi dịch vụ
export function useDeleteServiceVaccine() {
  return useApiWithParams<any, string>(
    serviceVaccineService.delete,
    null
  );
} 