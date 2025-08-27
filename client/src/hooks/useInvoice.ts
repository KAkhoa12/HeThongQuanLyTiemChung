import { useState, useCallback, useEffect } from 'react';
import { useOrders, useOrder, useUpdateOrderStatus } from './useOrders';
import { OrderDetail } from '../services/order.service';

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
  const [invoices, setInvoices] = useState<OrderDetail[]>([]);
  const [currentInvoice, setCurrentInvoice] = useState<OrderDetail | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [updating, setUpdating] = useState(false);

  // Sử dụng custom hooks theo đúng pattern
  const { orders, loading, error, execute: executeGetOrders } = useOrders();
  const { order: currentOrder, fetchOrder } = useOrder();
  const { updateStatus, loading: updatingStatus } = useUpdateOrderStatus();

  // Lấy danh sách hóa đơn
  const fetchInvoices = useCallback(async () => {
    try {
      // Sử dụng custom hook để gọi API
      await executeGetOrders();
    } catch (error) {
      console.error('Lỗi khi tải danh sách hóa đơn:', error);
    }
  }, [executeGetOrders]);

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
      setUpdating(true);
      // Sử dụng custom hook để gọi API
      await updateStatus(id, status);
      
      // Refresh data
      await fetchInvoices();
      if (currentInvoice?.maDonHang === id) {
        await fetchInvoiceById(id);
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái:', error);
    } finally {
      setUpdating(false);
    }
  }, [updateStatus, fetchInvoices, fetchInvoiceById, currentInvoice]);

  // Reset filters
  const resetFilters = useCallback(() => {
    setSearchTerm('');
    setStatusFilter('all');
    setCurrentPage(1);
  }, []);

  // Auto fetch khi thay đổi filters
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