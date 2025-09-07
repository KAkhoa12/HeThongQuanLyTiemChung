import { useApi, useApiWithParams } from './useApi';
import chiTietThanhLyService, { 
  ChiTietThanhLyDto, 
  ChiTietThanhLyCreateDto, 
  ChiTietThanhLyQueryParams,
  VaccineExpiringSoonDto 
} from '../services/chiTietThanhLy.service';

// Hook để lấy danh sách chi tiết thanh lý
export const useChiTietThanhLies = (params: ChiTietThanhLyQueryParams = {}) => {
  return useApi<{
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
    data: ChiTietThanhLyDto[];
  }>(
    async () => chiTietThanhLyService.getAll(params),
    null
  );
};

// Hook để lấy chi tiết thanh lý theo ID
export const useChiTietThanhLy = (id: string | null) => {
  return useApi<ChiTietThanhLyDto | null>(
    async () => id ? chiTietThanhLyService.getById(id) : Promise.resolve(null),
    null
  );
};

// Hook để tạo chi tiết thanh lý
export const useCreateChiTietThanhLy = () => {
  return useApi<{ maChiTiet: string }>(
    async (data: ChiTietThanhLyCreateDto) => chiTietThanhLyService.create(data),
    null
  );
};

// Hook để cập nhật chi tiết thanh lý
export const useUpdateChiTietThanhLy = () => {
  return useApi<any>(
    async ({ id, data }: { id: string; data: ChiTietThanhLyCreateDto }) => chiTietThanhLyService.update(id, data),
    null
  );
};

// Hook để xóa chi tiết thanh lý
export const useDeleteChiTietThanhLy = () => {
  return useApi<any>(
    async (id: string) => chiTietThanhLyService.delete(id),
    null
  );
};

// Hook để lấy chi tiết thanh lý theo phiếu thanh lý
export const useChiTietThanhLiesByPhieuThanhLy = (maPhieuThanhLy: string | null) => {
  return useApi<ChiTietThanhLyDto[]>(
    async () => maPhieuThanhLy ? chiTietThanhLyService.getByPhieuThanhLy(maPhieuThanhLy) : Promise.resolve([]),
    null
  );
};

// Hook để lấy danh sách vaccine sắp hết hạn
export const useVaccinesExpiringSoon = (days: number = 30, maDiaDiem?: string) => {
  return useApiWithParams<VaccineExpiringSoonDto[], { days: number; maDiaDiem?: string }>(
    async (params) => chiTietThanhLyService.getVaccinesExpiringSoon(params.days, params.maDiaDiem),
    null
  );
};