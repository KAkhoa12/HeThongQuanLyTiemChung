import { useApiWithParams } from './useApi';
import { 
  statisticsService, 
  RevenueByLocation, 
  InventoryByLocation, 
  VaccineDetailsByLocation, 
  OverviewStatistics, 
  MonthlyRevenue, 
  StatisticsFilters 
} from '../services/statistics.service';

// Hook để lấy thống kê doanh thu theo địa điểm
export const useRevenueByLocation = () => {
  return useApiWithParams<RevenueByLocation[], StatisticsFilters>(
    async (params) => statisticsService.getRevenueByLocation(params),
    null
  );
};

// Hook để lấy thống kê kho tồn lô theo địa điểm
export const useInventoryByLocation = () => {
  return useApiWithParams<InventoryByLocation[], StatisticsFilters>(
    async (params) => statisticsService.getInventoryByLocation(params),
    null
  );
};

// Hook để lấy thống kê chi tiết vaccine theo địa điểm
export const useVaccineDetailsByLocation = () => {
  return useApiWithParams<VaccineDetailsByLocation[], StatisticsFilters>(
    async (params) => statisticsService.getVaccineDetailsByLocation(params),
    null
  );
};

// Hook để lấy thống kê tổng quan hệ thống
export const useOverviewStatistics = () => {
  return useApiWithParams<OverviewStatistics, StatisticsFilters>(
    async (params) => statisticsService.getOverview(params),
    null
  );
};

// Hook để lấy thống kê doanh thu theo tháng
export const useMonthlyRevenue = () => {
  return useApiWithParams<MonthlyRevenue[], StatisticsFilters>(
    async (params) => statisticsService.getRevenueByMonth(params),
    null
  );
};