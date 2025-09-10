import React, { useState, useEffect } from 'react';
import { useToast } from '../../hooks/useToast';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { 
  phieuDangKyLichTiemService,
  CreatePhieuDangKyLichTiemDto,
  PhieuDangKyLichTiem
} from '../../services/phieuDangKyLichTiem.service';
import { useApiWithParams } from '../../hooks/useApi';
import { useAllLocations } from '../../hooks/useLocations';
import { useAuthInit } from '../../hooks/useAuthInit';

const AppointmentRegistrationFromInvoice: React.FC = () => {
  const { user } = useAuthInit();
  const { showSuccess, showError } = useToast();
  // Tab state
  const [activeTab, setActiveTab] = useState<'list' | 'register'>('list');
  
  // Registration form states
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [note, setNote] = useState<string>('');
  
  // Pagination states for appointment list
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  // Hooks
  const { execute: createAppointment, loading: createLoading, status: createStatus, error: createError } = useApiWithParams<PhieuDangKyLichTiem, CreatePhieuDangKyLichTiemDto>(
    async (data) => phieuDangKyLichTiemService.create(data),
    null
  );

  // Hook for getting user's appointments
  const { execute: fetchUserAppointments, data: appointmentsData, loading: appointmentsLoading, error: appointmentsError } = useApiWithParams(
    async (params: { maNguoiDung: string; page: number; pageSize: number }) => 
      phieuDangKyLichTiemService.getAllByUser(params.maNguoiDung, params.page, params.pageSize),
    null
  );

  // Hook for updating appointments (for future use)
  // const { execute: updateAppointment, loading: updatingAppointment } = useApiWithParams(
  //   async (params: { id: string; data: UpdatePhieuDangKyLichTiemDto }) => 
  //     phieuDangKyLichTiemService.update(params.id, params.data),
  //   null
  // );

  // Sử dụng useAllLocations hook để lấy danh sách địa điểm
  const { execute: fetchLocations, data: locations, loading: locationsLoading, error: locationsError } = useAllLocations();

  useEffect(() => {
    if (user?.maNguoiDung) {
      // Load user's appointments when component mounts
      fetchUserAppointments({ 
        maNguoiDung: user.maNguoiDung, 
        page: currentPage, 
        pageSize 
      });
    }
    // Load locations
    fetchLocations();
  }, [user, currentPage]);

  // Load appointments when page changes
  useEffect(() => {
    if (user?.maNguoiDung && activeTab === 'list') {
      fetchUserAppointments({ 
        maNguoiDung: user.maNguoiDung, 
        page: currentPage, 
        pageSize 
      });
    }
  }, [currentPage, activeTab]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.maNguoiDung) {
      showError("Lỗi",'Vui lòng đăng nhập để đăng ký lịch tiêm');
      return;
    }

    if (!selectedLocation) {
      showError("Lỗi",'Vui lòng chọn địa điểm tiêm chủng');
      return;
    }

    // Kiểm tra ngày đăng ký (nếu có chọn)
    if (selectedDate) {
      const selectedDateTime = new Date(selectedDate);
      const now = new Date();
      if (selectedDateTime < now) {
        showError("Lỗi",'Ngày đăng ký không thể là ngày trong quá khứ');
        return;
      }
    }

    try {
      const createData: CreatePhieuDangKyLichTiemDto = {
        maKhachHang: user.maNguoiDung,
        maDichVu: 'GENERAL', // Default service for general vaccination
        maDiaDiem: selectedLocation,
        ghiChu: note
      };

      await createAppointment(createData);
      
      if (createStatus === 'success') {
        showSuccess("Thành công",'Đăng ký lịch tiêm thành công!');
        // Reset form
        setSelectedLocation('');
        setSelectedDate('');
        setNote('');
        // Refresh appointments list
        if (user?.maNguoiDung) {
          fetchUserAppointments({ 
            maNguoiDung: user.maNguoiDung, 
            page: currentPage, 
            pageSize 
          });
        }
        // Switch to list tab
        setActiveTab('list');
      } else if (createStatus === 'error') {
        showError("Lỗi",`Lỗi: ${createError || 'Không thể đăng ký lịch tiêm'}`);
      }
    } catch (error) {
      console.error('Lỗi khi đăng ký:', error);
      showError("Lỗi",'Có lỗi xảy ra khi đăng ký lịch tiêm');
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'Pending': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Chờ duyệt' },
      'Approved': { bg: 'bg-green-100', text: 'text-green-800', label: 'Đã duyệt' },
      'Rejected': { bg: 'bg-red-100', text: 'text-red-800', label: 'Từ chối' },
      'Completed': { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Hoàn thành' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['Pending'];
    
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Vui lòng đăng nhập để sử dụng tính năng này</p>
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto max-w-7xl p-5">
        <Breadcrumb pageName="Quản lý đăng ký lịch tiêm" />
        
        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('list')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'list'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Danh sách đăng ký
              </button>
              <button
                onClick={() => setActiveTab('register')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'register'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Đăng ký mới
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'list' ? (
          /* Appointment List Tab */
          <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-black dark:text-white">
                Danh sách đăng ký lịch tiêm của bạn
              </h3>
            </div>

            {appointmentsLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : appointmentsError ? (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 text-center">
                <p className="text-red-600">Có lỗi xảy ra khi tải danh sách đăng ký: {appointmentsError}</p>
              </div>
            ) : appointmentsData?.data?.length === 0 ? (
              <div className="bg-gray-50 border border-gray-200 rounded-md p-8 text-center">
                <p className="text-gray-600 text-lg">Bạn chưa có đăng ký lịch tiêm nào.</p>
              </div>
            ) : (
              <>
                {/* Appointments Table */}
                <div className="overflow-x-auto">
                  <table className="w-full table-auto">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-800">
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Mã phiếu
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Dịch vụ
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Địa điểm
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Ngày đăng ký
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Trạng thái
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Ghi chú
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                      {appointmentsData?.data?.map((appointment) => (
                        <tr key={appointment.maPhieuDangKy} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            {appointment.maPhieuDangKy}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {appointment.tenDichVu || appointment.maDichVu}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {appointment.tenDiaDiem || appointment.maDiaDiem || 'Chưa chọn'}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {new Date(appointment.ngayDangKy).toLocaleDateString('vi-VN')}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            {getStatusBadge(appointment.trangThai)}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                            {appointment.ghiChu || '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {appointmentsData && appointmentsData.totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6">
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                      Hiển thị {((currentPage - 1) * pageSize) + 1} đến {Math.min(currentPage * pageSize, appointmentsData.totalCount)} 
                      trong tổng số {appointmentsData.totalCount} kết quả
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Trước
                      </button>
                      {Array.from({ length: appointmentsData.totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-2 text-sm font-medium rounded-md ${
                            page === currentPage
                              ? 'bg-primary text-white'
                              : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === appointmentsData.totalPages}
                        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Sau
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          /* Registration Form Tab */
          <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-black dark:text-white">
                Đăng ký lịch tiêm mới
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Điền thông tin để đăng ký lịch tiêm chủng
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Chọn địa điểm */}
              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Chọn địa điểm tiêm chủng <span className="text-red-500">*</span>
                </label>
                {locationsLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    <span className="text-sm text-gray-500">Đang tải danh sách địa điểm...</span>
                  </div>
                ) : locationsError ? (
                  <div className="text-red-500 text-sm">
                    Lỗi khi tải danh sách địa điểm: {locationsError}
                  </div>
                ) : (
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full rounded-lg border border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    required
                  >
                    <option value="">-- Chọn địa điểm --</option>
                    {locations?.map((location) => (
                      <option key={location.id} value={location.id}>
                        {location.name} - {location.address}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Chọn ngày đăng ký */}
              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Ngày đăng ký tiêm chủng
                </label>
                <input
                  type="datetime-local"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().slice(0, 16)}
                  className="w-full rounded-lg border border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-not-allowed disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  placeholder="Chọn ngày và giờ đăng ký"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Để trống để sử dụng ngày giờ hiện tại
                </p>
              </div>

              {/* Ghi chú */}
              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Ghi chú
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  placeholder="Nhập ghi chú nếu cần..."
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setActiveTab('list')}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={createLoading || !selectedLocation}
                  className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {createLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Đang xử lý...</span>
                    </div>
                  ) : (
                    'Đăng ký lịch tiêm'
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  );
};

export default AppointmentRegistrationFromInvoice;