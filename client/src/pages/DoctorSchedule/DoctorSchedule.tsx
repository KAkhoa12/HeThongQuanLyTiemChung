import React, { useState, useEffect, useCallback } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DoctorScheduleCalendar from './DoctorScheduleCalendar';
import DoctorScheduleForm from './DoctorScheduleForm';
import AppointmentForm from './AppointmentForm';
import { DoctorSchedule, Doctor, Appointment } from '../../interfaces/doctorSchedule.interface';
import doctorScheduleService from '../../services/doctorSchedule.service';
import { useToast } from '../../hooks/useToast';

const DoctorSchedulePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'calendar' | 'schedule' | 'appointment'>('calendar');
  const [schedules, setSchedules] = useState<DoctorSchedule[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedDoctor, setSelectedDoctor] = useState<string>('');
  const { showSuccess, showError } = useToast();

  // Load data
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [schedulesData, doctorsData, appointmentsData] = await Promise.all([
        doctorScheduleService.getDoctorSchedules(1, 100),
        doctorScheduleService.getDoctors(),
        doctorScheduleService.getAppointments(1, 100)
      ]);

      setSchedules(schedulesData?.data || []);
      setDoctors(doctorsData || []);
      setAppointments(appointmentsData?.data || []);
    } catch (error) {
      showError('Lỗi', 'Không thể tải dữ liệu');
      console.error('Load data error:', error);
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle schedule creation
  const handleScheduleCreated = useCallback(async (newSchedule: DoctorSchedule) => {
    try {
      setSchedules(prev => [...prev, newSchedule]);
      showSuccess('Thành công', 'Tạo lịch bác sĩ thành công');
      setActiveTab('calendar');
    } catch (error) {
      showError('Lỗi', 'Không thể tạo lịch bác sĩ', );
    }
  }, [showSuccess, showError]);

  // Handle appointment creation
  const handleAppointmentCreated = useCallback(async (newAppointment: Appointment) => {
    try {
      setAppointments(prev => [...prev, newAppointment]);
      showSuccess('Thành công', 'Đăng ký lịch hẹn thành công');
      setActiveTab('calendar');
    } catch (error) {
      showError('Lỗi', 'Không thể đăng ký lịch hẹn');
    }
  }, [showSuccess, showError]);

  // Handle date selection from calendar
  const handleDateSelect = useCallback((date: Date) => {
    setSelectedDate(date);
    setActiveTab('appointment');
  }, []);

  // Handle doctor selection
  const handleDoctorSelect = useCallback((doctorId: string) => {
    setSelectedDoctor(doctorId);
    setActiveTab('schedule');
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <Breadcrumb pageName="Lịch Bác Sĩ" />

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg dark:bg-gray-800">
          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'calendar'
                ? 'bg-white text-primary shadow-sm dark:bg-gray-700 dark:text-primary'
                : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            Lịch
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'schedule'
                ? 'bg-white text-primary shadow-sm dark:bg-gray-700 dark:text-primary'
                : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            Tạo Lịch
          </button>
          <button
            onClick={() => setActiveTab('appointment')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'appointment'
                ? 'bg-white text-primary shadow-sm dark:bg-gray-700 dark:text-primary'
                : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            Đăng Ký Lịch Hẹn
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="w-full max-w-full rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        {activeTab === 'calendar' && (
          <DoctorScheduleCalendar
            schedules={schedules}
            appointments={appointments}
            doctors={doctors}
            onDateSelect={handleDateSelect}
            onDoctorSelect={handleDoctorSelect}
          />
        )}
        
        {activeTab === 'schedule' && (
          <DoctorScheduleForm
            doctors={doctors}
            selectedDoctor={selectedDoctor}
            onScheduleCreated={handleScheduleCreated}
            onBack={() => setActiveTab('calendar')}
          />
        )}
        
        {activeTab === 'appointment' && (
          <AppointmentForm
            schedules={schedules}
            doctors={doctors}
            selectedDate={selectedDate}
            selectedDoctor={selectedDoctor}
            onAppointmentCreated={handleAppointmentCreated}
            onBack={() => setActiveTab('calendar')}
          />
        )}
      </div>
    </>
  );
};

export default DoctorSchedulePage; 