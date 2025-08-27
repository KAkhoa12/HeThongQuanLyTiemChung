import React from 'react';
import { Link } from 'react-router-dom';

interface ServiceEmptyStateProps {
  type: 'service' | 'serviceType';
  searchQuery?: string;
  onClearSearch?: () => void;
}

const ServiceEmptyState: React.FC<ServiceEmptyStateProps> = ({
  type,
  searchQuery,
  onClearSearch
}) => {
  const isService = type === 'service';
  const title = isService ? 'Không tìm thấy dịch vụ nào' : 'Không tìm thấy loại dịch vụ nào';
  const description = isService 
    ? 'Chưa có dịch vụ nào được tạo hoặc kết quả tìm kiếm không khớp.'
    : 'Chưa có loại dịch vụ nào được tạo.';
  const actionText = isService ? 'Thêm dịch vụ mới' : 'Thêm loại dịch vụ mới';
  const actionLink = isService ? '/services/create' : '/service-types/create';

  return (
    <div className="text-center py-12 px-4">
      {/* Icon */}
      <div className="mx-auto h-24 w-24 text-gray-300 mb-6">
        {isService ? (
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        ) : (
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
        )}
      </div>

      {/* Title */}
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {title}
      </h3>

      {/* Description */}
      <p className="text-gray-500 mb-6 max-w-md mx-auto">
        {description}
        {searchQuery && (
          <span>
            {' '}Kết quả tìm kiếm cho "{searchQuery}" không khớp với bất kỳ {isService ? 'dịch vụ' : 'loại dịch vụ'} nào.
          </span>
        )}
      </p>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {searchQuery && onClearSearch ? (
          <button
            onClick={onClearSearch}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Xóa tìm kiếm
          </button>
        ) : (
          <Link
            to={actionLink}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            {actionText}
          </Link>
        )}

        {/* View All Link */}
        <Link
          to={isService ? '/services' : '/service-types'}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          Xem tất cả
        </Link>
      </div>

      {/* Additional Help */}
      <div className="mt-8 text-sm text-gray-500">
        <p>
          Cần hỗ trợ?{' '}
          <a href="#" className="text-blue-600 hover:text-blue-500 font-medium">
            Liên hệ admin
          </a>
        </p>
      </div>
    </div>
  );
};

export default ServiceEmptyState; 