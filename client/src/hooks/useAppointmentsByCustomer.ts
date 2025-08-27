import { useApi } from './useApi';
import { getAppointmentsByCustomer, AppointmentVM } from '../services/appointment.service';

export const useAppointmentsByCustomer = () => {
  const { data, loading, error, execute, reset } = useApi<AppointmentVM[], string>(getAppointmentsByCustomer);

  const appointments = data || [];

  return {
    appointments,
    loading,
    error,
    execute,
    reset
  };
}; 