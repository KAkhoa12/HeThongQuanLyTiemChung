import React, { useState, useEffect } from 'react';
import { 
  usePhieuNhapPending, 
  usePhieuXuatPending, 
  usePhieuThanhLyPending,
  useApprovePhieuNhap,
  useRejectPhieuNhap,
  useApprovePhieuXuat,
  useRejectPhieuXuat,
  useApprovePhieuThanhLy,
  useRejectPhieuThanhLy
} from '../../hooks';
import { TrangThaiPhieuKho } from '../../types/khoTypes';
import NotificationModal from './NotificationModal';

interface ApprovalPanelProps {
  type: 'phieu-nhap' | 'phieu-xuat' | 'phieu-thanh-ly';
}

const ApprovalPanel: React.FC<ApprovalPanelProps> = ({ type }) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [notification, setNotification] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });

  // Fetch pending data based on type
  const { data: phieuNhapData, execute: fetchPhieuNhap } = usePhieuNhapPending({ page: 1, pageSize: 50 });
  const { data: phieuXuatData, execute: fetchPhieuXuat } = usePhieuXuatPending({ page: 1, pageSize: 50 });
  const { data: phieuThanhLyData, execute: fetchPhieuThanhLy } = usePhieuThanhLyPending({ page: 1, pageSize: 50 });

  // Approval and rejection hooks
  const { execute: approvePhieuNhap } = useApprovePhieuNhap();
  const { execute: rejectPhieuNhap } = useRejectPhieuNhap();
  const { execute: approvePhieuXuat } = useApprovePhieuXuat();
  const { execute: rejectPhieuXuat } = useRejectPhieuXuat();
  const { execute: approvePhieuThanhLy } = useApprovePhieuThanhLy();
  const { execute: rejectPhieuThanhLy } = useRejectPhieuThanhLy();

  // Fetch data when component mounts or type changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        switch (type) {
          case 'phieu-nhap':
            await fetchPhieuNhap();
            break;
          case 'phieu-xuat':
            await fetchPhieuXuat();
            break;
          case 'phieu-thanh-ly':
            await fetchPhieuThanhLy();
            break;
        }
      } catch (error) {
        console.error('Error fetching pending data:', error);
      }
    };

    fetchData();
  }, [type, fetchPhieuNhap, fetchPhieuXuat, fetchPhieuThanhLy]);

  const getCurrentData = () => {
    switch (type) {
      case 'phieu-nhap':
        return phieuNhapData;
      case 'phieu-xuat':
        return phieuXuatData;
      case 'phieu-thanh-ly':
        return phieuThanhLyData;
      default:
        return null;
    }
  };

  const handleSelectItem = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    const data = getCurrentData();
    if (data?.data) {
      setSelectedItems(
        selectedItems.length === data.data.length 
          ? [] 
          : data.data.map((item: any) => item.maPhieuNhap || item.maPhieuXuat || item.maPhieuThanhLy)
      );
    }
  };

  const handleApprove = async () => {
    if (selectedItems.length === 0) return;
    
    try {
      for (const itemId of selectedItems) {
        switch (type) {
          case 'phieu-nhap':
            await approvePhieuNhap({ id: itemId });
            break;
          case 'phieu-xuat':
            await approvePhieuXuat({ id: itemId });
            break;
          case 'phieu-thanh-ly':
            await approvePhieuThanhLy({ id: itemId });
            break;
        }
      }
      
      // Refresh data after approval
      switch (type) {
        case 'phieu-nhap':
          await fetchPhieuNhap();
          break;
        case 'phieu-xuat':
          await fetchPhieuXuat();
          break;
        case 'phieu-thanh-ly':
          await fetchPhieuThanhLy();
          break;
      }
      
      setSelectedItems([]);
      setNotification({
        isOpen: true,
        title: 'Thành công',
        message: `Đã duyệt thành công ${selectedItems.length} phiếu!`,
        type: 'success'
      });
    } catch (error) {
      console.error('Error approving items:', error);
      setNotification({
        isOpen: true,
        title: 'Lỗi',
        message: 'Có lỗi xảy ra khi duyệt phiếu!',
        type: 'error'
      });
    }
  };

  const handleReject = () => {
    if (selectedItems.length === 0) return;
    setShowRejectModal(true);
  };

  const confirmReject = async () => {
    if (selectedItems.length === 0 || !rejectReason.trim()) return;
    
    try {
      for (const itemId of selectedItems) {
        switch (type) {
          case 'phieu-nhap':
            await rejectPhieuNhap({ id: itemId, lyDo: rejectReason });
            break;
          case 'phieu-xuat':
            await rejectPhieuXuat({ id: itemId, lyDo: rejectReason });
            break;
          case 'phieu-thanh-ly':
            await rejectPhieuThanhLy({ id: itemId, lyDo: rejectReason });
            break;
        }
      }
      
      // Refresh data after rejection
      switch (type) {
        case 'phieu-nhap':
          await fetchPhieuNhap();
          break;
        case 'phieu-xuat':
          await fetchPhieuXuat();
          break;
        case 'phieu-thanh-ly':
          await fetchPhieuThanhLy();
          break;
      }
      
      setSelectedItems([]);
      setRejectReason('');
      setShowRejectModal(false);
      setNotification({
        isOpen: true,
        title: 'Thành công',
        message: `Đã từ chối thành công ${selectedItems.length} phiếu!`,
        type: 'success'
      });
    } catch (error) {
      console.error('Error rejecting items:', error);
      setNotification({
        isOpen: true,
        title: 'Lỗi',
        message: 'Có lỗi xảy ra khi từ chối phiếu!',
        type: 'error'
      });
    }
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

  const getTypeLabel = () => {
    switch (type) {
      case 'phieu-nhap':
        return 'Phiếu nhập';
      case 'phieu-xuat':
        return 'Phiếu xuất';
      case 'phieu-thanh-ly':
        return 'Phiếu thanh lý';
      default:
        return '';
    }
  };

  const data = getCurrentData();
  const isLoading = phieuNhapData?.loading || phieuXuatData?.loading || phieuThanhLyData?.loading;
  const error = phieuNhapData?.error || phieuXuatData?.error || phieuThanhLyData?.error;

  // Debug logging
  console.log('ApprovalPanel Debug:', {
    type,
    data,
    isLoading,
    error,
    phieuNhapData,
    phieuXuatData,
    phieuThanhLyData
  });

  return (
    <div className="rounded-lg border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="flex items-center justify-between mb-6">
        <h4 className="text-title-md font-bold text-black dark:text-white">
          Duyệt {getTypeLabel()}
        </h4>
        <div className="flex gap-2">
          <button
            onClick={handleApprove}
            disabled={selectedItems.length === 0}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Duyệt ({selectedItems.length})
          </button>
          <button
            onClick={handleReject}
            disabled={selectedItems.length === 0}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Từ chối ({selectedItems.length})
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Đang tải dữ liệu...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Lỗi tải dữ liệu</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {!isLoading && !error && (
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[50px] py-4 px-4 font-medium text-black dark:text-white">
                <input
                  type="checkbox"
                  checked={selectedItems.length > 0 && selectedItems.length === data?.data?.length}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300"
                />
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Mã phiếu
              </th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                {type === 'phieu-nhap' ? 'Nhà cung cấp' : 'Địa điểm'}
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Ngày tạo
              </th>
              {type === 'phieu-nhap' && (
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                  Tổng tiền
                </th>
              )}
              <th className="min-w-[100px] py-4 px-4 font-medium text-black dark:text-white">
                Trạng thái
              </th>
              <th className="min-w-[100px] py-4 px-4 font-medium text-black dark:text-white">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody>
            {data?.data?.length > 0 ? data.data.map((item: any, index: number) => {
              const itemId = item.maPhieuNhap || item.maPhieuXuat || item.maPhieuThanhLy;
              return (
                <tr key={index} className="border-b border-stroke dark:border-strokedark">
                  <td className="py-4 px-4">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(itemId)}
                      onChange={() => handleSelectItem(itemId)}
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-sm font-medium text-black dark:text-white">
                      {itemId}
                    </p>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-sm text-black dark:text-white">
                      {type === 'phieu-nhap' ? item.tenNhaCungCap : 
                       type === 'phieu-xuat' ? item.tenDiaDiemXuat : item.tenDiaDiem}
                    </p>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-sm text-black dark:text-white">
                      {formatDate(item.ngayTao)}
                    </p>
                  </td>
                  {type === 'phieu-nhap' && (
                    <td className="py-4 px-4">
                      <p className="text-sm text-black dark:text-white">
                        {formatCurrency(item.tongTien || 0)}
                      </p>
                    </td>
                  )}
                  <td className="py-4 px-4">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      {item.trangThai === TrangThaiPhieuKho.Pending ? 'Chờ xác nhận' : item.trangThai === TrangThaiPhieuKho.Approved ? 'Đã xác nhận' : 'Đã từ chối'}
                    </span>
                  </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3.5">
                      <button className="hover:text-primary">
                        <svg className="fill-current" width="18" height="18" viewBox="0 0 18 18" fill="none">
                          <path d="M8.99981 10.7906C11.0813 10.7906 12.7681 9.10375 12.7681 7.02225C12.7681 4.94075 11.0813 3.25391 8.99981 3.25391C6.91831 3.25391 5.23147 4.94075 5.23147 7.02225C5.23147 9.10375 6.91831 10.7906 8.99981 10.7906ZM8.99981 4.75391C10.3781 4.75391 11.5031 5.87891 11.5031 7.25725C11.5031 8.63559 10.3781 9.76059 8.99981 9.76059C7.62147 9.76059 6.49647 8.63559 6.49647 7.25725C6.49647 5.87891 7.62147 4.75391 8.99981 4.75391Z" fill=""/>
                          <path d="M1.77147 15.7406C1.77147 13.0125 3.90234 10.7906 6.64059 10.7906H11.3591C14.0973 10.7906 16.2281 13.0125 16.2281 15.7406V16.2281H1.77147V15.7406ZM6.64059 12.0406C4.66059 12.0406 3.02147 13.6797 3.02147 15.6597V14.9781H14.9781V15.6597C14.9781 13.6797 13.339 12.0406 11.359 12.0406H6.64059Z" fill=""/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            }) : (
              <tr>
                <td colSpan={type === 'phieu-nhap' ? 7 : 6} className="py-8 px-4 text-center text-gray-500">
                  Không có phiếu nào chờ duyệt
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-bold mb-4">Từ chối {getTypeLabel()}</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Lý do từ chối:</label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full p-2 border rounded"
                rows={3}
                placeholder="Nhập lý do từ chối..."
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Hủy
              </button>
              <button
                onClick={confirmReject}
                disabled={!rejectReason.trim()}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-300"
              >
                Xác nhận từ chối
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Modal */}
      <NotificationModal
        isOpen={notification.isOpen}
        onClose={() => setNotification(prev => ({ ...prev, isOpen: false }))}
        title={notification.title}
        message={notification.message}
        type={notification.type}
      />
    </div>
  );
};

export default ApprovalPanel;