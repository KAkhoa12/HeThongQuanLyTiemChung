import apiService from './api.service';
import { DonHangKhuyenMaiDto, CreateDonHangKhuyenMaiRequest } from '../types/donHangKhuyenMai.types';

export const createDonHangKhuyenMai = async (request: CreateDonHangKhuyenMaiRequest): Promise<DonHangKhuyenMaiDto> => {
  return await apiService.create<DonHangKhuyenMaiDto>('/api/DonHangKhuyenMai', request);
};

export const getDonHangKhuyenMaiByMaDonHang = async (maDonHang: string): Promise<DonHangKhuyenMaiDto[]> => {
  return await apiService.get<DonHangKhuyenMaiDto[]>(`/api/DonHangKhuyenMai/donhang/${maDonHang}`);
};

export const getDonHangKhuyenMaiByMaKhuyenMai = async (maKhuyenMai: string): Promise<DonHangKhuyenMaiDto[]> => {
  return await apiService.get<DonHangKhuyenMaiDto[]>(`/api/DonHangKhuyenMai/khuyenmai/${maKhuyenMai}`);
}; 