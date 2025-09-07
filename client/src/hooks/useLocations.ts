import { useApiWithParams } from './useApi';
import { getAllLocations, getAllLocationsNoPage, getLocationById, PagedLocationResult } from '../services/location.service';
import { LocationDto, LocationDetailDto } from '../services/location.service';

// Hook để lấy danh sách locations có phân trang
export const useLocations = () => {
  return useApiWithParams<PagedLocationResult, {
    page?: number;
    pageSize?: number;
  }>(
    async (params) => getAllLocations(params.page || 1, params.pageSize || 20),
    null
  );
};

// Hook để lấy tất cả locations không phân trang
export const useAllLocations = () => {
  return useApiWithParams<LocationDto[], void>(getAllLocationsNoPage, null);
};

// Hook để lấy chi tiết location theo ID
export const useLocation = () => {
  return useApiWithParams<LocationDetailDto, string>(
    async (id) => getLocationById(id),
    null
  );
}; 