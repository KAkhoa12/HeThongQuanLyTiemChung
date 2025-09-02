import React from 'react';
import { useApiWithParams } from './useApi';
import * as nguoiDungQuyenService from '../services/nguoiDungQuyen.service';
import { Quyen } from '../services/quyen.service';

// Get all user permissions with pagination and filters
export const useNguoiDungQuyens = () => {
  return useApiWithParams<nguoiDungQuyenService.NguoiDungQuyenListResponse, nguoiDungQuyenService.NguoiDungQuyenListParams>(
    async (params) => nguoiDungQuyenService.getNguoiDungQuyens(params),
    null
  );
};

// Get permissions by user
export const useQuyensByNguoiDung = (maNguoiDung: string | null) => {
  return useApiWithParams<Quyen[], void>(
    async () => { 
      if (!maNguoiDung) throw new Error('MaNguoiDung is required');
      return nguoiDungQuyenService.getQuyensByNguoiDung(maNguoiDung);
    },
    null
  );
};

// Get all permissions for user (including role permissions)
export const useAllQuyensByNguoiDung = (maNguoiDung: string | null) => {
  return useApiWithParams<nguoiDungQuyenService.QuyenNguoiDung[], void>(
    async () => {
      if (!maNguoiDung) throw new Error('MaNguoiDung is required');
      return nguoiDungQuyenService.getAllQuyensByNguoiDung(maNguoiDung);
    },
    null  
  );
};

// Check if user has permission (including role permissions)
export const useCheckNguoiDungQuyen = (maNguoiDung: string | null, maQuyen: string | null) => {
  return useApiWithParams<{ hasQuyen: boolean; source: string }, void>(
    async () => {
      if (!maNguoiDung || !maQuyen) throw new Error('MaNguoiDung and MaQuyen are required');
      return nguoiDungQuyenService.checkNguoiDungQuyen(maNguoiDung, maQuyen);
    },
    null
  );
}; 