import React, { useState, useEffect } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DoctorScheduleForm from './DoctorScheduleForm';
import { Doctor } from '../../interfaces/doctorSchedule.interface';
import { useDoctors } from '../../hooks/useDoctors';
import { useAllLocations } from '../../hooks';
import { useToast } from '../../hooks/useToast';
import { useNavigate } from 'react-router-dom';

const DoctorScheduleCreatePage: React.FC = () => {
  const [selectedDoctor, setSelectedDoctor] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  
  const { data: doctorsData, loading: doctorsLoading, error: doctorsError, execute: loadDoctors } = useDoctors();
  const { data: locationsData, loading: locationsLoading, error: locationsError, execute: loadLocations } = useAllLocations();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  // Load data when component mounts
  useEffect(() => {
    loadDoctors({ page: 1, pageSize: 100 });
    loadLocations();
  }, []);

  // Handle schedule creation
  const handleScheduleCreated = async (newSchedule: any) => {
    try {
      showSuccess('Thành công', 'Tạo lịch bác sĩ thành công');
      navigate('/doctor-schedule');
    } catch (error) {
      showError('Lỗi', 'Không thể tạo lịch bác sĩ');
    }
  };

  // Handle back navigation
  const handleBack = () => {
    navigate('/doctor-schedule');
  };

  if (doctorsLoading || locationsLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (doctorsError || locationsError) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">Đã xảy ra lỗi khi tải dữ liệu</div>
          <button 
            onClick={() => {
              loadDoctors({ page: 1, pageSize: 100 });
              loadLocations();
            }}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  // Convert API Doctor to interface Doctor format
  const convertToDoctor = (apiDoctor: any): Doctor => ({
    id: apiDoctor.id,
    name: apiDoctor.name,
    specialization: apiDoctor.specialization || 'Không có chuyên khoa',
    phone: apiDoctor.phone || '',
    email: apiDoctor.email || '',
    isActive: apiDoctor.isActive !== false
  });

  const doctors = (doctorsData?.data || []).map(convertToDoctor);
  const locations = locationsData || [];

  return (
    <>
      <Breadcrumb pageName="Tạo Lịch Làm Việc" />

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
        <DoctorScheduleForm
          doctors={doctors}
          locations={locations}
          selectedDoctor={selectedDoctor}
          selectedLocation={selectedLocation}
          onScheduleCreated={handleScheduleCreated}
          onBack={handleBack}
        />
      </div>
    </>
  );
};

export default DoctorScheduleCreatePage; 