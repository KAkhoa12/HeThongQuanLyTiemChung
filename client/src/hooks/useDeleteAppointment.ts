import { useApiWithParams } from './useApi';
import { deleteAppointment } from '../services/appointment.service';

export const useDeleteAppointment = () => {
  const { data, loading, error, execute, reset } = useApiWithParams<boolean, string>(deleteAppointment, null);

  const isDeleted = data;

  return {
    isDeleted,
    loading,
    error,
    execute,
    reset
  };
}; 