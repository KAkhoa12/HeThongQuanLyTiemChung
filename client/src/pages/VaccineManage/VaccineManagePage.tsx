import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVaccines } from '../../hooks/useVaccine';
import { DataTable, Column, ActionButton } from '../../components/Tables';

const VaccineManagePage: React.FC = () => {
  const navigate = useNavigate();
  
  const {
    data: vaccinesData,
    loading,
    error,
    execute: loadVaccines,
    reset
  } = useVaccines();

  const vaccines = vaccinesData?.data || [];

  useEffect(() => {
    loadVaccines({ page: 1, pageSize: 10 });
  }, [loadVaccines]);

  // Định nghĩa columns cho vaccine table
  const columns: Column<any>[] = [
    {
      key: 'maVaccine',
      header: 'Mã Vaccine',
      width: '120px',
      align: 'center'
    },
    {
      key: 'ten',
      header: 'Tên Vaccine',
      width: '200px'
    },
    {
      key: 'nhaSanXuat',
      header: 'Nhà Sản Xuất',
      width: '150px',
      render: (value) => value || 'Chưa cập nhật'
    },
    {
      key: 'tuoiBatDauTiem',
      header: 'Tuổi Bắt Đầu',
      width: '120px',
      align: 'center',
      render: (value) => value ? `${value} tháng` : '-'
    },
    {
      key: 'tuoiKetThucTiem',
      header: 'Tuổi Kết Thúc',
      width: '120px',
      align: 'center',
      render: (value) => value ? `${value} tháng` : '-'
    },
    {
      key: 'isActive',
      header: 'Trạng Thái',
      width: '100px',
      align: 'center',
      render: (value) => (
        <span className={`inline-flex rounded-full py-1 px-3 text-sm font-medium ${
          value ? 'bg-success text-success bg-opacity-10' : 'bg-danger text-danger bg-opacity-10'
        }`}>
          {value ? 'Hoạt động' : 'Vô hiệu'}
        </span>
      )
    }
  ];

  // Định nghĩa actions
  const actions: ActionButton<any>[] = [
    {
      key: 'view',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
      onClick: (vaccine) => navigate(`/dashboard/vaccine-manage/detail/${vaccine.maVaccine}`),
      tooltip: 'Xem chi tiết'
    },
    {
      key: 'edit',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      onClick: (vaccine) => navigate(`/dashboard/vaccine-manage/edit/${vaccine.maVaccine}`),
      tooltip: 'Chỉnh sửa'
    }
  ];

  if (error) {
    return (
      <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="text-red-600 mr-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium text-red-800">Lỗi khi tải dữ liệu</h3>
              <p className="text-red-700 mt-1">{error}</p>
              <button
                onClick={() => loadVaccines({ page: 1, pageSize: 10 })}
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
            Quản Lý Vaccine
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Danh sách tất cả vaccine trong hệ thống
          </p>
        </div>
        <button
          onClick={() => navigate('/dashboard/vaccine-manage/create')}
          className="inline-flex items-center justify-center rounded-md bg-primary py-2 px-6 text-center font-medium text-white hover:bg-opacity-90"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Thêm Vaccine
        </button>
      </div>
      
      <DataTable
        data={vaccines}
        columns={columns}
        actions={actions}
        title=""
        loading={loading}
        emptyMessage="Không có vaccine nào"
        rowKey="maVaccine"
        striped
        hoverable
        onRowClick={(vaccine) => navigate(`/dashboard/vaccine-manage/detail/${vaccine.maVaccine}`)}
      />
    </div>
  );
};

export default VaccineManagePage; 