import { useAppointments } from './useAppointments';
import { useCreateAppointmentFromOrder } from './useCreateAppointmentFromOrder';
import { useApproveAppointment } from './useApproveAppointment';

export const useAppointmentManagement = () => {
  const appointments = useAppointments();
  const createAppointmentFromOrder = useCreateAppointmentFromOrder();
  const approveAppointment = useApproveAppointment();

  return {
    // Danh sách appointments
    appointments: appointments.data?.data || [],
    totalCount: appointments.data?.totalCount || 0,
    page: appointments.data?.page || 1,
    pageSize: appointments.data?.pageSize || 20,
    totalPages: appointments.data?.totalPages || 1,
    loadingAppointments: appointments.loading,
    errorAppointments: appointments.error,
    fetchAppointments: appointments.execute,
    resetAppointments: appointments.reset,

    // Create from order
    createdFromOrder: createAppointmentFromOrder.data,
    creatingFromOrder: createAppointmentFromOrder.loading,
    errorCreatingFromOrder: createAppointmentFromOrder.error,
    createFromOrder: createAppointmentFromOrder.execute,
    resetCreateFromOrder: createAppointmentFromOrder.reset,

    // Approve appointment
    approvedAppointment: approveAppointment.data,
    approving: approveAppointment.loading,
    errorApproving: approveAppointment.error,
    approveExistingAppointment: approveAppointment.execute,
    resetApprove: approveAppointment.reset,
  };
}; 