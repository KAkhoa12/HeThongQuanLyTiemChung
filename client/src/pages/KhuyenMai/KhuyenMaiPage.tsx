import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  useKhuyenMais,
  useCreateKhuyenMai,
  useUpdateKhuyenMai,
  useDeleteKhuyenMai,
  useLoaiKhuyenMaisActive
} from '../../hooks';
import {
  type KhuyenMaiDto,
  type CreateKhuyenMaiDto,
  type UpdateKhuyenMaiDto
} from '../../services/khuyenMai.service';

const KhuyenMaiPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<KhuyenMaiDto | null>(null);
  const [formData, setFormData] = useState<CreateKhuyenMaiDto>({
    maLoaiKhuyenMai: '',
    tenKhuyenMai: '',
    code: '',
    loaiGiam: '',
    giaTriGiam: 0,
    giamToiDa: 0,
    dieuKienToiThieu: 0,
    giaTriToiThieu: 0,
    ngayBatDau: '',
    ngayKetThuc: '',
    soLuotDung: 0,
    trangThai: 'Active'
  });

  // Hooks
  const { data: khuyenMaiData, loading, error, execute: refetch } = useKhuyenMais();
  const { data: loaiKhuyenMaiData, loading: loadingLoai, execute: refetchLoai } = useLoaiKhuyenMaisActive();
  const { execute: createKhuyenMai, loading: creating } = useCreateKhuyenMai();
  const { execute: updateKhuyenMai, loading: updating } = useUpdateKhuyenMai();
  const { execute: deleteKhuyenMai, loading: deleting } = useDeleteKhuyenMai();

  // Load data when component mounts
  useEffect(() => {
    refetch({ page: 1, pageSize: 10 });
  }, []);

  // Load loai khuyen mai data when component mounts
  useEffect(() => {
    refetchLoai();
  }, []);

  // Filter data based on search term
  const filteredData = khuyenMaiData?.data?.filter(item =>
    item.tenKhuyenMai?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.tenLoaiKhuyenMai?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleCreate = async () => {
    try {
      await createKhuyenMai(formData);
      toast.success('Tạo khuyến mãi thành công!');
      setIsModalOpen(false);
      setFormData({
        maLoaiKhuyenMai: '',
        tenKhuyenMai: '',
        code: '',
        loaiGiam: '',
        giaTriGiam: 0,
        giamToiDa: 0,
        dieuKienToiThieu: 0,
        giaTriToiThieu: 0,
        ngayBatDau: '',
        ngayKetThuc: '',
        soLuotDung: 0,
        trangThai: 'Active'
      });
      refetch();
    } catch (error) {
      toast.error('Có lỗi xảy ra khi tạo khuyến mãi!');
    }
  };

  const handleUpdate = async () => {
    if (!editingItem) return;
    
    try {
      await updateKhuyenMai({
        id: editingItem.maKhuyenMai,
        data: formData as UpdateKhuyenMaiDto
      });
      toast.success('Cập nhật khuyến mãi thành công!');
      setIsModalOpen(false);
      setEditingItem(null);
      setFormData({
        maLoaiKhuyenMai: '',
        tenKhuyenMai: '',
        code: '',
        loaiGiam: '',
        giaTriGiam: 0,
        giamToiDa: 0,
        dieuKienToiThieu: 0,
        giaTriToiThieu: 0,
        ngayBatDau: '',
        ngayKetThuc: '',
        soLuotDung: 0,
        trangThai: 'Active'
      });
      refetch();
    } catch (error) {
      toast.error('Có lỗi xảy ra khi cập nhật khuyến mãi!');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa khuyến mãi này?')) {
      try {
        await deleteKhuyenMai(id);
        toast.success('Xóa khuyến mãi thành công!');
        refetch();
      } catch (error) {
        toast.error('Có lỗi xảy ra khi xóa khuyến mãi!');
      }
    }
  };

  const openEditModal = (item: KhuyenMaiDto) => {
    setEditingItem(item);
    setFormData({
      maLoaiKhuyenMai: item.maLoaiKhuyenMai || '',
      tenKhuyenMai: item.tenKhuyenMai || '',
      code: item.code || '',
      loaiGiam: item.loaiGiam || '',
      giaTriGiam: item.giaTriGiam || 0,
      giamToiDa: item.giamToiDa || 0,
      dieuKienToiThieu: item.dieuKienToiThieu || 0,
      giaTriToiThieu: item.giaTriToiThieu || 0,
      ngayBatDau: item.ngayBatDau || '',
      ngayKetThuc: item.ngayKetThuc || '',
      soLuotDung: item.soLuotDung || 0,
      trangThai: item.trangThai || 'Active'
    });
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({
      maLoaiKhuyenMai: '',
      tenKhuyenMai: '',
      code: '',
      loaiGiam: '',
      giaTriGiam: 0,
      giamToiDa: 0,
      dieuKienToiThieu: 0,
      giaTriToiThieu: 0,
      ngayBatDau: '',
      ngayKetThuc: '',
      soLuotDung: 0,
      trangThai: 'Active'
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setFormData({
      maLoaiKhuyenMai: '',
      tenKhuyenMai: '',
      code: '',
      loaiGiam: '',
      giaTriGiam: 0,
      giamToiDa: 0,
      dieuKienToiThieu: 0,
      giaTriToiThieu: 0,
      ngayBatDau: '',
      ngayKetThuc: '',
      soLuotDung: 0,
      trangThai: 'Active'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('vi-VN');
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
          Quản lý Khuyến mãi
        </h2>
        <div className="flex gap-2">
          <Link
            to="/dashboard/khuyen-mai/loai"
            className="inline-flex items-center justify-center rounded-md bg-meta-3 py-2 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
          >
            <i className="ri-settings-3-line mr-2"></i>
            Quản lý loại
          </Link>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center justify-center rounded-md bg-primary py-2 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
          >
            <i className="ri-add-line mr-2"></i>
            Thêm khuyến mãi
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="mb-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Tìm kiếm khuyến mãi..."
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
                  Mã khuyến mãi
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                  Tên khuyến mãi
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                  Mã code
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                  Loại khuyến mãi
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                  Giá trị giảm
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                  Giá trị tối thiểu
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                  Ngày hiệu lực
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
                  <td colSpan={9} className="text-center py-4">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      <span className="ml-2">Đang tải...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-4 text-bodydark2">
                    Không có dữ liệu
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => (
                  <tr key={item.maKhuyenMai}>
                    <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                      <h5 className="font-medium text-black dark:text-white">
                        {item.maKhuyenMai}
                      </h5>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">{item.tenKhuyenMai}</p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white font-mono">{item.code}</p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">{item.tenLoaiKhuyenMai}</p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {item.loaiGiam === 'Percent' ? `${item.giaTriGiam}%` : formatCurrency(item.giaTriGiam || 0)}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {formatCurrency(item.giaTriToiThieu || 0)}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {formatDate(item.ngayBatDau || '')} - {formatDate(item.ngayKetThuc || '')}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <span className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${
                        item.trangThai === 'Active' 
                          ? 'bg-success text-success' 
                          : 'bg-danger text-danger'
                      }`}>
                        {item.trangThai === 'Active' ? 'Hoạt động' : 'Không hoạt động'}
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
                          onClick={() => handleDelete(item.maKhuyenMai)}
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
        <div className="fixed inset-0 z-999 flex items-center justify-center bg-black bg-opacity-40 p-4">
          <div className="w-full max-w-2xl max-h-[90vh] rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark flex flex-col">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark flex-shrink-0">
              <h3 className="font-medium text-black dark:text-white">
                {editingItem ? 'Cập nhật khuyến mãi' : 'Thêm khuyến mãi mới'}
              </h3>
            </div>
            <div className="p-6.5 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Loại khuyến mãi <span className="text-meta-1">*</span>
                  </label>
                  <select
                    value={formData.maLoaiKhuyenMai}
                    onChange={(e) => setFormData({ ...formData, maLoaiKhuyenMai: e.target.value })}
                    disabled={loadingLoai}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  >
                    <option value="">
                      {loadingLoai ? 'Đang tải...' : 'Chọn loại khuyến mãi'}
                    </option>
                    {loaiKhuyenMaiData?.map((loai) => (
                      <option key={loai.maLoaiKhuyenMai} value={loai.maLoaiKhuyenMai}>
                        {loai.tenLoai}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Tên khuyến mãi <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Nhập tên khuyến mãi"
                    value={formData.tenKhuyenMai}
                    onChange={(e) => setFormData({ ...formData, tenKhuyenMai: e.target.value })}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Mã code <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Nhập mã code"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Loại giảm <span className="text-meta-1">*</span>
                  </label>
                  <select
                    value={formData.loaiGiam}
                    onChange={(e) => setFormData({ ...formData, loaiGiam: e.target.value })}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  >
                    <option value="">Chọn loại giảm</option>
                    <option value="Percent">Phần trăm (%)</option>
                    <option value="Amount">Số tiền (VNĐ)</option>
                  </select>
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Giá trị giảm <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="number"
                    placeholder="Nhập giá trị giảm"
                    value={formData.giaTriGiam}
                    onChange={(e) => setFormData({ ...formData, giaTriGiam: Number(e.target.value) })}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Giảm tối đa
                  </label>
                  <input
                    type="number"
                    placeholder="Nhập giảm tối đa"
                    value={formData.giamToiDa}
                    onChange={(e) => setFormData({ ...formData, giamToiDa: Number(e.target.value) })}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Điều kiện tối thiểu
                  </label>
                  <input
                    type="number"
                    placeholder="Nhập điều kiện tối thiểu"
                    value={formData.dieuKienToiThieu}
                    onChange={(e) => setFormData({ ...formData, dieuKienToiThieu: Number(e.target.value) })}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Giá trị tối thiểu <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="number"
                    placeholder="Nhập giá trị tối thiểu"
                    value={formData.giaTriToiThieu}
                    onChange={(e) => setFormData({ ...formData, giaTriToiThieu: Number(e.target.value) })}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Số lượt sử dụng
                  </label>
                  <input
                    type="number"
                    placeholder="Nhập số lượt sử dụng"
                    value={formData.soLuotDung}
                    onChange={(e) => setFormData({ ...formData, soLuotDung: Number(e.target.value) })}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Ngày bắt đầu <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.ngayBatDau}
                    onChange={(e) => setFormData({ ...formData, ngayBatDau: e.target.value })}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Ngày kết thúc <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.ngayKetThuc}
                    onChange={(e) => setFormData({ ...formData, ngayKetThuc: e.target.value })}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Trạng thái
                  </label>
                  <select
                    value={formData.trangThai}
                    onChange={(e) => setFormData({ ...formData, trangThai: e.target.value })}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  >
                    <option value="Active">Hoạt động</option>
                    <option value="Inactive">Không hoạt động</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4 mt-6 flex-shrink-0">
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

export default KhuyenMaiPage; 