import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import PageTitle from '../components/PageTitle';
import PrivateRoute from './PrivateRoute';
import ClientLayout from '../layout/ClientLayout';
import Home from '../pages/ClientPages/MainPage/home';

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
const DoctorCreatePage = lazy(() => import('../pages/Doctor/DoctorCreatePage'));

// Service Management
const ServiceListPage = lazy(() => import('../pages/Service/ServiceListPage'));
const ServiceTypePage = lazy(() => import('../pages/Service/ServiceTypePage'));
const ServiceCreatePage = lazy(() => import('../pages/Service/ServiceCreatePage'));
const ServiceDetailPage = lazy(() => import('../pages/Service/ServiceDetailPage'));
const ServiceEditPage = lazy(() => import('../pages/Service/ServiceEditPage'));
const ServiceTypeCreatePage = lazy(() => import('../pages/Service/ServiceTypeCreatePage'));
const ServiceTypeEditPage = lazy(() => import('../pages/Service/ServiceTypeEditPage'));

// Service Vaccine (Client)
const ServiceVaccineListPage = lazy(() => import('../pages/ClientPages/ServiceVaccine/ServiceVaccineListPage'));

// Location Management
const LocationManagePage = lazy(() => import('../pages/Location/LocationManagePage'));

// Vaccine Management
const VaccineManagePage = lazy(() => import('../pages/VaccineManage/VaccineManagePage'));
const VaccineDetailPage = lazy(() => import('../pages/VaccineManage/VaccineDetailPage'));
const VaccineEditPage = lazy(() => import('../pages/VaccineManage/VaccineEditPage'));



// Image Management
const ImageManagementPage = lazy(() => import('../pages/ImageManagement'));

// Doctor Schedule Management
const DoctorSchedulePage = lazy(() => import('../pages/DoctorSchedule'));

// Other Pages
const Settings = lazy(() => import('../pages/Settings'));
const Tables = lazy(() => import('../pages/Tables'));
const Chart = lazy(() => import('../pages/Chart'));

// Cart & Checkout
const CartPage = lazy(() => import('../pages/ClientPages/Cart/CartPage'));
const CheckoutPage = lazy(() => import('../pages/Checkout/CheckoutPage'));
const PaymentSuccessPage = lazy(() => import('../pages/PaymentSuccess/PaymentSuccessPage'));

// Orders
const OrdersPage = lazy(() => import('../pages/ClientPages/Orders/OrdersPage'));
const OrderDetailPage = lazy(() => import('../pages/ClientPages/Orders/OrderDetailPage'));

// Admin Invoices
const InvoiceListPage = lazy(() => import('../pages/Dashboard/InvoiceListPage'));
const InvoiceDetailPage = lazy(() => import('../pages/Dashboard/InvoiceDetailPage'));

// Appointment Management
const AppointmentRegistrationPage = lazy(() => import('../pages/Appointment/AppointmentRegistrationPage'));
const AppointmentApprovalPage = lazy(() => import('../pages/Appointment/AppointmentApprovalPage'));

