import API_CONFIG from '../config/api.config';

/**
 * Utility function to handle API calls with cache control and retry logic
 */
export const apiCall = async <T>(
  url: string,
  options: RequestInit = {}
): Promise<T> => {
  const timestamp = Date.now();
  
  // Check if URL is already absolute or relative
  const isAbsoluteUrl = url.startsWith('http://') || url.startsWith('https://');
  const baseUrl = isAbsoluteUrl ? '' : API_CONFIG.BASE_URL;
  
  const urlWithTimestamp = url.includes('?') 
    ? `${baseUrl}${url}&_t=${timestamp}` 
    : `${baseUrl}${url}?_t=${timestamp}`;

  // Get auth token if available
  const token = localStorage.getItem('auth-storage') 
    ? JSON.parse(localStorage.getItem('auth-storage') || '{}')?.state?.user?.token 
    : null;

  const defaultHeaders: Record<string, string> = {
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
  };

  // Add auth header if token exists
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  // Add content-type for requests with JSON body
  if (options.body && !(options.body instanceof FormData)) {
    defaultHeaders['Content-Type'] = 'application/json';
  }

  const response = await fetch(urlWithTimestamp, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  // Handle 304 Not Modified
  if (response.status === 304) {
    console.log('Received 304, retrying without cache...');
    
    const retryResponse = await fetch(urlWithTimestamp, {
      ...options,
      headers: {
        ...defaultHeaders,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        ...options.headers,
      },
    });

    if (!retryResponse.ok) {
      throw new Error(`HTTP ${retryResponse.status}: API call failed after retry`);
    }

    return await retryResponse.json();
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `HTTP ${response.status}: API call failed`
    );
  }

  return await response.json();
};

/**
 * GET request helper
 */
export const apiGet = async <T>(url: string): Promise<T> => {
  return apiCall<T>(url, { method: 'GET' });
};

/**
 * POST request helper
 */
export const apiPost = async <T>(url: string, data?: any): Promise<T> => {
  return apiCall<T>(url, {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });
};

/**
 * PUT request helper
 */
export const apiPut = async <T>(url: string, data?: any): Promise<T> => {
  return apiCall<T>(url, {
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  });
};

/**
 * DELETE request helper
 */
export const apiDelete = async <T>(url: string): Promise<T> => {
  return apiCall<T>(url, { method: 'DELETE' });
};

/**
 * DELETE request helper with body
 */
export const apiDeleteWithBody = async <T>(url: string, data: any): Promise<T> => {
  return apiCall<T>(url, { 
    method: 'DELETE',
    body: JSON.stringify(data)
  });
};

/**
 * Upload files helper
 */
export const apiUpload = async <T>(
  url: string, 
  formData: FormData
): Promise<T> => {
  const timestamp = Date.now();
  
  // Check if URL is already absolute or relative
  const isAbsoluteUrl = url.startsWith('http://') || url.startsWith('https://');
  const baseUrl = isAbsoluteUrl ? '' : API_CONFIG.BASE_URL;
  
  const urlWithTimestamp = url.includes('?') 
    ? `${baseUrl}${url}&_t=${timestamp}` 
    : `${baseUrl}${url}?_t=${timestamp}`;

  // Get auth token if available
  const token = localStorage.getItem('auth-storage') 
    ? JSON.parse(localStorage.getItem('auth-storage') || '{}')?.state?.user?.token 
    : null;

  const headers: Record<string, string> = {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
  };

  // Add auth header if token exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(urlWithTimestamp, {
    method: 'POST',
    body: formData,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `HTTP ${response.status}: Upload failed`
    );
  }

  return await response.json();
}; 