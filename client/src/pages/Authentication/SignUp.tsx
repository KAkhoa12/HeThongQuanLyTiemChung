import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../images/icon/logo.png';
import HumanLogo from '../../images/user/human.png';
import { useAuth } from '../../hooks/useAuth';

const SignUp: React.FC = () => {
  const [formData, setFormData] = useState({
    ten: '',
    email: '',
    matKhau: '',
    xacNhanMatKhau: '',
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.ten || !formData.email || !formData.matKhau || !formData.xacNhanMatKhau) {
      setErrorMessage('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (formData.matKhau !== formData.xacNhanMatKhau) {
      setErrorMessage('Mật khẩu không khớp');
      return;
    }

    if (formData.matKhau.length < 6) {
      setErrorMessage('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setErrorMessage('');
      
      const success = await register({
        ten: formData.ten,
        email: formData.email,
        matKhau: formData.matKhau
      });
      
      if (success) {
        navigate('/auth/signin', { state: { message: 'Đăng ký thành công! Vui lòng đăng nhập.' } });
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Đăng ký thất bại');
    } finally {
      setIsSubmitting(false);
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
                Đăng ký để xem được dịch vụ tiêm chủng của chúng tôi 
              </p>

              <span className="mt-15 inline-block">
                <img src={HumanLogo} alt="Human" />
              </span>
            </div>
          </div>

          <div className="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
            <div className="w-full p-4 sm:p-12.5 xl:p-9">
              <span className="mb-1.5 block font-medium">Đăng ký miễn phí</span>
              <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                Đăng ký vào Huit KIT
              </h2>

              {errorMessage && (
                <div className="mb-5 rounded-md bg-red-50 p-4 text-sm text-red-500 dark:bg-red-500/10">
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Họ và tên
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="ten"
                      value={formData.ten}
                      onChange={handleChange}
                      placeholder="Nhập họ và tên"
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      disabled={isSubmitting}
                    />

                    <span className="absolute right-4 top-4">
                    <i className="ri-user-line text-2xl"></i>
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Nhập email"
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      disabled={isSubmitting}
                    />

                    <span className="absolute right-4 top-4">
                    <i className="ri-mail-line text-2xl"></i>
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Mật khẩu
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      name="matKhau"
                      value={formData.matKhau}
                      onChange={handleChange}
                      placeholder="Nhập mật khẩu"
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      disabled={isSubmitting}
                    />

                    <span className="absolute right-4 top-4">
                    <i className="ri-lock-line text-2xl"></i>
                    </span>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Xác nhận mật khẩu
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      name="xacNhanMatKhau"
                      value={formData.xacNhanMatKhau}
                      onChange={handleChange}
                      placeholder="Nhập lại mật khẩu"
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      disabled={isSubmitting}
                    />

                    <span className="absolute right-4 top-4">
                      <i className="ri-lock-line text-2xl"></i>
                    </span>
                  </div>
                </div>

                <div className="mb-5">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90 disabled:bg-opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Đang đăng ký...' : 'Đăng ký'}
                  </button>
                </div>

                <div className="mt-6 text-center">
                  <p>
                    Đã có tài khoản?{' '}
                    <Link to="/auth/signin" className="text-primary">
                      Đăng nhập
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

export default SignUp;