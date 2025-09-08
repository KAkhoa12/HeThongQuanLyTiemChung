import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../hooks/useToast';
import { FaCalendarPlus, FaEye, FaCheckCircle, FaTimesCircle, FaClock, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import { useAuthInit } from '../../hooks/useAuthInit';
import { useInvoice } from '../../hooks/useInvoice';
import { phieuDangKyLichTiemService, PhieuDangKyLichTiem, UpdatePhieuDangKyLichTiemDto } from '../../services/phieuDangKyLichTiem.service';
import { useApiWithParams } from '../../hooks/useApi';
import { useAllLocations } from '../../hooks/useLocations';

const VaccinationRegistrationPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthInit();
  const { invoices, loading: ordersLoading } = useInvoice();
  const { showSuccess, showError } = useToast();
  // State for appointment registrations
  const [appointmentsByOrder, setAppointmentsByOrder] = useState<{ [orderId: string]: PhieuDangKyLichTiem[] }>({});
  
  // Modal state
  const [selectedAppointment, setSelectedAppointment] = useState<PhieuDangKyLichTiem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    ghiChu: '',
    maDiaDiem: '',
    ngayDangKy: ''
  });

  // Hook for getting appointments by user
  const { data: appointmentsData, loading: appointmentsLoading, execute: fetchAppointments } = useApiWithParams(
    async (params: { maNguoiDung: string; page: number; pageSize: number }) => 
      phieuDangKyLichTiemService.getAllByUser(params.maNguoiDung, params.page, params.pageSize),
    null
  );

  // Hook for updating appointments
  const { execute: updateAppointment, loading: updatingAppointment } = useApiWithParams(
    async (params: { id: string; data: UpdatePhieuDangKyLichTiemDto }) => 
      phieuDangKyLichTiemService.update(params.id, params.data),
    null
  );

  // Hook for getting locations
  const { data: locations, execute: fetchLocations } = useAllLocations();

  useEffect(() => {
    if (user?.maNguoiDung) {
      loadAppointments();
    }
  }, [user?.maNguoiDung]);

  useEffect(() => {
    fetchLocations();
  }, []);

  // Process appointments data when it changes
  useEffect(() => {
    if (appointmentsData) {
      console.log('Full appointments response:', appointmentsData);
      console.log('Response structure:', {
        hasData: !!appointmentsData?.data,
        totalCount: appointmentsData?.totalCount,
        page: appointmentsData?.page,
        pageSize: appointmentsData?.pageSize
      });
      
      if (appointmentsData.data && appointmentsData.data.length > 0) {
        // Group appointments by order ID
        const grouped: { [orderId: string]: PhieuDangKyLichTiem[] } = {};
        console.log('Appointments data:', appointmentsData.data);
        appointmentsData.data.forEach((appointment: PhieuDangKyLichTiem) => {
          // Extract order ID from maDonHangDisplay or other field
          const orderId = appointment.maDonHangDisplay || 'unknown';
          if (!grouped[orderId]) {
            grouped[orderId] = [];
          }
          grouped[orderId].push(appointment);
        });
        
        setAppointmentsByOrder(grouped);
      } else {
        console.log('No appointments data found in response');
        setAppointmentsByOrder({});
      }
    }
  }, [appointmentsData]);

  const loadAppointments = async () => {
    if (!user?.maNguoiDung) return;
    
    try {
      await fetchAppointments({ 
        maNguoiDung: user.maNguoiDung, 
        page: 1, 
        pageSize: 100 
      });
    } catch (error) {
      console.error('Error loading appointments:', error);
      showError("lỗi",'Không thể tải danh sách phiếu đăng ký');
    }
  };

  // Filter PAID orders
  const paidOrders = invoices.filter(invoice => invoice.trangThaiDon === 'PAID');

  // Helper function to get the latest appointment for an order
  const getLatestAppointment = (orderId: string): PhieuDangKyLichTiem | null => {
    const appointments = appointmentsByOrder[orderId];
    if (!appointments || appointments.length === 0) return null;
    
    // Sort by creation date and get the latest
    return appointments.sort((a, b) => 
      new Date(b.ngayTao || '').getTime() - new Date(a.ngayTao || '').getTime()
    )[0];
  };

  // Helper function to check if order can create new appointment
  const canCreateAppointment = (orderId: string): boolean => {
    const latestAppointment = getLatestAppointment(orderId);
    
    // Can create if no appointment exists or latest is rejected
    return !latestAppointment || latestAppointment.trangThai === 'REJECTED';
  };

  // Helper function to get status badge
  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: { text: string; className: string; icon: React.ReactNode } } = {
      Pending: {
        text: 'Chờ duyệt',
        className: 'bg-yellow-100 text-yellow-800',
        icon: <FaClock className="w-3 h-3" />
      },
      Approved: {
        text: 'Đã duyệt',
        className: 'bg-green-100 text-green-800',
        icon: <FaCheckCircle className="w-3 h-3" />
      },
      Rejected: {
        text: 'Bị từ chối',
        className: 'bg-red-100 text-red-800',
        icon: <FaTimesCircle className="w-3 h-3" />
      },
    };

    const statusInfo = statusMap[status] || {
      text: status,
      className: 'bg-gray-100 text-gray-800',
      icon: <FaClock className="w-3 h-3" />
    };

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusInfo.className}`}>
        {statusInfo.icon}
        {statusInfo.text}
      </span>
);
  };

  // Helper function to format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Modal functions
  const openAppointmentModal = (appointment: PhieuDangKyLichTiem) => {
    setSelectedAppointment(appointment);
    
    // Fix date conversion to avoid timezone issues
    let formattedDate = '';
    if (appointment.ngayDangKy) {
      const date = new Date(appointment.ngayDangKy);
      // Add timezone offset to get the correct local date
      const localDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
      formattedDate = localDate.toISOString().split('T')[0];
    }
    
    setEditForm({
      ghiChu: appointment.ghiChu || '',
      maDiaDiem: appointment.maDiaDiem || '',
      ngayDangKy: formattedDate
    });
    setIsModalOpen(true);
    setIsEditing(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAppointment(null);
    setIsEditing(false);
    setEditForm({ ghiChu: '', maDiaDiem: '', ngayDangKy: '' });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!selectedAppointment) return;

    try {
      await updateAppointment({
        id: selectedAppointment.maPhieuDangKy,
        data: { 
          ghiChu: editForm.ghiChu,
          maDiaDiem: editForm.maDiaDiem,
          ngayDangKy: editForm.ngayDangKy
        }
      });
      
      showSuccess("thành công",'Cập nhật phiếu đăng ký thành công');
      
      // Close modal and reset state
      closeModal();
      
      // Reload appointments to get updated data
      if (user?.maNguoiDung) {
        await loadAppointments();
      }
    } catch (error) {
      console.error('Error updating appointment:', error);
        showError('lỗi', 'Không thể cập nhật phiếu đăng ký');
    }
  };

  const handleCancel = () => {
    if (selectedAppointment) {
      // Fix date conversion to avoid timezone issues
      let formattedDate = '';
      if (selectedAppointment.ngayDangKy) {
        const date = new Date(selectedAppointment.ngayDangKy);
        // Add timezone offset to get the correct local date
        const localDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
        formattedDate = localDate.toISOString().split('T')[0];
      }
      
      setEditForm({
        ghiChu: selectedAppointment.ghiChu || '',
        maDiaDiem: selectedAppointment.maDiaDiem || '',
        ngayDangKy: formattedDate
      });
    }
    setIsEditing(false);
  };

  if (ordersLoading || appointmentsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  console.log(appointmentsByOrder);

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          Đăng ký lịch tiêm chủng
        </h2>
      </div>

      {paidOrders.length === 0 ? (
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <div className="text-center py-8">
            <FaCalendarPlus className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Không có hóa đơn nào cần đăng ký lịch tiêm
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Bạn cần có hóa đơn đã thanh toán để đăng ký lịch tiêm chủng.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {paidOrders.map((order) => {
            const latestAppointment = getLatestAppointment(order.maDonHang);
            const canCreate = canCreateAppointment(order.maDonHang);
            const appointments = appointmentsByOrder[order.maDonHang] || [];

            return (
              <div key={order.maDonHang} className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                {/* Order Header */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-black dark:text-white">
                      Hóa đơn #{order.maDonHang}
                    </h3>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(order.ngayTao)}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Tổng tiền
                      </label>
                      <p className="text-lg font-semibold text-primary">
                        {formatCurrency(order.tongTienThanhToan)}
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Trạng thái hóa đơn
                      </label>
                      <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Đã thanh toán
                      </span>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Trạng thái đăng ký
                      </label>
                      {latestAppointment ? (
                        getStatusBadge(latestAppointment.trangThai)
                      ) : (
                        <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Chưa đăng ký
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Services */}
                <div className="mb-6">
                  <h4 className="text-md font-medium text-black dark:text-white mb-3">
                    Dịch vụ đã đặt
                  </h4>
                  <div className="space-y-2">
                    {order.donHangChiTiets?.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div>
                          <p className="font-medium text-black dark:text-white">
                            {item.maDichVuNavigation?.ten || item.maDichVu}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Số mũi: {item.soMuiChuan}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-primary">
                            {formatCurrency(item.thanhTien)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {canCreate && (
                      <button
                        onClick={() => navigate(`/appointment/register-from-invoice/${order.maDonHang}`)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <FaCalendarPlus className="w-4 h-4" />
                        Tạo phiếu đăng ký lịch tiêm
                      </button>
                    )}
                    
                    <button
                      onClick={() => navigate(`/dashboard/invoices/${order.maDonHang}`)}
                      className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
                    >
                      <FaEye className="w-4 h-4" />
                      Xem chi tiết hóa đơn
                    </button>
                  </div>
                </div>

                {/* Existing Appointments */}
                {appointments.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="text-md font-medium text-black dark:text-white mb-3">
                      Lịch sử đăng ký lịch tiêm
                    </h4>
                    <div className="space-y-3">
                      {appointments.map((appointment, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="flex items-center space-x-3">
                            {getStatusBadge(appointment.trangThai)}
                            <div>
                              <p className="text-sm font-medium text-black dark:text-white">
                                Phiếu #{appointment.maPhieuDangKy}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {formatDate(appointment.ngayDangKy)}
                              </p>
                              {appointment.tenDiaDiem && (
                                <p className="text-xs text-blue-600 dark:text-blue-400">
                                    Đăng ký tiêm tại:  {appointment.tenDiaDiem}
                                </p>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            {appointment.lyDoTuChoi && (
                              <div className="text-right">
                                <p className="text-xs text-red-600 dark:text-red-400">
                                  Lý do: {appointment.lyDoTuChoi}
                                </p>
                              </div>
                            )}
                            <button
                              onClick={() => openAppointmentModal(appointment)}
                              className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
                            >
                              <FaEye className="w-3 h-3" />
                              Chi tiết
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Appointment Detail Modal */}
      {isModalOpen && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-boxdark rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-black dark:text-white">
                Chi tiết phiếu đăng ký lịch tiêm
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Mã phiếu đăng ký
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedAppointment.maPhieuDangKy}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Trạng thái
                  </label>
                  {getStatusBadge(selectedAppointment.trangThai)}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Ngày đăng ký
                  </label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={editForm.ngayDangKy}
                      onChange={(e) => setEditForm(prev => ({ ...prev, ngayDangKy: e.target.value }))}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  ) : (
                    <p className="text-sm text-gray-900 dark:text-white">
                      {formatDate(selectedAppointment.ngayDangKy)}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Dịch vụ
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedAppointment.tenDichVu}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Địa điểm đăng ký
                  </label>
                  {isEditing ? (
                    <select
                      value={editForm.maDiaDiem}
                      onChange={(e) => setEditForm(prev => ({ ...prev, maDiaDiem: e.target.value }))}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Chọn địa điểm</option>
                      {locations?.map((location) => (
                        <option key={location.id} value={location.id}>
                          {location.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-sm text-gray-900 dark:text-white">
                      {selectedAppointment.tenDiaDiem || 'Chưa chọn địa điểm'}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Mã đơn hàng
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedAppointment.maDonHangDisplay}
                  </p>
                </div>
              </div>

              {/* Ghi chú */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Ghi chú
                </label>
                {isEditing ? (
                  <textarea
                    value={editForm.ghiChu}
                    onChange={(e) => setEditForm(prev => ({ ...prev, ghiChu: e.target.value }))}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                    rows={3}
                    placeholder="Nhập ghi chú..."
                  />
                ) : (
                  <p className="text-sm text-gray-900 dark:text-white p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    {selectedAppointment.ghiChu || 'Không có ghi chú'}
                  </p>
                )}
              </div>

              {/* Lý do từ chối */}
              {selectedAppointment.lyDoTuChoi && (
                <div>
                  <label className="block text-sm font-medium text-red-600 dark:text-red-400 mb-2">
                    Lý do từ chối
                  </label>
                  <p className="text-sm text-red-600 dark:text-red-400 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    {selectedAppointment.lyDoTuChoi}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={updatingAppointment}
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {updatingAppointment ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <FaSave className="w-4 h-4" />
                      )}
                      Lưu
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleEdit}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary flex items-center gap-2"
                  >
                    <FaEdit className="w-4 h-4" />
                    Chỉnh sửa
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VaccinationRegistrationPage;