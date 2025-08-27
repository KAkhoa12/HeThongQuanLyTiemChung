import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaCheckCircle, FaTimesCircle, FaSpinner, FaHome, FaReceipt, FaWhatsapp } from 'react-icons/fa';
import { updateOrderStatus } from '../../services/order.service';

interface PaymentResult {
  partnerCode: string;
  orderId: string;
  requestId: string;
  amount: string;
  orderInfo: string;
  orderType: string;
  transId: string;
  resultCode: string;
  message: string;
  payType: string;
  responseTime: string;
  extraData: string;
  signature: string;
}

const PaymentSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    processPaymentResult();
  }, [searchParams]);

  const processPaymentResult = async () => {
    try {
      // Lấy thông tin từ URL params
      const result: PaymentResult = {
        partnerCode: searchParams.get('partnerCode') || '',
        orderId: searchParams.get('orderId') || '',
        requestId: searchParams.get('requestId') || '',
        amount: searchParams.get('amount') || '',
        orderInfo: searchParams.get('orderInfo') || '',
        orderType: searchParams.get('orderType') || '',
        transId: searchParams.get('transId') || '',
        resultCode: searchParams.get('resultCode') || '',
        message: searchParams.get('message') || '',
        payType: searchParams.get('payType') || '',
        responseTime: searchParams.get('responseTime') || '',
        extraData: searchParams.get('extraData') || '',
        signature: searchParams.get('signature') || ''
      };

      setPaymentResult(result);

      // Kiểm tra kết quả thanh toán
      const success = result.resultCode === '0';
      setIsSuccess(success);

      // Nếu thanh toán thành công, cập nhật trạng thái đơn hàng
      if (success) {
        try {
          // Cập nhật trạng thái đơn hàng thành "PAID"
          // Sử dụng orderId từ URL params (đây là maDonHang từ database)
          await updateOrderStatus(result.orderId, "PAID");
          toast.success('Thanh toán thành công! Đơn hàng đã được cập nhật! 🎉');
          
          // Clear cart sau khi thanh toán thành công
          localStorage.removeItem('vaccineCart');
        } catch (updateError) {
          console.error('Lỗi khi cập nhật trạng thái đơn hàng:', updateError);
          toast.warning('Thanh toán thành công nhưng không thể cập nhật trạng thái đơn hàng');
        }
      } else {
        toast.error(`Thanh toán thất bại: ${result.message}`);
      }

      setLoading(false);
    } catch (error) {
      console.error('Lỗi khi xử lý kết quả thanh toán:', error);
      toast.error('Có lỗi xảy ra khi xử lý kết quả thanh toán');
      setLoading(false);
    }
  };

  const formatAmount = (amount: string) => {
    const numAmount = parseInt(amount);
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(numAmount);
  };

  const formatDateTime = (timestamp: string) => {
    const date = new Date(parseInt(timestamp));
    return date.toLocaleString('vi-VN');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleViewOrder = () => {
    // Chuyển đến trang chi tiết đơn hàng
    if (paymentResult?.orderId) {
      navigate(`/dashboard/invoices/${paymentResult.orderId}`);
    } else {
      navigate('/dashboard/invoices');
    }
  };

  const handleContactSupport = () => {
    // TODO: Mở chat hoặc gọi điện hỗ trợ
    window.open('https://wa.me/84901234567', '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="inline-block animate-spin text-6xl text-blue-600 mb-4" />
          <p className="text-xl text-gray-600">Đang xử lý kết quả thanh toán...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          {isSuccess ? (
            <>
              <FaCheckCircle className="inline-block text-8xl mb-4 text-green-300" />
              <h1 className="text-5xl font-bold mb-4">🎉 Thanh Toán Thành Công!</h1>
              <p className="text-xl text-blue-100">
                Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi
              </p>
            </>
          ) : (
            <>
              <FaTimesCircle className="inline-block text-8xl mb-4 text-red-300" />
              <h1 className="text-5xl font-bold mb-4">❌ Thanh Toán Thất Bại</h1>
              <p className="text-xl text-blue-100">
                Đã có lỗi xảy ra trong quá trình thanh toán
              </p>
            </>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Payment Result Card */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                {isSuccess ? 'Thông Tin Thanh Toán' : 'Chi Tiết Lỗi'}
              </h2>
              <div className={`inline-flex items-center px-6 py-3 rounded-full text-lg font-semibold ${
                isSuccess 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {isSuccess ? (
                  <>
                    <FaCheckCircle className="mr-2" />
                    Giao dịch thành công
                  </>
                ) : (
                  <>
                    <FaTimesCircle className="mr-2" />
                    Giao dịch thất bại
                  </>
                )}
              </div>
            </div>

            {/* Payment Details */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Column - Basic Info */}
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Thông Tin Đơn Hàng</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mã đơn hàng:</span>
                      <span className="font-semibold text-gray-800">{paymentResult?.orderId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Số tiền:</span>
                      <span className="font-semibold text-blue-600 text-lg">
                        {formatAmount(paymentResult?.amount || '0')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phương thức:</span>
                      <span className="font-semibold text-gray-800 capitalize">
                        {paymentResult?.orderType?.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Thời gian:</span>
                      <span className="font-semibold text-gray-800">
                        {formatDateTime(paymentResult?.responseTime || '0')}
                      </span>
                    </div>
                  </div>
                </div>

                {isSuccess && (
                  <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                    <h3 className="text-xl font-semibold text-green-800 mb-4">✅ Xác Nhận</h3>
                    <p className="text-green-700">
                      Đơn hàng của bạn đã được xác nhận và <strong>trạng thái đã được cập nhật thành "Đã Thanh Toán"</strong>.
                      Chúng tôi sẽ gửi email xác nhận và liên hệ với bạn để sắp xếp lịch hẹn.
                    </p>
                  </div>
                )}
              </div>

              {/* Right Column - Technical Details */}
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Chi Tiết Kỹ Thuật</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Partner Code:</span>
                      <span className="font-mono text-gray-800">{paymentResult?.partnerCode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Request ID:</span>
                      <span className="font-mono text-gray-800">{paymentResult?.requestId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Transaction ID:</span>
                      <span className="font-mono text-gray-800">{paymentResult?.transId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Result Code:</span>
                      <span className={`font-mono font-semibold ${
                        paymentResult?.resultCode === '0' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {paymentResult?.resultCode}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Pay Type:</span>
                      <span className="font-mono text-gray-800 capitalize">
                        {paymentResult?.payType}
                      </span>
                    </div>
                  </div>
                </div>

                {!isSuccess && (
                  <div className="bg-red-50 rounded-lg p-6 border border-red-200">
                    <h3 className="text-xl font-semibold text-red-800 mb-4">❌ Thông Báo Lỗi</h3>
                    <p className="text-red-700 mb-4">
                      {paymentResult?.message || 'Đã có lỗi xảy ra trong quá trình thanh toán.'}
                    </p>
                    <p className="text-red-600 text-sm">
                      Vui lòng liên hệ với chúng tôi để được hỗ trợ hoặc thử lại sau.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Order Info */}
            {paymentResult?.orderInfo && (
              <div className="mt-8 bg-blue-50 rounded-lg p-6 border border-blue-200">
                <h3 className="text-xl font-semibold text-blue-800 mb-4">📋 Thông Tin Đơn Hàng</h3>
                <p className="text-blue-700">{paymentResult.orderInfo}</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleGoHome}
              className="flex items-center justify-center px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg"
            >
              <FaHome className="mr-2" />
              Về Trang Chủ
            </button>

            {isSuccess && (
              <button
                onClick={handleViewOrder}
                className="flex items-center justify-center px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold text-lg"
              >
                <FaReceipt className="mr-2" />
                Xem Đơn Hàng
              </button>
            )}

            <button
              onClick={handleContactSupport}
              className="flex items-center justify-center px-8 py-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold text-lg"
            >
              <FaWhatsapp className="mr-2" />
              Liên Hệ Hỗ Trợ
            </button>
          </div>

          {/* Additional Info */}
          <div className="mt-12 text-center text-gray-600">
            <p className="mb-2">
              Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi:
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
              <span>📧 Email: support@huitkit.com</span>
              <span>📞 Hotline: 1900-xxxx</span>
              <span>🕒 Giờ làm việc: 8:00 - 18:00 (Thứ 2 - Thứ 7)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage; 