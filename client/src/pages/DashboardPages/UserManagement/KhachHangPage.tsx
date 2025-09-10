import { useState, useEffect } from 'react';
import { useKhachHangs, useDeleteKhachHang, useToggleKhachHangStatus } from '../../../hooks/useKhachHang';
import { useToast } from '../../../hooks/useToast';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import { KhachHang } from '../../../services/khachHang.service';
import { useNavigate } from 'react-router-dom';

const KhachHangPage = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isActiveFilter, setIsActiveFilter] = useState<boolean | undefined>(undefined);

  const { data: khachHangsData, loading, execute: fetchKhachHangs } = useKhachHangs();
  const { execute: deleteKhachHang } = useDeleteKhachHang();
  const { execute: toggleStatus } = useToggleKhachHangStatus();

  useEffect(() => {
    fetchKhachHangs({
      page: currentPage,
      pageSize,
      search: searchTerm || undefined,
      isActive: isActiveFilter
    });
  }, [currentPage, pageSize, searchTerm, isActiveFilter]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa khách hàng này?')) {
      try {
        await deleteKhachHang({ id });
        showSuccess("thành công", "Xóa khách hàng thành công");
        fetchKhachHangs({
          page: currentPage,
          pageSize,
          search: searchTerm || undefined,
          isActive: isActiveFilter
        });
      } catch (error) {
        showError("Lỗi", "Lỗi khi xóa khách hàng");
      }
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await toggleStatus({ id });
      showSuccess("thành công", "Thay đổi trạng thái thành công");
      fetchKhachHangs({
        page: currentPage,
        pageSize,
        search: searchTerm || undefined,
        isActive: isActiveFilter
      });
    } catch (error) {
      showError("Lỗi", "Lỗi khi thay đổi trạng thái");
    }
  };

  const columns = [
    {
      key: 'ten',
      header: 'Tên',
      render: (_: any, record: KhachHang) => (
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
      key: 'soDienThoai',
      header: 'Số điện thoại',
      render: (_: any, record: KhachHang) => record.soDienThoai || 'Chưa cập nhật',
    },
    {
      key: 'ngaySinh',
      header: 'Ngày sinh',
      render: (_: any, record: KhachHang) => record.ngaySinh || 'Chưa cập nhật',
    },
    {
      key: 'gioiTinh',
      header: 'Giới tính',
      render: (_: any, record: KhachHang) => record.gioiTinh || 'Chưa cập nhật',
    },
    {
      key: 'isActive',
      header: 'Trạng thái',
      render: (_: any, record: KhachHang) => (
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
      render: (_: any, record: KhachHang) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/dashboard/nguoi-dung/khach-hang/${record.maNguoiDung}`)}
            className="text-primary hover:text-primary/80"
            title="Xem chi tiết"
          >
            <i className="ri-eye-line text-lg"></i>
          </button>
          <button
            onClick={() => navigate(`/dashboard/nguoi-dung/khach-hang/${record.maNguoiDung}/edit`)}
            className="text-warning hover:text-warning/80"
            title="Chỉnh sửa"
          >
            <i className="ri-edit-line text-lg"></i>
          </button>
          <button
            onClick={() => handleToggleStatus(record.maNguoiDung)}
            className={`${record.isActive ? 'text-danger' : 'text-success'} hover:opacity-80`}
            title={record.isActive ? 'Vô hiệu hóa' : 'Kích hoạt'}
          >
            <i className={`ri-${record.isActive ? 'close' : 'check'}-line text-lg`}></i>
          </button>
          <button
            onClick={() => handleDelete(record.maNguoiDung)}
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
      <Breadcrumb pageName="Quản lý khách hàng" />

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="px-4 py-6 md:px-6 xl:px-7.5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h4 className="text-xl font-semibold text-black dark:text-white">
              Danh sách khách hàng
            </h4>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
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
                onClick={() => window.open('/dashboard/nguoi-dung/khach-hang/create', '_blank')}
                className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-center font-medium text-white hover:bg-opacity-90"
              >
                <i className="ri-add-line mr-2"></i>
                Thêm khách hàng
              </button>
            </div>
          </div>
        </div>

        <div className="px-4 py-6 md:px-6 xl:px-7.5">
          {/* Search and filters */}
          <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên, email, số điện thoại..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full rounded border border-stroke bg-transparent px-4 py-2 pl-9 text-sm outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary sm:w-80"
                />
                <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-bodydark2"></i>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="max-w-full overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                  {columns.map((column, index) => (
                    <th
                      key={column.key as string}
                      className={`min-w-[120px] py-4 px-4 font-medium text-black dark:text-white ${
                        index === 0 ? 'xl:pl-11' : ''
                      }`}
                    >
                      {column.header}
                    </th>
                  ))}
                </tr>
              </thead>
              
              <tbody>
                {loading ? (
                  <tr>
                    <td 
                      colSpan={columns.length}
                      className="py-12 text-center text-gray-500 dark:text-gray-400"
                    >
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        <span className="ml-3">Đang tải...</span>
                      </div>
                    </td>
                  </tr>
                ) : (khachHangsData?.data || []).length === 0 ? (
                  <tr>
                    <td 
                      colSpan={columns.length}
                      className="py-12 text-center text-gray-500 dark:text-gray-400"
                    >
                      Không có dữ liệu
                    </td>
                  </tr>
                ) : (
                  (khachHangsData?.data || []).map((record, index) => (
                    <tr
                      key={record.maNguoiDung}
                      className={`${
                        index % 2 === 1 ? 'bg-gray-50 dark:bg-boxdark-2' : ''
                      } hover:bg-gray-100 dark:hover:bg-boxdark-3`}
                    >
                      {columns.map((column, colIndex) => (
                        <td
                          key={column.key as string}
                          className={`border-b border-[#eee] px-4 py-5 dark:border-strokedark ${
                            colIndex === 0 ? 'pl-9 xl:pl-11' : ''
                          }`}
                        >
                          {column.render ? column.render(record[column.key as keyof KhachHang], record) : String(record[column.key as keyof KhachHang] || '')}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {khachHangsData && khachHangsData.totalCount > 0 && (
            <div className="mt-4 flex flex-col items-center justify-between gap-4 sm:flex-row">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Hiển thị {((currentPage - 1) * pageSize) + 1} đến {Math.min(currentPage * pageSize, khachHangsData.totalCount)} trong tổng số {khachHangsData.totalCount} bản ghi
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
                    className="rounded border border-stroke bg-transparent px-3 py-1 text-sm outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary disabled:opacity-50"
                  >
                    <i className="ri-arrow-left-s-line"></i>
                  </button>
                  
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="rounded border border-stroke bg-transparent px-3 py-1 text-sm outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary disabled:opacity-50"
                  >
                    Trước
                  </button>
                  
                  <span className="px-3 py-1 text-sm">
                    Trang {currentPage} / {khachHangsData.totalPages}
                  </span>
                  
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === khachHangsData.totalPages}
                    className="rounded border border-stroke bg-transparent px-3 py-1 text-sm outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary disabled:opacity-50"
                  >
                    Sau
                  </button>
                  
                  <button
                    onClick={() => setCurrentPage(khachHangsData.totalPages)}
                    disabled={currentPage === khachHangsData.totalPages}
                    className="rounded border border-stroke bg-transparent px-3 py-1 text-sm outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary disabled:opacity-50"
                  >
                    <i className="ri-arrow-right-s-line"></i>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KhachHangPage;