import { useApi } from './useApi';
import { deleteAppointment } from '../services/appointment.service';

export const useDeleteAppointment = () => {
  const { data, loading, error, execute, reset } = useApi<boolean, string>(deleteAppointment);

  const isDeleted = data;

  return {
    isDeleted,
    loading,
    error,
    execute,
    reset
  };
}; 