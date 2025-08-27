import apiService from './api.service';

// Types
export interface ImageLabel {
  maNhan: string;
  tenNhan: string;
  moTa?: string;
  isActive: boolean;
  ngayTao: string;
}

export interface ImageLabelCreateDto {
  tenNhan: string;
  moTa?: string;
}

export interface ImageLabelUpdateDto {
  tenNhan: string;
  moTa?: string;
  isActive?: boolean;
}

// Image Label Service
class ImageLabelService {
  /**
   * Get all image labels
   */
  async getAllLabels(): Promise<ImageLabel[]> {
    return await apiService.get('/api/image-labels');
  }

  /**
   * Get image label by ID
   */
  async getLabelById(id: string): Promise<ImageLabel> {
    return await apiService.get(`/api/image-labels/${id}`);
  }

  /**
   * Create new image label
   */
  async createLabel(labelData: ImageLabelCreateDto): Promise<any> {
    return await apiService.create('/api/image-labels', labelData);
  }

  /**
   * Update image label
   */
  async updateLabel(id: string, updateData: ImageLabelUpdateDto): Promise<any> {
    return await apiService.update(`/api/image-labels/${id}`, updateData);
  }

  /**
   * Delete image label
   */
  async deleteLabel(id: string): Promise<any> {
    return await apiService.delete(`/api/image-labels/${id}`);
  }
}

export const imageLabelService = new ImageLabelService();
export default imageLabelService; 