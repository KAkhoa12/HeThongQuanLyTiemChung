import apiService from './api.service';

export interface LichHen {
  maLichHen: string;
  maDonHang: string;
  customerName: string;
  maDiaDiem: string;
  locationName: string;
  ngayHen: string;
  trangThai: string;
  ghiChu?: string;
  ngayTao: string;
}

export interface LichHenResponse {
  data: LichHen[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface LichHenFilters {
  page?: number;
  pageSize?: number;
  trangThai?: string;
  maDiaDiem?: string;
  fromDate?: string;
  toDate?: string;
  orderId?: string;
  userId?: string;
}

// Lấy danh sách lịch hẹn với phân trang và filter
export const getLichHens = async (filters: LichHenFilters = {}): Promise<LichHenResponse> => {
  const params = new URLSearchParams();
  
  if (filters.page) params.append('page', filters.page.toString());
  if (filters.pageSize) params.append('pageSize', filters.pageSize.toString());
  if (filters.trangThai) params.append('status', filters.trangThai);
  if (filters.maDiaDiem) params.append('locationId', filters.maDiaDiem);
  if (filters.fromDate) params.append('fromDate', filters.fromDate);
  if (filters.toDate) params.append('toDate', filters.toDate);
  if (filters.orderId) params.append('orderId', filters.orderId);
  if (filters.userId) params.append('userId', filters.userId);

  const url = `/api/lich-hen?${params.toString()}`;
  console.log('getLichHens - calling API:', url);
  console.log('getLichHens - filters:', filters);
  
  const result = await apiService.get<LichHenResponse>(url);
  console.log('getLichHens - API result:', result);
  console.log('getLichHens - result type:', typeof result);
  console.log('getLichHens - result keys:', Object.keys(result || {}));
  
  return result;
};

// Lấy chi tiết lịch hẹn theo ID
export const getLichHenById = async (id: string): Promise<LichHen> => {
  return await apiService.get<LichHen>(`/api/lich-hen/${id}`);
};

// Cập nhật trạng thái lịch hẹn
export const updateLichHenStatus = async (id: string, trangThai: string, ghiChu?: string): Promise<LichHen> => {
  return await apiService.update<LichHen>(`/api/lich-hen/${id}/status`, {
    trangThai,
    ghiChu
  });
};

// Xóa lịch hẹn (soft delete)
export const deleteLichHen = async (id: string): Promise<void> => {
  return await apiService.delete(`/api/lich-hen/${id}`);
};