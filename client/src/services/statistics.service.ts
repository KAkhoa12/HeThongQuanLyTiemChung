import apiService from './api.service';

// Interfaces cho thống kê doanh thu theo địa điểm
export interface RevenueByLocation {
  locationId: string;
  locationName: string;
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
}

// Interfaces cho thống kê kho tồn lô theo địa điểm
export interface InventoryByLocation {
  locationId: string;
  locationName: string;
  totalLots: number;
  totalQuantity: number;
  totalValue: number;
  expiredLots: number;
  expiringSoonLots: number;
}

// Interfaces cho thống kê chi tiết vaccine theo địa điểm
export interface VaccineDetailsByLocation {
  locationId: string;
  locationName: string;
  vaccineId: string;
  vaccineName: string;
  lotNumber: string;
  quantity: number;
  unitPrice: number;
  totalValue: number;
  expiryDate: string;
  isExpired: boolean;
  isExpiringSoon: boolean;
}

// Interfaces cho thống kê tổng quan
export interface OverviewStatistics {
  revenue: RevenueStatistics;
  inventory: InventoryStatistics;
  appointments: AppointmentStatistics;
  dateRange: DateRange;
}

export interface RevenueStatistics {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
}

export interface InventoryStatistics {
  totalValue: number;
  totalLots: number;
}

export interface AppointmentStatistics {
  totalAppointments: number;
  completedAppointments: number;
  completionRate: number;
}

export interface DateRange {
  fromDate: string;
  toDate: string;
}

// Interfaces cho thống kê doanh thu theo tháng
export interface MonthlyRevenue {
  year: number;
  month: number;
  monthName: string;
  totalRevenue: number;
  totalOrders: number;
}

// Filters cho các API
export interface StatisticsFilters {
  fromDate?: string;
  toDate?: string;
  locationId?: string;
  year?: number;
}

// Statistics Service
export const statisticsService = {
  // Lấy thống kê doanh thu theo địa điểm
  getRevenueByLocation: async (filters: StatisticsFilters = {}): Promise<RevenueByLocation[]> => {
    const params = new URLSearchParams();
    
    if (filters.fromDate) params.append('fromDate', filters.fromDate);
    if (filters.toDate) params.append('toDate', filters.toDate);
    if (filters.locationId) params.append('locationId', filters.locationId);
    
    const url = `/api/statistics/revenue-by-location?${params.toString()}`;
    return await apiService.get<RevenueByLocation[]>(url);
  },

  // Lấy thống kê kho tồn lô theo địa điểm
  getInventoryByLocation: async (filters: StatisticsFilters = {}): Promise<InventoryByLocation[]> => {
    const params = new URLSearchParams();
    
    if (filters.locationId) params.append('locationId', filters.locationId);
    
    const url = `/api/statistics/inventory-by-location?${params.toString()}`;
    return await apiService.get<InventoryByLocation[]>(url);
  },

  // Lấy thống kê chi tiết vaccine theo địa điểm
  getVaccineDetailsByLocation: async (filters: StatisticsFilters = {}): Promise<VaccineDetailsByLocation[]> => {
    const params = new URLSearchParams();
    
    if (filters.locationId) params.append('locationId', filters.locationId);
    
    const url = `/api/statistics/vaccine-details-by-location?${params.toString()}`;
    return await apiService.get<VaccineDetailsByLocation[]>(url);
  },

  // Lấy thống kê tổng quan hệ thống
  getOverview: async (filters: StatisticsFilters = {}): Promise<OverviewStatistics> => {
    const params = new URLSearchParams();
    
    if (filters.fromDate) params.append('fromDate', filters.fromDate);
    if (filters.toDate) params.append('toDate', filters.toDate);
    
    const url = `/api/statistics/overview?${params.toString()}`;
    return await apiService.get<OverviewStatistics>(url);
  },

  // Lấy thống kê doanh thu theo tháng
  getRevenueByMonth: async (filters: StatisticsFilters = {}): Promise<MonthlyRevenue[]> => {
    const params = new URLSearchParams();
    
    if (filters.year) params.append('year', filters.year.toString());
    if (filters.locationId) params.append('locationId', filters.locationId);
    
    const url = `/api/statistics/revenue-by-month?${params.toString()}`;
    return await apiService.get<MonthlyRevenue[]>(url);
  }
};