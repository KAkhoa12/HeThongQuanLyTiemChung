import { useApi } from './useApi';
import { getAppointmentsByDoctor, AppointmentVM } from '../services/appointment.service';

export const useAppointmentsByDoctor = () => {
  const { data, loading, error, execute, reset } = useApi<AppointmentVM[], string>(getAppointmentsByDoctor);

  const appointments = data || [];

  return {
    appointments,
    loading,
    error,
    execute,
    reset
  };
}; 