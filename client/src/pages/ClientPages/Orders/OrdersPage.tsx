import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaEye, FaSpinner, FaReceipt, FaCalendarAlt, FaMoneyBillWave } from 'react-icons/fa';

interface Order {
  orderId: string;
  orderCode: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  paymentUrl?: string;
}

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      // TODO: Gọi API để lấy danh sách đơn hàng
      // const response = await getMyOrders();
      // setOrders(response);
      
      // Mock data cho demo
      setOrders([
        {
          orderId: '1',
          orderCode: 'DH202508270048291918',
          totalAmount: 90000,
          status: 'PAID',
          createdAt: '2025-01-27T10:00:00Z',
        }
      ]);
    } catch (error) {
      console.error('Lỗi khi tải đơn hàng:', error);
      toast.error('Không thể tải danh sách đơn hàng');
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

  const handleViewOrder = (orderId: string) => {
    navigate(`/orders/${orderId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="inline-block animate-spin text-6xl text-blue-600 mb-4" />
          <p className="text-xl text-gray-600">Đang tải danh sách đơn hàng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <FaReceipt className="inline-block text-6xl mb-4 text-blue-300" />
          <h1 className="text-5xl font-bold mb-4">📋 Đơn Hàng Của Tôi</h1>
          <p className="text-xl text-blue-100">
            Theo dõi và quản lý đơn hàng của bạn
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {orders.length === 0 ? (
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-2xl shadow-xl p-12">
              <FaReceipt className="inline-block text-8xl text-gray-300 mb-6" />
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Chưa có đơn hàng nào</h2>
              <p className="text-gray-600 text-lg mb-8">
                Bạn chưa có đơn hàng nào. Hãy khám phá các dịch vụ của chúng tôi!
              </p>
              <button
                onClick={() => navigate('/services')}
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-lg transition-colors"
              >
                🏥 Khám phá dịch vụ
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="px-8 py-6 bg-gray-50 border-b">
                <h2 className="text-2xl font-bold text-gray-800">
                  Tổng cộng {orders.length} đơn hàng
                </h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Mã đơn hàng
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ngày tạo
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Số tiền
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trạng thái
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Hành động
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order) => {
                      const statusDisplay = getStatusDisplay(order.status);
                      return (
                        <tr key={order.orderId} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {order.orderCode}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center text-sm text-gray-500">
                              <FaCalendarAlt className="mr-2" />
                              {formatDate(order.createdAt)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center text-sm font-semibold text-blue-600">
                              <FaMoneyBillWave className="mr-2" />
                              {formatAmount(order.totalAmount)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusDisplay.color}`}>
                              {statusDisplay.icon} {statusDisplay.text}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleViewOrder(order.orderId)}
                              className="flex items-center text-blue-600 hover:text-blue-900 transition-colors"
                            >
                              <FaEye className="mr-1" />
                              Xem chi tiết
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage; 