import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  useLoaiKhuyenMais,
  useCreateLoaiKhuyenMai,
  useUpdateLoaiKhuyenMai,
  useDeleteLoaiKhuyenMai
} from '../../hooks';
import {
  type LoaiKhuyenMaiDto,
  type CreateLoaiKhuyenMaiDto,
  type UpdateLoaiKhuyenMaiDto
} from '../../services/loaiKhuyenMai.service';

const LoaiKhuyenMaiPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<LoaiKhuyenMaiDto | null>(null);
  const [formData, setFormData] = useState<CreateLoaiKhuyenMaiDto>({
    tenLoai: '',
    moTa: ''
  });

  // Hooks
  const { data: loaiKhuyenMaiData, loading, error, execute: refetch } = useLoaiKhuyenMais();
  const { execute: createLoaiKhuyenMai, loading: creating } = useCreateLoaiKhuyenMai();
  const { execute: updateLoaiKhuyenMai, loading: updating } = useUpdateLoaiKhuyenMai();
  const { execute: deleteLoaiKhuyenMai, loading: deleting } = useDeleteLoaiKhuyenMai();

  // Load data when component mounts
  useEffect(() => {
    refetch({ page: 1, pageSize: 10 });
  }, []);

  // Filter data based on search term
  const filteredData = loaiKhuyenMaiData?.data?.filter(item =>
    item.tenLoai?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.moTa?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleCreate = async () => {
    try {
      await createLoaiKhuyenMai(formData);
      toast.success('Tạo loại khuyến mãi thành công!');
      setIsModalOpen(false);
      setFormData({ tenLoai: '', moTa: '' });
      refetch();
    } catch (error) {
      toast.error('Có lỗi xảy ra khi tạo loại khuyến mãi!');
    }
  };

  const handleUpdate = async () => {
    if (!editingItem) return;
    
    try {
      await updateLoaiKhuyenMai({
        id: editingItem.maLoaiKhuyenMai,
        data: formData as UpdateLoaiKhuyenMaiDto
      });
      toast.success('Cập nhật loại khuyến mãi thành công!');
      setIsModalOpen(false);
      setEditingItem(null);
      setFormData({ tenLoai: '', moTa: '' });
      refetch();
    } catch (error) {
      toast.error('Có lỗi xảy ra khi cập nhật loại khuyến mãi!');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa loại khuyến mãi này?')) {
      try {
        await deleteLoaiKhuyenMai(id);
        toast.success('Xóa loại khuyến mãi thành công!');
        refetch();
      } catch (error) {
        toast.error('Có lỗi xảy ra khi xóa loại khuyến mãi!');
      }
    }
  };

  const openEditModal = (item: LoaiKhuyenMaiDto) => {
    setEditingItem(item);
    setFormData({
      tenLoai: item.tenLoai || '',
      moTa: item.moTa || ''
    });
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({ tenLoai: '', moTa: '' });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setFormData({ tenLoai: '', moTa: '' });
  };

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Có lỗi xảy ra khi tải dữ liệu: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          Quản lý Loại khuyến mãi
        </h2>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center rounded-md bg-primary py-2 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
        >
          <i className="ri-add-line mr-2"></i>
          Thêm loại khuyến mãi
        </button>
      </div>

      {/* Search and Filter */}
      <div className="mb-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Tìm kiếm loại khuyến mãi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-stroke bg-transparent py-2 pl-10 pr-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary md:w-80"
            />
            <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-bodydark2"></i>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                  Mã loại
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                  Tên loại
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                  Mô tả
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                  Trạng thái
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-4">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      <span className="ml-2">Đang tải...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-bodydark2">
                    Không có dữ liệu
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => (
                  <tr key={item.maLoaiKhuyenMai}>
                    <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                      <h5 className="font-medium text-black dark:text-white">
                        {item.maLoaiKhuyenMai}
                      </h5>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">{item.tenLoai}</p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">{item.moTa}</p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <span className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${
                        item.isActive 
                          ? 'bg-success text-success' 
                          : 'bg-danger text-danger'
                      }`}>
                        {item.isActive ? 'Hoạt động' : 'Không hoạt động'}
                      </span>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <div className="flex items-center space-x-3.5">
                        <button
                          onClick={() => openEditModal(item)}
                          className="hover:text-primary"
                        >
                          <i className="ri-edit-line text-lg"></i>
                        </button>
                        <button
                          onClick={() => handleDelete(item.maLoaiKhuyenMai)}
                          className="hover:text-danger"
                          disabled={deleting}
                        >
                          <i className="ri-delete-bin-line text-lg"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-999 flex items-center justify-center bg-black bg-opacity-40">
          <div className="w-full max-w-md rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                {editingItem ? 'Cập nhật loại khuyến mãi' : 'Thêm loại khuyến mãi mới'}
              </h3>
            </div>
            <div className="p-6.5">
              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Tên loại <span className="text-meta-1">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Nhập tên loại khuyến mãi"
                  value={formData.tenLoai}
                  onChange={(e) => setFormData({ ...formData, tenLoai: e.target.value })}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
              </div>

              <div className="mb-6">
                <label className="mb-2.5 block text-black dark:text-white">
                  Mô tả
                </label>
                <textarea
                  rows={4}
                  placeholder="Nhập mô tả"
                  value={formData.moTa}
                  onChange={(e) => setFormData({ ...formData, moTa: e.target.value })}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={editingItem ? handleUpdate : handleCreate}
                  disabled={creating || updating}
                  className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                >
                  {creating || updating ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Đang xử lý...
                    </div>
                  ) : (
                    editingItem ? 'Cập nhật' : 'Thêm mới'
                  )}
                </button>
                <button
                  onClick={closeModal}
                  className="flex w-full justify-center rounded border border-stroke bg-gray p-3 font-medium text-black transition hover:shadow-1 dark:border-strokedark dark:bg-meta-4 dark:text-white dark:hover:shadow-1"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoaiKhuyenMaiPage; 