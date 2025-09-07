import { useApiWithParams } from './useApi';
import { 
  loVaccineService,
  type LoVaccineDto,
  type LoVaccineDetailDto,
  type LoVaccineCreateDto,
  type LoVaccineUpdateDto,
  type LoVaccineQueryParams
} from '../services/loVaccine.service';

// Get all LoVaccine with pagination
export const useLoVaccines = (params: LoVaccineQueryParams | null) => {
  return useApiWithParams<{
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
    data: LoVaccineDto[];
  }, LoVaccineQueryParams>(
    async (queryParams) => loVaccineService.getAll(queryParams),
    params
  );
};

// Get LoVaccine by ID
export const useLoVaccine = (id: string | null) => {
  return useApiWithParams<LoVaccineDetailDto, string>(
    async (loVaccineId) => loVaccineService.getById(loVaccineId),
    id
  );
};

// Create LoVaccine
export const useCreateLoVaccine = () => {
  return useApiWithParams<{ maLo: string }, LoVaccineCreateDto>(
    async (data) => loVaccineService.create(data),
    null
  );
};

// Update LoVaccine
export const useUpdateLoVaccine = () => {
  return useApiWithParams<LoVaccineDto, { id: string; data: LoVaccineUpdateDto }>(
    async ({ id, data }) => loVaccineService.update(id, data),
    null
  );
};

// Delete LoVaccine
export const useDeleteLoVaccine = () => {
  return useApiWithParams<boolean, string>(
    async (id) => loVaccineService.delete(id),
    null
  );
};

// Get LoVaccine by Vaccine ID
export const useLoVaccinesByVaccine = (vaccineId: string | null) => {
  return useApiWithParams<LoVaccineDto[], string>(
    async (maVaccine) => loVaccineService.getByVaccine(maVaccine),
    vaccineId
  );
};

// Get active LoVaccine
export const useActiveLoVaccines = (params: LoVaccineQueryParams | null) => {
  return useApiWithParams<{
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
    data: LoVaccineDto[];
  }, LoVaccineQueryParams>(
    async (queryParams) => loVaccineService.getActive(queryParams),
    params
  );
};