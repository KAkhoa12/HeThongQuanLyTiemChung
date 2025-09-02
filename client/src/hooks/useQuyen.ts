import React, { useEffect, useMemo } from 'react';
import { useApi, useApiWithParams } from './useApi';
import * as quyenService from '../services/quyen.service';

// Get all permissions with pagination and filters
export const useQuyens = (params?: quyenService.QuyenListParams) => {
  const apiResult = useApiWithParams<quyenService.QuyenListResponse, quyenService.QuyenListParams>(
    async (params) => quyenService.getQuyens(params),
    null
  );
  
  // Memoize params to prevent unnecessary re-renders
  const memoizedParams = useMemo(() => {
    return params || { page: 1, pageSize: 1000 };
  }, [params?.page, params?.pageSize]);
  
  useEffect(() => {
    apiResult.execute(memoizedParams);
  }, [memoizedParams]);

  return apiResult;
};

// Get permission by ID
export const useQuyen = (maQuyen: string | null) => {
  const apiResult = useApiWithParams<quyenService.Quyen, string>(
    async (maQuyenParam) => {
      return quyenService.getQuyen(maQuyenParam);
    },
    null
  );

  // Auto execute when maQuyen changes
  useEffect(() => {
    if (maQuyen) {
      apiResult.execute(maQuyen);
    }
  }, [maQuyen]);

  return apiResult;
};

// Get all modules
export const useModules = () => {
  const apiResult = useApi<string[]>(
    async () => quyenService.getModules(),
    null
  );

  // Auto execute when component mounts
  useEffect(() => {
    apiResult.execute();
  }, []);

  return apiResult;
}; 