import React, { useState } from 'react';
import { useTonKhoSummary, useTonKhoExpiringSoon, useTonKhoLowStock } from '../../hooks';

interface InventoryDashboardProps {
  selectedLocation?: string;
}

const InventoryDashboard: React.FC<InventoryDashboardProps> = ({ selectedLocation }) => {
  const [expiringDays, setExpiringDays] = useState(30);
  const [lowStockThreshold, setLowStockThreshold] = useState(50);

  // Fetch data
  const { data: summaryData } = useTonKhoSummary();
  const { data: expiringData } = useTonKhoExpiringSoon({
    daysAhead: expiringDays,
    maDiaDiem: selectedLocation
  });
  const { data: lowStockData } = useTonKhoLowStock({
    threshold: lowStockThreshold,
    maDiaDiem: selectedLocation
  });


  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: { text: string; className: string } } = {
      'Hết hàng': { text: 'Hết hàng', className: 'bg-red-100 text-red-800' },
      'Cực thấp': { text: 'Cực thấp', className: 'bg-red-100 text-red-800' },
      'Thấp': { text: 'Thấp', className: 'bg-yellow-100 text-yellow-800' },
      'Bình thường': { text: 'Bình thường', className: 'bg-green-100 text-green-800' }
    };

    const statusInfo = statusMap[status] || {
      text: status,
      className: 'bg-gray-100 text-gray-800'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.className}`}>
        {statusInfo.text}
      </span>
    );
  };

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* Tổng quan tồn kho */}
      <div className="rounded-lg border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-title-md font-bold text-black dark:text-white">
              {summaryData?.reduce((sum, item) => sum + item.tongSoLuong, 0) || 0}
            </h4>
            <p className="text-sm font-medium">Tổng số lượng tồn kho</p>
          </div>
          <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
            <svg className="fill-primary dark:fill-white" width="20" height="22" viewBox="0 0 20 22" fill="none">
              <path d="M11.7531 16.4312C10.3781 16.4312 9.27808 17.5312 9.27808 18.9062C9.27808 20.2812 10.3781 21.3812 11.7531 21.3812C13.1281 21.3812 14.2281 20.2812 14.2281 18.9062C14.2281 17.5656 13.0937 16.4312 11.7531 16.4312ZM11.7531 19.8687C11.2375 19.8687 10.825 19.4562 10.825 18.9406C10.825 18.425 11.2375 18.0125 11.7531 18.0125C12.2687 18.0125 12.6812 18.425 12.6812 18.9406C12.6812 19.4219 12.2343 19.8687 11.7531 19.8687Z" fill=""/>
              <path d="M5.22183 16.4312C3.84683 16.4312 2.74683 17.5312 2.74683 18.9062C2.74683 20.2812 3.84683 21.3812 5.22183 21.3812C6.59683 21.3812 7.69683 20.2812 7.69683 18.9062C7.69683 17.5656 6.56245 16.4312 5.22183 16.4312ZM5.22183 19.8687C4.7062 19.8687 4.2937 19.4562 4.2937 18.9406C4.2937 18.425 4.7062 18.0125 5.22183 18.0125C5.73745 18.0125 6.14995 18.425 6.14995 18.9406C6.14995 19.4219 5.73745 19.8687 5.22183 19.8687Z" fill=""/>
              <path d="M19.0062 0H5.06558C4.02428 0 3.18115 0.843086 3.18115 1.88438V3.81873H0.687705C-0.320805 3.81873 -1.25439 4.75232 -1.25439 5.76083V17.3611C-1.25439 18.3696 -0.320805 19.3032 0.687705 19.3032H10.4939C11.5024 19.3032 12.436 18.3696 12.436 17.3611V15.4277H14.3703C15.4116 15.4277 16.2547 14.5846 16.2547 13.5433V1.88438C16.2547 0.843086 15.4116 0 14.3703 0ZM11.3155 17.3611C11.3155 17.6734 11.0581 17.9308 10.7458 17.9308H0.687705C0.37542 17.9308 0.118047 17.6734 0.118047 17.3611V5.76083C0.118047 5.44855 0.37542 5.19118 0.687705 5.19118H10.7458C11.0581 5.19118 11.3155 5.44855 11.3155 5.76083V17.3611ZM14.3703 13.5433H12.436V5.76083C12.436 5.44855 12.6934 5.19118 13.0057 5.19118H14.3703C14.6826 5.19118 14.94 5.44855 14.94 5.76083V13.5433C14.94 13.8556 14.6826 14.1129 14.3703 14.1129Z" fill=""/>
            </svg>
          </div>
        </div>
      </div>

      {/* Lô sắp hết hạn */}
      <div className="rounded-lg border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-title-md font-bold text-black dark:text-white">
            Lô sắp hết hạn
          </h4>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={expiringDays}
              onChange={(e) => setExpiringDays(Number(e.target.value))}
              className="w-16 px-2 py-1 text-sm border rounded"
              min="1"
              max="365"
            />
            <span className="text-sm text-gray-600">ngày</span>
          </div>
        </div>
        <div className="space-y-2">
          {expiringData?.slice(0, 3).map((item: any, index: number) => ( 
            <div key={index} className="flex justify-between items-center p-2 bg-red-50 rounded">
              <div>
                <p className="text-sm font-medium">{item.TenVaccine}</p>
                <p className="text-xs text-gray-600">Lô: {item.SoLo}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-red-600">{item.SoNgayConLai} ngày</p>
                <p className="text-xs text-gray-600">{item.SoLuong} liều</p>
              </div>
            </div>
          ))}
          {(!expiringData || expiringData.length === 0) && (
            <p className="text-sm text-gray-500 text-center py-4">Không có lô nào sắp hết hạn</p>
          )}
        </div>
      </div>

      {/* Tồn kho thấp */}
      <div className="rounded-lg border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-title-md font-bold text-black dark:text-white">
            Tồn kho thấp
          </h4>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={lowStockThreshold}
              onChange={(e) => setLowStockThreshold(Number(e.target.value))}
              className="w-16 px-2 py-1 text-sm border rounded"
              min="1"
            />
            <span className="text-sm text-gray-600">liều</span>
          </div>
        </div>
        <div className="space-y-2">
          {lowStockData?.slice(0, 3).map((item: any, index: number) => (
            <div key={index} className="flex justify-between items-center p-2 bg-yellow-50 rounded">
              <div>
                <p className="text-sm font-medium">{item.TenVaccine}</p>
                <p className="text-xs text-gray-600">Lô: {item.SoLo}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-yellow-600">{item.SoLuong} liều</p>
                {getStatusBadge(item.TrangThai)}
              </div>
            </div>
          ))}
          {(!lowStockData || lowStockData.length === 0) && (
            <p className="text-sm text-gray-500 text-center py-4">Không có vaccine nào tồn kho thấp</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default InventoryDashboard;