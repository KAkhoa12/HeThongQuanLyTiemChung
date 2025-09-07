import React, { useState, useEffect } from 'react';
import { useTonKhoLos, useTonKhoSummary, useLocations } from '../../../hooks';
import InventoryDashboard from '../../../components/Inventory/InventoryDashboard';
import InventoryStatistics from '../../../components/Inventory/InventoryStatistics';

interface TonKhoPageProps {}

const TonKhoPage: React.FC<TonKhoPageProps> = () => {
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'inventory' | 'statistics'>('dashboard');
  const pageSize = 10;

  // Fetch data
  const { data: locations, execute: fetchLocations } = useLocations();
  const { data: tonKhoSummary } = useTonKhoSummary();
  const { data: tonKhoData, loading: tonKhoLoading, execute: fetchTonKho } = useTonKhoLos();

  useEffect(() => {
    fetchLocations({ page: 1, pageSize: 1000 });
  }, []);

  useEffect(() => {
    fetchTonKho({
      page: currentPage,
      pageSize,
      search: searchTerm,
      maDiaDiem: selectedLocation || undefined
    });
  }, [currentPage, searchTerm, selectedLocation]);

  const handleLocationChange = (locationId: string) => {
    setSelectedLocation(locationId);
    setCurrentPage(1);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'dashboard'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'inventory'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Quản lý tồn kho
          </button>
          <button
            onClick={() => setActiveTab('statistics')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'statistics'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Thống kê
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'dashboard' && (
        <InventoryDashboard selectedLocation={selectedLocation} />
      )}

      {activeTab === 'statistics' && (
        <InventoryStatistics selectedLocation={selectedLocation} />
      )}

      {activeTab === 'inventory' && (
        <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          Quản lý Tồn kho Lô Vaccine
        </h2>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        {tonKhoSummary?.map((summary: any) => (
          <div key={summary.maDiaDiem} className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-title-md font-bold text-black dark:text-white">
                  {summary.tenDiaDiem}
                </h4>
                <p className="text-sm text-body dark:text-bodydark">
                  Tổng số lô: {summary.tongSoLo}
                </p>
                <p className="text-sm text-body dark:text-bodydark">
                  Tổng số lượng: {summary.tongSoLuong}
                </p>
                <p className="text-sm font-medium text-green-600">
                  Tổng giá trị: {formatCurrency(summary.tongGiaTri)}
                </p>
              </div>
              <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
                <i className="ri-store-2-line text-xl text-primary"></i>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark mb-6">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">Bộ lọc</h3>
        </div>
        <div className="p-6.5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2.5 block text-black dark:text-white">
                Địa điểm
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => handleLocationChange(e.target.value)}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              >
                <option value="">Tất cả địa điểm</option>
                {locations?.data?.map((location: any) => (
                  <option key={location.id} value={location.id}>
                    {location.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2.5 block text-black dark:text-white">
                Tìm kiếm
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm theo tên vaccine, số lô..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 pl-12 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
                <span className="absolute left-4.5 top-1/2 -translate-y-1/2">
                  <i className="ri-search-line text-xl text-body dark:text-bodydark"></i>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ton Kho Table */}
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Danh sách Tồn kho Lô Vaccine
          </h3>
        </div>
        <div className="p-6.5">
          {tonKhoLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-gray-2 text-left dark:bg-meta-4">
                      <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                        Mã tồn kho
                      </th>
                      <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                        Địa điểm
                      </th>
                      <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                        Số lô
                      </th>
                      <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                        Tên vaccine
                      </th>
                      <th className="min-w-[100px] py-4 px-4 font-medium text-black dark:text-white">
                        Số lượng
                      </th>
                      <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                        Ngày tạo
                      </th>
                      <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                        Ngày cập nhật
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {tonKhoData?.data?.map((item: any, index: number) => (
                      <tr key={item.maTonKho} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-1 dark:bg-meta-4'}>
                        <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                          <h5 className="font-medium text-black dark:text-white">
                            {item.maTonKho}
                          </h5>
                        </td>
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                          <p className="text-black dark:text-white">
                            {item.tenDiaDiem}
                          </p>
                        </td>
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                          <p className="text-black dark:text-white">
                            {item.soLo}
                          </p>
                        </td>
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                          <p className="text-black dark:text-white">
                            {item.tenVaccine}
                          </p>
                        </td>
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                          <p className="inline-flex rounded-full bg-success bg-opacity-10 py-1 px-3 text-sm font-medium text-success">
                            {item.soLuong}
                          </p>
                        </td>
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                          <p className="text-black dark:text-white">
                            {item.ngayTao ? formatDate(item.ngayTao) : '-'}
                          </p>
                        </td>
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                          <p className="text-black dark:text-white">
                            {item.ngayCapNhat ? formatDate(item.ngayCapNhat) : '-'}
                          </p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {tonKhoData && tonKhoData.totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-gray-500">
                    Hiển thị {((currentPage - 1) * pageSize) + 1} đến {Math.min(currentPage * pageSize, tonKhoData.totalCount)} của {tonKhoData.totalCount} kết quả
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Trước
                    </button>
                    <span className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md">
                      {currentPage} / {tonKhoData.totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, tonKhoData.totalPages))}
                      disabled={currentPage === tonKhoData.totalPages}
                      className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Sau
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
        </div>
      )}
    </div>
  );
};

export default TonKhoPage;