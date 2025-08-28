export interface DoctorSchedule {
  id: string;
  doctorId: string;
  doctorName: string;
  date: string;
  startTime: string;
  endTime: string;
  maxPatients: number;
  currentPatients: number;
  isAvailable: boolean;
  status: 'available' | 'full' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

// Interface cho tạo lịch làm việc - khớp với WorkScheduleCreateDto
export interface DoctorScheduleCreate {
  maBacSi: string;           // Khớp với MaBacSi
  maDiaDiem: string;         // Khớp với MaDiaDiem  
  ngayLam: string;           // Khớp với NgayLam
  gioBatDau: string;         // Khớp với GioBatDau
  gioKetThuc: string;        // Khớp với GioKetThuc
  soLuongCho: number;        // Khớp với SoLuongCho
  trangThai?: string;        // Khớp với TrangThai
}

// Interface cho cập nhật lịch làm việc - khớp với WorkScheduleUpdateDto
export interface DoctorScheduleUpdate {
  startTime?: string;         // Khớp với StartTime
  endTime?: string;           // Khớp với EndTime
  totalSlots?: number;        // Khớp với TotalSlots
  status?: string;            // Khớp với Status
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  scheduleId: string;
  appointmentDate: string;
  appointmentTime: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppointmentCreate {
  patientId: string;
  doctorId: string;
  scheduleId: string;
  appointmentDate: string;
  appointmentTime: string;
  notes?: string;
}

export interface AppointmentUpdate {
  status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  phone: string;
  email: string;
  isActive: boolean;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  backgroundColor: string;
  borderColor: string;
  textColor: string;
  extendedProps: {
    type: 'schedule' | 'appointment';
    doctorId?: string;
    doctorName?: string;
    patientId?: string;
    patientName?: string;
    status?: string;
    maxPatients?: number;
    currentPatients?: number;
  };
} 

// Interface cho lịch hẹn - khớp với AppointmentSlotDto
export interface AppointmentSlot {
  id: string;
  orderId: string;
  customerName: string;
  vaccineId?: string;        // Có thể null
  vaccineName?: string;      // Có thể null
  doseNumber: number;
  appointmentTime: string;
  status?: string;
}

// Interface cho chi tiết lịch làm việc - khớp với WorkScheduleDetailDto
export interface DoctorScheduleDetail {
  id: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty?: string;
  doctorImageUrl?: string;
  locationId: string;
  locationName: string;
  locationAddress?: string;
  workDate: string;
  startTime: string;
  endTime: string;
  totalSlots: number;
  bookedSlots: number;
  status?: string;
  createdAt: string;
  appointments?: AppointmentSlot[];
}

// Interface cho lịch trống - khớp với ScheduleAvailabilityDto
export interface ScheduleAvailability {
  date: string;
  availableTimeSlots: TimeSlot[];
}

// Interface cho khung giờ - khớp với TimeSlotDto
export interface TimeSlot {
  scheduleId: string;
  startTime: string;
  endTime: string;
  availableSlots: number;
}

// Interface cho danh sách lịch làm việc - khớp với WorkScheduleDto
export interface WorkSchedule {
  id: string;
  doctorId: string;
  doctorName: string;
  locationId: string;
  locationName: string;
  workDate: string;
  startTime: string;
  endTime: string;
  totalSlots: number;
  bookedSlots: number;
  status?: string;
  createdAt: string;
} 