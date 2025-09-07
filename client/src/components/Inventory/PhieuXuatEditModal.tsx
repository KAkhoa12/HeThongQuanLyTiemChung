import React, { useState, useEffect } from 'react';
import { useUpdatePhieuXuat, useLocations, usePhieuXuat } from '../../hooks';
import { PhieuXuatUpdateDto, ChiTietXuatDto } from '../../services/phieuXuat.service';
import { LocationDto } from '../../services/location.service';

interface PhieuXuatEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  phieuXuatId: string;
}

const PhieuXuatEditModal: React.FC<PhieuXuatEditModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  phieuXuatId
}) => {
  const [formData, setFormData] = useState<PhieuXuatUpdateDto & { maDiaDiemXuat: string; maDiaDiemNhap: string }>({
    maDiaDiemXuat: '',
    maDiaDiemNhap: '',
    ngayXuat: new Date().toISOString().split('T')[0],
    loaiXuat: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: diaDiems, execute: fetchDiaDiems } = useLocations();
  const { data: phieuXuatDetail, execute: fetchPhieuXuatDetail } = usePhieuXuat(null);
  const { execute: updatePhieuXuat, loading } = useUpdatePhieuXuat();

  useEffect(() => {
    if (isOpen && phieuXuatId) {
      fetchDiaDiems({ page: 1, pageSize: 1000 });
      fetchPhieuXuatDetail(phieuXuatId);
    }
  }, [isOpen, phieuXuatId]);

  useEffect(() => {
    if (phieuXuatDetail) {
      setFormData({
        maDiaDiemXuat: phieuXuatDetail.maDiaDiemXuat || '',
        maDiaDiemNhap: phieuXuatDetail.maDiaDiemNhap || '',
        ngayXuat: phieuXuatDetail.ngayXuat ? phieuXuatDetail.ngayXuat.split('T')[0] : new Date().toISOString().split('T')[0],
        loaiXuat: phieuXuatDetail.loaiXuat || ''
      });
    }
  }, [phieuXuatDetail]);

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        maDiaDiemXuat: '',
        maDiaDiemNhap: '',
        ngayXuat: new Date().toISOString().split('T')[0],
        loaiXuat: ''
      });
      setErrors({});
    }
  }, [isOpen]);

  const handleInputChange = (field: keyof (PhieuXuatUpdateDto & { maDiaDiemXuat: string; maDiaDiemNhap: string }), value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.maDiaDiemXuat) {
      newErrors.maDiaDiemXuat = 'Địa điểm xuất là bắt buộc';
    }

    if (!formData.maDiaDiemNhap) {
      newErrors.maDiaDiemNhap = 'Địa điểm nhập là bắt buộc';
    }

    if (!formData.ngayXuat) {
      newErrors.ngayXuat = 'Ngày xuất là bắt buộc';
    }

    if (!formData.loaiXuat) {
      newErrors.loaiXuat = 'Loại xuất là bắt buộc';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const submitData: PhieuXuatUpdateDto = {
        maDiaDiemXuat: formData.maDiaDiemXuat,
        maDiaDiemNhap: formData.maDiaDiemNhap,
        ngayXuat: formData.ngayXuat,
        loaiXuat: formData.loaiXuat
      };

      await updatePhieuXuat({ id: phieuXuatId, data: submitData });
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error updating phiếu xuất:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl relative">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              Chỉnh sửa Phiếu Xuất
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Thông tin cơ bản */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Địa điểm xuất *
                </label>
                <select
                  value={formData.maDiaDiemXuat}
                  onChange={(e) => handleInputChange('maDiaDiemXuat', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.maDiaDiemXuat ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Chọn địa điểm xuất</option>
                  {diaDiems?.data?.map((diaDiem: LocationDto) => (
                    <option key={diaDiem.id} value={diaDiem.id}>
                      {diaDiem.name}
                    </option>
                  ))}
                </select>
                {errors.maDiaDiemXuat && (
                  <p className="text-red-500 text-sm mt-1">{errors.maDiaDiemXuat}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Địa điểm nhập *
                </label>
                <select
                  value={formData.maDiaDiemNhap}
                  onChange={(e) => handleInputChange('maDiaDiemNhap', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.maDiaDiemNhap ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Chọn địa điểm nhập</option>
                  {diaDiems?.data?.map((diaDiem: LocationDto) => (
                    <option key={diaDiem.id} value={diaDiem.id}>
                      {diaDiem.name}
                    </option>
                  ))}
                </select>
                {errors.maDiaDiemNhap && (
                  <p className="text-red-500 text-sm mt-1">{errors.maDiaDiemNhap}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ngày xuất *
                </label>
                <input
                  type="date"
                  value={formData.ngayXuat}
                  onChange={(e) => handleInputChange('ngayXuat', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.ngayXuat ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.ngayXuat && (
                  <p className="text-red-500 text-sm mt-1">{errors.ngayXuat}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loại xuất *
                </label>
                <select
                  value={formData.loaiXuat}
                  onChange={(e) => handleInputChange('loaiXuat', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.loaiXuat ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Chọn loại xuất</option>
                  <option value="Chuyển kho">Chuyển kho</option>
                  <option value="Bán hàng">Bán hàng</option>
                  <option value="Thanh lý">Thanh lý</option>
                  <option value="Khác">Khác</option>
                </select>
                {errors.loaiXuat && (
                  <p className="text-red-500 text-sm mt-1">{errors.loaiXuat}</p>
                )}
              </div>
            </div>

            {/* Chi tiết xuất - Read only for editing */}
            {phieuXuatDetail?.chiTietXuats && phieuXuatDetail.chiTietXuats.length > 0 && (
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">
                  Chi tiết xuất (Chỉ xem)
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full table-auto">
                    <thead>
                      <tr className="bg-gray-2 text-left dark:bg-meta-4">
                        <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                          Mã chi tiết
                        </th>
                        <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                          Số lô
                        </th>
                        <th className="min-w-[200px] py-4 px-4 font-medium text-black dark:text-white">
                          Tên vaccine
                        </th>
                        <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                          Số lượng
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {phieuXuatDetail.chiTietXuats.map((chiTiet: ChiTietXuatDto, index: number) => (
                        <tr key={chiTiet.maChiTietXuat} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-1 dark:bg-meta-4'}>
                          <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                            <p className="text-black dark:text-white">
                              {chiTiet.maChiTietXuat}
                            </p>
                          </td>
                          <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                            <p className="text-black dark:text-white">
                              {chiTiet.soLo || '-'}
                            </p>
                          </td>
                          <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                            <p className="text-black dark:text-white">
                              {chiTiet.tenVaccine || '-'}
                            </p>
                          </td>
                          <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                            <p className="text-black dark:text-white">
                              {chiTiet.soLuong || 0}
                            </p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Lưu ý */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <i className="ri-information-line text-yellow-400"></i>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Lưu ý
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>Chỉ có thể chỉnh sửa phiếu xuất khi trạng thái là "Chờ xác nhận".</p>
                    <p>Chi tiết xuất không thể chỉnh sửa sau khi tạo.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50"
              >
                {loading ? 'Đang cập nhật...' : 'Cập nhật phiếu xuất'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PhieuXuatEditModal;