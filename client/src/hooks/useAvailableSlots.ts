import { useApi } from './useApi';
import { getAvailableSlots, AvailableSlot } from '../services/appointment.service';

interface AvailableSlotsParams {
  doctorId: string;
  locationId: string;
  fromDate?: string;
  toDate?: string;
}

export const useAvailableSlots = () => {
  const { data, loading, error, execute, reset } = useApi<AvailableSlot[], AvailableSlotsParams>(getAvailableSlots);

  const availableSlots = data || [];

  return {
    availableSlots,
    loading,
    error,
    execute,
    reset
  };
}; 