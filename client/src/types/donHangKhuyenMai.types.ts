export interface DonHangKhuyenMaiDto {
  maDonHangKhuyenMai: string;
  maDonHang: string;
  maKhuyenMai: string;
  giamGiaGoc?: number;
  giamGiaThucTe?: number;
  ngayApDung?: string;
  isDelete?: boolean;
  isActive?: boolean;
  ngayTao?: string;
  ngayCapNhat?: string;
}

export interface CreateDonHangKhuyenMaiRequest {
  maDonHang: string;
  maKhuyenMai: string;
  giamGiaGoc: number;
  giamGiaThucTe: number;
} 