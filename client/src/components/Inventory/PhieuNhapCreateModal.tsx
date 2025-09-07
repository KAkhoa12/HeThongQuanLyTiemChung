import React, { useState, useEffect } from 'react';
import { useCreatePhieuNhap, useNhaCungCaps, useAuth, useVaccines, useLocations } from '../../hooks';
import { PhieuNhapCreateDto, ChiTietNhapCreateDto } from '../../services/phieuNhap.service';
import { LoVaccineCreateDto, loVaccineService } from '../../services/loVaccine.service';
import { LocationDto } from '../../services/location.service';

interface PhieuNhapCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const PhieuNhapCreateModal: React.FC<PhieuNhapCreateModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [formData, setFormData] = useState<PhieuNhapCreateDto & { maDiaDiem: string }>({
    maNhaCungCap: '',
    maQuanLy: '',
    maDiaDiem: '',
    ngayNhap: new Date().toISOString().split('T')[0],
    chiTietNhaps: []
  });

  // Function to generate random lot number
  const generateRandomLotNumber = () => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const hour = String(now.getHours()).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');
    const randomNumber = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    
    return `${day}_${month}_${year}_${hour}_${minute}_${randomNumber}`;
  };

  const [chiTietNhaps, setChiTietNhaps] = useState<(ChiTietNhapCreateDto & {
    // Thông tin để tạo lô vaccine
    maVaccine: string;
    soLo: string;
    ngaySanXuat: string;
    ngayHetHan: string;
    giaNhap: number; // Keep giaNhap for UI, will convert to gia when submitting
  })[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { user } = useAuth();
  const { data: nhaCungCaps, execute: fetchNhaCungCaps } = useNhaCungCaps();
  const { data: vaccines, execute: fetchVaccines } = useVaccines();
  const { data: diaDiems, execute: fetchDiaDiems } = useLocations();
  const { execute: createPhieuNhap, loading } = useCreatePhieuNhap();

  useEffect(() => {
    if (isOpen) {
      // Fetch data when modal opens
      fetchNhaCungCaps({ page: 1, pageSize: 1000 });
      fetchVaccines({ page: 1, pageSize: 1000 });
      fetchDiaDiems({ page: 1, pageSize: 1000 });
      
      // Set current user as manager
      if (user?.maNguoiDung) {
        setFormData(prev => ({
          ...prev,
          maQuanLy: user.maNguoiDung
        }));
      }
    } else {
      setFormData({
        maNhaCungCap: '',
        maQuanLy: user?.maNguoiDung || '',
        maDiaDiem: '',
        ngayNhap: new Date().toISOString().split('T')[0],
        chiTietNhaps: []
      });
      setChiTietNhaps([]);
      setErrors({});
    }
  }, [isOpen, user]);

  const handleInputChange = (field: keyof (PhieuNhapCreateDto & { maDiaDiem: string }), value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const addChiTietNhap = () => {
    setChiTietNhaps(prev => [...prev, { 
      maLo: '', 
      soLuong: 0, 
      gia: 0,
      giaNhap: 0,
      maVaccine: '',
      soLo: '',
      ngaySanXuat: '',
      ngayHetHan: ''
    }]);
  };

  const removeChiTietNhap = (index: number) => {
    setChiTietNhaps(prev => prev.filter((_, i) => i !== index));
  };

  const updateChiTietNhap = (index: number, field: string, value: any) => {
    setChiTietNhaps(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.maNhaCungCap) {
      newErrors.maNhaCungCap = 'Nhà cung cấp là bắt buộc';
    }

    if (!formData.maQuanLy) {
      newErrors.maQuanLy = 'Quản lý là bắt buộc';
    }

    if (!formData.maDiaDiem) {
      newErrors.maDiaDiem = 'Địa điểm là bắt buộc';
    }

    if (!formData.ngayNhap) {
      newErrors.ngayNhap = 'Ngày nhập là bắt buộc';
    }

    if (chiTietNhaps.length === 0) {
      newErrors.chiTietNhaps = 'Phải có ít nhất một chi tiết nhập';
    }

    chiTietNhaps.forEach((chiTiet, index) => {
      if (!chiTiet.maVaccine) {
        newErrors[`chiTiet_${index}_maVaccine`] = 'Vaccine là bắt buộc';
      }
      if (!chiTiet.soLo) {
        newErrors[`chiTiet_${index}_soLo`] = 'Số lô là bắt buộc';
      }
      if (!chiTiet.ngaySanXuat) {
        newErrors[`chiTiet_${index}_ngaySanXuat`] = 'Ngày sản xuất là bắt buộc';
      }
      if (!chiTiet.ngayHetHan) {
        newErrors[`chiTiet_${index}_ngayHetHan`] = 'Ngày hết hạn là bắt buộc';
      }
      if (chiTiet.soLuong <= 0) {
        newErrors[`chiTiet_${index}_soLuong`] = 'Số lượng phải lớn hơn 0';
      }
      if (chiTiet.giaNhap <= 0) {
        newErrors[`chiTiet_${index}_giaNhap`] = 'Giá nhập phải lớn hơn 0';
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
      // Tạo lô vaccine cho mỗi chi tiết nhập
      const chiTietNhapsWithMaLo = [];
      
      for (const chiTiet of chiTietNhaps) {
        // Tạo lô vaccine mới
        const loVaccineData: LoVaccineCreateDto = {
          maVaccine: chiTiet.maVaccine,
          maNhaCungCap: formData.maNhaCungCap!,
          soLo: chiTiet.soLo,
          ngaySanXuat: chiTiet.ngaySanXuat,
          ngayHetHan: chiTiet.ngayHetHan,
          soLuongNhap: chiTiet.soLuong,
          giaNhap: chiTiet.giaNhap
        };

        const loVaccineResult = await loVaccineService.create(loVaccineData);
        
        // Thêm chi tiết nhập với mã lô đã tạo
        if (loVaccineResult && loVaccineResult.maLo) {
          chiTietNhapsWithMaLo.push({
            maLo: loVaccineResult.maLo,
            soLuong: chiTiet.soLuong,
            gia: chiTiet.giaNhap
          });
        }
      }

      // Tạo phiếu nhập với chi tiết đã có mã lô
      const submitData = {
        ...formData,
        chiTietNhaps: chiTietNhapsWithMaLo
      };

      await createPhieuNhap(submitData);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating phiếu nhập:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-[95vh] max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl relative">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              Thêm Phiếu Nhập Mới
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
                  Nhà cung cấp *
                </label>
                <select
                  value={formData.maNhaCungCap}
                  onChange={(e) => handleInputChange('maNhaCungCap', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.maNhaCungCap ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Chọn nhà cung cấp</option>
                  {nhaCungCaps?.data?.map((nhaCungCap) => (
                    <option key={nhaCungCap.maNhaCungCap} value={nhaCungCap.maNhaCungCap}>
                      {nhaCungCap.ten}
                    </option>
                  ))}
                </select>
                {errors.maNhaCungCap && (
                  <p className="text-red-500 text-sm mt-1">{errors.maNhaCungCap}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quản lý *
                </label>
                <input
                  type="text"
                  value={user?.ten || user?.email || 'Đang tải...'}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600"
                />
                <input
                  type="hidden"
                  value={formData.maQuanLy}
                />
                {errors.maQuanLy && (
                  <p className="text-red-500 text-sm mt-1">{errors.maQuanLy}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Địa điểm nhập kho *
                </label>
                <select
                  value={formData.maDiaDiem}
                  onChange={(e) => handleInputChange('maDiaDiem', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.maDiaDiem ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Chọn địa điểm</option>
                  {diaDiems?.data?.map((diaDiem: LocationDto) => (
                    <option key={diaDiem.id} value={diaDiem.id}>
                      {diaDiem.name}
                    </option>
                  ))}
                </select>
                {errors.maDiaDiem && (
                  <p className="text-red-500 text-sm mt-1">{errors.maDiaDiem}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ngày nhập *
                </label>
                <input
                  type="text"
                  value={formData.ngayNhap ? new Date(formData.ngayNhap).toLocaleDateString('vi-VN') : ''}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600"
                />
              </div>
            </div>

            {/* Chi tiết nhập */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-medium text-gray-900">
                  Chi tiết nhập
                </h4>
                <button
                  type="button"
                  onClick={addChiTietNhap}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                >
                  Thêm chi tiết
                </button>
              </div>

              {errors.chiTietNhaps && (
                <p className="text-red-500 text-sm mb-4">{errors.chiTietNhaps}</p>
              )}

              <div className="space-y-4">
                {chiTietNhaps.map((chiTiet, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h5 className="font-medium text-gray-900">
                        Chi tiết #{index + 1}
                      </h5>
                      <button
                        type="button"
                        onClick={() => removeChiTietNhap(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Xóa
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Vaccine *
                        </label>
                        <select
                          value={chiTiet.maVaccine}
                          onChange={(e) => updateChiTietNhap(index, 'maVaccine', e.target.value)}
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                            errors[`chiTiet_${index}_maVaccine`] ? 'border-red-500' : 'border-gray-300'
                          }`}
                        >
                          <option value="">Chọn vaccine</option>
                          {vaccines?.data?.map((vaccine) => (
                            <option key={vaccine.maVaccine} value={vaccine.maVaccine}>
                              {vaccine.ten}
                            </option>
                          ))}
                        </select>
                        {errors[`chiTiet_${index}_maVaccine`] && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors[`chiTiet_${index}_maVaccine`]}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Số lô *
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={chiTiet.soLo}
                            onChange={(e) => updateChiTietNhap(index, 'soLo', e.target.value)}
                            placeholder="Nhập số lô"
                            className={`flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                              errors[`chiTiet_${index}_soLo`] ? 'border-red-500' : 'border-gray-300'
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => updateChiTietNhap(index, 'soLo', generateRandomLotNumber())}
                            className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
                          >
                            Random
                          </button>
                        </div>
                        {errors[`chiTiet_${index}_soLo`] && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors[`chiTiet_${index}_soLo`]}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Ngày sản xuất *
                        </label>
                        <input
                          type="date"
                          value={chiTiet.ngaySanXuat}
                          onChange={(e) => updateChiTietNhap(index, 'ngaySanXuat', e.target.value)}
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                            errors[`chiTiet_${index}_ngaySanXuat`] ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {errors[`chiTiet_${index}_ngaySanXuat`] && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors[`chiTiet_${index}_ngaySanXuat`]}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Ngày hết hạn *
                        </label>
                        <input
                          type="date"
                          value={chiTiet.ngayHetHan}
                          onChange={(e) => updateChiTietNhap(index, 'ngayHetHan', e.target.value)}
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                            errors[`chiTiet_${index}_ngayHetHan`] ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {errors[`chiTiet_${index}_ngayHetHan`] && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors[`chiTiet_${index}_ngayHetHan`]}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Số lượng *
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={chiTiet.soLuong}
                          onChange={(e) => updateChiTietNhap(index, 'soLuong', parseInt(e.target.value) || 0)}
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

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Giá nhập (VNĐ) *
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="1000"
                          value={chiTiet.giaNhap}
                          onChange={(e) => updateChiTietNhap(index, 'giaNhap', parseFloat(e.target.value) || 0)}
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                            errors[`chiTiet_${index}_giaNhap`] ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {errors[`chiTiet_${index}_giaNhap`] && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors[`chiTiet_${index}_giaNhap`]}
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
                {loading ? 'Đang tạo...' : 'Tạo phiếu nhập'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PhieuNhapCreateModal;