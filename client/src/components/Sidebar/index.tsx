import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import SidebarLinkGroup from './SidebarLinkGroup';
import Logo from '../../images/icon/logo.png';
import { usePermissions } from '../../hooks/usePermissions';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

// Menu configuration with permissions
const menuItems = [
  {
    id: 'staff',
    title: 'Nhân viên',
    path: '/dashboard/staff',
    icon: 'ri-user-line',
    permissions: ['NguoiDung'],
  },
  {
    id: 'doctors',
    title: 'Bác sĩ',
    path: '/dashboard/doctors',
    icon: 'ri-user-star-line',
    permissions: ['BacSi'],
    subItems: [
      {
        title: 'Quản lý bác sĩ',
        path: '/dashboard/doctors',
      },
      {
        title: 'Lịch làm việc của bác sĩ',
        path: '/dashboard/doctor-schedule',
        permissions: ['LichLamViec'],
      },
    ],
  },
  {
    id: 'vaccination',
    title: 'Tiêm chủng',
    path: '/dashboard/vaccination',
    icon: 'ri-syringe-line',
    permissions: ['PhieuDangKyLichTiem'],
    subItems: [
      {
        title: 'Phiếu đăng ký tiêm chủng',
        path: '/dashboard/vaccination/registration',
        permissions: ['PhieuDangKyLichTiem'],
      },
      {
        title: 'Lịch sử tiêm',
        path: '/dashboard/vaccination/history',
        permissions: [],
      },
    ],
  },
  {
    id: 'services',
    title: 'Dịch vụ',
    path: '/dashboard/services',
    icon: 'ri-service-line',
    permissions: ['DichVu'],
    subItems: [
      {
        title: 'Danh sách dịch vụ',
        path: '/dashboard/services',
      },
      {
        title: 'Loại dịch vụ',
        path: '/dashboard/services/types',
        permissions: ['LoaiDichVu'],
      },
    ],
  },
  {
    id: 'locations',
    title: 'Địa điểm',
    path: '/dashboard/locations',
    icon: 'ri-map-pin-line',
    permissions: ['DiaDiem'],
  },
  {
    id: 'vaccine',
    title: 'Quản lý Vaccine',
    path: '/dashboard/vaccine-manage',
    icon: 'ri-medicine-bottle-line',
    permissions: ['Vaccine'],
  },
  {
    id: 'invoices',
    title: 'Hóa đơn',
    path: '/dashboard/invoices',
    icon: 'ri-file-list-3-line',
    permissions: ['DonHang'],
  },
  {
    id: 'appointments',
    title: 'Quản lý Lịch hẹn',
    path: '/dashboard/appointments',
    icon: 'ri-calendar-check-line',
    permissions: ['LichHen'],
  },
  {
    id: 'images',
    title: 'Quản lý Ảnh',
    path: '/dashboard/image-management',
    icon: 'ri-image-line',
    permissions: ['NhanAnh'],
  },
  {
    id: 'doctor-schedule',
    title: 'Lịch Bác Sĩ',
    path: '/dashboard/doctor-schedule',
    icon: 'ri-time-line',
    permissions: ['LichLamViec'],
  },
  {
    id: 'promotions',
    title: 'Khuyến mãi',
    path: '/dashboard/khuyen-mai',
    icon: 'ri-percent-line',
    permissions: ['KhuyenMai'],
    subItems: [
      {
        title: 'Danh sách khuyến mãi',
        path: '/dashboard/khuyen-mai',
      },
      {
        title: 'Loại khuyến mãi',
        path: '/dashboard/khuyen-mai/loai',
        permissions: ['LoaiKhuyenMai'],
      },
    ],
  },
];

