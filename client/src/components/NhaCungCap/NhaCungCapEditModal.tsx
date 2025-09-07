import React, { useState, useEffect } from 'react';
import { useUpdateNhaCungCap } from '../../hooks';
import { NhaCungCapDto, NhaCungCapUpdateDto } from '../../services/nhaCungCap.service';

interface NhaCungCapEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  nhaCungCap: NhaCungCapDto | null;
}

const NhaCungCapEditModal: React.FC<NhaCungCapEditModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  nhaCungCap
}) => {
  const [formData, setFormData] = useState<NhaCungCapUpdateDto>({
    ten: '',
    nguoiLienHe: '',
    soDienThoai: '',
    diaChi: '',
    maAnh: ''
  });

  const [errors, setErrors] = useState<Partial<NhaCungCapUpdateDto>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { execute: updateNhaCungCap, loading: updateLoading } = useUpdateNhaCungCap();

  useEffect(() => {
    if (isOpen && nhaCungCap) {
      // Populate form with existing data
      setFormData({
        ten: nhaCungCap.ten || '',
        nguoiLienHe: nhaCungCap.nguoiLienHe || '',
        soDienThoai: nhaCungCap.soDienThoai || '',
        diaChi: nhaCungCap.diaChi || '',
        maAnh: nhaCungCap.maAnh || ''
      });
      setErrors({});
    }
  }, [isOpen, nhaCungCap]);

  const validateForm = (): boolean => {
    const newErrors: Partial<NhaCungCapUpdateDto> = {};

    if (!formData.ten?.trim()) {
      newErrors.ten = 'Tên nhà cung cấp là bắt buộc';
    }

    if (formData.soDienThoai && !/^[0-9+\-\s()]+$/.test(formData.soDienThoai)) {
      newErrors.soDienThoai = 'Số điện thoại không hợp lệ';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nhaCungCap) return;
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await updateNhaCungCap({
        id: nhaCungCap.maNhaCungCap,
        data: formData
      });
      onSuccess();
      onClose();
      alert('Cập nhật nhà cung cấp thành công!');
    } catch (error) {
      console.error('Error updating nha cung cap:', error);
      alert('Có lỗi xảy ra khi cập nhật nhà cung cấp');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof NhaCungCapUpdateDto, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (!isOpen || !nhaCungCap) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">
            Chỉnh sửa nhà cung cấp
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isSubmitting}
          >
            <i className="ri-close-line text-2xl"></i>
          </button>
        </div>

        <div className="mb-4 p-3 bg-gray-50 rounded-md">
          <p className="text-sm text-gray-600">
            <strong>Mã nhà cung cấp:</strong> {nhaCungCap.maNhaCungCap}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tên nhà cung cấp */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên nhà cung cấp <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.ten || ''}
              onChange={(e) => handleInputChange('ten', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.ten ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Nhập tên nhà cung cấp"
              disabled={isSubmitting}
            />
            {errors.ten && (
              <p className="mt-1 text-sm text-red-600">{errors.ten}</p>
            )}
          </div>

          {/* Người liên hệ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Người liên hệ
            </label>
            <input
              type="text"
              value={formData.nguoiLienHe || ''}
              onChange={(e) => handleInputChange('nguoiLienHe', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Nhập tên người liên hệ"
              disabled={isSubmitting}
            />
          </div>

          {/* Số điện thoại */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Số điện thoại
            </label>
            <input
              type="tel"
              value={formData.soDienThoai || ''}
              onChange={(e) => handleInputChange('soDienThoai', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.soDienThoai ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Nhập số điện thoại"
              disabled={isSubmitting}
            />
            {errors.soDienThoai && (
              <p className="mt-1 text-sm text-red-600">{errors.soDienThoai}</p>
            )}
          </div>

          {/* Địa chỉ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Địa chỉ
            </label>
            <textarea
              value={formData.diaChi || ''}
              onChange={(e) => handleInputChange('diaChi', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Nhập địa chỉ"
              rows={3}
              disabled={isSubmitting}
            />
          </div>

          {/* Mã ảnh */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mã ảnh
            </label>
            <input
              type="text"
              value={formData.maAnh || ''}
              onChange={(e) => handleInputChange('maAnh', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Nhập mã ảnh (tùy chọn)"
              disabled={isSubmitting}
            />
            <p className="mt-1 text-sm text-gray-500">
              Để trống nếu không có ảnh
            </p>
          </div>

          {/* Current Image Preview */}
          {nhaCungCap.urlAnh && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ảnh hiện tại
              </label>
              <div className="w-32 h-32 border border-gray-300 rounded-md overflow-hidden">
                <img
                  src={nhaCungCap.urlAnh}
                  alt={nhaCungCap.ten}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              disabled={isSubmitting}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
              disabled={isSubmitting || updateLoading}
            >
              {isSubmitting || updateLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Đang cập nhật...
                </div>
              ) : (
                'Cập nhật nhà cung cấp'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NhaCungCapEditModal;