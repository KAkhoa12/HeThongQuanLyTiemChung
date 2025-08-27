import React, { useState, useEffect } from 'react';
import { getAllLocationsNoPage, LocationDto } from '../../../services/location.service';

const DepartmentsSection = () => {
  const [activeTab, setActiveTab] = useState<string>('');
  const [departments, setDepartments] = useState<LocationDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      setLoading(true);
      const locations = await getAllLocationsNoPage();
      setDepartments(locations);
      
      // Set active tab đầu tiên nếu có dữ liệu
      if (locations && locations.length > 0 && !activeTab) {
        setActiveTab(locations[0].id);
      }
    } catch (err) {
      console.error('Failed to fetch locations:', err);
      setError('Không thể tải danh sách địa điểm');
    } finally {
      setLoading(false);
    }
  };

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
  };

  const currentDepartment = departments?.find(dept => dept.id === activeTab);

  // Loading state
  if (loading) {
    return (
      <section id="departments" className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Đang tải danh sách địa điểm...</p>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section id="departments" className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="text-red-600 text-xl mb-4">⚠️</div>
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={fetchLocations}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
            >
              Thử lại
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Empty state
  if (!Array.isArray(departments) || departments.length === 0) {
    return (
      <section id="departments" className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="text-gray-400 text-6xl mb-4">🏥</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Chưa có địa điểm nào</h2>
            <p className="text-gray-600">Hệ thống đang được cập nhật, vui lòng quay lại sau.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="departments" className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Hệ thống các cơ sở tiêm chủng</h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg">
            HUITKIT hiện có {Array.isArray(departments) ? departments.length : 0} cơ sở tiêm chủng hiện đại, thuận tiện và an toàn trên toàn quốc. 
            Mỗi cơ sở đều được trang bị đầy đủ thiết bị y tế tiên tiến và đội ngũ nhân viên chuyên nghiệp.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8" data-aos="fade-up" data-aos-delay="100">
          {/* Tabs Navigation */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">Chọn cơ sở</h3>
              <ul className="space-y-3">
                {Array.isArray(departments) && departments.map((dept) => (
                  <li key={dept.id}>
                    <button
                      className={`w-full text-left px-4 py-4 rounded-lg font-medium transition-all duration-300 ${
                        activeTab === dept.id
                          ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                          : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                      }`}
                      onClick={() => handleTabClick(dept.id)}
                    >
                      <div className="font-semibold">{dept.name}</div>
                      <div className="text-sm opacity-80 mt-1">
                        {dept.address.split(',')[0]}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Tab Content */}
          <div className="w-full lg:w-2/3">
            {currentDepartment && Array.isArray(departments) && (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden" data-aos="fade-left">
                {/* Header with image */}
                <div className="relative h-64 bg-gradient-to-r from-blue-600 to-indigo-700">
                  <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <h3 className="text-3xl font-bold mb-2">{currentDepartment.name}</h3>
                      <p className="text-blue-100 text-lg">{currentDepartment.address}</p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left column - Description and contact info */}
                    <div>
                      <h4 className="text-xl font-semibold text-gray-800 mb-4">Thông tin cơ sở</h4>
                      {currentDepartment.description && (
                        <p className="text-gray-600 mb-6 italic">{currentDepartment.description}</p>
                      )}
                      
                      <div className="space-y-4">
                        <div className="flex items-center text-gray-700">
                          <svg className="w-5 h-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="font-medium">Địa chỉ:</span>
                          <span className="ml-2">{currentDepartment.address}</span>
                        </div>
                        
                        {currentDepartment.phone && (
                          <div className="flex items-center text-gray-700">
                            <svg className="w-5 h-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <span className="font-medium">Điện thoại:</span>
                            <span className="ml-2">{currentDepartment.phone}</span>
                          </div>
                        )}
                        
                        {currentDepartment.openingHours && (
                          <div className="flex items-center text-gray-700">
                            <svg className="w-5 h-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="font-medium">Giờ làm việc:</span>
                            <span className="ml-2">{currentDepartment.openingHours}</span>
                          </div>
                        )}

                        {currentDepartment.email && (
                          <div className="flex items-center text-gray-700">
                            <svg className="w-5 h-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span className="font-medium">Email:</span>
                            <span className="ml-2">{currentDepartment.email}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right column - Features and additional info */}
                    <div>
                      <h4 className="text-xl font-semibold text-gray-800 mb-4">Thông tin bổ sung</h4>
                      
                      <div className="space-y-4">
                        {currentDepartment.type && (
                          <div className="flex items-center text-gray-700">
                            <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            <span className="font-medium">Loại cơ sở:</span>
                            <span className="ml-2">{currentDepartment.type}</span>
                          </div>
                        )}

                        {currentDepartment.capacity && (
                          <div className="flex items-center text-gray-700">
                            <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <span className="font-medium">Sức chứa:</span>
                            <span className="ml-2">{currentDepartment.capacity} người/ngày</span>
                          </div>
                        )}

                        <div className="flex items-center text-gray-700">
                          <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-700">Phòng tiêm đạt chuẩn Bộ Y tế</span>
                        </div>

                        <div className="flex items-center text-gray-700">
                          <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-700">Đội ngũ bác sĩ chuyên nghiệp</span>
                        </div>

                        <div className="flex items-center text-gray-700">
                          <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-700">Hệ thống bảo quản vaccine hiện đại</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Call to action */}
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Đặt lịch tiêm chủng
                      </button>
                      <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        Xem bản đồ
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DepartmentsSection;