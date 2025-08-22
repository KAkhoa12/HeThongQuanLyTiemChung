import API_CONFIG from '../config/api.config';
import { apiGet, apiPost, apiPut, apiDelete } from '../utils/apiHelper';

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

export interface ApiResponse<T> {
  status: string;
  message: string;
  payload: T;
}

// Image Label Service
class ImageLabelService {
  /**
   * Get all image labels
   */
  async getAllLabels(): Promise<ImageLabel[]> {
    try {
      const data: ApiResponse<ImageLabel[]> = await apiGet(API_CONFIG.IMAGE_LABELS.BASE);
      return data.payload;
    } catch (error) {
      console.error('Get labels error:', error);
      throw error;
    }
  }

  /**
   * Get image label by ID
   */
  async getLabelById(id: string): Promise<ImageLabel> {
    try {
      const data: ApiResponse<ImageLabel> = await apiGet(`${API_CONFIG.IMAGE_LABELS.BASE}/${id}`);
      return data.payload;
    } catch (error) {
      console.error('Get label error:', error);
      throw error;
    }
  }

  /**
   * Create new image label
   */
  async createLabel(labelData: ImageLabelCreateDto): Promise<any> {
    try {
      const data: ApiResponse<ImageLabel> = await apiPost(API_CONFIG.IMAGE_LABELS.BASE, labelData);
      return data.payload;
    } catch (error) {
      console.error('Create label error:', error);
      throw error;
    }
  }

  /**
   * Update image label
   */
  async updateLabel(id: string, updateData: ImageLabelUpdateDto): Promise<any> {
    try {
      const data: ApiResponse<ImageLabel> = await apiPut(`${API_CONFIG.IMAGE_LABELS.BASE}/${id}`, updateData);
      return data.payload;
    } catch (error) {
      console.error('Update label error:', error);
      throw error;
    }
  }

  /**
   * Delete image label
   */
  async deleteLabel(id: string): Promise<any> {
    try {
      const data: ApiResponse<any> = await apiDelete(`${API_CONFIG.IMAGE_LABELS.BASE}/${id}`);
      return data.payload;
    } catch (error) {
      console.error('Delete label error:', error);
      throw error;
    }
  }
}

export const imageLabelService = new ImageLabelService();
export default imageLabelService; 