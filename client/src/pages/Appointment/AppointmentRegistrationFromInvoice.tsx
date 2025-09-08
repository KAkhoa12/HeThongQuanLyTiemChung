import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { 
  phieuDangKyLichTiemService,
  CreateAppointmentFromOrderDto
} from '../../services/phieuDangKyLichTiem.service';
import { getOrderById, OrderDetail } from '../../services/order.service';
import { useApiWithParams } from '../../hooks/useApi';
import { useLocations } from '../../hooks/useLocations';

type Order = OrderDetail;

const AppointmentRegistrationFromInvoice: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  
  // States
  const [order, setOrder] = useState<Order | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  // Hooks
  const { execute: createAppointment, loading: createLoading, status: createStatus, error: createError } = useApiWithParams<string[], CreateAppointmentFromOrderDto>(
    async (data) => phieuDangKyLichTiemService.createFromOrder(data),
    null
  );

  // Sử dụng useLocations hook để lấy danh sách địa điểm
  const { execute: fetchLocations, data: locations, loading: locationsLoading, error: locationsError } = useLocations();

  useEffect(() => {
    if (orderId) {
      loadOrder();
      // Lấy danh sách địa điểm
      fetchLocations({ page: 1, pageSize: 100 });
    }
  }, [orderId]);

  const loadOrder = async () => {
    try {
      setIsLoading(true);
      const orderData = await getOrderById(orderId!);
      setOrder(orderData);
    } catch (error) {
      console.error('Lỗi khi tải đơn hàng:', error);
      toast.error('Không thể tải thông tin đơn hàng');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!orderId) {
      toast.error('Không có ID đơn hàng');
      return;
    }

    if (!selectedLocation) {
      toast.error('Vui lòng chọn địa điểm tiêm chủng');
      return;
    }

    // Kiểm tra ngày đăng ký (nếu có chọn)
    if (selectedDate) {
      const selectedDateTime = new Date(selectedDate);
      const now = new Date();
      if (selectedDateTime < now) {
        toast.error('Ngày đăng ký không thể là ngày trong quá khứ');
        return;
      }
    }

    try {
      const createData: CreateAppointmentFromOrderDto = {
        orderId: orderId,
        maDiaDiem: selectedLocation,
        ngayDangKy: selectedDate || undefined,
        ghiChu: note
      };

      await createAppointment(createData);
      
      if (createStatus === 'success') {
        toast.success('Đăng ký lịch tiêm thành công!');
        navigate('/dashboard/vaccination-registration');
      } else if (createStatus === 'error') {
        toast.error(`Lỗi: ${createError || 'Không thể đăng ký lịch tiêm'}`);
      }
    } catch (error) {
      console.error('Lỗi khi đăng ký:', error);
      toast.error('Có lỗi xảy ra khi đăng ký lịch tiêm');
    }
  };

  if (isLoading) {
    return (
      <>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Đang tải thông tin đơn hàng...</p>
          </div>
        </div>
      </>
    );
  }

  if (!order) {
    return (
      <>
        <div className="text-center py-8">
          <p className="text-red-500">Không tìm thấy đơn hàng</p>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="mx-auto max-w-4xl">
        <Breadcrumb pageName="Đăng ký lịch tiêm từ đơn hàng" />
        
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-black dark:text-white">
              Thông tin đơn hàng #{order.maDonHang}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Ngày đặt: {new Date(order.ngayDat).toLocaleDateString('vi-VN')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Thông tin đơn hàng */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Tổng tiền
                </label>
                <div className="text-lg font-semibold text-primary">
                  {new Intl.NumberFormat('vi-VN', { 
                    style: 'currency', 
                    currency: 'VND' 
                  }).format(order.tongTienThanhToan)}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Trạng thái
                </label>
                <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                  order.trangThaiDon === 'PAID'  
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {order.trangThaiDon === 'PAID' ? 'Hoàn thành' : 'Đang xử lý'}
                </span>
              </div>
            </div>

            {/* Danh sách dịch vụ */}
            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-3">
                Dịch vụ đã đặt
              </label>
              <div className="space-y-3">
                {order.donHangChiTiets?.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <p className="font-medium text-black dark:text-white">
                        {item.maDichVu}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Số mũi: {item.soMuiChuan}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-primary">
                        {new Intl.NumberFormat('vi-VN', { 
                          style: 'currency', 
                          currency: 'VND' 
                        }).format(item.thanhTien)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chọn địa điểm */}
            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Chọn địa điểm tiêm chủng <span className="text-red-500">*</span>
              </label>
              {locationsLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  <span className="text-sm text-gray-500">Đang tải danh sách địa điểm...</span>
                </div>
              ) : locationsError ? (
                <div className="text-red-500 text-sm">
                  Lỗi khi tải danh sách địa điểm: {locationsError}
                </div>
              ) : (
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full rounded-lg border border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  required
                >
                  <option value="">-- Chọn địa điểm --</option>
                                     {locations?.data?.map((location) => (
                     <option key={location.id} value={location.id}>
                       {location.name} - {location.address}
                     </option>
                   ))}
                </select>
              )}
            </div>

            {/* Chọn ngày đăng ký */}
            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Ngày đăng ký tiêm chủng
              </label>
              <input
                type="datetime-local"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
                className="w-full rounded-lg border border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-not-allowed disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                placeholder="Chọn ngày và giờ đăng ký"
              />
              <p className="text-xs text-gray-500 mt-1">
                Để trống để sử dụng ngày giờ hiện tại
              </p>
            </div>

            {/* Ghi chú */}
            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Ghi chú
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                placeholder="Nhập ghi chú nếu cần..."
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={() => navigate('/dashboard/vaccination-registration')}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={createLoading || !selectedLocation}
                className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Đang xử lý...</span>
                  </div>
                ) : (
                  'Đăng ký lịch tiêm'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AppointmentRegistrationFromInvoice;