import { useApi } from './useApi';
import chiTietNhapService, { 
  ChiTietNhapDto, 
  ChiTietNhapCreateDto, 
  ChiTietNhapQueryParams 
} from '../services/chiTietNhap.service';

// Hook để lấy danh sách chi tiết nhập
export const useChiTietNhaps = (params: ChiTietNhapQueryParams = {}) => {
  return useApi<{
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
    data: ChiTietNhapDto[];
  }>(
    async () => chiTietNhapService.getAll(params),
    null
  );
};

// Hook để lấy chi tiết nhập theo ID
export const useChiTietNhap = (id: string | null) => {
  return useApi<ChiTietNhapDto | null>(
    async () => id ? chiTietNhapService.getById(id) : Promise.resolve(null),
    null
  );
};

// Hook để tạo chi tiết nhập
export const useCreateChiTietNhap = () => {
  return useApi<{ maChiTiet: string }>(
    async (data: ChiTietNhapCreateDto) => chiTietNhapService.create(data),
    null
  );
};

// Hook để cập nhật chi tiết nhập
export const useUpdateChiTietNhap = () => {
  return useApi<any>(
    async ({ id, data }: { id: string; data: ChiTietNhapCreateDto }) => chiTietNhapService.update(id, data),
    null
  );
};

// Hook để xóa chi tiết nhập
export const useDeleteChiTietNhap = () => {
  return useApi<any>(
    async (id: string) => chiTietNhapService.delete(id),
    null
  );
};

// Hook để lấy chi tiết nhập theo phiếu nhập
export const useChiTietNhapsByPhieuNhap = (maPhieuNhap: string | null) => {
  return useApi<ChiTietNhapDto[]>(
    async () => maPhieuNhap ? chiTietNhapService.getByPhieuNhap(maPhieuNhap) : Promise.resolve([]),
    null
  );
};