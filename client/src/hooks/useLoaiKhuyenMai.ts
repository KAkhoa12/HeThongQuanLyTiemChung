import { useApiWithParams } from './useApi';
import {
  getAllLoaiKhuyenMais,
  getAllLoaiKhuyenMaisActive,
  getLoaiKhuyenMaiById,
  createLoaiKhuyenMai,
  updateLoaiKhuyenMai,
  deleteLoaiKhuyenMai,
  getKhuyenMaisByLoai,
  type LoaiKhuyenMaiDto,
  type CreateLoaiKhuyenMaiDto,
  type UpdateLoaiKhuyenMaiDto,
  type PagedResultDto
} from '../services/loaiKhuyenMai.service';

// Hook để lấy danh sách loại khuyến mãi có phân trang và filter
export const useLoaiKhuyenMais = () => {
  return useApiWithParams<PagedResultDto<LoaiKhuyenMaiDto>, {
    page?: number;
    pageSize?: number;
    searchTerm?: string;
  }>(
    async (params) => getAllLoaiKhuyenMais(params),
    null
  );
};

// Hook để lấy danh sách loại khuyến mãi đang hoạt động (không phân trang)
export const useLoaiKhuyenMaisActive = () => {
  return useApiWithParams<LoaiKhuyenMaiDto[], void>(
    async () => getAllLoaiKhuyenMaisActive(),
    null
  );
};

// Hook để lấy thông tin loại khuyến mãi theo ID
export const useLoaiKhuyenMai = (id: string | null) => {
  return useApiWithParams<LoaiKhuyenMaiDto, string>(
    async (id) => getLoaiKhuyenMaiById(id),
    null
  );
};

// Hook để tạo loại khuyến mãi mới
export const useCreateLoaiKhuyenMai = () => {
  return useApiWithParams<string, CreateLoaiKhuyenMaiDto>(
    async (data) => createLoaiKhuyenMai(data),
    null
  );
};

// Hook để cập nhật loại khuyến mãi
export const useUpdateLoaiKhuyenMai = () => {
  return useApiWithParams<void, { id: string; data: UpdateLoaiKhuyenMaiDto }>(
    async ({ id, data }) => updateLoaiKhuyenMai(id, data),
    null
  );
};

// Hook để xóa loại khuyến mãi
export const useDeleteLoaiKhuyenMai = () => {
  return useApiWithParams<void, string>(
    async (id) => deleteLoaiKhuyenMai(id),
    null
  );
}; 

// Hook để lấy danh sách khuyến mãi theo loại
export const useKhuyenMaisByLoai = (id: string | null) => {
  return useApiWithParams<PagedResultDto<any>, {
    id: string;
    page?: number;
    pageSize?: number;
  }>(
    async ({ id, page, pageSize }) => getKhuyenMaisByLoai(id, { page, pageSize }),
    null
  );
}; 