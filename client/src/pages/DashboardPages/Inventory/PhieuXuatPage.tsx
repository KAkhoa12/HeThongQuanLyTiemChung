import React, { useState, useEffect } from 'react';
import { usePhieuXuats, useDeletePhieuXuat } from '../../../hooks';
import { PhieuXuatCreateModal, PhieuXuatDetailModal, PhieuXuatEditModal } from '../../../components/Inventory';
import { TrangThaiPhieuKho } from '../../../types/khoTypes';

interface PhieuXuatPageProps {}

const PhieuXuatPage: React.FC<PhieuXuatPageProps> = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPhieuXuatId, setSelectedPhieuXuatId] = useState<string>('');
  const pageSize = 10;

  // Fetch data
  const { data: phieuXuatData, loading: phieuXuatLoading, execute: fetchPhieuXuats } = usePhieuXuats();
  const { execute: deletePhieuXuat, loading: deleteLoading } = useDeletePhieuXuat();

  useEffect(() => {
    fetchPhieuXuats({
      page: currentPage,
      pageSize,
      search: searchTerm,
      trangThai: statusFilter || undefined
    });
  }, [currentPage, searchTerm, statusFilter]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleRefresh = () => {
    setSearchTerm('');
    setStatusFilter('');
    setCurrentPage(1);
    fetchPhieuXuats({
      page: 1,
      pageSize,
      search: '',
      trangThai: undefined
    });
  };

  const handleViewDetail = (phieuXuatId: string) => {
    setSelectedPhieuXuatId(phieuXuatId);
    setIsDetailModalOpen(true);
  };

  const handleEdit = (phieuXuatId: string) => {
    setSelectedPhieuXuatId(phieuXuatId);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (phieuXuatId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa phiếu xuất này?')) {
      try {
        await deletePhieuXuat(phieuXuatId);
        fetchPhieuXuats({
          page: currentPage,
          pageSize,
          search: searchTerm,
          trangThai: statusFilter || undefined
        });
        alert('Xóa phiếu xuất thành công!');
      } catch (error) {
        console.error('Error deleting phiếu xuất:', error);
        alert('Có lỗi xảy ra khi xóa phiếu xuất!');
      }
    }
  };


  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          Quản lý Phiếu Xuất
        </h2>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center justify-center rounded-md bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90"
        >
          <i className="ri-add-line mr-2"></i>
          Thêm phiếu xuất
        </button>
      </div>

      {/* Search and Filters */}
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark mb-6">
        <div className="p-6.5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm phiếu xuất..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 pl-12 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
              <span className="absolute left-4.5 top-1/2 -translate-y-1/2">
                <i className="ri-search-line text-xl text-body dark:text-bodydark"></i>
              </span>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => handleStatusFilter(e.target.value)}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              >
                <option value="">Tất cả trạng thái</option>
                <option value={TrangThaiPhieuKho.Pending}>Chờ xác nhận</option>
                <option value={TrangThaiPhieuKho.Approved}>Đã xác nhận</option>
                <option value={TrangThaiPhieuKho.Rejected}>Đã hủy</option>
              </select>
            </div>

            {/* Refresh Button */}
            <div>
              <button
                onClick={handleRefresh}
                className="w-full inline-flex items-center justify-center rounded-md bg-primary py-3 px-5 text-center font-medium text-white hover:bg-opacity-90"
              >
                <i className="ri-refresh-line mr-2"></i>
                Làm mới
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Phieu Xuat Table */}
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Danh sách Phiếu Xuất
          </h3>
        </div>
        <div className="p-6.5">
          {phieuXuatLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-gray-2 text-left dark:bg-meta-4">
                      <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                        Mã phiếu xuất
                      </th>
                      <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                        Địa điểm nhập
                      </th>
                      <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                        Địa điểm xuất
                      </th>
                      <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                        Ngày xuất
                      </th>
                      <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                        Loại xuất
                      </th>
                      <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                        Trạng thái
                      </th>
                      <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {phieuXuatData?.data?.map((item: any, index: number) => (
                      <tr key={item.maPhieuXuat} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-1 dark:bg-meta-4'}>
                        <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                          <h5 className="font-medium text-black dark:text-white">
                            {item.maPhieuXuat}
                          </h5>
                        </td>
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                          <p className="text-black dark:text-white">
                            {item.tenDiaDiemNhap || '-'}
                          </p>
                        </td>
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                          <p className="text-black dark:text-white">
                            {item.tenDiaDiemXuat || '-'}
                          </p>
                        </td>
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                          <p className="text-black dark:text-white">
                            {item.ngayXuat ? formatDate(item.ngayXuat) : '-'}
                          </p>
                        </td>
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                          <p className="text-black dark:text-white">
                            {item.loaiXuat || '-'}
                          </p>
                        </td>
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                          <p className={`inline-flex rounded-full py-1 px-3 text-sm font-medium ${
                            item.trangThai === TrangThaiPhieuKho.Approved 
                              ? 'bg-success bg-opacity-10 text-success' 
                              : item.trangThai === TrangThaiPhieuKho.Pending ? 'bg-warning bg-opacity-10 text-warning' : 'bg-danger bg-opacity-10 text-danger'
                          }`}>
                            {item.trangThai === TrangThaiPhieuKho.Approved ? 'Đã xác nhận' : item.trangThai === TrangThaiPhieuKho.Pending ? 'Chờ xác nhận' : 'Đã hủy'}
                          </p>
                        </td>
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                          <div className="flex items-center justify-center space-x-3.5">
                            <button
                              onClick={() => handleViewDetail(item.maPhieuXuat)}
                              className="hover:text-primary text-gray-600"
                              title="Xem chi tiết"
                            >
                              <i className="ri-eye-line text-xl"></i>
                            </button>
                            {item.trangThai === TrangThaiPhieuKho.Pending && (
                              <>
                                <button
                                  onClick={() => handleEdit(item.maPhieuXuat)}
                                  className="hover:text-primary text-gray-600"
                                  title="Chỉnh sửa"
                                >
                                  <i className="ri-edit-line text-xl"></i>
                                </button>
                                <button
                                  onClick={() => handleDelete(item.maPhieuXuat)}
                                  className="hover:text-danger text-gray-600"
                                  title="Xóa"
                                  disabled={deleteLoading}
                                >
                                  <i className="ri-delete-bin-line text-xl"></i>
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {phieuXuatData && phieuXuatData.totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-gray-500">
                    Hiển thị {((currentPage - 1) * pageSize) + 1} đến {Math.min(currentPage * pageSize, phieuXuatData.totalCount)} của {phieuXuatData.totalCount} kết quả
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Trước
                    </button>
                    <span className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md">
                      {currentPage} / {phieuXuatData.totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, phieuXuatData.totalPages))}
                      disabled={currentPage === phieuXuatData.totalPages}
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
      </div>

      {/* Create Modal */}
      <PhieuXuatCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          fetchPhieuXuats({
            page: currentPage,
            pageSize,
            search: searchTerm,
            trangThai: statusFilter || undefined
          });
          setIsCreateModalOpen(false);
        }}
      />

      {/* Detail Modal */}
      <PhieuXuatDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        phieuXuatId={selectedPhieuXuatId}
      />

      {/* Edit Modal */}
      <PhieuXuatEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={() => {
          fetchPhieuXuats({
            page: currentPage,
            pageSize,
            search: searchTerm,
            trangThai: statusFilter || undefined
          });
          setIsEditModalOpen(false);
        }}
        phieuXuatId={selectedPhieuXuatId}
      />
    </div>
  );
};

export default PhieuXuatPage;