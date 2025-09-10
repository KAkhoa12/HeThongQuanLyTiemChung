import React, { useState } from 'react';
import { useCreateKhachHang } from '../../../hooks/useKhachHang';
import { useToast } from '../../../hooks/useToast';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import { CreateKhachHangDto } from '../../../services/khachHang.service';

const KhachHangCreatePage = () => {
  const { showSuccess, showError } = useToast();
  const { execute: createKhachHang, loading } = useCreateKhachHang();

  const [formData, setFormData] = useState<CreateKhachHangDto>({
    ten: '',
    email: '',
    matKhau: '',
    soDienThoai: '',
    ngaySinh: '',
    diaChi: '',
    gioiTinh: '',
    maAnh: '',
    chieuCao: undefined,
    canNang: undefined,
    nhomMau: '',
    benhNen: '',
    diUng: '',
    thuocDangDung: '',
    tinhTrangMangThai: false,
    ngayKhamGanNhat: ''
  });

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
    
    try {
      await createKhachHang(formData);
      showSuccess('Tạo khách hàng thành công');
      window.close();
    } catch (error) {
      showError('Lỗi khi tạo khách hàng');
    }
  };

  return (
    <>
      <Breadcrumb pageName="Tạo khách hàng mới" />

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Thông tin khách hàng
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
                    Email <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-2.5 block text-black dark:text-white">
                    Mật khẩu <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="password"
                    name="matKhau"
                    value={formData.matKhau}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
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
              </div>

              {/* Thông tin sức khỏe */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-black dark:text-white">Thông tin sức khỏe</h4>
                
                <div>
                  <label className="mb-2.5 block text-black dark:text-white">
                    Chiều cao (cm)
                  </label>
                  <input
                    type="number"
                    name="chieuCao"
                    value={formData.chieuCao || ''}
                    onChange={handleInputChange}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-2.5 block text-black dark:text-white">
                    Cân nặng (kg)
                  </label>
                  <input
                    type="number"
                    name="canNang"
                    value={formData.canNang || ''}
                    onChange={handleInputChange}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-2.5 block text-black dark:text-white">
                    Nhóm máu
                  </label>
                  <select
                    name="nhomMau"
                    value={formData.nhomMau}
                    onChange={handleInputChange}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  >
                    <option value="">Chọn nhóm máu</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2.5 block text-black dark:text-white">
                    Bệnh nền
                  </label>
                  <textarea
                    name="benhNen"
                    value={formData.benhNen}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-2.5 block text-black dark:text-white">
                    Dị ứng
                  </label>
                  <textarea
                    name="diUng"
                    value={formData.diUng}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-2.5 block text-black dark:text-white">
                    Thuốc đang dùng
                  </label>
                  <textarea
                    name="thuocDangDung"
                    value={formData.thuocDangDung}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-2.5 block text-black dark:text-white">
                    Ngày khám gần nhất
                  </label>
                  <input
                    type="date"
                    name="ngayKhamGanNhat"
                    value={formData.ngayKhamGanNhat}
                    onChange={handleInputChange}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="tinhTrangMangThai"
                    checked={formData.tinhTrangMangThai}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <label className="text-black dark:text-white">
                    Tình trạng mang thai
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
                disabled={loading}
                className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-center font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
              >
                {loading ? 'Đang tạo...' : 'Tạo khách hàng'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default KhachHangCreatePage;