import React, { useState, useEffect } from 'react';
import { useVaccinationStatus, useCustomerVaccinationSchedule, useCreatePhieuTiemFromKeHoach, useReadyToVaccinate } from '../../hooks/useAppointment';
import { useAuthStore } from '../../store/useAuthStore';

const DoctorVaccinationManagementPage: React.FC = () => {
  const { user } = useAuthStore();
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [searchCustomerId, setSearchCustomerId] = useState<string>('');

  // Hooks
  const vaccinationStatus = useVaccinationStatus(selectedCustomerId);
  const vaccinationSchedule = useCustomerVaccinationSchedule(selectedCustomerId);
  const createPhieuTiem = useCreatePhieuTiemFromKeHoach();
  const readyToVaccinate = useReadyToVaccinate(selectedCustomerId);

  const handleSearchCustomer = () => {
    if (searchCustomerId.trim()) {
      setSelectedCustomerId(searchCustomerId.trim());
    }
  };

  const handleCreateVaccination = async (keHoachTiemId: string) => {
    try {
      await createPhieuTiem.execute({
        maKeHoachTiem: keHoachTiemId,
        maBacSi: user?.maNguoiDung,
        ngayTiem: new Date().toISOString(),
        phanUng: 'Không có',
        moTaPhanUng: 'Tiêm chủng thành công'
      });
      
      // Refresh data
      vaccinationStatus.execute({ customerId: selectedCustomerId });
      vaccinationSchedule.execute({ customerId: selectedCustomerId });
      readyToVaccinate.execute({ customerId: selectedCustomerId });
    } catch (error) {
      console.error('Lỗi khi tạo phiếu tiêm:', error);
    }
  };

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

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Quản lý lịch tiêm chủng</h1>
        
        {/* Search Customer */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Tìm kiếm khách hàng</h2>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Nhập mã khách hàng..."
              value={searchCustomerId}
              onChange={(e) => setSearchCustomerId(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleSearchCustomer}
              disabled={vaccinationStatus.loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {vaccinationStatus.loading ? 'Đang tìm...' : 'Tìm kiếm'}
            </button>
          </div>
        </div>

        {selectedCustomerId && (
          <>
            {/* Vaccination Status */}
            {vaccinationStatus.data && (
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h2 className="text-lg font-semibold mb-4">Tình trạng tiêm chủng</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-green-800">Đã hoàn thành</h3>
                    <p className="text-2xl font-bold text-green-600">{vaccinationStatus.data.summary.totalCompleted}</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-yellow-800">Đang tiến hành</h3>
                    <p className="text-2xl font-bold text-yellow-600">{vaccinationStatus.data.summary.totalInProgress}</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-800">Có thể mua</h3>
                    <p className="text-2xl font-bold text-blue-600">{vaccinationStatus.data.summary.totalAvailable}</p>
                  </div>
                </div>

                {/* Completed Services */}
                {vaccinationStatus.data.completedServices.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold mb-3">Dịch vụ đã hoàn thành</h3>
                    <div className="space-y-2">
                      {vaccinationStatus.data.completedServices.map((service: any, index: number) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                          <div>
                            <p className="font-medium">{service.serviceName}</p>
                            <p className="text-sm text-gray-600">
                              Hoàn thành: {new Date(service.completedDate).toLocaleDateString('vi-VN')}
                            </p>
                          </div>
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                            {service.vaccineCount} mũi
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* In Progress Services */}
                {vaccinationStatus.data.inProgressServices.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold mb-3">Dịch vụ đang tiến hành</h3>
                    <div className="space-y-2">
                      {vaccinationStatus.data.inProgressServices.map((service: any, index: number) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                          <div>
                            <p className="font-medium">{service.serviceName}</p>
                            <p className="text-sm text-gray-600">
                              {service.completedDoses}/{service.totalDoses} mũi đã tiêm
                            </p>
                            {service.nextDoseDate && (
                              <p className="text-sm text-blue-600">
                                Mũi tiếp theo: {new Date(service.nextDoseDate).toLocaleDateString('vi-VN')}
                              </p>
                            )}
                          </div>
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-yellow-600 h-2 rounded-full" 
                              style={{ width: `${(service.completedDoses / service.totalDoses) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Available Services */}
                {vaccinationStatus.data.availableServices.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3">Dịch vụ có thể mua</h3>
                    <div className="space-y-2">
                      {vaccinationStatus.data.availableServices.map((service: any, index: number) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                          <div>
                            <p className="font-medium">{service.serviceName}</p>
                            {service.description && (
                              <p className="text-sm text-gray-600">{service.description}</p>
                            )}
                          </div>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                            Có thể mua
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Ready to Vaccinate */}
            {readyToVaccinate.data && readyToVaccinate.data.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h2 className="text-lg font-semibold mb-4">Sẵn sàng tiêm (7 ngày tới)</h2>
                <div className="space-y-3">
                  {readyToVaccinate.data.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
                      <div>
                        <p className="font-medium">{item.serviceName} - {item.vaccineName}</p>
                        <p className="text-sm text-gray-600">Mũi {item.muiThu}</p>
                        <p className="text-sm text-gray-600">
                          Ngày dự kiến: {new Date(item.ngayDuKien).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(item.trangThai)}`}>
                          {getStatusText(item.trangThai)}
                        </span>
                        {item.isReady && (
                          <button
                            onClick={() => handleCreateVaccination(item.maKeHoachTiem)}
                            disabled={createPhieuTiem.loading}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                          >
                            {createPhieuTiem.loading ? 'Đang xử lý...' : 'Tạo phiếu tiêm'}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Vaccination Schedule */}
            {vaccinationSchedule.data && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Lịch tiêm chủng chi tiết</h2>
                <div className="space-y-6">
                  {vaccinationSchedule.data.map((service: any, index: number) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-lg">{service.serviceName}</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">
                            {service.completedDoses}/{service.totalDoses} mũi
                          </span>
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${(service.completedDoses / service.totalDoses) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        {service.doses.map((dose: any, doseIndex: number) => (
                          <div key={doseIndex} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium">Mũi {dose.muiThu} - {dose.vaccineName}</p>
                              <p className="text-sm text-gray-600">
                                Ngày dự kiến: {new Date(dose.ngayDuKien).toLocaleDateString('vi-VN')}
                              </p>
                              {dose.phieuTiem && (
                                <p className="text-sm text-green-600">
                                  Đã tiêm: {new Date(dose.phieuTiem.ngayTiem).toLocaleDateString('vi-VN')}
                                  {dose.phieuTiem.doctorName && ` - Bác sĩ: ${dose.phieuTiem.doctorName}`}
                                </p>
                              )}
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(dose.trangThai)}`}>
                              {getStatusText(dose.trangThai)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Error Messages */}
        {vaccinationStatus.error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">Lỗi: {vaccinationStatus.error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorVaccinationManagementPage;