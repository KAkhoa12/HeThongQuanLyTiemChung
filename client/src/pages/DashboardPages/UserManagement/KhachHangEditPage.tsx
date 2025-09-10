import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useKhachHang, useUpdateKhachHang } from '../../../hooks/useKhachHang';
import { useToast } from '../../../hooks/useToast';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import { UpdateKhachHangDto } from '../../../services/khachHang.service';

const KhachHangEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const { showSuccess, showError } = useToast();
  const { data: khachHang, loading: loadingKhachHang, execute: fetchKhachHang } = useKhachHang(id || '');
  const { execute: updateKhachHang, loading: updating } = useUpdateKhachHang();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<UpdateKhachHangDto>({
    ten: '',
    soDienThoai: '',
    ngaySinh: '',
    diaChi: '',
    gioiTinh: '',
    maAnh: '',
    isActive: true,
    chieuCao: undefined,
    canNang: undefined,
    nhomMau: '',
    benhNen: '',
    diUng: '',
    thuocDangDung: '',
    tinhTrangMangThai: false,
    ngayKhamGanNhat: ''
  });

  useEffect(() => {
    if (id) {
      fetchKhachHang({ id });
    }
  }, [id]);

  useEffect(() => {
    if (khachHang) {
      setFormData({
        ten: khachHang.ten,
        soDienThoai: khachHang.soDienThoai || '',
        ngaySinh: khachHang.ngaySinh || '',
        diaChi: khachHang.diaChi || '',
        gioiTinh: khachHang.gioiTinh || '',
        maAnh: khachHang.maAnh || '',
        isActive: khachHang.isActive ?? true,
        chieuCao: khachHang.thongTinNguoiDung?.chieuCao,
        canNang: khachHang.thongTinNguoiDung?.canNang,
        nhomMau: khachHang.thongTinNguoiDung?.nhomMau || '',
        benhNen: khachHang.thongTinNguoiDung?.benhNen || '',
        diUng: khachHang.thongTinNguoiDung?.diUng || '',
        thuocDangDung: khachHang.thongTinNguoiDung?.thuocDangDung || '',
        tinhTrangMangThai: khachHang.thongTinNguoiDung?.tinhTrangMangThai ?? false,
        ngayKhamGanNhat: khachHang.thongTinNguoiDung?.ngayKhamGanNhat || ''
      });
    }
  }, [khachHang]);

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
      await updateKhachHang({ id, data: formData });
      showSuccess('thành công', 'Cập nhật khách hàng thành công');
      navigate('/dashboard/nguoi-dung/khach-hang');
    } catch (error) {
      showError('Lỗi', 'Lỗi khi cập nhật khách hàng');
    }
  };

  if (loadingKhachHang) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!khachHang) {
    return (
      <div className="text-center py-8">
        <p className="text-bodydark2">Không tìm thấy thông tin khách hàng</p>
      </div>
    );
  }

  return (
    <div className='p-6'>
      <Breadcrumb pageName={`Chỉnh sửa khách hàng - ${khachHang.ten}`} />

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Chỉnh sửa thông tin khách hàng
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
                onClick={() => navigate('/dashboard/nguoi-dung/khach-hang')}
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

export default KhachHangEditPage;