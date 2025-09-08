import { useState, useCallback, useEffect } from 'react';
import { useOrders, useOrder, useUpdateOrderStatus } from './useOrders';
import { OrderDetail, InvoiceListParams } from '../services/order.service';

interface UseInvoiceReturn {
  // State
  invoices: OrderDetail[];
  currentInvoice: OrderDetail | null;
  loading: boolean;
  updating: boolean;
  error: string | null;
  
  // Pagination
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
  
  // Filters
  searchTerm: string;
  statusFilter: string;
  
  // Actions
  fetchInvoices: () => Promise<void>;
  fetchInvoiceById: (id: string) => Promise<void>;
  updateInvoiceStatus: (id: string, status: string) => Promise<void>;
  setSearchTerm: (term: string) => void;
  setStatusFilter: (status: string) => void;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  resetFilters: () => void;
}

export const useInvoice = (): UseInvoiceReturn => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Sử dụng custom hooks theo đúng pattern
  const { orders, totalCount, totalPages, loading, error, execute: executeGetOrders } = useOrders();
  const { order: currentOrder, fetchOrder } = useOrder();
  const { updateStatus, loading: updatingStatus } = useUpdateOrderStatus();

  // Lấy danh sách hóa đơn với parameters
  const fetchInvoices = useCallback(async () => {
    try {
      const params: InvoiceListParams = {
        page: currentPage,
        pageSize: pageSize,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        search: searchTerm || undefined
      };
      // Sử dụng custom hook để gọi API với parameters
      await executeGetOrders(params);
    } catch (error) {
      console.error('Lỗi khi tải danh sách hóa đơn:', error);
    }
  }, [executeGetOrders, currentPage, pageSize, statusFilter, searchTerm]);

  // Lấy chi tiết hóa đơn theo ID
  const fetchInvoiceById = useCallback(async (id: string) => {
    try {
      // Sử dụng custom hook để gọi API
      await fetchOrder(id);
    } catch (error) {
      console.error('Lỗi khi tải chi tiết hóa đơn:', error);
    }
  }, [fetchOrder]);

  // Cập nhật trạng thái hóa đơn
  const updateInvoiceStatus = useCallback(async (id: string, status: string) => {
    try {
      // Sử dụng custom hook để gọi API
      await updateStatus(id, status);
      
      // Refresh data
      await fetchInvoices();
      if (currentOrder?.maDonHang === id) {
        await fetchInvoiceById(id);
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái:', error);
    }
  }, [updateStatus, fetchInvoices, fetchInvoiceById, currentOrder]);

  // Reset filters
  const resetFilters = useCallback(() => {
    setSearchTerm('');
    setStatusFilter('all');
    setCurrentPage(1);
  }, []);

  // Auto fetch khi thay đổi filters hoặc pagination
  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  return {
    // State
    invoices: orders, // Sử dụng orders từ useOrders hook
    currentInvoice: currentOrder, // Sử dụng currentOrder từ useOrder hook
    loading, // Sử dụng loading từ useOrders hook
    updating: updatingStatus, // Sử dụng updatingStatus từ useUpdateOrderStatus hook
    error, // Sử dụng error từ useOrders hook
    
    // Pagination
    currentPage,
    totalPages,
    pageSize,
    totalCount,
    
    // Filters
    searchTerm,
    statusFilter,
    
    // Actions
    fetchInvoices,
    fetchInvoiceById,
    updateInvoiceStatus,
    setSearchTerm,
    setStatusFilter,
    setCurrentPage,
    setPageSize,
    resetFilters,
  };
}; 