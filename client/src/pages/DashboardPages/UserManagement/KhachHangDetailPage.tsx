import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useKhachHang } from '../../../hooks/useKhachHang';
import { useOrdersByUser } from '../../../hooks/useOrders';
import { useCreateVaccinationPlanFromOrder } from '../../../hooks/useAppointment';
import { useAllLocations } from '../../../hooks/useLocations';
import { useToast } from '../../../hooks/useToast';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import { caculateAge } from '../../../utils/ageHelp';

const KhachHangDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: khachHang, loading, execute: fetchKhachHang } = useKhachHang(id || '');
  const { orders, loading: ordersLoading, fetchOrdersByUser } = useOrdersByUser();
  const { data: locationsData, execute: fetchLocations } = useAllLocations();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [selectedLocationId, setSelectedLocationId] = useState('');
  const [isCreatingPlan, setIsCreatingPlan] = useState(false);
  const [orderPlanStatus, setOrderPlanStatus] = useState<Record<string, boolean>>({});
  const { execute: createVaccinationPlan } = useCreateVaccinationPlanFromOrder();

  useEffect(() => {
    if (id) {
      fetchKhachHang({ id });
    }
    fetchLocations();
  }, [id]);

  useEffect(() => {
    if (khachHang?.maNguoiDung) {
      fetchOrdersByUser(khachHang.maNguoiDung, {
        page: currentPage,
        pageSize: pageSize
      });
    } 
  }, [khachHang?.maNguoiDung, currentPage, pageSize]);

  // Check vaccination plan status for each order
  useEffect(() => {
    if (orders && orders.length > 0) {
      orders.forEach((order: any) => {
        if (order.trangThaiDon === 'PAID') {
          checkOrderPlanStatus(order.maDonHang);
        }
      });
    }
  }, [orders]);

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: { text: string; className: string } } = {
      'PENDING': { text: 'Chờ xử lý', className: 'bg-warning/10 text-warning' },
      'PAYMENT_PENDING': { text: 'Chờ thanh toán', className: 'bg-warning/10 text-warning' },
      'PAID': { text: 'Đã thanh toán', className: 'bg-success/10 text-success' },
      'PROCESSING': { text: 'Đang xử lý', className: 'bg-primary/10 text-primary' },
      'COMPLETED': { text: 'Hoàn thành', className: 'bg-success/10 text-success' },
      'FAILED': { text: 'Thất bại', className: 'bg-danger/10 text-danger' },
      'CANCELLED': { text: 'Đã hủy', className: 'bg-danger/10 text-danger' }
    };
    
    const statusInfo = statusMap[status] || { text: status, className: 'bg-gray/10 text-gray' };
    
    return (
      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusInfo.className}`}>
        {statusInfo.text}
      </span>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const checkOrderPlanStatus = async (orderId: string) => {
    try {
      // Import service directly
      const { keHoachTiemService } = await import('../../../services/keHoachTiem.service');
      const result = await keHoachTiemService.checkVaccinationPlanExists(orderId);
      setOrderPlanStatus(prev => ({
        ...prev,
        [orderId]: result.hasPlans
      }));
    } catch (error) {
      console.error('Error checking plan status:', error);
    }
  };

  const handleCreateVaccinationPlan = (orderId: string) => {
    setSelectedOrderId(orderId);
    setShowLocationModal(true);
  };

  const handleViewVaccinationPlan = (orderId: string) => {
    navigate(`/dashboard/nguoi-dung/khach-hang/${id}/vaccination-plan/${orderId}`);
  };

  const handleConfirmCreatePlan = async () => {
    if (!selectedOrderId || !selectedLocationId) {
      showError('Lỗi', 'Vui lòng chọn địa điểm tiêm chủng');
      return;
    }

    setIsCreatingPlan(true);
    try {
      await createVaccinationPlan({
        orderId: selectedOrderId,
        maDiaDiem: selectedLocationId,
        ghiChu: `Tạo kế hoạch tiêm từ đơn hàng ${selectedOrderId}`
      });
      
      showSuccess('Thành công', 'Tạo kế hoạch tiêm thành công!');
      setShowLocationModal(false);
      setSelectedOrderId(null);
      setSelectedLocationId('');
      
      // Refresh orders list
      if (khachHang?.maNguoiDung) {
        fetchOrdersByUser(khachHang.maNguoiDung, {
          page: currentPage,
          pageSize: pageSize
        });
      }
    } catch (error: any) {
      showError('Lỗi', error?.message || 'Có lỗi xảy ra khi tạo kế hoạch tiêm');
    } finally {
      setIsCreatingPlan(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!khachHang) {
    return (
      <div className="text-center py-8">
        <p className="text-bodydark2">Không tìm thấy thông tin khách hàng</p>
      </div>
    );
  }

  return (
    <div className='p-6'>
      <Breadcrumb pageName={`Chi tiết khách hàng - ${khachHang.ten}`} />
      {/* Thông tin cơ bản của khách hàng */}
      <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
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
                  <span className="text-bodydark2">{khachHang.ten}</span>
                </div>
              </div>

              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Email
                </label>
                <div className="relative">
                  <span className="text-bodydark2">{khachHang.email}</span>
                </div>
              </div>

              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Số điện thoại
                </label>
                <div className="relative">
                  <span className="text-bodydark2">{khachHang.soDienThoai || 'Chưa cập nhật'}</span>
                </div>
              </div>

              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Ngày sinh
                </label>
                <div className="relative">
                  <span className="text-bodydark2">{khachHang.ngaySinh || 'Chưa cập nhật'}</span>
                </div>
              </div>
              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Tuổi
                </label>
                <div className="relative">
                  <span className="text-bodydark2">{caculateAge(khachHang?.ngaySinh || '') || 'Chưa cập nhật'}</span>
                </div>
              </div>

              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Giới tính
                </label>
                <div className="relative">
                  <span className="text-bodydark2">{khachHang.gioiTinh || 'Chưa cập nhật'}</span>
                </div>
              </div>

              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Địa chỉ
                </label>
                <div className="relative">
                  <span className="text-bodydark2">{khachHang.diaChi || 'Chưa cập nhật'}</span>
                </div>
              </div>

              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Trạng thái
                </label>
                <div className="relative">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      khachHang.isActive
                        ? 'bg-success/10 text-success'
                        : 'bg-danger/10 text-danger'
                    }`}
                  >
                    {khachHang.isActive ? 'Hoạt động' : 'Không hoạt động'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Thông tin sức khỏe */}
        <div className="flex flex-col gap-9">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Thông tin sức khỏe
              </h3>
            </div>
            <div className="p-6.5">
              {khachHang.thongTinNguoiDung ? (
                <>
                  <div className="mb-4.5">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Chiều cao (cm)
                    </label>
                    <div className="relative">
                      <span className="text-bodydark2">
                        {khachHang.thongTinNguoiDung.chieuCao || 'Chưa cập nhật'}
                      </span>
                    </div>
                  </div>

                  <div className="mb-4.5">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Cân nặng (kg)
                    </label>
                    <div className="relative">
                      <span className="text-bodydark2">
                        {khachHang.thongTinNguoiDung.canNang || 'Chưa cập nhật'}
                      </span>
                    </div>
                  </div>

                  <div className="mb-4.5">
                    <label className="mb-2.5 block text-black dark:text-white">
                      BMI
                    </label>
                    <div className="relative">
                      <span className="text-bodydark2">
                        {khachHang.thongTinNguoiDung.bmi ? 
                          khachHang.thongTinNguoiDung.bmi.toFixed(2) : 'Chưa cập nhật'}
                      </span>
                    </div>
                  </div>

                  <div className="mb-4.5">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Nhóm máu
                    </label>
                    <div className="relative">
                      <span className="text-bodydark2">
                        {khachHang.thongTinNguoiDung.nhomMau || 'Chưa cập nhật'}
                      </span>
                    </div>
                  </div>

                  <div className="mb-4.5">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Bệnh nền
                    </label>
                    <div className="relative">
                      <span className="text-bodydark2">
                        {khachHang.thongTinNguoiDung.benhNen || 'Không có'}
                      </span>
                    </div>
                  </div>

                  <div className="mb-4.5">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Dị ứng
                    </label>
                    <div className="relative">
                      <span className="text-bodydark2">
                        {khachHang.thongTinNguoiDung.diUng || 'Không có'}
                      </span>
                    </div>
                  </div>

                  <div className="mb-4.5">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Thuốc đang dùng
                    </label>
                    <div className="relative">
                      <span className="text-bodydark2">
                        {khachHang.thongTinNguoiDung.thuocDangDung || 'Không có'}
                      </span>
                    </div>
                  </div>

                  <div className="mb-4.5">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Tình trạng mang thai
                    </label>
                    <div className="relative">
                      <span className="text-bodydark2">
                        {khachHang.thongTinNguoiDung.tinhTrangMangThai ? 'Có' : 'Không'}
                      </span>
                    </div>
                  </div>

                  <div className="mb-4.5">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Ngày khám gần nhất
                    </label>
                    <div className="relative">
                      <span className="text-bodydark2">
                        {khachHang.thongTinNguoiDung.ngayKhamGanNhat || 'Chưa cập nhật'}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-bodydark2">Chưa có thông tin sức khỏe</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="mt-6 flex justify-end gap-4">
        <button
          onClick={() => navigate('/dashboard/nguoi-dung/khach-hang')}
          className="inline-flex items-center justify-center rounded-md border border-stroke bg-white px-4 py-2 text-center font-medium text-black hover:bg-opacity-90 dark:border-strokedark dark:bg-boxdark dark:text-white"
        >
          Quay lại
        </button>
        <button
          onClick={() => navigate(`/dashboard/nguoi-dung/khach-hang/${id}/edit`)}
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-center font-medium text-white hover:bg-opacity-90"
        >
          <i className="ri-edit-line mr-2"></i>
          Chỉnh sửa thông tin của khách hàng
        </button>
      </div>
      <div className='mt-6'>
        <div className='rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark'>
          <div className='border-b border-stroke px-6.5 py-4 dark:border-strokedark'>
            <h3 className='font-medium text-black dark:text-white'>
              Hóa đơn của khách hàng mua dịch vụ
            </h3>
            <div className='flex justify-end'>
              <button
                onClick={() => navigate(`/dashboard/nguoi-dung/khach-hang/${id}/create-order`)}
                className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-center font-medium text-white hover:bg-opacity-90"
              >
                <i className="ri-edit-line mr-2"></i>
                Tạo 1 đơn hàng mới dịch vụ cho khách hàng
              </button>
            </div>
          </div>
          <div className='p-6.5'>
            {ordersLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.maDonHang} className="border border-stroke rounded-lg p-4 dark:border-strokedark">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium text-black dark:text-white">
                          Đơn hàng #{order.maDonHang}
                        </h4>
                        <p className="text-sm text-bodydark2">
                          Ngày đặt: {new Date(order.ngayDat).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(order.trangThaiDon)}
                        <p className="text-sm font-medium text-black dark:text-white mt-1">
                          {formatCurrency(order.tongTienThanhToan)}
                        </p>
                        {order.trangThaiDon === 'PAID' && (
                          <>
                            {orderPlanStatus[order.maDonHang] === true ? (
                              <button
                                onClick={() => handleViewVaccinationPlan(order.maDonHang)}
                                className="mt-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-md transition-colors duration-200"
                              >
                                <i className="ri-eye-line mr-1"></i>
                                Xem kế hoạch tiêm
                              </button>
                            ) : (
                              <button
                                onClick={() => handleCreateVaccinationPlan(order.maDonHang)}
                                className="mt-2 px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded-md transition-colors duration-200"
                              >
                                <i className="ri-calendar-line mr-1"></i>
                                Tạo kế hoạch tiêm
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium text-black dark:text-white">Dịch vụ đã đặt:</h5>
                      {order.donHangChiTiets.map((item) => (
                        <div key={item.maDonHangChiTiet} className="flex justify-between items-center text-sm">
                          <div>
                            <span className="text-black dark:text-white">
                              {item.maDichVuNavigation?.ten || 'Dịch vụ không xác định'}
                            </span>
                            <span className="text-bodydark2 ml-2">
                              (Số mũi: {item.soMuiChuan})
                            </span>
                          </div>
                          <span className="text-black dark:text-white">
                            {formatCurrency(item.thanhTien)}
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    {order.maDiaDiemYeuThichNavigation && (
                      <div className="mt-3 pt-3 border-t border-stroke dark:border-strokedark">
                        <p className="text-sm text-bodydark2">
                          <span className="font-medium">Địa điểm:</span> {order.maDiaDiemYeuThichNavigation.tenDiaDiem}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
                
                {/* Pagination */}
                <div className="flex justify-center items-center gap-2 mt-6">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm border border-stroke rounded hover:bg-gray-50 disabled:opacity-50 dark:border-strokedark dark:hover:bg-meta-4"
                  >
                    Trước
                  </button>
                  <span className="px-3 py-1 text-sm">
                    Trang {currentPage}
                  </span>
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={orders.length < pageSize}
                    className="px-3 py-1 text-sm border border-stroke rounded hover:bg-gray-50 disabled:opacity-50 dark:border-strokedark dark:hover:bg-meta-4"
                  >
                    Sau
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-bodydark2">Khách hàng chưa có đơn hàng nào</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal chọn địa điểm tiêm chủng */}
      {showLocationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-boxdark rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
              Chọn địa điểm tiêm chủng
            </h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Địa điểm tiêm chủng <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedLocationId}
                onChange={(e) => setSelectedLocationId(e.target.value)}
                className="w-full px-3 py-2 border border-stroke rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:border-strokedark dark:bg-boxdark dark:text-white"
              >
                <option value="">Chọn địa điểm tiêm chủng</option>
                {locationsData?.map((location: any) => (
                  <option key={location.id} value={location.id}>
                    {location.name} - {location.address}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowLocationModal(false);
                  setSelectedOrderId(null);
                  setSelectedLocationId('');
                }}
                className="px-4 py-2 border border-stroke text-black dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-meta-4 transition-colors duration-200"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmCreatePlan}
                disabled={isCreatingPlan || !selectedLocationId}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isCreatingPlan ? 'Đang tạo...' : 'Tạo kế hoạch tiêm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KhachHangDetailPage;