import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useVaccine, useUpdateVaccine } from '../../hooks/useVaccine';
import Loader from '../../common/Loader';

const VaccineEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const {
    data: vaccine,
    loading: vaccineLoading,
    error: vaccineError,
    execute: loadVaccine
  } = useVaccine();

  const {
    data: updateResult,
    loading: updateLoading,
    error: updateError,
    execute: updateVaccine
  } = useUpdateVaccine();

  const [formData, setFormData] = useState({
    ten: '',
    nhaSanXuat: '',
    tuoiBatDauTiem: '',
    tuoiKetThucTiem: '',
    huongDanSuDung: '',
    phongNgua: '',
    isActive: true
  });

  useEffect(() => {
    if (id) {
      loadVaccine(id);
    }
  }, [id, loadVaccine]);

  useEffect(() => {
    if (vaccine) {
      setFormData({
        ten: vaccine.ten || '',
        nhaSanXuat: vaccine.nhaSanXuat || '',
        tuoiBatDauTiem: vaccine.tuoiBatDauTiem?.toString() || '',
        tuoiKetThucTiem: vaccine.tuoiKetThucTiem?.toString() || '',
        huongDanSuDung: vaccine.huongDanSuDung || '',
        phongNgua: vaccine.phongNgua || '',
        isActive: vaccine.isActive ?? true
      });
    }
  }, [vaccine]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id) return;

    const updateData = {
      ...formData,
      tuoiBatDauTiem: formData.tuoiBatDauTiem ? parseInt(formData.tuoiBatDauTiem) : null,
      tuoiKetThucTiem: formData.tuoiKetThucTiem ? parseInt(formData.tuoiKetThucTiem) : null
    };

    await updateVaccine({ id, data: updateData });
  };

  const loading = vaccineLoading || updateLoading;
  const error = vaccineError || updateError;

  if (loading && !vaccine) {
    return <Loader />;
  }

  if (vaccineError && !vaccine) {
    return (
      <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="text-red-600 mr-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium text-red-800">Lỗi khi tải dữ liệu</h3>
              <p className="text-red-700 mt-1">{vaccineError}</p>
              <button
                onClick={() => id && loadVaccine(id)}
                className="mt-3 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Thử lại
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!vaccine) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold mb-4">Không tìm thấy vaccine</h2>
        <button
          onClick={() => navigate('/vaccine-manage')}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-opacity-90"
        >
          Quay lại danh sách
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-title-md2 font-bold text-black dark:text-white">
            Chỉnh Sửa Vaccine
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Mã: {vaccine.maVaccine}
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => navigate(`/vaccine-manage/detail/${vaccine.maVaccine}`)}
            className="inline-flex items-center justify-center rounded-md border border-stroke bg-white py-2 px-6 text-center font-medium text-black hover:bg-gray-50 dark:border-strokedark dark:bg-boxdark dark:text-white dark:hover:bg-boxdark-2"
          >
            Quay lại
          </button>
        </div>
      </div>

      {/* Success Message */}
      {updateResult && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-green-600 mr-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium text-green-800">Cập nhật thành công!</h3>
              <p className="text-green-700 mt-1">Vaccine đã được cập nhật thành công.</p>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {updateError && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-red-600 mr-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium text-red-800">Lỗi khi cập nhật</h3>
              <p className="text-red-700 mt-1">{updateError}</p>
            </div>
          </div>
        </div>
      )}

      {/* Edit Form */}
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tên Vaccine <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="ten"
                value={formData.ten}
                onChange={handleInputChange}
                required
                className="w-full rounded-lg border border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                placeholder="Nhập tên vaccine"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nhà Sản Xuất
              </label>
              <input
                type="text"
                name="nhaSanXuat"
                value={formData.nhaSanXuat}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                placeholder="Nhập nhà sản xuất"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tuổi Bắt Đầu (tháng)
              </label>
              <input
                type="number"
                name="tuoiBatDauTiem"
                value={formData.tuoiBatDauTiem}
                onChange={handleInputChange}
                min="0"
                className="w-full rounded-lg border border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tuổi Kết Thúc (tháng)
              </label>
              <input
                type="number"
                name="tuoiKetThucTiem"
                value={formData.tuoiKetThucTiem}
                onChange={handleInputChange}
                min="0"
                className="w-full rounded-lg border border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                placeholder="120"
              />
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Hướng Dẫn Sử Dụng
              </label>
              <textarea
                name="huongDanSuDung"
                value={formData.huongDanSuDung}
                onChange={handleInputChange}
                rows={4}
                className="w-full rounded-lg border border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                placeholder="Nhập hướng dẫn sử dụng"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phòng Ngừa
              </label>
              <textarea
                name="phongNgua"
                value={formData.phongNgua}
                onChange={handleInputChange}
                rows={4}
                className="w-full rounded-lg border border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                placeholder="Nhập thông tin phòng ngừa"
              />
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Vaccine hoạt động
                </span>
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate(`/vaccine-manage/detail/${vaccine.maVaccine}`)}
              className="px-6 py-2 border border-stroke rounded hover:bg-gray-50 dark:border-strokedark dark:hover:bg-boxdark-2"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={updateLoading}
              className="px-6 py-2 bg-primary text-white rounded hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updateLoading ? 'Đang cập nhật...' : 'Cập nhật Vaccine'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VaccineEditPage; 