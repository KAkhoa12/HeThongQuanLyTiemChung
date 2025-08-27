// Export all services for easy importing
export * from './auth.service';
export * from './api.service';
export * from './doctor.service';
export * from './doctorSchedule.service';
export * from './location.service';
export * from './user.service';

// Image services - export specific to avoid conflicts
export { default as imageService } from './image.service';
export { default as imageLabelService } from './imageLabel.service';

// Staff and other services
export * from './staff.service';

// Service management exports
export { default as serviceService } from './service.service';
export { 
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  getAllServiceTypes,
  getAllServiceTypesNoPage,
  getServiceTypeById,
  createServiceType,
  updateServiceType,
  deleteServiceType,
  getServicesByType
} from './service.service';
export { default as ServiceHelper } from './serviceHelper.service';

// Vaccine service exports
export { default as vaccineService } from './vaccine.service';
export * from './vaccine.service';

// Service Vaccine service exports
export { default as serviceVaccineService } from './serviceVaccine.service';
export * from './serviceVaccine.service';

// Kho (Inventory) service exports
export { default as phieuNhapService } from './phieuNhap.service';
export { default as phieuXuatService } from './phieuXuat.service';
export { default as phieuThanhLyService } from './phieuThanhLy.service';
export { default as loVaccineService } from './loVaccine.service';
export { default as tonKhoLoService } from './tonKhoLo.service';

// Re-export types for convenience
export type { 
  Service, 
  ServiceType, 
  ServiceDetail,
  ServiceCreateRequest,
  ServiceUpdateRequest,
  ServiceTypeCreateRequest,
  ServiceTypeUpdateRequest
} from '../types/service.types';

// User type exports
export type {
  UserCompleteProfileDto,
  UserProfileUpdateDto,
  HealthInfoDto,
  HealthInfoUpdateDto,
  ChangePasswordDto,
  UserDto,
  UserInfoDto,
  UserCreateDto,
  UserUpdateDto
} from '../types/user.types';

export type {
  Vaccine,
  VaccineCreateRequest,
  VaccineUpdateRequest,
  VaccineStatusRequest,
  VaccineUsage
} from '../types/vaccine.types';

// Kho (Inventory) type exports
export type {
  PhieuNhapDto,
  PhieuNhapDetailDto,
  ChiTietNhapDto,
  PhieuNhapCreateDto,
  ChiTietNhapCreateDto,
  PhieuNhapUpdateDto,
  PhieuNhapQueryParams
} from './phieuNhap.service';

export type {
  PhieuXuatDto,
  PhieuXuatDetailDto,
  ChiTietXuatDto,
  PhieuXuatCreateDto,
  ChiTietXuatCreateDto,
  PhieuXuatUpdateDto,
  PhieuXuatQueryParams
} from './phieuXuat.service';

export type {
  PhieuThanhLyDto,
  PhieuThanhLyDetailDto,
  ChiTietThanhLyDto,
  PhieuThanhLyCreateDto,
  ChiTietThanhLyCreateDto,
  PhieuThanhLyUpdateDto,
  PhieuThanhLyQueryParams
} from './phieuThanhLy.service';

export type {
  LoVaccineDto,
  LoVaccineDetailDto,
  TonKhoLoDto,
  LoVaccineCreateDto,
  LoVaccineUpdateDto,
  LoVaccineQueryParams
} from './loVaccine.service';

export type {
  TonKhoLoDto as TonKhoLoDtoFromService,
  TonKhoLoCreateDto,
  TonKhoLoUpdateDto,
  TonKhoSummaryDto,
  TonKhoLoQueryParams
} from './tonKhoLo.service'; 