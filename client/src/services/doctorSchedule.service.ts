import { 
  DoctorSchedule, 
  DoctorScheduleCreate, 
  DoctorScheduleUpdate,
  Appointment,
  AppointmentCreate,
  AppointmentUpdate,
  Doctor
} from '../interfaces/doctorSchedule.interface';
import apiService from './api.service';

class DoctorScheduleService {
  /**
   * Lấy danh sách lịch bác sĩ
   */
  async getDoctorSchedules(
    page: number = 1,
    pageSize: number = 10,
    doctorId?: string,
    dateFrom?: string,
    dateTo?: string
  ): Promise<any> {
    let params: any = { page, pageSize };
    if (doctorId) params.doctorId = doctorId;
    if (dateFrom) params.dateFrom = dateFrom;
    if (dateTo) params.dateTo = dateTo;

    return await apiService.get('/api/doctor-schedules', params);
  }

  /**
   * Lấy lịch bác sĩ theo ID
   */
  async getDoctorScheduleById(id: string): Promise<DoctorSchedule> {
    return await apiService.get(`/api/doctor-schedules/${id}`);
  }

  /**
   * Tạo lịch bác sĩ mới
   */
  async createDoctorSchedule(schedule: DoctorScheduleCreate): Promise<DoctorSchedule> {
    return await apiService.create('/api/doctor-schedules', schedule);
  }

  /**
   * Cập nhật lịch bác sĩ
   */
  async updateDoctorSchedule(id: string, schedule: DoctorScheduleUpdate): Promise<DoctorSchedule> {
    return await apiService.update(`/api/doctor-schedules/${id}`, schedule);
  }

  /**
   * Xóa lịch bác sĩ
   */
  async deleteDoctorSchedule(id: string): Promise<string> {
    return await apiService.delete(`/api/doctor-schedules/${id}`);
  }

  /**
   * Lấy danh sách bác sĩ
   */
  async getDoctors(): Promise<Doctor[]> {
    return await apiService.get('/api/doctors');
  }

  /**
   * Lấy danh sách lịch hẹn
   */
  async getAppointments(
    page: number = 1,
    pageSize: number = 10,
    doctorId?: string,
    patientId?: string,
    dateFrom?: string,
    dateTo?: string,
    status?: string
  ): Promise<any> {
    let params: any = { page, pageSize };
    if (doctorId) params.doctorId = doctorId;
    if (patientId) params.patientId = patientId;
    if (dateFrom) params.dateFrom = dateFrom;
    if (dateTo) params.dateTo = dateTo;
    if (status) params.status = status;

    return await apiService.get('/api/appointments', params);
  }

  /**
   * Lấy lịch hẹn theo ID
   */
  async getAppointmentById(id: string): Promise<Appointment> {
    return await apiService.get(`/api/appointments/${id}`);
  }

  /**
   * Tạo lịch hẹn mới
   */
  async createAppointment(appointment: AppointmentCreate): Promise<Appointment> {
    return await apiService.create('/api/appointments', appointment);
  }

  /**
   * Cập nhật lịch hẹn
   */
  async updateAppointment(id: string, appointment: AppointmentUpdate): Promise<Appointment> {
    return await apiService.update(`/api/appointments/${id}`, appointment);
  }

  /**
   * Hủy lịch hẹn
   */
  async cancelAppointment(id: string): Promise<string> {
    return await apiService.update(`/api/appointments/${id}/cancel`, {});
  }

  /**
   * Xóa lịch hẹn
   */
  async deleteAppointment(id: string): Promise<string> {
    return await apiService.delete(`/api/appointments/${id}`);
  }
}

export default new DoctorScheduleService(); 