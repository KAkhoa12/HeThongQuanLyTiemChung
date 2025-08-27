import React from 'react';
import { Service } from '../../types/service.types';
import { Link } from 'react-router-dom';

interface ServiceCardProps {
  service: Service;
  onEdit?: (service: Service) => void;
  onDelete?: (id: string) => void;
  showActions?: boolean;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  onEdit,
  onDelete,
  showActions = true
}) => {
  const formatCurrency = (amount?: number): string => {
    if (amount == null) return 'N/A';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3">
        <h3 className="text-lg font-semibold text-white truncate">
          {service.name}
        </h3>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Mô tả */}
        {service.description && (
          <div>
            <p className="text-sm text-gray-600 leading-relaxed">
              {truncateText(service.description, 100)}
            </p>
          </div>
        )}

        {/* Thông tin chi tiết */}
        <div className="space-y-2">
          {/* Giá */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Giá:</span>
            <span className="text-lg font-bold text-green-600">
              {formatCurrency(service.price)}
            </span>
          </div>

          {/* Loại dịch vụ */}
          {service.serviceTypeName && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Loại:</span>
              <span className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                {service.serviceTypeName}
              </span>
            </div>
          )}

          {/* Ngày tạo */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Ngày tạo:</span>
            <span className="text-sm text-gray-500">
              {formatDate(service.createdAt)}
            </span>
          </div>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex items-center justify-between pt-3 border-t border-gray-200">
            {/* View Details */}
            <Link
              to={`/services/${service.id}`}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline"
            >
              Xem chi tiết
            </Link>

            {/* Edit & Delete */}
            <div className="flex space-x-2">
              {onEdit && (
                <button
                  onClick={() => onEdit(service)}
                  className="text-green-600 hover:text-green-800 text-sm font-medium hover:underline"
                >
                  Sửa
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(service.id)}
                  className="text-red-600 hover:text-red-800 text-sm font-medium hover:underline"
                >
                  Xóa
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Status Badge */}
      <div className="px-4 pb-3">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <svg className="w-2 h-2 mr-1.5 text-green-400" fill="currentColor" viewBox="0 0 8 8">
            <circle cx="4" cy="4" r="3" />
          </svg>
          Hoạt động
        </span>
      </div>
    </div>
  );
};

export default ServiceCard; 