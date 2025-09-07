import { useApiWithParams } from './useApi';
import nhaCungCapService, { 
  NhaCungCapDto, 
  NhaCungCapDetailDto, 
  NhaCungCapCreateDto, 
  NhaCungCapUpdateDto, 
  NhaCungCapQueryParams,
  AnhNhaCungCapCreateDto,
  AnhNhaCungCapUpdateDto
} from '../services/nhaCungCap.service';

// Hook để lấy danh sách nhà cung cấp
export const useNhaCungCaps = (params: NhaCungCapQueryParams = {}) => {
  return useApiWithParams<{
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
    data: NhaCungCapDto[];
  }, NhaCungCapQueryParams>(
    async (queryParams) => nhaCungCapService.getAll(queryParams),
    params
  );
};

// Hook để lấy chi tiết nhà cung cấp
export const useNhaCungCap = (id: string | null) => {
  return useApiWithParams<NhaCungCapDetailDto, string>(
    async (nhaCungCapId) => nhaCungCapService.getById(nhaCungCapId),
    id
  );
};

// Hook để tạo nhà cung cấp
export const useCreateNhaCungCap = () => {
  return useApiWithParams<{ maNhaCungCap: string }, NhaCungCapCreateDto>(
    async (data) => nhaCungCapService.create(data),
    null
  );
};

// Hook để cập nhật nhà cung cấp
export const useUpdateNhaCungCap = () => {
  return useApiWithParams<void, { id: string; data: NhaCungCapUpdateDto }>(
    async ({ id, data }) => nhaCungCapService.update(id, data),
    null
  );
};

// Hook để xóa nhà cung cấp
export const useDeleteNhaCungCap = () => {
  return useApiWithParams<void, string>(
    async (id) => nhaCungCapService.delete(id),
    null
  );
};

// Hook để thêm ảnh cho nhà cung cấp
export const useAddImageNhaCungCap = () => {
  return useApiWithParams<{ maAnhNhaCungCap: string }, { id: string; data: AnhNhaCungCapCreateDto }>(
    async ({ id, data }) => nhaCungCapService.addImage(id, data),
    null
  );
};

// Hook để cập nhật ảnh nhà cung cấp
export const useUpdateImageNhaCungCap = () => {
  return useApiWithParams<void, { id: string; imageId: string; data: AnhNhaCungCapUpdateDto }>(
    async ({ id, imageId, data }) => nhaCungCapService.updateImage(id, imageId, data),
    null
  );
};

// Hook để xóa ảnh nhà cung cấp
export const useDeleteImageNhaCungCap = () => {
  return useApiWithParams<void, { id: string; imageId: string }>(
    async ({ id, imageId }) => nhaCungCapService.deleteImage(id, imageId),
    null
  );
};