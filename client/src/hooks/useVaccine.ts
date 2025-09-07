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

// ========== LICH TIEM CHUAN HOOKS ==========

export function useVaccineSchedules() {
  return useApiWithParams<any, { page: number; pageSize: number }>(
    ({ page, pageSize }) => vaccineService.getVaccineSchedules(page, pageSize),
    null
  );
}

export function useVaccineSchedule() {
  return useApiWithParams<any, string>(vaccineService.getVaccineScheduleById, null);
}

export function useVaccineSchedulesByVaccine() {
  return useApiWithParams<any, { vaccineId: string; minAgeInMonths?: number }>(
    ({ vaccineId, minAgeInMonths }) => vaccineService.getVaccineSchedulesByVaccine(vaccineId, minAgeInMonths), 
    null
  );
}

export function useCreateVaccineSchedule() {
  return useApiWithParams<any, any>(vaccineService.createVaccineSchedule, null);
}

export function useCreateVaccineSchedulesBatch() {
  return useApiWithParams<any, any>(vaccineService.createVaccineSchedulesBatch, null);
}

export function useUpdateVaccineSchedule() {
  return useApiWithParams<any, { id: string; data: any }>(
    ({ id, data }) => vaccineService.updateVaccineSchedule(id, data),
    null
  );
}

export function useDeleteVaccineSchedule() {
  return useApiWithParams<any, string>(vaccineService.deleteVaccineSchedule, null);
}

export function useVaccineSchedulesByAgeAndVaccine() {
  return useApiWithParams<any[], { vaccineId: string; ageInMonths: number }>(
    ({ vaccineId, ageInMonths }) => vaccineService.getVaccineSchedulesByAgeAndVaccine(vaccineId, ageInMonths),
    null
  );
} 