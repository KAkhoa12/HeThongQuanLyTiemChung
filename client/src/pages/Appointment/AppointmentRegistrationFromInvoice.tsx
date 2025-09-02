import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { 
  phieuDangKyLichTiemService,
  CreateAppointmentFromOrderDto
} from '../../services/phieuDangKyLichTiem.service';
import { getOrderById, OrderDetail } from '../../services/order.service';
import { useApiWithParams } from '../../hooks/useApi';

// Sử dụng types đã có sẵn
type Order = OrderDetail;

const AppointmentRegistrationFromInvoice: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();

  // States
  const [ghiChu, setGhiChu] = useState<string>('');

  // API Hooks
  const { data: order, loading: orderLoading, error: orderError, execute: fetchOrder } = useApiWithParams<Order, string>(
    async (id) => getOrderById(id), null
  );

  const { loading: creating, execute: executeCreateAppointment } = useApiWithParams<any, CreateAppointmentFromOrderDto>(
    async (data) => phieuDangKyLichTiemService.createFromOrder(data), null
  );

  // Load initial data
  useEffect(() => {
    if (orderId) {
      fetchOrder(orderId);
    }
  }, [orderId]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!order) {
      toast.error('Không tìm thấy thông tin đơn hàng');
      return;
    }

    try {
      const appointmentData: CreateAppointmentFromOrderDto = {
        orderId: order.maDonHang,
        ghiChu: ghiChu || undefined
      };

      await executeCreateAppointment(appointmentData);
      toast.success('Đăng ký lịch tiêm thành công! Sẽ tạo phiếu đăng ký cho tất cả dịch vụ trong đơn hàng.');
      navigate('/dashboard/invoices');
    } catch (error) {
      console.error('Lỗi đăng ký lịch tiêm:', error);
      toast.error('Có lỗi xảy ra khi đăng ký lịch tiêm');
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  if (orderLoading) {
    return (
      <>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </>
      );
  }

  if (orderError || !order || order.trangThaiDon !== 'PAID') {
    return (
      <>
        <div className="mx-auto max-w-4xl p-4 md:p-6 2xl:p-10">
          <div className="mb-6">
            <Breadcrumb pageName="Đăng ký lịch tiêm" />
          </div>
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-red-600 mb-4">
                Không thể đăng ký lịch tiêm
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {orderError ? 'Không tìm thấy đơn hàng' : 'Đơn hàng chưa được thanh toán hoặc không hợp lệ'}
              </p>
              <button
                onClick={() => navigate('/dashboard/invoices')}
                className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary-dark"
              >
                Quay lại danh sách hóa đơn
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="mx-auto max-w-4xl p-4 md:p-6 2xl:p-10">
        <div className="mb-6">
          <Breadcrumb pageName="Đăng ký lịch tiêm" />
        </div>

        {/* Order Information */}
        <div className="mb-6 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-6">
          <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
            Thông tin đơn hàng
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Mã đơn hàng</p>
              <p className="font-medium text-black dark:text-white">{order.maDonHang}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Tổng tiền</p>
              <p className="font-medium text-black dark:text-white">{formatCurrency(order.tongTienThanhToan)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Trạng thái</p>
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Đã thanh toán
              </span>
            </div>
          </div>
        </div>

        {/* Appointment Registration Form */}
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Đăng ký lịch tiêm
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Hệ thống sẽ tự động tạo phiếu đăng ký cho tất cả dịch vụ trong đơn hàng này
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6.5">
            {/* Notes */}
            <div className="mb-6">
              <label className="mb-2.5 block text-black dark:text-white">
                Ghi chú
              </label>
              <textarea
                rows={4}
                value={ghiChu}
                onChange={(e) => setGhiChu(e.target.value)}
                placeholder="Ghi chú thêm về lịch hẹn..."
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              ></textarea>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={creating}
                className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 disabled:opacity-50"
              >
                {creating ? 'Đang đăng ký...' : 'Đăng ký lịch tiêm cho tất cả dịch vụ'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/dashboard/invoices')}
                className="flex w-full justify-center rounded bg-gray-500 p-3 font-medium text-white hover:bg-opacity-90"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AppointmentRegistrationFromInvoice;