import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useVaccine, useUpdateVaccine } from '../../hooks/useVaccine';
import vaccineService from '../../services/vaccine.service';
import { useToast } from '../../hooks/useToast';
import Loader from '../../common/Loader';

const VaccineEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const {
    data: vaccine,
    loading: vaccineLoading,
    error: vaccineError,
    execute: loadVaccine
  } = useVaccine();

  const {
    data: updateResult,
    loading: updateLoading,
    error: updateError,
    execute: updateVaccine
  } = useUpdateVaccine();

  const [formData, setFormData] = useState({
    ten: '',
    nhaSanXuat: '',
    tuoiBatDauTiem: '',
    tuoiKetThucTiem: '',
    huongDanSuDung: '',
    phongNgua: '',
    isActive: true
  });

  const { showSuccess, showError } = useToast();
  const [schedules, setSchedules] = useState<any[]>([]);
  const [schedulesLoading, setSchedulesLoading] = useState(false);
  const [showAddScheduleModal, setShowAddScheduleModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<any>(null);
  const [scheduleFormData, setScheduleFormData] = useState({
    muiThu: 1,
    tuoiThangToiThieu: '',
    tuoiThangToiDa: '',
    soNgaySauMuiTruoc: '',
    ghiChu: ''
  });

  useEffect(() => {
    if (id) {
      loadVaccine(id);
      loadSchedules(id);
    }
  }, [id, loadVaccine]);

  const loadSchedules = async (vaccineId: string) => {
    try {
      setSchedulesLoading(true);
      const response = await vaccineService.getVaccineSchedulesByVaccine(vaccineId);
      if (response && response.LichTiemChuans) {
        setSchedules(response.LichTiemChuans);
      }
    } catch (error) {
      showError("Lỗi", "Không thể tải lịch tiêm chuẩn");
    } finally {
      setSchedulesLoading(false);
    }
  };

  const handleAddSchedule = async () => {
    if (!id) return;
    
    try {
      const scheduleData = {
        MaVaccine: id,
        MuiThu: scheduleFormData.muiThu,
        TuoiThangToiThieu: scheduleFormData.tuoiThangToiThieu ? parseInt(scheduleFormData.tuoiThangToiThieu) : null,
        TuoiThangToiDa: scheduleFormData.tuoiThangToiDa ? parseInt(scheduleFormData.tuoiThangToiDa) : null,
        SoNgaySauMuiTruoc: scheduleFormData.soNgaySauMuiTruoc ? parseInt(scheduleFormData.soNgaySauMuiTruoc) : null,
        GhiChu: scheduleFormData.ghiChu.trim() || null
      };

      await vaccineService.createVaccineSchedule(scheduleData);
      showSuccess("Thành công", "Thêm lịch tiêm chuẩn thành công");
      setShowAddScheduleModal(false);
      resetScheduleForm();
      loadSchedules(id);
    } catch (error) {
      showError("Lỗi", "Thêm lịch tiêm chuẩn thất bại");
    }
  };

  const handleUpdateSchedule = async () => {
    if (!editingSchedule || !id) return;
    
    try {
      const updateData = {
        MuiThu: scheduleFormData.muiThu,
        TuoiThangToiThieu: scheduleFormData.tuoiThangToiThieu ? parseInt(scheduleFormData.tuoiThangToiThieu) : null,
        TuoiThangToiDa: scheduleFormData.tuoiThangToiDa ? parseInt(scheduleFormData.tuoiThangToiDa) : null,
        SoNgaySauMuiTruoc: scheduleFormData.soNgaySauMuiTruoc ? parseInt(scheduleFormData.soNgaySauMuiTruoc) : null,
        GhiChu: scheduleFormData.ghiChu.trim() || null
      };

      await vaccineService.updateVaccineSchedule(editingSchedule.MaLichTiemChuan, updateData);
      showSuccess("Thành công", "Cập nhật lịch tiêm chuẩn thành công");
      setEditingSchedule(null);
      resetScheduleForm();
      loadSchedules(id);
    } catch (error) {
      showError("Lỗi", "Cập nhật lịch tiêm chuẩn thất bại");
    }
  };

  const handleDeleteSchedule = async (scheduleId: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa lịch tiêm chuẩn này?')) return;
    
    try {
      await vaccineService.deleteVaccineSchedule(scheduleId);
      showSuccess("Thành công", "Xóa lịch tiêm chuẩn thành công");
      loadSchedules(id!);
    } catch (error) {
      showError("Lỗi", "Xóa lịch tiêm chuẩn thất bại");
    }
  };

  const openEditScheduleModal = (schedule: any) => {
    setEditingSchedule(schedule);
    setScheduleFormData({
      muiThu: schedule.MuiThu,
      tuoiThangToiThieu: schedule.TuoiThangToiThieu?.toString() || '',
      tuoiThangToiDa: schedule.TuoiThangToiDa?.toString() || '',
      soNgaySauMuiTruoc: schedule.SoNgaySauMuiTruoc?.toString() || '',
      ghiChu: schedule.GhiChu || ''
    });
  };

  const resetScheduleForm = () => {
    setScheduleFormData({
      muiThu: 1,
      tuoiThangToiThieu: '',
      tuoiThangToiDa: '',
      soNgaySauMuiTruoc: '',
      ghiChu: ''
    });
  };

  useEffect(() => {
    if (vaccine) {
      setFormData({
        ten: vaccine.ten || '',
        nhaSanXuat: vaccine.nhaSanXuat || '',
        tuoiBatDauTiem: vaccine.tuoiBatDauTiem?.toString() || '',
        tuoiKetThucTiem: vaccine.tuoiKetThucTiem?.toString() || '',
        huongDanSuDung: vaccine.huongDanSuDung || '',
        phongNgua: vaccine.phongNgua || '',
        isActive: vaccine.isActive ?? true
      });
    }
  }, [vaccine]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id) return;

    const updateData = {
      ...formData,
      tuoiBatDauTiem: formData.tuoiBatDauTiem ? parseInt(formData.tuoiBatDauTiem) : null,
      tuoiKetThucTiem: formData.tuoiKetThucTiem ? parseInt(formData.tuoiKetThucTiem) : null
    };

    await updateVaccine({ id, data: updateData });
  };

  const loading = vaccineLoading || updateLoading;
  const error = vaccineError || updateError;

  if (loading && !vaccine) {
    return <Loader />;
  }

  if (vaccineError && !vaccine) {
    return (
      <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="text-red-600 mr-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium text-red-800">Lỗi khi tải dữ liệu</h3>
              <p className="text-red-700 mt-1">{vaccineError}</p>
              <button
                onClick={() => id && loadVaccine(id)}
                className="mt-3 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Thử lại
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!vaccine) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold mb-4">Không tìm thấy vaccine</h2>
        <button
          onClick={() => navigate('/dashboard/vaccine-manage')}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-opacity-90"
        >
          Quay lại danh sách
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-title-md2 font-bold text-black dark:text-white">
            Chỉnh Sửa Vaccine
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Mã: {vaccine.maVaccine}
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => navigate(`/dashboard/vaccine-manage/detail/${vaccine.maVaccine}`)}
            className="inline-flex items-center justify-center rounded-md border border-stroke bg-white py-2 px-6 text-center font-medium text-black hover:bg-gray-50 dark:border-strokedark dark:bg-boxdark dark:text-white dark:hover:bg-boxdark-2"
          >
            Quay lại
          </button>
        </div>
      </div>

      {/* Success Message */}
      {updateResult && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-green-600 mr-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium text-green-800">Cập nhật thành công!</h3>
              <p className="text-green-700 mt-1">Vaccine đã được cập nhật thành công.</p>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {updateError && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-red-600 mr-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium text-red-800">Lỗi khi cập nhật</h3>
              <p className="text-red-700 mt-1">{updateError}</p>
            </div>
          </div>
        </div>
      )}

      {/* Edit Form */}
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tên Vaccine <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="ten"
                value={formData.ten}
                onChange={handleInputChange}
                required
                className="w-full rounded-lg border border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                placeholder="Nhập tên vaccine"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nhà Sản Xuất
              </label>
              <input
                type="text"
                name="nhaSanXuat"
                value={formData.nhaSanXuat}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                placeholder="Nhập nhà sản xuất"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tuổi Bắt Đầu (tháng)
              </label>
              <input
                type="number"
                name="tuoiBatDauTiem"
                value={formData.tuoiBatDauTiem}
                onChange={handleInputChange}
                min="0"
                className="w-full rounded-lg border border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tuổi Kết Thúc (tháng)
              </label>
              <input
                type="number"
                name="tuoiKetThucTiem"
                value={formData.tuoiKetThucTiem}
                onChange={handleInputChange}
                min="0"
                className="w-full rounded-lg border border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                placeholder="120"
              />
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Hướng Dẫn Sử Dụng
              </label>
              <textarea
                name="huongDanSuDung"
                value={formData.huongDanSuDung}
                onChange={handleInputChange}
                rows={4}
                className="w-full rounded-lg border border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                placeholder="Nhập hướng dẫn sử dụng"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phòng Ngừa
              </label>
              <textarea
                name="phongNgua"
                value={formData.phongNgua}
                onChange={handleInputChange}
                rows={4}
                className="w-full rounded-lg border border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                placeholder="Nhập thông tin phòng ngừa"
              />
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Vaccine hoạt động
                </span>
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate(`/dashboard/vaccine-manage/detail/${vaccine.maVaccine}`)}
              className="px-6 py-2 border border-stroke rounded hover:bg-gray-50 dark:border-strokedark dark:hover:bg-boxdark-2"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={updateLoading}
              className="px-6 py-2 bg-primary text-white rounded hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updateLoading ? 'Đang cập nhật...' : 'Cập nhật Vaccine'}
            </button>
          </div>
        </form>
      </div>

      {/* Lịch Tiêm Chuẩn Section */}
      <div className="mt-8 rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-black dark:text-white">
            Lịch Tiêm Chuẩn
          </h3>
          <button
            onClick={() => setShowAddScheduleModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Thêm Lịch Tiêm
          </button>
        </div>
        
        {schedulesLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-500">Đang tải lịch tiêm chuẩn...</p>
          </div>
        ) : schedules.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mũi Thứ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Độ Tuổi Tối Thiểu
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Độ Tuổi Tối Đa
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Số Ngày Sau Mũi Trước
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ghi Chú
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao Tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {schedules.map((schedule) => (
                  <tr key={schedule.MaLichTiemChuan}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {schedule.MuiThu}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {schedule.TuoiThangToiThieu ? `${schedule.TuoiThangToiThieu} tháng` : 'Không giới hạn'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {schedule.TuoiThangToiDa ? `${schedule.TuoiThangToiDa} tháng` : 'Không giới hạn'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {schedule.SoNgaySauMuiTruoc ? `${schedule.SoNgaySauMuiTruoc} ngày` : 'Không giới hạn'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {schedule.GhiChu || 'Không có'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => openEditScheduleModal(schedule)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDeleteSchedule(schedule.MaLichTiemChuan)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Chưa có lịch tiêm chuẩn nào</h3>
            <p className="mt-1 text-sm text-gray-500">
              Bắt đầu bằng cách thêm lịch tiêm chuẩn cho vaccine này.
            </p>
          </div>
        )}
      </div>

      {/* Add Schedule Modal */}
      {showAddScheduleModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Thêm Lịch Tiêm Chuẩn</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mũi Thứ <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  value={scheduleFormData.muiThu}
                  onChange={(e) => setScheduleFormData({...scheduleFormData, muiThu: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Độ Tuổi Tối Thiểu (tháng)
                </label>
                <input
                  type="number"
                  min="0"
                  value={scheduleFormData.tuoiThangToiThieu}
                  onChange={(e) => setScheduleFormData({...scheduleFormData, tuoiThangToiThieu: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Để trống nếu không giới hạn"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Độ Tuổi Tối Đa (tháng)
                </label>
                <input
                  type="number"
                  min="0"
                  value={scheduleFormData.tuoiThangToiDa}
                  onChange={(e) => setScheduleFormData({...scheduleFormData, tuoiThangToiDa: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Để trống nếu không giới hạn"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số Ngày Sau Mũi Trước
                </label>
                <input
                  type="number"
                  min="0"
                  value={scheduleFormData.soNgaySauMuiTruoc}
                  onChange={(e) => setScheduleFormData({...scheduleFormData, soNgaySauMuiTruoc: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Để trống nếu không giới hạn"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ghi Chú
                </label>
                <textarea
                  value={scheduleFormData.ghiChu}
                  onChange={(e) => setScheduleFormData({...scheduleFormData, ghiChu: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ghi chú về lịch tiêm này..."
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowAddScheduleModal(false);
                    resetScheduleForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  onClick={handleAddSchedule}
                  className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Thêm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Schedule Modal */}
      {editingSchedule && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Chỉnh Sửa Lịch Tiêm Chuẩn</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mũi Thứ <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  value={scheduleFormData.muiThu}
                  onChange={(e) => setScheduleFormData({...scheduleFormData, muiThu: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Độ Tuổi Tối Thiểu (tháng)
                </label>
                <input
                  type="number"
                  min="0"
                  value={scheduleFormData.tuoiThangToiThieu}
                  onChange={(e) => setScheduleFormData({...scheduleFormData, tuoiThangToiThieu: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Để trống nếu không giới hạn"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Độ Tuổi Tối Đa (tháng)
                </label>
                <input
                  type="number"
                  min="0"
                  value={scheduleFormData.tuoiThangToiDa}
                  onChange={(e) => setScheduleFormData({...scheduleFormData, tuoiThangToiDa: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Để trống nếu không giới hạn"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số Ngày Sau Mũi Trước
                </label>
                <input
                  type="number"
                  min="0"
                  value={scheduleFormData.soNgaySauMuiTruoc}
                  onChange={(e) => setScheduleFormData({...scheduleFormData, soNgaySauMuiTruoc: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Để trống nếu không giới hạn"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ghi Chú
                </label>
                <textarea
                  value={scheduleFormData.ghiChu}
                  onChange={(e) => setScheduleFormData({...scheduleFormData, ghiChu: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ghi chú về lịch tiêm này..."
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setEditingSchedule(null);
                    resetScheduleForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  onClick={handleUpdateSchedule}
                  className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Cập Nhật
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VaccineEditPage; 