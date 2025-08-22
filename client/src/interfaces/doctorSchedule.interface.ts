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

export interface DoctorScheduleCreate {
  doctorId: string;
  date: string;
  startTime: string;
  endTime: string;
  maxPatients: number;
}

export interface DoctorScheduleUpdate {
  startTime?: string;
  endTime?: string;
  maxPatients?: number;
  isAvailable?: boolean;
  status?: 'available' | 'full' | 'cancelled';
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