import React, { useState, useEffect } from 'react';
import CardDataStats from '../../components/CardDataStats';
import { 
  useOverviewStatistics, 
  useRevenueByLocation, 
  useInventoryByLocation, 
  useVaccineDetailsByLocation,
  useMonthlyRevenue 
} from '../../hooks';
import { useLocations } from '../../hooks';

const ThongKeBaoCao: React.FC = () => {
  const [filters, setFilters] = useState({
    fromDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    toDate: new Date().toISOString().split('T')[0],
    locationId: '',
    year: new Date().getFullYear()
  });

  const [activeTab, setActiveTab] = useState<'overview' | 'revenue' | 'inventory' | 'vaccine-details'>('overview');

  // Hooks for data fetching
  const { data: overviewData, loading: overviewLoading, execute: executeOverview } = useOverviewStatistics();
  const { data: revenueData, loading: revenueLoading, execute: executeRevenue } = useRevenueByLocation();
  const { data: inventoryData, loading: inventoryLoading, execute: executeInventory } = useInventoryByLocation();
  const { data: vaccineDetailsData, loading: vaccineDetailsLoading, execute: executeVaccineDetails } = useVaccineDetailsByLocation();
  const { data: monthlyRevenueData, loading: monthlyRevenueLoading, execute: executeMonthlyRevenue } = useMonthlyRevenue();
  const { data: locationsData, execute: executeLocations } = useLocations();

  // Load data when filters change
  useEffect(() => {
    executeOverview(filters);
    executeRevenue(filters);
    executeInventory(filters);
    executeVaccineDetails(filters);
    executeMonthlyRevenue(filters);
    executeLocations();
  }, [executeOverview, executeRevenue, executeInventory, executeVaccineDetails, executeMonthlyRevenue, executeLocations, filters]);

  const handleFilterChange = (key: string, value: string | number) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

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
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          Thống Kê & Báo Cáo
        </h2>
      </div>

      {/* Filters */}
      <div className="mb-6 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">Bộ lọc</h3>
        </div>
        <div className="p-6.5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="mb-2.5 block text-black dark:text-white">Từ ngày</label>
              <input
                type="date"
                value={filters.fromDate}
                onChange={(e) => handleFilterChange('fromDate', e.target.value)}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
            </div>
            <div>
              <label className="mb-2.5 block text-black dark:text-white">Đến ngày</label>
              <input
                type="date"
                value={filters.toDate}
                onChange={(e) => handleFilterChange('toDate', e.target.value)}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
            </div>
            <div>
              <label className="mb-2.5 block text-black dark:text-white">Địa điểm</label>
              <select
                value={filters.locationId}
                onChange={(e) => handleFilterChange('locationId', e.target.value)}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              >
                <option value="">Tất cả địa điểm</option>
                {locationsData?.data?.map((location: any) => (
                  <option key={location.maDiaDiem} value={location.maDiaDiem}>
                    {location.ten}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2.5 block text-black dark:text-white">Năm</label>
              <input
                type="number"
                value={filters.year}
                onChange={(e) => handleFilterChange('year', parseInt(e.target.value))}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', label: 'Tổng quan' },
              { id: 'revenue', label: 'Doanh thu' },
              { id: 'inventory', label: 'Kho tồn lô' },
              { id: 'vaccine-details', label: 'Chi tiết vaccine' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div>
          {overviewLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : overviewData ? (
            <>
              {/* Overview Cards */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 2xl:gap-7.5 mb-6">
                <CardDataStats 
                  title="Tổng doanh thu" 
                  total={formatCurrency(overviewData.revenue.totalRevenue)} 
                  rate="0.43%" 
                  levelUp
                >
                  <svg className="fill-primary dark:fill-white" width="22" height="16" viewBox="0 0 22 16" fill="none">
                    <path d="M11 15.1156C4.19376 15.1156 0.825012 8.61876 0.687512 8.34376C0.584387 8.13751 0.584387 7.86251 0.687512 7.65626C0.825012 7.38126 4.19376 0.918762 11 0.918762C17.8063 0.918762 21.175 7.38126 21.3125 7.65626C21.4156 7.86251 21.4156 8.13751 21.3125 8.34376C21.175 8.61876 17.8063 15.1156 11 15.1156Z" fill=""/>
          </svg>
        </CardDataStats>
                
                <CardDataStats 
                  title="Tổng đơn hàng" 
                  total={formatNumber(overviewData.revenue.totalOrders)} 
                  rate="4.35%" 
                  levelUp
                >
                  <svg className="fill-primary dark:fill-white" width="20" height="22" viewBox="0 0 20 22" fill="none">
                    <path d="M11.7531 16.4312C10.3781 16.4312 9.27808 17.5312 9.27808 18.9062C9.27808 20.2812 10.3781 21.3812 11.7531 21.3812C13.1281 21.3812 14.2281 20.2812 14.2281 18.9062C14.2281 17.5656 13.0937 16.4312 11.7531 16.4312Z" fill=""/>
          </svg>
        </CardDataStats>
                
                <CardDataStats 
                  title="Giá trị kho" 
                  total={formatCurrency(overviewData.inventory.totalValue)} 
                  rate="2.59%" 
                  levelUp
                >
                  <svg className="fill-primary dark:fill-white" width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <path d="M21.1063 18.0469L19.3875 3.23126C19.2157 1.71876 17.9438 0.584381 16.3969 0.584381H5.56878C4.05628 0.584381 2.78441 1.71876 2.57816 3.23126L0.859406 18.0469C0.756281 18.9063 1.03128 19.7313 1.61566 20.3844C2.20003 21.0375 2.99066 21.3813 3.85003 21.3813H18.1157C18.975 21.3813 19.8 21.0031 20.35 20.3844C20.9 19.7656 21.2094 18.9063 21.1063 18.0469Z" fill=""/>
          </svg>
        </CardDataStats>
                
                <CardDataStats 
                  title="Tỷ lệ hoàn thành" 
                  total={`${overviewData.appointments.completionRate.toFixed(1)}%`} 
                  rate="0.95%" 
                  levelDown
                >
                  <svg className="fill-primary dark:fill-white" width="22" height="18" viewBox="0 0 22 18" fill="none">
                    <path d="M7.18418 8.03751C9.31543 8.03751 11.0686 6.35313 11.0686 4.25626C11.0686 2.15938 9.31543 0.475006 7.18418 0.475006C5.05293 0.475006 3.2998 2.15938 3.2998 4.25626C3.2998 6.35313 5.05293 8.03751 7.18418 8.03751Z" fill=""/>
          </svg>
        </CardDataStats>
      </div>

              {/* Monthly Revenue Chart */}
              <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                  <h3 className="font-medium text-black dark:text-white">Doanh thu theo tháng</h3>
                </div>
                <div className="p-6.5">
                  {monthlyRevenueLoading ? (
                    <div className="flex items-center justify-center h-64">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : monthlyRevenueData && monthlyRevenueData.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full table-auto">
                        <thead>
                          <tr className="bg-gray-2 text-left dark:bg-meta-4">
                            <th className="py-4 px-4 font-medium text-black dark:text-white">Tháng</th>
                            <th className="py-4 px-4 font-medium text-black dark:text-white">Doanh thu</th>
                            <th className="py-4 px-4 font-medium text-black dark:text-white">Số đơn hàng</th>
                          </tr>
                        </thead>
                        <tbody>
                          {monthlyRevenueData.map((item, index) => (
                            <tr key={index} className="border-b border-stroke dark:border-strokedark">
                              <td className="py-5 px-4">
                                <p className="text-black dark:text-white">{item.monthName}</p>
                              </td>
                              <td className="py-5 px-4">
                                <p className="text-black dark:text-white">{formatCurrency(item.totalRevenue)}</p>
                              </td>
                              <td className="py-5 px-4">
                                <p className="text-black dark:text-white">{formatNumber(item.totalOrders)}</p>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-center text-gray-500 dark:text-gray-400">Không có dữ liệu</p>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center text-gray-500 dark:text-gray-400">Không có dữ liệu</div>
          )}
        </div>
      )}

      {/* Revenue Tab */}
      {activeTab === 'revenue' && (
        <div>
          {revenueLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : revenueData && revenueData.length > 0 ? (
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">Doanh thu theo địa điểm</h3>
              </div>
              <div className="p-6.5">
                <div className="overflow-x-auto">
                  <table className="w-full table-auto">
                    <thead>
                      <tr className="bg-gray-2 text-left dark:bg-meta-4">
                        <th className="py-4 px-4 font-medium text-black dark:text-white">Địa điểm</th>
                        <th className="py-4 px-4 font-medium text-black dark:text-white">Tổng đơn hàng</th>
                        <th className="py-4 px-4 font-medium text-black dark:text-white">Tổng doanh thu</th>
                        <th className="py-4 px-4 font-medium text-black dark:text-white">Giá trị TB/đơn</th>
                      </tr>
                    </thead>
                    <tbody>
                      {revenueData.map((item, index) => (
                        <tr key={index} className="border-b border-stroke dark:border-strokedark">
                          <td className="py-5 px-4">
                            <p className="text-black dark:text-white">{item.locationName}</p>
                          </td>
                          <td className="py-5 px-4">
                            <p className="text-black dark:text-white">{formatNumber(item.totalOrders)}</p>
                          </td>
                          <td className="py-5 px-4">
                            <p className="text-black dark:text-white">{formatCurrency(item.totalRevenue)}</p>
                          </td>
                          <td className="py-5 px-4">
                            <p className="text-black dark:text-white">{formatCurrency(item.averageOrderValue)}</p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 dark:text-gray-400">Không có dữ liệu doanh thu</div>
          )}
        </div>
      )}

      {/* Inventory Tab */}
      {activeTab === 'inventory' && (
        <div>
          {inventoryLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : inventoryData && inventoryData.length > 0 ? (
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">Kho tồn lô theo địa điểm</h3>
              </div>
              <div className="p-6.5">
                <div className="overflow-x-auto">
                  <table className="w-full table-auto">
                    <thead>
                      <tr className="bg-gray-2 text-left dark:bg-meta-4">
                        <th className="py-4 px-4 font-medium text-black dark:text-white">Địa điểm</th>
                        <th className="py-4 px-4 font-medium text-black dark:text-white">Tổng lô</th>
                        <th className="py-4 px-4 font-medium text-black dark:text-white">Tổng số lượng</th>
                        <th className="py-4 px-4 font-medium text-black dark:text-white">Tổng giá trị</th>
                        <th className="py-4 px-4 font-medium text-black dark:text-white">Lô hết hạn</th>
                        <th className="py-4 px-4 font-medium text-black dark:text-white">Sắp hết hạn</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inventoryData.map((item, index) => (
                        <tr key={index} className="border-b border-stroke dark:border-strokedark">
                          <td className="py-5 px-4">
                            <p className="text-black dark:text-white">{item.locationName}</p>
                          </td>
                          <td className="py-5 px-4">
                            <p className="text-black dark:text-white">{formatNumber(item.totalLots)}</p>
                          </td>
                          <td className="py-5 px-4">
                            <p className="text-black dark:text-white">{formatNumber(item.totalQuantity)}</p>
                          </td>
                          <td className="py-5 px-4">
                            <p className="text-black dark:text-white">{formatCurrency(item.totalValue)}</p>
                          </td>
                          <td className="py-5 px-4">
                            <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                              item.expiredLots > 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                            }`}>
                              {item.expiredLots}
                            </span>
                          </td>
                          <td className="py-5 px-4">
                            <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                              item.expiringSoonLots > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                            }`}>
                              {item.expiringSoonLots}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 dark:text-gray-400">Không có dữ liệu kho tồn lô</div>
          )}
        </div>
      )}

      {/* Vaccine Details Tab */}
      {activeTab === 'vaccine-details' && (
        <div>
          {vaccineDetailsLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : vaccineDetailsData && vaccineDetailsData.length > 0 ? (
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">Chi tiết vaccine theo địa điểm</h3>
              </div>
              <div className="p-6.5">
                <div className="overflow-x-auto">
                  <table className="w-full table-auto">
                    <thead>
                      <tr className="bg-gray-2 text-left dark:bg-meta-4">
                        <th className="py-4 px-4 font-medium text-black dark:text-white">Địa điểm</th>
                        <th className="py-4 px-4 font-medium text-black dark:text-white">Vaccine</th>
                        <th className="py-4 px-4 font-medium text-black dark:text-white">Số lô</th>
                        <th className="py-4 px-4 font-medium text-black dark:text-white">Số lượng</th>
                        <th className="py-4 px-4 font-medium text-black dark:text-white">Đơn giá</th>
                        <th className="py-4 px-4 font-medium text-black dark:text-white">Tổng giá trị</th>
                        <th className="py-4 px-4 font-medium text-black dark:text-white">Hạn sử dụng</th>
                        <th className="py-4 px-4 font-medium text-black dark:text-white">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vaccineDetailsData.map((item, index) => (
                        <tr key={index} className="border-b border-stroke dark:border-strokedark">
                          <td className="py-5 px-4">
                            <p className="text-black dark:text-white">{item.locationName}</p>
                          </td>
                          <td className="py-5 px-4">
                            <p className="text-black dark:text-white">{item.vaccineName}</p>
                          </td>
                          <td className="py-5 px-4">
                            <p className="text-black dark:text-white">{item.lotNumber}</p>
                          </td>
                          <td className="py-5 px-4">
                            <p className="text-black dark:text-white">{formatNumber(item.quantity)}</p>
                          </td>
                          <td className="py-5 px-4">
                            <p className="text-black dark:text-white">{formatCurrency(item.unitPrice)}</p>
                          </td>
                          <td className="py-5 px-4">
                            <p className="text-black dark:text-white">{formatCurrency(item.totalValue)}</p>
                          </td>
                          <td className="py-5 px-4">
                            <p className="text-black dark:text-white">{new Date(item.expiryDate).toLocaleDateString('vi-VN')}</p>
                          </td>
                          <td className="py-5 px-4">
                            <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                              item.isExpired 
                                ? 'bg-red-100 text-red-800' 
                                : item.isExpiringSoon 
                                  ? 'bg-yellow-100 text-yellow-800' 
                                  : 'bg-green-100 text-green-800'
                            }`}>
                              {item.isExpired ? 'Hết hạn' : item.isExpiringSoon ? 'Sắp hết hạn' : 'Còn hạn'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 dark:text-gray-400">Không có dữ liệu vaccine</div>
          )}
        </div>
      )}
      </div>
  );
};

export default ThongKeBaoCao;