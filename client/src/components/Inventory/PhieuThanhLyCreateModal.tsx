import React, { useState, useEffect } from 'react';
import { useCreatePhieuThanhLy, useLocations } from '../../hooks';
import { PhieuThanhLyCreateDto, ChiTietThanhLyCreateDto } from '../../services/phieuThanhLy.service';

interface PhieuThanhLyCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  selectedVaccines?: any[]; // Các lô vaccine đã được chọn từ ThanhLyPage
}

const PhieuThanhLyCreateModal: React.FC<PhieuThanhLyCreateModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  selectedVaccines = []
}) => {
  const [formData, setFormData] = useState<PhieuThanhLyCreateDto>({
    maDiaDiem: '',
    ngayThanhLy: new Date().toISOString().split('T')[0],
    chiTietThanhLies: []
  });

  const [chiTietThanhLies, setChiTietThanhLies] = useState<ChiTietThanhLyCreateDto[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: locations, execute: fetchLocations } = useLocations();
  const { execute: createPhieuThanhLy, loading } = useCreatePhieuThanhLy();

  useEffect(() => {
    if (isOpen) {
      // Fetch locations when modal opens
      fetchLocations({ page: 1, pageSize: 1000 });
      
      // Initialize chiTietThanhLies with selected vaccines
      if (selectedVaccines.length > 0) {
        const initialChiTiet = selectedVaccines.map(vaccine => ({
          maLo: vaccine.maLo,
          soLuong: 1, // Default quantity
          lyDo: ''
        }));
        setChiTietThanhLies(initialChiTiet);
      }
    } else {
      setFormData({
        maDiaDiem: '',
        ngayThanhLy: new Date().toISOString().split('T')[0],
        chiTietThanhLies: []
      });
      setChiTietThanhLies([]);
      setErrors({});
    }
  }, [isOpen, selectedVaccines]);

  const handleInputChange = (field: keyof PhieuThanhLyCreateDto, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };



  const updateChiTietThanhLy = (index: number, field: keyof ChiTietThanhLyCreateDto, value: any) => {
    setChiTietThanhLies(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.maDiaDiem) {
      newErrors.maDiaDiem = 'Địa điểm là bắt buộc';
    }

    if (!formData.ngayThanhLy) {
      newErrors.ngayThanhLy = 'Ngày thanh lý là bắt buộc';
    }

    if (chiTietThanhLies.length === 0) {
      newErrors.chiTietThanhLies = 'Phải có ít nhất một chi tiết thanh lý';
    }

    chiTietThanhLies.forEach((chiTiet, index) => {
      if (!chiTiet.maLo) {
        newErrors[`chiTiet_${index}_maLo`] = 'Lô vaccine là bắt buộc';
      }
      if (chiTiet.soLuong <= 0) {
        newErrors[`chiTiet_${index}_soLuong`] = 'Số lượng phải lớn hơn 0';
      }
      if (!chiTiet.lyDo?.trim()) {
        newErrors[`chiTiet_${index}_lyDo`] = 'Lý do thanh lý là bắt buộc';
      }

      // Kiểm tra số lượng hiện tại của lô vaccine
      const selectedVaccine = selectedVaccines.find(v => v.maLo === chiTiet.maLo);
      if (selectedVaccine && (selectedVaccine.soLuong || 0) < chiTiet.soLuong) {
        newErrors[`chiTiet_${index}_soLuong`] = `Số lượng hiện tại không đủ (còn ${selectedVaccine.soLuong})`;
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
        chiTietThanhLies
      };

      await createPhieuThanhLy(submitData);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating phiếu thanh lý:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              Thêm Phiếu Thanh Lý Mới
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
                  Địa điểm *
                </label>
                <select
                  value={formData.maDiaDiem}
                  onChange={(e) => handleInputChange('maDiaDiem', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.maDiaDiem ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Chọn địa điểm</option>
                  {locations?.data?.map((location) => (
                    <option key={location.id} value={location.id}>
                      {location.name}
                    </option>
                  ))}
                </select>
                {errors.maDiaDiem && (
                  <p className="text-red-500 text-sm mt-1">{errors.maDiaDiem}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ngày thanh lý *
                </label>
                <input
                  type="date"
                  value={formData.ngayThanhLy}
                  onChange={(e) => handleInputChange('ngayThanhLy', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.ngayThanhLy ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.ngayThanhLy && (
                  <p className="text-red-500 text-sm mt-1">{errors.ngayThanhLy}</p>
                )}
              </div>
            </div>

            {/* Chi tiết thanh lý */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-medium text-gray-900">
                  Chi tiết thanh lý ({chiTietThanhLies.length} lô vaccine)
                </h4>
              </div>

              {errors.chiTietThanhLies && (
                <p className="text-red-500 text-sm mb-4">{errors.chiTietThanhLies}</p>
              )}

              <div className="space-y-4">
                {chiTietThanhLies.map((chiTiet, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h5 className="font-medium text-gray-900">
                        Chi tiết #{index + 1}
                      </h5>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Lô vaccine *
                        </label>
                        <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600">
                          {(() => {
                            const selectedVaccine = selectedVaccines.find(v => v.maLo === chiTiet.maLo);
                            return selectedVaccine ? 
                              `${selectedVaccine.soLo} - ${selectedVaccine.tenVaccine}` : 
                              'Không tìm thấy thông tin lô vaccine';
                          })()}
                        </div>
                        <div className="mt-1 text-sm text-gray-500">
                          Số lượng hiện tại: {(() => {
                            const selectedVaccine = selectedVaccines.find(v => v.maLo === chiTiet.maLo);
                            return selectedVaccine?.soLuong || 0;
                          })()}
                        </div>
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
                          onChange={(e) => updateChiTietThanhLy(index, 'soLuong', parseInt(e.target.value) || 0)}
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
                          Lý do thanh lý *
                        </label>
                        <div className="space-y-2">
                          <select
                            value={chiTiet.lyDo}
                            onChange={(e) => updateChiTietThanhLy(index, 'lyDo', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                              errors[`chiTiet_${index}_lyDo`] ? 'border-red-500' : 'border-gray-300'
                            }`}
                          >
                            <option value="">Chọn lý do</option>
                            <option value="Hết hạn sử dụng">Hết hạn sử dụng</option>
                            <option value="Hư hỏng">Hư hỏng</option>
                            <option value="Lỗi sản xuất">Lỗi sản xuất</option>
                            <option value="Thu hồi">Thu hồi</option>
                            <option value="Khác">Khác</option>
                          </select>
                          {chiTiet.lyDo === 'Khác' && (
                            <input
                              type="text"
                              placeholder="Nhập lý do khác..."
                              value={chiTiet.lyDo}
                              onChange={(e) => updateChiTietThanhLy(index, 'lyDo', e.target.value)}
                              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                                errors[`chiTiet_${index}_lyDo`] ? 'border-red-500' : 'border-gray-300'
                              }`}
                            />
                          )}
                        </div>
                        {errors[`chiTiet_${index}_lyDo`] && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors[`chiTiet_${index}_lyDo`]}
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
                {loading ? 'Đang tạo...' : 'Tạo phiếu thanh lý'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PhieuThanhLyCreateModal;