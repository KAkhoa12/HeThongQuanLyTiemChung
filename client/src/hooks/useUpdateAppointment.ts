import { useApiWithParams } from './useApi';
import { updateAppointment, UpdateAppointmentDto, AppointmentVM } from '../services/appointment.service';

interface UpdateAppointmentParams {
  id: string;
  data: UpdateAppointmentDto;
}

export const useUpdateAppointment = () => {
  const { data, loading, error, execute, reset } = useApiWithParams<AppointmentVM, UpdateAppointmentParams>((params) => 
    updateAppointment(params.id, params.data), null
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