const personalMenuItems = [
  {
    id: 'home',
    title: 'Về Trang chủ',
    path: '/',
    icon: 'ri-home-line',
    permissions: [],
  },
  {
    id: 'profile',
    title: 'Profile',
    path: '/dashboard/profile',
    icon: 'ri-user-settings-line',
    permissions: [],
  },
  {
    id: 'permissions',
    title: 'Quản lý phân quyền',
    path: '/dashboard/quyen',
    icon: 'ri-shield-user-line',
    permissions: ['VaiTroQuyen'],
    subItems: [
      {
        title: 'Phân quyền vai trò',
        path: '/dashboard/quyen',
      },
      {
        title: 'Phân quyền người dùng',
        path: '/dashboard/quyen/nguoi-dung',
        permissions: ['NguoiDungQuyen'],
      },
    ],
  },
];

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const location = useLocation();
  const { pathname } = location;
  const { hasAnyPermission, isLoading } = usePermissions();

  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);

  // Helper function to check if menu item should be visible
  const isMenuItemVisible = (item: any) => {
    if (item.permissions.length === 0) return true;
    return hasAnyPermission(item.permissions);
  };

  // Helper function to check if sub item should be visible
  const isSubItemVisible = (subItem: any) => {
    if (!subItem.permissions || subItem.permissions.length === 0) return true;
    return hasAnyPermission(subItem.permissions);
  };

  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true',
  );

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector('body')?.classList.add('sidebar-expanded');
    } else {
      document.querySelector('body')?.classList.remove('sidebar-expanded');
    }
  }, [sidebarExpanded]);

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
        <NavLink to="/">
          <img src={Logo} alt="Logo" className="bg-white rounded-md" />
        </NavLink>
        {/* Mobile Menu Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-gray-700 hover:bg-gray-600 text-white transition-colors duration-200 flex-none lg:hidden"
          aria-label="Toggle Sidebar"
        >
          <i className="ri-menu-line"></i>
        </button>
      </div>

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        {/* <!-- Sidebar Menu --> */}
        <nav className="mt-3 py-4 px-4 lg:mt-5 lg:px-6">
          {/* <!-- Menu Group --> */}
          <div>
            <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
              THÔNG TIN QUẢN LÝ
            </h3>

            <ul className="mb-6 flex flex-col gap-1.5">
              {/* Show loading spinner while checking permissions */}
              {isLoading ? (
                <li className="flex items-center justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                </li>
              ) : (
                // Render menu items based on permissions
                menuItems.map((item) => {
                  // Skip if user doesn't have permission
                  if (!isMenuItemVisible(item)) return null;

                  // If item has sub-items, render as dropdown
                  if (item.subItems) {
                    return (
                      <SidebarLinkGroup
                        key={item.id}
                        activeCondition={
                          pathname === item.path || pathname.includes(item.id)
                        }
                      >
                        {(handleClick, open) => {
                          return (
                            <React.Fragment>
                              <NavLink
                                to="#"
                                className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                                  (pathname === item.path ||
                                    pathname.includes(item.id)) &&
                                  'bg-graydark dark:bg-meta-4'
                                }`}
                                onClick={(e) => {
                                  e.preventDefault();
                                  sidebarExpanded
                                    ? handleClick()
                                    : setSidebarExpanded(true);
                                }}
                              >
                                <i className={item.icon}></i>
                                {item.title}
                                <i
                                  className={`ri-arrow-right-s-line absolute right-4 top-1/2 -translate-y-1/2 ${
                                    open && 'rotate-180'
                                  }`}
                                ></i>
                              </NavLink>
                              {/* <!-- Dropdown Menu Start --> */}
                              <div
                                className={`translate transform overflow-hidden ${
                                  !open && 'hidden'
                                }`}
                              >
                                <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                                  {item.subItems.map((subItem, index) => {
                                    // Skip if user doesn't have permission for sub-item
                                    if (!isSubItemVisible(subItem)) return null;

                                    return (
                                      <li key={index}>
                                        <NavLink
                                          to={subItem.path}
                                          className={({ isActive }) =>
                                            'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                            (isActive && '!text-white')
                                          }
                                        >
                                          {subItem.title}
                                        </NavLink>
                                      </li>
                                    );
                                  })}
                                </ul>
                              </div>
                              {/* <!-- Dropdown Menu End --> */}
                            </React.Fragment>
                          );
                        }}
                      </SidebarLinkGroup>
                    );
                  }

                  // Render as simple menu item
                  return (
                    <li key={item.id}>
                      <NavLink
                        to={item.path}
                        className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                          pathname.includes(item.id) &&
                          'bg-graydark dark:bg-meta-4'
                        }`}
                      >
                        <i className={item.icon}></i>
                        {item.title}
                      </NavLink>
                    </li>
                  );
                })
              )}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
              CÁ NHÂN
            </h3>
            <ul className="mb-6 flex flex-col gap-1.5">
              {/* Render personal menu items based on permissions */}
              {personalMenuItems.map((item) => {
                // Skip if user doesn't have permission
                if (!isMenuItemVisible(item)) return null;

                // If item has sub-items, render as dropdown
                if (item.subItems) {
                  return (
                    <SidebarLinkGroup
                      key={item.id}
                      activeCondition={
                        pathname === item.path || pathname.includes(item.id)
                      }
                    >
                      {(handleClick, open) => {
                        return (
                          <React.Fragment>
                            <NavLink
                              to="#"
                              className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                                (pathname === item.path ||
                                  pathname.includes(item.id)) &&
                                'bg-graydark dark:bg-meta-4'
                              }`}
                              onClick={(e) => {
                                e.preventDefault();
                                handleClick();
                              }}
                            >
                              <i className={item.icon}></i>
                              {item.title}
                              <i className={`ri-arrow-right-s-line absolute right-4 top-1/2 -translate-y-1/2 ${
                                    open && 'rotate-180'
                                  }`}
                                ></i>
                            </NavLink>
                            <div
                              className={`translate transform overflow-hidden ${
                                !open && 'hidden'
                              }`}
                            >
                              <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                                {item.subItems.map((subItem, index) => {
                                  if (!isSubItemVisible(subItem)) return null;

                                  return (
                                    <li key={index}>
                                      <NavLink
                                        to={subItem.path}
                                        className={({ isActive }) =>
                                          'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                          (isActive && '!text-white')
                                        }
                                      >
                                        {subItem.title}
                                      </NavLink>
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                          </React.Fragment>
                        );
                      }}
                    </SidebarLinkGroup>
                  );
                }
                return (
                  <li key={item.id}>
                    <NavLink
                      to={item.path}
                      className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                        pathname.includes(item.id) &&
                        'bg-graydark dark:bg-meta-4'
                      }`}
                    >
                      <i className={item.icon}></i>
                      {item.title}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
