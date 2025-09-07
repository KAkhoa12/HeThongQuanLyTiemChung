import { useApiWithParams } from './useApi';
import phieuNhapService, { 
  PhieuNhapDto, 
  PhieuNhapDetailDto, 
  PhieuNhapCreateDto, 
  PhieuNhapUpdateDto, 
  PhieuNhapQueryParams 
} from '../services/phieuNhap.service';

// Hook để lấy danh sách phiếu nhập
export const usePhieuNhaps = () => {
  return useApiWithParams<{
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
    data: PhieuNhapDto[];
  }, PhieuNhapQueryParams>(
    async (queryParams) => phieuNhapService.getAll(queryParams),
    null
  );
};

// Hook để lấy chi tiết phiếu nhập
export const usePhieuNhap = () => {
  return useApiWithParams<PhieuNhapDetailDto, string>(
    async (phieuNhapId) => phieuNhapService.getById(phieuNhapId),
    null
  );
};

// Hook để tạo phiếu nhập
export const useCreatePhieuNhap = () => {
  return useApiWithParams<{ maPhieuNhap: string }, PhieuNhapCreateDto>(
    async (data) => phieuNhapService.create(data),
    null
  );
};

// Hook để cập nhật phiếu nhập
export const useUpdatePhieuNhap = () => {
  return useApiWithParams<unknown, { id: string; data: PhieuNhapUpdateDto }>(
    async ({ id, data }) => phieuNhapService.update(id, data),
    null
  );
};

// Hook để xóa phiếu nhập
export const useDeletePhieuNhap = () => {
  return useApiWithParams<unknown, string>(
    async (id) => phieuNhapService.delete(id),
    null
  );
};

// Hook để xác nhận phiếu nhập
export const useConfirmPhieuNhap = () => {
  return useApiWithParams<unknown, string>(
    async (id) => phieuNhapService.confirm(id),
    null
  );
};