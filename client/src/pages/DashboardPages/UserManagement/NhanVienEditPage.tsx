import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNhanVien, useUpdateNhanVien } from '../../../hooks/useNhanVien';
import { useAllLocations } from '../../../hooks/useLocations';
import { useToast } from '../../../hooks/useToast';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import { UpdateNhanVienDto } from '../../../services/nhanVien.service';

const NhanVienEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const { showSuccess, showError } = useToast();
  const { data: nhanVien, loading: loadingNhanVien, execute: fetchNhanVien } = useNhanVien(id || '');
  const { execute: updateNhanVien, loading: updating } = useUpdateNhanVien();
  const { data: locations, execute: fetchLocations } = useAllLocations();

  const [formData, setFormData] = useState<UpdateNhanVienDto>({
    ten: '',
    soDienThoai: '',
    ngaySinh: '',
    diaChi: '',
    gioiTinh: '',
    maAnh: '',
    chucVu: '',
    maDiaDiem: '',
    isActive: true
  });

  useEffect(() => {
    if (id) {
      fetchNhanVien({ id });
    }
    fetchLocations();
  }, [id]);

  useEffect(() => {
    if (nhanVien) {
      setFormData({
        ten: nhanVien.ten || '',
        soDienThoai: nhanVien.soDienThoai || '',
        ngaySinh: nhanVien.ngaySinh || '',
        diaChi: nhanVien.diaChi || '',
        gioiTinh: nhanVien.gioiTinh || '',
        maAnh: nhanVien.maAnh || '',
        chucVu: nhanVien.chucVu || '',
        maDiaDiem: nhanVien.maDiaDiem || '',
        isActive: nhanVien.isActive ?? true
      });
    }
  }, [nhanVien]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: value ? Number(value) : undefined }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id) return;
    
    try {
      await updateNhanVien({ id, data: formData });
      showSuccess("Thành công", "Cập nhật nhân viên thành công");
      window.close();
    } catch (error) {
      showError("Lỗi", "Lỗi khi cập nhật nhân viên");
    }
  };

  if (loadingNhanVien) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!nhanVien) {
    return (
      <div className="text-center py-8">
        <p className="text-bodydark2">Không tìm thấy thông tin nhân viên</p>
      </div>
    );
  }

  return (
    <div className='p-6'>
      <Breadcrumb pageName={`Chỉnh sửa nhân viên - ${nhanVien.ten}`} />

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Chỉnh sửa thông tin nhân viên
          </h3>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6.5">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Thông tin cơ bản */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-black dark:text-white">Thông tin cơ bản</h4>
                
                <div>
                  <label className="mb-2.5 block text-black dark:text-white">
                    Họ và tên <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="ten"
                    value={formData.ten}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-2.5 block text-black dark:text-white">
                    Chức vụ
                  </label>
                  <input
                    type="text"
                    name="chucVu"
                    value={formData.chucVu}
                    onChange={handleInputChange}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-2.5 block text-black dark:text-white">
                    Địa điểm làm việc
                  </label>
                  <select
                    name="maDiaDiem"
                    value={formData.maDiaDiem}
                    onChange={handleInputChange}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  >
                    <option value="">Chọn địa điểm</option>
                    {locations?.map((location) => (
                      <option key={location.id} value={location.id}>
                        {location.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2.5 block text-black dark:text-white">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    name="soDienThoai"
                    value={formData.soDienThoai}
                    onChange={handleInputChange}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-2.5 block text-black dark:text-white">
                    Ngày sinh
                  </label>
                  <input
                    type="date"
                    name="ngaySinh"
                    value={formData.ngaySinh}
                    onChange={handleInputChange}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-2.5 block text-black dark:text-white">
                    Giới tính
                  </label>
                  <select
                    name="gioiTinh"
                    value={formData.gioiTinh}
                    onChange={handleInputChange}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  >
                    <option value="">Chọn giới tính</option>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2.5 block text-black dark:text-white">
                    Địa chỉ
                  </label>
                  <textarea
                    name="diaChi"
                    value={formData.diaChi}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <label className="text-black dark:text-white">
                    Trạng thái hoạt động
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-4">
              <button
                type="button"
                onClick={() => window.close()}
                className="inline-flex items-center justify-center rounded-md border border-stroke bg-white px-4 py-2 text-center font-medium text-black hover:bg-opacity-90 dark:border-strokedark dark:bg-boxdark dark:text-white"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={updating}
                className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-center font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
              >
                {updating ? 'Đang cập nhật...' : 'Cập nhật'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NhanVienEditPage;