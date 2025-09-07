import React, { useState, useEffect } from 'react';
import { useTonKhoStatistics } from '../../hooks';

interface InventoryStatisticsProps {
  selectedLocation?: string;
}

const InventoryStatistics: React.FC<InventoryStatisticsProps> = ({ selectedLocation }) => {
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0]
  });

  const { data: statisticsData, execute: fetchStatistics } = useTonKhoStatistics({
    tuNgay: new Date(dateRange.from),
    denNgay: new Date(dateRange.to),
    maDiaDiem: selectedLocation
  });

  useEffect(() => {
    fetchStatistics();
  }, [dateRange, selectedLocation]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('vi-VN').format(num);
  };

  return (
    <div className="space-y-6">
      {/* Date Range Selector */}
      <div className="rounded-lg border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <h4 className="text-title-md font-bold text-black dark:text-white mb-4">
          Thống kê tồn kho
        </h4>
        <div className="flex gap-4 items-end">
          <div>
            <label className="block text-sm font-medium mb-2">Từ ngày:</label>
            <input
              type="date"
              value={dateRange.from}
              onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Đến ngày:</label>
            <input
              type="date"
              value={dateRange.to}
              onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
              className="w-full p-2 border rounded"
            />
          </div>
          <button
            onClick={() => fetchStatistics()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Cập nhật
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      {statisticsData?.TongKet && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-title-md font-bold text-black dark:text-white">
                  {formatNumber(statisticsData.TongKet.TongSoLuongNhap)}
                </h4>
                <p className="text-sm font-medium">Tổng nhập</p>
              </div>
              <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-green-100">
                <svg className="fill-green-600" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 0C4.477 0 0 4.477 0 10s4.477 10 10 10 10-4.477 10-10S15.523 0 10 0zm5 11H5V9h10v2z" fill=""/>
                </svg>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-title-md font-bold text-black dark:text-white">
                  {formatNumber(statisticsData.TongKet.TongSoLuongXuat)}
                </h4>
                <p className="text-sm font-medium">Tổng xuất</p>
              </div>
              <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-red-100">
                <svg className="fill-red-600" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 0C4.477 0 0 4.477 0 10s4.477 10 10 10 10-4.477 10-10S15.523 0 10 0zm5 11H5V9h10v2z" fill=""/>
                </svg>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-title-md font-bold text-black dark:text-white">
                  {formatNumber(statisticsData.TongKet.TongSoLuongThanhLy)}
                </h4>
                <p className="text-sm font-medium">Tổng thanh lý</p>
              </div>
              <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-yellow-100">
                <svg className="fill-yellow-600" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 0C4.477 0 0 4.477 0 10s4.477 10 10 10 10-4.477 10-10S15.523 0 10 0zm5 11H5V9h10v2z" fill=""/>
                </svg>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-title-md font-bold text-black dark:text-white">
                  {formatCurrency(statisticsData.TongKet.TongGiaTriNhap)}
                </h4>
                <p className="text-sm font-medium">Tổng giá trị nhập</p>
              </div>
              <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-blue-100">
                <svg className="fill-blue-600" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 0C4.477 0 0 4.477 0 10s4.477 10 10 10 10-4.477 10-10S15.523 0 10 0zm5 11H5V9h10v2z" fill=""/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Statistics */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Current Inventory */}
        <div className="rounded-lg border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h4 className="text-title-md font-bold text-black dark:text-white mb-4">
            Tồn kho hiện tại
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                  <th className="py-2 px-2 font-medium text-black dark:text-white">Địa điểm</th>
                  <th className="py-2 px-2 font-medium text-black dark:text-white">Số lô</th>
                  <th className="py-2 px-2 font-medium text-black dark:text-white">Số lượng</th>
                  <th className="py-2 px-2 font-medium text-black dark:text-white">Giá trị</th>
                </tr>
              </thead>
              <tbody>
                {statisticsData?.TonKhoHienTai?.map((item: any, index: number) => (
                  <tr key={index} className="border-b border-stroke dark:border-strokedark">
                    <td className="py-2 px-2 text-sm">{item.TenDiaDiem}</td>
                    <td className="py-2 px-2 text-sm">{formatNumber(item.TongSoLo)}</td>
                    <td className="py-2 px-2 text-sm">{formatNumber(item.TongSoLuong)}</td>
                    <td className="py-2 px-2 text-sm">{formatCurrency(item.TongGiaTri)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Import Statistics */}
        <div className="rounded-lg border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h4 className="text-title-md font-bold text-black dark:text-white mb-4">
            Thống kê nhập kho
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                  <th className="py-2 px-2 font-medium text-black dark:text-white">Vaccine</th>
                  <th className="py-2 px-2 font-medium text-black dark:text-white">Số lượng</th>
                  <th className="py-2 px-2 font-medium text-black dark:text-white">Giá trị</th>
                </tr>
              </thead>
              <tbody>
                {statisticsData?.NhapKho?.map((item: any, index: number) => (
                  <tr key={index} className="border-b border-stroke dark:border-strokedark">
                    <td className="py-2 px-2 text-sm">{item.TenVaccine}</td>
                    <td className="py-2 px-2 text-sm">{formatNumber(item.TongSoLuongNhap)}</td>
                    <td className="py-2 px-2 text-sm">{formatCurrency(item.TongGiaTriNhap)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Export and Disposal Statistics */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h4 className="text-title-md font-bold text-black dark:text-white mb-4">
            Thống kê xuất kho
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                  <th className="py-2 px-2 font-medium text-black dark:text-white">Vaccine</th>
                  <th className="py-2 px-2 font-medium text-black dark:text-white">Số lượng</th>
                </tr>
              </thead>
              <tbody>
                {statisticsData?.XuatKho?.map((item: any, index: number) => (
                  <tr key={index} className="border-b border-stroke dark:border-strokedark">
                    <td className="py-2 px-2 text-sm">{item.TenVaccine}</td>
                    <td className="py-2 px-2 text-sm">{formatNumber(item.TongSoLuongXuat)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-lg border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h4 className="text-title-md font-bold text-black dark:text-white mb-4">
            Thống kê thanh lý
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                  <th className="py-2 px-2 font-medium text-black dark:text-white">Vaccine</th>
                  <th className="py-2 px-2 font-medium text-black dark:text-white">Số lượng</th>
                </tr>
              </thead>
              <tbody>
                {statisticsData?.ThanhLy?.map((item: any, index: number) => (
                  <tr key={index} className="border-b border-stroke dark:border-strokedark">
                    <td className="py-2 px-2 text-sm">{item.TenVaccine}</td>
                    <td className="py-2 px-2 text-sm">{formatNumber(item.TongSoLuongThanhLy)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryStatistics;