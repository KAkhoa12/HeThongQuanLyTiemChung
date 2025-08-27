import { useApi } from './useApi';
import { createAppointmentFromOrder, CreateAppointmentFromOrderDto, AppointmentVM } from '../services/appointment.service';

export const useCreateAppointmentFromOrder = () => {
  const { data, loading, error, execute, reset } = useApi<AppointmentVM, CreateAppointmentFromOrderDto>(createAppointmentFromOrder);

  const appointment = data;

  return {
    appointment,
    loading,
    error,
    execute,
    reset
  };
}; 