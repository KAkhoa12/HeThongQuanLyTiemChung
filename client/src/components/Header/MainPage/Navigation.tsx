import { Link } from 'react-router-dom';
import { useState } from 'react';
import logo from '../../../images/logo/logo-icon.svg';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNestedDropdownOpen, setIsNestedDropdownOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleNestedDropdown = () => {
    setIsNestedDropdownOpen(!isNestedDropdownOpen);
  };

  return (
    <div className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <img src={logo} alt="Medilab Logo" className="h-10 w-auto" />
          <span className="text-2xl font-bold text-blue-600">HuitKIT</span>
        </Link>

        {/* Mobile menu button */}
        <button 
          className="md:hidden text-gray-500 hover:text-gray-700 focus:outline-none"
          onClick={toggleMenu}
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-blue-600 font-medium hover:text-blue-800">Trang chủ</Link>
          <a href="#about" className="text-gray-700 font-medium hover:text-blue-600">về chúng tôi</a>
          <a href="#services" className="text-gray-700 font-medium hover:text-blue-600">Các dịch vụ</a>
          <a href="#departments" className="text-gray-700 font-medium hover:text-blue-600">Địa điểm </a>
          <a href="#doctors" className="text-gray-700 font-medium hover:text-blue-600">Bác sĩ</a>
          
          {/* Dropdown */}
          <div className="relative">
            <button 
              className="text-gray-700 font-medium hover:text-blue-600 flex items-center"
              onClick={toggleDropdown}
            >
              Dropdown
              <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {isDropdownOpen && (
              <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                <div className="py-1">
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Dropdown 1</a>
                  
                  {/* Nested Dropdown */}
                  <div className="relative">
                    <button 
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-between"
                      onClick={toggleNestedDropdown}
                    >
                      Deep Dropdown
                      <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                    
                    {isNestedDropdownOpen && (
                      <div className="absolute left-full top-0 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                        <div className="py-1">
                          <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Deep Dropdown 1</a>
                          <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Deep Dropdown 2</a>
                          <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Deep Dropdown 3</a>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Dropdown 2</a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Dropdown 3</a>
                </div>
              </div>
            )}
          </div>
          
          <a href="#contact" className="text-gray-700 font-medium hover:text-blue-600">Contact</a>
        </nav>

        <a href="#appointment" className="hidden md:block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-medium transition duration-300">
          Make an Appointment
        </a>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 py-2">
          <div className="container mx-auto px-4 space-y-2">
            <Link to="/" className="block py-2 text-blue-600 font-medium">Home</Link>
            <a href="#about" className="block py-2 text-gray-700 font-medium">About</a>
            <a href="#services" className="block py-2 text-gray-700 font-medium">Services</a>
            <a href="#departments" className="block py-2 text-gray-700 font-medium">Departments</a>
            <a href="#doctors" className="block py-2 text-gray-700 font-medium">Doctors</a>
            <a href="#" className="block py-2 text-gray-700 font-medium">Dropdown</a>
            <a href="#contact" className="block py-2 text-gray-700 font-medium">Contact</a>
            <a href="#appointment" className="block py-2 text-blue-600 font-medium">Make an Appointment</a>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navigation;