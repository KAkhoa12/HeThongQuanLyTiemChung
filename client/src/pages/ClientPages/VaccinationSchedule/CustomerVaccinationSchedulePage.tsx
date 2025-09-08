import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../../store/useAuthStore';
import { useOrders } from '../../../hooks/useOrders';
import { useKeHoachTiemByOrder } from '../../../hooks/useKeHoachTiem';
import { KeHoachTiemByOrderFullResponse } from '../../../services/keHoachTiem.service';

const CustomerVaccinationSchedulePage: React.FC = () => {
  const { user } = useAuthStore();
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  const [orderSchedules, setOrderSchedules] = useState<Record<string, KeHoachTiemByOrderFullResponse>>({});
  // Hooks
  const { orders: ordersData, loading: ordersLoading, execute: fetchOrders } = useOrders();
  const { data: scheduleData, loading: scheduleLoading, execute: fetchSchedule } = useKeHoachTiemByOrder();
  // Fetch orders with PAID status
  useEffect(() => {
    if (user?.maNguoiDung) {
      fetchOrders({
        page: 1,
        pageSize: 100,
        status: 'PAID',
        search: ''
      });
    }
  }, [user?.maNguoiDung]);

  // Store schedule data when fetched
  useEffect(() => {
    if (scheduleData && scheduleData.orderId) {
      const transformedData = transformScheduleData(scheduleData);
      setOrderSchedules(prev => ({
        ...prev,
        [scheduleData.orderId]: transformedData
      }));
    }
  }, [scheduleData]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'SCHEDULED': return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS': return 'bg-purple-100 text-purple-800';
      case 'MISSED': return 'bg-red-100 text-red-800';
      case 'CANCELLED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'Hoàn thành';
      case 'PENDING': return 'Chờ xử lý';
      case 'SCHEDULED': return 'Đã lên lịch';
      case 'IN_PROGRESS': return 'Đang tiến hành';
      case 'MISSED': return 'Đã bỏ lỡ';
      case 'CANCELLED': return 'Đã hủy';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED': return '✅';
      case 'PENDING': return '⏳';
      case 'SCHEDULED': return '📅';
      case 'IN_PROGRESS': return '🔄';
      case 'MISSED': return '❌';
      case 'CANCELLED': return '🚫';
      default: return '❓';
    }
  };

  const handleOrderToggle = (orderId: string) => {
    const newExpandedOrders = new Set(expandedOrders);
    if (newExpandedOrders.has(orderId)) {
      newExpandedOrders.delete(orderId);
    } else {
      newExpandedOrders.add(orderId);
      // Fetch schedule data if not already loaded
      if (!orderSchedules[orderId]) {
        fetchSchedule({ orderId });
      }
    }
    setExpandedOrders(newExpandedOrders);
  };

  // Transform API response to structured format
  const transformScheduleData = (apiResponse: KeHoachTiemByOrderFullResponse): KeHoachTiemByOrderFullResponse => {
    if (!apiResponse || !apiResponse.plans || apiResponse.plans.length === 0) {
      return {
        orderId: apiResponse?.orderId || '',
        totalPlans: 0,
        plans: [],
        scheduleByMuiThu: []
      };
    }

    return apiResponse;
  };

  if (ordersLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Lịch tiêm chủng của tôi</h1>
        <p className="text-gray-600">Theo dõi các đơn hàng đã thanh toán và lịch tiêm chủng</p>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {ordersData && ordersData.length > 0 ? (
          ordersData.map((order: any) => {
            const isExpanded = expandedOrders.has(order.maDonHang);
            const orderSchedule = orderSchedules[order.maDonHang];
            
            return (
              <div key={order.maDonHang} className="bg-white rounded-lg shadow-sm border border-gray-200">
                {/* Order Header */}
                <div 
                  className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => handleOrderToggle(order.maDonHang)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Đơn hàng #{order.maDonHang.slice(-8)}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                            {order.trangThaiDon}
                          </span>
                          <span className="text-lg font-bold text-green-600">
                            {order.tongTienThanhToan.toLocaleString('vi-VN')} VNĐ
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">
                        Ngày đặt: {new Date(order.ngayDat).toLocaleDateString('vi-VN')}
                      </p>

                      {/* Services */}
                      <div className="space-y-2">
                        {order.donHangChiTiets?.map((detail: any, index: number) => (
                          <div key={index} className="p-3 bg-gray-50 rounded-lg">
                            <h4 className="font-medium text-gray-900">{detail.maDichVuNavigation?.ten}</h4>
                            <p className="text-sm text-gray-600">
                              {detail.soMuiChuan} mũi - {detail.donGiaMui.toLocaleString('vi-VN')} VNĐ
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="ml-4 flex items-center">
                      <span className="text-sm text-gray-500 mr-2">
                        {isExpanded ? 'Thu gọn' : 'Xem lịch tiêm'}
                      </span>
                      <svg 
                        className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Expanded Content - Vaccination Schedule */}
                {isExpanded && (
                  <div className="border-t border-gray-200 p-6 bg-gray-50">
                    {scheduleLoading ? (
                      <div className="flex justify-center items-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="ml-2 text-gray-600">Đang tải lịch tiêm...</span>
                      </div>
                    ) : orderSchedule ? (
                      <div>
                        <div className="mb-4">
                          <h4 className="text-lg font-semibold text-gray-900 mb-2">
                            📅 Kế hoạch tiêm trong dịch vụ này
                          </h4>
                          <p className="text-sm text-gray-600">
                            Tổng số mũi tiêm: {orderSchedule.totalPlans}
                          </p>
                        </div>

                        {/* Schedule by Mui Thu */}
                        {orderSchedule.scheduleByMuiThu && orderSchedule.scheduleByMuiThu.length > 0 ? (
                          <div className="space-y-4">
                            {orderSchedule.scheduleByMuiThu.map((schedule: any, index: number) => (
                              <div key={index} className="bg-white rounded-lg border border-gray-200 p-4">
                                <div className="flex justify-between items-center mb-3">
                                  <h5 className="text-md font-semibold text-gray-900">
                                    💉 Tiêm lần thứ {schedule.muiThu}
                                  </h5>
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {schedule.totalVaccines} vaccine
                                  </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                  {schedule.vaccines && schedule.vaccines.length > 0 ? (
                                    schedule.vaccines.map((vaccine: any, vaccineIndex: number) => (
                                      <div key={vaccineIndex} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                        <div className="flex items-center justify-between mb-2">
                                          <h6 className="font-medium text-gray-900 text-sm">{vaccine.vaccineName}</h6>
                                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(vaccine.trangThai)}`}>
                                            {getStatusText(vaccine.trangThai)}
                                          </span>
                                        </div>
                                        <div className="flex items-center">
                                          <span className="text-xs text-gray-600 mr-2">{getStatusIcon(vaccine.trangThai)}</span>
                                          <span className="text-xs text-gray-600">
                                            {vaccine.ngayDuKien ? 
                                              new Date(vaccine.ngayDuKien).toLocaleDateString('vi-VN') : 
                                              'Chưa xác định'
                                            }
                                          </span>
                                        </div>
                                      </div>
                                    ))
                                  ) : (
                                    <div className="col-span-full text-center py-2 text-gray-500 text-sm">
                                      Không có vaccine nào trong mũi này
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                              <span className="text-2xl">📅</span>
                            </div>
                            <p className="text-gray-500">Chưa có lịch tiêm</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                          <span className="text-2xl">📅</span>
                        </div>
                        <p className="text-gray-500">Chưa có lịch tiêm</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-4xl">🛒</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Chưa có đơn hàng nào</h3>
            <p className="text-gray-600 mb-6">Bạn chưa có đơn hàng nào đã thanh toán</p>
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Xem dịch vụ tiêm chủng
            </button>
          </div>
        )}
      </div>

      {/* Error Messages */}
      {scheduleData && typeof scheduleData === 'object' && 'error' in scheduleData && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
          <p className="text-red-800">Lỗi: {String(scheduleData.error)}</p>
        </div>
      )}
    </div>
  );
};

export default CustomerVaccinationSchedulePage;