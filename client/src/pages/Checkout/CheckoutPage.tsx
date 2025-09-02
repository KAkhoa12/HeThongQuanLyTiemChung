import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../hooks/useToast';
import { Service } from '../../types/service.types';
import {
  createOrder,
  createMoMoPayment,
  convertCartToOrder,
  OrderResponse,
  MoMoPaymentResponse,
} from '../../services/order.service';
import { createDonHangKhuyenMai } from '../../services/donHangKhuyenMai.service';
import {
  getMyProfile,
  updateProfile,
  updateHealthInfo,
} from '../../services/user.service';
import { UserCompleteProfileDto, HealthInfoDto } from '../../types/user.types';
import {
  validateKhuyenMaiCode,
  KhuyenMaiDto,
} from '../../services/khuyenMai.service';
import { useValidateKhuyenMaiCode } from '../../hooks';
interface CartItem {
  service: Service;
  quantity: number;
  addedAt: Date;
}

interface CustomerInfo {
  fullName: string;
  phone: string;
  email: string;
  dateOfBirth: string;
  address: string;
  paymentMethod: string;
}

interface PaymentInfo {
  paymentMethod: string;
  cardNumber?: string;
  cardHolder?: string;
  expiryDate?: string;
  cvv?: string;
}

const CheckoutPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [orderCreated, setOrderCreated] = useState<OrderResponse | null>(null);
  const [paymentCreated, setPaymentCreated] =
    useState<MoMoPaymentResponse | null>(null);
  const [userProfile, setUserProfile] = useState<UserCompleteProfileDto | null>(
    null,
  );
  const [profileLoading, setProfileLoading] = useState(true);
  const { showError, showSuccess, showWarning } = useToast();
  // Promotion states
  const [promotionCode, setPromotionCode] = useState('');
  const [appliedPromotion, setAppliedPromotion] = useState<KhuyenMaiDto | null>(
    null,
  );
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isApplyingPromotion, setIsApplyingPromotion] = useState(false);

  const navigate = useNavigate();
  const {
    status: statusValidatePromotion,
    execute: executeValidatePromotion,
    loading: loadingValidatePromotion,
    data: dataValidatePromotion,
    error: errorValidatePromotion,
  } = useValidateKhuyenMaiCode(promotionCode);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    fullName: '',
    phone: '',
    email: '',
    dateOfBirth: '',
    address: '',
    paymentMethod: 'momo',
  });

  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    paymentMethod: 'momo',
  });

  useEffect(() => {
    loadCartFromStorage();
    loadUserProfile();
  }, []);

  // Theo dõi thay đổi của status validate promotion
  useEffect(() => {
    if (statusValidatePromotion === 'error' && errorValidatePromotion) {
      showError('Lỗi', errorValidatePromotion);
    }
  }, [statusValidatePromotion, errorValidatePromotion, showError]);

  const loadCartFromStorage = () => {
    try {
      const savedCart = localStorage.getItem('vaccineCart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        const cartWithDates = parsedCart.map((item: any) => ({
          ...item,
          addedAt: new Date(item.addedAt),
        }));
        setCartItems(cartWithDates);
      } else {
        showError('Lỗi', 'Giỏ hàng trống!');
        navigate('/cart');
        return;
      }
    } catch (error) {
      console.error('Error loading cart from storage:', error);
      showError('Lỗi', 'Lỗi khi tải giỏ hàng!');
      navigate('/cart');
      return;
    } finally {
      setLoading(false);
    }
  };

  const loadUserProfile = async () => {
    try {
      setProfileLoading(true);
      const profile = await getMyProfile();
      setUserProfile(profile);

      // Tự động điền thông tin cá nhân nếu có
      if (profile) {
        setCustomerInfo((prev) => ({
          ...prev,
          fullName: profile.ten || '',
          phone: profile.soDienThoai || '',
          email: profile.email || '',
          dateOfBirth: profile.ngaySinh || '',
          address: profile.diaChi || '',
          // Các trường khác sẽ được điền từ healthInfo
        }));
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      showError(
        'Lỗi',
        'Không thể tải thông tin người dùng. Vui lòng đăng nhập lại.',
      );
      navigate('/login');
      return;
    } finally {
      setProfileLoading(false);
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const price = item.service.price || 0;
      return total + price * item.quantity;
    }, 0);
  };

  const getFinalPrice = () => {
    const totalPrice = getTotalPrice();
    return totalPrice - discountAmount;
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const handleCustomerInfoChange = (
    field: keyof CustomerInfo,
    value: string,
  ) => {
    setCustomerInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePaymentInfoChange = (field: keyof PaymentInfo, value: string) => {
    setPaymentInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleApplyPromotion = async () => {
    if (!promotionCode.trim()) {
      showError('Lỗi', 'Vui lòng nhập mã khuyến mãi');
      return;
    }

    setIsApplyingPromotion(true);
    try {
      const totalPrice = getTotalPrice();

      // Gọi API validate mã khuyến mãi
      await executeValidatePromotion(promotionCode.trim().toUpperCase());
      console.log(dataValidatePromotion);
      // Kiểm tra dữ liệu trả về sau khi API hoàn thành
      if (dataValidatePromotion) {
        // Calculate discount amount
        let discountAmount = 0;
        let finalAmount = totalPrice;

        if (dataValidatePromotion.loaiGiam === 'PERCENTAGE') {
          // Percentage discount
          discountAmount =
            (totalPrice * (dataValidatePromotion.giaTriGiam || 0)) / 100;

          // Apply maximum discount limit if exists
          if (
            dataValidatePromotion.giamToiDa &&
            discountAmount > dataValidatePromotion.giamToiDa
          ) {
            discountAmount = dataValidatePromotion.giamToiDa;
          }
        } else if (dataValidatePromotion.loaiGiam === 'FIXED_AMOUNT') {
          // Fixed amount discount
          discountAmount = dataValidatePromotion.giaTriGiam || 0;
        }

        // Check minimum order value
        if (
          dataValidatePromotion.giaTriToiThieu &&
          totalPrice < dataValidatePromotion.giaTriToiThieu
        ) {
          showError(
            'Lỗi',
            `Đơn hàng tối thiểu phải từ ${dataValidatePromotion.giaTriToiThieu.toLocaleString(
              'vi-VN',
            )} VNĐ để áp dụng mã khuyến mãi`,
          );
          setPromotionCode('');
          return;
        }

        // Ensure discount doesn't exceed total amount
        if (discountAmount > totalPrice) {
          discountAmount = totalPrice;
        }

        finalAmount = totalPrice - discountAmount;

        setAppliedPromotion(dataValidatePromotion);
        setDiscountAmount(dataValidatePromotion.giaTriGiam || 0);
        showSuccess(
          'Thành công',
          `Áp dụng thành công mã ${
            dataValidatePromotion.code
          } - Giảm ${discountAmount.toLocaleString('vi-VN')} VNĐ`,
        );
      }
    } catch (error: any) {
      console.error('Error applying promotion:', error);
      const errorMessage =
        error?.message || 'Có lỗi xảy ra khi kiểm tra mã khuyến mãi';
      showError('Lỗi', errorMessage);
      setPromotionCode('');
    } finally {
      setIsApplyingPromotion(false);
    }
  };

  const handleRemovePromotion = () => {
    setAppliedPromotion(null);
    setDiscountAmount(0);
    setPromotionCode('');
    showWarning('Thông báo', 'Đã xóa mã khuyến mãi');
  };

  const validateCustomerInfo = (): boolean => {
    // Kiểm tra thông tin cơ bản
    const basicRequiredFields: (keyof CustomerInfo)[] = [
      'fullName',
      'phone',
      'email',
      'dateOfBirth',
      'address',
    ];

    for (const field of basicRequiredFields) {
      if (!customerInfo[field] || customerInfo[field].trim() === '') {
        showError('Lỗi', `Vui lòng điền ${getFieldLabel(field)}`);
        return false;
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerInfo.email)) {
      showError('Lỗi', 'Email không hợp lệ');
      return false;
    }

    // Validate phone format
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(customerInfo.phone.replace(/\s/g, ''))) {
      showError('Lỗi', 'Số điện thoại không hợp lệ');
      return false;
    }

    return true;
  };

  const getFieldLabel = (field: keyof CustomerInfo): string => {
    const labels: Record<keyof CustomerInfo, string> = {
      fullName: 'họ tên',
      phone: 'số điện thoại',
      email: 'email',
      dateOfBirth: 'ngày sinh',
      address: 'địa chỉ',
      paymentMethod: 'phương thức thanh toán',
    };
    return labels[field];
  };

  const nextStep = () => {
    if (currentStep === 1) {
      if (!validateCustomerInfo()) {
        return;
      }
    }
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateCustomerInfo()) {
      return;
    }

    setSubmitting(true);

    try {
      // Bước 1: Tạo đơn hàng
      const orderData = convertCartToOrder(cartItems, customerInfo);
      const orderResponse = await createOrder(orderData);
      setOrderCreated(orderResponse);

      // Bước 2: Nếu thanh toán MoMo, tạo thanh toán
      if (paymentInfo.paymentMethod === 'momo') {
        const paymentData = {
          orderId: orderResponse.orderId, // Sử dụng orderId (maDonHang) thay vì orderCode
          orderCode: orderResponse.orderCode, // Giữ lại orderCode để hiển thị
          amount: getFinalPrice(), // Sử dụng giá sau khi áp dụng khuyến mãi
          orderInfo: `Thanh toan don hang ${orderResponse.orderCode}`,
          customerName: customerInfo.fullName,
          customerPhone: customerInfo.phone,
          customerEmail: customerInfo.email,
          // Thêm thông tin khuyến mãi nếu có
          promotionCode: appliedPromotion?.code || null,
          discountAmount: discountAmount,
        };

        const paymentResponse = await createMoMoPayment(paymentData);
        setPaymentCreated(paymentResponse);

        // Chuyển hướng đến trang thanh toán MoMo
        if (paymentResponse.paymentUrl) {
          window.location.href = paymentResponse.paymentUrl;
          return;
        }
      }

      // Nếu không phải MoMo hoặc có lỗi, xử lý như cũ
      showSuccess(
        'Thành công',
        'Đặt hàng thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.',
      );

      // Clear cart after successful order
      localStorage.removeItem('vaccineCart');

      navigate('/order-success');
    } catch (error: any) {
      console.error('Order failed:', error);
      const errorMessage =
        error?.response?.data?.message ||
        'Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.';
      showError('Lỗi', errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-xl text-gray-600">
              {loading
                ? 'Đang tải thông tin thanh toán...'
                : 'Đang tải thông tin người dùng...'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">💳 Thanh Toán</h1>
          <p className="text-xl text-blue-100">
            Hoàn tất thông tin để đặt hàng
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    currentStep >= step
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {step}
                </div>
                {step < 3 && (
                  <div
                    className={`w-20 h-1 mx-4 ${
                      currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4 space-x-16">
            <span
              className={`text-sm ${
                currentStep >= 1 ? 'text-blue-600 font-medium' : 'text-gray-500'
              }`}
            >
              Thông tin cá nhân
            </span>
            <span
              className={`text-sm ${
                currentStep >= 2 ? 'text-blue-600 font-medium' : 'text-gray-500'
              }`}
            >
              Xác nhận đơn hàng
            </span>
            <span
              className={`text-sm ${
                currentStep >= 3 ? 'text-blue-600 font-medium' : 'text-gray-500'
              }`}
            >
              Thanh toán
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              {/* Step 1: Customer Information */}
              {currentStep === 1 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    Thông tin cá nhân
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Họ và tên <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={customerInfo.fullName}
                        onChange={(e) =>
                          handleCustomerInfoChange('fullName', e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Nhập họ và tên đầy đủ"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Số điện thoại <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={customerInfo.phone}
                        onChange={(e) =>
                          handleCustomerInfoChange('phone', e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0123456789"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={customerInfo.email}
                        onChange={(e) =>
                          handleCustomerInfoChange('email', e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="example@email.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ngày sinh <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={customerInfo.dateOfBirth}
                        onChange={(e) =>
                          handleCustomerInfoChange(
                            'dateOfBirth',
                            e.target.value,
                          )
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Địa chỉ <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={customerInfo.address}
                        onChange={(e) =>
                          handleCustomerInfoChange('address', e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Số nhà, tên đường"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Order Confirmation */}
              {currentStep === 2 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    Xác nhận đơn hàng
                  </h2>

                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div
                        key={item.service.id}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                              {item.service.name}
                            </h3>
                            {item.service.description && (
                              <p className="text-gray-600 text-sm mb-2">
                                {item.service.description}
                              </p>
                            )}
                            <div className="flex items-center text-sm text-gray-500">
                              <span className="mr-4">
                                Số lượng: {item.quantity}
                              </span>
                              {item.service.serviceTypeName && (
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                  {item.service.serviceTypeName}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-green-600">
                              {item.service.price
                                ? `${(
                                    item.service.price * item.quantity
                                  ).toLocaleString('vi-VN')} VNĐ`
                                : 'Liên hệ'}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">
                      ℹ️ Thông tin khách hàng
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
                      <div>
                        <strong>Họ tên:</strong> {customerInfo.fullName}
                      </div>
                      <div>
                        <strong>SĐT:</strong> {customerInfo.phone}
                      </div>
                      <div>
                        <strong>Email:</strong> {customerInfo.email}
                      </div>
                      <div>
                        <strong>Địa chỉ:</strong> {customerInfo.address}
                      </div>
                    </div>
                  </div>

                  {/* Tóm tắt giá tiền */}
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-3">
                      💰 Tóm tắt giá tiền
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Tổng giá dịch vụ:</span>
                        <span className="font-medium">
                          {getTotalPrice().toLocaleString('vi-VN')} VNĐ
                        </span>
                      </div>
                      {discountAmount > 0 ? (
                        <div className="flex justify-between text-green-600">
                          <span>Giảm giá ({appliedPromotion?.code}):</span>
                          <span className="font-medium">
                            -{discountAmount.toLocaleString('vi-VN')} VNĐ
                          </span>
                        </div>
                      ) : (
                        <div className="flex justify-between text-gray-500">
                          <span>Giảm giá:</span>
                          <span className="font-medium">0 VNĐ</span>
                        </div>
                      )}
                      <div className="border-t border-gray-200 pt-2 mt-2">
                        <div className="flex justify-between text-lg font-bold text-gray-800">
                          <span>Tổng thanh toán:</span>
                          <span
                            className={
                              discountAmount > 0
                                ? 'text-green-600'
                                : 'text-gray-800'
                            }
                          >
                            {getFinalPrice().toLocaleString('vi-VN')} VNĐ
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {appliedPromotion ? (
                    <div className="mt-4 p-4 bg-green-50 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-2">
                        🎁 Mã khuyến mãi đã áp dụng
                      </h4>
                      <div className="space-y-2 text-sm text-green-700">
                        <div>
                          <strong>Tên khuyến mãi:</strong>{' '}
                          {appliedPromotion.tenKhuyenMai}
                        </div>
                        <div>
                          <strong>Mã:</strong> {appliedPromotion.code}
                        </div>
                        <div>
                          <strong>Giảm giá:</strong>{' '}
                          {appliedPromotion.loaiGiam === 'PERCENTAGE'
                            ? `Giảm ${appliedPromotion.giaTriGiam || 0}%`
                            : `Giảm ${(
                                appliedPromotion.giaTriGiam || 0
                              ).toLocaleString('vi-VN')} VNĐ`}
                        </div>
                        {appliedPromotion.loaiGiam === 'PERCENTAGE' &&
                          appliedPromotion.giamToiDa && (
                            <div>
                              <strong>Giảm tối đa:</strong>{' '}
                              {appliedPromotion.giamToiDa.toLocaleString(
                                'vi-VN',
                              )}{' '}
                              VNĐ
                            </div>
                          )}
                        <div>
                          <strong>Giá sau giảm:</strong>{' '}
                          {getFinalPrice().toLocaleString('vi-VN')} VNĐ
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-gray-600 mb-2">
                        💡 Chưa áp dụng mã khuyến mãi
                      </h4>
                      <div className="text-sm text-gray-600">
                        <p>
                          Bạn có thể nhập mã khuyến mãi ở bên phải để được giảm
                          giá.
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          💡 Mã khuyến mãi giúp tiết kiệm chi phí cho đơn hàng
                          của bạn.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Payment */}
              {currentStep === 3 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    Phương thức thanh toán
                  </h2>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-4">
                        Chọn phương thức thanh toán{' '}
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="space-y-3">
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="momo"
                            checked={paymentInfo.paymentMethod === 'momo'}
                            onChange={(e) =>
                              handlePaymentInfoChange(
                                'paymentMethod',
                                e.target.value,
                              )
                            }
                            className="w-4 h-4 text-blue-600"
                          />
                          <span className="text-gray-700">
                            📱 Thanh toán qua MoMo
                          </span>
                        </label>

                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="cash"
                            checked={paymentInfo.paymentMethod === 'cash'}
                            onChange={(e) =>
                              handlePaymentInfoChange(
                                'paymentMethod',
                                e.target.value,
                              )
                            }
                            className="w-4 h-4 text-blue-600"
                          />
                          <span className="text-gray-700">
                            💵 Thanh toán tiền mặt khi nhận dịch vụ
                          </span>
                        </label>

                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="bank"
                            checked={paymentInfo.paymentMethod === 'bank'}
                            onChange={(e) =>
                              handlePaymentInfoChange(
                                'paymentMethod',
                                e.target.value,
                              )
                            }
                            className="w-4 h-4 text-blue-600"
                          />
                          <span className="text-gray-700">
                            🏦 Chuyển khoản ngân hàng
                          </span>
                        </label>
                      </div>
                    </div>

                    {paymentInfo.paymentMethod === 'momo' && (
                      <div className="p-4 bg-pink-50 rounded-lg">
                        <h4 className="font-semibold text-pink-800 mb-2">
                          📱 Thanh toán MoMo
                        </h4>
                        <div className="space-y-2 text-sm text-pink-700">
                          <div>
                            • Sử dụng ứng dụng MoMo để quét mã QR hoặc nhập
                            thông tin
                          </div>
                          <div>• Thanh toán nhanh chóng và an toàn</div>
                          <div>• Hỗ trợ tất cả các ngân hàng tại Việt Nam</div>
                          {discountAmount > 0 && (
                            <div className="mt-3 p-3 bg-green-100 rounded-lg">
                              <div className="font-medium text-green-800">
                                💰 Số tiền thanh toán:{' '}
                                {getFinalPrice().toLocaleString('vi-VN')} VNĐ
                              </div>
                              <div className="text-xs text-green-600">
                                (Đã áp dụng giảm giá{' '}
                                {discountAmount.toLocaleString('vi-VN')} VNĐ)
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {paymentInfo.paymentMethod === 'bank' && (
                      <div className="p-4 bg-green-50 rounded-lg">
                        <h4 className="font-semibold text-green-800 mb-2">
                          🏦 Thông tin chuyển khoản
                        </h4>
                        <div className="space-y-2 text-sm text-green-700">
                          <div>
                            <strong>Ngân hàng:</strong> Vietcombank
                          </div>
                          <div>
                            <strong>Số tài khoản:</strong> 1234567890
                          </div>
                          <div>
                            <strong>Chủ tài khoản:</strong> CONG TY TIEM CHUNG
                            HUITKIT
                          </div>
                          <div>
                            <strong>Nội dung:</strong> [SĐT] - [Họ tên]
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                {currentStep > 1 && (
                  <button
                    onClick={prevStep}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    ← Quay lại
                  </button>
                )}

                <div className="ml-auto">
                  {currentStep < 3 ? (
                    <button
                      onClick={nextStep}
                      className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200"
                    >
                      Tiếp tục →
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="px-8 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors duration-200"
                    >
                      {submitting ? 'Đang xử lý...' : '💳 Đặt hàng ngay'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6">
                Tóm tắt đơn hàng
              </h3>

              {/* Promotion Code Section */}
              <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                <h4 className="font-semibold text-purple-800 mb-3">
                  🎁 Mã khuyến mãi
                </h4>

                {!appliedPromotion ? (
                  <div className="space-y-3">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={promotionCode}
                        onChange={(e) =>
                          setPromotionCode(e.target.value.toUpperCase())
                        }
                        placeholder="Nhập mã khuyến mãi"
                        className="flex-1 px-3 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                        maxLength={20}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && promotionCode.trim()) {
                            handleApplyPromotion();
                          }
                        }}
                      />
                      <button
                        onClick={handleApplyPromotion}
                        disabled={
                          isApplyingPromotion ||
                          loadingValidatePromotion ||
                          !promotionCode.trim()
                        }
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white rounded-lg text-sm font-medium transition-colors duration-200"
                      >
                        {isApplyingPromotion || loadingValidatePromotion
                          ? 'Đang kiểm tra...'
                          : 'Áp dụng'}
                      </button>
                    </div>
                    <p className="text-xs text-purple-600">
                      💡 Nhập mã khuyến mãi để được giảm giá. Nhấn Enter để áp
                      dụng nhanh.
                    </p>
                    {statusValidatePromotion === 'error' &&
                      errorValidatePromotion && (
                        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-xs text-red-600">
                            ❌ {errorValidatePromotion}
                          </p>
                        </div>
                      )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex-1">
                        <div className="font-medium text-green-800 text-sm">
                          {appliedPromotion.tenKhuyenMai}
                        </div>
                        <div className="text-xs text-green-600">
                          Mã: {appliedPromotion.code}
                        </div>
                        {appliedPromotion.loaiGiam === 'PERCENTAGE' ? (
                          <div className="text-xs text-green-600">
                            Giảm {appliedPromotion.giaTriGiam || 0}%
                            {appliedPromotion.giamToiDa &&
                              ` (tối đa ${appliedPromotion.giamToiDa.toLocaleString(
                                'vi-VN',
                              )} VNĐ)`}
                          </div>
                        ) : (
                          <div className="text-xs text-green-600">
                            Giảm{' '}
                            {(appliedPromotion.giaTriGiam || 0).toLocaleString(
                              'vi-VN',
                            )}{' '}
                            VNĐ
                          </div>
                        )}
                      </div>
                      <button
                        onClick={handleRemovePromotion}
                        className="ml-2 p-1 text-red-500 hover:text-red-700 transition-colors duration-200"
                        title="Xóa mã khuyến mãi"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Tổng dịch vụ:</span>
                  <span>{getTotalItems()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Phí dịch vụ:</span>
                  <span>{getTotalPrice().toLocaleString('vi-VN')} VNĐ</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Giảm giá:</span>
                    <span>-{discountAmount.toLocaleString('vi-VN')} VNĐ</span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-lg font-bold text-gray-800">
                    <span>Tổng cộng:</span>
                    <span>{getFinalPrice().toLocaleString('vi-VN')} VNĐ</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">
                  📋 Dịch vụ đã chọn
                </h4>
                <div className="space-y-2 text-sm text-blue-700">
                  {cartItems.map((item) => (
                    <div key={item.service.id} className="flex justify-between">
                      <span className="truncate">{item.service.name}</span>
                      <span className="font-medium">x{item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-2">
                  ⚠️ Lưu ý quan trọng
                </h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Vui lòng kiểm tra kỹ thông tin trước khi đặt hàng</li>
                  <li>• Chúng tôi sẽ liên hệ xác nhận trong vòng 24h</li>
                  <li>• Giá dịch vụ có thể thay đổi theo thời gian</li>
                  <li>• Hủy đơn hàng trước 24h khi nhận dịch vụ</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
