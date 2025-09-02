import React, { useEffect } from 'react';
import { useApi, useApiWithParams } from './useApi';
import * as vaiTroService from '../services/vaiTro.service';

// Get all roles with pagination and filters
export const useVaiTros = () => {
  const apiResult = useApiWithParams<vaiTroService.VaiTroListResponse, vaiTroService.VaiTroListParams>(
    async (params) => vaiTroService.getVaiTros(params),
    null
  );

  // Auto execute with default params - lấy tất cả
  useEffect(() => {
    apiResult.execute({ page: 1, pageSize: 1000 });
  }, []);

  return apiResult;
};

// Get role by ID
export const useVaiTro = (maVaiTro: string | null) => {
  return useApiWithParams<vaiTroService.VaiTro, string>(
    async (maVaiTroParam) => {
      return vaiTroService.getVaiTro(maVaiTroParam);
    },
    null
  );
};

// Get all active roles
export const useActiveVaiTros = () => {
  const apiResult = useApi<vaiTroService.VaiTro[]>(
    async () => vaiTroService.getActiveVaiTros(),
    null
  );

  // Auto execute when component mounts
  useEffect(() => {
    apiResult.execute();
  }, []);

  return apiResult;
}; 