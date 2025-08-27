import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaArrowLeft, FaSpinner, FaReceipt, FaCalendarAlt, FaMoneyBillWave, FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

interface OrderItem {
  serviceId: string;
  serviceName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface OrderDetail {
  orderId: string;
  orderCode: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  items: OrderItem[];
  paymentMethod: string;
  paymentStatus: string;
}

const OrderDetailPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [orderDetail, setOrderDetail] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      loadOrderDetail(orderId);
    }
  }, [orderId]);

  const loadOrderDetail = async (id: string) => {
    try {
      setLoading(true);
      // TODO: Gọi API để lấy chi tiết đơn hàng
      // const response = await getOrderById(id);
      // setOrderDetail(response);
      
      // Mock data cho demo
      setOrderDetail({
        orderId: id,
        orderCode: 'DH202508270048291918',
        totalAmount: 90000,
        status: 'PAID',
        createdAt: '2025-01-27T10:00:00Z',
        customerName: 'Nguyễn Văn A',
        customerPhone: '0123456789',
        customerEmail: 'nguyenvana@email.com',
        customerAddress: '123 Đường ABC, Quận 1, TP.HCM',
        items: [
          {
            serviceId: '1',
            serviceName: 'Tiêm chủng COVID-19',
            quantity: 1,
            unitPrice: 90000,
            totalPrice: 90000
          }
        ],
        paymentMethod: 'MoMo',
        paymentStatus: 'Đã thanh toán'
      });
    } catch (error) {
      console.error('Lỗi khi tải chi tiết đơn hàng:', error);
      toast.error('Không thể tải chi tiết đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'PAID':
        return {
          text: 'Đã thanh toán',
          color: 'bg-green-100 text-green-800',
          icon: '✅'
        };
      case 'PENDING':
        return {
          text: 'Chờ thanh toán',
          color: 'bg-yellow-100 text-yellow-800',
          icon: '⏳'
        };
      case 'PAYMENT_FAILED':
        return {
          text: 'Thanh toán thất bại',
          color: 'bg-red-100 text-red-800',
          icon: '❌'
        };
      default:
        return {
          text: 'Không xác định',
          color: 'bg-gray-100 text-gray-800',
          icon: '❓'
        };
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleGoBack = () => {
    navigate('/orders');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="inline-block animate-spin text-6xl text-blue-600 mb-4" />
          <p className="text-xl text-gray-600">Đang tải chi tiết đơn hàng...</p>
        </div>
      </div>
    );
  }

  if (!orderDetail) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <FaReceipt className="inline-block text-8xl text-gray-300 mb-6" />
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Không tìm thấy đơn hàng</h2>
          <p className="text-gray-600 text-lg mb-8">
            Đơn hàng bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
          </p>
          <button
            onClick={handleGoBack}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-lg transition-colors"
          >
            ← Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  const statusDisplay = getStatusDisplay(orderDetail.status);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="container mx-auto px-4">
          <button
            onClick={handleGoBack}
            className="flex items-center text-blue-100 hover:text-white transition-colors mb-4"
          >
            <FaArrowLeft className="mr-2" />
            Quay lại danh sách đơn hàng
          </button>
          <div className="text-center">
            <FaReceipt className="inline-block text-6xl mb-4 text-blue-300" />
            <h1 className="text-5xl font-bold mb-4">📋 Chi Tiết Đơn Hàng</h1>
            <p className="text-xl text-blue-100">
              Mã đơn hàng: {orderDetail.orderCode}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Order Status Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Trạng thái đơn hàng</h2>
              <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${statusDisplay.color}`}>
                {statusDisplay.icon} {statusDisplay.text}
              </span>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {formatAmount(orderDetail.totalAmount)}
                </div>
                <div className="text-gray-600">Tổng tiền</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {orderDetail.items.length}
                </div>
                <div className="text-gray-600">Số dịch vụ</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {orderDetail.paymentMethod}
                </div>
                <div className="text-gray-600">Phương thức thanh toán</div>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Thông tin khách hàng</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center">
                  <FaUser className="text-gray-400 mr-3 w-5" />
                  <div>
                    <div className="text-sm text-gray-500">Họ tên</div>
                    <div className="font-medium">{orderDetail.customerName}</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <FaPhone className="text-gray-400 mr-3 w-5" />
                  <div>
                    <div className="text-sm text-gray-500">Số điện thoại</div>
                    <div className="font-medium">{orderDetail.customerPhone}</div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center">
                  <FaEnvelope className="text-gray-400 mr-3 w-5" />
                  <div>
                    <div className="text-sm text-gray-500">Email</div>
                    <div className="font-medium">{orderDetail.customerEmail}</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <FaMapMarkerAlt className="text-gray-400 mr-3 w-5 mt-1" />
                  <div>
                    <div className="text-sm text-gray-500">Địa chỉ</div>
                    <div className="font-medium">{orderDetail.customerAddress}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Chi tiết dịch vụ</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tên dịch vụ
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Số lượng
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Đơn giá
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thành tiền
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orderDetail.items.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {item.serviceName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {item.quantity}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {formatAmount(item.unitPrice)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-blue-600">
                          {formatAmount(item.totalPrice)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-right font-semibold text-gray-800">
                      Tổng cộng:
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-lg font-bold text-blue-600">
                        {formatAmount(orderDetail.totalAmount)}
                      </div>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Order Timeline */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Lịch sử đơn hàng</h2>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Đơn hàng được tạo</h4>
                  <p className="text-gray-600 text-sm">
                    {formatDate(orderDetail.createdAt)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Thanh toán thành công</h4>
                  <p className="text-gray-600 text-sm">
                    {formatDate(orderDetail.createdAt)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-gray-400 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Đang xử lý</h4>
                  <p className="text-gray-600 text-sm">
                    Nhân viên sẽ liên hệ để sắp xếp lịch hẹn
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleGoBack}
              className="flex items-center justify-center px-8 py-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold text-lg"
            >
              <FaArrowLeft className="mr-2" />
              Quay lại danh sách
            </button>
            
            <button
              onClick={() => navigate('/services')}
              className="flex items-center justify-center px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg"
            >
              🏥 Tiếp tục mua sắm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage; 