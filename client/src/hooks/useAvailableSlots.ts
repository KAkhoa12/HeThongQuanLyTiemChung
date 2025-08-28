import { useApiWithParams } from './useApi';
import { getAvailableSlots, AvailableSlot } from '../services/appointment.service';

interface AvailableSlotsParams {
  doctorId: string;
  locationId: string;
  fromDate?: string;
  toDate?: string;
}

export const useAvailableSlots = () => {
  const { data, loading, error, execute, reset } = useApiWithParams<AvailableSlot[], AvailableSlotsParams>(
    async (params) => getAvailableSlots(params.doctorId, params.locationId, params.fromDate, params.toDate), null
  );

  const availableSlots = data || [];

  return {
    availableSlots,
    loading,
    error,
    execute,
    reset
  };
}; 