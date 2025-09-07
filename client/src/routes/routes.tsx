import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import PageTitle from '../components/PageTitle';
import PrivateRoute from './PrivateRoute';
import PermissionRoute from './PermissionRoute';
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
const DoctorEditPage = lazy(() => import('../pages/Doctor/DoctorEditPage'));

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
const VaccineCreatePage = lazy(() => import('../pages/VaccineManage/VaccineCreatePage'));
const VaccineDetailPage = lazy(() => import('../pages/VaccineManage/VaccineDetailPage'));
const VaccineEditPage = lazy(() => import('../pages/VaccineManage/VaccineEditPage'));



// Image Management
const ImageManagementPage = lazy(() => import('../pages/ImageManagement'));

// Vaccination Management
const PhieuDangKyTiemChungPage = lazy(() => import('../pages/Vaccination/PhieuDangKyTiemChungPage'));
const LichSuTiemPage = lazy(() => import('../pages/Vaccination/LichSuTiemPage'));
const UpcomingVaccinationsPage = lazy(() => import('../pages/Vaccination/UpcomingVaccinationsPage'));

// Doctor Schedule Management
const DoctorSchedulePage = lazy(() => import('../pages/DoctorSchedule'));
const DoctorScheduleCreate = lazy(() => import('../pages/DoctorSchedule/DoctorScheduleCreatePage'));
const DoctorScheduleAppointment = lazy(() => import('../pages/DoctorSchedule/DoctorScheduleAppointmentPage'));

// Other Pages
const Settings = lazy(() => import('../pages/Settings'));
const Chart = lazy(() => import('../pages/Chart'));
const Unauthorized = lazy(() => import('../pages/Unauthorized'));

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
const AppointmentApprovalPage = lazy(() => import('../pages/Appointment/AppointmentApprovalPage'));
const AppointmentRegistrationFromInvoice = lazy(() => import('../pages/Appointment/AppointmentRegistrationFromInvoice'));
const DoctorAppointmentManagementPage = lazy(() => import('../pages/Doctor/DoctorAppointmentManagementPage'));

// Vaccination Management (New)
const DoctorVaccinationManagementPage = lazy(() => import('../pages/VaccinationManagement/DoctorVaccinationManagementPage'));
const CustomerVaccinationSchedulePage = lazy(() => import('../pages/ClientPages/VaccinationSchedule/CustomerVaccinationSchedulePage'));

// KhuyenMai Management
const KhuyenMaiPage = lazy(() => import('../pages/KhuyenMai/KhuyenMaiPage'));
const LoaiKhuyenMaiPage = lazy(() => import('../pages/KhuyenMai/LoaiKhuyenMaiPage'));

// Quyen Management
const VaiTroQuyenPage = lazy(() => import('../pages/QuyenManage/VaiTroQuyenPage'));
const NguoiDungQuyenPage = lazy(() => import('../pages/QuyenManage/NguoiDungQuyenPage'));

// Inventory Management
const TonKhoPage = lazy(() => import('../pages/DashboardPages/Inventory/TonKhoPage'));
const PhieuNhapPage = lazy(() => import('../pages/DashboardPages/Inventory/PhieuNhapPage'));
const PhieuXuatPage = lazy(() => import('../pages/DashboardPages/Inventory/PhieuXuatPage'));
const ThanhLyPage = lazy(() => import('../pages/DashboardPages/Inventory/ThanhLyPage'));
const DuyetPhieuPage = lazy(() => import('../pages/DashboardPages/Inventory/ApprovalPage'));

