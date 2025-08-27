import { 
  getAllServices, 
  getAllServiceTypes, 
  getAllServiceTypesNoPage,
  getServicesByType,
  createService,
  updateService,
  deleteService,
  createServiceType,
  updateServiceType,
  deleteServiceType
} from './service.service';
import { 
  Service, 
  ServiceType, 
  ServiceCreateRequest, 
  ServiceUpdateRequest,
  ServiceTypeCreateRequest,
  ServiceTypeUpdateRequest
} from '../types/service.types';
import { PagedResponse } from '../types/staff.types';

/**
 * Service Helper for DichVu and LoaiDichVu management
 * Provides high-level operations and business logic
 */

export class ServiceHelper {
  
  /**
   * Get all services with caching and error handling
   */
  static async getServicesWithCache(
    page: number = 1, 
    pageSize: number = 20,
    forceRefresh: boolean = false
  ): Promise<PagedResponse<Service>> {
    try {
      // In a real app, you might implement caching here
      return await getAllServices(page, pageSize);
    } catch (error) {
      console.error('Failed to fetch services:', error);
      throw new Error('Không thể tải danh sách dịch vụ');
    }
  }

  /**
   * Get all service types with caching
   */
  static async getServiceTypesWithCache(
    forceRefresh: boolean = false
  ): Promise<ServiceType[]> {
    try {
      return await getAllServiceTypesNoPage();
    } catch (error) {
      console.error('Failed to fetch service types:', error);
      throw new Error('Không thể tải danh sách loại dịch vụ');
    }
  }

  /**
   * Search services by name or description
   */
  static async searchServices(
    query: string,
    page: number = 1,
    pageSize: number = 20
  ): Promise<PagedResponse<Service>> {
    try {
      // Get all services and filter on client side for now
      // In production, you'd implement server-side search
      const allServices = await getAllServices(page, pageSize);
      
      if (!query.trim()) {
        return allServices;
      }

      const filteredData = allServices.data.filter(service => 
        service.name.toLowerCase().includes(query.toLowerCase()) ||
        (service.description && service.description.toLowerCase().includes(query.toLowerCase()))
      );

      return {
        ...allServices,
        data: filteredData,
        totalCount: filteredData.length
      };
    } catch (error) {
      console.error('Search failed:', error);
      throw new Error('Tìm kiếm dịch vụ thất bại');
    }
  }

  /**
   * Get services by type with validation
   */
  static async getServicesByTypeWithValidation(
    typeId: string,
    page: number = 1,
    pageSize: number = 20
  ): Promise<PagedResponse<Service>> {
    if (!typeId) {
      throw new Error('ID loại dịch vụ không được để trống');
    }

    try {
      return await getServicesByType(typeId, page, pageSize);
    } catch (error) {
      console.error('Failed to fetch services by type:', error);
      throw new Error('Không thể tải dịch vụ theo loại');
    }
  }

  /**
   * Create service with validation
   */
  static async createServiceWithValidation(
    serviceData: ServiceCreateRequest
  ): Promise<{ id: string }> {
    // Validate required fields
    if (!serviceData.name?.trim()) {
      throw new Error('Tên dịch vụ không được để trống');
    }

    if (serviceData.price !== undefined && serviceData.price < 0) {
      throw new Error('Giá dịch vụ không được âm');
    }

    try {
      return await createService(serviceData);
    } catch (error) {
      console.error('Failed to create service:', error);
      throw new Error('Tạo dịch vụ thất bại');
    }
  }

  /**
   * Update service with validation
   */
  static async updateServiceWithValidation(
    id: string,
    serviceData: ServiceUpdateRequest
  ): Promise<void> {
    if (!id) {
      throw new Error('ID dịch vụ không được để trống');
    }

    if (serviceData.name !== undefined && !serviceData.name.trim()) {
      throw new Error('Tên dịch vụ không được để trống');
    }

    if (serviceData.price !== undefined && serviceData.price < 0) {
      throw new Error('Giá dịch vụ không được âm');
    }

    try {
      await updateService(id, serviceData);
    } catch (error) {
      console.error('Failed to update service:', error);
      throw new Error('Cập nhật dịch vụ thất bại');
    }
  }

  /**
   * Delete service with confirmation
   */
  static async deleteServiceWithConfirmation(
    id: string,
    confirmMessage: string = 'Bạn có chắc chắn muốn xóa dịch vụ này?'
  ): Promise<boolean> {
    if (!id) {
      throw new Error('ID dịch vụ không được để trống');
    }

    // In a real app, you might show a confirmation dialog here
    const confirmed = window.confirm(confirmMessage);
    if (!confirmed) {
      return false;
    }

    try {
      await deleteService(id);
      return true;
    } catch (error) {
      console.error('Failed to delete service:', error);
      throw new Error('Xóa dịch vụ thất bại');
    }
  }

  /**
   * Create service type with validation
   */
  static async createServiceTypeWithValidation(
    typeData: ServiceTypeCreateRequest
  ): Promise<{ id: string }> {
    if (!typeData.name?.trim()) {
      throw new Error('Tên loại dịch vụ không được để trống');
    }

    try {
      return await createServiceType(typeData);
    } catch (error) {
      console.error('Failed to create service type:', error);
      throw new Error('Tạo loại dịch vụ thất bại');
    }
  }

  /**
   * Update service type with validation
   */
  static async updateServiceTypeWithValidation(
    id: string,
    typeData: ServiceTypeUpdateRequest
  ): Promise<void> {
    if (!id) {
      throw new Error('ID loại dịch vụ không được để trống');
    }

    if (typeData.name !== undefined && !typeData.name.trim()) {
      throw new Error('Tên loại dịch vụ không được để trống');
    }

    try {
      await updateServiceType(id, typeData);
    } catch (error) {
      console.error('Failed to update service type:', error);
      throw new Error('Cập nhật loại dịch vụ thất bại');
    }
  }

  /**
   * Delete service type with validation
   */
  static async deleteServiceTypeWithValidation(
    id: string,
    confirmMessage: string = 'Bạn có chắc chắn muốn xóa loại dịch vụ này?'
  ): Promise<boolean> {
    if (!id) {
      throw new Error('ID loại dịch vụ không được để trống');
    }

    const confirmed = window.confirm(confirmMessage);
    if (!confirmed) {
      return false;
    }

    try {
      await deleteServiceType(id);
      return true;
    } catch (error) {
      console.error('Failed to delete service type:', error);
      throw new Error('Xóa loại dịch vụ thất bại');
    }
  }

  /**
   * Get service statistics
   */
  static async getServiceStatistics(): Promise<{
    totalServices: number;
    totalTypes: number;
    averagePrice: number;
  }> {
    try {
      const [services, types] = await Promise.all([
        getAllServices(1, 1000), // Get all services for stats
        getAllServiceTypesNoPage()
      ]);

      const totalServices = services.totalCount;
      const totalTypes = types.length;
      const averagePrice = services.data.length > 0 
        ? services.data.reduce((sum, service) => sum + (service.price || 0), 0) / services.data.length
        : 0;

      return {
        totalServices,
        totalTypes,
        averagePrice
      };
    } catch (error) {
      console.error('Failed to get service statistics:', error);
      throw new Error('Không thể tải thống kê dịch vụ');
    }
  }
}

export default ServiceHelper; 