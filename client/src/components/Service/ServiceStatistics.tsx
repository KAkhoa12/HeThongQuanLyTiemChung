import React from 'react';

interface ServiceStatisticsProps {
  totalServices: number;
  totalTypes: number;
  averagePrice: number;
  isLoading?: boolean;
}

const ServiceStatistics: React.FC<ServiceStatisticsProps> = ({
  totalServices,
  totalTypes,
  averagePrice,
  isLoading = false
}) => {
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-md p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {/* Total Services */}
      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Tổng số dịch vụ</p>
            <p className="text-2xl font-bold text-gray-900">{totalServices.toLocaleString()}</p>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-center">
            <span className="text-green-600 text-sm font-medium">+12%</span>
            <span className="text-gray-500 text-sm ml-2">so với tháng trước</span>
          </div>
        </div>
      </div>

      {/* Total Service Types */}
      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-8 w-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Loại dịch vụ</p>
            <p className="text-2xl font-bold text-gray-900">{totalTypes.toLocaleString()}</p>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-center">
            <span className="text-green-600 text-sm font-medium">+5%</span>
            <span className="text-gray-500 text-sm ml-2">so với tháng trước</span>
          </div>
        </div>
      </div>

      {/* Average Price */}
      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Giá trung bình</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(averagePrice)}</p>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-center">
            <span className="text-green-600 text-sm font-medium">+8%</span>
            <span className="text-gray-500 text-sm ml-2">so với tháng trước</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceStatistics; 