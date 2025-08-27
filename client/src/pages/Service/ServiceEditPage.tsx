import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ServiceForm } from '../../components/Service';
import { getServiceById, updateService } from '../../services';
import { ServiceUpdateRequest } from '../../types/service.types';
import { toast } from 'react-toastify';
import { ServiceLoading } from '../../components/Service';

const ServiceEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [service, setService] = useState<ServiceUpdateRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchServiceDetails();
    }
  }, [id]);

  const fetchServiceDetails = async () => {
    try {
      setLoading(true);
      const serviceData = await getServiceById(id!);
      setService({
        name: serviceData.name,
        description: serviceData.description,
        price: serviceData.price,
        serviceTypeId: serviceData.serviceTypeId
      });
    } catch (error) {
      console.error('Failed to fetch service details:', error);
      toast.error('Không thể tải thông tin dịch vụ');
      navigate('/services');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: ServiceUpdateRequest) => {
    try {
      setSubmitting(true);
      await updateService(id!, data);
      toast.success('Cập nhật dịch vụ thành công!');
      navigate(`/services/${id}`);
    } catch (error) {
      console.error('Failed to update service:', error);
      toast.error('Cập nhật dịch vụ thất bại. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(`/services/${id}`);
  };

  if (loading) {
    return <ServiceLoading type="card" count={1} />;
  }

  if (!service) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy dịch vụ</h2>
        <button
          onClick={() => navigate('/services')}
          className="text-blue-600 hover:text-blue-800 underline"
        >
          Quay lại danh sách dịch vụ
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Chỉnh sửa dịch vụ</h1>
        <p className="mt-2 text-gray-600">
          Cập nhật thông tin dịch vụ trong hệ thống
        </p>
      </div>

      <ServiceForm
        initialData={service}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isEditing={true}
        loading={submitting}
      />
    </div>
  );
};

export default ServiceEditPage; 