import React, { useState } from 'react';
import { CardDataStats } from '../../components/CardDataStats';
import { DataTable } from '../../components/Tables/DataTable';
import { usePhieuDangKyLichTiemByCustomer } from '../../hooks';
import { useAuth } from '../../hooks';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

const LichSuTiemPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { user } = useAuth();

  const { data: appointments, isLoading, error } = usePhieuDangKyLichTiemByCustomer(user?.maNguoiDung || null);

  const filteredAppointments = appointments?.filter(a => a.trangThai === 'Approved') || [];
  const totalCount = filteredAppointments.length;

  // Cột cho bảng
  const columns = [
    {
      header: 'Mã phiếu',
      accessorKey: 'maPhieuDangKy',
      cell: ({ row }: any) => (
        <span className="font-medium text-black dark:text-white">
          {row.original.maPhieuDangKy}
        </span>
      ),
    },
    {
      header: 'Mã đơn hàng',
      accessorKey: 'maDonHangDisplay',
      cell: ({ row }: any) => (
        <span className="text-sm text-gray-600">
          {row.original.maDonHangDisplay}
        </span>
      ),
    },
    {
      header: 'Ngày đăng ký',
      accessorKey: 'ngayDangKy',
      cell: ({ row }: any) => (
        <span className="text-sm text-gray-600">
          {format(new Date(row.original.ngayDangKy), 'dd/MM/yyyy HH:mm', { locale: vi })}
        </span>
      ),
    },
    {
      header: 'Trạng thái',
      accessorKey: 'trangThai',
      cell: ({ row }: any) => {
        const status = row.original.trangThai;
        let statusClass = '';
        let statusText = '';

        switch (status) {
          case 'Approved':
            statusClass = 'bg-green-100 text-green-800';
            statusText = 'Đã duyệt';
            break;
          case 'Rejected':
            statusClass = 'bg-red-100 text-red-800';
            statusText = 'Từ chối';
            break;
          default:
            statusClass = 'bg-gray-100 text-gray-800';
            statusText = status;
        }

        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClass}`}>
            {statusText}
          </span>
        );
      },
    },
    {
      header: 'Ghi chú',
      accessorKey: 'ghiChu',
      cell: ({ row }: any) => (
        <span className="text-sm text-gray-600 max-w-xs truncate">
          {row.original.ghiChu || '-'}
        </span>
      ),
    },
    {
      header: 'Lý do từ chối',
      accessorKey: 'lyDoTuChoi',
      cell: ({ row }: any) => (
        <span className="text-sm text-gray-600 max-w-xs truncate">
          {row.original.lyDoTuChoi || '-'}
        </span>
      ),
    },
  ];

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Có lỗi xảy ra khi tải dữ liệu: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          Lịch sử tiêm chủng
        </h2>
      </div>

      {/* Thống kê */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3 2xl:gap-7.5 mb-6">
        <CardDataStats
          title="Tổng phiếu đăng ký"
          total={appointments?.length.toString() || '0'}
          rate=""
          levelUp
        >
          <svg
            className="fill-primary dark:fill-white"
            width="22"
            height="16"
            viewBox="0 0 22 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11 15.1156C4.19376 15.1156 0.825012 8.61876 0.687512 8.34376C0.584387 8.13751 0.584387 7.86251 0.687512 7.65626C0.825012 7.38126 4.19376 0.8844 11 0.8844C17.8063 0.8844 21.175 7.38126 21.3125 7.65626C21.4156 7.86251 21.4156 8.13751 21.3125 8.34376C21.175 8.61876 17.8063 15.1156 11 15.1156ZM2.26876 8.50001C3.02501 9.66251 4.98126 12.5563 11 12.5563C17.0188 12.5563 18.975 9.66251 19.7313 8.50001C18.975 7.33751 17.0188 4.44376 11 4.44376C4.98126 4.44376 3.02501 7.33751 2.26876 8.50001Z"
              fill=""
            />
            <path
              d="M11 10.9219C9.38438 10.9219 8.07812 9.61562 8.07812 8C8.07812 6.38438 9.38438 5.07812 11 5.07812C12.6156 5.07812 13.9219 6.38438 13.9219 8C13.9219 9.61562 12.6156 10.9219 11 10.9219ZM11 6.625C10.2437 6.625 9.625 7.24375 9.625 8C9.625 8.75625 10.2437 9.375 11 9.375C11.7563 9.375 12.375 8.75625 12.375 8C12.375 7.24375 11.7563 6.625 11 6.625Z"
              fill=""
            />
          </svg>
        </CardDataStats>

        <CardDataStats
          title="Đã duyệt"
          total={filteredAppointments.length.toString()}
          rate=""
          levelUp
        >
          <svg
            className="fill-primary dark:fill-white"
            width="22"
            height="16"
            viewBox="0 0 22 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11 15.1156C4.19376 15.1156 0.825012 8.61876 0.687512 8.34376C0.584387 8.13751 0.584387 7.86251 0.687512 7.65626C0.825012 7.38126 4.19376 0.8844 11 0.8844C17.8063 0.8844 21.175 7.38126 21.3125 7.65626C21.4156 7.86251 21.4156 8.13751 21.3125 8.34376C21.175 8.61876 17.8063 15.1156 11 15.1156ZM2.26876 8.50001C3.02501 9.66251 4.98126 12.5563 11 12.5563C17.0188 12.5563 18.975 9.66251 19.7313 8.50001C18.975 7.33751 17.0188 4.44376 11 4.44376C4.98126 4.44376 3.02501 7.33751 2.26876 8.50001Z"
              fill=""
            />
            <path
              d="M11 10.9219C9.38438 10.9219 8.07812 9.61562 8.07812 8C8.07812 6.38438 9.38438 5.07812 11 5.07812C12.6156 5.07812 13.9219 6.38438 13.9219 8C13.9219 9.61562 12.6156 10.9219 11 10.9219ZM11 6.625C10.2437 6.625 9.625 7.24375 9.625 8C9.625 8.75625 10.2437 9.375 11 9.375C11.7563 9.375 12.375 8.75625 12.375 8C12.375 7.24375 11.7563 6.625 11 6.625Z"
              fill=""
            />
          </svg>
        </CardDataStats>

        <CardDataStats
          title="Từ chối"
          total={(appointments?.filter(a => a.trangThai === 'Rejected').length || 0).toString()}
          rate=""
          levelUp
        >
          <svg
            className="fill-primary dark:fill-white"
            width="22"
            height="16"
            viewBox="0 0 22 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11 15.1156C4.19376 15.1156 0.825012 8.61876 0.687512 8.34376C0.584387 8.13751 0.584387 7.86251 0.687512 7.65626C0.825012 7.38126 4.19376 0.8844 11 0.8844C17.8063 0.8844 21.175 7.38126 21.3125 7.65626C21.4156 7.86251 21.4156 8.13751 21.3125 8.34376C21.175 8.61876 17.8063 15.1156 11 15.1156ZM2.26876 8.50001C3.02501 9.66251 4.98126 12.5563 11 12.5563C17.0188 12.5563 18.975 9.66251 19.7313 8.50001C18.975 7.33751 17.0188 4.44376 11 4.44376C4.98126 4.44376 3.02501 7.33751 2.26876 8.50001Z"
              fill=""
            />
            <path
              d="M11 10.9219C9.38438 10.9219 8.07812 9.61562 8.07812 8C8.07812 6.38438 9.38438 5.07812 11 5.07812C12.6156 5.07812 13.9219 6.38438 13.9219 8C13.9219 9.61562 12.6156 10.9219 11 10.9219ZM11 6.625C10.2437 6.625 9.625 7.24375 9.625 8C9.625 8.75625 10.2437 9.375 11 9.375C11.7563 9.375 12.375 8.75625 12.375 8C12.375 7.24375 11.7563 6.625 11 6.625Z"
              fill=""
            />
          </svg>
        </CardDataStats>
      </div>

      {/* Bảng dữ liệu */}
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <DataTable
          data={filteredAppointments}
          columns={columns}
          isLoading={isLoading}
          currentPage={currentPage}
          totalPages={Math.ceil(totalCount / pageSize)}
          onPageChange={setCurrentPage}
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
          totalCount={totalCount}
        />
      </div>
    </div>
  );
};

export default LichSuTiemPage; 