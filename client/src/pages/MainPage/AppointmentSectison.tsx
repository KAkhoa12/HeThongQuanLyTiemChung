import React from 'react';

const AppointmentSectison = () => {
  return (
    <section id="appointment" className="py-20 bg-blue-50">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <div className="text-center mb-12" data-aos="fade-up">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Appointment</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Necessitatibus eius consequatur ex aliquid fuga eum quidem sint
            consectetur velit
          </p>
        </div>

        <div className="max-w-5xl mx-auto" data-aos="fade-up" data-aos-delay="100">
          <form
            action="forms/appointment.php"
            method="post"
            className="bg-white rounded-lg shadow-lg p-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="col-span-1">
                <input
                  type="text"
                  name="name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  id="name"
                  placeholder="Your Name"
                  required
                />
              </div>
              <div className="col-span-1">
                <input
                  type="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  name="email"
                  id="email"
                  placeholder="Your Email"
                  required
                />
              </div>
              <div className="col-span-1">
                <input
                  type="tel"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  name="phone"
                  id="phone"
                  placeholder="Your Phone"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="col-span-1">
                <input
                  type="datetime-local"
                  name="date"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  id="date"
                  placeholder="Appointment Date"
                  required
                />
              </div>
              <div className="col-span-1">
                <select
                  name="department"
                  id="department"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  required
                >
                  <option value="">Select Department</option>
                  <option value="Department 1">Department 1</option>
                  <option value="Department 2">Department 2</option>
                  <option value="Department 3">Department 3</option>
                </select>
              </div>
              <div className="col-span-1">
                <select
                  name="doctor"
                  id="doctor"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  required
                >
                  <option value="">Select Doctor</option>
                  <option value="Doctor 1">Doctor 1</option>
                  <option value="Doctor 2">Doctor 2</option>
                  <option value="Doctor 3">Doctor 3</option>
                </select>
              </div>
            </div>

            <div className="mt-6">
              <textarea
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                name="message"
                rows={5}
                placeholder="Message (Optional)"
              />
            </div>

            <div className="mt-6 relative">
              {/* Loading state */}
              <div className="hidden loading text-center py-2 text-gray-600">
                <svg className="animate-spin h-5 w-5 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading
              </div>
              
              {/* Error message */}
              <div className="hidden error-message text-center py-2 text-red-600"></div>
              
              {/* Success message */}
              <div className="hidden sent-message text-center py-2 text-green-600">
                Your appointment request has been sent successfully. Thank you!
              </div>
              
              <div className="text-center">
                <button 
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Make an Appointment
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default AppointmentSectison;