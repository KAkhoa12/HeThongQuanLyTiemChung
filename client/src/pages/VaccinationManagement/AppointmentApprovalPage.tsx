import React, { useState, useEffect } from 'react';
import { useAppointments, useApproveAppointment, useVaccinationStatus } from '../../hooks/useAppointment';

const AppointmentApprovalPage: React.FC = () => {
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [approvalStatus, setApprovalStatus] = useState<'APPROVED' | 'REJECTED'>('APPROVED');
  const [rejectionReason, setRejectionReason] = useState<string>('');
  const [showApprovalModal, setShowApprovalModal] = useState(false);

  // Hooks
  const appointments = useAppointments({ page: 1, pageSize: 50, status: 'PENDING' });
  const approveAppointment = useApproveAppointment();
  const vaccinationStatus = useVaccinationStatus(selectedAppointment?.maKhachHang || null);

  useEffect(() => {
    appointments.execute({ page: 1, pageSize: 50, status: 'PENDING' });
  }, []);

  useEffect(() => {
    if (selectedAppointment?.maKhachHang) {
      vaccinationStatus.execute({ customerId: selectedAppointment.maKhachHang });
    }
  }, [selectedAppointment]);

  const handleApprove = async () => {
    if (!selectedAppointment) return;

    try {
      await approveAppointment.execute({
        id: selectedAppointment.maPhieuDangKy,
        request: {
          status: approvalStatus,
          reason: approvalStatus === 'REJECTED' ? rejectionReason : undefined
        }
      });

      // Refresh appointments list
      appointments.execute({ page: 1, pageSize: 50, status: 'PENDING' });
      setShowApprovalModal(false);
      setSelectedAppointment(null);
      setRejectionReason('');
    } catch (error) {
      console.error('Lỗi khi duyệt phiếu:', error);
    }
  };

  const openApprovalModal = (appointment: any) => {
    setSelectedAppointment(appointment);
    setApprovalStatus('APPROVED');
    setRejectionReason('');
    setShowApprovalModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'APPROVED': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING': return 'Chờ duyệt';
      case 'APPROVED': return 'Đã duyệt';
      case 'REJECTED': return 'Từ chối';
      default: return status;
    }
  };

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Duyệt phiếu đăng ký lịch tiêm</h1>
        <p className="text-gray-600">Xem xét và duyệt các phiếu đăng ký lịch tiêm chủng</p>
      </div>

      {/* Appointments List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Danh sách phiếu chờ duyệt</h2>
        </div>
        
        {appointments.loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : appointments.data?.data && appointments.data.data.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {appointments.data.data.map((appointment: any, index: number) => (
              <div key={index} className="p-6 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <h3 className="text-lg font-semibold">{appointment.tenKhachHang}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.trangThai)}`}>
                        {getStatusText(appointment.trangThai)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <p><span className="font-medium">Dịch vụ:</span> {appointment.tenDichVu}</p>
                        <p><span className="font-medium">Ngày đăng ký:</span> {new Date(appointment.ngayDangKy).toLocaleDateString('vi-VN')}</p>
                      </div>
                      <div>
                        <p><span className="font-medium">SĐT:</span> {appointment.soDienThoaiKhachHang}</p>
                        <p><span className="font-medium">Email:</span> {appointment.emailKhachHang}</p>
                      </div>
                    </div>
                    
                    {appointment.ghiChu && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm"><span className="font-medium">Ghi chú:</span> {appointment.ghiChu}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="ml-6 flex flex-col gap-2">
                    <button
                      onClick={() => openApprovalModal(appointment)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">📋</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Không có phiếu chờ duyệt</h3>
            <p className="text-gray-600">Tất cả phiếu đăng ký đã được xử lý</p>
          </div>
        )}
      </div>

      {/* Approval Modal */}
      {showApprovalModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold">Duyệt phiếu đăng ký</h2>
            </div>
            
            <div className="p-6">
              {/* Customer Info */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Thông tin khách hàng</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p><span className="font-medium">Tên:</span> {selectedAppointment.tenKhachHang}</p>
                    <p><span className="font-medium">SĐT:</span> {selectedAppointment.soDienThoaiKhachHang}</p>
                    <p><span className="font-medium">Email:</span> {selectedAppointment.emailKhachHang}</p>
                  </div>
                  <div>
                    <p><span className="font-medium">Dịch vụ:</span> {selectedAppointment.tenDichVu}</p>
                    <p><span className="font-medium">Ngày đăng ký:</span> {new Date(selectedAppointment.ngayDangKy).toLocaleDateString('vi-VN')}</p>
                  </div>
                </div>
              </div>

              {/* Vaccination Status */}
              {vaccinationStatus.data && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Tình trạng tiêm chủng hiện tại</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-green-50 p-3 rounded-lg text-center">
                      <p className="text-sm text-green-800">Đã hoàn thành</p>
                      <p className="text-xl font-bold text-green-600">{vaccinationStatus.data.summary.totalCompleted}</p>
                    </div>
                    <div className="bg-yellow-50 p-3 rounded-lg text-center">
                      <p className="text-sm text-yellow-800">Đang tiến hành</p>
                      <p className="text-xl font-bold text-yellow-600">{vaccinationStatus.data.summary.totalInProgress}</p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg text-center">
                      <p className="text-sm text-blue-800">Có thể mua</p>
                      <p className="text-xl font-bold text-blue-600">{vaccinationStatus.data.summary.totalAvailable}</p>
                    </div>
                  </div>

                  {/* In Progress Services */}
                  {vaccinationStatus.data.inProgressServices.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium mb-2">Dịch vụ đang tiến hành:</h4>
                      <div className="space-y-2">
                        {vaccinationStatus.data.inProgressServices.map((service: any, index: number) => (
                          <div key={index} className="p-3 bg-yellow-50 rounded-lg">
                            <p className="font-medium">{service.serviceName}</p>
                            <p className="text-sm text-gray-600">
                              {service.completedDoses}/{service.totalDoses} mũi đã tiêm
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Check if customer can get this service */}
                  {vaccinationStatus.data.inProgressServices.some((service: any) => 
                    service.serviceId === selectedAppointment.maDichVu
                  ) && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-800 font-medium">⚠️ Cảnh báo: Khách hàng đang tiêm dịch vụ này</p>
                    </div>
                  )}
                </div>
              )}

              {/* Approval Form */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Quyết định duyệt</h3>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="APPROVED"
                        checked={approvalStatus === 'APPROVED'}
                        onChange={(e) => setApprovalStatus(e.target.value as 'APPROVED' | 'REJECTED')}
                        className="mr-2"
                      />
                      <span className="text-green-600 font-medium">Duyệt</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="REJECTED"
                        checked={approvalStatus === 'REJECTED'}
                        onChange={(e) => setApprovalStatus(e.target.value as 'APPROVED' | 'REJECTED')}
                        className="mr-2"
                      />
                      <span className="text-red-600 font-medium">Từ chối</span>
                    </label>
                  </div>

                  {approvalStatus === 'REJECTED' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Lý do từ chối
                      </label>
                      <textarea
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Nhập lý do từ chối..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        rows={3}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowApprovalModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleApprove}
                disabled={approveAppointment.loading || (approvalStatus === 'REJECTED' && !rejectionReason.trim())}
                className={`px-6 py-2 text-white rounded-lg transition-colors ${
                  approvalStatus === 'APPROVED'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                } disabled:opacity-50`}
              >
                {approveAppointment.loading ? 'Đang xử lý...' : 
                 approvalStatus === 'APPROVED' ? 'Duyệt' : 'Từ chối'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Messages */}
      {appointments.error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-6">
          <p className="text-red-800">Lỗi: {appointments.error}</p>
        </div>
      )}
    </div>
  );
};

export default AppointmentApprovalPage;