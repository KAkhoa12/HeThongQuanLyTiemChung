export interface Doctor {
  id: string;
  userId: string;
  name: string;
  phone?: string;
  email?: string;
  specialty?: string;
  licenseNumber?: string;
  imageUrl?: string;
  createdAt: string;
}

export interface DoctorDetail extends Doctor {
  upcomingSchedules?: DoctorSchedule[];
}

export interface DoctorSchedule {
  id: string;
  workDate: string;
  startTime: string;
  endTime: string;
  locationId: string;
  locationName: string;
  totalSlots: number;
  bookedSlots: number;
  status?: string;
}

export interface DoctorCreateRequest {
  userId: string;
  specialty?: string;
  licenseNumber?: string;
}

export interface DoctorUpdateRequest {
  specialty?: string;
  licenseNumber?: string;
}

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

export interface WorkScheduleDetail extends WorkSchedule {
  doctorSpecialty?: string;
  doctorImageUrl?: string;
  locationAddress?: string;
  appointments?: AppointmentSlot[];
}

export interface AppointmentSlot {
  id: string;
  orderId: string;
  customerName: string;
  vaccineId: string;
  vaccineName: string;
  doseNumber: number;
  appointmentTime: string;
  status?: string;
}

export interface WorkScheduleCreateRequest {
  doctorId: string;
  locationId: string;
  workDate: string;
  startTime: string;
  endTime: string;
  totalSlots: number;
  status?: string;
}

export interface WorkScheduleUpdateRequest {
  startTime?: string;
  endTime?: string;
  totalSlots?: number;
  status?: string;
}

export interface ScheduleAvailability {
  date: string;
  availableTimeSlots: TimeSlot[];
}

export interface TimeSlot {
  scheduleId: string;
  startTime: string;
  endTime: string;
  availableSlots: number;
}