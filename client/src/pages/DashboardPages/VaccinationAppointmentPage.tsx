import React, { useState, useEffect } from 'react';
import { useLichHens } from '../../hooks/useLichHen';
import { LichHenFilters } from '../../services/lichHen.service';
import { useAuth } from '../../hooks';

const VaccinationAppointmentPage: React.FC = () => {
  const { user } = useAuth();
  
  const [filters, setFilters] = useState<LichHenFilters>({
    page: 1,
    pageSize: 10,
  });
  
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');

  const { data: lichHenData, loading, error, execute } = useLichHens();

  // Cập nhật filters khi có thay đổi
  useEffect(() => {
    const newFilters: LichHenFilters = {
      page: 1,
      pageSize: 10,
    };

    if (selectedStatus) newFilters.trangThai = selectedStatus;
    if (selectedLocation) newFilters.maDiaDiem = selectedLocation;
    if (fromDate) newFilters.fromDate = fromDate;
    if (toDate) newFilters.toDate = toDate;
    if (user?.maNguoiDung) newFilters.userId = user.maNguoiDung;

    setFilters(newFilters);
  }, [selectedStatus, selectedLocation, fromDate, toDate, user?.maNguoiDung]);

  // Gọi API khi filters thay đổi
  useEffect(() => {
    if (user?.maNguoiDung) {
      console.log('VaccinationAppointmentPage - calling API with filters:', filters);
      execute(filters);
    }
  }, [execute, filters, user?.maNguoiDung]);

  // Xử lý thay đổi trang
  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };


  // Lấy danh sách trạng thái duy nhất
  const getUniqueStatuses = () => {
    if (!lichHenData?.data) return [];
    const statuses = lichHenData.data.map(item => item.trangThai);
    return [...new Set(statuses)];
  };

  // Lấy danh sách địa điểm duy nhất
  const getUniqueLocations = () => {
    if (!lichHenData?.data) return [];
    const locations = lichHenData.data
      .filter(item => item.locationName)
      .map(item => ({ id: item.maDiaDiem, name: item.locationName }));
    return [...new Set(locations.map(l => l.id))].map(id => 
      locations.find(l => l.id === id)
    );
  };

  // Format ngày
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Lấy màu sắc cho trạng thái
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NOTIFICATION':
        return 'bg-blue-100 text-blue-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'MISSED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Lấy tên trạng thái
  const getStatusName = (status: string) => {
    switch (status) {
      case 'NOTIFICATION':
        return 'Thông báo';
      case 'COMPLETED':
        return 'Hoàn thành';
      case 'MISSED':
        return 'Bỏ lỡ';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Lỗi khi tải dữ liệu
            </h3>
            <div className="mt-2 text-sm text-red-700">
              {error}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          Quản lý Lịch hẹn Tiêm chủng
        </h2>
      </div>

      {/* Filters */}
      <div className="mb-6 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Bộ lọc
          </h3>
        </div>
        <div className="p-6.5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Trạng thái */}
            <div>
              <label className="mb-2.5 block text-black dark:text-white">
                Trạng thái
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              >
                <option value="">Tất cả trạng thái</option>
                {getUniqueStatuses().map(status => (
                  <option key={status} value={status}>
                    {getStatusName(status)}
                  </option>
                ))}
              </select>
            </div>

            {/* Địa điểm */}
            <div>
              <label className="mb-2.5 block text-black dark:text-white">
                Địa điểm
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              >
                <option value="">Tất cả địa điểm</option>
                {getUniqueLocations().map(location => (
                  <option key={location?.id} value={location?.id}>
                    {location?.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Từ ngày */}
            <div>
              <label className="mb-2.5 block text-black dark:text-white">
                Từ ngày
              </label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
            </div>

            {/* Đến ngày */}
            <div>
              <label className="mb-2.5 block text-black dark:text-white">
                Đến ngày
              </label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
            </div>
          </div>

          {/* Nút reset */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => {
                setSelectedStatus('');
                setSelectedLocation('');
                setFromDate('');
                setToDate('');
              }}
              className="rounded bg-gray-500 py-2 px-4 font-medium text-white hover:bg-gray-600"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Danh sách lịch hẹn */}
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Danh sách Lịch hẹn ({lichHenData?.totalCount || 0})
          </h3>
        </div>
        <div className="p-6.5">
          {!lichHenData?.data || lichHenData.data.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Không có lịch hẹn nào</p>
            </div>
          ) : (
            <>
              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-gray-2 text-left dark:bg-meta-4">
                      <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                        Mã lịch hẹn
                      </th>
                      <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                        Khách hàng
                      </th>
                      <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                        Địa điểm
                      </th>
                      <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                        Ngày hẹn
                      </th>
                      <th className="min-w-[100px] py-4 px-4 font-medium text-black dark:text-white">
                        Trạng thái
                      </th>
                      <th className="min-w-[100px] py-4 px-4 font-medium text-black dark:text-white">
                        Tổng tiền
                      </th>
                      <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                        Ghi chú
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {lichHenData.data.map((lichHen) => (
                      <tr key={lichHen.maLichHen} className="border-b border-stroke dark:border-strokedark">
                        <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                          <h5 className="font-medium text-black dark:text-white">
                            {lichHen.maLichHen}
                          </h5>
                        </td>
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                          <div>
                            <p className="text-black dark:text-white">
                              {lichHen.customerName || 'N/A'}
                            </p>
                            <p className="text-sm text-gray-500">
                              {lichHen.maDonHang || 'N/A'}
                            </p>
                          </div>
                        </td>
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                          <div>
                            <p className="text-black dark:text-white">
                              {lichHen.locationName || 'N/A'}
                            </p>
                            <p className="text-sm text-gray-500">
                              {lichHen.maDiaDiem || 'N/A'}
                            </p>
                          </div>
                        </td>
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                          <p className="text-black dark:text-white">
                            {formatDate(lichHen.ngayHen)}
                          </p>
                        </td>
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                          <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(lichHen.trangThai)}`}>
                            {getStatusName(lichHen.trangThai)}
                          </span>
                        </td>
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                          <p className="text-black dark:text-white">
                            {lichHen.maDonHang}
                          </p>
                        </td>
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                          <p className="text-black dark:text-white">
                            {lichHen.ghiChu || '-'}
                          </p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {lichHenData.totalPages > 1 && (
                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">
                      Hiển thị {((filters.page || 1) - 1) * (filters.pageSize || 10) + 1} - {Math.min((filters.page || 1) * (filters.pageSize || 10), lichHenData.totalCount)} của {lichHenData.totalCount} kết quả
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange((filters.page || 1) - 1)}
                      disabled={!filters.page || filters.page <= 1}
                      className="rounded bg-gray-200 py-2 px-3 text-sm font-medium text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Trước
                    </button>
                    <span className="text-sm text-gray-500">
                      Trang {filters.page || 1} / {lichHenData.totalPages}
                    </span>
                    <button
                      onClick={() => handlePageChange((filters.page || 1) + 1)}
                      disabled={!filters.page || filters.page >= lichHenData.totalPages}
                      className="rounded bg-gray-200 py-2 px-3 text-sm font-medium text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Sau
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VaccinationAppointmentPage;