import React, { useState, useEffect } from 'react';
import { useToast } from '../../hooks/useToast';
import imageLabelService, {
  ImageLabel,
  ImageLabelCreateDto,
  ImageLabelUpdateDto,
} from '../../services/imageLabel.service';

const ImageLabels: React.FC = () => {
  const [labels, setLabels] = useState<ImageLabel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingLabel, setEditingLabel] = useState<ImageLabel | null>(null);
  const [formData, setFormData] = useState<ImageLabelCreateDto>({
    tenNhan: '',
    moTa: '',
  });

  const { showSuccess, showError } = useToast();

  useEffect(() => {
    loadLabels();
  }, []);

  const loadLabels = async () => {
    try {
      setIsLoading(true);
      const labelsData = await imageLabelService.getAllLabels();
      setLabels(labelsData);
    } catch (error) {
      showError('Lỗi', 'Không thể tải danh sách nhãn ảnh');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.tenNhan.trim()) {
      showError('Lỗi', 'Vui lòng nhập tên nhãn');
      return;
    }

    try {
      setIsLoading(true);

      if (editingLabel) {
        await imageLabelService.updateLabel(editingLabel.maNhan, formData);
        showSuccess('Thành công', 'Cập nhật nhãn ảnh thành công!');
      } else {
        await imageLabelService.createLabel(formData);
        showSuccess('Thành công', 'Tạo nhãn ảnh thành công!');
      }

      setShowModal(false);
      resetForm();
      loadLabels();
    } catch (error) {
      showError(
        'Lỗi',
        editingLabel ? 'Cập nhật nhãn ảnh thất bại' : 'Tạo nhãn ảnh thất bại',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (label: ImageLabel) => {
    setEditingLabel(label);
    setFormData({
      tenNhan: label.tenNhan,
      moTa: label.moTa || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (labelId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa nhãn này?')) {
      return;
    }

    try {
      setIsLoading(true);
      await imageLabelService.deleteLabel(labelId);
      showSuccess('Thành công', 'Xóa nhãn ảnh thành công!');
      loadLabels();
    } catch (error) {
      showError('Lỗi', 'Xóa nhãn ảnh thất bại');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ tenNhan: '', moTa: '' });
    setEditingLabel(null);
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-bold text-black dark:text-white">
          Quản lý Nhãn Ảnh
        </h2>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center rounded-md bg-primary py-2 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
        >
          <i className="ri-add-line mr-2"></i>
          Thêm Nhãn Mới
        </button>
      </div>

      {/* Labels Table */}
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                  Tên Nhãn
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                  Mô Tả
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                  Trạng Thái
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                  Ngày Tạo
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  Thao Tác
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-4 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  </td>
                </tr>
              ) : labels.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-gray-500">
                    Không có nhãn ảnh nào
                  </td>
                </tr>
              ) : (
                labels.map((label) => (
                  <tr
                    key={label.maNhan}
                    className="border-b border-[#eee] dark:border-strokedark"
                  >
                    <td className="py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                      <h5 className="font-medium text-black dark:text-white">
                        {label.tenNhan}
                      </h5>
                    </td>
                    <td className="py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {label.moTa || 'Không có mô tả'}
                      </p>
                    </td>
                    <td className="py-5 px-4 dark:border-strokedark">
                      <span
                        className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${
                          label.isActive
                            ? 'bg-success text-success'
                            : 'bg-danger text-danger'
                        }`}
                      >
                        {label.isActive ? 'Hoạt động' : 'Không hoạt động'}
                      </span>
                    </td>
                    <td className="py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {new Date(label.ngayTao).toLocaleDateString('vi-VN')}
                      </p>
                    </td>
                    <td className="py-5 px-4 dark:border-strokedark">
                      <div className="flex items-center space-x-3.5">
                        <button
                          onClick={() => handleEdit(label)}
                          className="hover:text-primary"
                        >
                          <i className="ri-edit-line text-lg"></i>
                        </button>
                        <button
                          onClick={() => handleDelete(label.maNhan)}
                          className="hover:text-danger"
                        >
                          <i className="ri-delete-bin-line text-lg"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 dark:bg-boxdark">
            <h3 className="mb-4 text-lg font-semibold">
              {editingLabel ? 'Chỉnh sửa Nhãn' : 'Thêm Nhãn Mới'}
            </h3>
            <span className="text-red-500 z-50 absolute top-2 right-2 cursor-pointer" onClick={closeModal} >
              <i className="ri-close-line"></i>
            </span>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Tên nhãn <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.tenNhan}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      tenNhan: e.target.value,
                    }))
                  }
                  placeholder="Nhập tên nhãn"
                  className="w-full rounded border border-stroke p-2 dark:border-strokedark dark:bg-boxdark"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Mô tả</label>
                <textarea
                  value={formData.moTa}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, moTa: e.target.value }))
                  }
                  placeholder="Mô tả nhãn (không bắt buộc)"
                  rows={3}
                  className="w-full rounded border border-stroke p-2 dark:border-strokedark dark:bg-boxdark"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex-1 rounded bg-primary px-4 py-2 text-sm text-white hover:bg-opacity-90 disabled:opacity-50"
              >
                {isLoading
                  ? 'Đang xử lý...'
                  : editingLabel
                  ? 'Cập nhật'
                  : 'Tạo'}
              </button>
              <button
                onClick={closeModal}
                className="flex-1 rounded border border-stroke px-4 py-2 text-sm dark:border-strokedark"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageLabels;
