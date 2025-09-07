import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllServiceTypes, deleteServiceType, createServiceType, updateServiceType } from '../../services/service.service';
import { ServiceType, ServiceTypeCreateRequest, ServiceTypeUpdateRequest } from '../../types/service.types';
import { PagedResponse } from '../../types/staff.types';
import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { useToast } from '../../hooks';

const ServiceTypePage = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    pageSize: 10,
  });
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentTypeId, setCurrentTypeId] = useState<string>('');
  const [typeName, setTypeName] = useState<string>('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [deleteTypeId, setDeleteTypeId] = useState<string>('');
  const [deleteTypeName, setDeleteTypeName] = useState<string>('');
  const {showSuccess, showError} = useToast();

  useEffect(() => {
    fetchServiceTypes();
  }, [pagination.currentPage]);

  const fetchServiceTypes = async () => {
    try {
      setLoading(true);
      const response: PagedResponse<ServiceType> = await getAllServiceTypes(
        pagination.currentPage,
        pagination.pageSize
      );
      setServiceTypes(response.data);
      setPagination({
        ...pagination,
        totalPages: response.totalPages,
        totalItems: response.totalCount,
      });
    } catch (error) {
      console.error('Failed to fetch service types:', error);
      showError("Lỗi", "Không thể tải danh sách loại dịch vụ");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setPagination({ ...pagination, currentPage: page });
  };

  const openDeleteModal = (type: ServiceType) => {
    setDeleteTypeId(type.id);
    setDeleteTypeName(type.name);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      await deleteServiceType(deleteTypeId);
      showSuccess("Thành công", "Xóa loại dịch vụ thành công");
      setIsDeleteModalOpen(false);
      fetchServiceTypes();
    } catch (error) {
      console.error('Delete failed:', error);
      showError("Lỗi", "Không thể xóa loại dịch vụ. Có thể loại dịch vụ này đang được sử dụng.");
    }
  };

  const openCreateModal = () => {
    setIsEditing(false);
    setTypeName('');
    setCurrentTypeId('');
    setIsModalOpen(true);
  };

  const openEditModal = (type: ServiceType) => {
    setIsEditing(true);
    setTypeName(type.name);
    setCurrentTypeId(type.id);
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!typeName.trim()) {
      showError("Lỗi", "Tên loại dịch vụ không được để trống");
      return;
    }

    try {
      if (isEditing) {
        const updateData: ServiceTypeUpdateRequest = { name: typeName };
        await updateServiceType(currentTypeId, updateData);
        showSuccess("Thành công", "Cập nhật loại dịch vụ thành công");
      } else {
        const createData: ServiceTypeCreateRequest = { name: typeName };
        await createServiceType(createData);
        showSuccess("Thành công", "Thêm loại dịch vụ thành công");
      }
      setIsModalOpen(false);
      fetchServiceTypes();
    } catch (error) {
      console.error('Operation failed:', error);
      showError("Lỗi", isEditing ? "Cập nhật thất bại" : "Thêm mới thất bại");
    }
  };

  return (
    <>
      <Breadcrumb pageName="Quản lý loại dịch vụ" />

      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
          <h4 className="text-xl font-semibold text-black dark:text-white mb-4 md:mb-0">
            Danh sách loại dịch vụ
          </h4>

          <button
            onClick={openCreateModal}
            className="inline-flex items-center justify-center rounded-md bg-primary py-2 px-6 text-center font-medium text-white hover:bg-opacity-90"
          >
            Thêm loại dịch vụ
          </button>
        </div>

        <div className="max-w-full overflow-x-auto">
          {loading ? (
            <div className="text-center py-10">
              <div className="spinner-border text-primary" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          ) : serviceTypes.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-lg text-gray-500">Không tìm thấy loại dịch vụ nào</p>
            </div>
          ) : (
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                  <th className="py-4 px-4 font-medium text-black dark:text-white">
                    Tên loại dịch vụ
                  </th>
                  <th className="py-4 px-4 font-medium text-black dark:text-white">
                    Ngày tạo
                  </th>
                  <th className="py-4 px-4 font-medium text-black dark:text-white">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {serviceTypes.map((type) => (
                  <tr key={type.id}>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">{type.name}</p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {new Date(type.createdAt).toLocaleDateString('vi-VN')}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <div className="flex items-center space-x-3.5">
                        <button
                          onClick={() => openEditModal(type)}
                          className="hover:text-primary"
                          title="Chỉnh sửa"
                        >
                          <i className="ri-edit-line"></i>
                        </button>
                        <button
                          onClick={() => openDeleteModal(type)}
                          className="hover:text-danger"
                          title="Xóa"
                        >
                          <i className="ri-delete-bin-line"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center mt-6 mb-4">
            <nav>
              <ul className="flex space-x-1">
                <li>
                  <button
                    onClick={() => handlePageChange(Math.max(1, pagination.currentPage - 1))}
                    disabled={pagination.currentPage === 1}
                    className={`px-3 py-1 rounded-md ${
                      pagination.currentPage === 1
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    &laquo;
                  </button>
                </li>
                {[...Array(pagination.totalPages)].map((_, index) => (
                  <li key={index}>
                    <button
                      onClick={() => handlePageChange(index + 1)}
                      className={`px-3 py-1 rounded-md ${
                        pagination.currentPage === index + 1
                          ? 'bg-primary text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {index + 1}
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    onClick={() =>
                      handlePageChange(Math.min(pagination.totalPages, pagination.currentPage + 1))
                    }
                    disabled={pagination.currentPage === pagination.totalPages}
                    className={`px-3 py-1 rounded-md ${
                      pagination.currentPage === pagination.totalPages
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    &raquo;
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>

      {/* Modal for Create/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-999 flex items-center justify-center bg-black bg-opacity-40">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-boxdark">
            <h3 className="mb-4 text-xl font-semibold text-black dark:text-white">
              {isEditing ? 'Chỉnh sửa loại dịch vụ' : 'Thêm loại dịch vụ mới'}
            </h3>
            <div className="mb-4">
              <label className="mb-2.5 block text-black dark:text-white">
                Tên loại dịch vụ <span className="text-meta-1">*</span>
              </label>
              <input
                type="text"
                placeholder="Nhập tên loại dịch vụ"
                value={typeName}
                onChange={(e) => setTypeName(e.target.value)}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded border border-stroke py-2 px-6 text-black hover:shadow-1 dark:border-strokedark dark:text-white"
              >
                Hủy
              </button>
              <button
                onClick={handleSubmit}
                className="rounded bg-primary py-2 px-6 text-white hover:bg-opacity-90"
              >
                {isEditing ? 'Cập nhật' : 'Thêm mới'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Delete Confirmation */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-999 flex items-center justify-center bg-black bg-opacity-40">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-boxdark">
            <div className="mb-4 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-danger bg-opacity-20">
                <i className="ri-error-warning-line text-2xl text-danger"></i>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-black dark:text-white">
                Xác nhận xóa
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Bạn có chắc chắn muốn xóa loại dịch vụ <span className="font-semibold text-black dark:text-white">"{deleteTypeName}"</span>?
              </p>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Hành động này không thể hoàn tác.
              </p>
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="rounded border border-stroke py-2 px-6 text-black hover:shadow-1 dark:border-strokedark dark:text-white"
              >
                Hủy
              </button>
              <button
                onClick={handleDelete}
                className="rounded bg-danger py-2 px-6 text-white hover:bg-opacity-90"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ServiceTypePage;