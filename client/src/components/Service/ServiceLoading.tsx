import React from 'react';

interface ServiceLoadingProps {
  type: 'card' | 'table' | 'grid';
  count?: number;
}

const ServiceLoading: React.FC<ServiceLoadingProps> = ({ type, count = 6 }) => {
  if (type === 'card') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
            {/* Header */}
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            
            {/* Description */}
            <div className="space-y-2 mb-4">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
            
            {/* Info */}
            <div className="space-y-3 mb-4">
              <div className="flex justify-between">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>
              <div className="flex justify-between">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex justify-between pt-3 border-t border-gray-200">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="flex space-x-2">
                <div className="h-4 bg-gray-200 rounded w-12"></div>
                <div className="h-4 bg-gray-200 rounded w-12"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Table Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="grid grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
        
        {/* Table Rows */}
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="px-6 py-4 border-b border-gray-100">
            <div className="grid grid-cols-5 gap-4">
              {Array.from({ length: 5 }).map((_, colIndex) => (
                <div key={colIndex} className="h-4 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'grid') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
            {/* Icon */}
            <div className="h-12 w-12 bg-gray-200 rounded-lg mb-3"></div>
            
            {/* Title */}
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            
            {/* Value */}
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
            
            {/* Subtitle */}
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  return null;
};

export default ServiceLoading; 