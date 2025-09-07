import React, { useState, useEffect } from 'react';
import { useCreateNhaCungCap } from '../../hooks';
import { NhaCungCapCreateDto } from '../../services/nhaCungCap.service';

interface NhaCungCapCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const NhaCungCapCreateModal: React.FC<NhaCungCapCreateModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [formData, setFormData] = useState<NhaCungCapCreateDto>({
    ten: '',
    nguoiLienHe: '',
    soDienThoai: '',
    diaChi: '',
    maAnh: ''
  });

  const [errors, setErrors] = useState<Partial<NhaCungCapCreateDto>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { execute: createNhaCungCap, loading: createLoading } = useCreateNhaCungCap();

  useEffect(() => {
    if (isOpen) {
      // Reset form when modal opens
      setFormData({
        ten: '',
        nguoiLienHe: '',
        soDienThoai: '',
        diaChi: '',
        maAnh: ''
      });
      setErrors({});
    }
  }, [isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Partial<NhaCungCapCreateDto> = {};

    if (!formData.ten.trim()) {
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
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await createNhaCungCap(formData);
      onSuccess();
      onClose();
      alert('Thêm nhà cung cấp thành công!');
    } catch (error) {
      console.error('Error creating nha cung cap:', error);
      alert('Có lỗi xảy ra khi thêm nhà cung cấp');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof NhaCungCapCreateDto, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Thêm nhà cung cấp mới</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isSubmitting}
          >
            <i className="ri-close-line text-2xl"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tên nhà cung cấp */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên nhà cung cấp <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.ten}
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
              value={formData.nguoiLienHe}
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
              value={formData.soDienThoai}
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
              value={formData.diaChi}
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
              value={formData.maAnh}
              onChange={(e) => handleInputChange('maAnh', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Nhập mã ảnh (tùy chọn)"
              disabled={isSubmitting}
            />
            <p className="mt-1 text-sm text-gray-500">
              Để trống nếu không có ảnh
            </p>
          </div>

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
              disabled={isSubmitting || createLoading}
            >
              {isSubmitting || createLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Đang thêm...
                </div>
              ) : (
                'Thêm nhà cung cấp'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NhaCungCapCreateModal;