import { useApiWithParams } from './useApi';
import { 
  getLichHens, 
  getLichHenById, 
  updateLichHenStatus, 
  deleteLichHen,
  LichHenFilters,
  LichHen,
  LichHenResponse
} from '../services/lichHen.service';

// Hook để lấy danh sách lịch hẹn với filter
export const useLichHens = () => {
  return useApiWithParams<LichHenResponse, LichHenFilters>(
    async (params) => getLichHens(params),
    null
  );
};

// Hook để lấy chi tiết lịch hẹn
export const useLichHen = () => {
  return useApiWithParams<LichHen, { id: string }>(
    async (params) => {
      if (!params.id) throw new Error('ID is required');
      return getLichHenById(params.id);
    },
    null
  );
};

// Hook để cập nhật trạng thái lịch hẹn
export const useUpdateLichHenStatus = () => {
  return useApiWithParams<LichHen, { id: string; trangThai: string; ghiChu?: string }>(
    async (params) => updateLichHenStatus(params.id, params.trangThai, params.ghiChu),
    null
  );
};

// Hook để xóa lịch hẹn
export const useDeleteLichHen = () => {
  return useApiWithParams<void, { id: string }>(
    async (params) => deleteLichHen(params.id),
    null
  );
};