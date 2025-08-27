import React from 'react';
import { ServiceType } from '../../types/service.types';

interface ServiceTypeCardProps {
  serviceType: ServiceType;
  onEdit?: (serviceType: ServiceType) => void;
  onDelete?: (id: string) => void;
  showActions?: boolean;
}

const ServiceTypeCard: React.FC<ServiceTypeCardProps> = ({
  serviceType,
  onEdit,
  onDelete,
  showActions = true
}) => {
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-4 py-3">
        <h3 className="text-lg font-semibold text-white truncate">
          {serviceType.name}
        </h3>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Ngày tạo */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Ngày tạo:</span>
          <span className="text-sm text-gray-500">
            {formatDate(serviceType.createdAt)}
          </span>
        </div>

        {/* ID */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">ID:</span>
          <span className="text-xs text-gray-400 font-mono bg-gray-100 px-2 py-1 rounded">
            {serviceType.id.substring(0, 8)}...
          </span>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex items-center justify-between pt-3 border-t border-gray-200">
            <span className="text-sm text-gray-500">
              Loại dịch vụ
            </span>

            <div className="flex space-x-2">
              {onEdit && (
                <button
                  onClick={() => onEdit(serviceType)}
                  className="text-green-600 hover:text-green-800 text-sm font-medium hover:underline"
                >
                  Sửa
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(serviceType.id)}
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
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
          <svg className="w-2 h-2 mr-1.5 text-purple-400" fill="currentColor" viewBox="0 0 8 8">
            <circle cx="4" cy="4" r="3" />
          </svg>
          Loại dịch vụ
        </span>
      </div>
    </div>
  );
};

export default ServiceTypeCard; 