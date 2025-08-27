import { useApi } from './useApi';
import { createAppointment, CreateAppointmentDto, AppointmentVM } from '../services/appointment.service';

export const useCreateAppointment = () => {
  const { data, loading, error, execute, reset } = useApi<AppointmentVM, CreateAppointmentDto>(createAppointment);

  const appointment = data;

  return {
    appointment,
    loading,
    error,
    execute,
    reset
  };
}; 