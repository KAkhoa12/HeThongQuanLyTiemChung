import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNhanVien } from '../../../hooks/useNhanVien';
import { useToast } from '../../../hooks/useToast';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';

const NhanVienDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { showError } = useToast();
  const { data: nhanVien, loading, execute: fetchNhanVien } = useNhanVien(id || '');

  useEffect(() => {
    if (id) {
      fetchNhanVien({ id });
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!nhanVien) {
    return (
      <div className="text-center py-8">
        <p className="text-bodydark2">Không tìm thấy thông tin nhân viên</p>
      </div>
    );
  }

  return (
    <div className='p-6' >
      <Breadcrumb pageName={`Chi tiết nhân viên - ${nhanVien.ten}`} />

      <div className="grid grid-cols-1 gap-9">
        {/* Thông tin cơ bản */}
        <div className="flex flex-col gap-9">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Thông tin cơ bản
              </h3>
            </div>
            <div className="p-6.5">
              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Họ và tên
                </label>
                <div className="relative">
                  <span className="text-bodydark2">{nhanVien.ten}</span>
                </div>
              </div>

              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Email
                </label>
                <div className="relative">
                  <span className="text-bodydark2">{nhanVien.email}</span>
                </div>
              </div>

              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Chức vụ
                </label>
                <div className="relative">
                  <span className="text-bodydark2">{nhanVien.chucVu || 'Chưa cập nhật'}</span>
                </div>
              </div>

              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Địa điểm làm việc
                </label>
                <div className="relative">
                  <span className="text-bodydark2">{nhanVien.tenDiaDiem || 'Chưa cập nhật'}</span>
                </div>
              </div>

              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Số điện thoại
                </label>
                <div className="relative">
                  <span className="text-bodydark2">{nhanVien.soDienThoai || 'Chưa cập nhật'}</span>
                </div>
              </div>

              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Ngày sinh
                </label>
                <div className="relative">
                  <span className="text-bodydark2">{nhanVien.ngaySinh || 'Chưa cập nhật'}</span>
                </div>
              </div>

              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Giới tính
                </label>
                <div className="relative">
                  <span className="text-bodydark2">{nhanVien.gioiTinh || 'Chưa cập nhật'}</span>
                </div>
              </div>

              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Địa chỉ
                </label>
                <div className="relative">
                  <span className="text-bodydark2">{nhanVien.diaChi || 'Chưa cập nhật'}</span>
                </div>
              </div>

              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Trạng thái
                </label>
                <div className="relative">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      nhanVien.isActive
                        ? 'bg-success/10 text-success'
                        : 'bg-danger/10 text-danger'
                    }`}
                  >
                    {nhanVien.isActive ? 'Hoạt động' : 'Không hoạt động'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Action buttons */}
      <div className="mt-6 flex justify-end gap-4">
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center justify-center rounded-md border border-stroke bg-white px-4 py-2 text-center font-medium text-black hover:bg-opacity-90 dark:border-strokedark dark:bg-boxdark dark:text-white"
        >
          Quay lại
        </button>
        <button
          onClick={() => window.open(`/dashboard/nguoi-dung/nhan-vien/${id}/edit`, '_blank')}
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-center font-medium text-white hover:bg-opacity-90"
        >
          <i className="ri-edit-line mr-2"></i>
          Chỉnh sửa
        </button>
      </div>
    </div>
  );
};

export default NhanVienDetailPage;