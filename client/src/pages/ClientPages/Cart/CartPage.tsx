import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../hooks/useCart';
import { useToast } from '../../../hooks/useToast';

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, clearCart, getCartTotal } = useCart();
  const { showSuccess, showError } = useToast();
  



  const handleRemoveFromCart = (serviceId: string) => {
    removeFromCart(serviceId);
    showSuccess('Thành công', 'Đã xóa dịch vụ khỏi giỏ hàng!');
  };

  const handleClearCart = () => {
    clearCart();
    showSuccess('Thành công', 'Đã xóa toàn bộ giỏ hàng!');
  };

  const proceedToCheckout = () => {
    if (cartItems.length === 0) {
      showError('Lỗi', 'Giỏ hàng trống!');
      return;
    }
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">🛒 Giỏ Hàng</h1>
          <p className="text-xl text-blue-100">
            {cartItems.length > 0 
              ? ``
              : 'Giỏ hàng của bạn đang trống'
            }
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {cartItems.length === 0 ? (
          /* Empty Cart State */
          <div className="text-center py-20">
            <div className="text-gray-400 text-8xl mb-6">🛒</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Giỏ hàng trống
            </h3>
            <p className="text-gray-600 text-lg mb-8">
              Bạn chưa có dịch vụ nào trong giỏ hàng. Hãy khám phá các dịch vụ của chúng tôi!
            </p>
            <button
              onClick={() => navigate('/services')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition-colors duration-200"
            >
              🏥 Xem dịch vụ
            </button>
          </div>
        ) : (
          /* Cart Items */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items List */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Dịch vụ trong giỏ hàng 
                  </h2>
                </div>

                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.service.id} className="border border-gray-200 rounded-lg p-4">
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
                            <span className="mr-4">📅 Thêm: {item.addedAt.toLocaleDateString('vi-VN')}</span>
                            {item.service.serviceTypeName && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                {item.service.serviceTypeName}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="text-lg font-bold text-green-600">
                              {item.service.price 
                                ? `${item.service.price.toLocaleString('vi-VN')} VNĐ`
                                : 'Liên hệ'
                              }
                            </div>
                            {item.service.price && (
                              <div className="text-sm text-gray-500">
                                {item.service.price.toLocaleString('vi-VN')} VNĐ / dịch vụ
                              </div>
                            )}
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() => handleRemoveFromCart(item.service.id)}
                            className="text-red-600 hover:text-red-700 p-2"
                            title="Xóa khỏi giỏ hàng"
                          >
                            <i className="ri-delete-bin-line text-2xl"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Cart Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-6">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Tóm tắt đơn hàng</h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Phí dịch vụ:</span>
                    <span>{getCartTotal().toLocaleString('vi-VN')} VNĐ</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-lg font-bold text-gray-800">
                      <span>Tổng cộng:</span>
                      <span>{getCartTotal().toLocaleString('vi-VN')} VNĐ</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={proceedToCheckout}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 px-6 rounded-lg font-bold text-lg transition-colors duration-200 mb-4"
                >
                  💳 Tiến hành thanh toán
                </button>

                <button
                  onClick={() => navigate('/services')}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-medium transition-colors duration-200"
                >
                  🏥 Mua dịch vụ khác
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage; 