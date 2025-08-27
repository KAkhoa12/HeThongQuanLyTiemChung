import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ServiceTypeForm } from '../../components/Service';
import { createServiceType } from '../../services';
import { ServiceTypeCreateRequest, ServiceTypeUpdateRequest } from '../../types/service.types';
import { toast } from 'react-toastify';

const ServiceTypeCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: ServiceTypeCreateRequest) => {
    try {
      setLoading(true);
      await createServiceType(data);
      toast.success('Tạo loại dịch vụ thành công!');
      navigate('/services/types');
    } catch (error) {
      console.error('Failed to create service type:', error);
      toast.error('Tạo loại dịch vụ thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/services/types');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Thêm loại dịch vụ mới</h1>
        <p className="mt-2 text-gray-600">
          Tạo loại dịch vụ mới để phân loại các dịch vụ trong hệ thống
        </p> 
      </div>

      <ServiceTypeForm
        onSubmit={handleSubmit as (data: ServiceTypeCreateRequest | ServiceTypeUpdateRequest) => Promise<void>}
        onCancel={handleCancel}
        isEditing={false}
        loading={loading}
      />
    </div>
  );
};

export default ServiceTypeCreatePage; 