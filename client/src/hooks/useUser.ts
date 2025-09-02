import React, { useEffect } from 'react';
import { useApi, useApiWithParams } from './useApi';
import * as userService from '../services/user.service';

// Get all users with pagination and filters
export const useUsers = (params?: userService.UserListParams) => {
  const apiResult = useApiWithParams<userService.UserListResponse, userService.UserListParams>(
    async (params) => userService.getUsers(params),
    null
  );

  // Auto execute with default params - lấy tất cả
  useEffect(() => {
    apiResult.execute(params || { page: 1, pageSize: 1000 });
  }, [params?.page, params?.pageSize, params?.search, params?.roleId]);

  return apiResult;
};

// Get user by ID
export const useUser = (id: string | null) => {
  const apiResult = useApiWithParams<import('../types/user.types').UserCompleteProfileDto, string>(
    async (id) => userService.getUserById(id),
    null
  );

  // Auto execute when id changes
  useEffect(() => {
    if (id) {
      apiResult.execute(id);
    }
  }, [id]);

  return apiResult;
}; 