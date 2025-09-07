import React, { useState, useEffect } from 'react';
import { useCreatePhieuXuat, useLocations, useTonKhoLos, useAuth, useLoVaccines } from '../../hooks';
import { PhieuXuatCreateDto, ChiTietXuatCreateDto } from '../../services/phieuXuat.service';
import { useToast } from '../../hooks/useToast';

interface PhieuXuatCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const PhieuXuatCreateModal: React.FC<PhieuXuatCreateModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [formData, setFormData] = useState<PhieuXuatCreateDto>({
    maDiaDiemXuat: '',
    maDiaDiemNhap: '',
    maQuanLy: '',
    ngayXuat: new Date().toISOString().split('T')[0],
    loaiXuat: '',
    chiTietXuats: []
  });

  const [chiTietXuats, setChiTietXuats] = useState<ChiTietXuatCreateDto[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: locations, execute: fetchLocations } = useLocations();
  const { data: tonKhoData, execute: fetchTonKho } = useTonKhoLos();
  const { data: loVaccines, execute: fetchLoVaccines } = useLoVaccines({ page: 1, pageSize: 1000 });
  const { user } = useAuth();
  const { execute: createPhieuXuat, loading } = useCreatePhieuXuat();
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    if (isOpen) {
      fetchLocations({ page: 1, pageSize: 1000 });
      fetchLoVaccines();
      fetchTonKho({ page: 1, pageSize: 1000 });
    }
  }, [isOpen, fetchLocations, fetchLoVaccines, fetchTonKho]);

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        maDiaDiemXuat: '',
        maDiaDiemNhap: '',
        maQuanLy: user?.maNguoiDung || '',
        ngayXuat: new Date().toISOString().split('T')[0],
        loaiXuat: '',
        chiTietXuats: []
      });
      setChiTietXuats([]);
      setErrors({});
    }
  }, [isOpen, user]);

  const handleInputChange = (field: keyof PhieuXuatCreateDto, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const addChiTietXuat = () => {
    setChiTietXuats(prev => [...prev, { maLo: '', soLuong: 0 }]);
  };

  const removeChiTietXuat = (index: number) => {
    setChiTietXuats(prev => prev.filter((_, i) => i !== index));
  };

  const updateChiTietXuat = (index: number, field: keyof ChiTietXuatCreateDto, value: any) => {
    setChiTietXuats(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  };
  console.log(loVaccines?.data);
  console.log(tonKhoData?.data);
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.maDiaDiemXuat) {
      newErrors.maDiaDiemXuat = 'Địa điểm xuất là bắt buộc';
    }

    if (!formData.maDiaDiemNhap) {
      newErrors.maDiaDiemNhap = 'Địa điểm nhập là bắt buộc';
    }

    // Kiểm tra địa điểm xuất và nhập không được giống nhau
    if (formData.maDiaDiemXuat && formData.maDiaDiemNhap && 
        formData.maDiaDiemXuat === formData.maDiaDiemNhap) {
      newErrors.maDiaDiemNhap = 'Địa điểm nhập không được giống địa điểm xuất';
    }

    // maQuanLy sẽ tự động được set từ user hiện tại

    if (!formData.ngayXuat) {
      newErrors.ngayXuat = 'Ngày xuất là bắt buộc';
    }

    if (!formData.loaiXuat) {
      newErrors.loaiXuat = 'Loại xuất là bắt buộc';
    }

    if (chiTietXuats.length === 0) {
      newErrors.chiTietXuats = 'Phải có ít nhất một chi tiết xuất';
    }

    chiTietXuats.forEach((chiTiet, index) => {
      if (!chiTiet.maLo) {
        newErrors[`chiTiet_${index}_maLo`] = 'Lô vaccine là bắt buộc';
      }
      if (chiTiet.soLuong <= 0) {
        newErrors[`chiTiet_${index}_soLuong`] = 'Số lượng phải lớn hơn 0';
      }

      // Kiểm tra số lượng tồn kho
      const tonKho = tonKhoData?.data?.find(tk => 
        tk.maLo === chiTiet.maLo && tk.maDiaDiem === formData.maDiaDiemXuat
      );
      if (tonKho && (tonKho.soLuong || 0) < chiTiet.soLuong) {
        newErrors[`chiTiet_${index}_soLuong`] = `Số lượng tồn kho không đủ (còn ${tonKho.soLuong})`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const submitData = {
        ...formData,
        maQuanLy: user?.maNguoiDung || '',
        chiTietXuats
      };

      await createPhieuXuat(submitData);
      showSuccess('Thành công', 'Tạo phiếu xuất thành công!');
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error creating phiếu xuất:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Có lỗi xảy ra khi tạo phiếu xuất';
      showError('Lỗi', errorMessage);
      // Không đóng modal khi có lỗi
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute  inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-[95%] max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl relative">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              Thêm Phiếu Xuất Mới
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
                  {locations?.data?.map((location) => (
                    <option key={location.id} value={location.id}>
                      {location.name}
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
                  {locations?.data?.map((location) => (
                    <option key={location.id} value={location.id}>
                      {location.name}
                    </option>
                  ))}
                </select>
                {errors.maDiaDiemNhap && (
                  <p className="text-red-500 text-sm mt-1">{errors.maDiaDiemNhap}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quản lý
                </label>
                <input
                  type="text"
                  value={user?.ten || user?.email || 'Người dùng hiện tại'}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
                />
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
                  <option value="Sử dụng nội bộ">Sử dụng nội bộ</option>
                  <option value="Khác">Khác</option>
                </select>
                {errors.loaiXuat && (
                  <p className="text-red-500 text-sm mt-1">{errors.loaiXuat}</p>
                )}
              </div>
            </div>

            {/* Chi tiết xuất */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-medium text-gray-900">
                  Chi tiết xuất
                </h4>
                <button
                  type="button"
                  onClick={addChiTietXuat}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                >
                  Thêm chi tiết
                </button>
              </div>

              {errors.chiTietXuats && (
                <p className="text-red-500 text-sm mb-4">{errors.chiTietXuats}</p>
              )}

              <div className="space-y-4">
                {chiTietXuats.map((chiTiet, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h5 className="font-medium text-gray-900">
                        Chi tiết #{index + 1}
                      </h5>
                      <button
                        type="button"
                        onClick={() => removeChiTietXuat(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Xóa
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Lô vaccine *
                        </label>
                        <select
                          value={chiTiet.maLo}
                          onChange={(e) => updateChiTietXuat(index, 'maLo', e.target.value)}
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                            errors[`chiTiet_${index}_maLo`] ? 'border-red-500' : 'border-gray-300'
                          }`}
                        >
                          <option value="">Chọn lô vaccine</option>
                          {tonKhoData?.data?.filter(tk => 
                            tk.maDiaDiem === formData.maDiaDiemXuat && (tk.soLuong || 0) > 0
                          ).map((tonKho) => {
                            const loVaccine = loVaccines?.data?.find(lv => lv.maLo === tonKho.maLo);
                            return (
                              <option key={tonKho.maLo} value={tonKho.maLo}>
                                {loVaccine?.soLo || tonKho.soLo} - {tonKho.tenVaccine} (Tồn: {tonKho.soLuong})
                              </option>
                            );
                          })}
                        </select>
                        {errors[`chiTiet_${index}_maLo`] && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors[`chiTiet_${index}_maLo`]}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Số lượng *
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={chiTiet.soLuong}
                          onChange={(e) => updateChiTietXuat(index, 'soLuong', parseInt(e.target.value) || 0)}
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                            errors[`chiTiet_${index}_soLuong`] ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {errors[`chiTiet_${index}_soLuong`] && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors[`chiTiet_${index}_soLuong`]}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
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
                {loading ? 'Đang tạo...' : 'Tạo phiếu xuất'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PhieuXuatCreateModal;