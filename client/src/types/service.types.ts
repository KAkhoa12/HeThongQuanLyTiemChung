export interface Service {
  id: string;
  name: string;
  description?: string;
  price?: number;
  serviceTypeId?: string;
  serviceTypeName?: string;
  createdAt: string;
}

export interface ServiceDetail extends Service {
  images: ServiceImage[];
  vaccines?: ServiceVaccine[];
}

export interface ServiceImage {
  imageId?: string;
  imageUrl?: string;
  order: number;
  isMain: boolean;
}

export interface ServiceVaccine {
  id: string;
  vaccineId: string;
  vaccineName: string;
  standardDoses: number;
  notes?: string;
}

export interface ServiceCreateRequest {
  name: string;
  description?: string;
  price?: number;
  serviceTypeId?: string;
}

export interface ServiceUpdateRequest {
  name?: string;
  description?: string;
  price?: number;
  serviceTypeId?: string;
}

export interface ServiceImageUpdateRequest {
  imageId: string;
  order: number;
  isMain: boolean;
}

export interface ServiceType {
  id: string;
  name: string;
  createdAt: string;
}

export interface ServiceTypeDetail extends ServiceType {
  services: ServiceBasic[];
}

export interface ServiceBasic {
  id: string;
  name: string;
  description?: string;
  price?: number;
}

export interface ServiceTypeCreateRequest {
  name: string;
}

export interface ServiceTypeUpdateRequest {
  name?: string;
}

export interface ServiceVaccineCreateRequest {
  serviceId: string;
  vaccineId: string;
  standardDoses: number;
  notes?: string;
}

export interface ServiceVaccineUpdateRequest {
  standardDoses?: number;
  notes?: string;
}

export interface Vaccine {
  id: string;
  name: string;
  manufacturer?: string;
  startAge?: number;
  endAge?: number;
  prevention?: string;
  createdAt: string;
}

export interface VaccineDetail extends Vaccine {
  usage?: string;
  images: VaccineImage[];
}

export interface VaccineImage {
  imageId?: string;
  imageUrl?: string;
  order: number;
  isMain: boolean;
}

export interface VaccineCreateRequest {
  name: string;
  manufacturer?: string;
  startAge?: number;
  endAge?: number;
  usage?: string;
  prevention?: string;
}

export interface VaccineUpdateRequest {
  name?: string;
  manufacturer?: string;
  startAge?: number;
  endAge?: number;
  usage?: string;
  prevention?: string;
}

export interface VaccineImageUpdateRequest {
  imageId: string;
  order: number;
  isMain: boolean;
}