import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import PageTitle from '../components/PageTitle';
import PrivateRoute from './PrivateRoute';
import ClientLayout from '../layout/ClientLayout';
import Home from '../pages/MainPage/home';

// Dashboard
const DefaultLayout = lazy(() => import('../layout/DefaultLayout'));
const ECommerce = lazy(() => import('../pages/Dashboard/ECommerce'));
const Calendar = lazy(() => import('../pages/Calendar'));
const Profile = lazy(() => import('../pages/Profile'));

// Authentication
const SignIn = lazy(() => import('../pages/Authentication/SignIn'));
const SignUp = lazy(() => import('../pages/Authentication/SignUp'));

// Staff Management
const StaffListPage = lazy(() => import('../pages/Staff/StaffListPage'));

// Doctor Management
const DoctorListPage = lazy(() => import('../pages/Doctor/DoctorListPage'));

// Service Management
const ServiceListPage = lazy(() => import('../pages/Service/ServiceListPage'));
const ServiceTypePage = lazy(() => import('../pages/Service/ServiceTypePage'));

// Image Management
const ImageManagementPage = lazy(() => import('../pages/ImageManagement'));

// Doctor Schedule Management
const DoctorSchedulePage = lazy(() => import('../pages/DoctorSchedule'));

// Other Pages
const Settings = lazy(() => import('../pages/Settings'));
const Tables = lazy(() => import('../pages/Tables'));
const Chart = lazy(() => import('../pages/Chart'));

const routes = [
  {
    path: '/',
    element: <ClientLayout />,
    children: [
      {
        index: true,
        element: <Home />
      }
    ]
  },
  {
    path: '/auth/signin',
    element: (
      <>
        <PageTitle title="Đăng nhập tài khoản HuitKIT" />
        <SignIn />
      </>
    )
  },
  {
    path: '/auth/signup',
    element: (
      <>
        <PageTitle title="Đăng ký tài khoản HuitKIT" />
        <SignUp />
      </>
    )
  },
  {
    path: '/dashboard',
    element: <DefaultLayout />,
    children: [
      {
        index: true,
        element: (
          <PrivateRoute>
            <PageTitle title="Dashboard | HuitKIT" />
            <ECommerce />
          </PrivateRoute>
        )
      },
      {
        path: 'profile',
        element: (
          <PrivateRoute>
            <PageTitle title="Profile | HuitKIT" />
            <Profile />
          </PrivateRoute>
        )
      },
      {
        path: 'calendar',
        element: (
          <PrivateRoute>
            <PageTitle title="Calendar | HuitKIT" />
            <Calendar />
          </PrivateRoute>
        )
      },
      {
        path: 'doctor-schedule',
        element: (
          <PrivateRoute>
            <PageTitle title="Lịch Bác Sĩ | HuitKIT" />
            <DoctorSchedulePage />
          </PrivateRoute>
        )
      }
    ]
  },
  // Staff Management Routes
  {
    path: '/staff',
    element: <DefaultLayout />,
    children: [
      {
        index: true,
        element: (
          <PrivateRoute>
            <PageTitle title="Quản lý nhân viên | HuitKIT" />
            <StaffListPage />
          </PrivateRoute>
        )
      },
      // Add more staff routes as needed (create, edit, detail)
    ]
  },
  // Doctor Management Routes
  {
    path: '/doctors',
    element: <DefaultLayout />,
    children: [
      {
        index: true,
        element: (
          <PrivateRoute>
            <PageTitle title="Quản lý bác sĩ | HuitKIT" />
            <DoctorListPage />
          </PrivateRoute>
        )
      },
      // Add more doctor routes as needed (create, edit, detail, schedules)
    ]
  },
  // Service Management Routes
  {
    path: '/services',
    element: <DefaultLayout />,
    children: [
      {
        index: true,
        element: (
          <PrivateRoute>
            <PageTitle title="Quản lý dịch vụ | HuitKIT" />
            <ServiceListPage />
          </PrivateRoute>
        )
      },
      {
        path: 'types',
        element: (
          <PrivateRoute>
            <PageTitle title="Quản lý loại dịch vụ | HuitKIT" />
            <ServiceTypePage />
          </PrivateRoute>
        )
      },
      // Add more service routes as needed (create, edit, detail)
    ]
  },
  // Image Management Routes
  {
    path: '/image-management',
    element: <DefaultLayout />,
    children: [
      {
        index: true,
        element: (
          <PrivateRoute>
            <PageTitle title="Quản lý Ảnh | HuitKIT" />
            <ImageManagementPage />
          </PrivateRoute>
        )
      },
      // Add more image management routes as needed
    ]
  },
  // Settings Routes
  {
    path: '/settings',
    element: <DefaultLayout />,
    children: [
      {
        index: true,
        element: (
          <PrivateRoute>
            <PageTitle title="Settings | HuitKIT" />
            <Settings />
          </PrivateRoute>
        )
      }
    ]
  },
  // Tables Routes
  {
    path: '/tables',
    element: <DefaultLayout />,
    children: [
      {
        index: true,
        element: (
          <PrivateRoute>
            <PageTitle title="Tables | HuitKIT" />
            <Tables />
          </PrivateRoute>
        )
      }
    ]
  },
  // Chart Routes
  {
    path: '/chart',
    element: <DefaultLayout />,
    children: [
      {
        index: true,
        element: (
          <PrivateRoute>
            <PageTitle title="Chart | HuitKIT" />
            <Chart />
          </PrivateRoute>
        )
      }
    ]
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />
  }
];

export default routes;