import React, { useState, useEffect } from 'react';
import { useLichHens } from '../../hooks/useLichHen';
import { LichHenFilters } from '../../services/lichHen.service';
import { useNavigate } from 'react-router-dom';

const VaccinationSchedulePage: React.FC = () => {
  const navigate = useNavigate();
  
  const [filters, setFilters] = useState<LichHenFilters>({
    page: 1,
    pageSize: 10,
    trangThai: 'NOTIFICATION', // Chỉ lấy lịch hẹn có trạng thái NOTIFICATION
  });

  const { data: lichHenData, loading, error, execute } = useLichHens();

  // Gọi API khi component mount
  useEffect(() => {
    console.log('VaccinationSchedulePage - calling API with filters:', filters);
    execute(filters);
  }, [execute, filters]);

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

  // Xử lý thay đổi trang
  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  // Xử lý nút Tiêm khám
  const handleVaccination = (lichHen: any) => {
    console.log('Navigate to vaccination form for:', lichHen);
    navigate(`/dashboard/vaccination/form/${lichHen.maDonHang}`, {
      state: { lichHen }
    });
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
          Lịch Tiêm Chủng
        </h2>
      </div>

      {/* Danh sách lịch hẹn */}
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Danh sách Lịch hẹn Tiêm chủng ({lichHenData?.totalCount || 0})
          </h3>
        </div>
        <div className="p-6.5">
          {!lichHenData?.data || lichHenData.data.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Không có lịch hẹn tiêm chủng nào</p>
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
                        Mã đơn hàng
                      </th>
                      <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                        Thao tác
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
                          <button
                            onClick={() => handleVaccination(lichHen)}
                            className="inline-flex items-center justify-center rounded-md bg-primary py-2 px-4 text-center font-medium text-white hover:bg-opacity-90"
                          >
                            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Tiêm khám
                          </button>
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

export default VaccinationSchedulePage;