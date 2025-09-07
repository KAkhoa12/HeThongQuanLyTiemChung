import { useApi } from './useApi';
import chiTietXuatService, { 
  ChiTietXuatDto, 
  ChiTietXuatCreateDto, 
  ChiTietXuatQueryParams 
} from '../services/chiTietXuat.service';

// Hook để lấy danh sách chi tiết xuất
export const useChiTietXuats = (params: ChiTietXuatQueryParams = {}) => {
  return useApi<{
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
    data: ChiTietXuatDto[];
  }>(
    async () => chiTietXuatService.getAll(params),
    null
  );
};

// Hook để lấy chi tiết xuất theo ID
export const useChiTietXuat = (id: string | null) => {
  return useApi<ChiTietXuatDto | null>(
    async () => id ? chiTietXuatService.getById(id) : Promise.resolve(null),
    null
  );
};

// Hook để tạo chi tiết xuất
export const useCreateChiTietXuat = () => {
  return useApi<{ maChiTiet: string }>(
    async (data: ChiTietXuatCreateDto) => chiTietXuatService.create(data),
    null
  );
};

// Hook để cập nhật chi tiết xuất
export const useUpdateChiTietXuat = () => {
  return useApi<any>(
    async ({ id, data }: { id: string; data: ChiTietXuatCreateDto }) => chiTietXuatService.update(id, data),
    null
  );
};

// Hook để xóa chi tiết xuất
export const useDeleteChiTietXuat = () => {
  return useApi<any>(
    async (id: string) => chiTietXuatService.delete(id),
    null
  );
};

// Hook để lấy chi tiết xuất theo phiếu xuất
export const useChiTietXuatsByPhieuXuat = (maPhieuXuat: string | null) => {
  return useApi<ChiTietXuatDto[]>(
    async () => maPhieuXuat ? chiTietXuatService.getByPhieuXuat(maPhieuXuat) : Promise.resolve([]),
    null
  );
};