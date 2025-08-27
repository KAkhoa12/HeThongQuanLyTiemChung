import React from 'react';
import { createPortal } from 'react-dom';
import ServiceForm from './ServiceForm';
import { ServiceCreateRequest, ServiceUpdateRequest } from '../../types/service.types';

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ServiceCreateRequest | ServiceUpdateRequest) => Promise<void>;
  initialData?: ServiceUpdateRequest;
  isEditing?: boolean;
  loading?: boolean;
}

const ServiceModal: React.FC<ServiceModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isEditing = false,
  loading = false
}) => {
  if (!isOpen) return null;

  const handleSubmit = async (data: ServiceCreateRequest | ServiceUpdateRequest) => {
    try {
      await onSubmit(data);
      onClose();
    } catch (error) {
      console.error('Modal submission failed:', error);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  // Prevent body scroll when modal is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Close modal on escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !loading) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, loading, onClose]);

  return createPortal(
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-4xl mx-auto">
          {/* Close Button */}
          <button
            onClick={handleClose}
            disabled={loading}
            className="absolute top-4 right-4 z-10 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Modal Content */}
          <div className="relative bg-white rounded-lg shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
              <h2 className="text-xl font-semibold text-white">
                {isEditing ? 'Cập nhật dịch vụ' : 'Thêm dịch vụ mới'}
              </h2>
              <p className="text-blue-100 text-sm mt-1">
                {isEditing ? 'Chỉnh sửa thông tin dịch vụ' : 'Tạo dịch vụ mới cho hệ thống'}
              </p>
            </div>

            {/* Body */}
            <div className="p-6">
              <ServiceForm
                initialData={initialData}
                onSubmit={handleSubmit}
                onCancel={handleClose}
                isEditing={isEditing}
                loading={loading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ServiceModal; 