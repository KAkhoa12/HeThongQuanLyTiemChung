import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaCalendarAlt, FaClock, FaUserMd, FaMapMarkerAlt, FaCheckCircle } from 'react-icons/fa';
import { useAvailableSlots, useCreateAppointmentFromOrder, useAppointmentsByCustomer } from '../../hooks';
import { useAuth } from '../../hooks';
import { AvailableSlot } from '../../services/appointment.service';

const AppointmentRegistrationPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // States
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [notes, setNotes] = useState('');
  const [orderId, setOrderId] = useState('');

  // Mock data - trong thực tế sẽ lấy từ API
  const doctors = [
    { id: 'doc1', name: 'Bác sĩ Nguyễn Văn A', specialty: 'Nhi khoa' },
    { id: 'doc2', name: 'Bác sĩ Trần Thị B', specialty: 'Nhi khoa' },
    { id: 'doc3', name: 'Bác sĩ Lê Văn C', specialty: 'Nhi khoa' }
  ];

  const locations = [
    { id: 'loc1', name: 'Trung tâm Tiêm chủng Hà Nội', address: '123 Đường ABC, Hà Nội' },
    { id: 'loc2', name: 'Bệnh viện Nhi Trung ương', address: '456 Đường XYZ, Hà Nội' },
    { id: 'loc3', name: 'Phòng khám Đa khoa ABC', address: '789 Đường DEF, Hà Nội' }
  ];

  const services = [
    { id: 'svc1', name: 'Vaccine 5 trong 1', price: '150,000 VNĐ' },
    { id: 'svc2', name: 'Vaccine 6 trong 1', price: '180,000 VNĐ' },
    { id: 'svc3', name: 'Vaccine cúm mùa', price: '120,000 VNĐ' }
  ];

  // Hooks
  const { availableSlots, loadingSlots, errorSlots, fetchAvailableSlots, resetSlots } = useAvailableSlots();
  const { createFromOrder, creatingFromOrder, errorCreatingFromOrder, resetCreateFromOrder } = useCreateAppointmentFromOrder();
  const { customerAppointments, loadingCustomerAppointments, fetchCustomerAppointments } = useAppointmentsByCustomer();

  // Load customer appointments on mount
  useEffect(() => {
    if (user?.maNguoiDung) {
      fetchCustomerAppointments(user.maNguoiDung);
    }
  }, [user, fetchCustomerAppointments]);

  // Load available slots when doctor/location/date changes
  useEffect(() => {
    if (selectedDoctor && selectedLocation && selectedDate) {
      fetchAvailableSlots({
        doctorId: selectedDoctor,
        locationId: selectedLocation,
        fromDate: selectedDate,
        toDate: selectedDate
      });
    }
  }, [selectedDoctor, selectedLocation, selectedDate, fetchAvailableSlots]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDoctor || !selectedLocation || !selectedDate || !selectedTime || !selectedService) {
      toast.error('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    if (!orderId) {
      toast.error('Vui lòng nhập mã đơn hàng đã thanh toán!');
      return;
    }

    try {
      await createFromOrder({
        orderId,
        doctorId: selectedDoctor,
        serviceId: selectedService,
        scheduleId: selectedTime, // selectedTime sẽ chứa scheduleId
        appointmentDate: selectedDate,
        appointmentTime: selectedTime,
        ghiChu: notes
      });

      toast.success('Đăng ký lịch tiêm thành công! 🎉');
      
      // Reset form
      resetForm();
      resetCreateFromOrder();
      
      // Refresh appointments list
      if (user?.maNguoiDung) {
        fetchCustomerAppointments(user.maNguoiDung);
      }
    } catch (error) {
      console.error('Lỗi khi đăng ký:', error);
      toast.error('Có lỗi xảy ra khi đăng ký lịch tiêm');
    }
  };

  const resetForm = () => {
    setSelectedDoctor('');
    setSelectedLocation('');
    setSelectedDate('');
    setSelectedTime('');
    setSelectedService('');
    setNotes('');
    setOrderId('');
    resetSlots();
  };

  // Get available time slots for selected date
  const getAvailableTimeSlots = (date: string): AvailableSlot[] => {
    return availableSlots.filter(slot => slot.ngayLam === date);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Format time for display
  const formatTime = (timeString: string) => {
    return timeString;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600">Vui lòng đăng nhập để đăng ký lịch tiêm</p>
          <button
            onClick={() => navigate('/signin')}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Đăng nhập
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Đăng Ký Lịch Tiêm</h1>
          <p className="text-gray-600">Chọn bác sĩ, địa điểm và thời gian phù hợp với bạn</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form đăng ký */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <FaCalendarAlt className="mr-2 text-blue-600" />
                Thông Tin Đăng Ký
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Mã đơn hàng */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mã đơn hàng đã thanh toán *
                  </label>
                  <input
                    type="text"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    placeholder="Nhập mã đơn hàng (VD: DH202508270001)"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Vui lòng nhập mã đơn hàng đã thanh toán thành công
                  </p>
                </div>

                {/* Chọn bác sĩ */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chọn Bác Sĩ *
                  </label>
                  <select
                    value={selectedDoctor}
                    onChange={(e) => setSelectedDoctor(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">-- Chọn bác sĩ --</option>
                    {doctors.map(doctor => (
                      <option key={doctor.id} value={doctor.id}>
                        {doctor.name} - {doctor.specialty}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Chọn địa điểm */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chọn Địa Điểm *
                  </label>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">-- Chọn địa điểm --</option>
                    {locations.map(location => (
                      <option key={location.id} value={location.id}>
                        {location.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Chọn ngày */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chọn Ngày *
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Chọn thời gian */}
                {selectedDate && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Chọn Thời Gian *
                    </label>
                    {loadingSlots ? (
                      <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="text-gray-500 mt-2">Đang tải lịch trống...</p>
                      </div>
                    ) : availableSlots.length > 0 ? (
                      <div className="grid grid-cols-2 gap-3">
                        {getAvailableTimeSlots(selectedDate).map((slot) => (
                          <button
                            key={slot.maLichLamViec}
                            type="button"
                            onClick={() => setSelectedTime(slot.maLichLamViec)}
                            className={`p-3 border rounded-lg text-left transition-colors ${
                              selectedTime === slot.maLichLamViec
                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            <div className="font-medium">
                              {formatTime(slot.gioBatDau)} - {formatTime(slot.gioKetThuc)}
                            </div>
                            <div className="text-sm text-gray-600">
                              Còn {slot.availableSlots} chỗ trống
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-4">
                        Không có lịch trống cho ngày này
                      </p>
                    )}
                  </div>
                )}

                {/* Chọn dịch vụ */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chọn Dịch Vụ *
                  </label>
                  <select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">-- Chọn dịch vụ --</option>
                    {services.map(service => (
                      <option key={service.id} value={service.id}>
                        {service.name} - {service.price}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Ghi chú */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ghi Chú
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Nhập thông tin bổ sung (nếu có)"
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={creatingFromOrder || !selectedDoctor || !selectedLocation || !selectedDate || !selectedTime || !selectedService || !orderId}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  {creatingFromOrder ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Đang đăng ký...
                    </>
                  ) : (
                    <>
                      <FaCheckCircle className="mr-2" />
                      Đăng Ký Lịch Tiêm
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar - Lịch hẹn hiện tại */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FaClock className="mr-2 text-green-600" />
                Lịch Hẹn Của Bạn
              </h3>

              {loadingCustomerAppointments ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mx-auto"></div>
                  <p className="text-gray-500 mt-2">Đang tải...</p>
                </div>
              ) : customerAppointments.length > 0 ? (
                <div className="space-y-4">
                  {customerAppointments.slice(0, 5).map((appointment) => (
                    <div key={appointment.maPhieuDangKy} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-800">
                          {appointment.tenDichVu}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          appointment.trangThai === 'Chờ xác nhận' ? 'bg-yellow-100 text-yellow-800' :
                          appointment.trangThai === 'Chấp nhận' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {appointment.trangThai}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div className="flex items-center">
                          <FaUserMd className="mr-2 text-blue-600" />
                          {appointment.tenBacSi}
                        </div>
                        <div className="flex items-center">
                          <FaMapMarkerAlt className="mr-2 text-green-600" />
                          {appointment.tenDichVu}
                        </div>
                        <div className="flex items-center">
                          <FaCalendarAlt className="mr-2 text-purple-600" />
                          {formatDate(appointment.ngayHenTiem)} - {appointment.gioHenTiem}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FaCalendarAlt className="text-4xl mx-auto mb-3 text-gray-300" />
                  <p>Bạn chưa có lịch hẹn nào</p>
                  <p className="text-sm">Hãy đăng ký lịch tiêm đầu tiên!</p>
                </div>
              )}

              {/* Thông tin hướng dẫn */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Hướng dẫn đăng ký:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Chọn bác sĩ và địa điểm phù hợp</li>
                  <li>• Chọn ngày và thời gian có sẵn</li>
                  <li>• Nhập mã đơn hàng đã thanh toán</li>
                  <li>• Điền ghi chú nếu cần thiết</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentRegistrationPage; 