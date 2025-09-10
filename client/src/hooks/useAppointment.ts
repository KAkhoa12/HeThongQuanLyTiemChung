import { useApi, useApiWithParams } from './useApi';
import { createVaccinationPlanFromOrder, getAppointmentById } from '../services/appointment.service';

export const useCreateVaccinationPlanFromOrder = () => {
  return useApi(createVaccinationPlanFromOrder);
};

export const useAppointmentById = (id: string | null) => {
  return useApiWithParams(
    async (params: { id: string }) => getAppointmentById(params.id),
    id ? { id } : null
  );
};