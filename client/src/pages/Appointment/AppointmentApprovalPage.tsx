import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaCalendarAlt, FaClock, FaUser, FaMapMarkerAlt, FaCheck, FaTimes, FaEye, FaSearch } from 'react-icons/fa';
import { useAppointmentsByDoctor, useApproveAppointment, useAppointment } from '../../hooks';
import { useAuth } from '../../hooks';
import { AppointmentVM } from '../../services/appointment.service';

const AppointmentApprovalPage: React.FC = () => {
  const { user } = useAuth();
  
  // States
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentVM | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  // Hooks
  const { appointments: doctorAppointments, loading: loadingDoctorAppointments, execute: fetchDoctorAppointments } = useAppointmentsByDoctor();
  const { appointment: approvedAppointment, loading: approving, error: errorApproving, execute: approveExistingAppointment, reset: resetApprove } = useApproveAppointment();
  const { appointment, loading: loadingAppointment, execute: fetchAppointment } = useAppointment();

  // Load appointments when component mounts
  useEffect(() => {
    if (user?.maNguoiDung) {
      // Giả sử user.maNguoiDung là ID của bác sĩ
      // Trong thực tế cần lấy MaBacSi từ user
      fetchDoctorAppointments(user.maNguoiDung);
    }
  }, [user, fetchDoctorAppointments]);

  // Filter appointments based on status and search
  const filteredAppointments = (doctorAppointments || []).filter((appointment: AppointmentVM) => {
    const matchesStatus = selectedStatus === 'all' || appointment.trangThai === selectedStatus;
    const matchesSearch = appointment.tenKhachHang.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.tenDichVu.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = !selectedDate || appointment.ngayHenTiem === selectedDate;
    
    return matchesStatus && matchesSearch && matchesDate;
  });

  // Handle appointment approval
  const handleApproval = async (appointmentId: string, status: string, reason?: string) => {
    try {
      await approveExistingAppointment({
        id: appointmentId,
        data: {
          status,
          reason
        }
      });

      toast.success(`Đã ${status === 'Chấp nhận' ? 'chấp nhận' : 'từ chối'} lịch hẹn!`);
      
      // Refresh appointments list
      if (user?.maNguoiDung) {
        fetchDoctorAppointments(user.maNguoiDung);
      }
      
      // Reset form
      setApprovalStatus('');
      setRejectionReason('');
      setShowModal(false);
      setSelectedAppointment(null);
      resetApprove();
    } catch (error) {
      console.error('Lỗi khi duyệt lịch hẹn:', error);
      toast.error('Có lỗi xảy ra khi duyệt lịch hẹn');
    }
  };

  // Open approval modal
  const openApprovalModal = (appointment: AppointmentVM) => {
    setSelectedAppointment(appointment);
    setShowModal(true);
    setApprovalStatus('');
    setRejectionReason('');
  };

  // View appointment details
  const viewAppointmentDetails = (appointmentId: string) => {
    fetchAppointment(appointmentId);
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

  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Chờ xác nhận':
        return 'bg-yellow-100 text-yellow-800';
      case 'Chấp nhận':
        return 'bg-green-100 text-green-800';
      case 'Từ chối':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get status count
  const getStatusCount = (status: string) => {
    return (doctorAppointments || []).filter((appointment: AppointmentVM) => appointment.trangThai === status).length;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600">Vui lòng đăng nhập để xem lịch hẹn</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Quản Lý Lịch Hẹn Tiêm</h1>
          <p className="text-gray-600">Xác nhận và quản lý các lịch hẹn tiêm của bệnh nhân</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <FaCalendarAlt className="text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng lịch hẹn</p>
                <p className="text-2xl font-bold text-gray-900">{doctorAppointments?.length || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                <FaClock className="text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Chờ xác nhận</p>
                <p className="text-2xl font-bold text-gray-900">{getStatusCount('Chờ xác nhận')}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <FaCheck className="text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Đã chấp nhận</p>
                <p className="text-2xl font-bold text-gray-900">{getStatusCount('Chấp nhận')}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100 text-red-600">
                <FaTimes className="text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Đã từ chối</p>
                <p className="text-2xl font-bold text-gray-900">{getStatusCount('Từ chối')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tất cả</option>
                <option value="Chờ xác nhận">Chờ xác nhận</option>
                <option value="Chấp nhận">Đã chấp nhận</option>
                <option value="Từ chối">Đã từ chối</option>
              </select>
            </div>

            {/* Date Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ngày hẹn</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Search */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Tìm kiếm</label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tìm theo tên bệnh nhân hoặc dịch vụ..."
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Appointments List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Danh Sách Lịch Hẹn</h2>
          </div>

          {loadingDoctorAppointments ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-500 mt-4">Đang tải danh sách lịch hẹn...</p>
            </div>
          ) : filteredAppointments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bệnh nhân
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dịch vụ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ngày hẹn
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thời gian
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAppointments.map((appointment) => (
                    <tr key={appointment.maPhieuDangKy} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <FaUser className="text-blue-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {appointment.tenKhachHang}
                            </div>
                            <div className="text-sm text-gray-500">
                              {appointment.soDienThoaiKhachHang}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{appointment.tenDichVu}</div>
                        <div className="text-sm text-gray-500">{appointment.ghiChu || 'Không có ghi chú'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(appointment.ngayHenTiem)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{appointment.gioHenTiem}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(appointment.trangThai)}`}>
                          {appointment.trangThai}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => viewAppointmentDetails(appointment.maPhieuDangKy)}
                            className="text-blue-600 hover:text-blue-900 p-1"
                            title="Xem chi tiết"
                          >
                            <FaEye />
                          </button>
                          {appointment.trangThai === 'Chờ xác nhận' && (
                            <button
                              onClick={() => openApprovalModal(appointment)}
                              className="text-green-600 hover:text-green-900 p-1"
                              title="Duyệt lịch hẹn"
                            >
                              <FaCheck />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <FaCalendarAlt className="text-4xl mx-auto mb-3 text-gray-300" />
              <p className="text-gray-500">Không có lịch hẹn nào</p>
            </div>
          )}
        </div>

        {/* Appointment Details Modal */}
        {showModal && selectedAppointment && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Duyệt Lịch Hẹn</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bệnh nhân</label>
                    <p className="text-sm text-gray-900">{selectedAppointment.tenKhachHang}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Dịch vụ</label>
                    <p className="text-sm text-gray-900">{selectedAppointment.tenDichVu}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ngày hẹn</label>
                    <p className="text-sm text-gray-900">{formatDate(selectedAppointment.ngayHenTiem)}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Thời gian</label>
                    <p className="text-sm text-gray-900">{selectedAppointment.gioHenTiem}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ghi chú</label>
                    <p className="text-sm text-gray-900">{selectedAppointment.ghiChu || 'Không có'}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Quyết định</label>
                    <select
                      value={approvalStatus}
                      onChange={(e) => setApprovalStatus(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">-- Chọn quyết định --</option>
                      <option value="Chấp nhận">Chấp nhận</option>
                      <option value="Từ chối">Từ chối</option>
                    </select>
                  </div>
                  
                  {approvalStatus === 'Từ chối' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Lý do từ chối</label>
                      <textarea
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Nhập lý do từ chối..."
                      />
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={() => handleApproval(selectedAppointment.maPhieuDangKy, approvalStatus, rejectionReason)}
                    disabled={!approvalStatus || (approvalStatus === 'Từ chối' && !rejectionReason) || approving}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {approving ? 'Đang xử lý...' : 'Xác nhận'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Appointment Details Sidebar */}
        {appointment && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Chi Tiết Lịch Hẹn</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bệnh nhân</label>
                    <p className="text-sm text-gray-900">{appointment.tenKhachHang}</p>
                    <p className="text-sm text-gray-500">{appointment.soDienThoaiKhachHang}</p>
                    <p className="text-sm text-gray-500">{appointment.emailKhachHang}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Dịch vụ</label>
                    <p className="text-sm text-gray-900">{appointment.tenDichVu}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ngày hẹn</label>
                    <p className="text-sm text-gray-900">{formatDate(appointment.ngayHenTiem)}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Thời gian</label>
                    <p className="text-sm text-gray-900">{appointment.gioHenTiem}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(appointment.trangThai)}`}>
                      {appointment.trangThai}
                    </span>
                  </div>
                  
                  {appointment.lyDoTuChoi && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Lý do từ chối</label>
                      <p className="text-sm text-gray-900">{appointment.lyDoTuChoi}</p>
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ghi chú</label>
                    <p className="text-sm text-gray-900">{appointment.ghiChu || 'Không có'}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ngày đăng ký</label>
                    <p className="text-sm text-gray-900">{formatDate(appointment.ngayDangKy)}</p>
                  </div>
                </div>
                
                <div className="flex justify-end mt-6">
                  <button
                    onClick={() => {
                      resetApprove();
                      setSelectedAppointment(null);
                    }}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentApprovalPage; 