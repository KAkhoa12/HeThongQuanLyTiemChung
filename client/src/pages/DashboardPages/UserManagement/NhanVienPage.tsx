import { useState, useEffect } from 'react';
import { useNhanViens, useDeleteNhanVien, useToggleNhanVienStatus } from '../../../hooks/useNhanVien';
import { useToast } from '../../../hooks/useToast';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import { NhanVien } from '../../../services/nhanVien.service';
import { useNavigate } from 'react-router-dom';

const NhanVienPage = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isActiveFilter, setIsActiveFilter] = useState<boolean | undefined>(undefined);
  const [chucVuFilter, setChucVuFilter] = useState<string>('');

  const { data: nhanViensData, loading, execute: fetchNhanViens } = useNhanViens();
  const { execute: deleteNhanVien } = useDeleteNhanVien();
  const { execute: toggleStatus } = useToggleNhanVienStatus();

  useEffect(() => {
    fetchNhanViens({
      page: currentPage,
      pageSize,
      search: searchTerm || undefined,
      isActive: isActiveFilter,
      chucVu: chucVuFilter || undefined
    });
  }, [currentPage, pageSize, searchTerm, isActiveFilter, chucVuFilter]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa nhân viên này?')) {
      try {
        await deleteNhanVien({ id });
        showSuccess('Thành công', 'Xóa nhân viên thành công');  
        fetchNhanViens({
          page: currentPage,
          pageSize,
          search: searchTerm || undefined,
          isActive: isActiveFilter,
          chucVu: chucVuFilter || undefined
        });
      } catch (error) {
        showError('Lỗi', 'Lỗi khi xóa nhân viên');
      }
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await toggleStatus({ id });
      showSuccess('Thành công', 'Thay đổi trạng thái thành công');
      fetchNhanViens({
        page: currentPage,
        pageSize,
        search: searchTerm || undefined,
        isActive: isActiveFilter,
        chucVu: chucVuFilter || undefined
      });
    } catch (error) {
      showError('Lỗi', 'Lỗi khi thay đổi trạng thái');
    }
  };

  const columns = [
    {
      key: 'ten',
      header: 'Tên',
      render: (record: NhanVien) => (
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full">
            <img
              src={record.maAnh || '/images/user/user-06.png'}
              alt={record.ten}
              className="h-12 w-12 rounded-full object-cover"
            />
          </div>
          <div>
            <h5 className="font-medium text-black dark:text-white">
              {record.ten}
            </h5>
            <p className="text-sm text-bodydark2">{record.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'chucVu',
      header: 'Chức vụ',
      render: (record: NhanVien) => record.chucVu || 'Chưa cập nhật',
    },
    {
      key: 'tenDiaDiem',
      header: 'Địa điểm',
      render: (record: NhanVien) => record.tenDiaDiem || 'Chưa cập nhật',
    },
    {
      key: 'soDienThoai',
      header: 'Số điện thoại',
      render: (record: NhanVien) => record.soDienThoai || 'Chưa cập nhật',
    },
    {
      key: 'isActive',
      header: 'Trạng thái',
      render: (record: NhanVien) => (
        <span
          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
            record.isActive
              ? 'bg-success/10 text-success'
              : 'bg-danger/10 text-danger'
          }`}
        >
          {record.isActive ? 'Hoạt động' : 'Không hoạt động'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Thao tác',
      render: (record: NhanVien) => (
        <div className="flex items-center gap-2">
          <button
              onClick={() => navigate(`/dashboard/nguoi-dung/nhan-vien/${record.maNhanVien}`)}
            className="text-primary hover:text-primary/80"
            title="Xem chi tiết"
          >
            <i className="ri-eye-line text-lg"></i>
          </button>
          <button
            onClick={() => navigate(`/dashboard/nguoi-dung/nhan-vien/${record.maNhanVien}/edit`)}
            className="text-warning hover:text-warning/80"
            title="Chỉnh sửa"
          >
            <i className="ri-edit-line text-lg"></i>
          </button>
          <button
            onClick={() => handleToggleStatus(record.maNhanVien)}
            className={`${record.isActive ? 'text-danger' : 'text-success'} hover:opacity-80`}
            title={record.isActive ? 'Vô hiệu hóa' : 'Kích hoạt'}
          >
            <i className={`ri-${record.isActive ? 'close' : 'check'}-line text-lg`}></i>
          </button>
          <button
            onClick={() => handleDelete(record.maNhanVien)}
            className="text-danger hover:text-danger/80"
            title="Xóa"
          >
            <i className="ri-delete-bin-line text-lg"></i>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className='p-6'>
      <Breadcrumb pageName="Quản lý nhân viên" />

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="px-4 py-6 md:px-6 xl:px-7.5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h4 className="text-xl font-semibold text-black dark:text-white">
              Danh sách nhân viên
            </h4>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-black dark:text-white">
                  Chức vụ:
                </label>
                <input
                  type="text"
                  placeholder="Lọc theo chức vụ"
                  value={chucVuFilter}
                  onChange={(e) => {
                    setChucVuFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="rounded border border-stroke bg-transparent px-3 py-1 text-sm outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-black dark:text-white">
                  Trạng thái:
                </label>
                <select
                  value={isActiveFilter === undefined ? '' : isActiveFilter.toString()}
                  onChange={(e) => {
                    const value = e.target.value;
                    setIsActiveFilter(value === '' ? undefined : value === 'true');
                    setCurrentPage(1);
                  }}
                  className="rounded border border-stroke bg-transparent px-3 py-1 text-sm outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                >
                  <option value="">Tất cả</option>
                  <option value="true">Hoạt động</option>
                  <option value="false">Không hoạt động</option>
                </select>
              </div>
              <button
                onClick={() => window.open('/dashboard/nguoi-dung/nhan-vien/create', '_blank')}
                className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-center font-medium text-white hover:bg-opacity-90"
              >
                <i className="ri-add-line mr-2"></i>
                Thêm nhân viên
              </button>
            </div>
          </div>
        </div>

        {/* Search and filters */}
        <div className="px-4 py-4 border-b border-stroke dark:border-strokedark">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên, email, số điện thoại, chức vụ..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full rounded border border-stroke bg-transparent px-4 py-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary sm:w-80"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                {columns.map((column) => (
                  <th key={column.key} className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-8 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  </td>
                </tr>
              ) : nhanViensData?.data && nhanViensData.data.length > 0 ? (
                nhanViensData.data.map((record, index) => (
                  <tr key={record.maNhanVien} className={index % 2 === 0 ? 'bg-white dark:bg-boxdark' : 'bg-gray-2 dark:bg-meta-4'}>
                    {columns.map((column) => (
                      <td key={column.key} className="border-b border-stroke px-4 py-4 dark:border-strokedark">
                        {column.render ? column.render(record) : String(record[column.key as keyof NhanVien] || '')}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-8 text-center text-bodydark2">
                    Không có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {nhanViensData && nhanViensData.totalCount > 0 && (
          <div className="px-4 py-4 border-t border-stroke dark:border-strokedark">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-bodydark2">
                Hiển thị {((currentPage - 1) * pageSize) + 1} đến {Math.min(currentPage * pageSize, nhanViensData.totalCount)} của {nhanViensData.totalCount} kết quả
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="rounded border border-stroke bg-transparent px-3 py-1 text-sm outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                >
                  <option value={10}>10 / trang</option>
                  <option value={20}>20 / trang</option>
                  <option value={50}>50 / trang</option>
                  <option value={100}>100 / trang</option>
                </select>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className="rounded border border-stroke bg-white px-3 py-1 text-sm hover:bg-gray-50 disabled:opacity-50 dark:border-strokedark dark:bg-boxdark dark:hover:bg-meta-4"
                  >
                    Đầu
                  </button>
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="rounded border border-stroke bg-white px-3 py-1 text-sm hover:bg-gray-50 disabled:opacity-50 dark:border-strokedark dark:bg-boxdark dark:hover:bg-meta-4"
                  >
                    Trước
                  </button>
                  <span className="px-3 py-1 text-sm">
                    Trang {currentPage} / {nhanViensData.totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === nhanViensData.totalPages}
                    className="rounded border border-stroke bg-white px-3 py-1 text-sm hover:bg-gray-50 disabled:opacity-50 dark:border-strokedark dark:bg-boxdark dark:hover:bg-meta-4"
                  >
                    Sau
                  </button>
                  <button
                    onClick={() => setCurrentPage(nhanViensData.totalPages)}
                    disabled={currentPage === nhanViensData.totalPages}
                    className="rounded border border-stroke bg-white px-3 py-1 text-sm hover:bg-gray-50 disabled:opacity-50 dark:border-strokedark dark:bg-boxdark dark:hover:bg-meta-4"
                  >
                    Cuối
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NhanVienPage;