import { useApiWithParams } from './useApi';
import {
  getAllKhuyenMais,
  getKhuyenMaiById,
  createKhuyenMai,
  updateKhuyenMai,
  deleteKhuyenMai,
  validateKhuyenMaiCode,
  type KhuyenMaiDto,
  type CreateKhuyenMaiDto,
  type UpdateKhuyenMaiDto,
  type PagedResultDto
} from '../services/khuyenMai.service';

// Hook để lấy danh sách khuyến mãi có phân trang và filter
export const useKhuyenMais = () => {
  return useApiWithParams<PagedResultDto<KhuyenMaiDto>, {
    page?: number;
    pageSize?: number;
    searchTerm?: string;
    maLoaiKhuyenMai?: string;
    trangThai?: string;
  }>(
    async (params) => getAllKhuyenMais(params),
    null
  );
};

// Hook để lấy thông tin khuyến mãi theo ID
export const useKhuyenMai = (id: string | null) => {
  return useApiWithParams<KhuyenMaiDto, string>(
    async (id) => getKhuyenMaiById(id),
    null
  );
};

// Hook để tạo khuyến mãi mới
export const useCreateKhuyenMai = () => {
  return useApiWithParams<string, CreateKhuyenMaiDto>(
    async (data) => createKhuyenMai(data),
    null
  );
};

// Hook để cập nhật khuyến mãi
export const useUpdateKhuyenMai = () => {
  return useApiWithParams<void, { id: string; data: UpdateKhuyenMaiDto }>(
    async ({ id, data }) => updateKhuyenMai(id, data),
    null
  );
};

// Hook để xóa khuyến mãi
export const useDeleteKhuyenMai = () => {
  return useApiWithParams<void, string>(
    async (id) => deleteKhuyenMai(id),
    null
  );
};

// Hook để validate mã khuyến mãi
export const useValidateKhuyenMaiCode = (code: string | null) => {
  return useApiWithParams<KhuyenMaiDto, string>(
    async (code) => validateKhuyenMaiCode(code),
    null
  );
}; 