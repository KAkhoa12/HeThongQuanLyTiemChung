import { useApiWithParams } from './useApi';
import { approveAppointment, ApproveAppointmentDto, AppointmentVM } from '../services/appointment.service';

interface ApproveAppointmentParams {
  id: string;
  data: ApproveAppointmentDto;
}

export const useApproveAppointment = () => {
  const { data, loading, error, execute, reset } = useApiWithParams<AppointmentVM, ApproveAppointmentParams>((params) => 
    approveAppointment(params.id, params.data), null
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