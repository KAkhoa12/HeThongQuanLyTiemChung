import React, { useState, useEffect } from 'react';
import { usePhieuThanhLy, useUpdatePhieuThanhLy, useLocations } from '../../hooks';
import { PhieuThanhLyUpdateDto } from '../../services/phieuThanhLy.service';

interface PhieuThanhLyEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  phieuThanhLyId: string;
}

const PhieuThanhLyEditModal: React.FC<PhieuThanhLyEditModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  phieuThanhLyId
}) => {
  const [formData, setFormData] = useState<PhieuThanhLyUpdateDto>({
    maDiaDiem: '',
    ngayThanhLy: '',
    trangThai: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: phieuThanhLyDetail, loading: detailLoading, execute: fetchPhieuThanhLyDetail } = usePhieuThanhLy(phieuThanhLyId);
  const { data: locations, execute: fetchLocations } = useLocations();
  const { execute: updatePhieuThanhLy, loading: updateLoading } = useUpdatePhieuThanhLy();

  useEffect(() => {
    if (isOpen) {
      fetchLocations({ page: 1, pageSize: 1000 });
      if (phieuThanhLyId) {
        fetchPhieuThanhLyDetail(phieuThanhLyId);
      }
    } else {
      setFormData({
        maDiaDiem: '',
        ngayThanhLy: '',
        trangThai: ''
      });
      setErrors({});
    }
  }, [isOpen, phieuThanhLyId]);

  useEffect(() => {
    if (phieuThanhLyDetail) {
      setFormData({
        maDiaDiem: phieuThanhLyDetail.maDiaDiem || '',
        ngayThanhLy: phieuThanhLyDetail.ngayThanhLy ? new Date(phieuThanhLyDetail.ngayThanhLy).toISOString().split('T')[0] : '',
        trangThai: phieuThanhLyDetail.trangThai || ''
      });
    }
  }, [phieuThanhLyDetail]);

  const handleInputChange = (field: keyof PhieuThanhLyUpdateDto, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.maDiaDiem) {
      newErrors.maDiaDiem = 'Địa điểm là bắt buộc';
    }

    if (!formData.ngayThanhLy) {
      newErrors.ngayThanhLy = 'Ngày thanh lý là bắt buộc';
    }

    if (!formData.trangThai) {
      newErrors.trangThai = 'Trạng thái là bắt buộc';
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
      await updatePhieuThanhLy({ id: phieuThanhLyId, data: formData });
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error updating phiếu thanh lý:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl relative">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              Cập nhật Phiếu Thanh Lý
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

          {detailLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
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
                    {locations?.data?.map((location: any) => (
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

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trạng thái *
                  </label>
                  <select
                    value={formData.trangThai}
                    onChange={(e) => handleInputChange('trangThai', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.trangThai ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Chọn trạng thái</option>
                    <option value="Pending">Chờ duyệt</option>
                    <option value="Approved">Đã duyệt</option>
                    <option value="Rejected">Từ chối</option>
                  </select>
                  {errors.trangThai && (
                    <p className="text-red-500 text-sm mt-1">{errors.trangThai}</p>
                  )}
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
                  disabled={updateLoading}
                  className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50"
                >
                  {updateLoading ? 'Đang cập nhật...' : 'Cập nhật'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default PhieuThanhLyEditModal;