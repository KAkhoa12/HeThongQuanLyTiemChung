import { 
  DoctorSchedule, 
  DoctorScheduleCreate, 
  DoctorScheduleUpdate,
  Appointment,
  AppointmentCreate,
  AppointmentUpdate,
  Doctor
} from '../interfaces/doctorSchedule.interface';
import { apiGet, apiPost, apiPut, apiDelete } from '../utils/apiHelper';
import API_CONFIG from '../config/api.config';

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
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString()
      });
      
      if (doctorId) params.append('doctorId', doctorId);
      if (dateFrom) params.append('dateFrom', dateFrom);
      if (dateTo) params.append('dateTo', dateTo);

      const data = await apiGet(`${API_CONFIG.DOCTOR_SCHEDULE.BASE}?${params}`);
      return data;
    } catch (error) {
      console.error('Get doctor schedules error:', error);
      throw error;
    }
  }

  /**
   * Lấy lịch bác sĩ theo ID
   */
  async getDoctorScheduleById(id: string): Promise<DoctorSchedule> {
    try {
      const data = await apiGet(`${API_CONFIG.DOCTOR_SCHEDULE.BASE}/${id}`);
      return data;
    } catch (error) {
      console.error('Get doctor schedule error:', error);
      throw error;
    }
  }

  /**
   * Tạo lịch bác sĩ mới
   */
  async createDoctorSchedule(schedule: DoctorScheduleCreate): Promise<DoctorSchedule> {
    try {
      const data = await apiPost(`${API_CONFIG.DOCTOR_SCHEDULE.BASE}`, schedule);
      return data.payload;
    } catch (error) {
      console.error('Create doctor schedule error:', error);
      throw error;
    }
  }

  /**
   * Cập nhật lịch bác sĩ
   */
  async updateDoctorSchedule(id: string, schedule: DoctorScheduleUpdate): Promise<DoctorSchedule> {
    try {
      const data = await apiPut(`${API_CONFIG.DOCTOR_SCHEDULE.BASE}/${id}`, schedule);
      return data.payload;
    } catch (error) {
      console.error('Update doctor schedule error:', error);
      throw error;
    }
  }

  /**
   * Xóa lịch bác sĩ
   */
  async deleteDoctorSchedule(id: string): Promise<string> {
    try {
      const data = await apiDelete(`${API_CONFIG.DOCTOR_SCHEDULE.BASE}/${id}`);
      return data.payload;
    } catch (error) {
      console.error('Delete doctor schedule error:', error);
      throw error;
    }
  }

  /**
   * Lấy danh sách bác sĩ
   */
  async getDoctors(): Promise<Doctor[]> {
    try {
      const data = await apiGet(`${API_CONFIG.DOCTOR.BASE}`);
      return data.payload;
    } catch (error) {
      console.error('Get doctors error:', error);
      throw error;
    }
  }

  /**
   * Lấy danh sách lịch hẹn
   */
  async getAppointments(
    page: number = 1,
    pageSize: number = 10,
    patientId?: string,
    doctorId?: string,
    status?: string
  ): Promise<any> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString()
      });
      
      if (patientId) params.append('patientId', patientId);
      if (doctorId) params.append('doctorId', doctorId);
      if (status) params.append('status', status);

      const data = await apiGet(`${API_CONFIG.APPOINTMENT.BASE}?${params}`);
      return data.payload;
    } catch (error) {
      console.error('Get appointments error:', error);
      throw error;
    }
  }

  /**
   * Tạo lịch hẹn mới
   */
  async createAppointment(appointment: AppointmentCreate): Promise<Appointment> {
    try {
      const data = await apiPost(`${API_CONFIG.APPOINTMENT.BASE}`, appointment);
      return data.payload;
    } catch (error) {
      console.error('Create appointment error:', error);
      throw error;
    }
  }

  /**
   * Cập nhật lịch hẹn
   */
  async updateAppointment(id: string, appointment: AppointmentUpdate): Promise<Appointment> {
    try {
      const data = await apiPut(`${API_CONFIG.APPOINTMENT.BASE}/${id}`, appointment);
      return data.payload;
    } catch (error) {
      console.error('Update appointment error:', error);
      throw error;
    }
  }

  /**
   * Hủy lịch hẹn
   */
  async cancelAppointment(id: string): Promise<string> {
    try {
      const data = await apiPut(`${API_CONFIG.APPOINTMENT.BASE}/${id}/cancel`, {});
      return data.payload;
    } catch (error) {
      console.error('Cancel appointment error:', error);
      throw error;
    }
  }
}

export default new DoctorScheduleService(); 