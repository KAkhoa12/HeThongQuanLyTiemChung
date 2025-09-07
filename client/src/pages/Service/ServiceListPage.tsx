import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable, Column, ActionButton } from '../../components/Tables';
import { useServices, useDeleteService } from '../../hooks/useService';
import { Service } from '../../types/service.types';

const ServiceListPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const {
    data: servicesData,
    loading,
    error,
    execute: loadServices,
  } = useServices();

  const { execute: deleteService, loading: deletingLoading } =
    useDeleteService();

  useEffect(() => {
    loadServices({ page: currentPage, pageSize });
  }, [currentPage, pageSize]);

  // Định nghĩa columns cho service table
  const columns: Column<Service>[] = [
    {
      key: 'id',
      header: 'Mã Dịch Vụ',
      width: '120px',
      align: 'center',
    },
    {
      key: 'name',
      header: 'Tên Dịch Vụ',
      width: '200px',
    },
    {
      key: 'description',
      header: 'Mô Tả',
      width: '250px',
      render: (value) => value || '-',
    },
    {
      key: 'price',
      header: 'Giá',
      width: '120px',
      align: 'right',
      render: (value) => (value ? `${value.toLocaleString('vi-VN')} VNĐ` : '-'),
    },
    {
      key: 'serviceTypeName',
      header: 'Loại Dịch Vụ',
      width: '150px',
      render: (value) => value || '-',
    },
    {
      key: 'createdAt',
      header: 'Ngày Tạo',
      width: '120px',
      align: 'center',
      render: (value) => new Date(value).toLocaleDateString('vi-VN'),
    },
  ];

  // Định nghĩa actions
  const actions: ActionButton<Service>[] = [
    {
      key: 'view-details',
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
      ),
      onClick: (item) => {
        navigate(`/dashboard/services/${item.id}`);
      },
      tooltip: 'Xem chi tiết',
    },
    {
      key: 'edit',
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
      ),
      onClick: (item) => {
        navigate(`/dashboard/services/${item.id}/edit`);
      },
      tooltip: 'Chỉnh sửa',
    },
    {
      key: 'delete',
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      ),
      onClick: async (item) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa dịch vụ này?')) {
          await deleteService(item.id);
          loadServices({ page: currentPage, pageSize });
        }
      },
      tooltip: 'Xóa',
    },
  ];


  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  if (error) {
    return (
      <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="text-red-600 mr-3">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium text-red-800">
                Lỗi khi tải dữ liệu
              </h3>
              <p className="text-red-700 mt-1">{error}</p>
              <button
                onClick={() => loadServices({ page: currentPage, pageSize })}
                className="mt-3 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Thử lại
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-title-md2 font-bold text-black dark:text-white">
            Quản Lý Dịch Vụ
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Danh sách tất cả dịch vụ trong hệ thống
          </p>
        </div>
        <button
          onClick={() => navigate('/dashboard/services/create')}
          className="inline-flex items-center justify-center rounded-md bg-primary py-2 px-6 text-center font-medium text-white hover:bg-opacity-90"
        >
          <i className="fa-solid fa-plus mr-2"></i>
          Thêm Dịch Vụ
        </button>
      </div>

      <DataTable
        data={servicesData?.data || []}
        columns={columns}
        actions={actions}
        title=""
        loading={loading}
        emptyMessage="Không có dịch vụ nào"
        rowKey="id"
        striped
        hoverable
        onRowClick={(service) => navigate(`/dashboard/services/${service.id}`)}
      />

      {/* Pagination */}
      {servicesData && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-700">
            Hiển thị {(currentPage - 1) * pageSize + 1} đến{' '}
            {Math.min(currentPage * pageSize, servicesData.totalCount)} trong
            tổng số {servicesData.totalCount} dịch vụ
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              className="border border-gray-300 rounded px-3 py-1 text-sm"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <span className="text-sm text-gray-700">dòng mỗi trang</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceListPage;
