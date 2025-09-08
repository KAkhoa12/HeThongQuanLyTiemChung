import { useApiWithParams } from './useApi';
import { getAllOrders, getOrderById, updateOrderStatus, OrderDetail, InvoiceListParams, InvoiceListResponse } from '../services/order.service';

// Hook để lấy danh sách đơn hàng
export const useOrders = () => {
  const { data, loading, error, execute, reset } = useApiWithParams<InvoiceListResponse, InvoiceListParams>(getAllOrders, null);
  
  // Xử lý data từ API với pagination
  const response = data || { data: [], totalCount: 0, page: 1, pageSize: 10, totalPages: 1 };
  
  return {
    orders: Array.isArray(response.data) ? response.data : [],
    totalCount: response.totalCount || 0,
    page: response.page || 1,
    pageSize: response.pageSize || 10,
    totalPages: response.totalPages || 1,
    loading,
    error,
    execute,
    reset
  };
};

// Hook để lấy đơn hàng theo ID
export const useOrder = (orderId?: string) => {
  const { data, loading, error, execute, reset } = useApiWithParams(getOrderById, null);
  
  const fetchOrder = (id: string) => {
    execute(id);
  };
  
  return {
    order: data,
    loading,
    error,
    fetchOrder,
    reset
  };
};

// Hook để cập nhật trạng thái đơn hàng
export const useUpdateOrderStatus = () => {
  const { data, loading, error, execute, reset } = useApiWithParams<boolean, { orderId: string; status: string }>(
    async ({ orderId, status }) => updateOrderStatus(orderId, status), null
  );
  
  const updateStatus = (orderId: string, status: string) => {
    execute({ orderId, status });
  };
  
  return {
    result: data,
    loading,
    error,
    updateStatus,
    reset
  };
}; 