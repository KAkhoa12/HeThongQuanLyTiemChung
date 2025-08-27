import { useApi } from './useApi';
import { updateAppointment, UpdateAppointmentDto, AppointmentVM } from '../services/appointment.service';

interface UpdateAppointmentParams {
  id: string;
  data: UpdateAppointmentDto;
}

export const useUpdateAppointment = () => {
  const { data, loading, error, execute, reset } = useApi<AppointmentVM, UpdateAppointmentParams>((params) => 
    updateAppointment(params.id, params.data)
  );

  const appointment = data;

  return {
    appointment,
    loading,
    error,
    execute,
    reset
  };
}; 