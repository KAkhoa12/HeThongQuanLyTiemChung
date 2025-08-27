import apiService from './api.service';

// DTOs
export interface ServiceVaccineDto {
  maDichVuVaccine: string;
  maVaccine: string;
  tenVaccine: string;
  soMuiChuan: number;
  ghiChu?: string;
}

export interface ServiceVaccineCreateDto {
  maDichVu: string;
  maVaccine: string;
  soMuiChuan: number;
  ghiChu?: string;
}

export interface ServiceVaccineUpdateDto {
  soMuiChuan?: number;
  ghiChu?: string;
}

// Service methods
class ServiceVaccineService {
  // Lấy vaccine theo dịch vụ
  async getByServiceId(serviceId: string): Promise<ServiceVaccineDto[]> {
    return await apiService.get(`/api/service-vaccines/by-service/${serviceId}`);
  }

  // Thêm vaccine vào dịch vụ
  async addVaccineToService(data: ServiceVaccineCreateDto): Promise<any> {
    return await apiService.create('/api/service-vaccines', data);
  }

  // Cập nhật thông tin vaccine trong dịch vụ
  async update(id: string, data: ServiceVaccineUpdateDto): Promise<any> {
    return await apiService.update(`/api/service-vaccines/${id}`, data);
  }

  // Xóa vaccine khỏi dịch vụ
  async delete(id: string): Promise<any> {
    return await apiService.delete(`/api/service-vaccines/${id}`);
  }
}

export default new ServiceVaccineService(); 