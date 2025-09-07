import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ServiceTypeForm } from '../../components/Service';
import { getServiceTypeById, updateServiceType } from '../../services';
import { ServiceTypeUpdateRequest } from '../../types/service.types';
import { useToast } from '../../hooks';
import { ServiceLoading } from '../../components/Service';

const ServiceTypeEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [serviceType, setServiceType] = useState<ServiceTypeUpdateRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const {showSuccess, showError} = useToast();
  useEffect(() => {
    if (id) {
      fetchServiceTypeDetails();
    }
  }, [id]);

  const fetchServiceTypeDetails = async () => {
    try {
      setLoading(true);
      const serviceTypeData = await getServiceTypeById(id!);
      setServiceType({
        name: serviceTypeData.name
      });
    } catch (error) {
      console.error('Failed to fetch service type details:', error);
      showError("Lỗi", "Không thể tải thông tin loại dịch vụ");
      navigate('/dashboard/services/types');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: ServiceTypeUpdateRequest) => {
    try {
      setSubmitting(true);
      await updateServiceType(id!, data);
      showSuccess("Thành công", "Cập nhật loại dịch vụ thành công!");
      navigate('/dashboard/services/types');
    } catch (error) {
      console.error('Failed to update service type:', error);
      showError("Lỗi", "Cập nhật loại dịch vụ thất bại. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard/services/types');
  };

  if (loading) {
    return <ServiceLoading type="card" count={1} />;
  }

  if (!serviceType) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy loại dịch vụ</h2>
        <button
          onClick={() => navigate('/dashboard/services/types')}
          className="text-blue-600 hover:text-blue-800 underline"
        >
          Quay lại danh sách loại dịch vụ
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Chỉnh sửa loại dịch vụ</h1>
        <p className="mt-2 text-gray-600">
          Cập nhật thông tin loại dịch vụ trong hệ thống
        </p>
      </div>

      <ServiceTypeForm
        initialData={serviceType}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isEditing={true}
        loading={submitting}
      />
    </div>
  );
};

export default ServiceTypeEditPage; 