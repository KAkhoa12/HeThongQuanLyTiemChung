import React, { useState } from 'react';
import ImageManagement from './ImageManagement';
import ImageLabels from './ImageLabels';

const ImageManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'images' | 'labels'>('images');

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-title-md2 font-bold text-black dark:text-white">
          Quản lý Hệ thống Ảnh
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          Quản lý ảnh và nhãn ảnh trong hệ thống
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-stroke dark:border-strokedark">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab('images')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'images'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <i className="ri-image-line mr-2"></i>
            Quản lý Ảnh
          </button>
          <button
            onClick={() => setActiveTab('labels')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'labels'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <i className="ri-price-tag-3-line mr-2"></i>
            Quản lý Nhãn
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[600px]">
        {activeTab === 'images' ? <ImageManagement /> : <ImageLabels />}
      </div>
    </div>
  );
};

export default ImageManagementPage; 