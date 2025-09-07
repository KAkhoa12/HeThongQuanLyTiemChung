import React, { useState } from 'react';
import { useAuthStore } from '../../../store/useAuthStore';
import { useKeHoachTiemsByCustomer, usePhieuTiemsByCustomer } from '../../../hooks/useAppointment';

const VaccinationSchedulePage: React.FC = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'schedule' | 'appointments' | 'history'>('schedule');

  // Fetch data
  const { data: keHoachTiemsData, loading: loadingKeHoach, error: errorKeHoach } = useKeHoachTiemsByCustomer(user?.maNguoiDung || null);
  const { data: phieuTiemsData, loading: loadingPhieu, error: errorPhieu } = usePhieuTiemsByCustomer(user?.maNguoiDung || null);
  
  // Extract arrays from the data
  const keHoachTiems = keHoachTiemsData || [];
  const phieuTiems = phieuTiemsData || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'SCHEDULED': return 'bg-blue-100 text-blue-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'MISSED': return 'bg-red-100 text-red-800';
      case 'CANCELLED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING': return 'Chờ lên lịch';
      case 'SCHEDULED': return 'Đã lên lịch';
      case 'COMPLETED': return 'Đã hoàn thành';
      case 'MISSED': return 'Bỏ lỡ';
      case 'CANCELLED': return 'Đã hủy';
      default: return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loadingKeHoach || loadingPhieu) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (errorKeHoach || errorPhieu) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-600 text-center">
          <p className="text-xl font-semibold mb-2">Có lỗi xảy ra</p>
          <p>Không thể tải dữ liệu lịch tiêm</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Lịch tiêm chủng của tôi</h1>
        <p className="text-gray-600">Quản lý và theo dõi lịch tiêm chủng</p>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('schedule')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'schedule'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Kế hoạch tiêm
            </button>
            <button
              onClick={() => setActiveTab('appointments')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'appointments'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Lịch hẹn
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'history'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Lịch sử tiêm
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'schedule' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900">Kế hoạch tiêm chủng</h2>
          
          {!keHoachTiems || keHoachTiems.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">💉</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có kế hoạch tiêm</h3>
              <p className="text-gray-500">Bạn chưa có kế hoạch tiêm chủng nào</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {keHoachTiems.map((keHoach: any) => (
                <div key={keHoach.maKeHoachTiem} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {keHoach.vaccineName}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(keHoach.trangThai)}`}>
                          {getStatusText(keHoach.trangThai)}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Dịch vụ:</span> {keHoach.serviceName}
                        </div>
                        <div>
                          <span className="font-medium">Mũi thứ:</span> {keHoach.muiThu}
                        </div>
                        <div>
                          <span className="font-medium">Ngày dự kiến:</span> {formatDate(keHoach.ngayDuKien)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm text-gray-500">
                        Đơn hàng: {keHoach.maDonHang}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'appointments' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900">Lịch hẹn tiêm chủng</h2>
          
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📅</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có lịch hẹn</h3>
            <p className="text-gray-500">Bạn chưa có lịch hẹn tiêm chủng nào</p>
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900">Lịch sử tiêm chủng</h2>
          
          {!phieuTiems || phieuTiems.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📋</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có lịch sử tiêm</h3>
              <p className="text-gray-500">Bạn chưa có lịch sử tiêm chủng nào</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {phieuTiems.map((phieuTiem: any) => (
                <div key={phieuTiem.maPhieuTiem} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {phieuTiem.serviceName}
                      </h3>
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Bác sĩ:</span> {phieuTiem.doctorName}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">
                        {formatDateTime(phieuTiem.ngayTiem)}
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(phieuTiem.trangThai)}`}>
                        {getStatusText(phieuTiem.trangThai)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h4 className="font-medium text-gray-900 mb-2">Chi tiết tiêm chủng:</h4>
                    <div className="space-y-2">
                      {phieuTiem.chiTietPhieuTiems.map((chiTiet: any) => (
                        <div key={chiTiet.maChiTietPhieuTiem} className="flex items-center space-x-3 text-sm">
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          <span>{chiTiet.vaccineName}</span>
                          <span className="text-gray-500">- Mũi {chiTiet.muiTiemThucTe}</span>
                        </div>
                      ))}
                    </div>
                    
                    {phieuTiem.phanUng && (
                      <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                        <h5 className="font-medium text-yellow-800 mb-1">Phản ứng sau tiêm:</h5>
                        <p className="text-sm text-yellow-700">{phieuTiem.phanUng}</p>
                        {phieuTiem.moTaPhanUng && (
                          <p className="text-sm text-yellow-600 mt-1">{phieuTiem.moTaPhanUng}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VaccinationSchedulePage;