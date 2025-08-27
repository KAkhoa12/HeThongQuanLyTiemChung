import { useApiWithParams } from './useApi';
import vaccineService, { 
  VaccineDto, 
  VaccineCreateRequest, 
  VaccineUpdateRequest,
  PagedResultDto 
} from '../services/vaccine.service';

export function useVaccines() {
  return useApiWithParams<PagedResultDto<VaccineDto>, {
    page?: number;
    pageSize?: number;
    searchTerm?: string;
    manufacturer?: string;
    isActive?: boolean;
  }>(vaccineService.getVaccines, null);
}

export function useVaccine() {
  return useApiWithParams<VaccineDto, string>(vaccineService.getVaccine, null);
}

export function useActiveVaccines() {
  return useApiWithParams<VaccineDto[], void>(vaccineService.getActiveVaccines, []);
}

export function useManufacturers() {
  return useApiWithParams<string[], void>(vaccineService.getManufacturers, []);
}

export function useCreateVaccine() {
  return useApiWithParams<VaccineDto, VaccineCreateRequest>(vaccineService.createVaccine, null);
}

export function useUpdateVaccine() {
  return useApiWithParams<VaccineDto, { id: string; data: VaccineUpdateRequest }>(
    async ({ id, data }) => vaccineService.updateVaccine(id, data),
    null
  );
}

export function useDeleteVaccine() {
  return useApiWithParams<void, string>(vaccineService.deleteVaccine, null);
}

export function useUpdateVaccineStatus() {
  return useApiWithParams<void, { id: string; isActive: boolean }>(
    async ({ id, isActive }) => vaccineService.updateVaccineStatus(id, isActive),
    null
  );
}

export function useVaccineUsage() {
  return useApiWithParams<any, string>(vaccineService.getVaccineUsage, null);
} 