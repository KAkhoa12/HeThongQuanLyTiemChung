import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ServiceForm } from '../../components/Service';
import { createService } from '../../services';
import { ServiceCreateRequest, ServiceUpdateRequest } from '../../types/service.types';
import { toast } from 'react-toastify';

const ServiceCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: ServiceCreateRequest | ServiceUpdateRequest) => {
    // Type guard để đảm bảo data là ServiceCreateRequest
    if (!data.name || !data.serviceTypeId) {
      toast.error('Dữ liệu không hợp lệ');
      return;
    }
    
    try {
      setLoading(true);
      await createService(data as ServiceCreateRequest);
      toast.success('Tạo dịch vụ thành công!');
      navigate('/services');
    } catch (error) {
      console.error('Failed to create service:', error);
      toast.error('Tạo dịch vụ thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/services');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Thêm dịch vụ mới</h1>
        <p className="mt-2 text-gray-600">
          Tạo dịch vụ mới cho hệ thống quản lý tiêm chủng
        </p>
      </div>

      <ServiceForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isEditing={false}
        loading={loading}
      />
    </div>
  );
};

export default ServiceCreatePage; 