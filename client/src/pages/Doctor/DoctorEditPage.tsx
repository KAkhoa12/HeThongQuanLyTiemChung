import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDoctor, useUpdateDoctor } from '../../hooks/useDoctors';
import { toast } from 'react-toastify';
import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';

const DoctorEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  // Hooks để lấy thông tin bác sĩ và cập nhật
  const { data: doctor, loading: loadingDoctor, error: errorDoctor, execute: fetchDoctor } = useDoctor();
  const { loading: updating, error: updateError, execute: executeUpdate } = useUpdateDoctor();
  
  const [formData, setFormData] = useState({
    specialty: '',
    licenseNumber: ''
  });

  // Load thông tin bác sĩ khi component mount
  useEffect(() => {
    if (id) {
      fetchDoctor(id);
    }
  }, [id, fetchDoctor]);

  // Populate form với dữ liệu bác sĩ
  useEffect(() => {
    if (doctor) {
      setFormData({
        specialty: doctor.specialty || '',
        licenseNumber: doctor.licenseNumber || ''
      });
    }
  }, [doctor]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (!id) {
        toast.error('Không tìm thấy ID bác sĩ');
        return;
      }

      await executeUpdate({ id, data: formData });
      
      if (!updateError) {
        toast.success('Cập nhật thông tin bác sĩ thành công!');
        navigate('/dashboard/doctors');
      }
    } catch (error) {
      console.error('Lỗi cập nhật bác sĩ:', error);
      toast.error('Có lỗi xảy ra khi cập nhật thông tin bác sĩ');
    }
  };

  if (loadingDoctor) {
    return (
      <DefaultLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </DefaultLayout>
    );
  }

  if (errorDoctor) {
    return (
      <DefaultLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-red-500 text-center">
            <h2 className="text-xl font-bold mb-2">Lỗi tải thông tin bác sĩ</h2>
            <p>{errorDoctor}</p>
            <button 
              onClick={() => navigate('/dashboard/doctors')}
              className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
            >
              Quay lại danh sách
            </button>
          </div>
        </div>
      </DefaultLayout>
    );
  }

  if (!doctor) {
    return (
      <DefaultLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <h2 className="text-xl font-bold mb-2">Không tìm thấy bác sĩ</h2>
            <button 
              onClick={() => navigate('/dashboard/doctors')}
              className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
            >
              Quay lại danh sách
            </button>
          </div>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <>
      <Breadcrumb pageName="Chỉnh sửa thông tin bác sĩ" />

      <div className="grid grid-cols-1 gap-9 sm:grid-cols-1">
        <div className="flex flex-col gap-9">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Chỉnh sửa thông tin bác sĩ: {doctor.name}
              </h3>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="p-6.5">
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Chuyên môn
                    </label>
                    <input
                      type="text"
                      name="specialty"
                      value={formData.specialty}
                      onChange={handleInputChange}
                      placeholder="Nhập chuyên môn"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>

                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Số giấy phép hành nghề
                    </label>
                    <input
                      type="text"
                      name="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={handleInputChange}
                      placeholder="Nhập số giấy phép"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded">
                    <h4 className="font-medium text-black dark:text-white mb-3">Thông tin hiện tại</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Tên:</span>
                        <span className="ml-2 text-black dark:text-white">{doctor.name}</span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Email:</span>
                        <span className="ml-2 text-black dark:text-white">{doctor.email || 'Chưa có'}</span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Số điện thoại:</span>
                        <span className="ml-2 text-black dark:text-white">{doctor.phone || 'Chưa có'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 justify-end">
                  <button
                    type="button"
                    onClick={() => navigate('/dashboard/doctors')}
                    className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={updating}
                    className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-90 disabled:opacity-50"
                  >
                    {updating ? 'Đang cập nhật...' : 'Cập nhật'}
                  </button>
                </div>

                {updateError && (
                  <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    {updateError}
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default DoctorEditPage;