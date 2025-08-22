import API_CONFIG from '../config/api.config';
import { apiGet, apiPut, apiDelete, apiDeleteWithBody, apiUpload, apiPost } from '../utils/apiHelper';

// Types
export interface ImageLabel {
  maNhan: string;
  tenNhan: string;
  moTa?: string;
  isActive: boolean;
  ngayTao: string;
}

export interface Image {
  maAnh: string;
  urlAnh: string;
  altText?: string;
  tenNhan?: string;
  maNhan?: string;
  ngayTao: string;
}

export interface ImageUpdateDto {
  altText?: string;
  maNhan: string;
  isActive?: boolean;
}

export interface ImageLabelUpdateDto {
  tenNhan: string;
  moTa?: string;
  isActive?: boolean;
}

export interface PagedResult<T> {
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  data: T[];
}

export interface ApiResponse<T> {
  status: string;
  message: string;
  payload: T;
}

// Image Service
class ImageService {
  /**
   * Get all images with pagination
   */
  async getAllImages(page: number = 1, pageSize: number = 20): Promise<PagedResult<Image>> {
    try {
      const data: ApiResponse<PagedResult<Image>> = await apiGet(
        `${API_CONFIG.IMAGE.BASE}?page=${page}&pageSize=${pageSize}`
      );
      return data.payload;
    } catch (error) {
      console.error('Get images error:', error);
      throw error;
    }
  }

  /**
   * Get images by label with pagination
   */
  async getImagesByLabel(labelId: string, page: number = 1, pageSize: number = 20): Promise<PagedResult<Image>> {
    try {
      const data: ApiResponse<PagedResult<Image>> = await apiGet(
        `${API_CONFIG.IMAGE.BASE}/by-label/${labelId}?page=${page}&pageSize=${pageSize}`
      );
      return data.payload;
    } catch (error) {
      console.error('Get images by label error:', error);
      throw error;
    }
  }

  /**
   * Get image by ID
   */
  async getImageById(id: string): Promise<Image> {
    try {
      const data: ApiResponse<Image> = await apiGet(`${API_CONFIG.IMAGE.BASE}/${id}`);
      return data.payload;
    } catch (error) {
      console.error('Get image error:', error);
      throw error;
    }
  }

  /**
   * Update image
   */
  async updateImage(id: string, updateData: ImageUpdateDto): Promise<any> {
    try {
      const data: ApiResponse<Image> = await apiPut(`${API_CONFIG.IMAGE.BASE}/${id}`, updateData);
      return data.payload;
    } catch (error) {
      console.error('Update image error:', error);
      throw error;
    }
  }

  /**
   * Delete multiple images
   */
  async deleteImages(ids: string[]): Promise<any> {
    try {
      // Sử dụng DELETE với body như Postman
      const data: ApiResponse<any> = await apiDeleteWithBody(`${API_CONFIG.IMAGE.BASE}/batch`, ids);
      return data.payload;
    } catch (error) {
      console.error('Delete images error:', error);
      throw error;
    }
  }

  /**
   * Upload images
   */
  async uploadImages(files: File[], altText: string, maNhan: string): Promise<Image[]> {
    try {
      const formData = new FormData();
      
      files.forEach(file => {
        formData.append('files', file);
      });
      
      formData.append('altText', altText);
      formData.append('maNhan', maNhan);

      const data: ApiResponse<Image[]> = await apiUpload(`${API_CONFIG.IMAGE.BASE}/upload`, formData);
      return data.payload;
    } catch (error) {
      console.error('Upload images error:', error);
      throw error;
    }
  }
}

export const imageService = new ImageService();
export default imageService; 