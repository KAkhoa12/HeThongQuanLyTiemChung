import { useApiWithParams } from './useApi';
import { getAppointmentsByCustomer, AppointmentVM } from '../services/appointment.service';

export const useAppointmentsByCustomer = () => {
  const { data, loading, error, execute, reset } = useApiWithParams<AppointmentVM[], string>(getAppointmentsByCustomer, null);

  const appointments = data || [];

  return {
    appointments,
    loading,
    error,
    execute,
    reset
  };
}; 