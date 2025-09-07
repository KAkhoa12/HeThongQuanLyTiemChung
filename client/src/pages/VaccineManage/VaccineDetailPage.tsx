import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CardDataStats from '../../components/CardDataStats';
import { useVaccine } from '../../hooks/useVaccine';
import vaccineService from '../../services/vaccine.service';
import { useToast } from '../../hooks/useToast';
import Loader from '../../common/Loader';

const VaccineDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const {
    data: vaccine,
    loading: vaccineLoading,
    error: vaccineError,
    execute: loadVaccine
  } = useVaccine();

  const { showSuccess, showError } = useToast();
  const [schedules, setSchedules] = useState<any[]>([]);
  const [schedulesLoading, setSchedulesLoading] = useState(false);
  const [showAddScheduleModal, setShowAddScheduleModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<any>(null);
  const [formData, setFormData] = useState({
    muiThu: 1,
    tuoiThangToiThieu: '',
    tuoiThangToiDa: '',
    soNgaySauMuiTruoc: '',
    ghiChu: ''
  });

  const loading = vaccineLoading || schedulesLoading;
  const error = vaccineError;

  const loadSchedules = async (vaccineId: string) => {
    try {
      setSchedulesLoading(true);
      const response = await vaccineService.getVaccineSchedulesByVaccine(vaccineId);
      console.log('API Response:', response);
      if (response && response.lichTiemChuans) {
        console.log('Setting schedules:', response.lichTiemChuans);
        setSchedules(response.lichTiemChuans);
      } else {
        console.log('No schedules found in response');
      }
    } catch (error) {
      console.error('Error loading schedules:', error);
      showError("Lỗi", "Không thể tải lịch tiêm chuẩn");
    } finally {
      setSchedulesLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadVaccine(id);
      loadSchedules(id).catch(console.error);
    }
  }, [id]);

  const handleAddSchedule = async () => {
    if (!id) return;
    
    try {
      const scheduleData = {
        maVaccine: id,
        muiThu: formData.muiThu,
        tuoiThangToiThieu: formData.tuoiThangToiThieu ? parseInt(formData.tuoiThangToiThieu) : null,
        tuoiThangToiDa: formData.tuoiThangToiDa ? parseInt(formData.tuoiThangToiDa) : null,
        soNgaySauMuiTruoc: formData.soNgaySauMuiTruoc ? parseInt(formData.soNgaySauMuiTruoc) : null,
        ghiChu: formData.ghiChu.trim() || null
      };

      await vaccineService.createVaccineSchedule(scheduleData);
      showSuccess("Thành công", "Thêm lịch tiêm chuẩn thành công");
      setShowAddScheduleModal(false);
      resetForm();
      loadSchedules(id).catch(console.error);
    } catch (error) {
      showError("Lỗi", "Thêm lịch tiêm chuẩn thất bại");
    }
  };

  const handleUpdateSchedule = async () => {
    if (!editingSchedule || !id) return;
    
    try {
      const updateData = {
        muiThu: formData.muiThu,
        tuoiThangToiThieu: formData.tuoiThangToiThieu ? parseInt(formData.tuoiThangToiThieu) : null,
        tuoiThangToiDa: formData.tuoiThangToiDa ? parseInt(formData.tuoiThangToiDa) : null,
        soNgaySauMuiTruoc: formData.soNgaySauMuiTruoc ? parseInt(formData.soNgaySauMuiTruoc) : null,
        ghiChu: formData.ghiChu.trim() || null
      };

      await vaccineService.updateVaccineSchedule(editingSchedule.maLichTiemChuan, updateData);
      showSuccess("Thành công", "Cập nhật lịch tiêm chuẩn thành công");
      setEditingSchedule(null);
      resetForm();
      loadSchedules(id).catch(console.error);
    } catch (error) {
      showError("Lỗi", "Cập nhật lịch tiêm chuẩn thất bại");
    }
  };

  const handleDeleteSchedule = async (scheduleId: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa lịch tiêm chuẩn này?')) return;
    
    try {
      await vaccineService.deleteVaccineSchedule(scheduleId);
      showSuccess("Thành công", "Xóa lịch tiêm chuẩn thành công");
      loadSchedules(id!).catch(console.error);
    } catch (error) {
      showError("Lỗi", "Xóa lịch tiêm chuẩn thất bại");
    }
  };

  const openEditModal = (schedule: any) => {
    setEditingSchedule(schedule);
    setFormData({
      muiThu: schedule.muiThu,
      tuoiThangToiThieu: schedule.tuoiThangToiThieu?.toString() || '',
      tuoiThangToiDa: schedule.tuoiThangToiDa?.toString() || '',
      soNgaySauMuiTruoc: schedule.soNgaySauMuiTruoc?.toString() || '',
      ghiChu: schedule.ghiChu || ''
    });
  };

  const resetForm = () => {
    setFormData({
      muiThu: 1,
      tuoiThangToiThieu: '',
      tuoiThangToiDa: '',
      soNgaySauMuiTruoc: '',
      ghiChu: ''
    });
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
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
              <p className="text-red-700 mt-1">{error}</p>
              <button
                onClick={() => {
                  if (id) {
                    loadVaccine(id);
                    loadSchedules(id).catch(console.error);
                  }
                }}
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
            Chi Tiết Vaccine
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Mã: {vaccine.maVaccine}
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => navigate('/dashboard/vaccine-manage')}
            className="inline-flex items-center justify-center rounded-md border border-stroke bg-white py-2 px-6 text-center font-medium text-black hover:bg-gray-50 dark:border-strokedark dark:bg-boxdark dark:text-white dark:hover:bg-boxdark-2"
          >
            Quay lại
          </button>
          <button
            onClick={() => navigate(`/dashboard/vaccine-manage/edit/${vaccine.maVaccine}`)}
            className="inline-flex items-center justify-center rounded-md bg-primary py-2 px-6 text-center font-medium text-white hover:bg-opacity-90"
          >
            Chỉnh sửa
          </button>
        </div>
      </div>


      {/* Vaccine Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Basic Information */}
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <h3 className="text-lg font-semibold mb-4 text-black dark:text-white">
            Thông Tin Cơ Bản
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Tên Vaccine
              </label>
              <p className="text-lg font-medium text-black dark:text-white">
                {vaccine.ten}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Nhà Sản Xuất
              </label>
              <p className="text-black dark:text-white">
                {vaccine.nhaSanXuat || 'Chưa cập nhật'}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Tuổi Bắt Đầu
                </label>
                <p className="text-black dark:text-white">
                  {vaccine.tuoiBatDauTiem ? `${vaccine.tuoiBatDauTiem} tháng` : 'Chưa cập nhật'}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Tuổi Kết Thúc
                </label>
                <p className="text-black dark:text-white">
                  {vaccine.tuoiKetThucTiem ? `${vaccine.tuoiKetThucTiem} tháng` : 'Chưa cập nhật'}
                </p>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Trạng Thái
              </label>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                vaccine.isActive 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {vaccine.isActive ? 'Hoạt động' : 'Vô hiệu'}
              </span>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <h3 className="text-lg font-semibold mb-4 text-black dark:text-white">
            Thông Tin Bổ Sung
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Hướng Dẫn Sử Dụng
              </label>
              <p className="text-black dark:text-white">
                {vaccine.huongDanSuDung || 'Chưa cập nhật'}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Phòng Ngừa
              </label>
              <p className="text-black dark:text-white">
                {vaccine.phongNgua || 'Chưa cập nhật'}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Ngày Tạo
                </label>
                <p className="text-black dark:text-white">
                  {vaccine.ngayTao ? new Date(vaccine.ngayTao).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Ngày Cập Nhật
                </label>
                <p className="text-black dark:text-white">
                    {vaccine.ngayCapNhat ? new Date(vaccine.ngayCapNhat).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lịch Tiêm Chuẩn */}
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
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
                    Số mũi tiêm
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
                  <tr key={schedule.maLichTiemChuan}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {schedule.muiThu}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {schedule.tuoiThangToiThieu >= 0 ? `${schedule.tuoiThangToiThieu} tháng` : 'Không giới hạn'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {schedule.tuoiThangToiDa >= 0 ? `${schedule.tuoiThangToiDa} tháng` : 'Không giới hạn'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {schedule.soNgaySauMuiTruoc ? `${schedule.soNgaySauMuiTruoc} ngày` : 'Không giới hạn'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {schedule.ghiChu || 'Không có'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => openEditModal(schedule)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDeleteSchedule(schedule.maLichTiemChuan)}
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

      {/* Action Buttons */}
      <div className="mt-6 flex justify-center space-x-4">
        <button
          onClick={() => navigate('/dashboard/vaccine-manage')}
          className="px-6 py-2 border border-stroke rounded hover:bg-gray-50 dark:border-strokedark dark:hover:bg-boxdark-2"
        >
          Quay lại danh sách
        </button>
        
        <button
          onClick={() => navigate(`/dashboard/vaccine-manage/edit/${vaccine.maVaccine}`)}
          className="px-6 py-2 bg-primary text-white rounded hover:bg-opacity-90"
        >
          Chỉnh sửa vaccine
        </button>
      </div>

      {/* Add Schedule Modal */}
      {showAddScheduleModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Thêm Lịch Tiêm Chuẩn</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số mũi tiêm <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.muiThu}
                  onChange={(e) => setFormData({...formData, muiThu: parseInt(e.target.value)})}
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
                  value={formData.tuoiThangToiThieu}
                  onChange={(e) => setFormData({...formData, tuoiThangToiThieu: e.target.value})}
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
                  value={formData.tuoiThangToiDa}
                  onChange={(e) => setFormData({...formData, tuoiThangToiDa: e.target.value})}
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
                  value={formData.soNgaySauMuiTruoc}
                  onChange={(e) => setFormData({...formData, soNgaySauMuiTruoc: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Để trống nếu không giới hạn"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ghi Chú
                </label>
                <textarea
                  value={formData.ghiChu}
                  onChange={(e) => setFormData({...formData, ghiChu: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ghi chú về lịch tiêm này..."
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowAddScheduleModal(false);
                    resetForm();
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
                  Số mũi tiêm <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.muiThu}
                  onChange={(e) => setFormData({...formData, muiThu: parseInt(e.target.value)})}
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
                  value={formData.tuoiThangToiThieu}
                  onChange={(e) => setFormData({...formData, tuoiThangToiThieu: e.target.value})}
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
                  value={formData.tuoiThangToiDa}
                  onChange={(e) => setFormData({...formData, tuoiThangToiDa: e.target.value})}
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
                  value={formData.soNgaySauMuiTruoc}
                  onChange={(e) => setFormData({...formData, soNgaySauMuiTruoc: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Để trống nếu không giới hạn"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ghi Chú
                </label>
                <textarea
                  value={formData.ghiChu}
                  onChange={(e) => setFormData({...formData, ghiChu: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ghi chú về lịch tiêm này..."
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setEditingSchedule(null);
                    resetForm();
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

export default VaccineDetailPage; 