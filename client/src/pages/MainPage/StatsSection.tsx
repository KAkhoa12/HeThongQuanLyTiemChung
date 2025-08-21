import React from 'react';

const StatsSection = () => {
  return (
    <section id="stats" className="py-16 bg-gray-100">
      <div className="container mx-auto px-4" data-aos="fade-up" data-aos-delay="100">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Doctors Stat */}
          <div className="flex flex-col items-center">
            <div className="text-blue-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="text-center">
              <span className="text-4xl font-bold text-gray-800 block mb-1" data-count="85">85</span>
              <p className="text-lg text-gray-600">Bác sĩ chuyên nghiệp</p>
            </div>
          </div>

          {/* Departments Stat */}
          <div className="flex flex-col items-center">
            <div className="text-blue-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div className="text-center">
              <span className="text-4xl font-bold text-gray-800 block mb-1" data-count="18">18</span>
              <p className="text-lg text-gray-600">Cơ sở y tế tốt nhất</p>
            </div>
          </div>

          {/* Research Labs Stat */}
          <div className="flex flex-col items-center">
            <div className="text-blue-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <div className="text-center">
              <span className="text-4xl font-bold text-gray-800 block mb-1" data-count="12">12</span>
              <p className="text-lg text-gray-600">Phòng thí nghiệm tạo vaccine đạt chuẩn y học</p>
            </div>
          </div>

          {/* Awards Stat */}
          <div className="flex flex-col items-center">
            <div className="text-blue-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <div className="text-center">
              <span className="text-4xl font-bold text-gray-800 block mb-1" data-count="150">150</span>
              <p className="text-lg text-gray-600">Thành tựu y học</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;