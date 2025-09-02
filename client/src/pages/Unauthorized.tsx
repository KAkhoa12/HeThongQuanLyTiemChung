import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="mb-8">
          <svg
            className="mx-auto h-24 w-24 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        
        <h1 className="mb-4 text-4xl font-bold text-gray-800">
          403 - Không có quyền truy cập
        </h1>
        
        <p className="mb-8 text-lg text-gray-600">
          Bạn không có quyền truy cập vào trang này. Vui lòng liên hệ quản trị viên để được cấp quyền.
        </p>
        
        <div className="space-x-4">
          <Link
            to="/dashboard"
            className="inline-block rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700"
          >
            Về Dashboard
          </Link>
          
          <Link
            to="/auth/signin"
            className="inline-block rounded-lg border border-gray-300 px-6 py-3 text-gray-700 transition-colors hover:bg-gray-50"
          >
            Đăng nhập khác
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized; 