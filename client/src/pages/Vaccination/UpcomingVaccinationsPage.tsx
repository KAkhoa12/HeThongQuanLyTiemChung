import React, { useState, useEffect } from 'react';
import { useUpcomingVaccinations } from '../../hooks/usePhieuTiem';
import { PhieuTiem } from '../../services/phieuTiem.service';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

const UpcomingVaccinationsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  const { execute: fetchUpcomingVaccinations, data, loading, error, status } = useUpcomingVaccinations();

  useEffect(() => {
    fetchUpcomingVaccinations({ page: currentPage, pageSize });
  }, [currentPage, pageSize, fetchUpcomingVaccinations]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: vi });
    } catch {
      return 'N/A';
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
      <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="text-center text-danger">
          <p>Có lỗi xảy ra khi tải dữ liệu: {error}</p>
        </div>
      </div>
    );
  }

  if (!data || !data.data || data.data.length === 0) {
    return (
      <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="text-center text-bodydark2">
          <p>Không có đợt tiêm sắp tới nào.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-bold text-black dark:text-white">
          Đợt tiêm sắp tới
        </h2>
        <div className="flex items-center gap-3">
          <select
            value={pageSize}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            className="rounded border border-stroke bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none dark:border-strokedark dark:bg-boxdark"
          >
            <option value={5}>5 / trang</option>
            <option value={10}>10 / trang</option>
            <option value={20}>20 / trang</option>
            <option value={50}>50 / trang</option>
          </select>
        </div>
      </div>

      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="max-h-96 overflow-auto">
          {data.data.map((phieuTiem: PhieuTiem, index: number) => (
            <div
              key={phieuTiem.maPhieuTiem}
              className={`border-b border-stroke py-4 dark:border-strokedark ${
                index === data.data.length - 1 ? 'border-b-0' : ''
              }`}
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div>
                  <h4 className="font-medium text-black dark:text-white mb-2">
                    Thông tin cơ bản
                  </h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Mã phiếu:</span> {phieuTiem.maPhieuTiem}</p>
                    <p><span className="font-medium">Ngày tiêm:</span> {phieuTiem.ngayTiem ? formatDate(phieuTiem.ngayTiem) : 'Chưa xác định'}</p>
                    <p><span className="font-medium">Trạng thái:</span> 
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                        phieuTiem.trangThai === 'NOTIFICATION' 
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                      }`}>
                        {phieuTiem.trangThai}
                      </span>
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-black dark:text-white mb-2">
                    Dịch vụ & Người tiêm
                  </h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Dịch vụ:</span> {phieuTiem.tenDichVu || 'N/A'}</p>
                    <p><span className="font-medium">Người tiêm:</span> {phieuTiem.tenNguoiDung || 'N/A'}</p>
                    <p><span className="font-medium">Bác sĩ:</span> {phieuTiem.tenBacSi || 'Chưa phân công'}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-black dark:text-white mb-2">
                    Chi tiết vaccine
                  </h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Số loại vaccine:</span> {phieuTiem.chiTietPhieuTiems?.length || 0}</p>
                    {phieuTiem.chiTietPhieuTiems && phieuTiem.chiTietPhieuTiems.length > 0 && (
                      <div className="mt-2">
                        {phieuTiem.chiTietPhieuTiems.slice(0, 2).map((chiTiet, idx) => (
                          <div key={idx} className="text-xs bg-gray-50 dark:bg-gray-800 p-2 rounded mb-1">
                            <p><span className="font-medium">Vaccine {idx + 1}:</span> {chiTiet.tenVaccine || 'N/A'}</p>
                            <p><span className="font-medium">Thứ tự:</span> {chiTiet.thuTu}</p>
                          </div>
                        ))}
                        {phieuTiem.chiTietPhieuTiems.length > 2 && (
                          <p className="text-xs text-gray-500">... và {phieuTiem.chiTietPhieuTiems.length - 2} vaccine khác</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-black dark:text-white mb-2">
                    Thông tin khác
                  </h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Ngày tạo:</span> {phieuTiem.ngayTao ? formatDate(phieuTiem.ngayTao) : 'N/A'}</p>
                    <p><span className="font-medium">Phản ứng:</span> {phieuTiem.phanUng || 'Không có'}</p>
                    {phieuTiem.moTaPhanUng && (
                      <p><span className="font-medium">Mô tả:</span> {phieuTiem.moTaPhanUng}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {data.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-stroke px-4 py-3 dark:border-strokedark sm:px-6">
            <div className="flex flex-1 justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center rounded-md border border-stroke bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-strokedark dark:bg-boxdark dark:text-white"
              >
                Trước
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === data.totalPages}
                className="relative ml-3 inline-flex items-center rounded-md border border-stroke bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-strokedark dark:bg-boxdark dark:text-white"
              >
                Sau
              </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700 dark:text-bodydark2">
                  Hiển thị <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span> đến{' '}
                  <span className="font-medium">
                    {Math.min(currentPage * pageSize, data.totalCount)}
                  </span>{' '}
                  trong tổng số <span className="font-medium">{data.totalCount}</span> kết quả
                </p>
              </div>
              <div>
                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed dark:ring-gray-600 dark:hover:bg-gray-700"
                  >
                    <span className="sr-only">Trước</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  {Array.from({ length: Math.min(5, data.totalPages) }, (_, i) => {
                    let pageNum;
                    if (data.totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= data.totalPages - 2) {
                      pageNum = data.totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                          pageNum === currentPage
                            ? 'z-10 bg-primary text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
                            : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 dark:text-white dark:ring-gray-600 dark:hover:bg-gray-700'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === data.totalPages}
                    className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed dark:ring-gray-600 dark:hover:bg-gray-700"
                  >
                    <span className="sr-only">Sau</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpcomingVaccinationsPage; 