import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getServiceById } from '../../services';
import { Service } from '../../types/service.types';
import { toast } from 'react-toastify';
import { ServiceLoading } from '../../components/Service';
import { DataTable, Column, ActionButton } from '../../components/Tables';
import { useServiceVaccines, useAddVaccineToService, useUpdateServiceVaccine, useDeleteServiceVaccine } from '../../hooks/useServiceVaccine';
import { useVaccines } from '../../hooks/useVaccine';
import { ServiceVaccineCreateRequest, ServiceVaccineUpdateRequest } from '../../types/service.types';
import { ServiceVaccineDto, ServiceVaccineCreateDto, ServiceVaccineUpdateDto } from '../../services/serviceVaccine.service';
import { VaccineDto } from '../../services/vaccine.service';
import { useToast } from '../../hooks/useToast';

const ServiceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const {showError,showSuccess} = useToast();
  // Service vaccine management
  const [showAddVaccineModal, setShowAddVaccineModal] = useState(false);
  const [editingVaccine, setEditingVaccine] = useState<ServiceVaccineDto | null>(null);
  const [selectedVaccineId, setSelectedVaccineId] = useState<string>('');
  const [standardDoses, setStandardDoses] = useState<number>(1);
  const [notes, setNotes] = useState<string>('');
  
  // Hooks for service vaccine management
  const { data: serviceVaccines, loading: vaccinesLoading, execute: refetchVaccines, error: vaccinesError, status: vaccinesStatus } = useServiceVaccines(id!);
  const { data: availableVaccines, loading: vaccinesListLoading, execute: loadVaccines } = useVaccines();
  const { execute: addVaccine, loading: addingVaccine, status: addVaccineStatus, error: addVaccineError } = useAddVaccineToService();
  const { execute: updateVaccine, loading: updatingVaccine } = useUpdateServiceVaccine();
  const { execute: deleteVaccine, loading: deletingVaccine } = useDeleteServiceVaccine();

  useEffect(() => {
    if (id) {
      fetchServiceDetails();
      refetchVaccines(id);
    }
  }, [id, refetchVaccines]);

  useEffect(() => {
    // Load available vaccines for selection
    loadVaccines({ page: 1, pageSize: 100 });
  }, [loadVaccines]);

  // Handle adding vaccine to service
  const handleAddVaccine = async () => {
    if (!selectedVaccineId || !id) return;
    
    try {
      const vaccineData: ServiceVaccineCreateDto = {
        maDichVu: id,
        maVaccine: selectedVaccineId,
        soMuiChuan: standardDoses,
        ghiChu: notes.trim() || undefined
      };
      
      await addVaccine(vaccineData);
      if(addVaccineStatus === 'success'){
        console.log(addVaccineStatus);
        showSuccess("Thành công",'Thêm vaccine vào dịch vụ thành công');
        setShowAddVaccineModal(false);
        resetVaccineForm(); 
        refetchVaccines(id);
      }else if(addVaccineStatus === 'error'){
        showError("Lỗi",addVaccineError || 'Thêm vaccine vào dịch vụ thất bại');
      }
    } catch (error) {
      showError("Lỗi",'Thêm vaccine vào dịch vụ thất bại');
    }
  };

  // Handle updating vaccine in service
  const handleUpdateVaccine = async () => {
    if (!editingVaccine || !id) return;
    
    try {
      const updateData: ServiceVaccineUpdateDto = {
        soMuiChuan: standardDoses,
        ghiChu: notes.trim() || undefined
      };
      
      await updateVaccine({ id: editingVaccine.maDichVuVaccine, data: updateData });
      showSuccess("Thành công",'Cập nhật vaccine thành công');
      setEditingVaccine(null);
      resetVaccineForm();
      refetchVaccines(id);
    } catch (error) {
      showError("Lỗi",'Cập nhật vaccine thất bại');
    }
  };

  // Handle deleting vaccine from service
  const handleDeleteVaccine = async (vaccineId: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa vaccine này khỏi dịch vụ?')) return;
    
    try {
      await deleteVaccine(vaccineId);
      showSuccess("Thành công",'Xóa vaccine khỏi dịch vụ thành công');
      refetchVaccines(id!);
    } catch (error) {
      showError("Lỗi",'Xóa vaccine khỏi dịch vụ thất bại');
    }
  };

  // Reset vaccine form
  const resetVaccineForm = () => {
    setSelectedVaccineId('');
    setStandardDoses(1);
    setNotes('');
  };

  // Open edit modal
  const openEditModal = (vaccine: ServiceVaccineDto) => {
    setEditingVaccine(vaccine);
    setStandardDoses(vaccine.soMuiChuan);
    setNotes(vaccine.ghiChu || '');
  };

  const fetchServiceDetails = async () => {
    try {
      setLoading(true);
      const serviceData = await getServiceById(id!);
      setService(serviceData);
    } catch (error) {
      showError("Lỗi",'Không thể tải thông tin dịch vụ');
      navigate('/services');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount?: number): string => {
    if (amount == null) return 'N/A';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  if (loading) {
    return <ServiceLoading type="card" count={1} />;
  }

  if (!service) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy dịch vụ</h2>
        <Link
          to="/services"
          className="text-blue-600 hover:text-blue-800 underline"
        >
          Quay lại danh sách dịch vụ
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{service.name}</h1>
            <p className="mt-2 text-gray-600">
              Chi tiết dịch vụ trong hệ thống quản lý tiêm chủng
            </p>
          </div>
          <div className="flex space-x-3">
            <Link
              to={`/services/${id}/edit`}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Chỉnh sửa
            </Link>
            <Link
              to="/services"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Quay lại
            </Link>
          </div>
        </div>
      </div>

      {/* Service Details */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Thông tin dịch vụ
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Chi tiết đầy đủ về dịch vụ này
          </p>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Tên dịch vụ</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {service.name}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Mô tả</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {service.description || 'Không có mô tả'}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Giá</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                <span className="text-lg font-semibold text-green-600">
                  {formatCurrency(service.price)}
                </span>
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Loại dịch vụ</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {service.serviceTypeName || 'Chưa phân loại'}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Ngày tạo</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {formatDate(service.createdAt)}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">ID</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">
                  {service.id}
                </code>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Service Vaccines Section */}
      <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Vaccine của dịch vụ
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Danh sách các vaccine được sử dụng trong dịch vụ này
            </p>
          </div>
          <button
            onClick={() => setShowAddVaccineModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Thêm Vaccine
          </button>
        </div>
        
        <div className="border-t border-gray-200">
          {vaccinesLoading ? (
            <div className="px-4 py-5 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-500">Đang tải danh sách vaccine...</p>
            </div>
          ) : serviceVaccines && serviceVaccines.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tên Vaccine
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Liều tiêu chuẩn
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ghi chú
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {serviceVaccines.map((vaccine) => (
                    <tr key={vaccine.maDichVuVaccine}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {vaccine.tenVaccine}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {vaccine.soMuiChuan}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {vaccine.ghiChu || 'Không có'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => openEditModal(vaccine)}
                          className="text-indigo-600 hover:text-indigo-900 mr-3"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDeleteVaccine(vaccine.maDichVuVaccine)}
                          className="text-red-600 hover:text-red-900"
                          disabled={deletingVaccine}
                        >
                          {deletingVaccine ? 'Đang xóa...' : 'Xóa'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-4 py-8 text-center">
                          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Chưa có vaccine nào</h3>
              <p className="mt-1 text-sm text-gray-500">
                Bắt đầu bằng cách thêm vaccine vào dịch vụ này.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="mt-8 flex justify-center space-x-4">
        <Link
          to={`/services/${id}/edit`}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Chỉnh sửa dịch vụ
        </Link>
        <Link
          to="/services"
          className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          Xem tất cả dịch vụ
        </Link>
      </div>

      {/* Add Vaccine Modal */}
      {showAddVaccineModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Thêm Vaccine vào Dịch vụ</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chọn Vaccine
                </label>
                <select
                  value={selectedVaccineId}
                  onChange={(e) => setSelectedVaccineId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={vaccinesListLoading}
                >
                  <option value="">
                    {vaccinesListLoading ? 'Đang tải...' : '-- Chọn vaccine --'}
                  </option>
                  {!vaccinesListLoading && availableVaccines?.data?.map((vaccine: VaccineDto) => (
                    <option key={vaccine.maVaccine} value={vaccine.maVaccine}>
                      {vaccine.ten}
                    </option>
                  ))}
                </select>
                {!vaccinesListLoading && (!availableVaccines?.data || availableVaccines.data.length === 0) && (
                  <p className="mt-1 text-sm text-red-600">
                    Không có vaccine nào khả dụng. Vui lòng kiểm tra lại sau.
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Liều tiêu chuẩn
                </label>
                <input
                  type="number"
                  min="1"
                  value={standardDoses}
                  onChange={(e) => setStandardDoses(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ghi chú
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ghi chú về vaccine này..."
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowAddVaccineModal(false);
                    resetVaccineForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  onClick={handleAddVaccine}
                  disabled={!selectedVaccineId || addingVaccine}
                  className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                >
                  {addingVaccine ? 'Đang thêm...' : 'Thêm'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Vaccine Modal */}
      {editingVaccine && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Chỉnh sửa Vaccine</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên Vaccine
                </label>
                <input
                  type="text"
                  value={editingVaccine.tenVaccine}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Liều tiêu chuẩn
                </label>
                <input
                  type="number"
                  min="1"
                  value={standardDoses}
                  onChange={(e) => setStandardDoses(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ghi chú
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ghi chú về vaccine này..."
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setEditingVaccine(null);
                    resetVaccineForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  onClick={handleUpdateVaccine}
                  disabled={updatingVaccine}
                  className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                >
                  {updatingVaccine ? 'Đang cập nhật...' : 'Cập nhật'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceDetailPage; 