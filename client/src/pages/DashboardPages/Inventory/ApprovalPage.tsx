import React, { useState } from 'react';
import { ApprovalPanel } from '../../../components/Inventory';

interface ApprovalPageProps {}

const ApprovalPage: React.FC<ApprovalPageProps> = () => {
  const [activeTab, setActiveTab] = useState<'phieu-nhap' | 'phieu-xuat' | 'phieu-thanh-ly'>('phieu-nhap');

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          Duyệt Phiếu Kho
        </h2>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('phieu-nhap')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'phieu-nhap'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Phiếu nhập
          </button>
          <button
            onClick={() => setActiveTab('phieu-xuat')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'phieu-xuat'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Phiếu xuất
          </button>
          <button
            onClick={() => setActiveTab('phieu-thanh-ly')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'phieu-thanh-ly'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Phiếu thanh lý
          </button>
        </div>
      </div>

      {/* Approval Panel */}
      <ApprovalPanel type={activeTab} />
    </div>
  );
};

export default ApprovalPage;