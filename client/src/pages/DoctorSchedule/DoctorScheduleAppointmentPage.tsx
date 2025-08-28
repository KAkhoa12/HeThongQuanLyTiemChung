import React, { useState, useEffect } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import AppointmentForm from './AppointmentForm';
import { DoctorSchedule, Doctor, Appointment } from '../../interfaces/doctorSchedule.interface';
import { useSchedules } from '../../hooks/useSchedules';
import { useDoctors } from '../../hooks/useDoctors';
import { useToast } from '../../hooks/useToast';
import { useNavigate } from 'react-router-dom';

const DoctorScheduleAppointmentPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedDoctor, setSelectedDoctor] = useState<string>('');
  
  const { data: schedulesData, loading: schedulesLoading, error: schedulesError, execute: loadSchedules } = useSchedules();
  const { data: doctorsData, loading: doctorsLoading, error: doctorsError, execute: loadDoctors } = useDoctors();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  // Load data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentDate = new Date();
        const fromDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString().split('T')[0];
        const toDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).toISOString().split('T')[0];
        
        await Promise.all([
          loadSchedules({ fromDate, toDate, page: 1, pageSize: 100 }),
          loadDoctors({ page: 1, pageSize: 100 })
        ]);
      } catch (error) {
        showError('Lỗi', 'Không thể tải dữ liệu');
        console.error('Load data error:', error);
      }
    };
    
    fetchData();
  }, []);

  // Handle appointment creation
  const handleAppointmentCreated = async (newAppointment: Appointment) => {
    try {
      showSuccess('Thành công', 'Đăng ký lịch hẹn thành công');
      navigate('/doctor-schedule');
    } catch (error) {
      showError('Lỗi', 'Không thể đăng ký lịch hẹn');
    }
  };

  // Handle back navigation
  const handleBack = () => {
    navigate('/doctor-schedule');
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
              const fromDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString().split('T')[0];
              const toDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).toISOString().split('T')[0];
              
              Promise.all([
                loadSchedules({ fromDate, toDate, page: 1, pageSize: 100 }),
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
    date: workSchedule.date,
    startTime: workSchedule.startTime,
    endTime: workSchedule.endTime,
    maxPatients: workSchedule.maxPatients || 20,
    currentPatients: workSchedule.currentPatients || 0,
    isAvailable: workSchedule.isAvailable !== false,
    status: workSchedule.status || 'available',
    createdAt: workSchedule.createdAt,
    updatedAt: workSchedule.updatedAt
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

  const schedules = (schedulesData?.data || []).map(convertToDoctorSchedule);
  const doctors = (doctorsData?.data || []).map(convertToDoctor);

  return (
    <>
      <Breadcrumb pageName="Đăng Ký Lịch Hẹn" />

      {/* Back Button */}
      <div className="mb-6">
        <button
          onClick={handleBack}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Quay lại
        </button>
      </div>

      {/* Form Content */}
      <div className="w-full max-w-full rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <AppointmentForm
          schedules={schedules}
          doctors={doctors}
          selectedDate={selectedDate}
          selectedDoctor={selectedDoctor}
          onAppointmentCreated={handleAppointmentCreated}
          onBack={handleBack}
        />
      </div>
    </>
  );
};

export default DoctorScheduleAppointmentPage; 