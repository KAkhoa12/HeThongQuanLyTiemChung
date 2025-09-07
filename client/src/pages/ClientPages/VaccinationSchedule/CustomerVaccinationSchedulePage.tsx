import React, { useState, useEffect } from 'react';
import { useVaccinationStatus, useCustomerVaccinationSchedule } from '../../../hooks/useAppointment';
import { useAuthStore } from '../../../store/useAuthStore';

const CustomerVaccinationSchedulePage: React.FC = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'status' | 'schedule'>('status');

  // Hooks
  const vaccinationStatus = useVaccinationStatus(user?.maNguoiDung || null);
  const vaccinationSchedule = useCustomerVaccinationSchedule(user?.maNguoiDung || null);

  useEffect(() => {
    if (user?.maNguoiDung) {
      vaccinationStatus.execute({ customerId: user.maNguoiDung });
      vaccinationSchedule.execute({ customerId: user.maNguoiDung });
    }
  }, [user?.maNguoiDung]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'SCHEDULED': return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'Hoàn thành';
      case 'PENDING': return 'Chờ xử lý';
      case 'SCHEDULED': return 'Đã lên lịch';
      case 'IN_PROGRESS': return 'Đang tiến hành';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED': return '✅';
      case 'PENDING': return '⏳';
      case 'SCHEDULED': return '📅';
      case 'IN_PROGRESS': return '🔄';
      default: return '❓';
    }
  };

  if (vaccinationStatus.loading || vaccinationSchedule.loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Lịch tiêm chủng của tôi</h1>
        <p className="text-gray-600">Theo dõi tình trạng tiêm chủng và lịch tiêm của bạn</p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('status')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'status'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Tình trạng tiêm chủng
            </button>
            <button
              onClick={() => setActiveTab('schedule')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'schedule'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Lịch tiêm chi tiết
            </button>
          </nav>
        </div>
      </div>

      {/* Status Tab */}
      {activeTab === 'status' && vaccinationStatus.data && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-lg">✅</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-green-800">Đã hoàn thành</p>
                  <p className="text-2xl font-bold text-green-600">
                    {vaccinationStatus.data.summary.totalCompleted}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <span className="text-yellow-600 text-lg">🔄</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-yellow-800">Đang tiến hành</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {vaccinationStatus.data.summary.totalInProgress}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-lg">🆕</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-blue-800">Có thể mua</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {vaccinationStatus.data.summary.totalAvailable}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Completed Services */}
          {vaccinationStatus.data.completedServices.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <span className="mr-2">✅</span>
                Dịch vụ đã hoàn thành
              </h2>
              <div className="space-y-3">
                {vaccinationStatus.data.completedServices.map((service: any, index: number) => (
                  <div key={index} className="flex justify-between items-center p-4 bg-green-50 rounded-lg border border-green-200">
                    <div>
                      <h3 className="font-semibold text-green-800">{service.serviceName}</h3>
                      <p className="text-sm text-green-600">
                        Hoàn thành: {new Date(service.completedDate).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        {service.vaccineCount} mũi
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* In Progress Services */}
          {vaccinationStatus.data.inProgressServices.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <span className="mr-2">🔄</span>
                Dịch vụ đang tiến hành
              </h2>
              <div className="space-y-3">
                {vaccinationStatus.data.inProgressServices.map((service: any, index: number) => (
                  <div key={index} className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-yellow-800">{service.serviceName}</h3>
                        <p className="text-sm text-yellow-600">
                          {service.completedDoses}/{service.totalDoses} mũi đã tiêm
                        </p>
                        {service.nextDoseDate && (
                          <p className="text-sm text-blue-600 mt-1">
                            📅 Mũi tiếp theo: {new Date(service.nextDoseDate).toLocaleDateString('vi-VN')}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-600 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${(service.completedDoses / service.totalDoses) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-600 mt-2">
                      Tiến độ: {Math.round((service.completedDoses / service.totalDoses) * 100)}%
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Available Services */}
          {vaccinationStatus.data.availableServices.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <span className="mr-2">🆕</span>
                Dịch vụ có thể mua
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {vaccinationStatus.data.availableServices.map((service: any, index: number) => (
                  <div key={index} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 className="font-semibold text-blue-800 mb-2">{service.serviceName}</h3>
                    {service.description && (
                      <p className="text-sm text-blue-600 mb-3">{service.description}</p>
                    )}
                    <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Xem chi tiết
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {vaccinationStatus.data.summary.totalCompleted === 0 && 
           vaccinationStatus.data.summary.totalInProgress === 0 && 
           vaccinationStatus.data.summary.totalAvailable === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-4xl">💉</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Chưa có lịch tiêm chủng</h3>
              <p className="text-gray-600 mb-6">Bạn chưa đăng ký dịch vụ tiêm chủng nào</p>
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Xem dịch vụ tiêm chủng
              </button>
            </div>
          )}
        </div>
      )}

      {/* Schedule Tab */}
      {activeTab === 'schedule' && vaccinationSchedule.data && (
        <div className="space-y-6">
          {vaccinationSchedule.data.map((service: any, index: number) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">{service.serviceName}</h2>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">
                    {service.completedDoses}/{service.totalDoses} mũi
                  </span>
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${(service.completedDoses / service.totalDoses) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                {service.doses.map((dose: any, doseIndex: number) => (
                  <div key={doseIndex} className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0 mr-4">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border-2 border-gray-200">
                        <span className="text-lg">{getStatusIcon(dose.trangThai)}</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">Mũi {dose.muiThu} - {dose.vaccineName}</h3>
                          <p className="text-sm text-gray-600">
                            📅 Ngày dự kiến: {new Date(dose.ngayDuKien).toLocaleDateString('vi-VN')}
                          </p>
                          {dose.phieuTiem && (
                            <p className="text-sm text-green-600 mt-1">
                              ✅ Đã tiêm: {new Date(dose.phieuTiem.ngayTiem).toLocaleDateString('vi-VN')}
                              {dose.phieuTiem.doctorName && ` - Bác sĩ: ${dose.phieuTiem.doctorName}`}
                            </p>
                          )}
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(dose.trangThai)}`}>
                          {getStatusText(dose.trangThai)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Empty State for Schedule */}
          {vaccinationSchedule.data.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-4xl">📅</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Chưa có lịch tiêm</h3>
              <p className="text-gray-600">Bạn chưa có lịch tiêm chủng nào được lên kế hoạch</p>
            </div>
          )}
        </div>
      )}

      {/* Error Messages */}
      {vaccinationStatus.error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Lỗi: {vaccinationStatus.error}</p>
        </div>
      )}
    </div>
  );
};

export default CustomerVaccinationSchedulePage;