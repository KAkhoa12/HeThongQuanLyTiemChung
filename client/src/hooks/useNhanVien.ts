import { useApiWithParams } from './useApi';
import nhanVienService, { 
  NhanVien, 
  CreateNhanVienDto, 
  UpdateNhanVienDto, 
  NhanVienListParams 
} from '../services/nhanVien.service';

export const useNhanViens = () => {
  return useApiWithParams<{ totalCount: number; page: number; pageSize: number; totalPages: number; data: NhanVien[] }, NhanVienListParams>(
    async (params) => nhanVienService.getAll(params),
    null
  );
};

export const useNhanVien = (id: string) => {
  return useApiWithParams<NhanVien, { id: string }>(
    async ({ id }) => nhanVienService.getById(id),
    null
  );
};

export const useCreateNhanVien = () => {
  return useApiWithParams<{ maNhanVien: string; maNguoiDung: string }, CreateNhanVienDto>(
    async (data) => nhanVienService.create(data),
    null
  );
};

export const useUpdateNhanVien = () => {
  return useApiWithParams<void, { id: string; data: UpdateNhanVienDto }>(
    async ({ id, data }) => nhanVienService.update(id, data),
    null
  );
};

export const useDeleteNhanVien = () => {
  return useApiWithParams<void, { id: string }>(
    async ({ id }) => nhanVienService.delete(id),
    null
  );
};

export const useToggleNhanVienStatus = () => {
  return useApiWithParams<void, { id: string }>(
    async ({ id }) => nhanVienService.toggleStatus(id),
    null
  );
};

export const useChucVu = () => {
  return useApiWithParams<string[], {}>(
    async () => nhanVienService.getChucVu(),
    null
  );
};