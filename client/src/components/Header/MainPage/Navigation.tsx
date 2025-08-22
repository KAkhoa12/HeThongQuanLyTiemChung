import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import logo from '../../../images/logo/logo-icon.svg';
import { useAuthStore } from '../../../store/useAuthStore';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNestedDropdownOpen, setIsNestedDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  // Use actual auth store instead of mock data
  const { user, isAuthenticated, logout, fetchCurrentUser, isLoading } = useAuthStore();

  // Debug authentication state
  useEffect(() => {
    console.log('Navigation - Auth State:', { isAuthenticated, user, isLoading });
  }, [isAuthenticated, user, isLoading]);

  // Check authentication status on mount
  useEffect(() => {
    console.log('Navigation - Fetching current user...');
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleNestedDropdown = () => {
    setIsNestedDropdownOpen(!isNestedDropdownOpen);
  };

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  const handleLogout = async () => {
    await logout();
    setIsUserDropdownOpen(false);
  };

  // Get user avatar - fallback to default if no avatar
  const getUserAvatar = () => {
    // You can replace this with actual user avatar from your user data
    return 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face';
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <img src={logo} alt="Medilab Logo" className="h-10 w-auto" />
            <span className="text-2xl font-bold text-blue-600">HuitKIT</span>
          </Link>
          <div className="animate-pulse bg-gray-200 h-10 w-24 rounded"></div>
        </div>
      </div>
    );
  }

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

        {/* User Profile / Login Button */}
        {isAuthenticated && user ? (
          <div className="hidden md:block relative">
            <button
              onClick={toggleUserDropdown}
              className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <img
                src={getUserAvatar()}
                alt={user.ten}
                className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 hover:border-blue-500 transition-colors"
              />
              <span className="font-medium">{user.ten}</span>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {isUserDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                <div className="py-1">
                  <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-100">
                    <div className="font-medium">{user.ten}</div>
                    <div className="text-xs">{user.email}</div>
                  </div>
                  <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Hồ sơ cá nhân
                  </Link>
                  <Link to="/appointments" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Lịch hẹn của tôi
                  </Link>
                  <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Cài đặt
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Đăng xuất
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link 
            to="/auth/signin" 
            className="hidden md:block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-medium transition duration-300"
          >
            Đăng nhập
          </Link>
        )}
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
            
            {/* Mobile User Profile / Login */}
            {isAuthenticated && user ? (
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="flex items-center space-x-3 py-2">
                  <img
                    src={getUserAvatar()}
                    alt={user.ten}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="text-sm font-medium text-gray-700">{user.ten}</span>
                </div>
                <Link to="/profile" className="block py-2 text-sm text-gray-600">Hồ sơ cá nhân</Link>
                <Link to="/appointments" className="block py-2 text-sm text-gray-600">Lịch hẹn của tôi</Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left py-2 text-sm text-red-600"
                >
                  Đăng xuất
                </button>
              </div>
            ) : (
              <Link to="/auth/signin" className="block py-2 text-blue-600 font-medium">Đăng nhập</Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navigation;