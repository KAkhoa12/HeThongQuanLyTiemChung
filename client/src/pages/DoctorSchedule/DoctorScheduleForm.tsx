import React, { useState, useEffect } from 'react';
import { Doctor, DoctorScheduleCreate } from '../../interfaces/doctorSchedule.interface';
import doctorScheduleService from '../../services/doctorSchedule.service';
import { useToast } from '../../hooks/useToast';

interface DoctorScheduleFormProps {
  doctors: Doctor[];
  selectedDoctor: string;
  onScheduleCreated: (schedule: any) => void;
  onBack: () => void;
}

const DoctorScheduleForm: React.FC<DoctorScheduleFormProps> = ({
  doctors,
  selectedDoctor,
  onScheduleCreated,
  onBack
}) => {
  const [formData, setFormData] = useState<DoctorScheduleCreate>({
    doctorId: selectedDoctor || '',
    date: new Date().toISOString().split('T')[0],
    startTime: '08:00',
    endTime: '17:00',
    maxPatients: 20
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    if (selectedDoctor) {
      setFormData(prev => ({ ...prev, doctorId: selectedDoctor }));
    }
  }, [selectedDoctor]);

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.doctorId) {
      newErrors.doctorId = 'Vui lòng chọn bác sĩ';
    }

    if (!formData.date) {
      newErrors.date = 'Vui lòng chọn ngày';
    }

    if (!formData.startTime) {
      newErrors.startTime = 'Vui lòng chọn giờ bắt đầu';
    }

    if (!formData.endTime) {
      newErrors.endTime = 'Vui lòng chọn giờ kết thúc';
    }

    if (formData.startTime >= formData.endTime) {
      newErrors.endTime = 'Giờ kết thúc phải sau giờ bắt đầu';
    }

    if (formData.maxPatients <= 0) {
      newErrors.maxPatients = 'Số lượng bệnh nhân tối đa phải lớn hơn 0';
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
      const newSchedule = await doctorScheduleService.createDoctorSchedule(formData);
      onScheduleCreated(newSchedule);
      showSuccess('Tạo lịch bác sĩ thành công');
    } catch (error) {
      showError('Không thể tạo lịch bác sĩ');
      console.error('Create schedule error:', error);
    } finally {
      setLoading(false);
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

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Ngày <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => handleInputChange('date', e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
              errors.date ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.date && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.date}</p>
          )}
        </div>

        {/* Time Range */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Giờ bắt đầu <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.startTime}
              onChange={(e) => handleInputChange('startTime', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                errors.startTime ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              {timeOptions.map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
            {errors.startTime && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.startTime}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Giờ kết thúc <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.endTime}
              onChange={(e) => handleInputChange('endTime', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                errors.endTime ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              {timeOptions.map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
            {errors.endTime && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.endTime}</p>
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
            value={formData.maxPatients}
            onChange={(e) => handleInputChange('maxPatients', parseInt(e.target.value))}
            min="1"
            max="100"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
              errors.maxPatients ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.maxPatients && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.maxPatients}</p>
          )}
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
              'Tạo Lịch'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DoctorScheduleForm; 