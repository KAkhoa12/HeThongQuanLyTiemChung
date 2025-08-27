import { useApi } from './useApi';
import { getAppointmentById, AppointmentVM } from '../services/appointment.service';

export const useAppointment = () => {
  const { data, loading, error, execute, reset } = useApi<AppointmentVM, string>(getAppointmentById);

  const appointment = data;

  return {
    appointment,
    loading,
    error,
    execute,
    reset
  };
}; 