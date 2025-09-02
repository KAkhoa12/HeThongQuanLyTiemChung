import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Logo from '../../images/icon/logo.png';
import HumanLogo from '../../images/user/human.png';
import { useAuthStore } from '../../store/useAuthStore';
import { useToast } from '../../hooks/useToast';

const SignIn: React.FC = () => {
  const [email, setEmail] = useState<string>('manager@example.com');
  const [password, setPassword] = useState<string>('nguyenvana');
  
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, error, clearError, isAuthenticated } = useAuthStore();
  const { showSuccess, showError } = useToast();


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!email || !password) {
      showError('Lỗi', 'Vui lòng nhập email và mật khẩu');
      return;
    }
    
    try {
      clearError();
      
      const success = await login(email, password);
      
      if (success) {
        showSuccess('Thành công', 'Đăng nhập thành công!');
        const from = location.state?.from?.pathname || '/';
        navigate(from, { replace: true });
      } else {
        // Error is already set in the store
        if (error) {
          showError('Lỗi đăng nhập', error);
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Đăng nhập thất bại';
      showError('Lỗi đăng nhập', errorMessage);
    }
  };


  return (
    <>
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex flex-wrap items-center">
          <div className="hidden w-full xl:block xl:w-1/2">
            <div className="py-10 px-26 text-center">
              <Link className="mb-5.5 inline-block" to="/">
                <img className="hidden dark:block h-20" src={Logo} alt="Logo" />
                <img className="dark:hidden h-20" src={Logo} alt="Logo" />
              </Link>

              <p className="2xl:px-20">
                Đăng nhập để xem được dịch vụ tiêm chủng của chúng tôi 
              </p>

              <span className="mt-15 inline-block">
                <img src={HumanLogo} alt="Human" />
              </span>
            </div>
          </div>

          <div className="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
            <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
              <span className="mb-1.5 block font-medium">Đăng ký miễn phí</span>
              <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                Đăng nhập vào Huit KIT
              </h2>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Nhập email"
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      disabled={isLoading}
                    />

                    <span className="absolute right-4 top-4">
                    <i className="ri-mail-line text-2xl"></i>
                    </span>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Mật khẩu
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Nhập mật khẩu"
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      disabled={isLoading}
                    />

                    <span className="absolute right-4 top-4">
                      <i className="ri-lock-line text-2xl"></i>
                    </span>
                  </div>
                </div>

                <div className="mb-5">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90 disabled:bg-opacity-70 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                  </button>
                </div>

                <div className="mt-6 text-center">
                  <p>
                    Chưa có tài khoản đăng ký?{' '}
                    <Link to="/auth/signup" className="text-primary">
                      Đăng ký
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;