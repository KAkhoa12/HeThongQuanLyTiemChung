import React, { useState, useEffect } from 'react';
import { useUpdatePhieuNhap, useNhaCungCaps, useAuth, useLocations, usePhieuNhap } from '../../hooks';
import { PhieuNhapUpdateDto, ChiTietNhapCreateDto, ChiTietNhapDto } from '../../services/phieuNhap.service';
import { LocationDto } from '../../services/location.service';
import { loVaccineService } from '../../services/loVaccine.service';

interface PhieuNhapEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  phieuNhapId: string;
}

const PhieuNhapEditModal: React.FC<PhieuNhapEditModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  phieuNhapId
}) => {
  const [formData, setFormData] = useState<PhieuNhapUpdateDto & { maDiaDiem: string }>({
    maNhaCungCap: '',
    maQuanLy: '',
    maDiaDiem: '',
    ngayNhap: new Date().toISOString().split('T')[0]
  });

  const [chiTietNhaps, setChiTietNhaps] = useState<(ChiTietNhapCreateDto & {
    // Thông tin để tạo lô vaccine
    maVaccine: string;
    soLo: string;
    ngaySanXuat: string;
    ngayHetHan: string;
    giaNhap: number; // Keep giaNhap for UI, will convert to gia when submitting
    tenVaccine?: string;
  })[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { user } = useAuth();
  const { data: nhaCungCaps, execute: fetchNhaCungCaps } = useNhaCungCaps();
  const { data: diaDiems, execute: fetchDiaDiems } = useLocations();
  const { data: phieuNhapDetail, execute: fetchPhieuNhapDetail } = usePhieuNhap();
  const { execute: updatePhieuNhap, loading } = useUpdatePhieuNhap();


  useEffect(() => {
    if (isOpen && phieuNhapId) {
      // Fetch data when modal opens
      fetchNhaCungCaps({ page: 1, pageSize: 1000 });
      fetchDiaDiems({ page: 1, pageSize: 1000 });
      fetchPhieuNhapDetail(phieuNhapId);
    }
  }, [isOpen, phieuNhapId]);

  useEffect(() => {
    if (phieuNhapDetail) {
      
      // Populate form with existing data
      const formDataToSet = {
        maNhaCungCap: phieuNhapDetail.maNhaCungCap || '',
        maQuanLy: phieuNhapDetail.maQuanLy || '',
        maDiaDiem: '', // Will be populated from location data
        ngayNhap: phieuNhapDetail.ngayNhap ? phieuNhapDetail.ngayNhap.split('T')[0] : new Date().toISOString().split('T')[0]
      };
      
      setFormData(formDataToSet);

      // Convert chiTietNhaps to the format needed for editing
      if (phieuNhapDetail.chiTietNhaps) {
        const convertedChiTietNhaps = phieuNhapDetail.chiTietNhaps.map((ct: ChiTietNhapDto) => ({
          maLo: ct.maLo,
          soLuong: ct.soLuong || 0,
          gia: ct.gia || 0,
          giaNhap: ct.gia || 0,
          maVaccine: '', // Will be populated from LoVaccine
          soLo: ct.soLo || '',
          ngaySanXuat: '', // Will be populated from LoVaccine
          ngayHetHan: '', // Will be populated from LoVaccine
          tenVaccine: ct.tenVaccine || ''
        }));
        setChiTietNhaps(convertedChiTietNhaps);

        // Fetch LoVaccine details for each chiTietNhap
        phieuNhapDetail.chiTietNhaps.forEach(async (ct: ChiTietNhapDto) => {
          if (ct.maLo) {
            try {
              const loVaccineDetail = await loVaccineService.getById(ct.maLo);

              // Update chiTietNhaps with the fetched LoVaccine data
              setChiTietNhaps(prev => prev.map(chiTiet => {
                if (chiTiet.maLo === ct.maLo) {
                  return {
                    ...chiTiet,
                    maVaccine: loVaccineDetail.maVaccine || '',
                    soLo: loVaccineDetail.soLo || chiTiet.soLo,
                    ngaySanXuat: loVaccineDetail.ngaySanXuat || '',
                    ngayHetHan: loVaccineDetail.ngayHetHan || '',
                    tenVaccine: loVaccineDetail.tenVaccine || chiTiet.tenVaccine
                  };
                }
                return chiTiet;
              }));
            } catch (error) {
              console.error('Error fetching LoVaccine detail:', error);
            }
          }
        });
      }
    }
  }, [phieuNhapDetail]);


  // Update location when both phieuNhapDetail and diaDiems are loaded
  useEffect(() => {
    if (phieuNhapDetail && diaDiems?.data) {
      const location = diaDiems.data.find((loc: LocationDto) => loc.name === phieuNhapDetail.tenDiaDiem);
      if (location) {
        setFormData(prev => ({
          ...prev,
          maDiaDiem: location.id
        }));
      }
    }
  }, [phieuNhapDetail, diaDiems]);

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        maNhaCungCap: '',
        maQuanLy: user?.maNguoiDung || '',
        maDiaDiem: '',
        ngayNhap: new Date().toISOString().split('T')[0]
      });
      setChiTietNhaps([]);
      setErrors({});
    }
  }, [isOpen, user]);

  const handleInputChange = (field: keyof (PhieuNhapUpdateDto & { maDiaDiem: string }), value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
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
      // For editing, we only update the basic information
      // Chi tiết nhập changes would require more complex logic
      const submitData: PhieuNhapUpdateDto = {
        maNhaCungCap: formData.maNhaCungCap,
        maQuanLy: formData.maQuanLy,
        ngayNhap: formData.ngayNhap
      };

      await updatePhieuNhap({ id: phieuNhapId, data: submitData });
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error updating phiếu nhập:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl relative">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              Chỉnh sửa Phiếu Nhập
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
                  type="date"
                  value={formData.ngayNhap}
                  onChange={(e) => {
                    console.log('Date input changed:', e.target.value);
                    handleInputChange('ngayNhap', e.target.value);
                  }}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.ngayNhap ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
            </div>

            {/* Chi tiết nhập - Read only for editing */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-medium text-gray-900">
                  Chi tiết nhập (Chỉ xem)
                </h4>
              </div>

              <div className="space-y-4">
                {chiTietNhaps.map((chiTiet, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-center mb-4">
                      <h5 className="font-medium text-gray-900">
                        Chi tiết #{index + 1}
                      </h5>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Vaccine
                        </label>
                        <input
                          type="text"
                          value={chiTiet.tenVaccine || chiTiet.maVaccine}
                          disabled
                          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Số lô
                        </label>
                        <input
                          type="text"
                          value={chiTiet.soLo}
                          disabled
                          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Ngày sản xuất
                        </label>
                        <input
                          type="text"
                          value={chiTiet.ngaySanXuat ? new Date(chiTiet.ngaySanXuat).toLocaleDateString('vi-VN') : ''}
                          disabled
                          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Ngày hết hạn
                        </label>
                        <input
                          type="text"
                          value={chiTiet.ngayHetHan ? new Date(chiTiet.ngayHetHan).toLocaleDateString('vi-VN') : ''}
                          disabled
                          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Số lượng
                        </label>
                        <input
                          type="number"
                          value={chiTiet.soLuong}
                          disabled
                          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Giá nhập (VNĐ)
                        </label>
                        <input
                          type="number"
                          value={chiTiet.giaNhap}
                          disabled
                          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600"
                        />
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
                {loading ? 'Đang cập nhật...' : 'Cập nhật phiếu nhập'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PhieuNhapEditModal;