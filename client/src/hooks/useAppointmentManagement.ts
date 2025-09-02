import { useAppointments } from './useAppointments';
import { useAppointment } from './useAppointment';
import { useCreateAppointment } from './useCreateAppointment';
import { useCreateAppointmentFromOrder } from './useCreateAppointmentFromOrder';
import { useUpdateAppointment } from './useUpdateAppointment';
import { useApproveAppointment } from './useApproveAppointment';
import { useDeleteAppointment } from './useDeleteAppointment';
import { useAppointmentsByCustomer } from './useAppointmentsByCustomer';

export const useAppointmentManagement = () => {
  const appointments = useAppointments();
  const appointment = useAppointment(null);
  const createAppointment = useCreateAppointment();
  const createAppointmentFromOrder = useCreateAppointmentFromOrder();
  const updateAppointment = useUpdateAppointment();
  const approveAppointment = useApproveAppointment();
  const deleteAppointment = useDeleteAppointment();
  const appointmentsByCustomer = useAppointmentsByCustomer(null);

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

    // Single appointment
    appointment: appointment.data,
    loadingAppointment: appointment.loading,
    errorAppointment: appointment.error,
    fetchAppointment: appointment.execute,
    resetAppointment: appointment.reset,

    // Create appointment
    createdAppointment: createAppointment.data,
    creating: createAppointment.loading,
    errorCreating: createAppointment.error,
    createNewAppointment: createAppointment.execute,
    resetCreate: createAppointment.reset,

    // Create from order
    createdFromOrder: createAppointmentFromOrder.data,
    creatingFromOrder: createAppointmentFromOrder.loading,
    errorCreatingFromOrder: createAppointmentFromOrder.error,
    createFromOrder: createAppointmentFromOrder.execute,
    resetCreateFromOrder: createAppointmentFromOrder.reset,

    // Update appointment
    updatedAppointment: updateAppointment.data,
    updating: updateAppointment.loading,
    errorUpdating: updateAppointment.error,
    updateExistingAppointment: updateAppointment.execute,
    resetUpdate: updateAppointment.reset,

    // Approve appointment
    approvedAppointment: approveAppointment.data,
    approving: approveAppointment.loading,
    errorApproving: approveAppointment.error,
    approveExistingAppointment: approveAppointment.execute,
    resetApprove: approveAppointment.reset,

    // Delete appointment
    isDeleted: deleteAppointment.data,
    deleting: deleteAppointment.loading,
    errorDeleting: deleteAppointment.error,
    deleteExistingAppointment: deleteAppointment.execute,
    resetDelete: deleteAppointment.reset,

    // Appointments by customer
    customerAppointments: appointmentsByCustomer.data || [],
    loadingCustomerAppointments: appointmentsByCustomer.loading,
    errorCustomerAppointments: appointmentsByCustomer.error,
    fetchCustomerAppointments: appointmentsByCustomer.execute,
    resetCustomerAppointments: appointmentsByCustomer.reset,
  };
}; 