import { useApiWithParams } from './useApi';
import apiService from '../services/api.service';

// Hook for expiring soon vaccines
export const useTonKhoExpiringSoon = (params: {
  daysAhead?: number;
  maDiaDiem?: string;
}) => {
  return useApiWithParams<any[], { daysAhead?: number; maDiaDiem?: string }>( 
    async (p) => apiService.get('/api/ton-kho-lo/expiring-soon', p),
    []
  );
};

// Hook for low stock vaccines
export const useTonKhoLowStock = (params: {
  threshold?: number;
  maDiaDiem?: string;
}) => {
  return useApiWithParams<any[], { threshold?: number; maDiaDiem?: string }>(
    async (p) => apiService.get('/api/ton-kho-lo/low-stock', p),
    []
  );
};

// Hook for available vaccines for export
export const useTonKhoAvailableForExport = (params: {
  maDiaDiem: string;
  maVaccine?: string;
}) => {
  return useApiWithParams<any[], { maDiaDiem: string; maVaccine?: string }>(
    async (p) => apiService.get('/api/ton-kho-lo/available-for-export', p),
    []
  );
};

// Hook for inventory statistics
export const useTonKhoStatistics = (params: {
  tuNgay?: Date;
  denNgay?: Date;
  maDiaDiem?: string;
}) => {
  return useApiWithParams<any, { tuNgay?: string; denNgay?: string; maDiaDiem?: string }>(
    async (p) => apiService.get('/api/ton-kho-lo/statistics', p),
    null
  );
};

// Hook for pending approval items
export const usePhieuNhapPending = (params: {
  page?: number;
  pageSize?: number;
} = {}) => {
  return useApiWithParams<any, { page?: number; pageSize?: number }>(
    async (p) => apiService.get('/api/phieu-nhap/pending', p),
    null
  );
};

export const usePhieuXuatPending = (params: {
  page?: number;
  pageSize?: number;
} = {}) => {
  return useApiWithParams<any, { page?: number; pageSize?: number }>(
    async (p) => apiService.get('/api/phieu-xuat/pending', p),
    null
  );
};

export const usePhieuThanhLyPending = (params: {
  page?: number;
  pageSize?: number;
} = {}) => {
  return useApiWithParams<any, { page?: number; pageSize?: number }>(
    async (p) => apiService.get('/api/phieu-thanh-ly/pending', p),
    null
  );
};

// Hook for approval actions
export const useApprovePhieuNhap = () => {
  return useApiWithParams<any, { id: string }>(
    async (params: { id: string }) => apiService.post(`/api/phieu-nhap/${params.id}/confirm`),
    null
  );
};

export const useRejectPhieuNhap = () => {
  return useApiWithParams<any, { id: string; lyDo: string }>(
    async (params: { id: string; lyDo: string }) => 
      apiService.post(`/api/phieu-nhap/${params.id}/reject`, { lyDo: params.lyDo }),
    null
  );
};

export const useApprovePhieuXuat = () => {
  return useApiWithParams<any, { id: string }>(
    async (params: { id: string }) => apiService.post(`/api/phieu-xuat/${params.id}/confirm`),
    null
  );
};

export const useRejectPhieuXuat = () => {
  return useApiWithParams<any, { id: string; lyDo: string }>(
    async (params: { id: string; lyDo: string }) => 
      apiService.post(`/api/phieu-xuat/${params.id}/reject`, { lyDo: params.lyDo }),
    null
  );
};

export const useApprovePhieuThanhLy = () => {
  return useApiWithParams<any, { id: string }>(
    async (params: { id: string }) => apiService.post(`/api/phieu-thanh-ly/${params.id}/confirm`),
    null
  );
};

export const useRejectPhieuThanhLy = () => {
  return useApiWithParams<any, { id: string; lyDo: string }>(
    async (params: { id: string; lyDo: string }) => 
      apiService.post(`/api/phieu-thanh-ly/${params.id}/reject`, { lyDo: params.lyDo }),
    null
  );
};