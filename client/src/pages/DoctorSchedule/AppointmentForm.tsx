import React, { useState, useEffect, useMemo } from 'react';
import { Doctor, DoctorSchedule, AppointmentCreate } from '../../interfaces/doctorSchedule.interface';
import doctorScheduleService from '../../services/doctorSchedule.service';
import { useToast } from '../../hooks/useToast';

interface AppointmentFormProps {
  schedules: DoctorSchedule[];
  doctors: Doctor[];
  selectedDate: Date;
  selectedDoctor: string;
  onAppointmentCreated: (appointment: any) => void;
  onBack: () => void;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({
  schedules,
  doctors,
  selectedDate,
  selectedDoctor,
  onAppointmentCreated,
  onBack
}) => {
  const [formData, setFormData] = useState<AppointmentCreate>({
    patientId: '',
    doctorId: selectedDoctor || '',
    scheduleId: '',
    appointmentDate: selectedDate.toISOString().split('T')[0],
    appointmentTime: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { showSuccess, showError } = useToast();

  // Filter available schedules for selected date and doctor
  const availableSchedules = useMemo(() => {
    return schedules.filter(schedule => {
      const scheduleDate = schedule.date;
      const selectedDateStr = selectedDate.toISOString().split('T')[0];
      
      return schedule.date === selectedDateStr &&
             schedule.doctorId === formData.doctorId &&
             schedule.isAvailable &&
             schedule.currentPatients < schedule.maxPatients;
    });
  }, [schedules, selectedDate, formData.doctorId]);

  // Get available time slots
  const availableTimeSlots = useMemo(() => {
    if (!formData.scheduleId) return [];
    
    const selectedSchedule = schedules.find(s => s.id === formData.scheduleId);
    if (!selectedSchedule) return [];

    const slots = [];
    const startTime = new Date(`2000-01-01T${selectedSchedule.startTime}`);
    const endTime = new Date(`2000-01-01T${selectedSchedule.endTime}`);
    
    // Generate 30-minute slots
    const currentTime = new Date(startTime);
    while (currentTime < endTime) {
      const timeStr = currentTime.toTimeString().slice(0, 5);
      slots.push(timeStr);
      currentTime.setMinutes(currentTime.getMinutes() + 30);
    }

    return slots;
  }, [formData.scheduleId, schedules]);

  useEffect(() => {
    if (selectedDoctor) {
      setFormData(prev => ({ ...prev, doctorId: selectedDoctor }));
    }
  }, [selectedDoctor]);

  useEffect(() => {
    setFormData(prev => ({ ...prev, appointmentDate: selectedDate.toISOString().split('T')[0] }));
  }, [selectedDate]);

  // Reset schedule and time when doctor changes
  useEffect(() => {
    setFormData(prev => ({ ...prev, scheduleId: '', appointmentTime: '' }));
  }, [formData.doctorId]);

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.doctorId) {
      newErrors.doctorId = 'Vui lòng chọn bác sĩ';
    }

    if (!formData.scheduleId) {
      newErrors.scheduleId = 'Vui lòng chọn lịch';
    }

    if (!formData.appointmentTime) {
      newErrors.appointmentTime = 'Vui lòng chọn giờ hẹn';
    }

    if (!formData.patientId) {
      newErrors.patientId = 'Vui lòng nhập mã bệnh nhân';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const newAppointment = await doctorScheduleService.createAppointment(formData);
      onAppointmentCreated(newAppointment);
      showSuccess('Đăng ký lịch hẹn thành công', 'Đăng ký lịch hẹn thành công');
    } catch (error) {
      showError('Không thể đăng ký lịch hẹn', 'Không thể đăng ký lịch hẹn');
      console.error('Create appointment error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handleInputChange = (field: keyof AppointmentCreate, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Đăng Ký Lịch Hẹn
        </h2>
        <button
          onClick={onBack}
          className="px-4 py-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
        >
          <i className="ri-arrow-left-line mr-2"></i>
          Quay lại
        </button>
      </div>

      {/* Selected Date Info */}
      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <p className="text-blue-800 dark:text-blue-200 font-medium">
          Ngày đã chọn: {formatDate(selectedDate)}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        {/* Doctor Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Bác sĩ <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.doctorId}
            onChange={(e) => handleInputChange('doctorId', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
              errors.doctorId ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Chọn bác sĩ</option>
            {doctors.map(doctor => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.name} - {doctor.specialization}
              </option>
            ))}
          </select>
          {errors.doctorId && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.doctorId}</p>
          )}
        </div>

        {/* Schedule Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Lịch khám <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.scheduleId}
            onChange={(e) => handleInputChange('scheduleId', e.target.value)}
            disabled={!formData.doctorId}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
              errors.scheduleId ? 'border-red-500' : 'border-gray-300'
            } ${!formData.doctorId ? 'bg-gray-100 dark:bg-gray-600 cursor-not-allowed' : ''}`}
          >
            <option value="">Chọn lịch khám</option>
            {availableSchedules.map(schedule => (
              <option key={schedule.id} value={schedule.id}>
                {schedule.startTime} - {schedule.endTime} 
                ({schedule.currentPatients}/{schedule.maxPatients} bệnh nhân)
              </option>
            ))}
          </select>
          {errors.scheduleId && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.scheduleId}</p>
          )}
          {availableSchedules.length === 0 && formData.doctorId && (
            <p className="mt-1 text-sm text-yellow-600 dark:text-yellow-400">
              Không có lịch khám nào khả dụng cho ngày này
            </p>
          )}
        </div>

        {/* Time Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Giờ hẹn <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.appointmentTime}
            onChange={(e) => handleInputChange('appointmentTime', e.target.value)}
            disabled={!formData.scheduleId}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
              errors.appointmentTime ? 'border-red-500' : 'border-gray-300'
            } ${!formData.scheduleId ? 'bg-gray-100 dark:bg-gray-600 cursor-not-allowed' : ''}`}
          >
            <option value="">Chọn giờ hẹn</option>
            {availableTimeSlots.map(time => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>
          {errors.appointmentTime && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.appointmentTime}</p>
          )}
        </div>

        {/* Patient ID */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Mã bệnh nhân <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.patientId}
            onChange={(e) => handleInputChange('patientId', e.target.value)}
            placeholder="Nhập mã bệnh nhân"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
              errors.patientId ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.patientId && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.patientId}</p>
          )}
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Ghi chú
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            placeholder="Ghi chú về lịch hẹn (nếu có)"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={loading || availableSchedules.length === 0}
            className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <span className="flex items-center">
                <i className="ri-loader-4-line animate-spin mr-2"></i>
                Đang đăng ký...
              </span>
            ) : (
              'Đăng Ký Lịch Hẹn'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AppointmentForm; 