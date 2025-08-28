import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import SidebarLinkGroup from './SidebarLinkGroup';
import Logo from '../../images/icon/logo.png';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}
const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);

  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true'
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
      {/* <!-- SIDEBAR HEADER --> */}
      <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
        <NavLink to="/">
          <img src={Logo} alt="Logo" className='bg-white rounded-md' />
        </NavLink>
      </div>
      {/* <!-- SIDEBAR HEADER --> */}

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        {/* <!-- Sidebar Menu --> */}
        <nav className="mt-3 py-4 px-4 lg:mt-5 lg:px-6">
          {/* <!-- Menu Group --> */}
          <div>
            <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
              THÔNG TIN QUẢN LÝ
            </h3>

            <ul className="mb-6 flex flex-col gap-1.5">
            <li>
                <NavLink
                  to="/"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes('profile') && 'bg-graydark dark:bg-meta-4'
                  }`}
                >
                  <i className="ri-layout-grid-line"></i>
                  Trang chủ
                </NavLink>
              </li>


              {/* <!-- Menu Item Profile --> */}
              <li>
                <NavLink
                  to="/dashboard/profile"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes('profile') && 'bg-graydark dark:bg-meta-4'
                  }`}
                >
                  <svg
                    className="fill-current"
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9.0002 7.79065C11.0814 7.79065 12.7689 6.1594 12.7689 4.1344C12.7689 2.1094 11.0814 0.478149 9.0002 0.478149C6.91895 0.478149 5.23145 2.1094 5.23145 4.1344C5.23145 6.1594 6.91895 7.79065 9.0002 7.79065ZM9.0002 1.7719C10.3783 1.7719 11.5033 2.84065 11.5033 4.16252C11.5033 5.4844 10.3783 6.55315 9.0002 6.55315C7.62207 6.55315 6.49707 5.4844 6.49707 4.16252C6.49707 2.84065 7.62207 1.7719 9.0002 1.7719Z"
                      fill=""
                    />
                    <path
                      d="M10.8283 9.05627H7.17207C4.16269 9.05627 1.71582 11.5313 1.71582 14.5406V16.875C1.71582 17.2125 1.99707 17.5219 2.3627 17.5219C2.72832 17.5219 3.00957 17.2407 3.00957 16.875V14.5406C3.00957 12.2344 4.89394 10.3219 7.22832 10.3219H10.8564C13.1627 10.3219 15.0752 12.2063 15.0752 14.5406V16.875C15.0752 17.2125 15.3564 17.5219 15.7221 17.5219C16.0877 17.5219 16.3689 17.2407 16.3689 16.875V14.5406C16.2846 11.5313 13.8377 9.05627 10.8283 9.05627Z"
                      fill=""
                    />
                  </svg>
                  Profile
                </NavLink>
              </li>
              {/* <!-- Menu Item Profile --> */}

              {/* <!-- Menu Item Staff Management --> */}
              <li>
                <NavLink
                  to="/dashboard/staff"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes('staff') && 'bg-graydark dark:bg-meta-4'
                  }`}
                >
                  <svg
                    className="fill-current"
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9.0002 7.79065C11.0814 7.79065 12.7689 6.1594 12.7689 4.1344C12.7689 2.1094 11.0814 0.478149 9.0002 0.478149C6.91895 0.478149 5.23145 2.1094 5.23145 4.1344C5.23145 6.1594 6.91895 7.79065 9.0002 7.79065ZM9.0002 1.7719C10.3783 1.7719 11.5033 2.84065 11.5033 4.16252C11.5033 5.4844 10.3783 6.55315 9.0002 6.55315C7.62207 6.55315 6.49707 5.4844 6.49707 4.16252C6.49707 2.84065 7.62207 1.7719 9.0002 1.7719Z"
                      fill=""
                    />
                    <path
                      d="M10.8283 9.05627H7.17207C4.16269 9.05627 1.71582 11.5313 1.71582 14.5406V16.875C1.71582 17.2125 1.99707 17.5219 2.3627 17.5219C2.72832 17.5219 3.00957 17.2407 3.00957 16.875V14.5406C3.00957 12.2344 4.89394 10.3219 7.22832 10.3219H10.8564C13.1627 10.3219 15.0752 12.2063 15.0752 14.5406V16.875C15.0752 17.2125 15.3564 17.5219 15.7221 17.5219C16.0877 17.5219 16.3689 17.2407 16.3689 16.875V14.5406C16.2846 11.5313 13.8377 9.05627 10.8283 9.05627Z"
                      fill=""
                    />
                  </svg>
                  Nhân viên
                </NavLink>
              </li>
              {/* <!-- Menu Item Staff Management --> */}
              
              {/* <!-- Menu Item Doctor Management --> */}
              <li>
                <NavLink
                  to="/dashboard/doctors"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes('doctors') && 'bg-graydark dark:bg-meta-4'
                  }`}
                >
                  <svg
                    className="fill-current"
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9.0002 7.79065C11.0814 7.79065 12.7689 6.1594 12.7689 4.1344C12.7689 2.1094 11.0814 0.478149 9.0002 0.478149C6.91895 0.478149 5.23145 2.1094 5.23145 4.1344C5.23145 6.1594 6.91895 7.79065 9.0002 7.79065ZM9.0002 1.7719C10.3783 1.7719 11.5033 2.84065 11.5033 4.16252C11.5033 5.4844 10.3783 6.55315 9.0002 6.55315C7.62207 6.55315 6.49707 5.4844 6.49707 4.16252C6.49707 2.84065 7.62207 1.7719 9.0002 1.7719Z"
                      fill=""
                    />
                    <path
                      d="M10.8283 9.05627H7.17207C4.16269 9.05627 1.71582 11.5313 1.71582 14.5406V16.875C1.71582 17.2125 1.99707 17.5219 2.3627 17.5219C2.72832 17.5219 3.00957 17.2407 3.00957 16.875V14.5406C3.00957 12.2344 4.89394 10.3219 7.22832 10.3219H10.8564C13.1627 10.3219 15.0752 12.2063 15.0752 14.5406V16.875C15.0752 17.2125 15.3564 17.5219 15.7221 17.5219C16.0877 17.5219 16.3689 17.2407 16.3689 16.875V14.5406C16.2846 11.5313 13.8377 9.05627 10.8283 9.05627Z"
                      fill=""
                    />
                  </svg>
                  Bác sĩ
                </NavLink>
              </li>
              {/* <!-- Menu Item Doctor Management --> */}
              
              {/* <!-- Menu Item Services Management --> */}
              <SidebarLinkGroup
                activeCondition={
                  pathname === '/dashboard/services' || pathname.includes('services')
                }
              >
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <NavLink
                        to="#"
                        className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                          (pathname === '/dashboard/services' ||
                            pathname.includes('services')) &&
                          'bg-graydark dark:bg-meta-4'
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          sidebarExpanded
                            ? handleClick()
                            : setSidebarExpanded(true);
                        }}
                      >
                        <svg
                          className="fill-current"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M6.10322 0.956299H2.53135C1.5751 0.956299 0.787598 1.7438 0.787598 2.70005V6.27192C0.787598 7.22817 1.5751 8.01567 2.53135 8.01567H6.10322C7.05947 8.01567 7.84697 7.22817 7.84697 6.27192V2.72817C7.8751 1.7438 7.0876 0.956299 6.10322 0.956299ZM6.60947 6.30005C6.60947 6.5813 6.38447 6.8063 6.10322 6.8063H2.53135C2.2501 6.8063 2.0251 6.5813 2.0251 6.30005V2.72817C2.0251 2.44692 2.2501 2.22192 2.53135 2.22192H6.10322C6.38447 2.22192 6.60947 2.44692 6.60947 2.72817V6.30005Z"
                            fill=""
                          />
                          <path
                            d="M15.4689 0.956299H11.8971C10.9408 0.956299 10.1533 1.7438 10.1533 2.70005V6.27192C10.1533 7.22817 10.9408 8.01567 11.8971 8.01567H15.4689C16.4252 8.01567 17.2127 7.22817 17.2127 6.27192V2.72817C17.2127 1.7438 16.4252 0.956299 15.4689 0.956299ZM15.9752 6.30005C15.9752 6.5813 15.7502 6.8063 15.4689 6.8063H11.8971C11.6158 6.8063 11.3908 6.5813 11.3908 6.30005V2.72817C11.3908 2.44692 11.6158 2.22192 11.8971 2.22192H15.4689C15.7502 2.22192 15.9752 2.44692 15.9752 2.72817V6.30005Z"
                            fill=""
                          />
                          <path
                            d="M6.10322 9.92822H2.53135C1.5751 9.92822 0.787598 10.7157 0.787598 11.672V15.2438C0.787598 16.2001 1.5751 16.9876 2.53135 16.9876H6.10322C7.05947 16.9876 7.84697 16.2001 7.84697 15.2438V11.7001C7.8751 10.7157 7.0876 9.92822 6.10322 9.92822ZM6.60947 15.272C6.60947 15.5532 6.38447 15.7782 6.10322 15.7782H2.53135C2.2501 15.7782 2.0251 15.5532 2.0251 15.272V11.7001C2.0251 11.4188 2.2501 11.1938 2.53135 11.1938H6.10322C6.38447 11.1938 6.60947 11.4188 6.60947 11.7001V15.272Z"
                            fill=""
                          />
                          <path
                            d="M15.4689 9.92822H11.8971C10.9408 9.92822 10.1533 10.7157 10.1533 11.672V15.2438C10.1533 16.2001 10.9408 16.9876 11.8971 16.9876H15.4689C16.4252 16.9876 17.2127 16.2001 17.2127 15.2438V11.7001C17.2127 10.7157 16.4252 9.92822 15.4689 9.92822ZM15.9752 15.272C15.9752 15.5532 15.7502 15.7782 15.4689 15.7782H11.8971C11.6158 15.7782 11.3908 15.5532 11.3908 15.272V11.7001C11.3908 11.4188 11.6158 11.1938 11.8971 11.1938H15.4689C15.7502 11.1938 15.9752 11.4188 15.9752 11.7001V15.272Z"
                            fill=""
                          />
                        </svg>
                        Dịch vụ
                        <svg
                          className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${
                            open && 'rotate-180'
                          }`}
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                            fill=""
                          />
                        </svg>
                      </NavLink>
                      {/* <!-- Dropdown Menu Start --> */}
                      <div
                        className={`translate transform overflow-hidden ${
                          !open && 'hidden'
                        }`}
                      >
                        <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                          <li>
                            <NavLink
                              to="/dashboard/services"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white')
                              }
                            >
                              Danh sách dịch vụ
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to="/dashboard/services/types"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                (isActive && 'isActive')
                              }
                            >
                              Loại dịch vụ
                            </NavLink>
                          </li>

                        </ul>
                      </div>
                      {/* <!-- Dropdown Menu End --> */}
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>
              {/* <!-- Menu Item Services Management --> */}

              {/* <!-- Menu Item Location Management --> */}
              <li>
                <NavLink
                  to="/dashboard/locations"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes('locations') && 'bg-graydark dark:hover:bg-meta-4'
                  }`}
                >
                  <svg
                    className="fill-current"
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9 0.5625C4.17188 0.5625 0.25 4.48438 0.25 9.3125C0.25 14.1406 4.17188 18.0625 9 18.0625C13.8281 18.0625 17.75 14.1406 17.75 9.3125C17.75 4.48438 13.8281 0.5625 9 0.5625ZM9 16.3125C5.13281 16.3125 2 13.1797 2 9.3125C2 5.44531 5.13281 2.3125 9 2.3125C12.8672 2.3125 16 5.44531 16 9.3125C16 13.1797 12.8672 16.3125 9 16.3125Z"
                      fill=""
                    />
                    <path
                      d="M9 4.6875C6.51562 4.6875 4.5 6.70312 4.5 9.1875C4.5 11.6719 6.51562 13.6875 9 13.6875C11.4844 13.6875 13.5 11.6719 13.5 9.1875C13.5 6.70312 11.4844 4.6875 9 4.6875ZM9 11.6875C7.51562 11.6875 6.5 10.6719 6.5 9.1875C6.5 7.70312 7.51562 6.6875 9 6.6875C10.4844 6.6875 11.5 7.70312 11.5 9.1875C11.5 10.6719 10.4844 11.6875 9 11.6875Z"
                      fill=""
                    />
                  </svg>
                  Địa điểm
                </NavLink>
              </li>
              {/* <!-- Menu Item Location Management --> */}

              {/* <!-- Menu Item Vaccine Management --> */}
              <li>
                <NavLink
                  to="/dashboard/vaccine-manage"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes('vaccine-manage') && 'bg-graydark dark:bg-meta-4'
                  }`}
                >
                  <svg
                    className="fill-current"
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9 0.75C4.17157 0.75 0.25 4.67157 0.25 9.5C0.25 14.3284 4.17157 18.25 9 18.25C13.8284 18.25 17.75 14.3284 17.75 9.5C17.75 4.67157 13.8284 0.75 9 0.75ZM9 16.75C5.13401 16.75 2.25 13.866 2.25 9.5C2.25 5.13401 5.13401 2.25 9 2.25C12.866 2.25 15.75 5.13401 15.75 9.5C15.75 13.866 12.866 16.75 9 16.75Z"
                      fill=""
                    />
                    <path
                      d="M9 4.25C6.51472 4.25 4.5 6.26472 4.5 8.75C4.5 11.2353 6.51472 13.25 9 13.25C11.4853 13.25 13.5 11.2353 13.5 8.75C13.5 6.26472 11.4853 4.25 9 4.25ZM9 11.75C7.61929 11.75 6.5 10.6307 6.5 9.25C6.5 7.86929 7.61929 6.75 9 6.75C10.3807 6.75 11.5 7.86929 11.5 9.25C11.5 10.6307 10.3807 11.75 9 11.75Z"
                      fill=""
                    />
                  </svg>
                  Quản lý Vaccine
                </NavLink>
              </li>
              {/* <!-- Menu Item Vaccine Management --> */}

              {/* <!-- Menu Item Invoice Management --> */}
              <li>
                <NavLink
                  to="/dashboard/invoices"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes('invoices') && 'bg-graydark dark:bg-meta-4'
                  }`}
                >
                  <svg
                    className="fill-current"
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M16.875 0H1.125C0.5025 0 0 0.5025 0 1.125V16.875C0 17.4975 0.5025 18 1.125 18H16.875C17.4975 18 18 17.4975 18 16.875V1.125C18 0.5025 17.4975 0 16.875 0ZM16.875 16.875H1.125V1.125H16.875V16.875Z"
                      fill=""
                    />
                    <path
                      d="M4.5 4.5H13.5V6.75H4.5V4.5ZM4.5 8.25H13.5V10.5H4.5V8.25ZM4.5 12H10.125V14.25H4.5V12Z"
                      fill=""
                    />
                  </svg>
                  Hóa đơn
                </NavLink>
              </li>
              {/* <!-- Menu Item Invoice Management --> */}

              {/* <!-- Menu Item Appointment Management --> */}
              <li>
                <NavLink
                  to="/dashboard/appointments"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes('appointments') && 'bg-graydark dark:bg-meta-4'
                  }`}
                >
                  <svg
                    className="fill-current"
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9 0.75C4.17157 0.75 0.25 4.67157 0.25 9C0.25 13.3284 4.17157 17.25 9 17.25C13.3284 17.25 17.25 13.3284 17.25 9C17.25 4.67157 13.3284 0.75 9 0.75ZM9 15.75C5.13401 15.75 2.25 12.866 2.25 9C2.25 5.13401 5.13401 2.25 9 2.25C12.866 2.25 15.75 5.13401 15.75 9C15.75 12.866 12.866 15.75 9 15.75Z"
                      fill=""
                    />
                    <path
                      d="M9 4.5C9.41421 4.5 9.75 4.83579 9.75 5.25V8.25L12.75 8.25C13.1642 8.25 13.5 8.58579 13.5 9C13.5 9.41421 13.1642 9.75 12.75 9.75L9.75 9.75V12.75C9.75 13.1642 9.41421 13.5 9 13.5C8.58579 13.5 8.25 13.1642 8.25 12.75V9.75L5.25 9.75C4.83579 9.75 4.5 9.41421 4.5 9C4.5 8.58579 4.83579 8.25 5.25 8.25L8.25 8.25V5.25C8.25 4.83579 8.58579 4.5 9 4.5Z"
                      fill=""
                    />
                  </svg>
                  Quản lý Lịch hẹn
                </NavLink>
              </li>
              {/* <!-- Menu Item Appointment Management --> */}

              {/* <!-- Menu Item Image Management --> */}
              <li>
                <NavLink
                  to="/dashboard/image-management"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes('image-management') && 'bg-graydark dark:bg-meta-4'
                  }`}
                >
                  <svg
                    className="fill-current"
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15.75 0.5625H2.25C1.035 0.5625 0.0625 1.535 0.0625 2.75V15.25C0.0625 16.465 1.035 17.4375 2.25 17.4375H15.75C16.965 17.4375 17.9375 16.465 17.9375 15.25V2.75C17.9375 1.535 16.965 0.5625 15.75 0.5625ZM15.75 15.25H2.25V2.75H15.75V15.25Z"
                      fill=""
                    />
                    <path
                      d="M5.625 6.1875C6.38043 6.1875 7.125 5.44293 7.125 4.6875C7.125 3.93207 6.38043 3.1875 5.625 3.1875C4.86957 3.1875 4.125 3.93207 4.125 4.6875C4.125 5.44293 4.86957 6.1875 5.625 6.1875Z"
                      fill=""
                    />
                    <path
                      d="M2.25 8.4375H15.75L11.25 13.5L8.25 10.5L5.25 13.5L2.25 8.4375Z"
                      fill=""
                    />
                  </svg>
                  Quản lý Ảnh
                </NavLink>
              </li>
              {/* <!-- Menu Item Image Management --> */}

              {/* <!-- Menu Item Doctor Schedule --> */}
              <li>
                <NavLink
                  to="/dashboard/doctor-schedule"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes('doctor-schedule') && 'bg-graydark dark:bg-meta-4'
                  }`}
                >
                  <svg
                    className="fill-current"
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9 0.75C4.17157 0.75 0.25 4.67157 0.25 9C0.25 13.3284 4.17157 17.25 9 17.25C13.3284 17.25 17.25 13.3284 17.25 9C17.25 4.67157 13.3284 0.75 9 0.75ZM9 15.75C5.13401 15.75 2.25 12.866 2.25 9C2.25 5.13401 5.13401 2.25 9 2.25C12.866 2.25 15.75 5.13401 15.75 9C15.75 12.866 12.866 15.75 9 15.75Z"
                      fill=""
                    />
                    <path
                      d="M9 4.5C9.41421 4.5 9.75 4.83579 9.75 5.25V8.25L12.75 8.25C13.1642 8.25 13.5 8.58579 13.5 9C13.5 9.41421 13.1642 9.75 12.75 9.75L9.75 9.75V12.75C9.75 13.1642 9.41421 13.5 9 13.5C8.58579 13.5 8.25 13.1642 8.25 12.75V9.75L5.25 9.75C4.83579 9.75 4.5 9.41421 4.5 9C4.5 8.58579 4.83579 8.25 5.25 8.25L8.25 8.25V5.25C8.25 4.83579 8.58579 4.5 9 4.5Z"
                      fill=""
                    />
                  </svg>
                  Lịch Bác Sĩ
                </NavLink>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
