import React, { useState, useEffect } from 'react';
import { Service } from '../../types/service.types';
import { ServiceVaccineDto } from '../../services/serviceVaccine.service';
import vaccineService from '../../services/vaccine.service';

interface ServiceDetailModalProps {
  service: Service & { 
    vaccines: ServiceVaccineDto[];
    vaccineSchedules?: any[];
    conditions?: any[];
  } | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (service: Service) => void;
}

const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  service,
  isOpen,
  onClose,
  onAddToCart,
}) => {
  const [vaccineDetails, setVaccineDetails] = useState<{[key: string]: any}>({});
  const [loadingVaccineDetails, setLoadingVaccineDetails] = useState(false);
  
  // Fetch detailed vaccine information when modal opens
  useEffect(() => {
    if (isOpen && service && service.vaccines && service.vaccines.length > 0) {
      fetchVaccineDetails();
    }
  }, [isOpen, service]);

  const fetchVaccineDetails = async () => {
    if (!service || !service.vaccines) return;
    
    setLoadingVaccineDetails(true);
    try {
      const vaccineDetailsPromises = service.vaccines.map(async (vaccine) => {
        try {
          const details = await vaccineService.getVaccine(vaccine.maVaccine);
          return {
            vaccineId: vaccine.maVaccine,
            details: details
          };
        } catch (error) {
          console.error(`Failed to fetch details for vaccine ${vaccine.maVaccine}:`, error);
          return {
            vaccineId: vaccine.maVaccine,
            details: null
          };
        }
      });
      
      const results = await Promise.all(vaccineDetailsPromises);
      const detailsMap: {[key: string]: any} = {};
      results.forEach(result => {
        detailsMap[result.vaccineId] = result.details;
      });
      
      setVaccineDetails(detailsMap);
    } catch (error) {
      console.error('Error fetching vaccine details:', error);
    } finally {
      setLoadingVaccineDetails(false);
    }
  };
  
  if (!isOpen || !service) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4 text-white">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold">{service.name}</h3>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            {/* Description */}
            {service.description && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Mô tả dịch vụ</h4>
                <p className="text-gray-600">{service.description}</p>
              </div>
            )}

            {/* Price */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Giá dịch vụ</h4>
              <div className="text-3xl font-bold text-green-600">
                {service.price
                  ? `${service.price.toLocaleString('vi-VN')} VNĐ`
                  : 'Liên hệ'}
              </div>
            </div>

            {/* Service Conditions */}
            {service.conditions && service.conditions.length > 0 && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <span className="text-orange-600 mr-2">📋</span>
                  Điều Kiện Dịch Vụ
                </h4>
                <div className="space-y-3">
                  {service.conditions.map((condition: any) => (
                    <div
                      key={condition.conditionId}
                      className="bg-orange-50 rounded-lg p-4 border border-orange-200"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="flex justify-between">
                          <span className="font-medium text-orange-700">Tuổi tối thiểu:</span>
                          <span className="text-orange-800">{condition.minAgeInMonths} tháng</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium text-orange-700">Tuổi tối đa:</span>
                          <span className="text-orange-800">{condition.maxAgeInMonths} tháng</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium text-orange-700">Giới tính:</span>
                          <span className="text-orange-800">
                            {condition.gender === null ? 'Tất cả' : condition.gender}
                          </span>
                        </div>
                        {condition.note && (
                          <div className="col-span-2 mt-2 p-2 bg-orange-100 border border-orange-200 rounded">
                            <span className="font-medium text-orange-800">Ghi chú:</span>
                            <span className="text-orange-700 ml-2">{condition.note}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Vaccines */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <span className="text-blue-600 mr-2">🦠</span>
                Vaccine Đính Kèm
              </h4>
              
              {service.vaccines.length === 0 ? (
                <div className="text-center py-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-500 text-sm">
                    Chưa có vaccine đính kèm nào
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {service.vaccines.map((vaccine) => {
                    const vaccineSchedule = service.vaccineSchedules && service.vaccineSchedules.length > 0 ? service.vaccineSchedules.find(
                      (vs: any) => vs.vaccineId === vaccine.maVaccine
                    ) : null;
                    
                    const vaccineDetail = vaccineDetails[vaccine.maVaccine];

                    return (
                      <div
                        key={vaccine.maVaccine}
                        className="bg-blue-50 rounded-lg p-4 border border-blue-200"
                      >
                        {/* Vaccine Header */}
                        <div className="bg-blue-600 text-white rounded-lg p-3 mb-3">
                          <h5 className="font-bold text-lg mb-1">💉 {vaccine.tenVaccine} </h5>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium">Số mũi chuẩn theo phác đồ:</span> {vaccine.soMuiChuan}
                            </div>
                          </div>
                        </div>

                        {/* Vaccine Details */}
                        {loadingVaccineDetails ? (
                          <div className="mb-3 p-3 bg-gray-100 rounded-lg">
                            <div className="animate-pulse">
                              <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                            </div>
                          </div>
                        ) : vaccineDetail ? (
                          <div className="mb-3 p-3 bg-white rounded-lg border border-blue-200">
                            <h6 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                              <span className="text-blue-600 mr-2">ℹ️</span>
                              Thông tin chi tiết vaccine
                            </h6>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                              {vaccineDetail.nhaSanXuat && (
                                <div className="flex justify-between">
                                  <span className="font-medium text-gray-600">Nhà sản xuất:</span>
                                  <span className="text-gray-800">{vaccineDetail.nhaSanXuat}</span>
                                </div>
                              )}
                            </div>
                            
                            {/* Phòng ngừa */}
                            {vaccineDetail.phongNgua && (
                              <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                                <span className="font-medium text-yellow-800 text-sm">Phòng ngừa:</span>
                                <p className="text-yellow-700 text-sm mt-1">{vaccineDetail.phongNgua}</p>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="mb-3 p-3 bg-gray-100 rounded-lg">
                            <p className="text-gray-500 text-sm">Không thể tải thông tin chi tiết vaccine</p>
                          </div>
                        )}

                        {/* Vaccine Schedules */}
                        {vaccineSchedule && vaccineSchedule.schedules && vaccineSchedule.schedules.length > 0 ? (
                          <div className="mb-3">
                            <h6 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                              <span className="text-blue-600 mr-2">📅</span>
                              Lịch tiểm chuẩn theo từng giai đoạn
                            </h6>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {vaccineSchedule.schedules.map((schedule: any) => (
                                <div key={schedule.maLichTiemChuan} className="bg-white rounded-lg p-3 border border-blue-200">
                                  <div className=" mb-2">
                                    Số mũi cần tiêm trong giai đoạn này là <span className="font-bold text-blue-600">{schedule.muiThu}</span>
                                  </div>
                                  <div className="space-y-1 text-xs">
                                    <div className="flex justify-between">
                                      <span className="font-medium text-gray-600">Tuổi:</span>
                                      <span className="text-gray-800">
                                        {schedule.tuoiThangToiThieu !== null && schedule.tuoiThangToiThieu >= 0 ? `${schedule.tuoiThangToiThieu}` : '0'} - {schedule.tuoiThangToiDa !== null && schedule.tuoiThangToiDa >= 0 ? `${schedule.tuoiThangToiDa}` : '∞'} tháng
                                      </span>
                                    </div>
                                    {schedule.soNgaySauMuiTruoc !== null && schedule.soNgaySauMuiTruoc !== undefined && (
                                      <div className="flex justify-between">
                                        <span className="font-medium text-gray-600">Tiêm sau mũi trước đó:</span>
                                        <span className="text-gray-800">{schedule.soNgaySauMuiTruoc} ngày</span>
                                      </div>
                                    )}
                                    {schedule.ghiChu && (
                                      <div className="mt-2 p-1 bg-yellow-50 border border-yellow-200 rounded text-xs">
                                        <span className="font-medium text-yellow-800">Ghi chú:</span>
                                        <span className="text-yellow-700 ml-1">{schedule.ghiChu}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-3 bg-gray-100 rounded-lg">
                            <p className="text-gray-500 text-xs">Chưa có lịch tiêm chuẩn cho vaccine này</p>
                          </div>
                        )}

                        {/* Vaccine Notes */}
                        {vaccine.ghiChu && (
                          <div className="mt-3 p-2 bg-blue-100 border border-blue-200 rounded">
                            <span className="font-medium text-blue-800 text-sm">Ghi chú vaccine:</span>
                            <span className="text-blue-700 text-sm ml-2">{vaccine.ghiChu}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Additional Info */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Thông tin bổ sung</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Trạng thái:</span>
                  <span className="ml-2 text-green-600 font-medium">Hoạt động</span>
                </div>
                <div>
                  <span className="text-gray-600">Loại dịch vụ:</span>
                  <span className="ml-2 text-blue-600 font-medium">
                    {service.serviceTypeName || 'Chưa phân loại'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 flex space-x-3">
            <button
              onClick={() => {
                onAddToCart(service);
                onClose();
              }}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
            >
              <span className="mr-2">🛒</span>
              Mua dịch vụ
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium transition-colors duration-200"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailModal; 