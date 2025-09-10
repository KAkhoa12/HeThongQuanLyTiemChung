import { useApiWithParams } from './useApi';
import khachHangService, { 
  KhachHang, 
  CreateKhachHangDto, 
  UpdateKhachHangDto, 
  KhachHangListParams 
} from '../services/khachHang.service';

export const useKhachHangs = () => {
  return useApiWithParams<{ totalCount: number; page: number; pageSize: number; totalPages: number; data: KhachHang[] }, KhachHangListParams>(
    async (params) => khachHangService.getAll(params),
    null
  );
};

export const useKhachHang = (id: string) => {
  return useApiWithParams<KhachHang, { id: string }>(
    async ({ id }) => khachHangService.getById(id),
    null
  );
};

export const useCreateKhachHang = () => {
  return useApiWithParams<{ maNguoiDung: string }, CreateKhachHangDto>(
    async (data) => khachHangService.create(data),
    null
  );
};

export const useUpdateKhachHang = () => {
  return useApiWithParams<void, { id: string; data: UpdateKhachHangDto }>(
    async ({ id, data }) => khachHangService.update(id, data),
    null
  );
};

export const useDeleteKhachHang = () => {
  return useApiWithParams<void, { id: string }>(
    async ({ id }) => khachHangService.delete(id),
    null
  );
};

export const useToggleKhachHangStatus = () => {
  return useApiWithParams<void, { id: string }>(
    async ({ id }) => khachHangService.toggleStatus(id),
    null
  );
};