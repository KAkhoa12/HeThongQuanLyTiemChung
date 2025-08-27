import { useState, useCallback } from 'react';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  status: string | null;
}

interface UseApiReturn<T> extends UseApiState<T> {
  execute: (...args: any[]) => Promise<void>;
  reset: () => void;
}

// Kiểm tra response có phải là error không
function isApiError(response: any): boolean {
  return response && (
    response.status === 'error' || 
    response.status === 'Error' ||
    response.status === 400 ||
    response.status === 500 ||
    (response.errors && Object.keys(response.errors).length > 0) ||
    (response.title && response.title.includes('validation errors'))
  );
}

// Lấy error message từ response
function getErrorMessage(response: any): string {
  if (response.errors && typeof response.errors === 'object') {
    const errorMessages = Object.values(response.errors).flat();
    return Array.isArray(errorMessages) ? errorMessages.join(', ') : 'Đã xảy ra lỗi validation';
  }
  
  if (response.message) {
    return response.message;
  }
  
  if (response.title) {
    return response.title;
  }
  
  return 'Đã xảy ra lỗi';
}

export function useApi<T>(
  apiFunction: (...args: any[]) => Promise<T>,
  initialData: T | null = null
): UseApiReturn<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: initialData,
    loading: false,
    error: null,
    status: null,
  });

  const execute = useCallback(
    async (...args: any[]) => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null, status: 'success' }));
        const result = await apiFunction(...args);
        
        // Kiểm tra response có phải là error không
        if (isApiError(result)) {
          const errorMessage = getErrorMessage(result);
          setState(prev => ({ ...prev, error: errorMessage, loading: false, status: 'error' }));
          console.error('API Response Error:', result);
          return;
        }
        
        setState(prev => ({ ...prev, data: result, loading: false }));
      } catch (error: any) {
        const errorMessage = error?.message || 'Đã xảy ra lỗi';
        setState(prev => ({ ...prev, error: errorMessage, loading: false, status: 'error' }));
        console.error('API Error:', error);
      }
    },
    [apiFunction]
  );

  const reset = useCallback(() => {
    setState({
      data: initialData,
      loading: false,
      error: null,
      status: null,
    });
  }, [initialData]);

  return {
    ...state,
    execute,
    reset,
  };
}

// Hook đặc biệt cho API calls với parameters
export function useApiWithParams<T, P>(
  apiFunction: (params: P) => Promise<T>,
  initialData: T | null = null
): UseApiReturn<T> & { execute: (params: P) => Promise<void> } {
  const [state, setState] = useState<UseApiState<T>>({
    data: initialData,
    loading: false,
    error: null,
    status: null,
  });

  const execute = useCallback(
    async (params: P) => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null, status: 'success' }));
        const result = await apiFunction(params);
        
        // Kiểm tra response có phải là error không
        if (isApiError(result)) {
          const errorMessage = getErrorMessage(result);
          setState(prev => ({ ...prev, error: errorMessage, loading: false, status: 'error' }));
          console.error('API Response Error:', result);
          return;
        }
        
        setState(prev => ({ ...prev, data: result, loading: false }));
      } catch (error: any) {
        const errorMessage = error?.message || 'Đã xảy ra lỗi';
        setState(prev => ({ ...prev, error: errorMessage, loading: false, status: 'error' }));
        console.error('API Error:', error);
      }
    },
    [apiFunction]
  );

  const reset = useCallback(() => {
    setState({
      data: initialData,
      loading: false,
      error: null,
      status: null,
    });
  }, [initialData]);

  return {
    ...state,
    execute,
    reset,
  };
} 