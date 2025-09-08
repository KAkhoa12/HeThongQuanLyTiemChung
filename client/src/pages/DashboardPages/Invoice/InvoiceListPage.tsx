import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaEye,
  FaSearch,
  FaFilter,
} from 'react-icons/fa';
import { useAuthInit } from '../../../hooks/useAuthInit';
import { useInvoice } from '../../../hooks/useInvoice';

const InvoiceListPage: React.FC = () => {
  const {
    invoices,
    loading,
    currentPage,
    totalPages,
    totalCount,
    searchTerm,
    statusFilter,
    setSearchTerm,
    setStatusFilter,
    setCurrentPage,
    resetFilters,
  } = useInvoice();
  const { user } = useAuthInit();

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: { text: string; className: string } } = {
      COMPLETED: {
        text: 'Đã hoàn thành',
        className: 'bg-green-100 text-green-800',
      },
      PAID: { 
        text: 'Đã thanh toán', 
        className: 'bg-green-100 text-green-800' 
      },
      PAYMENT_PENDING: {
        text: 'Chờ thanh toán',
        className: 'bg-orange-100 text-orange-800',
      },
      PENDING: {
        text: 'Chờ xử lý',
        className: 'bg-yellow-100 text-yellow-800',
      },
      PROCESSING: {
        text: 'Đang xử lý',
        className: 'bg-blue-100 text-blue-800',
      },
      FAILED: {
        text: 'Đã thất bại',
        className: 'bg-red-100 text-red-800',
      },
    };

    const statusInfo = statusMap[status] || {
      text: status,
      className: 'bg-gray-100 text-gray-800',
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.className}`}
      >
        {statusInfo.text}
      </span>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Helper functions để extract thông tin từ ghiChu
  const extractCustomerName = (ghiChu?: string): string => {
    if (!ghiChu) return 'Không có';
    const match = ghiChu.match(/Khách hàng: ([^,]+)/);
    return match ? match[1].trim() : 'Không có';
  };

  const extractCustomerPhone = (ghiChu?: string): string => {
    if (!ghiChu) return 'Không có';
    const match = ghiChu.match(/SĐT: ([^,]+)/);
    return match ? match[1].trim() : 'Không có';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          Quản lý Hóa đơn mua hàng
        </h2>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm hóa đơn..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full rounded-lg border border-stroke bg-white py-2 pl-10 pr-4 outline-none focus:border-primary focus:ring-1 focus:ring-primary dark:border-strokedark dark:bg-meta-4 dark:focus:border-primary"
          />
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => handleStatusFilter(e.target.value)}
          className="rounded-lg border border-stroke bg-white py-2 px-4 outline-none focus:border-primary focus:ring-1 focus:ring-primary dark:border-strokedark dark:bg-meta-4 dark:focus:border-primary"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="COMPLETED">Đã hoàn thành</option>
          <option value="PAID">Đã thanh toán</option>
          <option value="PAYMENT_PENDING">Chờ thanh toán</option>
          <option value="PENDING">Chờ xử lý</option>
          <option value="PROCESSING">Đang xử lý</option>
          <option value="FAILED">Đã thất bại</option>
        </select>

        <button
          onClick={resetFilters}
          className="inline-flex items-center justify-center rounded-md bg-gray-500 py-2 px-6 text-center font-medium text-white hover:bg-opacity-90"
        >
          <FaFilter className="mr-2" />
          Làm mới
        </button>
      </div>

      {/* Invoice Table */}
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                  Mã HĐ
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                  Ngày tạo
                </th>
                {user?.role === 'MANAGER' || user?.role === 'DOCTOR' && (
                  <>
                    <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                      Khách hàng
                    </th>
                    <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                      Số điện thoại
                    </th>
                  </>
                )}
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                  Tổng tiền
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                  Trạng thái
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                  Thanh toán
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-500">
                    Không có hóa đơn nào
                  </td>
                </tr>
              ) : (
                invoices.map((invoice) => (
                  <tr
                    key={invoice.maDonHang}
                    className="border-b border-[#eee] dark:border-strokedark"
                  >
                    <td className="py-5 px-4 pl-9 xl:pl-11">
                      <h5 className="font-medium text-black dark:text-white">
                        {invoice.maDonHang}
                      </h5>
                    </td>
                    <td className="py-5 px-4">
                      <p className="text-black dark:text-white">
                        {formatDate(invoice.ngayTao)}
                      </p>
                    </td>
                    {user?.role === 'MANAGER' || user?.role === 'DOCTOR' && (
                      <>
                        <td className="py-5 px-4">
                          <p className="text-black dark:text-white">
                            {extractCustomerName(invoice.ghiChu)}
                          </p>
                        </td>
                        <td className="py-5 px-4">
                          <p className="text-black dark:text-white">
                            {extractCustomerPhone(invoice.ghiChu)}
                          </p>
                        </td>
                      </>
                    )}
                    <td className="py-5 px-4">
                      <p className="text-black dark:text-white font-medium">
                        {formatCurrency(invoice.tongTienThanhToan)}
                      </p>
                    </td>
                    <td className="py-5 px-4">
                      {getStatusBadge(invoice.trangThaiDon)}
                    </td>
                    <td className="py-5 px-4">
                      <p className="text-black dark:text-white">
                        {invoice.trangThaiDon === 'PAID'
                          ? 'Đã thanh toán'
                          : 'Chưa thanh toán'}
                      </p>
                    </td>
                    <td className="py-5 px-4">
                      <div className="flex items-center space-x-3.5">
                        <Link
                          to={`/dashboard/invoices/${invoice.maDonHang}`}
                          className="hover:text-primary"
                          title="Xem chi tiết"
                        >
                          <FaEye className="h-5 w-5" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex flex-col items-center justify-center space-y-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Hiển thị {invoices.length} trong tổng số {totalCount} hóa đơn
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              Trước
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 rounded border ${
                  currentPage === page
                    ? 'bg-primary text-white border-primary'
                    : 'hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() =>
                setCurrentPage(Math.min(currentPage + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-2 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              Sau
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceListPage;
