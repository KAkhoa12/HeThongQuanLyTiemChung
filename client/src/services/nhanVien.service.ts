import apiService from './api.service';

export interface NhanVien {
  maNhanVien: string;
  maNguoiDung?: string;
  chucVu?: string;
  maDiaDiem?: string;
  tenDiaDiem?: string;
  ten?: string;
  email?: string;
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

export interface CreateNhanVienDto {
  ten: string;
  email: string;
  matKhau: string;
  soDienThoai?: string;
  ngaySinh?: string;
  diaChi?: string;
  gioiTinh?: string;
  maAnh?: string;
  chucVu?: string;
  maDiaDiem?: string;
  chieuCao?: number;
  canNang?: number;
  nhomMau?: string;
  benhNen?: string;
  diUng?: string;
  thuocDangDung?: string;
  tinhTrangMangThai?: boolean;
  ngayKhamGanNhat?: string;
}

export interface UpdateNhanVienDto {
  ten: string;
  soDienThoai?: string;
  ngaySinh?: string;
  diaChi?: string;
  gioiTinh?: string;
  maAnh?: string;
  chucVu?: string;
  maDiaDiem?: string;
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

export interface NhanVienListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  maDiaDiem?: string;
  chucVu?: string;
  isActive?: boolean;
}

export interface PagedResult<T> {
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  data: T[];
}

class NhanVienService {
  async getAll(params: NhanVienListParams = {}): Promise<PagedResult<NhanVien>> {
    return apiService.get<PagedResult<NhanVien>>('/api/nhan-vien', params);
  }

  async getById(id: string): Promise<NhanVien> {
    return apiService.get<NhanVien>(`/api/nhan-vien/${id}`);
  }

  async create(data: CreateNhanVienDto): Promise<{ maNhanVien: string; maNguoiDung: string }> {
    return apiService.create<{ maNhanVien: string; maNguoiDung: string }>('/api/nhan-vien', data);
  }

  async update(id: string, data: UpdateNhanVienDto): Promise<void> {
    return apiService.update<void>(`/api/nhan-vien/${id}`, data);
  }

  async delete(id: string): Promise<void> {
    return apiService.delete<void>(`/api/nhan-vien/${id}`);
  }

  async toggleStatus(id: string): Promise<void> {
    return apiService.update<void>(`/api/nhan-vien/${id}/toggle-status`, {});
  }

  async getChucVu(): Promise<string[]> {
    return apiService.get<string[]>('/api/nhan-vien/chuc-vu');
  }
}

export const nhanVienService = new NhanVienService();
export default nhanVienService;