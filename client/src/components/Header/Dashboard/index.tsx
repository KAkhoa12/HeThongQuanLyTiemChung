import { Link } from 'react-router-dom';
import DropdownUser from './DropdownUser';
import LogoIcon from '../../../images/icon/logo.png';
import DarkModeSwitcher from './DarkModeSwitcher';

const Header = (props: {
  sidebarOpen: string | boolean | undefined;
  setSidebarOpen: (arg0: boolean) => void;
}) => {
  return (
    <header className="sticky top-0 z-999 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
      <div className="flex flex-grow items-center justify-between px-4 py-4 shadow-2 md:px-6 2xl:px-11">
        <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => props.setSidebarOpen(!props.sidebarOpen)}
            className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-gray-700 hover:bg-gray-600 text-white transition-colors duration-200"
            aria-label="Toggle Sidebar"
          >
            <i className="ri-menu-line"></i>
          </button>
        </div>

        <div className="hidden sm:block">
          
        </div>

        <div className="flex items-center gap-3 2xsm:gap-7">
          <ul className="flex items-center gap-2 2xsm:gap-4">
            <DarkModeSwitcher />
          </ul>
          <DropdownUser />
        </div>
      </div>
    </header>
  );
};

export default Header;
