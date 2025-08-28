import { useApiWithParams } from './useApi';
import { createAppointmentFromOrder, CreateAppointmentFromOrderDto, AppointmentVM } from '../services/appointment.service';

export const useCreateAppointmentFromOrder = () => {
  const { data, loading, error, execute, reset } = useApiWithParams<AppointmentVM, CreateAppointmentFromOrderDto>(createAppointmentFromOrder, null);

  const appointment = data;

  return {
    appointment,
    loading,
    error,
    execute,
    reset
  };
}; 