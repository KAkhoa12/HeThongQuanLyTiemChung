import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaCalendarAlt, FaClock, FaStethoscope, FaMapMarkerAlt } from 'react-icons/fa';
import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { 
  createAppointmentFromOrder, 
  CreateAppointmentFromOrderDto
} from '../../services/appointment.service';
import { 
  getAllDoctorsNoPage, 
  getSchedulesByDoctorAndLocation
} from '../../services/doctor.service';
import { getAllLocationsNoPage, LocationDto } from '../../services/location.service';
import { getOrderById, OrderDetail } from '../../services/order.service';
import { useApiWithParams } from '../../hooks/useApi';
import { Doctor } from '../../types/doctor.types';

// Sử dụng types đã có sẵn
type Location = LocationDto;
type Order = OrderDetail;

const AppointmentRegistrationFromInvoice: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();

  // States
  const [selectedDoctor, setSelectedDoctor] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [selectedSchedule, setSelectedSchedule] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [ghiChu, setGhiChu] = useState<string>('');

  // API Hooks
  const { data: order, loading: orderLoading, error: orderError, execute: fetchOrder } = useApiWithParams<Order, string>(
    async (id) => getOrderById(id), null
  );

  const { data: doctors, loading: doctorsLoading, execute: fetchDoctors } = useApiWithParams<Doctor[], any>(
    async () => getAllDoctorsNoPage(), null
  );

  const { data: locations, loading: locationsLoading, execute: fetchLocations } = useApiWithParams<Location[], any>(
    async () => getAllLocationsNoPage(), null
  );

  const { data: doctorSchedules, loading: slotsLoading, execute: fetchDoctorSchedules } = useApiWithParams<any, any>(
    async (params) => getSchedulesByDoctorAndLocation(params.doctorId, params.locationId, params.fromDate, params.toDate), null
  );

  const { loading: creating, execute: executeCreateAppointment } = useApiWithParams<any, CreateAppointmentFromOrderDto>(
    async (data) => createAppointmentFromOrder(data), null
  );

  // Load initial data
  useEffect(() => {
    if (orderId) {
      fetchOrder(orderId);
      fetchDoctors({});
      fetchLocations({});
    }
  }, [orderId]);

  // Load available slots when doctor and location are selected
  useEffect(() => {
    if (selectedDoctor && selectedLocation) {
      const today = new Date().toISOString().split('T')[0];
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      const toDate = nextMonth.toISOString().split('T')[0];
      
      fetchDoctorSchedules({
        doctorId: selectedDoctor,
        locationId: selectedLocation,
        fromDate: today,
        toDate: toDate
      });
    }
  }, [selectedDoctor, selectedLocation]);

  // Handle schedule selection
  const handleScheduleSelect = (schedule: any) => {
    setSelectedSchedule(schedule.id);
    setSelectedDate(schedule.workDate);
    // Set default time to start time of the schedule
    setSelectedTime(schedule.startTime);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!order) {
      toast.error('Không tìm thấy thông tin đơn hàng');
      return;
    }

    if (!selectedDoctor || !selectedSchedule || !selectedDate || !selectedTime) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    try {
      const appointmentData: CreateAppointmentFromOrderDto = {
        orderId: order.maDonHang,
        doctorId: selectedDoctor,
        scheduleId: selectedSchedule,
        appointmentDate: selectedDate,
        appointmentTime: selectedTime,
        ghiChu: ghiChu || undefined
      };

      await executeCreateAppointment(appointmentData);
      toast.success('Đăng ký lịch tiêm thành công!');
      navigate('/dashboard/invoices');
    } catch (error) {
      console.error('Lỗi đăng ký lịch tiêm:', error);
      toast.error('Có lỗi xảy ra khi đăng ký lịch tiêm');
    }
  };

  // Format date display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  if (orderLoading || doctorsLoading || locationsLoading) {
    return (
      <DefaultLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DefaultLayout>
    );
  }

  if (orderError || !order || order.trangThaiDon !== 'PAID') {
    return (
      <>
        <div className="mx-auto max-w-4xl p-4 md:p-6 2xl:p-10">
          <div className="mb-6">
            <Breadcrumb pageName="Đăng ký lịch tiêm" />
          </div>
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-red-600 mb-4">
                Không thể đăng ký lịch tiêm
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {orderError ? 'Không tìm thấy đơn hàng' : 'Đơn hàng chưa được thanh toán hoặc không hợp lệ'}
              </p>
              <button
                onClick={() => navigate('/dashboard/invoices')}
                className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary-dark"
              >
                Quay lại danh sách hóa đơn
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="mx-auto max-w-4xl p-4 md:p-6 2xl:p-10">
        <div className="mb-6">
          <Breadcrumb pageName="Đăng ký lịch tiêm" />
        </div>

        {/* Order Information */}
        <div className="mb-6 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-6">
          <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
            Thông tin đơn hàng
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Mã đơn hàng</p>
              <p className="font-medium text-black dark:text-white">{order.maDonHang}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Tổng tiền</p>
              <p className="font-medium text-black dark:text-white">{formatCurrency(order.tongTienThanhToan)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Trạng thái</p>
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Đã thanh toán
              </span>
            </div>
          </div>
        </div>



         {/* Appointment Registration Form */}
         <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Đăng ký lịch tiêm
            </h3>
          </div>

          <form onSubmit={handleSubmit} className="p-6.5">
            {/* Location Selection */}
            <div className="mb-4.5">
              <label className="mb-2.5 block text-black dark:text-white">
                <FaMapMarkerAlt className="inline mr-2" />
                Địa điểm tiêm <span className="text-meta-1">*</span>
              </label>
                             <select
                 value={selectedLocation}
                 onChange={(e) => setSelectedLocation(e.target.value)}
                 className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                 required
               >
                <option value="">Chọn địa điểm</option>
                {locations?.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.name} - {location.address}
                  </option>
                ))}
              </select>
            </div>



            {/* Doctor Selection */}
            <div className="mb-4.5">
              <label className="mb-2.5 block text-black dark:text-white">
                <FaStethoscope className="inline mr-2" />
                Bác sĩ <span className="text-meta-1">*</span>
              </label>
                             <select
                 value={selectedDoctor}
                 onChange={(e) => setSelectedDoctor(e.target.value)}
                 className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                 required
               >
                <option value="">Chọn bác sĩ</option>
                {doctors?.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.name} {doctor.specialty && `- ${doctor.specialty}`}
                  </option>
                ))}
              </select>
            </div>

            {/* Available Slots */}
            {selectedDoctor && selectedLocation && (
              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  <FaCalendarAlt className="inline mr-2" />
                  Lịch trống <span className="text-meta-1">*</span>
                </label>
                {slotsLoading ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  </div>
                ) : doctorSchedules && doctorSchedules.data && doctorSchedules.data.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {doctorSchedules.data
                      .filter((schedule: any) => {
                        // Chỉ hiển thị lịch có sẵn và còn chỗ trống
                        return schedule.status === 'Available' && 
                               (schedule.totalSlots - schedule.bookedSlots) > 0;
                      })
                      .map((schedule: any) => (
                        <div
                          key={schedule.id}
                          onClick={() => handleScheduleSelect(schedule)}
                          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                            selectedSchedule === schedule.id
                              ? 'border-primary bg-primary/10'
                              : 'border-stroke hover:border-primary/50'
                          }`}
                        >
                          <div className="text-sm font-medium text-black dark:text-white">
                            {formatDate(schedule.workDate)}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {schedule.startTime} - {schedule.endTime}
                          </div>
                          <div className="text-xs text-green-600">
                            Còn {schedule.totalSlots - schedule.bookedSlots} chỗ
                          </div>
                          <div className="text-xs text-gray-500">
                            {schedule.locationName}
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="py-4">
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      Không có lịch trống cho bác sĩ và địa điểm đã chọn
                    </p>

                  </div>
                )}
              </div>
            )}

            {/* Time Selection */}
            {selectedSchedule && (
              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  <FaClock className="inline mr-2" />
                  Giờ hẹn <span className="text-meta-1">*</span>
                </label>
                <input
                  type="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  required
                />
              </div>
            )}

            {/* Notes */}
            <div className="mb-6">
              <label className="mb-2.5 block text-black dark:text-white">
                Ghi chú
              </label>
              <textarea
                rows={4}
                value={ghiChu}
                onChange={(e) => setGhiChu(e.target.value)}
                placeholder="Ghi chú thêm về lịch hẹn..."
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              ></textarea>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={creating}
                className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 disabled:opacity-50"
              >
                {creating ? 'Đang đăng ký...' : 'Đăng ký lịch tiêm'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/dashboard/invoices')}
                className="flex w-full justify-center rounded bg-gray-500 p-3 font-medium text-white hover:bg-opacity-90"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AppointmentRegistrationFromInvoice;