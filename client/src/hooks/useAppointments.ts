import { useApi } from './useApi';
import { getAllAppointments, AppointmentListParams, AppointmentListResponse } from '../services/appointment.service';

export const useAppointments = () => {
  const { data, loading, error, execute, reset } = useApi<AppointmentListResponse, AppointmentListParams>(getAllAppointments);

  const appointments = data?.data || [];
  const totalCount = data?.totalCount || 0;
  const page = data?.page || 1;
  const pageSize = data?.pageSize || 20;
  const totalPages = data?.totalPages || 1;

  return {
    appointments,
    totalCount,
    page,
    pageSize,
    totalPages,
    loading,
    error,
    execute,
    reset
  };
}; 