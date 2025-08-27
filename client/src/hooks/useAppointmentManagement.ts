import { useAppointments } from './useAppointments';
import { useAppointment } from './useAppointment';
import { useAvailableSlots } from './useAvailableSlots';
import { useCreateAppointment } from './useCreateAppointment';
import { useCreateAppointmentFromOrder } from './useCreateAppointmentFromOrder';
import { useUpdateAppointment } from './useUpdateAppointment';
import { useApproveAppointment } from './useApproveAppointment';
import { useDeleteAppointment } from './useDeleteAppointment';
import { useAppointmentsByCustomer } from './useAppointmentsByCustomer';
import { useAppointmentsByDoctor } from './useAppointmentsByDoctor';

export const useAppointmentManagement = () => {
  const appointments = useAppointments();
  const appointment = useAppointment();
  const availableSlots = useAvailableSlots();
  const createAppointment = useCreateAppointment();
  const createAppointmentFromOrder = useCreateAppointmentFromOrder();
  const updateAppointment = useUpdateAppointment();
  const approveAppointment = useApproveAppointment();
  const deleteAppointment = useDeleteAppointment();
  const appointmentsByCustomer = useAppointmentsByCustomer();
  const appointmentsByDoctor = useAppointmentsByDoctor();

  return {
    // Danh sách appointments
    appointments: appointments.appointments,
    totalCount: appointments.totalCount,
    page: appointments.page,
    pageSize: appointments.pageSize,
    totalPages: appointments.totalPages,
    loadingAppointments: appointments.loading,
    errorAppointments: appointments.error,
    fetchAppointments: appointments.execute,
    resetAppointments: appointments.reset,

    // Single appointment
    appointment: appointment.appointment,
    loadingAppointment: appointment.loading,
    errorAppointment: appointment.error,
    fetchAppointment: appointment.execute,
    resetAppointment: appointment.reset,

    // Available slots
    availableSlots: availableSlots.availableSlots,
    loadingSlots: availableSlots.loading,
    errorSlots: availableSlots.error,
    fetchAvailableSlots: availableSlots.execute,
    resetSlots: availableSlots.reset,

    // Create appointment
    createdAppointment: createAppointment.appointment,
    creating: createAppointment.loading,
    errorCreating: createAppointment.error,
    createNewAppointment: createAppointment.execute,
    resetCreate: createAppointment.reset,

    // Create from order
    createdFromOrder: createAppointmentFromOrder.appointment,
    creatingFromOrder: createAppointmentFromOrder.loading,
    errorCreatingFromOrder: createAppointmentFromOrder.error,
    createFromOrder: createAppointmentFromOrder.execute,
    resetCreateFromOrder: createAppointmentFromOrder.reset,

    // Update appointment
    updatedAppointment: updateAppointment.appointment,
    updating: updateAppointment.loading,
    errorUpdating: updateAppointment.error,
    updateExistingAppointment: updateAppointment.execute,
    resetUpdate: updateAppointment.reset,

    // Approve appointment
    approvedAppointment: approveAppointment.appointment,
    approving: approveAppointment.loading,
    errorApproving: approveAppointment.error,
    approveExistingAppointment: approveAppointment.execute,
    resetApprove: approveAppointment.reset,

    // Delete appointment
    isDeleted: deleteAppointment.isDeleted,
    deleting: deleteAppointment.loading,
    errorDeleting: deleteAppointment.error,
    deleteExistingAppointment: deleteAppointment.execute,
    resetDelete: deleteAppointment.reset,

    // Appointments by customer
    customerAppointments: appointmentsByCustomer.appointments,
    loadingCustomerAppointments: appointmentsByCustomer.loading,
    errorCustomerAppointments: appointmentsByCustomer.error,
    fetchCustomerAppointments: appointmentsByCustomer.execute,
    resetCustomerAppointments: appointmentsByCustomer.reset,

    // Appointments by doctor
    doctorAppointments: appointmentsByDoctor.appointments,
    loadingDoctorAppointments: appointmentsByDoctor.loading,
    errorDoctorAppointments: appointmentsByDoctor.error,
    fetchDoctorAppointments: appointmentsByDoctor.execute,
    resetDoctorAppointments: appointmentsByDoctor.reset,
  };
}; 