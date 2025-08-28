import { useState, useEffect, useRef } from 'react';
import { DoctorSchedule, DoctorScheduleUpdate } from '../../interfaces/doctorSchedule.interface';
import { useUpdateSchedule } from '../../hooks/useSchedules';
import { toast } from 'react-toastify';

interface ScheduleDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  schedule: DoctorSchedule | null;
  onScheduleUpdate?: (updatedSchedule: DoctorSchedule) => void;
}

const ScheduleDetailModal: React.FC<ScheduleDetailModalProps> = ({
  isOpen,
  onClose,
  schedule,
  onScheduleUpdate
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<DoctorScheduleUpdate>({
    startTime: '',
    endTime: '',
    totalSlots: 0,
    status: ''
  });
  
  const currentScheduleId = useRef<string>('');

  const { loading: updating, error: updateError, execute: executeUpdate } = useUpdateSchedule();

  // Initialize form data when schedule changes
  useEffect(() => {
    if (schedule && schedule.id !== currentScheduleId.current) {
      console.log('🔄 useEffect: Schedule thực sự thay đổi từ', currentScheduleId.current, 'sang', schedule.id);
      currentScheduleId.current = schedule.id;
      
      setFormData({
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        totalSlots: schedule.maxPatients,
        status: schedule.status
      });
      
      // Chỉ reset edit mode khi schedule thực sự là schedule mới
      setIsEditing(false);
      console.log('🔄 Reset isEditing = false cho schedule mới');
    }
  }, [schedule]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'totalSlots' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!schedule) return;

    try {
      // Chỉ gửi các trường đã thay đổi
      const changedData: DoctorScheduleUpdate = {};
      
      // Debug logging
      console.log('🔍 Modal Update Debug:', {
        originalSchedule: {
          startTime: schedule.startTime,
          endTime: schedule.endTime,
          maxPatients: schedule.maxPatients,
          status: schedule.status
        },
        formData: {
          startTime: formData.startTime,
          endTime: formData.endTime,
          totalSlots: formData.totalSlots,
          status: formData.status
        }
      });
      
      if (formData.startTime !== schedule.startTime) {
        changedData.startTime = formData.startTime;
        console.log('📝 StartTime changed:', schedule.startTime, '->', formData.startTime);
      }
      
      if (formData.endTime !== schedule.endTime) {
        changedData.endTime = formData.endTime;
        console.log('📝 EndTime changed:', schedule.endTime, '->', formData.endTime);
      }
      
      if (formData.totalSlots !== schedule.maxPatients) {
        changedData.totalSlots = formData.totalSlots;
        console.log('📝 TotalSlots changed:', schedule.maxPatients, '->', formData.totalSlots);
      }
      
      if (formData.status !== schedule.status) {
        changedData.status = formData.status;
        console.log('📝 Status changed:', schedule.status, '->', formData.status);
      }

      console.log('🚀 Sending changed data:', changedData);

      // Nếu không có gì thay đổi, không cần gọi API
      if (Object.keys(changedData).length === 0) {
        toast.info('Không có thay đổi nào để lưu');
        setIsEditing(false);
        return;
      }

      await executeUpdate({ id: schedule.id, scheduleData: changedData });
      
      if (!updateError) {
        toast.success('Cập nhật lịch làm việc thành công!');
        setIsEditing(false);
        
        // Notify parent component about the update
        if (onScheduleUpdate) {
          const updatedSchedule: DoctorSchedule = {
            ...schedule,
            startTime: changedData.startTime || schedule.startTime,
            endTime: changedData.endTime || schedule.endTime,
            maxPatients: changedData.totalSlots || schedule.maxPatients,
            status: (changedData.status as any) || schedule.status,
            updatedAt: new Date().toISOString()
          };
          onScheduleUpdate(updatedSchedule);
        }
      }
    } catch (error) {
      console.error('Lỗi cập nhật lịch:', error);
      toast.error('Có lỗi xảy ra khi cập nhật lịch làm việc');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data
    if (schedule) {
      setFormData({
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        totalSlots: schedule.maxPatients,
        status: schedule.status
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30';
      case 'full':
        return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30';
      case 'cancelled':
        return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30';
      default:
        return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available':
        return 'Có sẵn';
      case 'full':
        return 'Đầy';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return 'Không xác định';
    }
  };

  if (!isOpen || !schedule) return null;

  // Debug logging
  console.log('🔍 Modal Render Debug:', {
    isOpen,
    hasSchedule: !!schedule,
    isEditing,
    formData
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Chi tiết lịch làm việc
            </h2>
            {isEditing && (
              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded-full">
                Đang chỉnh sửa
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {/* Schedule Information */}
          <div className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Bác sĩ
                </label>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                      {schedule.doctorName.charAt(0)}
                    </span>
                  </div>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {schedule.doctorName}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Ngày làm việc
                </label>
                <p className="text-gray-900 dark:text-white">
                  {new Date(schedule.date).toLocaleDateString('vi-VN', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Trạng thái
                </label>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(schedule.status)}`}>
                  {getStatusText(schedule.status)}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Số bệnh nhân
                </label>
                <p className="text-gray-900 dark:text-white">
                  {schedule.currentPatients}/{schedule.maxPatients}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Còn lại
                </label>
                <p className="text-gray-900 dark:text-white">
                  {schedule.maxPatients - schedule.currentPatients} chỗ
                </p>
              </div>
            </div>
          </div>

          {/* Debug Info - Temporary */}
          <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
            <strong>Debug Info:</strong> isEditing = {isEditing.toString()}
            <br />
            <strong>Schedule ID:</strong> {schedule?.id}
            <br />
            <strong>Current Schedule ID:</strong> {currentScheduleId.current}
            <br />
            <button 
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className="mt-2 px-2 py-1 bg-blue-500 text-white rounded text-sm"
            >
              Toggle Edit (Test)
            </button>
          </div>

          {/* Edit Form */}
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Giờ bắt đầu {isEditing && <span className="text-green-600">(EDITING MODE)</span>}
                </label>
                {isEditing ? (
                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  />
                ) : (
                  <p className="text-gray-900 dark:text-white py-2">
                    {schedule.startTime}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Giờ kết thúc
                </label>
                {isEditing ? (
                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  />
                ) : (
                  <p className="text-gray-900 dark:text-white py-2">
                    {schedule.endTime}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Số lượng bệnh nhân tối đa
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    name="totalSlots"
                    value={formData.totalSlots}
                    onChange={handleInputChange}
                    min="1"
                    max="50"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  />
                ) : (
                  <p className="text-gray-900 dark:text-white py-2">
                    {schedule.maxPatients} bệnh nhân
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Trạng thái
                </label>
                {isEditing ? (
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  >
                    <option value="available">Có sẵn</option>
                    <option value="full">Đầy</option>
                    <option value="cancelled">Đã hủy</option>
                  </select>
                ) : (
                  <p className="text-gray-900 dark:text-white py-2">
                    {getStatusText(schedule.status)}
                  </p>
                )}
              </div>
            </div>

            {/* Error Display */}
            {updateError && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {updateError}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3">
              {isEditing ? (
                <>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={updating}
                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors disabled:opacity-50"
                  >
                    {updating ? 'Đang cập nhật...' : 'Lưu thay đổi'}
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
                  >
                    Đóng
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('🔧 CLICK EVENT TRIGGERED!');
                      console.log('🔧 isEditing trước khi thay đổi:', isEditing);
                      setIsEditing(prev => {
                        console.log('🔧 setIsEditing được gọi, prev:', prev);
                        return true;
                      });
                      console.log('🔧 setIsEditing đã được gọi!');
                    }}
                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
                  >
                    Chỉnh sửa
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ScheduleDetailModal;