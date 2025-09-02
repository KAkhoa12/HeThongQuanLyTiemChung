import React, { useEffect } from 'react';
import { useApi, useApiWithParams } from './useApi';
import * as vaiTroQuyenService from '../services/vaiTroQuyen.service';
import { Quyen } from '../services/quyen.service';

// Get all role permissions with pagination and filters
export const useVaiTroQuyens = () => {
  const apiResult = useApiWithParams<vaiTroQuyenService.VaiTroQuyenListResponse, vaiTroQuyenService.VaiTroQuyenListParams>(
    async (params) => vaiTroQuyenService.getVaiTroQuyens(params),
    null
  );

  useEffect(() => {
    apiResult.execute({ page: 1, pageSize: 1000 });
  }, []);

  return apiResult;
};

// Get permissions by role
export const useQuyensByVaiTro = (maVaiTro: string | null) => {
  const apiResult = useApiWithParams<Quyen[], string>(
    async (maVaiTroParam) => {
      return vaiTroQuyenService.getQuyensByVaiTro(maVaiTroParam);
    },
    null
  );

  // Auto execute when maVaiTro changes
  useEffect(() => {
    if (maVaiTro) {
      apiResult.execute(maVaiTro);
    }
  }, [maVaiTro]);

  return apiResult;
};

// Check if role has permission
export const useCheckVaiTroQuyen = (maVaiTro: string | null, maQuyen: string | null) => {
  const apiResult = useApiWithParams<{ hasQuyen: boolean }, { maVaiTro: string; maQuyen: string }>(
    async (params) => {
      return vaiTroQuyenService.checkVaiTroQuyen(params.maVaiTro, params.maQuyen);
    },
    null
  );

  // Auto execute when both params are available
  useEffect(() => {
    if (maVaiTro && maQuyen) {
      apiResult.execute({ maVaiTro, maQuyen });
    }
  }, [maVaiTro, maQuyen]);

  return apiResult;
}; 