export interface Staff {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  role: string;
  imageUrl?: string;
  createdAt: string;
}

export interface StaffDetail extends Staff {
  isActive: boolean;
}

export interface StaffCreateRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  roleId: string;
  imageId?: string;
}

export interface StaffUpdateRequest {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  roleId?: string;
  imageId?: string;
  isActive?: boolean;
}

export interface Role {
  id: string;
  name: string;
  createdAt: string;
}

export interface PagedResponse<T> {
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  data: T[];
}

export interface ApiResponse<T> {
  status: string;
  code: number;
  message: string;
  payload: T;
}