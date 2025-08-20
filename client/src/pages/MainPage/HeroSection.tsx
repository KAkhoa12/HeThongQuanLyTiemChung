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
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Chào mừng tới tiêm chủng HUITKIT</h2>
          <p className="text-lg md:text-xl text-gray-200">
            Chúng tôi là một nhóm bác sĩ có tài năng cung cấp dịch vụ y tế tốt nhất
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-12 w-full max-w-6xl">
          {/* Why Choose Us Box */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow-lg p-6" data-aos="zoom-out" data-aos-delay="200">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Why Choose Medilab?</h3>
            <p className="text-gray-600 mb-6">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
              do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              Duis aute irure dolor in reprehenderit Asperiores dolores sed
              et. Tenetur quia eos.
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
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Corporis voluptates officia</h4>
                <p className="text-gray-600">
                  Consequuntur sunt aut quasi enim aliquam quae harum
                  pariatur laboris nisi ut aliquip
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white/90 backdrop-blur rounded-lg shadow-lg p-6" data-aos="zoom-out" data-aos-delay="400">
                <div className="text-blue-600 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Ullamco laboris ladore pan</h4>
                <p className="text-gray-600">
                  Excepteur sint occaecat cupidatat non proident, sunt in
                  culpa qui officia deserunt
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white/90 backdrop-blur rounded-lg shadow-lg p-6" data-aos="zoom-out" data-aos-delay="500">
                <div className="text-blue-600 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Labore consequatur incidid</h4>
                <p className="text-gray-600">
                  Aut suscipit aut cum nemo deleniti aut omnis. Doloribus
                  ut maiores omnis facere
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