import React, { useState, useEffect } from 'react';
import { useNhaCungCaps, useDeleteNhaCungCap } from '../../../hooks';
import { NhaCungCapDto } from '../../../services/nhaCungCap.service';
import { NhaCungCapCreateModal, NhaCungCapEditModal } from '../../../components/NhaCungCap';

interface NhaCungCapPageProps {}

const NhaCungCapPage: React.FC<NhaCungCapPageProps> = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedNhaCungCap, setSelectedNhaCungCap] = useState<NhaCungCapDto | null>(null);
  const pageSize = 10;

  // Fetch data
  const { data: nhaCungCapData, loading: nhaCungCapLoading, execute: fetchNhaCungCaps } = useNhaCungCaps({
    page: currentPage,
    pageSize,
    search: searchTerm
  });

  const { execute: deleteNhaCungCap, loading: deleteLoading } = useDeleteNhaCungCap();

  useEffect(() => {
    fetchNhaCungCaps();
  }, [currentPage, searchTerm]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleEdit = (nhaCungCap: NhaCungCapDto) => {
    setSelectedNhaCungCap(nhaCungCap);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa nhà cung cấp này?')) {
      try {
        await deleteNhaCungCap(id);
        fetchNhaCungCaps();
        alert('Xóa nhà cung cấp thành công');
      } catch (error) {
        console.error('Error deleting nha cung cap:', error);
        alert('Có lỗi xảy ra khi xóa nhà cung cấp');
      }
    }
  };

  const handleCreateSuccess = () => {
    fetchNhaCungCaps();
  };

  const handleEditSuccess = () => {
    fetchNhaCungCaps();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          Quản lý Nhà cung cấp
        </h2>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center justify-center rounded-md bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90"
        >
          <i className="ri-add-line mr-2"></i>
          Thêm nhà cung cấp
        </button>
      </div>

      {/* Search and Filter */}
      <div className="mb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm nhà cung cấp..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2">
                <i className="ri-search-line text-gray-400"></i>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="px-4 py-6 md:px-6 xl:px-7.5">
          <h4 className="text-xl font-semibold text-black dark:text-white">
            Danh sách nhà cung cấp
          </h4>
        </div>

        <div className="grid grid-cols-1 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
          <div className="col-span-1 flex items-center">
            <p className="font-medium">Tên nhà cung cấp</p>
          </div>
          <div className="col-span-1 flex items-center">
            <p className="font-medium">Người liên hệ</p>
          </div>
          <div className="col-span-1 flex items-center">
            <p className="font-medium">Số điện thoại</p>
          </div>
          <div className="col-span-2 flex items-center">
            <p className="font-medium">Địa chỉ</p>
          </div>
          <div className="col-span-1 flex items-center">
            <p className="font-medium">Ngày tạo</p>
          </div>
          <div className="col-span-1 flex items-center">
            <p className="font-medium">Trạng thái</p>
          </div>
          <div className="col-span-1 flex items-center">
            <p className="font-medium">Thao tác</p>
          </div>
        </div>

        {nhaCungCapLoading ? (
          <div className="flex items-center justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {nhaCungCapData?.data && nhaCungCapData.data.length > 0 ? (
              nhaCungCapData.data.map((nhaCungCap) => (
                <div
                  key={nhaCungCap.maNhaCungCap}
                  className="grid grid-cols-1 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
                >
                  <div className="col-span-1 flex items-center">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                      <div className="h-12.5 w-15 rounded-md">
                        {nhaCungCap.urlAnh ? (
                          <img
                            src={nhaCungCap.urlAnh}
                            alt={nhaCungCap.ten}
                            className="h-full w-full rounded-md object-cover"
                          />
                        ) : (
                          <div className="h-full w-full rounded-md bg-gray-200 flex items-center justify-center">
                            <i className="ri-building-line text-gray-400 text-xl"></i>
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-black dark:text-white">
                        {nhaCungCap.ten}
                      </p>
                    </div>
                  </div>
                  <div className="col-span-1 flex items-center">
                    <p className="text-sm text-black dark:text-white">
                      {nhaCungCap.nguoiLienHe || '-'}
                    </p>
                  </div>
                  <div className="col-span-1 flex items-center">
                    <p className="text-sm text-black dark:text-white">
                      {nhaCungCap.soDienThoai || '-'}
                    </p>
                  </div>
                  <div className="col-span-2 flex items-center">
                    <p className="text-sm text-black dark:text-white">
                      {nhaCungCap.diaChi || '-'}
                    </p>
                  </div>
                  <div className="col-span-1 flex items-center">
                    <p className="text-sm text-black dark:text-white">
                      {nhaCungCap.ngayTao ? formatDate(nhaCungCap.ngayTao) : '-'}
                    </p>
                  </div>
                  <div className="col-span-1 flex items-center">
                    <span
                      className={`inline-flex rounded-full py-1 px-2 text-xs font-medium ${
                        nhaCungCap.isActive
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                      }`}
                    >
                      {nhaCungCap.isActive ? 'Hoạt động' : 'Không hoạt động'}
                    </span>
                  </div>
                  <div className="col-span-1 flex items-center">
                    <div className="flex items-center space-x-3.5">
                      <button
                        onClick={() => handleEdit(nhaCungCap)}
                        className="hover:text-primary"
                        title="Chỉnh sửa"
                      >
                        <i className="ri-edit-line text-lg"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(nhaCungCap.maNhaCungCap)}
                        className="hover:text-red-500"
                        title="Xóa"
                        disabled={deleteLoading}
                      >
                        <i className="ri-delete-bin-line text-lg"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center py-10">
                <div className="text-center">
                  <i className="ri-building-line text-4xl text-gray-400 mb-4"></i>
                  <p className="text-gray-500">Không có nhà cung cấp nào</p>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Pagination */}
      {nhaCungCapData && nhaCungCapData.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-stroke bg-white px-4 py-3 dark:border-strokedark dark:bg-boxdark sm:px-6">
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Trước
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(nhaCungCapData.totalPages, currentPage + 1))}
              disabled={currentPage === nhaCungCapData.totalPages}
              className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Sau
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Hiển thị{' '}
                <span className="font-medium">
                  {(currentPage - 1) * pageSize + 1}
                </span>{' '}
                đến{' '}
                <span className="font-medium">
                  {Math.min(currentPage * pageSize, nhaCungCapData.totalCount)}
                </span>{' '}
                trong tổng số{' '}
                <span className="font-medium">{nhaCungCapData.totalCount}</span>{' '}
                kết quả
              </p>
            </div>
            <div>
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                >
                  <i className="ri-arrow-left-s-line text-lg"></i>
                </button>
                {Array.from({ length: Math.min(5, nhaCungCapData.totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                        currentPage === page
                          ? 'z-10 bg-primary text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
                          : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
                <button
                  onClick={() => setCurrentPage(Math.min(nhaCungCapData.totalPages, currentPage + 1))}
                  disabled={currentPage === nhaCungCapData.totalPages}
                  className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                >
                  <i className="ri-arrow-right-s-line text-lg"></i>
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Create Modal */}
      <NhaCungCapCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />

      {/* Edit Modal */}
      <NhaCungCapEditModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedNhaCungCap(null);
        }}
        onSuccess={handleEditSuccess}
        nhaCungCap={selectedNhaCungCap}
      />
    </div>
  );
};

export default NhaCungCapPage;