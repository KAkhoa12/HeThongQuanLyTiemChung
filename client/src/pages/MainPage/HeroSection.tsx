import React from 'react';
import { Link } from 'react-router-dom';
// import heroImage from '../../images/hero-bg.jpg';

const HeroSection = () => {
  return (
    <section id="hero" className="relative min-h-[600px] w-full bg-gray-100">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <img 
          // src={heroImage} 
          alt="Hero Background" 
          className="w-full h-full object-cover"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-blue-900/70"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-16 relative z-10 flex flex-col items-center justify-center min-h-[600px] text-center">
        <div className="max-w-3xl mx-auto text-white" data-aos="fade-down" data-aos-delay="100">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Chào mừng bạn đến với HUITKIT – Giải pháp tiêm chủng an toàn và nhanh chóng.</h2>
          <p className="text-lg md:text-xl text-gray-200">
            Đội ngũ bác sĩ và chuyên gia y tế tận tâm, mang đến dịch vụ tiêm chủng an toàn – hiệu quả – đáng tin cậy.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-12 w-full max-w-6xl">
          {/* Why Choose Us Box */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow-lg p-6" data-aos="zoom-out" data-aos-delay="200">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Tại sao nên chọn HUITKIT?</h3>
            <p className="text-gray-600 mb-6">
              Chúng tôi cung cấp dịch vụ tiêm chủng hiện đại, an toàn, được kiểm định chặt chẽ và tuân thủ các tiêu chuẩn y tế quốc gia.
            </p>
            <div className="text-center">
              <Link to="#about" className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800 transition">
                <span>Learn More</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Feature Boxes */}
          <div className="lg:col-span-3 flex flex-col justify-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <div className="bg-white/90 backdrop-blur rounded-lg shadow-lg p-6" data-aos="zoom-out" data-aos-delay="300">
                <div className="text-blue-600 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Đặt lịch tiêm dễ dàng</h4>
                <p className="text-gray-600">
                  Đặt lịch trực tuyến nhanh chóng, nhận thông báo tự động và theo dõi hồ sơ tiêm chủng của bạn chỉ trong vài bước.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white/90 backdrop-blur rounded-lg shadow-lg p-6" data-aos="zoom-out" data-aos-delay="400">
                <div className="text-blue-600 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Kho vaccine đa dạng</h4>
                <p className="text-gray-600">
                  Chúng tôi cung cấp nhiều loại vaccine từ các cơ sở y tế uy tín, phù hợp cho mọi lứa tuổi.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white/90 backdrop-blur rounded-lg shadow-lg p-6" data-aos="zoom-out" data-aos-delay="500">
                <div className="text-blue-600 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Chăm sóc khách hàng tận tâm</h4>
                <p className="text-gray-600">
                  Đội ngũ bác sĩ giàu kinh nghiệm, hỗ trợ bạn trước, trong và sau tiêm, đảm bảo an toàn tuyệt đối.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;