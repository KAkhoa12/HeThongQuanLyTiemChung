import axios from 'axios';
import API_CONFIG from '../config/api.config';
import { ApiResponse, PagedResponse } from '../types/staff.types';
import { 
  Service, 
  ServiceCreateRequest, 
  ServiceDetail, 
  ServiceImageUpdateRequest, 
  ServiceType,
  ServiceTypeCreateRequest,
  ServiceTypeDetail,
  ServiceTypeUpdateRequest,
  ServiceUpdateRequest,
  ServiceVaccine,
  ServiceVaccineCreateRequest,
  ServiceVaccineUpdateRequest,
  Vaccine,
  VaccineCreateRequest,
  VaccineDetail,
  VaccineImageUpdateRequest,
  VaccineUpdateRequest
} from '../types/service.types';

const SERVICE_BASE_URL = `${API_CONFIG.BASE_URL}${API_CONFIG.SERVICE.BASE}`;
const SERVICE_TYPE_BASE_URL = `${API_CONFIG.BASE_URL}${API_CONFIG.SERVICE.TYPES}`;
const SERVICE_VACCINE_BASE_URL = `${API_CONFIG.BASE_URL}${API_CONFIG.SERVICE.VACCINES}`;
const VACCINE_BASE_URL = `${API_CONFIG.BASE_URL}${API_CONFIG.VACCINE.BASE}`;

// Service API functions

/**
 * Get all services with pagination
 */
export const getAllServices = async (page: number = 1, pageSize: number = 20): Promise<PagedResponse<Service>> => {
  try {
    const response = await axios.get<ApiResponse<PagedResponse<Service>>>(`${SERVICE_BASE_URL}?page=${page}&pageSize=${pageSize}`);
    return response.data.payload;
  } catch (error) {
    console.error('Error fetching services:', error);
    throw error;
  }
};

/**
 * Get service by ID
 */