// NhaCungCap Management
const NhaCungCapPage = lazy(() => import('../pages/DashboardPages/NhaCungCap/NhaCungCapPage'));



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
          <PrivateRoute >
            <PageTitle title="Giỏ hàng | HuitKIT" />
            <CartPage />
          </PrivateRoute>
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
      {
        path: '/vaccination-schedule',
        element: (
          <>
            <PageTitle title="Lịch tiêm chủng của tôi | HuitKIT" />
            <CustomerVaccinationSchedulePage />
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
      },
      {
        path: 'doctor-schedule/create',
        element: (
          <PrivateRoute>
            <PageTitle title="Tạo Lịch Làm Việc | HuitKIT" />
            <DoctorScheduleCreate />
          </PrivateRoute>
        )
      },
      {
        path: 'doctor-schedule/appointment',
        element: (
          <PrivateRoute>
            <PageTitle title="Đăng Ký Lịch Hẹn | HuitKIT" />
            <DoctorScheduleAppointment />
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
          <PermissionRoute requiredPermissions={['NguoiDung']}>
            <PageTitle title="Quản lý nhân viên | HuitKIT" />
            <StaffListPage />
          </PermissionRoute>
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
          <PermissionRoute requiredPermissions={['BacSi']}>
            <PageTitle title="Quản lý bác sĩ | HuitKIT" />
            <DoctorListPage />
          </PermissionRoute>
        )
      },
      {
        path: 'create',
        element: (
          <PermissionRoute requiredPermissions={['BacSi']}>
            <PageTitle title="Thêm bác sĩ mới | HuitKIT" />
            <DoctorCreatePage />
          </PermissionRoute>
        )
      },
      {
        path: 'edit/:id',
        element: (
          <PermissionRoute requiredPermissions={['BacSi']}>
            <PageTitle title="Chỉnh sửa thông tin bác sĩ | HuitKIT" />
            <DoctorEditPage />
          </PermissionRoute>
        )
      },
      // Add more doctor routes as needed (detail, schedules)
      {
        path: 'appointments',
        element: (
          <PermissionRoute requiredPermissions={['LichHen,PhieuDangKyLichTiem']}>
            <PageTitle title="Quản lý lịch hẹn bác sĩ | HuitKIT" />
            <DoctorAppointmentManagementPage />
          </PermissionRoute>
        )
      }
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
          <PermissionRoute requiredPermissions={['DichVu']}>
            <PageTitle title="Quản lý dịch vụ | HuitKIT" />
            <ServiceListPage />
          </PermissionRoute>
        )
      },
      {
        path: 'create',
        element: (
          <PermissionRoute requiredPermissions={['DichVu']}>
            <PageTitle title="Thêm dịch vụ mới | HuitKIT" />
            <ServiceCreatePage />
          </PermissionRoute>
        )
      },
      {
        path: ':id',
        element: (
          <PermissionRoute requiredPermissions={['DichVu']}>
            <PageTitle title="Chi tiết dịch vụ | HuitKIT" />
            <ServiceDetailPage />
          </PermissionRoute>
        )
      },
      {
        path: ':id/edit',
        element: (
          <PermissionRoute requiredPermissions={['DichVu']}>
            <PageTitle title="Chỉnh sửa dịch vụ | HuitKIT" />
            <ServiceEditPage />
          </PermissionRoute>
        )
      },
      {
        path: 'types',
        element: (
          <PermissionRoute requiredPermissions={['LoaiDichVu']}>
            <PageTitle title="Quản lý loại dịch vụ | HuitKIT" />
            <ServiceTypePage />
          </PermissionRoute>
        )
      },
      {
        path: 'types/create',
        element: (
          <PermissionRoute requiredPermissions={['LoaiDichVu']}>
            <PageTitle title="Thêm loại dịch vụ mới | HuitKIT" />
            <ServiceTypeCreatePage />
          </PermissionRoute>
        )
      },
      {
        path: 'types/:id/edit',
        element: (
          <PermissionRoute requiredPermissions={['LoaiDichVu']}>
            <PageTitle title="Chỉnh sửa loại dịch vụ | HuitKIT" />
            <ServiceTypeEditPage />
          </PermissionRoute>
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
          <PermissionRoute requiredPermissions={['DiaDiem']}>
            <PageTitle title="Quản lý địa điểm | HuitKIT" />
            <LocationManagePage />
          </PermissionRoute>
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
          <PermissionRoute requiredPermissions={['Vaccine']}>
            <PageTitle title="Quản lý Vaccine | HuitKIT" />
            <VaccineManagePage />
          </PermissionRoute>
        )
      },
      {
        path: 'create',
        element: (
          <PermissionRoute requiredPermissions={['Vaccine']}>
            <PageTitle title="Tạo Vaccine | HuitKIT" />
            <VaccineCreatePage />
          </PermissionRoute>
        )
      },
      {
        path: 'detail/:id',
        element: (
          <PermissionRoute requiredPermissions={['Vaccine']}>
            <PageTitle title="Chi tiết Vaccine | HuitKIT" />
            <VaccineDetailPage />
          </PermissionRoute>
        )
      },
      {
        path: 'edit/:id',
        element: (
          <PermissionRoute requiredPermissions={['Vaccine']}>
            <PageTitle title="Chỉnh sửa Vaccine | HuitKIT" />
            <VaccineEditPage />
          </PermissionRoute>
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
          <PermissionRoute requiredPermissions={['NguonAnh']}>
            <PageTitle title="Quản lý Ảnh | HuitKIT" />
            <ImageManagementPage />
          </PermissionRoute>
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
          <PermissionRoute requiredPermissions={['DonHang']}>
            <PageTitle title="Quản lý Hóa đơn | HuitKIT" />
            <InvoiceListPage />
          </PermissionRoute>
        )
      },
      {
        path: ':invoiceId',
        element: (
          <PermissionRoute requiredPermissions={['DonHang']}>
            <PageTitle title="Chi tiết Hóa đơn | HuitKIT" />
            <InvoiceDetailPage />
          </PermissionRoute>
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
          <PermissionRoute requiredPermissions={['LichHen']}>
            <PageTitle title="Quản lý Lịch hẹn | HuitKIT" />
            <AppointmentApprovalPage />
          </PermissionRoute>
        )
      }
    ]
  },
  

  // Appointment Registration from Invoice (Protected)
  {
    path: '/appointment/register-from-invoice/:orderId',
    element: <DefaultLayout />,
    children: [
      {
        index: true,
        element: (
      <PrivateRoute>
        <PageTitle title="Đăng ký Lịch tiêm từ Hóa đơn | HuitKIT" />
        <AppointmentRegistrationFromInvoice />
      </PrivateRoute>
    )
    }
  ]
  },

  // KhuyenMai Management Routes
  {
    path: '/dashboard/khuyen-mai',
    element: <DefaultLayout />,
    children: [
      {
        index: true,
        element: (
          <PermissionRoute requiredPermissions={['KhuyenMai']}>
            <PageTitle title="Quản lý Khuyến mãi | HuitKIT" />
            <KhuyenMaiPage />
          </PermissionRoute>
        )
      },
      {
        path: 'loai',
        element: (
          <PermissionRoute requiredPermissions={['LoaiKhuyenMai']}>
            <PageTitle title="Quản lý Loại khuyến mãi | HuitKIT" />
            <LoaiKhuyenMaiPage />
          </PermissionRoute>
        )
      }
    ]
  },

  // Quyen Management Routes
  {
    path: '/dashboard/quyen',
    element: <DefaultLayout />,
    children: [
      {
        index: true,
        element: (
          <PermissionRoute requiredPermissions={['VaiTroQuyen']}>
            <PageTitle title="Quản lý phân quyền vai trò | HuitKIT" />
            <VaiTroQuyenPage />
          </PermissionRoute>
        )
      },
      {
        path: 'nguoi-dung',
        element: (
          <PermissionRoute requiredPermissions={['NguoiDungQuyen']}>
            <PageTitle title="Quản lý phân quyền người dùng | HuitKIT" />
            <NguoiDungQuyenPage />
          </PermissionRoute>
        )
      }
    ]
  },

  // Inventory Management Routes
  {
    path: '/dashboard/inventory',
    element: <DefaultLayout />,
    children: [
      {
        path: 'ton-kho',
        element: (
          <PermissionRoute requiredPermissions={['TonKhoLo']}>
            <PageTitle title="Quản lý Tồn kho Lô Vaccine | HuitKIT" />
            <TonKhoPage />
          </PermissionRoute>
        )
      },
      {
        path: 'phieu-nhap',
        element: (
          <PermissionRoute requiredPermissions={['PhieuNhap']}>
            <PageTitle title="Quản lý Phiếu Nhập | HuitKIT" />
            <PhieuNhapPage />
          </PermissionRoute>
        )
      },
      {
        path: 'phieu-xuat',
        element: (
          <PermissionRoute requiredPermissions={['PhieuXuat']}>
            <PageTitle title="Quản lý Phiếu Xuất | HuitKIT" />
            <PhieuXuatPage />
          </PermissionRoute>
        )
      },
      {
        path: 'thanh-ly',
        element: (
          <PermissionRoute requiredPermissions={['PhieuThanhLy']}>
            <PageTitle title="Thanh lý Vaccine sắp hết hạn | HuitKIT" />
            <ThanhLyPage />
          </PermissionRoute>
        )
      },
      {
        path: 'approval',
        element: (
          <PermissionRoute requiredPermissions={['PhieuNhap', 'PhieuXuat', 'PhieuThanhLy']}>
            <PageTitle title="Duyệt phiếu | HuitKIT" />
            <DuyetPhieuPage />
          </PermissionRoute>
        )
      }
    ]
  },

  // NhaCungCap Management Routes
  {
    path: '/dashboard/nha-cung-cap',
    element: <DefaultLayout />,
    children: [
      {
        index: true,
        element: (
          <PermissionRoute requiredPermissions={['NhaCungCap']}>
            <PageTitle title="Quản lý Nhà cung cấp | HuitKIT" />
            <NhaCungCapPage />
          </PermissionRoute>
        )
      }
    ]
  },
  
  // Vaccination Management Routes
  {
    path: '/dashboard/vaccination',
    element: <DefaultLayout />,
    children: [
      {
        path: 'registration',
        element: (
          <PermissionRoute requiredPermissions={['PhieuDangKyLichTiem']}>
            <PageTitle title="Phiếu đăng ký tiêm chủng | HuitKIT" />
            <PhieuDangKyTiemChungPage />
          </PermissionRoute>
        )
      },
      {
        path: 'approval',
        element: (
          <PermissionRoute requiredPermissions={['PhieuDangKyLichTiem']}>
            <PageTitle title="Duyệt phiếu đăng ký tiêm chủng | HuitKIT" />
            <AppointmentApprovalPage />
          </PermissionRoute>
        )
      },
      {
        path: 'doctor-management',
        element: (
          <PermissionRoute requiredPermissions={['PhieuTiem']}>
            <PageTitle title="Quản lý tiêm chủng cho bác sĩ | HuitKIT" />
            <DoctorVaccinationManagementPage />
          </PermissionRoute>
        )
      },
      {
        path: 'upcoming',
        element: (
          <>
            <PageTitle title="Đợt tiêm sắp tới | HuitKIT" />
            <UpcomingVaccinationsPage />
          </>
        )
      },
      {
        path: 'history',
        element: (
          <PermissionRoute requiredPermissions={['LichSuTiem']}>
            <PageTitle title="Lịch sử tiêm chủng | HuitKIT" />
            <LichSuTiemPage />
          </PermissionRoute>
        )
      }
    ]
  },
  
  // Unauthorized Page
  {
    path: '/unauthorized',
    element: (
      <>
        <PageTitle title="Không có quyền truy cập | HuitKIT" />
        <Unauthorized />
      </>
    )
  },
  
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />
  }
];

export default routes;