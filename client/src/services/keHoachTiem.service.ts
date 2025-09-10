import apiService from './api.service';

// Interface cho kế hoạch tiêm
export interface KeHoachTiem {
  maKeHoachTiem: string;
  maNguoiDung: string;
  customerName: string;
  maDichVu: string;
  serviceName: string;
  maVaccine: string;
  vaccineName: string;
  muiThu: number;
  ngayDuKien: string;
  trangThai: string;
  orderInfo: {
    maDonHang: string;
    orderDate: string;
    orderStatus: string;
    totalAmount: number;
  };
}

// Interface cho response của API by-order (thực tế API trả về array)
export interface KeHoachTiemByOrderResponse extends Array<KeHoachTiem> {}

// Interface cho response có cấu trúc đầy đủ (API đã được cập nhật)
export interface KeHoachTiemByOrderFullResponse {
  orderId: string;
  totalPlans: number;
  plans: KeHoachTiem[];
  scheduleByMuiThu: {
    muiThu: number;
    vaccines: {
      maKeHoachTiem: string;
      vaccineName: string;
      muiThu: number;
      ngayDuKien: string | null;
      trangThai: string;
    }[];
    totalVaccines: number;
  }[];
}

// Interface cho response của API minimum-pending-by-order
export interface KeHoachTiemMinimumPendingResponse {
  orderId: string;
  minMuiThu: number;
  totalPlans: number;
  plans: KeHoachTiem[];
}

export interface KeHoachTiemRemainingPendingResponse {
  hasRemainingPending: boolean;
  remainingCount: number;
  nextMuiThu: number | null;
  totalPlans: number;
  completedPlans: number;
}

// Interface cho response của API by-customer
export interface KeHoachTiemByCustomerResponse {
  maKeHoachTiem: string;
  maDichVu: string;
  serviceName: string;
  maVaccine: string;
  vaccineName: string;
  muiThu: number;
  ngayDuKien: string;
  trangThai: string;
  orderId: string;
}

// Service functions
export const keHoachTiemService = {
  // Lấy kế hoạch tiêm theo đơn hàng
  getByOrder: async (orderId: string): Promise<KeHoachTiemByOrderFullResponse> => {
    const response = await apiService.get<KeHoachTiemByOrderFullResponse>(`/api/ke-hoach-tiem/by-order/${orderId}`);
    return response;
  },

  // Lấy kế hoạch tiêm có mũi thứ nhỏ nhất với trạng thái PENDING theo đơn hàng
    getMinimumPendingByOrder: async (orderId: string): Promise<KeHoachTiemMinimumPendingResponse> => {
      return await apiService.get<KeHoachTiemMinimumPendingResponse>(`/api/ke-hoach-tiem/minimum-pending-by-order/${orderId}`);
    },

    checkRemainingPending: async (orderId: string): Promise<KeHoachTiemRemainingPendingResponse> => {
      return await apiService.get<KeHoachTiemRemainingPendingResponse>(`/api/ke-hoach-tiem/check-remaining-pending/${orderId}`);
    },

  // Lấy kế hoạch tiêm theo khách hàng
  getByCustomer: async (customerId: string): Promise<KeHoachTiemByCustomerResponse[]> => {
    return await apiService.get<KeHoachTiemByCustomerResponse[]>(`/api/ke-hoach-tiem/by-customer/${customerId}`);
  },

  // Lấy tất cả kế hoạch tiêm (có phân trang)
  getAll: async (params?: {
    page?: number;
    pageSize?: number;
    customerId?: string;
    orderId?: string;
    status?: string;
  }): Promise<{
    data: KeHoachTiemByCustomerResponse[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }> => {
    return await apiService.get('/api/ke-hoach-tiem', params);
  },

  // Cập nhật trạng thái kế hoạch tiêm
  updateStatus: async (id: string, status: string, note?: string): Promise<void> => {
    return await apiService.update(`/api/ke-hoach-tiem/${id}/status`, { status, note });
  },

  // Kiểm tra xem đơn hàng đã có kế hoạch tiêm chưa
  checkVaccinationPlanExists: async (orderId: string): Promise<{ hasPlans: boolean }> => {
    return await apiService.get(`/api/ke-hoach-tiem/check-exists/${orderId}`);
  }
};