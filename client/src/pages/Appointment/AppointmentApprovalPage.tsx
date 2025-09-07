import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaCalendarAlt, FaClock, FaUser, FaMapMarkerAlt, FaCheck, FaTimes, FaEye, FaSearch, FaFileAlt, FaPhone, FaEnvelope, FaStethoscope } from 'react-icons/fa';
import { useAppointmentsByDoctor, useApproveAppointment, useAppointmentById } from '../../hooks';
import { useAuth } from '../../hooks';
import { AppointmentVM } from '../../services/appointment.service';
import { getAllDoctorsNoPage } from '../../services/doctor.service';
import { useApiWithParams } from '../../hooks/useApi';
import { Doctor } from '../../types/doctor.types';
import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';

const AppointmentApprovalPage: React.FC = () => {
  const { user } = useAuth();
  
  // States
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<string>('');
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentVM | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  // Hooks
  const { appointments: doctorAppointments, loading: loadingDoctorAppointments, execute: fetchDoctorAppointments } = useAppointmentsByDoctor();
  const { appointment: approvedAppointment, loading: approving, error: errorApproving, execute: approveExistingAppointment, reset: resetApprove } = useApproveAppointment();
  const { appointment, loading: loadingAppointment, execute: fetchAppointment } = useAppointmentById(null);
  const { data: doctors, loading: doctorsLoading, execute: fetchDoctors } = useApiWithParams<Doctor[], any>(
    async () => getAllDoctorsNoPage(), null
  );

  // Load doctors when component mounts
  useEffect(() => {
    fetchDoctors({});
  }, []);

  // Auto-select current doctor if user is a doctor
  useEffect(() => {
    if (doctors && user?.maNguoiDung && !selectedDoctor) {
      // Tìm bác sĩ tương ứng với user hiện tại
      const currentDoctor = doctors.find(doctor => doctor.id === user.maNguoiDung);
      if (currentDoctor) {
        setSelectedDoctor(currentDoctor.id);
      }
    }
  }, [doctors, user, selectedDoctor]);

  // Load appointments when doctor is selected
  useEffect(() => {
    if (selectedDoctor) {
      fetchDoctorAppointments(selectedDoctor);
    }
  }, [selectedDoctor]);

  // Filter appointments based on status and search
  const filteredAppointments = (doctorAppointments || []).filter((appointment: AppointmentVM) => {
    const matchesStatus = selectedStatus === 'all' || appointment.trangThai === selectedStatus;
    const matchesSearch = appointment.tenKhachHang.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.maDonHangDisplay.toLowerCase().includes(searchTerm.toLowerCase());
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

      toast.success(`Đã ${status === 'Approved' ? 'chấp nhận' : 'từ chối'} lịch hẹn!`);
      
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
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get status count
  const getStatusCount = (status: string) => {
    return (doctorAppointments || []).filter((appointment: AppointmentVM) => appointment.trangThai === status).length;
  };

  // Map status values for display
  const getStatusDisplayValue = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'Chờ xác nhận';
      case 'Approved':
        return 'Đã chấp nhận';
      case 'Rejected':
        return 'Đã từ chối';
      default:
        return status;
    }
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
    <>
      <div className="mx-auto max-w-7xl p-4 md:p-6 2xl:p-10">
        <div className="mb-6">
          <Breadcrumb pageName="Quản lý lịch hẹn tiêm" />
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Quản Lý Phiếu Đăng Ký Lịch Tiêm</h1>
          <p className="text-gray-600">Xác nhận và quản lý các phiếu đăng ký lịch tiêm của bệnh nhân</p>
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
                                     <p className="text-2xl font-bold text-gray-900">{getStatusCount('Pending')}</p>
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
                                     <p className="text-2xl font-bold text-gray-900">{getStatusCount('Approved')}</p>
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
                                     <p className="text-2xl font-bold text-gray-900">{getStatusCount('Rejected')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Doctor Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bác sĩ</label>
              <select
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Chọn bác sĩ</option>
                {doctors?.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.name} {doctor.specialty && `- ${doctor.specialty}`}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tất cả</option>
                <option value="Pending">Chờ xác nhận</option>
                <option value="Approved">Đã chấp nhận</option>
                <option value="Rejected">Đã từ chối</option>
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
                  placeholder="Tìm theo tên bệnh nhân hoặc mã đơn hàng..."
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
            <h2 className="text-lg font-semibold text-gray-800">Danh Sách Phiếu Đăng Ký Lịch Tiêm</h2>
          </div>

          {loadingDoctorAppointments || doctorsLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-500 mt-4">Đang tải danh sách lịch hẹn...</p>
            </div>
          ) : !selectedDoctor ? (
            <div className="text-center py-12">
              <FaStethoscope className="text-4xl mx-auto mb-3 text-gray-300" />
              <p className="text-gray-500">Vui lòng chọn bác sĩ để xem danh sách lịch hẹn</p>
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
                      Mã đơn hàng
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
                        <div className="text-sm text-gray-900">Đơn hàng: {appointment.maDonHangDisplay}</div>
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
                          {getStatusDisplayValue(appointment.trangThai)}
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
                                                         {appointment.trangThai === 'Pending' && (
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
              <p className="text-gray-500">Không có lịch hẹn nào cho bác sĩ đã chọn</p>
            </div>
          )}
        </div>

        {/* Appointment Details Modal */}
        {showModal && selectedAppointment && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Duyệt Phiếu Đăng Ký Lịch Tiêm</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Thông tin bệnh nhân</label>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-gray-900">{selectedAppointment.tenKhachHang}</p>
                      <p className="text-sm text-gray-600 flex items-center mt-1">
                        <FaPhone className="mr-2 text-xs" />
                        {selectedAppointment.soDienThoaiKhachHang}
                      </p>
                      <p className="text-sm text-gray-600 flex items-center mt-1">
                        <FaEnvelope className="mr-2 text-xs" />
                        {selectedAppointment.emailKhachHang}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Thông tin đơn hàng</label>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-gray-900 flex items-center">
                        <FaFileAlt className="mr-2 text-xs" />
                        Mã đơn hàng: {selectedAppointment.maDonHangDisplay}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Thông tin lịch hẹn</label>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-900 flex items-center">
                        <FaCalendarAlt className="mr-2 text-xs" />
                        {formatDate(selectedAppointment.ngayHenTiem)}
                      </p>
                      <p className="text-sm text-gray-900 flex items-center mt-1">
                        <FaClock className="mr-2 text-xs" />
                        {selectedAppointment.gioHenTiem}
                      </p>
                    </div>
                  </div>
                  
                  {selectedAppointment.ghiChu && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Ghi chú</label>
                      <p className="text-sm text-gray-900 bg-yellow-50 p-3 rounded-lg">{selectedAppointment.ghiChu}</p>
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Quyết định</label>
                                         <select
                       value={approvalStatus}
                       onChange={(e) => setApprovalStatus(e.target.value)}
                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     >
                       <option value="">-- Chọn quyết định --</option>
                                       <option value="Approved">Chấp nhận</option>
                <option value="Rejected">Từ chối</option>
                     </select>
                  </div>
                  
                                     {approvalStatus === 'Rejected' && (
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
                                         disabled={!approvalStatus || (approvalStatus === 'Rejected' && !rejectionReason) || approving}
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
                <h3 className="text-lg font-medium text-gray-900 mb-4">Chi Tiết Phiếu Đăng Ký</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Thông tin bệnh nhân</label>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-gray-900">{appointment.tenKhachHang}</p>
                      <p className="text-sm text-gray-600 flex items-center mt-1">
                        <FaPhone className="mr-2 text-xs" />
                        {appointment.soDienThoaiKhachHang}
                      </p>
                      <p className="text-sm text-gray-600 flex items-center mt-1">
                        <FaEnvelope className="mr-2 text-xs" />
                        {appointment.emailKhachHang}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Thông tin đơn hàng</label>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-gray-900 flex items-center">
                        <FaFileAlt className="mr-2 text-xs" />
                        Mã đơn hàng: {appointment.maDonHangDisplay}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Thông tin lịch hẹn</label>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-900 flex items-center">
                        <FaCalendarAlt className="mr-2 text-xs" />
                        {formatDate(appointment.ngayHenTiem)}
                      </p>
                      <p className="text-sm text-gray-900 flex items-center mt-1">
                        <FaClock className="mr-2 text-xs" />
                        {appointment.gioHenTiem}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(appointment.trangThai)}`}>
                      {getStatusDisplayValue(appointment.trangThai)}
                    </span>
                  </div>
                  
                  {appointment.lyDoTuChoi && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Lý do từ chối</label>
                      <p className="text-sm text-gray-900 bg-red-50 p-3 rounded-lg">{appointment.lyDoTuChoi}</p>
                    </div>
                  )}
                  
                  {appointment.ghiChu && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Ghi chú</label>
                      <p className="text-sm text-gray-900 bg-yellow-50 p-3 rounded-lg">{appointment.ghiChu}</p>
                    </div>
                  )}
                  
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
    </>
  );
};

export default AppointmentApprovalPage; 