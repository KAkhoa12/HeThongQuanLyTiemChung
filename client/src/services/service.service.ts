import apiService from './api.service';

// DTOs
export interface ServiceDto {
  id: string;
  name: string;
  description?: string;
  price?: number;
  serviceTypeId?: string;
  serviceTypeName?: string;
  createdAt: string;
}

export interface ServiceDetailDto {
  id: string;
  name: string;
  description?: string;
  price?: number;
  serviceTypeId?: string;
  serviceTypeName?: string;
  createdAt: string;
  images: ServiceImageDto[];
  vaccines?: ServiceVaccineDto[];
}

export interface ServiceImageDto {
  imageId?: string;
  imageUrl?: string;
  order: number;
  isMain: boolean;
}

export interface ServiceVaccineDto {
  id: string;
  vaccineId: string;
  vaccineName: string;
  standardDoses: number;
  notes?: string;
}

export interface ServiceCreateDto {
  name: string;
  description?: string;
  price?: number;
  serviceTypeId?: string;
}

export interface ServiceUpdateDto {
  name?: string;
  description?: string;
  price?: number;
  serviceTypeId?: string;
}

// Service methods
class ServiceService {
  // Lấy tất cả dịch vụ (paging)
  async getAll(page: number = 1, pageSize: number = 20): Promise<any> {
    return await apiService.get(`/api/services?page=${page}&pageSize=${pageSize}`);
  }

  // Lấy tất cả dịch vụ (không paging)
  async getAllNoPage(): Promise<any> {
    return await apiService.get('/api/services/all');
  }

  // Lấy dịch vụ theo ID
  async getById(id: string): Promise<any> {
    return await apiService.get(`/api/services/${id}`);
  }

  // Tạo dịch vụ mới
  async create(data: ServiceCreateDto): Promise<any> {
    return await apiService.post('/api/services', data);
  }

  // Cập nhật dịch vụ
  async update(id: string, data: ServiceUpdateDto): Promise<any> {
    return await apiService.put(`/api/services/${id}`, data);
  }

  // Xóa dịch vụ
  async delete(id: string): Promise<any> {
    return await apiService.delete(`/api/services/${id}`);
  }

  // Lấy tất cả loại dịch vụ (có paging)
  async getAllServiceTypes(page: number = 1, pageSize: number = 20): Promise<any> {
    return await apiService.get(`/api/service-types?page=${page}&pageSize=${pageSize}`);
  }

  // Lấy tất cả loại dịch vụ (không paging)
  async getAllServiceTypesNoPage(): Promise<any> {
    return await apiService.get('/api/service-types/all');
  }

  // Lấy loại dịch vụ theo ID
  async getServiceTypeById(id: string): Promise<any> {
    return await apiService.get(`/api/service-types/${id}`);
  }

  // Tạo loại dịch vụ mới
  async createServiceType(data: any): Promise<any> {
    return await apiService.post('/api/service-types', data);
  }

  // Cập nhật loại dịch vụ
  async updateServiceType(id: string, data: any): Promise<any> {
    return await apiService.put(`/api/service-types/${id}`, data);
  }

  // Xóa loại dịch vụ
  async deleteServiceType(id: string): Promise<any> {
    return await apiService.delete(`/api/service-types/${id}`);
  }
  
  // Lấy dịch vụ theo loại
  async getByType(typeId: string, page: number = 1, pageSize: number = 20): Promise<any> {
    return await apiService.get(`/api/services/by-type/${typeId}?page=${page}&pageSize=${pageSize}`);
  }
}

const serviceService = new ServiceService();

// Export các method riêng lẻ để tương thích với code cũ
export const getAllServices = (page: number = 1, pageSize: number = 20) => 
  serviceService.getAll(page, pageSize);

export const getAllServicesNoPage = () => 
  serviceService.getAllNoPage();

export const getServiceById = (id: string) => 
  serviceService.getById(id);

export const createService = (data: ServiceCreateDto) => 
  serviceService.create(data);

export const updateService = (id: string, data: ServiceUpdateDto) => 
  serviceService.update(id, data);

export const deleteService = (id: string) => 
  serviceService.delete(id);

export const getAllServiceTypes = (page: number = 1, pageSize: number = 20) => 
  serviceService.getAllServiceTypes(page, pageSize);

export const getAllServiceTypesNoPage = () => 
  serviceService.getAllServiceTypesNoPage();

export const getServiceTypeById = (id: string) => 
  serviceService.getServiceTypeById(id);

export const createServiceType = (data: any) => 
  serviceService.createServiceType(data);

export const updateServiceType = (id: string, data: any) => 
  serviceService.updateServiceType(id, data);

export const deleteServiceType = (id: string) => 
  serviceService.deleteServiceType(id);

export const getServicesByType = (typeId: string, page: number = 1, pageSize: number = 20) => 
  serviceService.getByType(typeId, page, pageSize);

export default serviceService;