import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useKeHoachTiemByOrder } from '../../../hooks/useKeHoachTiem';
import { useAllLocations } from '../../../hooks/useLocations';
import { useToast } from '../../../hooks/useToast';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';

const CustomerVaccinationPlanDetailPage: React.FC = () => {
  const { customerId, orderId } = useParams<{ customerId: string; orderId: string }>();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  
  const { data: scheduleData, loading: scheduleLoading, execute: fetchSchedule } = useKeHoachTiemByOrder();
  const { data: locationsData, execute: fetchLocations } = useAllLocations();
  
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedLocationId, setSelectedLocationId] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [notes, setNotes] = useState('');
  const [isCreatingSchedule, setIsCreatingSchedule] = useState(false);

  useEffect(() => {
    if (orderId) {
      fetchSchedule({ orderId });
    }
    fetchLocations();
  }, [orderId, fetchSchedule, fetchLocations]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'SCHEDULED': return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS': return 'bg-purple-100 text-purple-800';
      case 'MISSED': return 'bg-red-100 text-red-800';
      case 'CANCELLED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'Hoàn thành';
      case 'PENDING': return 'Chờ xử lý';
      case 'SCHEDULED': return 'Đã lên lịch';
      case 'IN_PROGRESS': return 'Đang tiến hành';
      case 'MISSED': return 'Đã bỏ lỡ';
      case 'CANCELLED': return 'Đã hủy';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED': return '✅';
      case 'PENDING': return '⏳';
      case 'SCHEDULED': return '📅';
      case 'IN_PROGRESS': return '🔄';
      case 'MISSED': return '❌';
      case 'CANCELLED': return '🚫';
      default: return '❓';
    }
  };

  const handleCreateSchedule = () => {
    setShowScheduleModal(true);
  };

  const handleConfirmCreateSchedule = async () => {
    if (!selectedLocationId || !selectedDate || !selectedTime) {
      showError('Lỗi', 'Vui lòng điền đầy đủ thông tin');
      return;
    }

    setIsCreatingSchedule(true);
    try {
      // Combine date and time
      const appointmentDateTime = `${selectedDate}T${selectedTime}:00`;
      
      // Call API to create appointment
      const { lichHenService } = await import('../../../services/appointment.service');
      await lichHenService.createLichHen({
        orderId: orderId!,
        locationId: selectedLocationId,
        appointmentDate: appointmentDateTime,
        note: notes || `Lịch hẹn tiêm chủng cho đơn hàng ${orderId}`
      });

      showSuccess('Thành công', 'Tạo lịch hẹn thành công!');
      setShowScheduleModal(false);
      setSelectedLocationId('');
      setSelectedDate('');
      setSelectedTime('');
      setNotes('');
      
      // Refresh schedule data
      if (orderId) {
        fetchSchedule({ orderId });
      }
    } catch (error: any) {
      showError('Lỗi', error?.message || 'Có lỗi xảy ra khi tạo lịch hẹn');
    } finally {
      setIsCreatingSchedule(false);
    }
  };

  const handleCancelSchedule = () => {
    setShowScheduleModal(false);
    setSelectedLocationId('');
    setSelectedDate('');
    setSelectedTime('');
    setNotes('');
  };

  if (scheduleLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Breadcrumb pageName={`Kế hoạch tiêm - Đơn hàng ${orderId?.slice(-8)}`} />

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-title-md2 font-semibold text-black dark:text-white">
            Kế hoạch tiêm chủng
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Đơn hàng: {orderId} | Khách hàng: {customerId}
          </p>
        </div>
        <button
          onClick={handleCreateSchedule}
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-center font-medium text-white hover:bg-opacity-90"
        >
          <i className="ri-calendar-line mr-2"></i>
          Tạo lịch hẹn
        </button>
      </div>

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Chi tiết kế hoạch tiêm ({scheduleData?.totalPlans || 0} mũi tiêm)
          </h3>
        </div>
        <div className="p-6.5">
          {!scheduleData || scheduleData.totalPlans === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">📅</span>
              </div>
              <p className="text-gray-500">Chưa có kế hoạch tiêm</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Schedule by Mui Thu */}
              {scheduleData.scheduleByMuiThu && scheduleData.scheduleByMuiThu.length > 0 ? (
                scheduleData.scheduleByMuiThu.map((schedule: any, index: number) => (
                  <div key={index} className="bg-gray-50 rounded-lg border border-gray-200 p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-lg font-semibold text-gray-900">
                        💉 Tiêm lần thứ {schedule.muiThu}
                      </h4>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        {schedule.totalVaccines} vaccine
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {schedule.vaccines && schedule.vaccines.length > 0 ? (
                        schedule.vaccines.map((vaccine: any, vaccineIndex: number) => (
                          <div key={vaccineIndex} className="bg-white rounded-lg border border-gray-200 p-4">
                            <div className="flex items-center justify-between mb-3">
                              <h5 className="font-medium text-gray-900 text-sm">{vaccine.vaccineName}</h5>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(vaccine.trangThai)}`}>
                                {getStatusText(vaccine.trangThai)}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <span className="text-xs text-gray-600 mr-2">{getStatusIcon(vaccine.trangThai)}</span>
                              <span className="text-xs text-gray-600">
                                {vaccine.ngayDuKien ? 
                                  new Date(vaccine.ngayDuKien).toLocaleDateString('vi-VN') : 
                                  'Chưa xác định'
                                }
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="col-span-full text-center py-2 text-gray-500 text-sm">
                          Không có vaccine nào trong mũi này
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">📅</span>
                  </div>
                  <p className="text-gray-500">Chưa có lịch tiêm</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="mt-6 flex justify-end gap-4">
        <button
          onClick={() => navigate(`/dashboard/nguoi-dung/khach-hang/${customerId}`)}
          className="inline-flex items-center justify-center rounded-md border border-stroke bg-white px-4 py-2 text-center font-medium text-black hover:bg-opacity-90 dark:border-strokedark dark:bg-boxdark dark:text-white"
        >
          Quay lại
        </button>
      </div>

      {/* Create Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Tạo lịch hẹn tiêm chủng</h3>
              <button
                onClick={handleCancelSchedule}
                className="text-gray-400 hover:text-gray-600"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>

            <div className="space-y-4">
              {/* Location Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Địa điểm tiêm chủng *
                </label>
                <select
                  value={selectedLocationId}
                  onChange={(e) => setSelectedLocationId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  <option value="">Chọn địa điểm</option>
                  {locationsData?.map((location) => (
                    <option key={location.id} value={location.id}>
                      {location.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ngày hẹn *
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              {/* Time Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Giờ hẹn *
                </label>
                <input
                  type="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ghi chú
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Nhập ghi chú (tùy chọn)"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={handleCancelSchedule}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                disabled={isCreatingSchedule}
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmCreateSchedule}
                disabled={isCreatingSchedule}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90 disabled:opacity-50"
              >
                {isCreatingSchedule ? 'Đang tạo...' : 'Tạo lịch hẹn'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerVaccinationPlanDetailPage;