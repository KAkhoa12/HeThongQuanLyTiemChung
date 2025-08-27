import apiService from './api.service';

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

// Image Service
class ImageService {
  /**
   * Get all images with pagination
   */
  async getAllImages(page: number = 1, pageSize: number = 20): Promise<PagedResult<Image>> {
    return await apiService.get(`/api/images?page=${page}&pageSize=${pageSize}`);
  }

  /**
   * Get images by label with pagination
   */
  async getImagesByLabel(labelId: string, page: number = 1, pageSize: number = 20): Promise<PagedResult<Image>> {
    return await apiService.get(`/api/images/by-label/${labelId}?page=${page}&pageSize=${pageSize}`);
  }

  /**
   * Get image by ID
   */
  async getImageById(id: string): Promise<Image> {
    return await apiService.get(`/api/images/${id}`);
  }

  /**
   * Update image
   */
  async updateImage(id: string, updateData: ImageUpdateDto): Promise<any> {
    return await apiService.update(`/api/images/${id}`, updateData);
  }

  /**
   * Delete multiple images
   */
  async deleteImages(ids: string[]): Promise<any> {
    return await apiService.delete('/api/images/batch', { ids });
  }

  /**
   * Upload images
   */
  async uploadImages(files: File[], altText: string, maNhan: string): Promise<Image[]> {
    const formData = new FormData();
    
    files.forEach(file => {
      formData.append('files', file);
    });
    
    formData.append('altText', altText);
    formData.append('maNhan', maNhan);

    return await apiService.post('/api/images/upload', formData);
  }
}

export const imageService = new ImageService();
export default imageService; 