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
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Departments</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Necessitatibus eius consequatur ex aliquid fuga eum quidem sint
            consectetur velit
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
                  Cardiology
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
                  Neurology
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
                  Hepatology
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
                  Pediatrics
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
                  Eye Care
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
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4">Cardiology</h3>
                  <p className="text-gray-600 italic mb-4">
                    Qui laudantium consequatur laborum sit qui ad sapiente
                    dila parde sonata raqer a videna mareta paulona marka
                  </p>
                  <p className="text-gray-600">
                    Et nobis maiores eius. Voluptatibus ut enim blanditiis
                    atque harum sint. Laborum eos ipsum ipsa odit magni.
                    Incidunt hic ut molestiae aut qui. Est repellat minima
                    eveniet eius et quis magni nihil. Consequatur dolorem
                    quaerat quos qui similique accusamus nostrum rem vero
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
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4">Neurology</h3>
                  <p className="text-gray-600 italic mb-4">
                    Qui laudantium consequatur laborum sit qui ad sapiente
                    dila parde sonata raqer a videna mareta paulona marka
                  </p>
                  <p className="text-gray-600">
                    Ea ipsum voluptatem consequatur quis est. Illum error
                    ullam omnis quia et reiciendis sunt sunt est. Non
                    aliquid repellendus itaque accusamus eius et velit ipsa
                    voluptates. Optio nesciunt eaque beatae accusamus lerode
                    pakto madirna desera vafle de nideran pal
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
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4">Hepatology</h3>
                  <p className="text-gray-600 italic mb-4">
                    Eos voluptatibus quo. Odio similique illum id quidem non
                    enim fuga. Qui natus non sunt dicta dolor et. In
                    asperiores velit quaerat perferendis aut
                  </p>
                  <p className="text-gray-600">
                    Iure officiis odit rerum. Harum sequi eum illum corrupti
                    culpa veritatis quisquam. Neque necessitatibus illo
                    rerum eum ut. Commodi ipsam minima molestiae sed
                    laboriosam a iste odio. Earum odit nesciunt fugiat sit
                    ullam. Soluta et harum voluptatem optio quae
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
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4">Pediatrics</h3>
                  <p className="text-gray-600 italic mb-4">
                    Totam aperiam accusamus. Repellat consequuntur iure
                    voluptas iure porro quis delectus
                  </p>
                  <p className="text-gray-600">
                    Eaque consequuntur consequuntur libero expedita in
                    voluptas. Nostrum ipsam necessitatibus aliquam fugiat
                    debitis quis velit. Eum ex maxime error in consequatur
                    corporis atque. Eligendi asperiores sed qui veritatis
                    aperiam quia a laborum inventore
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
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4">Eye Care</h3>
                  <p className="text-gray-600 italic mb-4">
                    Omnis blanditiis saepe eos autem qui sunt debitis porro
                    quia.
                  </p>
                  <p className="text-gray-600">
                    Exercitationem nostrum omnis. Ut reiciendis repudiandae
                    minus. Omnis recusandae ut non quam ut quod eius qui.
                    Ipsum quia odit vero atque qui quibusdam amet. Occaecati
                    sed est sint aut vitae molestiae voluptate vel
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