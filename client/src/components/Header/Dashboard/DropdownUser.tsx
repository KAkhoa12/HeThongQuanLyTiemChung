import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ClickOutside from '../../ClickOutside';
import UserOne from '../../../images/user/user-01.png';
import { useAuthStore } from '../../../store/useAuthStore';
import { useToast } from '../../../hooks/useToast';

const DropdownUser = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();
  const { showSuccess, showError } = useToast();

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      
      await logout();
      
      showSuccess('Thành công', 'Đăng xuất thành công!');
      navigate('/auth/signin');
    } catch (error) {
      console.error('Logout error:', error);
      showError('Lỗi', 'Đã xảy ra lỗi khi đăng xuất');
      
      // Even if logout fails, redirect to login
      navigate('/auth/signin');
    } finally {
      setIsLoggingOut(false);
      setDropdownOpen(false);
    }
  };

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      <Link
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-4"
        to="#"
      >
        <span className="hidden text-right lg:block">
          <span className="block text-sm font-medium text-black dark:text-white">
            {user?.ten || 'User'}
          </span>
          <span className="block text-xs">{user?.vaiTro || 'User'}</span>
        </span>

        <span className="h-12 w-12 rounded-full">
          <img src={UserOne} alt="User" />
        </span>

        <i className="ri-arrow-down-s-line"></i>
      </Link>

      {dropdownOpen && (
        <div
          className={`absolute right-0 mt-4 flex w-62.5 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark`}
        >
          <ul className="flex flex-col gap-5 border-b border-stroke px-6 py-7.5 dark:border-strokedark">
            <li>
              <Link
                to="/profile"
                className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
              >
                <i className="ri-user-line"></i>
                My Profile
              </Link>
            </li>
            <li>
              <Link
                to="#"
                className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
              >
                <i className="ri-article-line"></i>
                My Contacts
              </Link>
            </li>
            <li>
              <Link
                to="/settings"
                className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
              >
                <i className="ri-settings-line"></i>
                Account Settings
              </Link>
            </li>
          </ul>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center gap-3.5 px-6 py-4 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i className="ri-logout-box-line"></i>

            {isLoggingOut ? 'Đang đăng xuất...' : 'Log Out'}
          </button>
        </div>
      )}
    </ClickOutside>
  );
};

export default DropdownUser;
