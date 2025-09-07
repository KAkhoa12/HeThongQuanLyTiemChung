import React from 'react';
import { CheckOrderEligibilityResponse } from '../../services/order.service';

interface EligibilityErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  eligibilityData: CheckOrderEligibilityResponse | null;
}

const EligibilityErrorModal: React.FC<EligibilityErrorModalProps> = ({
  isOpen,
  onClose,
  eligibilityData,
}) => {
  if (!isOpen || !eligibilityData) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-red-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold">Không thể đặt hàng</h2>
                <p className="text-red-100">Vui lòng kiểm tra các điều kiện sau</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-red-200 hover:text-white transition-colors duration-200"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* User Info */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Thông tin khách hàng
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-blue-700">Họ tên:</span>
                <span className="ml-2 text-blue-600">{eligibilityData.userInfo.ten}</span>
              </div>
              <div>
                <span className="font-medium text-blue-700">Mã người dùng:</span>
                <span className="ml-2 text-blue-600">{eligibilityData.userInfo.maNguoiDung}</span>
              </div>
              {eligibilityData.userInfo.ngaySinh && (
                <div>
                  <span className="font-medium text-blue-700">Ngày sinh:</span>
                  <span className="ml-2 text-blue-600">
                    {new Date(eligibilityData.userInfo.ngaySinh).toLocaleDateString('vi-VN')}
                  </span>
                </div>
              )}
              {eligibilityData.userInfo.gioiTinh && (
                <div>
                  <span className="font-medium text-blue-700">Giới tính:</span>
                  <span className="ml-2 text-blue-600">{eligibilityData.userInfo.gioiTinh}</span>
                </div>
              )}
            </div>
          </div>

          {/* Errors */}
          {eligibilityData.errors.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-red-800 mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Lỗi ngăn cản đặt hàng ({eligibilityData.errors.length})
              </h3>
              <div className="space-y-3">
                {eligibilityData.errors.map((error, index) => (
                  <div key={index} className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-xs font-bold">!</span>
                      </div>
                      <p className="text-red-800 text-sm leading-relaxed">{error}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Warnings */}
          {eligibilityData.warnings.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-yellow-800 mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                Cảnh báo ({eligibilityData.warnings.length})
              </h3>
              <div className="space-y-3">
                {eligibilityData.warnings.map((warning, index) => (
                  <div key={index} className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-xs font-bold">!</span>
                      </div>
                      <p className="text-yellow-800 text-sm leading-relaxed">{warning}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Service Checks */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Chi tiết kiểm tra dịch vụ ({eligibilityData.serviceChecks.length})
            </h3>
            <div className="space-y-4">
              {eligibilityData.serviceChecks.map((serviceCheck, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-800">{serviceCheck.serviceName}</h4>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      serviceCheck.isEligible 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {serviceCheck.isEligible ? 'Có thể mua' : 'Không thể mua'}
                    </div>
                  </div>
                  
                  {serviceCheck.errors.length > 0 && (
                    <div className="mb-3">
                      <h5 className="text-sm font-medium text-red-700 mb-2">Lỗi:</h5>
                      <ul className="space-y-1">
                        {serviceCheck.errors.map((error, errorIndex) => (
                          <li key={errorIndex} className="text-sm text-red-600 flex items-start">
                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                            {error}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {serviceCheck.warnings.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium text-yellow-700 mb-2">Cảnh báo:</h5>
                      <ul className="space-y-1">
                        {serviceCheck.warnings.map((warning, warningIndex) => (
                          <li key={warningIndex} className="text-sm text-yellow-600 flex items-start">
                            <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                            {warning}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors duration-200"
            >
              Đóng
            </button>
            {eligibilityData.isEligible && (
              <button
                onClick={onClose}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200"
              >
                Tiếp tục đặt hàng
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EligibilityErrorModal;