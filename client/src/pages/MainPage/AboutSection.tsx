import React from 'react';
// import aboutImage from '../../images/about.jpg';

const AboutSection = () => {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image Column */}
          <div className="relative" data-aos="fade-up" data-aos-delay="200">
            <img 
              // src={aboutImage} 
              alt="About Medilab" 
              className="rounded-lg shadow-lg w-full h-auto"
            />
            <a 
              href="https://www.youtube.com/watch?v=Y7f98aduVJ8" 
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white rounded-full p-4 hover:bg-blue-700 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="sr-only">Play Video</span>
            </a>
          </div>

          {/* Content Column */}
          <div className="content" data-aos="fade-up" data-aos-delay="100">
            <h3 className="text-3xl font-bold text-gray-800 mb-6">About Us</h3>
            <p className="text-gray-600 mb-8">
              Dolor iure expedita id fuga asperiores qui sunt consequatur
              minima. Quidem voluptas deleniti. Sit quia molestiae quia quas
              qui magnam itaque veritatis dolores. Corrupti totam ut eius
              incidunt reiciendis veritatis asperiores placeat.
            </p>

            <ul className="space-y-8">
              {/* Feature 1 */}
              <li className="flex">
                <div className="mr-4 text-blue-600 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h5 className="text-xl font-semibold text-gray-800 mb-2">Ullamco laboris nisi ut aliquip consequat</h5>
                  <p className="text-gray-600">
                    Magni facilis facilis repellendus cum excepturi quaerat
                    praesentium libre trade
                  </p>
                </div>
              </li>

              {/* Feature 2 */}
              <li className="flex">
                <div className="mr-4 text-blue-600 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <div>
                  <h5 className="text-xl font-semibold text-gray-800 mb-2">Magnam soluta odio exercitationem reprehenderi</h5>
                  <p className="text-gray-600">
                    Quo totam dolorum at pariatur aut distinctio dolorum
                    laudantium illo direna pasata redi
                  </p>
                </div>
              </li>

              {/* Feature 3 */}
              <li className="flex">
                <div className="mr-4 text-blue-600 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <div>
                  <h5 className="text-xl font-semibold text-gray-800 mb-2">Voluptatem et qui exercitationem</h5>
                  <p className="text-gray-600">
                    Et velit et eos maiores est tempora et quos dolorem autem
                    tempora incidunt maxime veniam
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;