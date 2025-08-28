import { useApiWithParams } from './useApi';
import { getAppointmentsByDoctor, AppointmentVM } from '../services/appointment.service';

export const useAppointmentsByDoctor = () => {
  const { data, loading, error, execute, reset } = useApiWithParams<AppointmentVM[], string>(getAppointmentsByDoctor, null);

  const appointments = data || [];

  return {
    appointments,
    loading,
    error,
    execute,
    reset
  };
}; 