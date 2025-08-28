import { useApiWithParams } from './useApi';
import { getAppointmentById, AppointmentVM } from '../services/appointment.service';

export const useAppointment = () => {
  const { data, loading, error, execute, reset } = useApiWithParams<AppointmentVM, string>(getAppointmentById, null);

  const appointment = data;

  return {
    appointment,
    loading,
    error,
    execute,
    reset
  };
}; 