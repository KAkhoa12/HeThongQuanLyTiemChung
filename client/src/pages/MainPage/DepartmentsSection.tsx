import React, { useState } from 'react';

const DepartmentsSection = () => {
  const [activeTab, setActiveTab] = useState('departments-tab-1');

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
  };

  return (
    <section id="departments" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Hệ thống các cơ sở tiêm chủng</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            HUITKIT hiện có nhiều cơ sở tiêm chủng hiện đại, thuận tiện và an toàn trên toàn quốc.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row" data-aos="fade-up" data-aos-delay="100">
          {/* Tabs Navigation */}
          <div className="w-full lg:w-1/4 mb-6 lg:mb-0">
            <ul className="border-r border-gray-200">
              <li className="mb-2">
                <button
                  className={`w-full text-left px-4 py-3 font-medium transition-colors duration-200 ${
                    activeTab === 'departments-tab-1'
                      ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => handleTabClick('departments-tab-1')}
                >
                  Cơ sở Quận 1
                </button>
              </li>
              <li className="mb-2">
                <button
                  className={`w-full text-left px-4 py-3 font-medium transition-colors duration-200 ${
                    activeTab === 'departments-tab-2'
                      ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => handleTabClick('departments-tab-2')}
                >
                  Cơ sở quận Tân Bình
                </button>
              </li>
              <li className="mb-2">
                <button
                  className={`w-full text-left px-4 py-3 font-medium transition-colors duration-200 ${
                    activeTab === 'departments-tab-3'
                      ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => handleTabClick('departments-tab-3')}
                >
                  Cơ sở Quận Bình Thạnh
                </button>
              </li>
              <li className="mb-2">
                <button
                  className={`w-full text-left px-4 py-3 font-medium transition-colors duration-200 ${
                    activeTab === 'departments-tab-4'
                      ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => handleTabClick('departments-tab-4')}
                >
                  Cơ sở Cầu Giấy, Hà Nội
                </button>
              </li>
              <li className="mb-2">
                <button
                  className={`w-full text-left px-4 py-3 font-medium transition-colors duration-200 ${
                    activeTab === 'departments-tab-5'
                      ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => handleTabClick('departments-tab-5')}
                >
                  Cơ Sở Đà Nẵng
                </button>
              </li>
            </ul>
          </div>

          {/* Tab Content */}
          <div className="w-full lg:w-3/4 lg:pl-8">
            {/* Tab 1 */}
            <div className={`${activeTab === 'departments-tab-1' ? 'block' : 'hidden'}`}>
              <div className="flex flex-col lg:flex-row items-start">
                <div className="w-full lg:w-2/3 lg:pr-8 order-2 lg:order-1">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4">Cơ sở Quận 1</h3>
                  <p className="text-gray-600 italic mb-4">
                    Nằm tại trung tâm TP.HCM, cung cấp đầy đủ dịch vụ tiêm chủng cho trẻ em và người lớn.
                  </p>
                  <p className="text-gray-600">
                    Được trang bị cơ sở vật chất hiện đại, phòng tiêm đạt chuẩn Bộ Y tế và đội ngũ bác sĩ giàu kinh nghiệm, mang đến trải nghiệm an toàn và thuận tiện.
                  </p>
                </div>
                <div className="w-full lg:w-1/3 mb-6 lg:mb-0 order-1 lg:order-2">
                  <img
                    // src={department1}
                    alt="Cardiology Department"
                    className="rounded-lg shadow-md w-full h-auto"
                  />
                </div>
              </div>
            </div>

            {/* Tab 2 */}
            <div className={`${activeTab === 'departments-tab-2' ? 'block' : 'hidden'}`}>
              <div className="flex flex-col lg:flex-row items-start">
                <div className="w-full lg:w-2/3 lg:pr-8 order-2 lg:order-1">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4">Cơ sở Quận Tân Bình</h3>
                  <p className="text-gray-600 italic mb-4">
                    Cơ sở thuận tiện, gần sân bay Tân Sơn Nhất, dễ dàng di chuyển từ các quận lân cận.
                  </p>
                  <p className="text-gray-600">
                    Dịch vụ tiêm chủng đa dạng, hỗ trợ đặt lịch online nhanh chóng, phòng chờ thoải mái và hệ thống bảo quản vaccine đạt tiêu chuẩn.
                  </p>
                </div>
                <div className="w-full lg:w-1/3 mb-6 lg:mb-0 order-1 lg:order-2">
                  <img
                    // src={department2}
                    alt="Neurology Department"
                    className="rounded-lg shadow-md w-full h-auto"
                  />
                </div>
              </div>
            </div>

            {/* Tab 3 */}
            <div className={`${activeTab === 'departments-tab-3' ? 'block' : 'hidden'}`}>
              <div className="flex flex-col lg:flex-row items-start">
                <div className="w-full lg:w-2/3 lg:pr-8 order-2 lg:order-1">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4">Cơ sở Bình Thạnh</h3>
                  <p className="text-gray-600 italic mb-4">
                    Phục vụ khu vực Bình Thạnh và các quận lân cận với hệ thống phòng tiêm hiện đại.
                  </p>
                  <p className="text-gray-600">
                    Đội ngũ bác sĩ chuyên khoa tư vấn tận tình, vaccine nhập khẩu chính hãng, quy trình tiêm chủng khép kín, đảm bảo an toàn tuyệt đối.
                  </p>
                </div>
                <div className="w-full lg:w-1/3 mb-6 lg:mb-0 order-1 lg:order-2">
                  <img
                    // src={department3}
                    alt="Hepatology Department"
                    className="rounded-lg shadow-md w-full h-auto"
                  />
                </div>
              </div>
            </div>

            {/* Tab 4 */}
            <div className={`${activeTab === 'departments-tab-4' ? 'block' : 'hidden'}`}>
              <div className="flex flex-col lg:flex-row items-start">
                <div className="w-full lg:w-2/3 lg:pr-8 order-2 lg:order-1">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4">Cơ sở Cầu Giấy, Hà Nội</h3>
                  <p className="text-gray-600 italic mb-4">
                    Trung tâm tiêm chủng lớn nhất miền Bắc, đa dạng vaccine, dịch vụ chuyên nghiệp.
                  </p>
                  <p className="text-gray-600">
                    Cơ sở rộng rãi, tiện nghi, áp dụng quy trình tiêm chủng thông minh, quản lý hồ sơ tiêm online và hỗ trợ nhắc lịch tái tiêm tự động.
                  </p>
                </div>
                <div className="w-full lg:w-1/3 mb-6 lg:mb-0 order-1 lg:order-2">
                  <img
                    // src={department4}
                    alt="Pediatrics Department"
                    className="rounded-lg shadow-md w-full h-auto"
                  />
                </div>
              </div>
            </div>

            {/* Tab 5 */}
            <div className={`${activeTab === 'departments-tab-5' ? 'block' : 'hidden'}`}>
              <div className="flex flex-col lg:flex-row items-start">
                <div className="w-full lg:w-2/3 lg:pr-8 order-2 lg:order-1">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4">Cơ sở Đà Nẵng</h3>
                  <p className="text-gray-600 italic mb-4">
                    Địa điểm lý tưởng cho khách hàng thuộc Thành Phố Đà Nẵng với đầy đủ dịch vụ tiêm chủng và tư vấn sức khỏe.
                  </p>
                  <p className="text-gray-600">
                    Hệ thống bảo quản vaccine đạt tiêu chuẩn GSP, dịch vụ thân thiện và đội ngũ y bác sĩ chuyên môn cao, mang đến sự yên tâm tối đa cho khách hàng.
                  </p>
                </div>
                <div className="w-full lg:w-1/3 mb-6 lg:mb-0 order-1 lg:order-2">
                  <img
                    // src={department5}
                    alt="Eye Care Department"
                    className="rounded-lg shadow-md w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DepartmentsSection;