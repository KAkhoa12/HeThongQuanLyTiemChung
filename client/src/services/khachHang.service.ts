import apiService from './api.service';

export interface KhachHang {
  maNguoiDung: string;
  ten: string;
  email: string;
  soDienThoai?: string;
  ngaySinh?: string;
  diaChi?: string;
  gioiTinh?: string;
  maAnh?: string;
  isActive?: boolean;
  ngayTao?: string;
  ngayCapNhat?: string;
  thongTinNguoiDung?: ThongTinNguoiDung;
}

export interface ThongTinNguoiDung {
  maThongTin: string;
  maNguoiDung: string;
  chieuCao?: number;
  canNang?: number;
  bmi?: number;
  nhomMau?: string;
  benhNen?: string;
  diUng?: string;
  thuocDangDung?: string;
  tinhTrangMangThai?: boolean;
  ngayKhamGanNhat?: string;
  isActive?: boolean;
  ngayTao?: string;
  ngayCapNhat?: string;
}

export interface CreateKhachHangDto {
  ten: string;
  email: string;
  matKhau: string;
  soDienThoai?: string;
  ngaySinh?: string;
  diaChi?: string;
  gioiTinh?: string;
  maAnh?: string;
  chieuCao?: number;
  canNang?: number;
  nhomMau?: string;
  benhNen?: string;
  diUng?: string;
  thuocDangDung?: string;
  tinhTrangMangThai?: boolean;
  ngayKhamGanNhat?: string;
}

export interface UpdateKhachHangDto {
  ten: string;
  soDienThoai?: string;
  ngaySinh?: string;
  diaChi?: string;
  gioiTinh?: string;
  maAnh?: string;
  isActive?: boolean;
  chieuCao?: number;
  canNang?: number;
  nhomMau?: string;
  benhNen?: string;
  diUng?: string;
  thuocDangDung?: string;
  tinhTrangMangThai?: boolean;
  ngayKhamGanNhat?: string;
}

export interface KhachHangListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  isActive?: boolean;
}

export interface PagedResult<T> {
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  data: T[];
}

class KhachHangService {
  async getAll(params: KhachHangListParams = {}): Promise<PagedResult<KhachHang>> {
    return apiService.get<PagedResult<KhachHang>>('/api/khach-hang', params);
  }

  async getById(id: string): Promise<KhachHang> {
    return apiService.get<KhachHang>(`/api/khach-hang/${id}`);
  }

  async create(data: CreateKhachHangDto): Promise<{ maNguoiDung: string }> {
    return apiService.create<{ maNguoiDung: string }>('/api/khach-hang', data);
  }

  async update(id: string, data: UpdateKhachHangDto): Promise<void> {
    return apiService.update<void>(`/api/khach-hang/${id}`, data);
  }

  async delete(id: string): Promise<void> {
    return apiService.delete<void>(`/api/khach-hang/${id}`);
  }

  async toggleStatus(id: string): Promise<void> {
    return apiService.update<void>(`/api/khach-hang/${id}/toggle-status`, {});
  }
}

export const khachHangService = new KhachHangService();
export default khachHangService;