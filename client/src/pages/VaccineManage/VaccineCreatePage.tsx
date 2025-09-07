import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateVaccine } from '../../hooks/useVaccine';
import { useToast } from '../../hooks/useToast';
import Loader from '../../common/Loader';

const VaccineCreatePage: React.FC = () => {
  const navigate = useNavigate();
  
  const {
    data: createResult,
    loading: createLoading,
    error: createError,
    execute: createVaccine
  } = useCreateVaccine();

  const { showSuccess, showError } = useToast();

  const [formData, setFormData] = useState({
    ten: '',
    nhaSanXuat: '',
    tuoiBatDauTiem: '',
    tuoiKetThucTiem: '',
    huongDanSuDung: '',
    phongNgua: '',
    isActive: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.ten.trim()) {
      newErrors.ten = 'Tên vaccine là bắt buộc';
    }

    if (formData.tuoiBatDauTiem && formData.tuoiKetThucTiem) {
      const startAge = parseInt(formData.tuoiBatDauTiem);
      const endAge = parseInt(formData.tuoiKetThucTiem);
      
      if (startAge >= endAge) {
        newErrors.tuoiKetThucTiem = 'Tuổi kết thúc phải lớn hơn tuổi bắt đầu';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const vaccineData = {
        ten: formData.ten.trim(),
        nhaSanXuat: formData.nhaSanXuat.trim() || undefined,
        tuoiBatDauTiem: formData.tuoiBatDauTiem ? parseInt(formData.tuoiBatDauTiem) : undefined,
        tuoiKetThucTiem: formData.tuoiKetThucTiem ? parseInt(formData.tuoiKetThucTiem) : undefined,
        huongDanSuDung: formData.huongDanSuDung.trim() || undefined,
        phongNgua: formData.phongNgua.trim() || undefined,
        isActive: formData.isActive
      };

      await createVaccine(vaccineData);
      showSuccess("Thành công", "Tạo vaccine mới thành công");
      navigate('/dashboard/vaccine-manage');
    } catch (error) {
      showError("Lỗi", "Tạo vaccine thất bại");
    }
  };

  const handleCancel = () => {
    navigate('/dashboard/vaccine-manage');
  };

  if (createLoading) {
    return <Loader />;
  }

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-title-md2 font-bold text-black dark:text-white">
            Tạo Vaccine Mới
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Thêm vaccine mới vào hệ thống
          </p>
        </div>
        <button
          onClick={handleCancel}
          className="inline-flex items-center justify-center rounded-md border border-stroke bg-white py-2 px-6 text-center font-medium text-black hover:bg-gray-50 dark:border-strokedark dark:bg-boxdark dark:text-white dark:hover:bg-boxdark-2"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Hủy
        </button>
      </div>

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Thông tin Vaccine
          </h3>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6.5">
          <div className="mb-4.5">
            <label className="mb-2.5 block text-black dark:text-white">
              Tên Vaccine <span className="text-meta-1">*</span>
            </label>
            <input
              type="text"
              name="ten"
              value={formData.ten}
              onChange={handleInputChange}
              placeholder="Nhập tên vaccine"
              className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${
                errors.ten ? 'border-meta-1' : ''
              }`}
            />
            {errors.ten && (
              <p className="text-meta-1 text-sm mt-1">{errors.ten}</p>
            )}
          </div>

          <div className="mb-4.5">
            <label className="mb-2.5 block text-black dark:text-white">
              Nhà Sản Xuất
            </label>
            <input
              type="text"
              name="nhaSanXuat"
              value={formData.nhaSanXuat}
              onChange={handleInputChange}
              placeholder="Nhập tên nhà sản xuất"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-1 gap-4.5 sm:grid-cols-2">
            <div className="mb-4.5">
              <label className="mb-2.5 block text-black dark:text-white">
                Tuổi Bắt Đầu Tiêm (tháng)
              </label>
              <input
                type="number"
                name="tuoiBatDauTiem"
                value={formData.tuoiBatDauTiem}
                onChange={handleInputChange}
                placeholder="0"
                min="0"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
            </div>

            <div className="mb-4.5">
              <label className="mb-2.5 block text-black dark:text-white">
                Tuổi Kết Thúc Tiêm (tháng)
              </label>
              <input
                type="number"
                name="tuoiKetThucTiem"
                value={formData.tuoiKetThucTiem}
                onChange={handleInputChange}
                placeholder="0"
                min="0"
                className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${
                  errors.tuoiKetThucTiem ? 'border-meta-1' : ''
                }`}
              />
              {errors.tuoiKetThucTiem && (
                <p className="text-meta-1 text-sm mt-1">{errors.tuoiKetThucTiem}</p>
              )}
            </div>
          </div>

          <div className="mb-4.5">
            <label className="mb-2.5 block text-black dark:text-white">
              Hướng Dẫn Sử Dụng
            </label>
            <textarea
              name="huongDanSuDung"
              value={formData.huongDanSuDung}
              onChange={handleInputChange}
              placeholder="Nhập hướng dẫn sử dụng vaccine"
              rows={4}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
          </div>

          <div className="mb-4.5">
            <label className="mb-2.5 block text-black dark:text-white">
              Phòng Ngừa
            </label>
            <textarea
              name="phongNgua"
              value={formData.phongNgua}
              onChange={handleInputChange}
              placeholder="Nhập thông tin phòng ngừa"
              rows={4}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
          </div>

          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                className="mr-3 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-black dark:text-white">
                Kích hoạt vaccine
              </span>
            </label>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Vaccine sẽ được kích hoạt và có thể sử dụng ngay sau khi tạo
            </p>
          </div>

          {createError && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="text-red-600 mr-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-red-800">Lỗi khi tạo vaccine</h4>
                  <p className="text-sm text-red-700 mt-1">{createError}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="inline-flex items-center justify-center rounded-md border border-stroke bg-white py-2 px-6 text-center font-medium text-black hover:bg-gray-50 dark:border-strokedark dark:bg-boxdark dark:text-white dark:hover:bg-boxdark-2"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={createLoading}
              className="inline-flex items-center justify-center rounded-md bg-primary py-2 px-6 text-center font-medium text-white hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang tạo...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Tạo Vaccine
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VaccineCreatePage;