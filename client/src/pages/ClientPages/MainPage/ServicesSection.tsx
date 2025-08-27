import React from 'react';

const ServicesSection = () => {
  return (
    <section id="services" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Loại Dịch Vụ</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            "Tìm hiểu các gói tiêm chủng được chọn lọc và chất lượng, đa dạng loại vaccine và dịch vụ chăm sóc y tế trọn gói, phù hợp cho từng nhu cầu tiêm phòng."
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Service 1 */}
          <div className="bg-white rounded-lg shadow-lg p-8 transition-all duration-300 hover:shadow-xl" data-aos="fade-up" data-aos-delay="100">
            <div className="text-blue-600 mb-4 inline-block p-4 bg-blue-100 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Tiêm chủng an toàn, cải thiện đễ kháng</h3>
            <p className="text-gray-600">
              Chọn vaccine phù hợp với nhu cầu, đặt mục tiêu và sứ mệnh sức khỏe là trên hết lên hàng đầu.
            </p>
          </div>

          {/* Service 2 */}
          <div className="bg-white rounded-lg shadow-lg p-8 transition-all duration-300 hover:shadow-xl" data-aos="fade-up" data-aos-delay="200">
            <div className="text-blue-600 mb-4 inline-block p-4 bg-blue-100 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Vaccine chất lượng cao</h3>
            <p className="text-gray-600">
              Vaccine có nguồn gốc rõ ràng, được nhập bới các cơ sở y tế uy tín.
            </p>
          </div>

          {/* Service 3 */}
          <div className="bg-white rounded-lg shadow-lg p-8 transition-all duration-300 hover:shadow-xl" data-aos="fade-up" data-aos-delay="300">
            <div className="text-blue-600 mb-4 inline-block p-4 bg-blue-100 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Chăm sóc hậu tiêm phòng</h3>
            <p className="text-gray-600">
              Đội ngũ bác sĩ luôn đồng hành, hỗ trợ theo dõi sức khỏe sau tiêm và tư vấn xử lý các phản ứng phụ nếu có.
            </p>
          </div>

          {/* Service 4 */}
          <div className="bg-white rounded-lg shadow-lg p-8 transition-all duration-300 hover:shadow-xl" data-aos="fade-up" data-aos-delay="400">
            <div className="text-blue-600 mb-4 inline-block p-4 bg-blue-100 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Đăng ký và đặt lịch online</h3>
            <p className="text-gray-600">
              Đặt lịch tiêm chủng nhanh chóng, quản lý lịch sử tiêm dễ dàng và nhận thông báo nhắc lịch tự động, mọi lúc, mọi nơi.
            </p>
          </div>

          {/* Service 5 */}
          <div className="bg-white rounded-lg shadow-lg p-8 transition-all duration-300 hover:shadow-xl" data-aos="fade-up" data-aos-delay="500">
            <div className="text-blue-600 mb-4 inline-block p-4 bg-blue-100 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Nói không với vaccine chất lượng kém</h3>
            <p className="text-gray-600">
              Vaccine được nhập khẩu chính hãng, bảo quản trong điều kiện đạt chuẩn và kiểm định chặt chẽ từ các cơ quan y tế.
            </p>
          </div>

          {/* Service 6 */}
          <div className="bg-white rounded-lg shadow-lg p-8 transition-all duration-300 hover:shadow-xl" data-aos="fade-up" data-aos-delay="600">
            <div className="text-blue-600 mb-4 inline-block p-4 bg-blue-100 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Quản lý hồ sơ tiêm chủng cá nhân</h3>
            <p className="text-gray-600">
              Theo dõi thông tin tiêm chủng của bạn và người thân, tra cứu lịch sử và nhắc lịch tái khám, tiêm phòng thông minh.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;