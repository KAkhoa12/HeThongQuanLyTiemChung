import React, { useState, useEffect } from 'react';
import CardDataStats from '../../components/CardDataStats';
import DataTable from '../../components/Tables/DataTable';
import { usePhieuDangKyLichTiemByUser, usePhieuDangKyLichTiems, useApprovePhieuDangKyLichTiem, useDeletePhieuDangKyLichTiem } from '../../hooks';
import { PhieuDangKyLichTiem, ApproveAppointmentDto } from '../../services/phieuDangKyLichTiem.service';
import { useToast } from '../../hooks';
import { useAuthStore } from '../../store/useAuthStore';

const PhieuDangKyTiemChungPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedAppointment, setSelectedAppointment] = useState<PhieuDangKyLichTiem | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState<ApproveAppointmentDto>({
    status: 'Approved',
    reason: ''
  });

  // Lấy thông tin người dùng hiện tại
  const { user, fetchCurrentUser } = useAuthStore();
  const currentUserId = user?.maNguoiDung;

  // Sử dụng hook khác nhau tùy theo role
  const { data: userAppointmentsData, loading: userLoading, error: userError, execute: refetchUser } = usePhieuDangKyLichTiemByUser();
  const { data: allAppointmentsData, loading: allLoading, error: allError, execute: refetchAll } = usePhieuDangKyLichTiems();
  const { execute: approveAppointment, loading: isApproving } = useApprovePhieuDangKyLichTiem();
  const { execute: deleteAppointment, loading: isDeleting } = useDeletePhieuDangKyLichTiem();
  const { showSuccess, showError } = useToast();

  // Xác định data, loading, error và refetch function dựa trên role
  const isAdminRole = user?.role === 'DOCTOR' || user?.role === 'MANAGER';
  const appointmentsData = isAdminRole ? allAppointmentsData : userAppointmentsData;
  const loading = isAdminRole ? allLoading : userLoading;
  const error = isAdminRole ? allError : userError;
  const refetch = isAdminRole ? refetchAll : refetchUser;

  // Load user khi component mount
  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  // Gọi API khi component mount hoặc khi dependencies thay đổi
  useEffect(() => {
    console.log('useEffect triggered:', { currentUserId, currentPage, pageSize, isAdminRole });
    
    if (isAdminRole) {
      // Nếu là DOCTOR hoặc MANAGER, gọi API lấy tất cả phiếu
      console.log('Calling API for all appointments with params:', { page: currentPage, pageSize });
      refetch({ page: currentPage, pageSize });
    } else if (currentUserId) {
      // Nếu là user thường, gọi API lấy phiếu của họ
      console.log('Calling API for user appointments with params:', { maNguoiDung: currentUserId, page: currentPage, pageSize });
      refetch({ 
        maNguoiDung: currentUserId, 
        page: currentPage, 
        pageSize 
      });
    } else {
      console.log('currentUserId is null or undefined');
    }
  }, [currentUserId, currentPage, pageSize, refetch, isAdminRole]);

  const appointments = appointmentsData?.data || [];
  const totalCount = appointmentsData?.totalCount || 0;
  const totalPages = appointmentsData?.totalPages || 0;

  // Xử lý cập nhật phiếu đăng ký
  const handleUpdate = async () => {
    if (!selectedAppointment) return;

    try {
      await approveAppointment({
        id: selectedAppointment.maPhieuDangKy,
        data: editData
      });

      // Nếu là DOCTOR hoặc MANAGER và trạng thái là "Approved", tạo PhieuTiem mới
      if ((user?.role === 'DOCTOR' || user?.role === 'MANAGER') && editData.status === 'Approved') {
        showSuccess('Thành công', 'Cập nhật phiếu đăng ký và tạo phiếu tiêm thành công');
      } else {
        showSuccess('Thành công', 'Cập nhật phiếu đăng ký thành công');
      }

      setShowEditModal(false);
      setSelectedAppointment(null);
      refetch({ page: currentPage, pageSize });
    } catch (error) {
      showError('Lỗi', 'Có lỗi xảy ra khi cập nhật phiếu đăng ký');
    }
  };

  // Xử lý xóa phiếu đăng ký
  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa phiếu đăng ký này?')) {
      try {
        await deleteAppointment(id);
        showSuccess('Thành công', 'Xóa phiếu đăng ký thành công');
        refetch({ page: currentPage, pageSize });
      } catch (error) {
        showError('Lỗi', 'Có lỗi xảy ra khi xóa phiếu đăng ký');
      }
    }
  };

  // Mở modal chỉnh sửa
  const openEditModal = (appointment: PhieuDangKyLichTiem) => {
    setSelectedAppointment(appointment);
    setEditData({ 
      status: appointment.trangThai === 'Pending' ? 'Approved' : appointment.trangThai, 
      reason: '' 
    });
    setShowEditModal(true);
  };

  // Đóng modal chỉnh sửa
  const closeEditModal = () => {
    setShowEditModal(false);
    setSelectedAppointment(null);
    setEditData({ status: 'Approved', reason: '' });
  };

  // Format date function
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  // Cột cho bảng
  const columns = [
    {
      key: 'maPhieuDangKy',
      header: 'Mã phiếu',
      render: (value: any, item: PhieuDangKyLichTiem) => (
        <span className="font-medium text-black dark:text-white">
          {item.maPhieuDangKy}
        </span>
      ),
    },
    {
      key: 'tenKhachHang',
      header: 'Khách hàng',
      render: (value: any, item: PhieuDangKyLichTiem) => (
        <div>
          <div className="font-medium text-black dark:text-white">
            {item.tenKhachHang}
          </div>
          <div className="text-sm text-gray-500">
            {item.soDienThoaiKhachHang}
          </div>
        </div>
      ),
    },
    {
      key: 'maDichVuDisplay',
      header: 'Mã dịch vụ',
      render: (value: any, item: PhieuDangKyLichTiem) => (
        <span className="text-sm text-gray-600">
          {item.maDichVu}
        </span>
      ),
    },
    {
      key: 'ngayDangKy',
      header: 'Ngày đăng ký',
      render: (value: any, item: PhieuDangKyLichTiem) => (
        <span className="text-sm text-gray-600">
          {formatDate(item.ngayDangKy)}
        </span>
      ),
    },
    {
      key: 'trangThai',
      header: 'Trạng thái',
      render: (value: any, item: PhieuDangKyLichTiem) => {
        const status = item.trangThai;
        let statusClass = '';
        let statusText = '';

        switch (status) {
          case 'Pending':
            statusClass = 'bg-yellow-100 text-yellow-800';
            statusText = 'Chờ duyệt';
            break;
          case 'Approved':
            statusClass = 'bg-green-100 text-green-800';
            statusText = 'Đã duyệt';
            break;
          case 'Rejected':
            statusClass = 'bg-red-100 text-red-800';
            statusText = 'Từ chối';
            break;
          default:
            statusClass = 'bg-gray-100 text-gray-800';
            statusText = status;
        }

        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClass}`}>
            {statusText}
          </span>
        );
      },
    },
    {
      key: 'ghiChu',
      header: 'Ghi chú',
      render: (value: any, item: PhieuDangKyLichTiem) => (
        <span className="text-sm text-gray-600 max-w-xs truncate">
          {item.ghiChu || '-'}
        </span>
      ),
    }
  ];
  if(user?.role === 'DOCTOR' || user?.role === 'MANAGER') {
    columns.push(
              {
          key: 'actions',
          header: 'Thao tác',
          render: (value: any, item: PhieuDangKyLichTiem) => (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => openEditModal(item)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors"
              >
                Chỉnh sửa
              </button>
            </div>
          ),
        });
  }
  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Có lỗi xảy ra khi tải dữ liệu: {error}
        </div>
      </div>
    );
  }

  // Kiểm tra người dùng đã đăng nhập chưa
  if (!user) {
    return (
      <div className="p-4">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          Vui lòng đăng nhập để xem phiếu đăng ký tiêm chủng.
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-title-md2 font-semibold text-black dark:text-white">
            {isAdminRole ? 'Phiếu đăng ký tiêm chủng' : 'Phiếu đăng ký tiêm chủng của tôi'}
          </h2>
        </div>

        {/* Thống kê */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5 mb-6">
          <CardDataStats
            title={isAdminRole ? "Tổng phiếu đăng ký" : "Tổng phiếu đăng ký của tôi"}
            total={totalCount.toString()}
            rate=""
            levelUp
          >
            <i className="ri-article-line text-primary"></i>
          </CardDataStats>

          <CardDataStats
            title="Chờ duyệt"
            total={appointments.filter((a: PhieuDangKyLichTiem) => a.trangThai === 'Pending').length.toString()}
            rate=""
            levelUp
          >
            <i className="ri-layout-row-line text-yellow-500"></i>
          </CardDataStats>

          <CardDataStats
            title="Đã duyệt"
            total={appointments.filter((a: PhieuDangKyLichTiem) => a.trangThai === 'Approved').length.toString()}
            rate=""
            levelUp
          >
            <i className="ri-checkbox-circle-line text-green-500"></i>
          </CardDataStats>

          <CardDataStats
            title="Từ chối"
            total={appointments.filter((a: PhieuDangKyLichTiem) => a.trangThai === 'Rejected').length.toString()}
            rate=""
            levelUp
          >
            <i className="ri-close-circle-line text-red-500"></i>
          </CardDataStats>
        </div>

        {/* Bảng dữ liệu */}
          <DataTable
            data={appointments}
            columns={columns}
            loading={loading}
            title={isAdminRole ? "Danh sách phiếu đăng ký tiêm chủng" : "Danh sách phiếu đăng ký tiêm chủng của tôi"}
          />
      </div>

      {/* Modal chỉnh sửa phiếu đăng ký */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-boxdark rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Chỉnh sửa phiếu đăng ký</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Trạng thái</label>
              <select
                value={editData.status}
                onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="Pending">Chờ duyệt</option>
                <option value="Approved">Đã duyệt</option>
                <option value="Rejected">Từ chối</option>
              </select>
            </div>

            {editData.status === 'Rejected' && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Lý do từ chối</label>
                <textarea
                  value={editData.reason || ''}
                  onChange={(e) => setEditData({ ...editData, reason: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  rows={3}
                  placeholder="Nhập lý do từ chối..."
                  required
                />
              </div>
            )}

            <div className="flex justify-end space-x-2">
              <button
                onClick={closeEditModal}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={handleUpdate}
                disabled={isApproving || (editData.status === 'Rejected' && !editData.reason)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
              >
                {isApproving ? 'Đang xử lý...' : 'Cập nhật'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PhieuDangKyTiemChungPage; 