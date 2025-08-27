import React from 'react';
import { Service } from '../../types/service.types';
import { ServiceVaccineDto } from '../../services/serviceVaccine.service';
import { useToast } from '../../hooks/useToast';

interface ServiceDetailModalProps {
  service: Service & { vaccines: ServiceVaccineDto[] } | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (service: Service) => void;
}

const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  service,
  isOpen,
  onClose,
  onAddToCart,
}) => {
  const { showSuccess } = useToast();
  
  if (!isOpen || !service) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4 text-white">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold">{service.name}</h3>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            {/* Description */}
            {service.description && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Mô tả dịch vụ</h4>
                <p className="text-gray-600">{service.description}</p>
              </div>
            )}

            {/* Price */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Giá dịch vụ</h4>
              <div className="text-3xl font-bold text-green-600">
                {service.price
                  ? `${service.price.toLocaleString('vi-VN')} VNĐ`
                  : 'Liên hệ'}
              </div>
            </div>

            {/* Vaccines */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <span className="text-blue-600 mr-2">🦠</span>
                Dịch vụ đính kèm
              </h4>
              
              {service.vaccines.length === 0 ? (
                <div className="text-center py-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-500 text-sm">
                    Chưa có dịch vụ đính kèm nào
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {service.vaccines.map((vaccine) => (
                    <div
                      key={vaccine.maVaccine}
                      className="bg-blue-50 rounded-lg p-4 border border-blue-200"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h5 className="font-semibold text-gray-800 mb-1">
                            {vaccine.tenVaccine}
                          </h5>
                          <p className="text-sm text-gray-600 mb-2">
                            {vaccine.ghiChu || 'Không có mô tả'}
                          </p>
                          <div className="flex items-center text-xs text-gray-500 space-x-4">
                            <span>
                              💉 Số mũi chuẩn: {vaccine.soMuiChuan}
                            </span>
                            <span>
                              📝{' '}
                              {vaccine.ghiChu
                                ? 'Có ghi chú'
                                : 'Không có ghi chú'}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-blue-600">
                            {vaccine.soMuiChuan} mũi
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Additional Info */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Thông tin bổ sung</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Trạng thái:</span>
                  <span className="ml-2 text-green-600 font-medium">Hoạt động</span>
                </div>
                <div>
                  <span className="text-gray-600">Loại dịch vụ:</span>
                  <span className="ml-2 text-blue-600 font-medium">
                    {service.serviceTypeName || 'Chưa phân loại'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 flex space-x-3">
            <button
              onClick={() => {
                onAddToCart(service);
                showSuccess('Thành công', `Đã thêm "${service.name}" vào giỏ hàng!`);
                onClose();
              }}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
            >
              <span className="mr-2">🛒</span>
              Thêm vào giỏ hàng
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium transition-colors duration-200"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailModal; 