// Re-export types from vaccine service for convenience
export type {
  Vaccine,
  VaccineCreateRequest,
  VaccineUpdateRequest,
  VaccineStatusRequest,
  VaccineUsage,
} from '../services/vaccine.service';

// Additional types for UI components
export interface VaccineFilter {
  searchTerm?: string;
  manufacturer?: string;
  isActive?: boolean;
  minAge?: number;
  maxAge?: number;
}

export interface VaccineSortOption {
  field: 'ten' | 'nhaSanXuat' | 'ngayTao' | 'ngayCapNhat';
  direction: 'asc' | 'desc';
}

export interface VaccineStatistics {
  totalVaccines: number;
  activeVaccines: number;
  inactiveVaccines: number;
  totalManufacturers: number;
  averageAgeRange: number;
  mostUsedVaccine?: string;
}

export interface VaccineFormData {
  ten: string;
  nhaSanXuat?: string;
  tuoiBatDauTiem?: number;
  tuoiKetThucTiem?: number;
  huongDanSuDung?: string;
  phongNgua?: string;
  isActive: boolean;
}

export interface VaccineValidationErrors {
  ten?: string;
  nhaSanXuat?: string;
  tuoiBatDauTiem?: string;
  tuoiKetThucTiem?: string;
  huongDanSuDung?: string;
  phongNgua?: string;
} 