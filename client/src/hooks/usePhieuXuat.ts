import { useApiWithParams } from './useApi';
import phieuXuatService, { 
  PhieuXuatDto, 
  PhieuXuatDetailDto, 
  PhieuXuatCreateDto, 
  PhieuXuatUpdateDto, 
  PhieuXuatQueryParams 
} from '../services/phieuXuat.service';

// Hook để lấy danh sách phiếu xuất
export const usePhieuXuats = (params: PhieuXuatQueryParams = {}) => {
  return useApiWithParams<{
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
    data: PhieuXuatDto[];
  }, PhieuXuatQueryParams>(
    async (queryParams) => phieuXuatService.getAll(queryParams),
    params
  );
};

// Hook để lấy chi tiết phiếu xuất
export const usePhieuXuat = (id: string | null) => {
  return useApiWithParams<PhieuXuatDetailDto, string>(
    async (phieuXuatId) => phieuXuatService.getById(phieuXuatId),
    id
  );
};

// Hook để tạo phiếu xuất
export const useCreatePhieuXuat = () => {
  return useApiWithParams<{ maPhieuXuat: string }, PhieuXuatCreateDto>(
    async (data) => phieuXuatService.create(data),
    null
  );
};

// Hook để cập nhật phiếu xuất
export const useUpdatePhieuXuat = () => {
  return useApiWithParams<void, { id: string; data: PhieuXuatUpdateDto }>(
    async ({ id, data }) => phieuXuatService.update(id, data),
    null
  );
};

// Hook để xóa phiếu xuất
export const useDeletePhieuXuat = () => {
  return useApiWithParams<void, string>(
    async (id) => phieuXuatService.delete(id),
    null
  );
};

// Hook để xác nhận phiếu xuất
export const useConfirmPhieuXuat = () => {
  return useApiWithParams<void, string>(
    async (id) => phieuXuatService.confirm(id),
    null
  );
};