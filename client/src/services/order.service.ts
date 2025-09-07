import apiService from './api.service';

// Interfaces cho Order
export interface OrderCreateRequest {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  paymentMethod: string;
  preferredLocationId: string;
  items: OrderItemRequest[];
}

export interface OrderItemRequest {
  serviceId: string;
  quantity: number;
  unitPrice: number;
}

// ✅ Interface cho Check Order Eligibility
export interface CheckOrderEligibilityRequest {
  items: OrderItemRequest[];
}

export interface CheckOrderEligibilityResponse {
  isEligible: boolean;
  warnings: string[];
  errors: string[];
  userInfo: {
    maNguoiDung: string;
    ten: string;
    ngaySinh?: string;
    gioiTinh?: string;
  };
  serviceChecks: ServiceEligibilityCheck[];
}

export interface ServiceEligibilityCheck {
  serviceId: string;
  serviceName: string;
  isEligible: boolean;
  errors: string[];
  warnings: string[];
}

export interface OrderResponse {
  orderId: string;
  orderCode: string;
  totalAmount: number;
  status: string;
  createdAt: string;
}

// Interfaces cho Order Detail
export interface OrderDetail {
  maDonHang: string;
  maNguoiDung: string;
  maDiaDiemYeuThich?: string;
  ngayDat: string;
  tongTienGoc: number;
  tongTienThanhToan: number;
  trangThaiDon: string;
  ghiChu?: string;
  ngayTao: string;
  ngayCapNhat?: string;
  isActive: boolean;
  isDelete: boolean;
  donHangChiTiets: OrderDetailItem[];
  maDiaDiemYeuThichNavigation?: LocationInfo;
  // ✅ Thêm thông tin khuyến mãi
  donHangKhuyenMais?: DonHangKhuyenMaiInfo[];
}

// ✅ Interface cho thông tin khuyến mãi
export interface DonHangKhuyenMaiInfo {
  maDonHangKhuyenMai: string;
  maDonHang: string;
  maKhuyenMai: string;
  giamGiaGoc: number;
  giamGiaThucTe: number;
  ngayApDung: string;
  khuyenMai?: KhuyenMaiInfo;
}

// ✅ Interface cho thông tin khuyến mãi
export interface KhuyenMaiInfo {
  code: string;
  tenKhuyenMai: string;
  loaiGiam: string;
  giaTriGiam: number;
}

export interface OrderDetailItem {
  maDonHangChiTiet: string;
  maDonHang: string;
  maDichVu: string;
  soMuiChuan: number;
  donGiaMui: number;
  thanhTien: number;
  isActive: boolean;
  isDelete: boolean;
  maDichVuNavigation?: ServiceInfo;
}

export interface ServiceInfo {
  maDichVu: string;
  tenDichVu: string;
  moTa?: string;
  gia: number;
}

export interface LocationInfo {
  maDiaDiem: string;
  tenDiaDiem: string;
  diaChi?: string;
}

// Interfaces cho MoMo Payment
export interface MoMoPaymentRequest {
  orderId: string;
  orderCode: string;
  amount: number;
  orderInfo: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
}

export interface MoMoPaymentResponse {
  orderId: string;
  paymentUrl: string;
  paymentId: string;
  status: string;
  message: string;
}

// Interfaces cho Admin Invoice Management
export interface InvoiceListParams {
  page?: number;
  pageSize?: number;
  status?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
}

export interface InvoiceListResponse {
  data: OrderDetail[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface UpdateStatusRequest {
  status: string;
  ghiChu?: string;
}

/**
 * Tạo đơn hàng mới
 */
export const createOrder = async (orderData: OrderCreateRequest): Promise<OrderResponse> => {
  return await apiService.create('/api/orders', orderData);
};

/**
 * Lấy thông tin đơn hàng theo ID
 */
export const getOrderById = async (orderId: string): Promise<OrderDetail> => {
  return await apiService.get(`/api/orders/${orderId}`);
};

/**
 * Cập nhật trạng thái đơn hàng
 */
export const updateOrderStatus = async (orderId: string, status: string): Promise<any> => {
  return await apiService.update(`/api/orders/${orderId}/status`, status);
};

/**
 * Xóa đơn hàng (soft delete)
 */
export const deleteOrder = async (orderId: string): Promise<any> => {
  return await apiService.delete(`/api/orders/${orderId}`);
};

/**
 * Lấy danh sách đơn hàng của người dùng đã đăng nhập
 */
export const getMyOrders = async (): Promise<OrderDetail[]> => {
  return await apiService.get('/api/orders/my-orders');
};

/**
 * Lấy danh sách tất cả đơn hàng của user đã đăng nhập
 */
export const getAllOrders = async (params: InvoiceListParams = {}): Promise<InvoiceListResponse> => {
  return await apiService.get('/api/orders/my-orders', params);
};

/**
 * Tạo thanh toán MoMo
 */
export const createMoMoPayment = async (paymentData: MoMoPaymentRequest): Promise<MoMoPaymentResponse> => {
  return await apiService.create('/api/payments/momo/create', paymentData);
};

/**
 * Kiểm tra trạng thái thanh toán
 */
export const checkPaymentStatus = async (orderId: string): Promise<any> => {
  return await apiService.get(`/api/payments/momo/status/${orderId}`);
};

/**
 * Chuyển đổi giỏ hàng thành đơn hàng
 */
export const convertCartToOrder = (cartItems: any[], customerInfo: any): OrderCreateRequest => {
  const items: OrderItemRequest[] = cartItems.map(item => ({
    serviceId: item.service.id,
    quantity: item.quantity,
    unitPrice: item.service.price || 0
  }));

  return {
    customerName: customerInfo.fullName,
    customerPhone: customerInfo.phone,
    customerEmail: customerInfo.email,
    customerAddress: customerInfo.address,
    paymentMethod: customerInfo.paymentMethod,
    preferredLocationId: customerInfo.preferredLocationId,
    items: items
  };
};

/**
 * Cập nhật số tiền được giảm trong đơn hàng
 */
export const updateOrderDiscount = async (orderId: string, discountAmount: number): Promise<any> => {
  return await apiService.update(`/api/orders/${orderId}/discount`, { discountAmount });
};

/**
 * ✅ Kiểm tra điều kiện mua đơn hàng
 */
export const checkOrderEligibility = async (request: CheckOrderEligibilityRequest): Promise<CheckOrderEligibilityResponse> => {
  return await apiService.create('/api/orders/check-eligibility', request);
}; 