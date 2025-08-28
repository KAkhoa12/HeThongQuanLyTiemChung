import React, { useState, useEffect } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DoctorScheduleCalendar from './DoctorScheduleCalendar';
import { DoctorSchedule, Doctor, Appointment } from '../../interfaces/doctorSchedule.interface';
import { useSchedules } from '../../hooks/useSchedules';
import { useDoctors } from '../../hooks/useDoctors';
import { useAppointments } from '../../hooks/useAppointments';
import { useToast } from '../../hooks/useToast';
import { Link } from 'react-router-dom';

const DoctorSchedulePage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedDoctor, setSelectedDoctor] = useState<string>('');
  
  // Hooks API - chỉ khởi tạo, không gọi API tự động
  const { data: schedulesData, loading: schedulesLoading, error: schedulesError, execute: loadSchedules } = useSchedules();
  const { data: doctorsData, loading: doctorsLoading, error: doctorsError, execute: loadDoctors } = useDoctors();
  
  const { showError } = useToast();

  // Chỉ gọi API khi component mount lần đầu
  useEffect(() => {
    console.log('🔍 DoctorSchedule: useEffect chạy - gọi API lần đầu');
    
    const fetchData = async () => {
      try {
        // Load schedules for current month + buffer days (để bao gồm các ngày cuối tháng trước và đầu tháng sau)
        const currentDate = new Date();
        const fromDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        fromDate.setDate(fromDate.getDate() - 7); // Lùi 7 ngày để bao gồm cuối tháng trước
        
        const toDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        toDate.setDate(toDate.getDate() + 7); // Tiến 7 ngày để bao gồm đầu tháng sau
        
        const fromDateStr = fromDate.toISOString().split('T')[0];
        const toDateStr = toDate.toISOString().split('T')[0];
        
        console.log('🔍 Gọi API với params:', { fromDate: fromDateStr, toDate: toDateStr, page: 1, pageSize: 100 });
        console.log('🔍 Khoảng thời gian:', { 
          fromDate: fromDate.toLocaleDateString('vi-VN'), 
          toDate: toDate.toLocaleDateString('vi-VN'),
          totalDays: Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24))
        });
        
        const [schedulesResult, doctorsResult] = await Promise.all([
          loadSchedules({ fromDate: fromDateStr, toDate: toDateStr, page: 1, pageSize: 100 }),
          loadDoctors({ page: 1, pageSize: 100 })
        ]);
        
        console.log('🔍 API Results:', {
          schedules: schedulesResult,
          doctors: doctorsResult
        });
      } catch (error) {
        showError('Lỗi', 'Không thể tải dữ liệu');
        console.error('Load data error:', error);
      }
    };
    
    fetchData();
  }, []); // Dependencies rỗng để chỉ chạy 1 lần

  // Handle month change in calendar
  const handleMonthChange = async (fromDate: string, toDate: string) => {
    try {
      await loadSchedules({ fromDate, toDate, page: 1, pageSize: 100 });
    } catch (error) {
      showError('Lỗi', 'Không thể tải dữ liệu cho tháng mới');
      console.error('Month change error:', error);
    }
  };

  // Handle date selection from calendar
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  // Handle doctor selection
  const handleDoctorSelect = (doctorId: string) => {
    setSelectedDoctor(doctorId);
  };

  // Check if any data is loading
  const isLoading = schedulesLoading || doctorsLoading;

  // Check if any errors occurred
  const hasError = schedulesError || doctorsError;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">Đã xảy ra lỗi khi tải dữ liệu</div>
          <button 
            onClick={() => {
              const currentDate = new Date();
              const fromDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
              fromDate.setDate(fromDate.getDate() - 7); // Lùi 7 ngày
              
              const toDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
              toDate.setDate(toDate.getDate() + 7); // Tiến 7 ngày
              
              const fromDateStr = fromDate.toISOString().split('T')[0];
              const toDateStr = toDate.toISOString().split('T')[0];
              
              Promise.all([
                loadSchedules({ fromDate: fromDateStr, toDate: toDateStr, page: 1, pageSize: 100 }),
                loadDoctors({ page: 1, pageSize: 100 })
              ]);
            }}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  // Convert WorkSchedule to DoctorSchedule format for compatibility
  const convertToDoctorSchedule = (workSchedule: any): DoctorSchedule => ({
    id: workSchedule.id,
    doctorId: workSchedule.doctorId,
    doctorName: workSchedule.doctorName,
    date: workSchedule.workDate, // Backend trả về WorkDate
    startTime: workSchedule.startTime, // Backend trả về StartTime
    endTime: workSchedule.endTime, // Backend trả về EndTime
    maxPatients: workSchedule.totalSlots || 20, // Backend trả về TotalSlots
    currentPatients: workSchedule.bookedSlots || 0, // Backend trả về BookedSlots
    isAvailable: workSchedule.status === 'Available', // Dựa vào Status
    status: workSchedule.status || 'available',
    createdAt: workSchedule.createdAt,
    updatedAt: workSchedule.createdAt // Backend không có updatedAt, dùng createdAt
  });

  // Convert WorkSchedule to Appointment format for compatibility
  const convertToAppointment = (workSchedule: any): Appointment => ({
    id: workSchedule.id,
    patientId: '',
    patientName: '',
    doctorId: workSchedule.doctorId,
    doctorName: workSchedule.doctorName,
    scheduleId: workSchedule.id,
    appointmentDate: workSchedule.workDate, // Backend trả về WorkDate
    appointmentTime: workSchedule.startTime, // Backend trả về StartTime
    status: 'pending',
    notes: '',
    createdAt: workSchedule.createdAt,
    updatedAt: workSchedule.createdAt // Backend không có updatedAt, dùng createdAt
  });

  // Convert API Doctor to interface Doctor format
  const convertToDoctor = (apiDoctor: any): Doctor => ({
    id: apiDoctor.id,
    name: apiDoctor.name,
    specialization: apiDoctor.specialization || 'Không có chuyên khoa',
    phone: apiDoctor.phone || '',
    email: apiDoctor.email || '',
    isActive: apiDoctor.isActive !== false
  });

  // Debug: Log raw data từ backend
  console.log('🔍 Raw schedulesData:', schedulesData);
  console.log('🔍 Raw doctorsData:', doctorsData);

  const schedules = (schedulesData?.data || []).map(convertToDoctorSchedule);
  const appointments: Appointment[] = []; // Không có appointments data
  const doctors = (doctorsData?.data || []).map(convertToDoctor);

  // Debug: Log converted data
  console.log('🔍 Converted schedules:', schedules);
  console.log('🔍 Converted appointments:', appointments);
  console.log('🔍 Converted doctors:', doctors);

  // Debug: Kiểm tra từng schedule sau khi convert
  if (schedules.length > 0) {
    console.log('🔍 Sample schedule after conversion:', schedules[0]);
    console.log('🔍 Schedule date format:', typeof schedules[0].date, schedules[0].date);
    console.log('🔍 Schedule startTime format:', typeof schedules[0].startTime, schedules[0].startTime);
    console.log('🔍 Schedule endTime format:', typeof schedules[0].endTime, schedules[0].endTime);
  }

  return (
    <>
      <Breadcrumb pageName="Lịch Bác Sĩ" />

      {/* Action Buttons */}
      <div className="mb-6 flex gap-4">
        <Link
          to="/dashboard/doctor-schedule/create"
          className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Tạo Lịch Làm Việc
        </Link>
        
        <Link
          to="/dashboard/doctor-schedule/appointment"
          className="px-6 py-3 bg-success text-white rounded-lg hover:bg-success-dark transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Đăng Ký Lịch Hẹn
        </Link>
      </div>

      {/* Calendar Content */}
      <div className="w-full max-w-full rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <DoctorScheduleCalendar
          schedules={schedules}
          appointments={appointments}
          doctors={doctors}
          onDateSelect={handleDateSelect}
          onDoctorSelect={handleDoctorSelect}
          onMonthChange={handleMonthChange}
        />
      </div>
    </>
  );
};

export default DoctorSchedulePage; 