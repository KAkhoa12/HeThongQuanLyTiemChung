import React, { useState, useEffect } from 'react';
import { usePhieuNhaps, useDeletePhieuNhap } from '../../../hooks';
import { PhieuNhapCreateModal, PhieuNhapDetailModal } from '../../../components/Inventory';
import PhieuNhapEditModal from '../../../components/Inventory/PhieuNhapEditModal';
import { TrangThaiPhieuKho } from '../../../types/khoTypes';
import { useToast } from '../../../hooks/useToast';

interface PhieuNhapPageProps {}

const PhieuNhapPage: React.FC<PhieuNhapPageProps> = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedPhieuNhapId, setSelectedPhieuNhapId] = useState<string | null>(null);
  const pageSize = 10;

  // Fetch data
  const { data: phieuNhapData, loading: phieuNhapLoading, execute: fetchPhieuNhaps } = usePhieuNhaps();
  
  const { execute: deletePhieuNhap, loading: deleteLoading } = useDeletePhieuNhap();
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    fetchPhieuNhaps({
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
    fetchPhieuNhaps({
      page: 1,
      pageSize,
      search: '',
      trangThai: undefined
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const handleEdit = (phieuNhapId: string) => {
    setSelectedPhieuNhapId(phieuNhapId);
    setIsEditModalOpen(true);
  };

  const handleViewDetail = (phieuNhapId: string) => {
    setSelectedPhieuNhapId(phieuNhapId);
    setIsDetailModalOpen(true);
  };

  const handleDelete = async (phieuNhapId: string) => {
    const confirmed = window.confirm(
      'Bạn có chắc chắn muốn xóa phiếu nhập này? Hành động này không thể hoàn tác.'
    );
    
    if (confirmed) {
      try {
        await deletePhieuNhap(phieuNhapId);
        showSuccess('Thành công', 'Xóa phiếu nhập thành công!');
        fetchPhieuNhaps();
      } catch (error: any) {
        console.error('Error deleting phiếu nhập:', error);
        const errorMessage = error?.response?.data?.message || error?.message || 'Có lỗi xảy ra khi xóa phiếu nhập';
        showError('Lỗi', errorMessage);
      }
    }
  };
  
  return (
    <div className="mx-auto max-w-screen-2xl min-h-screen relative p-5">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          Quản lý Phiếu Nhập
        </h2>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center justify-center rounded-md bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90"
        >
          <i className="ri-add-line mr-2"></i>
          Thêm phiếu nhập
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
                placeholder="Tìm kiếm phiếu nhập..."
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

      {/* Phieu Nhap Table */}
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Danh sách Phiếu Nhập
          </h3>
        </div>
        <div className="p-6.5">
          {phieuNhapLoading ? (
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
                        Mã phiếu
                      </th>
                      <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                        Nhà cung cấp
                      </th>
                      <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                        Nhân viên 
                      </th>
                      <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                        Địa điểm
                      </th>
                      <th className="min-w-[100px] py-4 px-4 font-medium text-black dark:text-white">
                        Tổng tiền
                      </th>
                      <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                        Trạng thái
                      </th>
                      <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                        Ngày lập phiếu
                      </th>
                      <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {phieuNhapData?.data?.map((item: any, index: number) => (
                      <tr key={item.maPhieuNhap} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-1 dark:bg-meta-4'}>
                        <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                          <h5 className="font-medium text-black dark:text-white">
                            {item.maPhieuNhap}
                          </h5>
                        </td>
                        <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                          <h5 className="font-medium text-black dark:text-white">
                            {item.tenNhaCungCap || '-'}
                          </h5>
                        </td>
                        <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                          <h5 className="font-medium text-black dark:text-white">
                            {item.tenQuanLy || '-'}
                          </h5>
                        </td>
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                          <p className="text-black dark:text-white">
                            {item.tenDiaDiem || '-'}
                          </p>
                        </td>
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                          <p className="text-black dark:text-white">
                            {item.tongTien ? formatCurrency(item.tongTien) : '-'}
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
                          <p className="text-black dark:text-white">
                            {item.ngayNhap ? formatDate(item.ngayNhap) : '-'}
                          </p> 
                        </td>
                        <td className="border-b border-[#eee]  items-center py-5 px-4 dark:border-strokedark">
                          <div className="flex items-center justify-center space-x-3.5">
                            <button
                              onClick={() => handleViewDetail(item.maPhieuNhap)}
                              className="hover:text-primary text-gray-600"
                              title="Xem chi tiết"
                            >
                              <i className="ri-eye-line text-xl"></i>
                            </button>
                            {item.trangThai === TrangThaiPhieuKho.Pending && (
                              <>
                                <button
                              onClick={() => handleEdit(item.maPhieuNhap)}
                              className={`hover:text-primary text-gray-600`}
                              title="Chỉnh sửa"
                            >
                              <i className="ri-edit-line text-xl"></i>
                            </button>
                            <button
                              onClick={() => handleDelete(item.maPhieuNhap)}
                              className={`hover:text-danger text-gray-600`}
                              title="Xóa"
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
              {phieuNhapData && phieuNhapData.totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-gray-500">
                    Hiển thị {((currentPage - 1) * pageSize) + 1} đến {Math.min(currentPage * pageSize, phieuNhapData.totalCount)} của {phieuNhapData.totalCount} kết quả
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
                      {currentPage} / {phieuNhapData.totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, phieuNhapData.totalPages))}
                      disabled={currentPage === phieuNhapData.totalPages}
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
      <PhieuNhapCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          fetchPhieuNhaps();
          setIsCreateModalOpen(false);
        }}
      />

      {/* Edit Modal */}
      {selectedPhieuNhapId && (
        <PhieuNhapEditModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedPhieuNhapId(null);
          }}
          onSuccess={() => {
            fetchPhieuNhaps();
            setIsEditModalOpen(false);
            setSelectedPhieuNhapId(null);
          }}
          phieuNhapId={selectedPhieuNhapId}
        />
      )}

      {/* Detail Modal */}
      {selectedPhieuNhapId && (
        <PhieuNhapDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedPhieuNhapId(null);
          }}
          phieuNhapId={selectedPhieuNhapId}
        />
      )}
    </div>
  );
};

export default PhieuNhapPage;