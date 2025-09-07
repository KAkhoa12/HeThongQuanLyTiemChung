import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllServicesNoPage, getAllServiceTypesNoPage, getServiceConditionsByService } from '../../../services/service.service';
import serviceVaccineService, {
  ServiceVaccineDto,
} from '../../../services/serviceVaccine.service';
import { Service, ServiceType } from '../../../types/service.types';
import { useCart } from '../../../hooks/useCart';
import { useAuth } from '../../../hooks/useAuth';
import ServiceDetailModal from '../../../components/Service/ServiceDetailModal';
import { useToast } from '../../../hooks/useToast';
import vaccineService from '../../../services/vaccine.service';

interface ServiceWithVaccines extends Service {
  vaccines: ServiceVaccineDto[];
  vaccineSchedules?: any[];
  conditions?: any[];
}

const ServiceVaccineListPage: React.FC = () => {
  const [services, setServices] = useState<ServiceWithVaccines[]>([]);
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedServiceType, setSelectedServiceType] = useState<string>('all');
  const [selectedService, setSelectedService] = useState<ServiceWithVaccines | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchServicesWithVaccines();
    fetchServiceTypes();
  }, []);

  const fetchServicesWithVaccines = async () => {
    try {
      setLoading(true);

      console.log('Fetching services...');
      const servicesResponse = await getAllServicesNoPage();
      console.log('Services response:', servicesResponse);

      if (!servicesResponse || servicesResponse.length === 0) {
        console.log('No services found');
        setServices([]);
        return;
      }

      // Fetch vaccines for each service
      const servicesWithVaccines = await Promise.all(
        servicesResponse.map(async (service: Service) => {
          console.log(
            `Fetching vaccines for service ${service.id} (${service.name})`,
          );
          try {
            const vaccines = await serviceVaccineService.getByServiceId(
              service.id,
            );
            console.log(`Vaccines for service ${service.id}:`, vaccines);
            
                         // First, get service conditions to determine minimum age
             let conditions: any[] = [];
             try {
               const serviceConditions = await getServiceConditionsByService(service.id);
               conditions = serviceConditions || [];
             } catch (error) {
               console.error(`Failed to fetch conditions for service ${service.id}:`, error);
               conditions = [];
             }
             
             // Fetch vaccine schedules for each vaccine with age filtering
             let vaccineSchedules: any[] = [];
             if (vaccines && vaccines.length > 0) {
               // Calculate minimum age from service conditions
               let minAgeInMonths: number | undefined = undefined;
               if (conditions && conditions.length > 0) {
                 const validAges = conditions
                   .map((condition: any) => condition.minAgeInMonths || condition.MinAgeInMonths)
                   .filter((age: any) => age !== null && age !== undefined && age >= 0);
                 
                 if (validAges.length > 0) {
                   minAgeInMonths = Math.min(...validAges);
                 }
               }
               
               console.log(`Service ${service.id} - minAgeInMonths:`, minAgeInMonths);
               
               const schedulesPromises = vaccines.map(async (vaccine) => {
                 try {
                   const schedules = await vaccineService.getVaccineSchedulesByVaccine(vaccine.maVaccine, minAgeInMonths);
                   return {
                     vaccineId: vaccine.maVaccine,
                     vaccineName: vaccine.tenVaccine,
                     schedules: schedules?.lichTiemChuans || []
                   };
                 } catch (error) {
                   console.error(`Failed to fetch schedules for vaccine ${vaccine.maVaccine}:`, error);
                   return {
                     vaccineId: vaccine.maVaccine,
                     vaccineName: vaccine.tenVaccine,
                     schedules: []
                   };
                 }
               });
               
               vaccineSchedules = await Promise.all(schedulesPromises);
             }
             
             return {
               ...service,
               vaccines: vaccines || [],
               vaccineSchedules: vaccineSchedules || [],
               conditions: conditions || [],
             };
          } catch (error) {
            console.error(
              `Failed to fetch vaccines for service ${service.id}:`,
              error,
            );
                         return {
               ...service,
               vaccines: [],
               vaccineSchedules: [],
               conditions: [],
             };
          }
        }),
      );

      console.log('Final services with vaccines:', servicesWithVaccines);
      setServices(servicesWithVaccines);
    } catch (error) {
      console.error('Failed to fetch services with vaccines:', error);
      showError('Lỗi tải dữ liệu', 'Không thể tải danh sách dịch vụ. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType =
      selectedServiceType === 'all' ||
      service.serviceTypeId === selectedServiceType;

    return matchesSearch && matchesType;
  });

  const fetchServiceTypes = async () => {
    try {
      const types = await getAllServiceTypesNoPage();
      setServiceTypes(types || []);
    } catch (error) {
      console.error('Failed to fetch service types:', error);
      setServiceTypes([]);
      showError('Lỗi tải dữ liệu', 'Không thể tải danh sách loại dịch vụ. Vui lòng thử lại sau.');
    }
  };

  const getServiceTypeName = (typeId: string | undefined) => {
    if (!typeId) return 'Khác';
    const serviceType = serviceTypes.find(type => type.id === typeId);
    return serviceType ? serviceType.name : 'Khác';
  };

  const handleBuyService = (service: Service) => {
    // Kiểm tra đăng nhập
    if (!isAuthenticated) {
      showError('Lỗi', 'Vui lòng đăng nhập để mua dịch vụ!');
      navigate('/auth/signin');
      return;
    }

    // Thêm dịch vụ vào giỏ hàng (sẽ thay thế dịch vụ cũ)
    const success = addToCart(service);
    
    if (success) {
      showSuccess('Thành công', `Đã thêm "${service.name}" vào giỏ hàng!`);
      // Chuyển đến trang giỏ hàng
      navigate('/cart');
    } else {
      showError('Lỗi', 'Không thể thêm dịch vụ vào giỏ hàng!');
    }
  };

  const handleShowDetail = (service: ServiceWithVaccines) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedService(null);
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-xl text-gray-600">
              Đang tải danh sách dịch vụ...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Dịch Vụ & Vaccine</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Khám phá các dịch vụ tiêm chủng chất lượng cao với vaccine đạt chuẩn
            quốc tế. Chúng tôi cam kết mang đến sự an toàn và hiệu quả tối ưu
            cho sức khỏe của bạn.
          </p>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tìm kiếm dịch vụ
              </label>
              <input
                type="text"
                placeholder="Nhập tên dịch vụ hoặc mô tả..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              />
            </div>

            {/* Service Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loại dịch vụ
              </label>
              <select
                value={selectedServiceType}
                onChange={(e) => setSelectedServiceType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              >
                <option value="all">Tất cả loại dịch vụ</option>
                {serviceTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        {filteredServices.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-gray-400 text-8xl mb-6">🔍</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              {searchTerm || selectedServiceType !== 'all'
                ? 'Không tìm thấy dịch vụ nào'
                : 'Chưa có dịch vụ nào'}
            </h3>
            <p className="text-gray-600 text-lg">
              {searchTerm || selectedServiceType !== 'all'
                ? 'Thử thay đổi từ khóa tìm kiếm hoặc loại dịch vụ'
                : 'Hệ thống đang được cập nhật, vui lòng quay lại sau'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                {/* Service Header */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm font-medium">
                      {getServiceTypeName(service.serviceTypeId)}
                    </span>
                    <div className="text-2xl">💉</div>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{service.name}</h3>
                  {service.description && (
                    <p className="text-blue-100 text-sm line-clamp-2">
                      {service.description}
                    </p>
                  )}
                </div>

                {/* Service Details */}
                <div className="p-6">
                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 text-sm">
                        Giá dịch vụ:
                      </span>
                      <span className="text-2xl font-bold text-green-600">
                        {service.price
                          ? `${service.price.toLocaleString('vi-VN')} VNĐ`
                          : 'Liên hệ'}
                      </span>
                    </div>
                  </div>

                                     {/* Service Conditions Section */}
                   {service.conditions && service.conditions.length > 0 && (
                     <div className="mb-6">
                       <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                         <span className="text-orange-600 mr-2">📋</span>
                         Điều kiện dịch vụ
                       </h4>
                       <div className="space-y-2">
                         {service.conditions.map((condition: any) => (
                           <div key={condition.conditionId} className="bg-orange-50 rounded-lg p-3 border-l-4 border-orange-400">
                             <div className="font-medium text-orange-800 mb-1">
                               Tuổi tháng tối thiểu: {condition.minAgeInMonths} tháng
                             </div>
                             <div className="font-medium text-orange-800 mb-1">
                               Tuổi tháng tối đa: {condition.maxAgeInMonths} tháng
                             </div>
                             <div className="text-sm text-orange-700">
                               Ghi chú: {condition.note}
                             </div>
                             <div className="text-sm text-orange-700">
                               Giới tính: {condition.gender == null ? 'Tất cả' : condition.gender }
                             </div>
                           </div>
                         ))}
                       </div>
                     </div>
                   )}
                  <div className="flex justify-center">
                    <button 
                      onClick={() => handleShowDetail(service)}
                      className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
                    >
                      <span className="mr-2">ℹ️</span>
                      Chi tiết
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Statistics Section */}
        <div className="mt-20 bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Thống kê dịch vụ của chúng tôi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {services.length}
              </div>
              <div className="text-gray-600">Dịch vụ đang cung cấp</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">
                {services.reduce(
                  (total, service) => total + (service.vaccineSchedules && service.vaccineSchedules.length > 0 ? service.vaccineSchedules.reduce((sTotal, vs) => sTotal + (vs.schedules && vs.schedules.length > 0 ? vs.schedules.length : 0), 0) : 0),
                  0,
                )}
              </div>
              <div className="text-gray-600">Lịch tiêm chuẩn</div>
            </div>
                         <div className="text-center">
               <div className="text-4xl font-bold text-purple-600 mb-2">
                 {services.reduce(
                   (total, service) => total + (service.conditions && service.conditions.length > 0 ? service.conditions.length : 0),
                   0,
                 )}
               </div>
               <div className="text-gray-600">Điều kiện dịch vụ</div>
             </div>
                         <div className="text-center">
               <div className="text-4xl font-bold text-orange-600 mb-2">
                 {services.length}
               </div>
               <div className="text-gray-600">Dịch vụ hoạt động</div>
             </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-blue-600  to-purple-600 rounded-2xl p-12 text-white">
            <h2 className="text-4xl font-bold mb-6">
              Sẵn sàng bảo vệ sức khỏe của bạn?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Hãy liên hệ với chúng tôi để được tư vấn và đặt lịch tiêm chủng
              ngay hôm nay!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-bold text-lg transition-colors duration-200">
                📞 Liên hệ ngay
              </button>
              <button className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-lg font-bold text-lg transition-colors duration-200">
                📋 Đặt lịch online
              </button>
            </div>
          </div>
                 </div>
       </div>

               {/* Service Detail Modal */}
        <ServiceDetailModal
          service={selectedService as any}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onAddToCart={handleBuyService}
        />

        {/* Vaccine Detail Modal */}
      </div>
    );
  };

export default ServiceVaccineListPage;
