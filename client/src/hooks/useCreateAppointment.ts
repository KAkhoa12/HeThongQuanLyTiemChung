import { useApiWithParams } from './useApi';
import { createAppointment, CreateAppointmentDto, AppointmentVM } from '../services/appointment.service';

export const useCreateAppointment = () => {
  const { data, loading, error, execute, reset } = useApiWithParams<AppointmentVM, CreateAppointmentDto>(createAppointment, null);

  const appointment = data;

  return {
    appointment,
    loading,
    error,
    execute,
    reset
  };
}; 