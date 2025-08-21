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
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Chuyên khoa tiêm chủng</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Tìm hiểu các chuyên khoa tiêm chủng tại HUITKIT, cung cấp dịch vụ tiêm phòng toàn diện và an toàn cho mọi lứa tuổi.
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
                  Tiêm chủng tim mạch
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
                  Tiêm chủng thần kinh
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
                  Tiêm chủng gan mật
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
                  Tiêm chủng nhi khoa
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
                  Tiêm chủng mắt & phòng bệnh thị giác
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
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4">Tiêm chủng bảo vệ tim mạch</h3>
                  <p className="text-gray-600 italic mb-4">
                    Bảo vệ sức khỏe tim mạch của bạn và gia đình với các loại vaccine được khuyến cáo.
                  </p>
                  <p className="text-gray-600">
                    Đội ngũ bác sĩ chuyên khoa sẽ tư vấn và tiêm chủng các loại vaccine giúp phòng ngừa những bệnh có thể gây ảnh hưởng nghiêm trọng đến hệ tim mạch. Đảm bảo quy trình an toàn và theo dõi sau tiêm.
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
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4">Tiêm chủng bảo vệ hệ thần kinh</h3>
                  <p className="text-gray-600 italic mb-4">
                    Ngăn ngừa các bệnh lây nhiễm có nguy cơ ảnh hưởng đến hệ thần kinh.
                  </p>
                  <p className="text-gray-600">
                    Các loại vaccine phòng bệnh viêm màng não, viêm não Nhật Bản, bại liệt… được thực hiện theo đúng phác đồ chuẩn. Đảm bảo an toàn tiêm chủng và hỗ trợ chăm sóc sau tiêm.
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
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4">Tiêm phòng các bệnh lý gan</h3>
                  <p className="text-gray-600 italic mb-4">
                    Bảo vệ gan của bạn bằng các loại vaccine phòng bệnh viêm gan phổ biến.
                  </p>
                  <p className="text-gray-600">
                    Cung cấp dịch vụ tiêm chủng vaccine viêm gan A, B và các bệnh lý liên quan đến gan, giúp bảo vệ sức khỏe và giảm thiểu nguy cơ mắc bệnh.
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
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4">Tiêm phòng cho trẻ em</h3>
                  <p className="text-gray-600 italic mb-4">
                    Chăm sóc sức khỏe trẻ em với các gói vaccine đầy đủ, phù hợp từng giai đoạn phát triển.
                  </p>
                  <p className="text-gray-600">
                    Đội ngũ bác sĩ nhi khoa tư vấn và xây dựng phác đồ tiêm chủng riêng cho từng độ tuổi. Đảm bảo an toàn và theo dõi sát sao tình trạng sức khỏe của trẻ sau tiêm.
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
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4">Bảo vệ sức khỏe thị giác</h3>
                  <p className="text-gray-600 italic mb-4">
                    Phòng ngừa các bệnh nhiễm trùng mắt bằng các loại vaccine chuyên biệt.
                  </p>
                  <p className="text-gray-600">
                    Cung cấp các loại vaccine giúp giảm nguy cơ mắc bệnh về mắt do virus, vi khuẩn. Được tư vấn bởi đội ngũ chuyên gia nhãn khoa giàu kinh nghiệm.
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