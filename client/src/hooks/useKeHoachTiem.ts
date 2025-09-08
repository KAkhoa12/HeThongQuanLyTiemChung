import { useApiWithParams } from './useApi';
import { keHoachTiemService, KeHoachTiemByCustomerResponse, KeHoachTiemByOrderFullResponse, KeHoachTiemMinimumPendingResponse, KeHoachTiemRemainingPendingResponse } from '../services/keHoachTiem.service';

// Hook để lấy kế hoạch tiêm theo đơn hàng
export const useKeHoachTiemByOrder = () => {
  return useApiWithParams<KeHoachTiemByOrderFullResponse, { orderId: string }>(
    async (params) => keHoachTiemService.getByOrder(params.orderId),
    null
  );
};

// Hook để lấy kế hoạch tiêm có mũi thứ nhỏ nhất với trạng thái PENDING theo đơn hàng
export const useKeHoachTiemMinimumPendingByOrder = () => {
  return useApiWithParams<KeHoachTiemMinimumPendingResponse, { orderId: string }>(
    async (params) => keHoachTiemService.getMinimumPendingByOrder(params.orderId),
    null
  );
};

// Hook để kiểm tra kế hoạch tiêm còn PENDING
export const useKeHoachTiemCheckRemainingPending = () => {
  return useApiWithParams<KeHoachTiemRemainingPendingResponse, { orderId: string }>(
    async (params) => keHoachTiemService.checkRemainingPending(params.orderId),
    null
  );
};

// Hook để lấy kế hoạch tiêm theo khách hàng
export const useKeHoachTiemByCustomer = () => {
  return useApiWithParams<KeHoachTiemByCustomerResponse[], { customerId: string }>(
    async (params) => keHoachTiemService.getByCustomer(params.customerId),
    null
  );
};

// Hook để lấy tất cả kế hoạch tiêm (có phân trang)
export const useKeHoachTiemAll = () => {
  return useApiWithParams<
    {
      data: KeHoachTiemByCustomerResponse[];
      totalCount: number;
      page: number;
      pageSize: number;
      totalPages: number;
    },
    {
      page?: number;
      pageSize?: number;
      customerId?: string;
      orderId?: string;
      status?: string;
    }
  >(
    async (params) => keHoachTiemService.getAll(params),
    null
  );
};