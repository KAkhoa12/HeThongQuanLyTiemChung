import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '../../../hooks/useToast';
import { Service } from '../../../types/service.types';
import {
  createOrder,
  createMoMoPayment,
  OrderResponse,
  MoMoPaymentResponse,
  CheckOrderEligibilityRequest,
  CheckOrderEligibilityResponse,
  checkOrderEligibility,
} from '../../../services/order.service';
import { useKhachHang } from '../../../hooks/useKhachHang';
import { useServices } from '../../../hooks/useService';
import { useAllLocations } from '../../../hooks/useLocations';
import {
  KhuyenMaiDto,
} from '../../../services/khuyenMai.service';
import { useValidateKhuyenMaiCode } from '../../../hooks';
import EligibilityErrorModal from '../../../components/Checkout/EligibilityErrorModal';

interface SelectedService {
  service: Service;
  quantity: number;
}

interface CustomerInfo {
  fullName: string;
  phone: string;
  email: string;
  dateOfBirth: string;
  address: string;
  paymentMethod: string;
  preferredLocationId: string;
}

interface PaymentInfo {
  paymentMethod: string;
  cardNumber?: string;
  cardHolder?: string;
  expiryDate?: string;
  cvv?: string;
}

const AdminCheckoutPage: React.FC = () => {
  const { customerId } = useParams<{ customerId: string }>();
  const [selectedServices, setSelectedServices] = useState<SelectedService[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [, setOrderCreated] = useState<OrderResponse | null>(null);
  const [, setPaymentCreated] = useState<MoMoPaymentResponse | null>(null);
  const [customerProfile, setCustomerProfile] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const { showError, showSuccess, showWarning } = useToast();
  
  // Promotion states
  const [promotionCode, setPromotionCode] = useState('');
  const [appliedPromotion, setAppliedPromotion] = useState<KhuyenMaiDto | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isApplyingPromotion, setIsApplyingPromotion] = useState(false);
  
  // Eligibility check states
  const [eligibilityModalOpen, setEligibilityModalOpen] = useState(false);
  const [eligibilityData, setEligibilityData] = useState<CheckOrderEligibilityResponse | null>(null);

  const navigate = useNavigate();
  const { data: khachHang, loading: customerLoading, execute: fetchCustomer } = useKhachHang(customerId || '');
  const { data: servicesData, loading: servicesLoading, execute: fetchServices } = useServices();
  const { data: locationsData, loading: locationsLoading, execute: fetchLocations } = useAllLocations();
  
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
    preferredLocationId: '',
  });

  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    paymentMethod: 'momo',
  });

  useEffect(() => {
    if (customerId) {
      fetchCustomer({ id: customerId });
    }
    // Fetch services and locations when component mounts
    fetchServices({ page: 1, pageSize: 100 });
    fetchLocations();
  }, [customerId]);

  // Load customer profile when data is available
  useEffect(() => {
    if (khachHang) {
      setCustomerProfile(khachHang);
      setCustomerInfo({
        fullName: khachHang.ten || '',
        phone: khachHang.soDienThoai || '',
        email: khachHang.email || '',
        dateOfBirth: khachHang.ngaySinh || '',
        address: khachHang.diaChi || '',
        paymentMethod: 'momo',
        preferredLocationId: '',
      });
      setProfileLoading(false);
    }
  }, [khachHang]);

  // Track promotion validation status changes
  useEffect(() => {
    if (statusValidatePromotion === 'error' && errorValidatePromotion) {
      showError('Lỗi', errorValidatePromotion);
    }
  }, [statusValidatePromotion, errorValidatePromotion, showError]);

  // Service selection functions
  const addServiceToSelection = (service: Service) => {
    setSelectedServices(prev => {
      const existingIndex = prev.findIndex(item => item.service.id === service.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      } else {
        return [...prev, { service, quantity: 1 }];
      }
    });
  };

  const removeServiceFromSelection = (serviceId: string) => {
    setSelectedServices(prev => prev.filter(item => item.service.id !== serviceId));
  };

  const updateServiceQuantity = (serviceId: string, quantity: number) => {
    if (quantity <= 0) {
      removeServiceFromSelection(serviceId);
      return;
    }
    
    setSelectedServices(prev => 
      prev.map(item => 
        item.service.id === serviceId 
          ? { ...item, quantity }
          : item
      )
    );
  };

  const getTotalPrice = () => {
    return selectedServices.reduce((total, item) => {
      const price = item.service.price || 0;
      return total + price * item.quantity;
    }, 0);
  };

  const getFinalPrice = () => {
    const totalPrice = getTotalPrice();
    return totalPrice - discountAmount;
  };

  const getTotalItems = () => {
    return selectedServices.reduce((total, item) => total + item.quantity, 0);
  };

  const handleCustomerInfoChange = (field: keyof CustomerInfo, value: string) => {
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

      // Call API to validate promotion code
      await executeValidatePromotion(promotionCode.trim().toUpperCase());
      console.log(dataValidatePromotion);
      
      // Check returned data after API completion
      if (dataValidatePromotion) {
        // Calculate discount amount
        let discountAmount = 0;

        if (dataValidatePromotion.loaiGiam === 'PERCENTAGE') {
          // Percentage discount
          discountAmount = (totalPrice * (dataValidatePromotion.giaTriGiam || 0)) / 100;

          // Apply maximum discount limit if exists
          if (dataValidatePromotion.giamToiDa && discountAmount > dataValidatePromotion.giamToiDa) {
            discountAmount = dataValidatePromotion.giamToiDa;
          }
        } else if (dataValidatePromotion.loaiGiam === 'FIXED_AMOUNT') {
          // Fixed amount discount
          discountAmount = dataValidatePromotion.giaTriGiam || 0;
        }

        // Check minimum order value
        if (dataValidatePromotion.giaTriToiThieu && totalPrice < dataValidatePromotion.giaTriToiThieu) {
          showError(
            'Lỗi',
            `Đơn hàng tối thiểu phải từ ${dataValidatePromotion.giaTriToiThieu.toLocaleString('vi-VN')} VNĐ để áp dụng mã khuyến mãi`,
          );
          setPromotionCode('');
          return;
        }

        // Ensure discount doesn't exceed total amount
        if (discountAmount > totalPrice) {
          discountAmount = totalPrice;
        }

        setAppliedPromotion(dataValidatePromotion);
        setDiscountAmount(discountAmount);
        showSuccess(
          'Thành công',
          `Áp dụng thành công mã ${dataValidatePromotion.code} - Giảm ${discountAmount.toLocaleString('vi-VN')} VNĐ`,
        );
      }
    } catch (error: any) {
      console.error('Error applying promotion:', error);
      const errorMessage = error?.message || 'Có lỗi xảy ra khi kiểm tra mã khuyến mãi';
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

  // Function to check eligibility - using direct API call
  const checkEligibility = async (): Promise<CheckOrderEligibilityResponse | null> => {
    try {
      const eligibilityRequest: CheckOrderEligibilityRequest = {
        items: selectedServices.map(item => ({
          serviceId: item.service.id,
          quantity: item.quantity,
          unitPrice: item.service.price || 0
        }))
      };

      console.log('Calling eligibility check with request:', eligibilityRequest);
      
      // Call the API directly instead of using the hook
      const result = await checkOrderEligibility(eligibilityRequest);
      console.log('Eligibility result:', result);
      
      return result;
    } catch (error) {
      console.error('Error checking eligibility:', error);
      showError('Lỗi', 'Không thể kiểm tra điều kiện đặt hàng');
      return null;
    }
  };

  const validateCustomerInfo = (): boolean => {
    // Check basic information
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
      preferredLocationId: 'địa điểm tiêm chủng',
    };
    return labels[field];
  };

  const nextStep = () => {
    if (currentStep === 1) {
      if (selectedServices.length === 0) {
        showError('Lỗi', 'Vui lòng chọn ít nhất một dịch vụ cho khách hàng');
        return;
      }
      if (!customerInfo.preferredLocationId) {
        showError('Lỗi', 'Vui lòng chọn địa điểm tiêm chủng');
        return;
      }
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
      // Step 0: Check eligibility before creating order
      const eligibilityResult = await checkEligibility();
      console.log('Eligibility result:', eligibilityResult);
      if (!eligibilityResult) {
        setSubmitting(false);
        return;
      }

      // If there are eligibility errors, show modal and stop
      if (!eligibilityResult.isEligible) {
        setEligibilityData(eligibilityResult);
        setEligibilityModalOpen(true);
        setSubmitting(false);
        return;
      }

      // Step 1: Create order
      const orderData = {
        customerName: customerInfo.fullName,
        customerPhone: customerInfo.phone,
        customerEmail: customerInfo.email,
        customerAddress: customerInfo.address,
        paymentMethod: customerInfo.paymentMethod,
        preferredLocationId: customerInfo.preferredLocationId,
        customerId: customerId, // Gửi customerId để chỉ định khách hàng cụ thể
        items: selectedServices.map(item => ({
          serviceId: item.service.id,
          quantity: item.quantity,
          unitPrice: item.service.price || 0
        }))
      };
      const orderResponse = await createOrder(orderData);
      setOrderCreated(orderResponse);

      // Step 2: If MoMo payment, create payment
      console.log('Payment method:', paymentInfo.paymentMethod);
      if (paymentInfo.paymentMethod === 'momo') {
        const paymentData = {
          orderId: orderResponse.orderId,
          orderCode: orderResponse.orderCode,
          amount: getFinalPrice(),
          orderInfo: `Thanh toan don hang ${orderResponse.orderCode}`,
          customerName: customerInfo.fullName,
          customerPhone: customerInfo.phone,
          customerEmail: customerInfo.email,
          // Add promotion information if available
          promotionCode: appliedPromotion?.code || null,
          discountAmount: discountAmount,
        };

        console.log('Creating MoMo payment with data:', paymentData);
        const paymentResponse = await createMoMoPayment(paymentData);
        console.log('MoMo payment response:', paymentResponse);
        setPaymentCreated(paymentResponse);

        // Redirect to MoMo payment page
        if (paymentResponse.paymentUrl) {
          console.log('Redirecting to MoMo payment URL:', paymentResponse.paymentUrl);
          window.location.href = paymentResponse.paymentUrl;
          return;
        } else {
          console.error('No payment URL received from MoMo:', paymentResponse);
          showError('Lỗi', 'Không thể tạo liên kết thanh toán MoMo. Vui lòng thử lại.');
          return;
        }
      }

      // If not MoMo or error, handle as before
      showSuccess(
        'Thành công',
        'Tạo đơn hàng thành công! Chúng tôi sẽ liên hệ với khách hàng sớm nhất.',
      );

      // Clear selected services after successful order
      setSelectedServices([]);

      navigate(`/dashboard/nguoi-dung/khach-hang/${customerId}`);
    } catch (error: any) {
      console.error('Order failed:', error);
      const errorMessage =
        error?.response?.data?.message ||
        'Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại.';
      showError('Lỗi', errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (profileLoading || customerLoading || servicesLoading || locationsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-xl text-gray-600">
              {customerLoading
                ? 'Đang tải thông tin khách hàng...'
                : servicesLoading
                ? 'Đang tải danh sách dịch vụ...'
                : locationsLoading
                ? 'Đang tải danh sách địa điểm...'
                : 'Đang tải thông tin...'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!customerProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <p className="text-xl text-gray-600">Không tìm thấy thông tin khách hàng</p>
            <button
              onClick={() => navigate('/dashboard/nguoi-dung/khach-hang')}
              className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Quay lại danh sách khách hàng
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">

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
              Chọn dịch vụ
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
              {/* Step 1: Service Selection */}
              {currentStep === 1 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    Chọn dịch vụ cho khách hàng
                  </h2>

                  {/* Available Services */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">
                      Danh sách dịch vụ có sẵn
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {servicesData?.data?.map((service: Service) => (
                        <div
                          key={service.id}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <h4 className="font-semibold text-gray-800 mb-2">
                            {service.name}
                          </h4>
                          {service.description && (
                            <p className="text-sm text-gray-600 mb-3">
                              {service.description}
                            </p>
                          )}
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-lg font-bold text-green-600">
                              {service.price
                                ? `${service.price.toLocaleString('vi-VN')} VNĐ`
                                : 'Liên hệ'}
                            </span>
                            {service.serviceTypeName && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                {service.serviceTypeName}
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => addServiceToSelection(service)}
                            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200"
                          >
                            Thêm vào đơn hàng
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Selected Services */}
                  {selectedServices.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-gray-700 mb-4">
                        Dịch vụ đã chọn
                      </h3>
                      <div className="space-y-3">
                        {selectedServices.map((item) => (
                          <div
                            key={item.service.id}
                            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50"
                          >
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-800">
                                {item.service.name}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {item.service.price
                                  ? `${item.service.price.toLocaleString('vi-VN')} VNĐ`
                                  : 'Liên hệ'}
                              </p>
                            </div>
                            <div className="flex items-center space-x-3">
                              <button
                                onClick={() => updateServiceQuantity(item.service.id, item.quantity - 1)}
                                className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center"
                              >
                                -
                              </button>
                              <span className="w-8 text-center font-medium">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateServiceQuantity(item.service.id, item.quantity + 1)}
                                className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center"
                              >
                                +
                              </button>
                              <button
                                onClick={() => removeServiceFromSelection(item.service.id)}
                                className="ml-2 p-2 text-red-500 hover:text-red-700"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Customer Information */}
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">
                      Thông tin khách hàng
                    </h3>
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
                            handleCustomerInfoChange('dateOfBirth', e.target.value)
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Địa điểm tiêm chủng <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={customerInfo.preferredLocationId}
                          onChange={(e) =>
                            handleCustomerInfoChange('preferredLocationId', e.target.value)
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Chọn địa điểm tiêm chủng</option>
                          {locationsData?.map((location: any) => (
                            <option key={location.id} value={location.id}>
                              {location.name} - {location.address}
                            </option>
                          ))}
                        </select>
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
                </div>
              )}

              {/* Step 2: Order Confirmation */}
              {currentStep === 2 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    Xác nhận đơn hàng
                  </h2>

                  <div className="space-y-4">
                    {selectedServices.map((item) => (
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
                                ? `${(item.service.price * item.quantity).toLocaleString('vi-VN')} VNĐ`
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
                      <div>
                        <strong>Địa điểm tiêm chủng:</strong> {
                          locationsData?.find((loc: any) => loc.id === customerInfo.preferredLocationId)?.name || 'Chưa chọn'
                        }
                      </div>
                    </div>
                  </div>

                  {/* Price Summary */}
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
                              discountAmount > 0 ? 'text-green-600' : 'text-gray-800'
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
                          <strong>Tên khuyến mãi:</strong> {appliedPromotion.tenKhuyenMai}
                        </div>
                        <div>
                          <strong>Mã:</strong> {appliedPromotion.code}
                        </div>
                        <div>
                          <strong>Giảm giá:</strong>{' '}
                          {appliedPromotion.loaiGiam === 'PERCENTAGE'
                            ? `Giảm ${appliedPromotion.giaTriGiam || 0}%`
                            : `Giảm ${(appliedPromotion.giaTriGiam || 0).toLocaleString('vi-VN')} VNĐ`}
                        </div>
                        {appliedPromotion.loaiGiam === 'PERCENTAGE' &&
                          appliedPromotion.giamToiDa && (
                            <div>
                              <strong>Giảm tối đa:</strong>{' '}
                              {appliedPromotion.giamToiDa.toLocaleString('vi-VN')} VNĐ
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
                          Bạn có thể nhập mã khuyến mãi ở bên phải để được giảm giá.
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          💡 Mã khuyến mãi giúp tiết kiệm chi phí cho đơn hàng của khách hàng.
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
                        Chọn phương thức thanh toán <span className="text-red-500">*</span>
                      </label>
                      <div className="space-y-3">
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="momo"
                            checked={paymentInfo.paymentMethod === 'momo'}
                            onChange={(e) =>
                              handlePaymentInfoChange('paymentMethod', e.target.value)
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
                              handlePaymentInfoChange('paymentMethod', e.target.value)
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
                              handlePaymentInfoChange('paymentMethod', e.target.value)
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
                            • Sử dụng ứng dụng MoMo để quét mã QR hoặc nhập thông tin
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
                            <strong>Chủ tài khoản:</strong> CONG TY TIEM CHUNG HUITKIT
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
                      {submitting ? 'Đang xử lý...' : '💳 Tạo đơn hàng'}
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

              {/* Customer Info */}
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">
                  👤 Khách hàng
                </h4>
                <div className="text-sm text-blue-700">
                  <div><strong>Tên:</strong> {customerProfile.ten}</div>
                  <div><strong>Email:</strong> {customerProfile.email}</div>
                  <div><strong>SĐT:</strong> {customerProfile.soDienThoai || 'Chưa cập nhật'}</div>
                </div>
              </div>

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
                        onChange={(e) => setPromotionCode(e.target.value.toUpperCase())}
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
                      💡 Nhập mã khuyến mãi để được giảm giá. Nhấn Enter để áp dụng nhanh.
                    </p>
                    {statusValidatePromotion === 'error' && errorValidatePromotion && (
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
                              ` (tối đa ${appliedPromotion.giamToiDa.toLocaleString('vi-VN')} VNĐ)`}
                          </div>
                        ) : (
                          <div className="text-xs text-green-600">
                            Giảm{' '}
                            {(appliedPromotion.giaTriGiam || 0).toLocaleString('vi-VN')} VNĐ
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
                  {selectedServices.map((item) => (
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
                  <li>• Vui lòng kiểm tra kỹ thông tin trước khi tạo đơn hàng</li>
                  <li>• Chúng tôi sẽ liên hệ với khách hàng trong vòng 24h</li>
                  <li>• Giá dịch vụ có thể thay đổi theo thời gian</li>
                  <li>• Hủy đơn hàng trước 24h khi nhận dịch vụ</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Eligibility Error Modal */}
      <EligibilityErrorModal
        isOpen={eligibilityModalOpen}
        onClose={() => setEligibilityModalOpen(false)}
        eligibilityData={eligibilityData}
      />
    </div>
  );
};

export default AdminCheckoutPage;