export const getServiceById = async (id: string): Promise<ServiceDetail> => {
  try {
    const response = await axios.get<ApiResponse<ServiceDetail>>(`${SERVICE_BASE_URL}/${id}`);
    return response.data.payload;
  } catch (error) {
    console.error(`Error fetching service with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Create new service
 */
export const createService = async (serviceData: ServiceCreateRequest): Promise<{ id: string }> => {
  try {
    const response = await axios.post<ApiResponse<{ id: string }>>(SERVICE_BASE_URL, serviceData);
    return response.data.payload;
  } catch (error) {
    console.error('Error creating service:', error);
    throw error;
  }
};

/**
 * Update service
 */
export const updateService = async (id: string, serviceData: ServiceUpdateRequest): Promise<void> => {
  try {
    await axios.put<ApiResponse<null>>(`${SERVICE_BASE_URL}/${id}`, serviceData);
  } catch (error) {
    console.error(`Error updating service with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Delete service (soft delete)
 */
export const deleteService = async (id: string): Promise<void> => {
  try {
    await axios.delete<ApiResponse<null>>(`${SERVICE_BASE_URL}/${id}`);
  } catch (error) {
    console.error(`Error deleting service with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Update service images
 */
export const updateServiceImages = async (id: string, images: ServiceImageUpdateRequest[]): Promise<void> => {
  try {
    await axios.put<ApiResponse<null>>(`${SERVICE_BASE_URL}/${id}/images`, images);
  } catch (error) {
    console.error(`Error updating images for service with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Get services by type
 */
export const getServicesByType = async (typeId: string, page: number = 1, pageSize: number = 20): Promise<PagedResponse<Service>> => {
  try {
    const response = await axios.get<ApiResponse<PagedResponse<Service>>>(`${SERVICE_BASE_URL}/by-type/${typeId}?page=${page}&pageSize=${pageSize}`);
    return response.data.payload;
  } catch (error) {
    console.error(`Error fetching services by type ID ${typeId}:`, error);
    throw error;
  }
};

// Service Type API functions

/**
 * Get all service types with pagination
 */
export const getAllServiceTypes = async (page: number = 1, pageSize: number = 20): Promise<PagedResponse<ServiceType>> => {
  try {
    const response = await axios.get<ApiResponse<PagedResponse<ServiceType>>>(`${SERVICE_TYPE_BASE_URL}?page=${page}&pageSize=${pageSize}`);
    return response.data.payload;
  } catch (error) {
    console.error('Error fetching service types:', error);
    throw error;
  }
};

/**
 * Get all service types without pagination
 */
export const getAllServiceTypesNoPage = async (): Promise<ServiceType[]> => {
  try {
    const response = await axios.get<ApiResponse<ServiceType[]>>(`${SERVICE_TYPE_BASE_URL}/all`);
    return response.data.payload;
  } catch (error) {
    console.error('Error fetching all service types:', error);
    throw error;
  }
};

/**
 * Get service type by ID
 */
export const getServiceTypeById = async (id: string): Promise<ServiceTypeDetail> => {
  try {
    const response = await axios.get<ApiResponse<ServiceTypeDetail>>(`${SERVICE_TYPE_BASE_URL}/${id}`);
    return response.data.payload;
  } catch (error) {
    console.error(`Error fetching service type with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Create new service type
 */
export const createServiceType = async (typeData: ServiceTypeCreateRequest): Promise<{ id: string }> => {
  try {
    const response = await axios.post<ApiResponse<{ id: string }>>(SERVICE_TYPE_BASE_URL, typeData);
    return response.data.payload;
  } catch (error) {
    console.error('Error creating service type:', error);
    throw error;
  }
};

/**
 * Update service type
 */
export const updateServiceType = async (id: string, typeData: ServiceTypeUpdateRequest): Promise<void> => {
  try {
    await axios.put<ApiResponse<null>>(`${SERVICE_TYPE_BASE_URL}/${id}`, typeData);
  } catch (error) {
    console.error(`Error updating service type with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Delete service type (soft delete)
 */
export const deleteServiceType = async (id: string): Promise<void> => {
  try {
    await axios.delete<ApiResponse<null>>(`${SERVICE_TYPE_BASE_URL}/${id}`);
  } catch (error) {
    console.error(`Error deleting service type with ID ${id}:`, error);
    throw error;
  }
};

// Service Vaccine API functions

/**
 * Get vaccines by service
 */
export const getVaccinesByService = async (serviceId: string): Promise<ServiceVaccine[]> => {
  try {
    const response = await axios.get<ApiResponse<ServiceVaccine[]>>(`${SERVICE_VACCINE_BASE_URL}/by-service/${serviceId}`);
    return response.data.payload;
  } catch (error) {
    console.error(`Error fetching vaccines for service with ID ${serviceId}:`, error);
    throw error;
  }
};

/**
 * Add vaccine to service
 */
export const addVaccineToService = async (data: ServiceVaccineCreateRequest): Promise<{ id: string }> => {
  try {
    const response = await axios.post<ApiResponse<{ id: string }>>(SERVICE_VACCINE_BASE_URL, data);
    return response.data.payload;
  } catch (error) {
    console.error('Error adding vaccine to service:', error);
    throw error;
  }
};

/**
 * Update service vaccine
 */
export const updateServiceVaccine = async (id: string, data: ServiceVaccineUpdateRequest): Promise<void> => {
  try {
    await axios.put<ApiResponse<null>>(`${SERVICE_VACCINE_BASE_URL}/${id}`, data);
  } catch (error) {
    console.error(`Error updating service vaccine with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Delete service vaccine
 */
export const deleteServiceVaccine = async (id: string): Promise<void> => {
  try {
    await axios.delete<ApiResponse<null>>(`${SERVICE_VACCINE_BASE_URL}/${id}`);
  } catch (error) {
    console.error(`Error deleting service vaccine with ID ${id}:`, error);
    throw error;
  }
};

// Vaccine API functions

/**
 * Get all vaccines with pagination
 */
export const getAllVaccines = async (page: number = 1, pageSize: number = 20): Promise<PagedResponse<Vaccine>> => {
  try {
    const response = await axios.get<ApiResponse<PagedResponse<Vaccine>>>(`${VACCINE_BASE_URL}?page=${page}&pageSize=${pageSize}`);
    return response.data.payload;
  } catch (error) {
    console.error('Error fetching vaccines:', error);
    throw error;
  }
};

/**
 * Get all vaccines without pagination
 */
export const getAllVaccinesNoPage = async (): Promise<Vaccine[]> => {
  try {
    const response = await axios.get<ApiResponse<Vaccine[]>>(`${VACCINE_BASE_URL}/all`);
    return response.data.payload;
  } catch (error) {
    console.error('Error fetching all vaccines:', error);
    throw error;
  }
};

/**
 * Get vaccine by ID
 */
export const getVaccineById = async (id: string): Promise<VaccineDetail> => {
  try {
    const response = await axios.get<ApiResponse<VaccineDetail>>(`${VACCINE_BASE_URL}/${id}`);
    return response.data.payload;
  } catch (error) {
    console.error(`Error fetching vaccine with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Create new vaccine
 */
export const createVaccine = async (vaccineData: VaccineCreateRequest): Promise<{ id: string }> => {
  try {
    const response = await axios.post<ApiResponse<{ id: string }>>(VACCINE_BASE_URL, vaccineData);
    return response.data.payload;
  } catch (error) {
    console.error('Error creating vaccine:', error);
    throw error;
  }
};

/**
 * Update vaccine
 */
export const updateVaccine = async (id: string, vaccineData: VaccineUpdateRequest): Promise<void> => {
  try {
    await axios.put<ApiResponse<null>>(`${VACCINE_BASE_URL}/${id}`, vaccineData);
  } catch (error) {
    console.error(`Error updating vaccine with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Delete vaccine (soft delete)
 */
export const deleteVaccine = async (id: string): Promise<void> => {
  try {
    await axios.delete<ApiResponse<null>>(`${VACCINE_BASE_URL}/${id}`);
  } catch (error) {
    console.error(`Error deleting vaccine with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Update vaccine images
 */
export const updateVaccineImages = async (id: string, images: VaccineImageUpdateRequest[]): Promise<void> => {
  try {
    await axios.put<ApiResponse<null>>(`${VACCINE_BASE_URL}/${id}/images`, images);
  } catch (error) {
    console.error(`Error updating images for vaccine with ID ${id}:`, error);
    throw error;
  }
};