const routes = [
  {
    path: '/',
    element: <ClientLayout />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: 'services',
        element: (
          <>
            <PageTitle title="Dịch vụ & Vaccine | HuitKIT" />
            <ServiceVaccineListPage />
          </>
        )
      },
      {
        path: 'cart',
        element: (
          <>
            <PageTitle title="Giỏ hàng | HuitKIT" />
            <CartPage />
          </>
        )
      },
      {
        path: '/checkout',
        element: (
          <>
            <PageTitle title="Thanh toán | HuitKIT" />
            <CheckoutPage />
          </>
        )
      },
      {
        path: '/payment-success',
        element: (
          <>
            <PageTitle title="Kết quả thanh toán | HuitKIT" />
            <PaymentSuccessPage />
          </>
        )
      },
      {
        path: '/orders',
        element: (
          <>
            <PageTitle title="Đơn hàng của tôi | HuitKIT" />
            <OrdersPage />
          </>
        )
      },
      {
        path: '/orders/:orderId',
        element: (
          <>
            <PageTitle title="Chi tiết đơn hàng | HuitKIT" />
            <OrderDetailPage />
          </>
        )
      },
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
    path: '/dashboard/staff',
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
    path: '/dashboard/doctors',
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
      {
        path: 'create',
        element: (
          <PrivateRoute>
            <PageTitle title="Thêm bác sĩ mới | HuitKIT" />
            <DoctorCreatePage />
          </PrivateRoute>
        )
      },
      // Add more doctor routes as needed (edit, detail, schedules)
    ]
  },
  // Service Management Routes
  {
    path: '/dashboard/services',
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
        path: 'create',
        element: (
          <PrivateRoute>
            <PageTitle title="Thêm dịch vụ mới | HuitKIT" />
            <ServiceCreatePage />
          </PrivateRoute>
        )
      },
      {
        path: ':id',
        element: (
          <PrivateRoute>
            <PageTitle title="Chi tiết dịch vụ | HuitKIT" />
            <ServiceDetailPage />
          </PrivateRoute>
        )
      },
      {
        path: ':id/edit',
        element: (
          <PrivateRoute>
            <PageTitle title="Chỉnh sửa dịch vụ | HuitKIT" />
            <ServiceEditPage />
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
      {
        path: 'types/create',
        element: (
          <PrivateRoute>
            <PageTitle title="Thêm loại dịch vụ mới | HuitKIT" />
            <ServiceTypeCreatePage />
          </PrivateRoute>
        )
      },
      {
        path: 'types/:id/edit',
        element: (
          <PrivateRoute>
            <PageTitle title="Chỉnh sửa loại dịch vụ | HuitKIT" />
            <ServiceTypeEditPage />
          </PrivateRoute>
        )
      }
    ]
  },
  // Location Management Routes
  {
    path: '/dashboard/locations',
    element: <DefaultLayout />,
    children: [
      {
        index: true,
        element: (
          <PrivateRoute>
            <PageTitle title="Quản lý địa điểm | HuitKIT" />
            <LocationManagePage />
          </PrivateRoute>
        )
      }
    ]
  },
  // Vaccine Management Routes
  {
    path: '/dashboard/vaccine-manage',
    element: <DefaultLayout />,
    children: [
      {
        index: true,
        element: (
          <PrivateRoute>
            <PageTitle title="Quản lý Vaccine | HuitKIT" />
            <VaccineManagePage />
          </PrivateRoute>
        )
      },
      {
        path: 'detail/:id',
        element: (
          <PrivateRoute>
            <PageTitle title="Chi tiết Vaccine | HuitKIT" />
            <VaccineDetailPage />
          </PrivateRoute>
        )
      },
      {
        path: 'edit/:id',
        element: (
          <PrivateRoute>
            <PageTitle title="Chỉnh sửa Vaccine | HuitKIT" />
            <VaccineEditPage />
          </PrivateRoute>
        )
      },
    ]
  },


  // Image Management Routes
  {
    path: '/dashboard/image-management',
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
    path: '/dashboard/settings',
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
    path: '/dashboard/tables',
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
    path: '/dashboard/chart',
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
  // Invoice Management Routes
  {
    path: '/dashboard/invoices',
    element: <DefaultLayout />,
    children: [
      {
        index: true,
        element: (
          <PrivateRoute>
            <PageTitle title="Quản lý Hóa đơn | HuitKIT" />
            <InvoiceListPage />
          </PrivateRoute>
        )
      },
      {
        path: ':invoiceId',
        element: (
          <PrivateRoute>
            <PageTitle title="Chi tiết Hóa đơn | HuitKIT" />
            <InvoiceDetailPage />
          </PrivateRoute>
        )
      }
    ]
  },
  
  // Appointment Management Routes
  {
    path: '/dashboard/appointments',
    element: <DefaultLayout />,
    children: [
      {
        index: true,
        element: (
          <PrivateRoute>
            <PageTitle title="Quản lý Lịch hẹn | HuitKIT" />
            <AppointmentApprovalPage />
          </PrivateRoute>
        )
      }
    ]
  },
  
  // Appointment Registration Routes (for users)
  {
    path: '/appointment-registration',
    element: <ClientLayout />,
    children: [
      {
        index: true,
        element: (
          <>
            <PageTitle title="Đăng ký Lịch hẹn | HuitKIT" />
            <AppointmentRegistrationPage />
          </>
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