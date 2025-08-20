/**
 * API Configuration
 * Contains base URL and endpoints for API calls
 */

export const API_CONFIG = {
  BASE_URL: 'http://localhost:5091',
  
  // Authentication endpoints
  AUTH: {
    LOGIN: '/api/Auth/login',
    REGISTER: '/api/Auth/register',
    REFRESH: '/api/Auth/refresh',
    ME: '/api/Auth/me',
  },
  
  // Other API endpoints can be added here
  DIADIEM: {
    BASE: '/api/locations',
  },
  
  NHACUNGCAP: {
    BASE: '/api/NhaCungCap',
  },
  
  IMAGE: {
    BASE: '/api/Image',
  },

  // Staff management endpoints
  STAFF: {
    BASE: '/api/User',
  },

  // Doctor management endpoints
  DOCTOR: {
    BASE: '/api/doctors',
    SCHEDULES: '/api/doctors/{id}/schedules',
  },

  // Work schedule management endpoints
  SCHEDULE: {
    BASE: '/api/schedules',
    AVAILABILITY: '/api/schedules/availability',
    BY_DOCTOR_LOCATION: '/api/schedules/by-doctor-location',
  },

  // Service management endpoints
  SERVICE: {
    BASE: '/api/services',
    TYPES: '/api/service-types',
    VACCINES: '/api/service-vaccines',
  },

  // Vaccine management endpoints
  VACCINE: {
    BASE: '/api/vaccines',
    ALL: '/api/vaccines/all',
  },
};

export default API_CONFIG;