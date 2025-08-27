import apiService from './api.service';

export interface LocationDto {
  id: string;
  name: string;
  address: string;
  phone?: string;
  email?: string;
  description?: string;
  openingHours?: string;
  capacity?: number;
  type?: string;
  createdAt: string;
}

export interface LocationDetailDto extends LocationDto {
  images: Array<{
    imageId: string;
    url: string;
    order: number;
  }>;
}

export interface PagedLocationResult {
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  data: LocationDto[];
}

// Lấy tất cả địa điểm với phân trang
export const getAllLocations = async (
  page: number = 1,
  pageSize: number = 20
): Promise<PagedLocationResult> => {
  const response = await apiService.get<PagedLocationResult>('/api/locations', {
    page,
    pageSize
  });
  
  // API trả về trong format PagedLocationResult
  return response;
};

// Lấy tất cả địa điểm không phân trang (cho dropdown, select...)
export const getAllLocationsNoPage = async (): Promise<LocationDto[]> => {
  const response = await apiService.get<{ data: LocationDto[] }>('/api/locations', {
    page: 1,
    pageSize: 1000 // Lấy tất cả
  });
  
  // apiService đã extract payload, response là PagedResultDto<LocationDto>
  // Chúng ta cần truy cập data field
  return response?.data || [];
};

// Lấy chi tiết địa điểm theo ID
export const getLocationById = async (id: string): Promise<LocationDetailDto> => {
  return await apiService.get<LocationDetailDto>(`/api/locations/${id}`);
};

// Tạo địa điểm mới
export const createLocation = async (data: {
  name: string;
  address: string;
  phone?: string;
  email?: string;
  description?: string;
  openingHours?: string;
  capacity?: number;
  type?: string;
}): Promise<{ id: string }> => {
  return await apiService.create<{ id: string }>('/api/locations', data);
};

// Cập nhật địa điểm
export const updateLocation = async (
  id: string,
  data: Partial<{
    name: string;
    address: string;
    phone: string;
    email: string;
    description: string;
    openingHours: string;
    capacity: number;
    type: string;
  }>
): Promise<void> => {
  return await apiService.update<void>(`/api/locations/${id}`, data);
};

// Xóa địa điểm
export const deleteLocation = async (id: string): Promise<void> => {
  return await apiService.delete<void>(`/api/locations/${id}`);
}; 