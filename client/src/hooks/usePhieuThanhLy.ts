import { useApiWithParams } from './useApi';
import phieuThanhLyService, { 
  PhieuThanhLyDto, 
  PhieuThanhLyDetailDto, 
  PhieuThanhLyCreateDto, 
  PhieuThanhLyUpdateDto, 
  PhieuThanhLyQueryParams 
} from '../services/phieuThanhLy.service';

// Hook để lấy danh sách phiếu thanh lý
export const usePhieuThanhLies = (params: PhieuThanhLyQueryParams = {}) => {
  return useApiWithParams<{
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
    data: PhieuThanhLyDto[];
  }, PhieuThanhLyQueryParams>(
    async (queryParams) => phieuThanhLyService.getAll(queryParams),
    params
  );
};

// Hook để lấy chi tiết phiếu thanh lý
export const usePhieuThanhLy = (id: string | null) => {
  return useApiWithParams<PhieuThanhLyDetailDto, string>(
    async (phieuThanhLyId) => phieuThanhLyService.getById(phieuThanhLyId),
    id
  );
};

// Hook để tạo phiếu thanh lý
export const useCreatePhieuThanhLy = () => {
  return useApiWithParams<{ maPhieuThanhLy: string }, PhieuThanhLyCreateDto>(
    async (data) => phieuThanhLyService.create(data),
    null
  );
};

// Hook để cập nhật phiếu thanh lý
export const useUpdatePhieuThanhLy = () => {
  return useApiWithParams<void, { id: string; data: PhieuThanhLyUpdateDto }>(
    async ({ id, data }) => phieuThanhLyService.update(id, data),
    null
  );
};

// Hook để xóa phiếu thanh lý
export const useDeletePhieuThanhLy = () => {
  return useApiWithParams<void, string>(
    async (id) => phieuThanhLyService.delete(id),
    null
  );
};

// Hook để xác nhận phiếu thanh lý
export const useConfirmPhieuThanhLy = () => {
  return useApiWithParams<void, string>(
    async (id) => phieuThanhLyService.confirm(id),
    null
  );
};