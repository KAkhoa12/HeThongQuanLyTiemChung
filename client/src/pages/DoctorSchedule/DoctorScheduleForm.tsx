import React, { useState, useEffect } from 'react';
import { Doctor, DoctorScheduleCreate } from '../../interfaces/doctorSchedule.interface';
import { useCreateSchedule } from '../../hooks/useSchedules';
import { useToast } from '../../hooks/useToast';
import { LocationDto } from '../../services/location.service';

interface DoctorScheduleFormProps {
  doctors: Doctor[];
  locations: LocationDto[];
  selectedDoctor: string;
  selectedLocation: string;
  onScheduleCreated: (schedule: any) => void;
  onBack: () => void;
}

const DoctorScheduleForm: React.FC<DoctorScheduleFormProps> = ({
  doctors,
  locations,
  selectedDoctor,
  selectedLocation,
  onScheduleCreated,
  onBack
}) => {
  const [formData, setFormData] = useState<DoctorScheduleCreate>({
    maBacSi: selectedDoctor || '',
    maDiaDiem: selectedLocation || '',
    ngayLam: new Date().toISOString().split('T')[0],
    gioBatDau: '08:00',
    gioKetThuc: '17:00',
    soLuongCho: 20
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Auto schedule configuration
  const [autoScheduleConfig, setAutoScheduleConfig] = useState({
    workingDays: 5,
    lunchBreak: '12:00-13:00'
  });
  
  // Hooks API
  const { execute: createSchedule, loading, error } = useCreateSchedule();
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    if (selectedDoctor) {
      setFormData(prev => ({ ...prev, maBacSi: selectedDoctor }));
    }
  }, [selectedDoctor]);

  useEffect(() => {
    if (selectedLocation) {
      setFormData(prev => ({ ...prev, maDiaDiem: selectedLocation }));
    }
  }, [selectedLocation]);

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.maBacSi) {
      newErrors.maBacSi = 'Vui lòng chọn bác sĩ';
    }

    if (!formData.maDiaDiem) {
      newErrors.maDiaDiem = 'Vui lòng chọn địa điểm';
    }

    if (!formData.ngayLam) {
      newErrors.ngayLam = 'Vui lòng chọn ngày';
    }

    if (!formData.gioBatDau) {
      newErrors.gioBatDau = 'Vui lòng chọn giờ bắt đầu';
    }

    if (!formData.gioKetThuc) {
      newErrors.gioKetThuc = 'Vui lòng chọn giờ kết thúc';
    }

    if (formData.gioBatDau >= formData.gioKetThuc) {
      newErrors.gioKetThuc = 'Giờ kết thúc phải sau giờ bắt đầu';
    }

    if (formData.soLuongCho <= 0) {
      newErrors.soLuongCho = 'Số lượng bệnh nhân tối đa phải lớn hơn 0';
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

    try {
      // Debug: Log data trước khi gửi
      console.log('🔍 Frontend - Data gửi đi:', formData);
      console.log('🔍 Frontend - Date type:', typeof formData.ngayLam);
      console.log('🔍 Frontend - Date value:', formData.ngayLam);
      
      const newSchedule = await createSchedule(formData);
      onScheduleCreated(newSchedule);
      showSuccess('Thành công', 'Tạo lịch bác sĩ thành công');
    } catch (error) {
      showError('Lỗi', 'Không thể tạo lịch bác sĩ');
      console.error('Create schedule error:', error);
    }
  };

  // Handle input changes
  const handleInputChange = (field: keyof DoctorScheduleCreate, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Generate auto schedule for next 2 weeks
  const generateAutoSchedule = () => {
    const schedules = [];
    const today = new Date();
    
    for (let week = 0; week < 2; week++) {
      for (let day = 0; day < autoScheduleConfig.workingDays; day++) {
        const scheduleDate = new Date(today);
        scheduleDate.setDate(today.getDate() + (week * 7) + day + 1); // +1 to start from next day
        
        // Skip weekends if working days < 7
        if (autoScheduleConfig.workingDays < 7) {
          const dayOfWeek = scheduleDate.getDay();
          if (dayOfWeek === 0 || dayOfWeek === 6) continue; // Skip Sunday and Saturday
        }
        
        const schedule: DoctorScheduleCreate = {
          maBacSi: formData.maBacSi,
          maDiaDiem: formData.maDiaDiem,
          ngayLam: scheduleDate.toISOString().split('T')[0],
          gioBatDau: formData.gioBatDau,
          gioKetThuc: formData.gioKetThuc,
          soLuongCho: formData.soLuongCho
        };
        
        schedules.push(schedule);
      }
    }
    
    return schedules;
  };

  // Handle auto schedule creation
  const handleAutoSchedule = async () => {
    if (!formData.maBacSi || !formData.maDiaDiem) {
      showError('Lỗi', 'Vui lòng chọn bác sĩ và địa điểm trước');
      return;
    }

    try {
      const schedules = generateAutoSchedule();
      let successCount = 0;
      
      for (const schedule of schedules) {
        try {
          await createSchedule(schedule);
          successCount++;
        } catch (error) {
          console.error('Failed to create schedule:', schedule, error);
        }
      }
      
      if (successCount > 0) {
        showSuccess('Thành công', `Đã tạo ${successCount}/${schedules.length} lịch làm việc`);
        onScheduleCreated({ success: true, count: successCount });
      } else {
        showError('Lỗi', 'Không thể tạo lịch tự động');
      }
    } catch (error) {
      showError('Lỗi', 'Không thể tạo lịch tự động');
      console.error('Auto schedule error:', error);
    }
  };

  // Handle preview auto schedule
  const handlePreviewAutoSchedule = () => {
    if (!formData.maBacSi || !formData.maDiaDiem) {
      showError('Lỗi', 'Vui lòng chọn bác sĩ và địa điểm trước');
      return;
    }

    const schedules = generateAutoSchedule();
    const previewData = {
      doctorId: formData.maBacSi,
      locationId: formData.maDiaDiem,
      schedules: schedules
    };
    
    // Show preview modal or navigate to preview page
    console.log('Preview auto schedule:', previewData);
    showSuccess('Xem trước', `Sẽ tạo ${schedules.length} lịch làm việc trong 2 tuần tới`);
  };

  // Generate time options
  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        options.push(time);
      }
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Tạo Lịch Bác Sĩ
        </h2>
        <button
          onClick={onBack}
          className="px-4 py-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
        >
          <i className="ri-arrow-left-line mr-2"></i>
          Quay lại
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        {/* Doctor Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Bác sĩ <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.maBacSi}
            onChange={(e) => handleInputChange('maBacSi', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
              errors.maBacSi ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Chọn bác sĩ</option>
            {doctors.map(doctor => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.name} - {doctor.specialization}
              </option>
            ))}
          </select>
          {errors.maBacSi && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.maBacSi}</p>
          )}
        </div>

        {/* Location Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Địa điểm <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.maDiaDiem}
            onChange={(e) => handleInputChange('maDiaDiem', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
              errors.maDiaDiem ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Chọn địa điểm</option>
            {locations.map(location => (
              <option key={location.id} value={location.id}>
                {location.name} - {location.address}
              </option>
            ))}
          </select>
          {errors.maDiaDiem && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.maDiaDiem}</p>
          )}
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Ngày <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={formData.ngayLam}
            onChange={(e) => handleInputChange('ngayLam', e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
              errors.ngayLam ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.ngayLam && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.ngayLam}</p>
          )}
        </div>

        {/* Time Range */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Giờ bắt đầu <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.gioBatDau}
              onChange={(e) => handleInputChange('gioBatDau', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                errors.gioBatDau ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              {timeOptions.map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
            {errors.gioBatDau && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.gioBatDau}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Giờ kết thúc <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.gioKetThuc}
              onChange={(e) => handleInputChange('gioKetThuc', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                errors.gioKetThuc ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              {timeOptions.map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
            {errors.gioKetThuc && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.gioKetThuc}</p>
            )}
          </div>
        </div>

        {/* Max Patients */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Số lượng bệnh nhân tối đa <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={formData.soLuongCho}
            onChange={(e) => handleInputChange('soLuongCho', parseInt(e.target.value))}
            min="1"
            max="100"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
              errors.soLuongCho ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.soLuongCho && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.soLuongCho}</p>
          )}
        </div>

        {/* Auto Schedule Options */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Tạo Lịch Tự Động (2 Tuần)
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Số ngày làm việc trong tuần
              </label>
              <select
                value={autoScheduleConfig.workingDays}
                onChange={(e) => setAutoScheduleConfig(prev => ({ ...prev, workingDays: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value={5}>5 ngày (Thứ 2 - Thứ 6)</option>
                <option value={6}>6 ngày (Thứ 2 - Thứ 7)</option>
                <option value={7}>7 ngày (Cả tuần)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Giờ nghỉ trưa
              </label>
              <select
                value={autoScheduleConfig.lunchBreak}
                onChange={(e) => setAutoScheduleConfig(prev => ({ ...prev, lunchBreak: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="12:00-13:00">12:00 - 13:00</option>
                <option value="12:30-13:30">12:30 - 13:30</option>
                <option value="11:30-12:30">11:30 - 12:30</option>
                <option value="none">Không nghỉ trưa</option>
              </select>
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={handleAutoSchedule}
              disabled={loading || !formData.maBacSi || !formData.maDiaDiem}
              className="px-6 py-2 bg-success text-white rounded-md hover:bg-success-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Tạo Lịch Tự Động
            </button>
            
            <button
              type="button"
              onClick={handlePreviewAutoSchedule}
              disabled={!formData.maBacSi || !formData.maDiaDiem}
              className="px-6 py-2 bg-info text-white rounded-md hover:bg-info-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Xem Trước
            </button>
          </div>
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
            disabled={loading}
            className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <span className="flex items-center">
                <i className="ri-loader-4-line animate-spin mr-2"></i>
                Đang tạo...
              </span>
            ) : (
              'Tạo Lịch Đơn Lẻ'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DoctorScheduleForm; 