import { useApi, useApiWithParams } from './useApi';
import { 
  tonKhoLoService,
  type TonKhoLoDto,
  type TonKhoLoCreateDto,
  type TonKhoLoUpdateDto,
  type TonKhoSummaryDto,
  type TonKhoLoQueryParams
} from '../services/tonKhoLo.service';

// Get all TonKhoLo with pagination
export const useTonKhoLos = () => {
  return useApiWithParams<{
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
    data: TonKhoLoDto[];
  }, TonKhoLoQueryParams>(
    async (queryParams) => tonKhoLoService.getAll(queryParams),
    null
  );
};

// Get TonKhoLo by ID
export const useTonKhoLo = (id: string | null) => {
  return useApi<TonKhoLoDto | null>(
    async () => id ? tonKhoLoService.getById(id) : Promise.resolve(null),
    null
  );
};

// Create TonKhoLo
export const useCreateTonKhoLo = () => {
  return useApi<{ maTonKho: string }>(
    async (data: TonKhoLoCreateDto) => tonKhoLoService.create(data),
    null
  );
};

// Update TonKhoLo
export const useUpdateTonKhoLo = () => {
  return useApi<any>(
    async ({ id, data }: { id: string; data: TonKhoLoUpdateDto }) => tonKhoLoService.update(id, data),
    null
  );
};

// Delete TonKhoLo
export const useDeleteTonKhoLo = () => {
  return useApi<any>(
    async (id: string) => tonKhoLoService.delete(id),
    null
  );
};

// Get TonKhoLo by LoVaccine ID
export const useTonKhoLosByLoVaccine = (loVaccineId: string | null) => {
  return useApi<TonKhoLoDto[]>(
    async () => loVaccineId ? tonKhoLoService.getByLo(loVaccineId) : Promise.resolve([]),
    null
  );
};

// Get TonKhoLo by Location ID
export const useTonKhoLosByLocation = (locationId: string | null) => {
  return useApi<TonKhoLoDto[]>(
    async () => locationId ? tonKhoLoService.getByDiaDiem(locationId) : Promise.resolve([]),
    null
  );
};

// Get TonKho Summary
export const useTonKhoSummary = () => {
  return useApi<TonKhoSummaryDto[]>(
    async () => tonKhoLoService.getSummary(),
    null
  );
};

// Update quantity
export const useUpdateTonKhoQuantity = () => {
  return useApi<any>(
    async (data: TonKhoLoUpdateDto) => tonKhoLoService.updateQuantity(data),
    null
  );
};