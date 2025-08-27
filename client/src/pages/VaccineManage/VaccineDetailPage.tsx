import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CardDataStats from '../../components/CardDataStats';
import { useVaccine, useVaccineUsage } from '../../hooks/useVaccine';
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

  const {
    data: usage,
    loading: usageLoading,
    error: usageError,
    execute: loadUsage
  } = useVaccineUsage();

  const loading = vaccineLoading || usageLoading;
  const error = vaccineError || usageError;

  useEffect(() => {
    if (id) {
      loadVaccine(id);
      loadUsage(id);
    }
  }, [id, loadVaccine, loadUsage]);

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
                    loadUsage(id);
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
          onClick={() => navigate('/vaccine-manage')}
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
            onClick={() => navigate('/vaccine-manage')}
            className="inline-flex items-center justify-center rounded-md border border-stroke bg-white py-2 px-6 text-center font-medium text-black hover:bg-gray-50 dark:border-strokedark dark:bg-boxdark dark:text-white dark:hover:bg-boxdark-2"
          >
            Quay lại
          </button>
          <button
            onClick={() => navigate(`/vaccine-manage/edit/${vaccine.maVaccine}`)}
            className="inline-flex items-center justify-center rounded-md bg-primary py-2 px-6 text-center font-medium text-white hover:bg-opacity-90"
          >
            Chỉnh sửa
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {usage && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5 mb-6">
          <CardDataStats
            title="Số Lượng Sử Dụng"
            total={usage.soLuongSuDung.toString()}
            rate=""
            levelUp
          >
            <div className="text-sm text-gray-600">Phiếu tiêm</div>
          </CardDataStats>
          <CardDataStats
            title="Số Lượng Lịch Hẹn"
            total={usage.soLuongLichHen.toString()}
            rate=""
            levelUp
          >
            <div className="text-sm text-gray-600">Lịch hẹn</div>
          </CardDataStats>
          <CardDataStats
            title="Số Lượng Lịch Tiêm Chuẩn"
            total={usage.soLuongLichTiemChuan.toString()}
            rate=""
            levelUp
          >
            <div className="text-sm text-gray-600">Lịch tiêm chuẩn</div>
          </CardDataStats>
          <CardDataStats
            title="Số Lượng Lô Vaccine"
            total={usage.soLuongLoVaccine.toString()}
            rate=""
            levelUp
          >
            <div className="text-sm text-gray-600">Lô vaccine</div>
          </CardDataStats>
        </div>
      )}

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

      {/* Usage Statistics */}
      {usage && (
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <h3 className="text-lg font-semibold mb-4 text-black dark:text-white">
            Thống Kê Sử Dụng
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gray-50 dark:bg-boxdark-2 rounded-lg">
              <div className="text-2xl font-bold text-primary mb-2">
                {usage.soLuongSuDung}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Phiếu Tiêm
              </div>
            </div>
            
            <div className="text-center p-4 bg-gray-50 dark:bg-boxdark-2 rounded-lg">
              <div className="text-2xl font-bold text-blue-500 mb-2">
                {usage.soLuongLichHen}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Lịch Hẹn
              </div>
            </div>
            
            <div className="text-center p-4 bg-gray-50 dark:bg-boxdark-2 rounded-lg">
              <div className="text-2xl font-bold text-green-500 mb-2">
                {usage.soLuongLichTiemChuan}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Lịch Tiêm Chuẩn
              </div>
            </div>
            
            <div className="text-center p-4 bg-gray-50 dark:bg-boxdark-2 rounded-lg">
              <div className="text-2xl font-bold text-purple-500 mb-2">
                {usage.soLuongLoVaccine}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Lô Vaccine
              </div>
            </div>
            
            <div className="text-center p-4 bg-gray-50 dark:bg-boxdark-2 rounded-lg">
              <div className="text-2xl font-bold text-orange-500 mb-2">
                {usage.soLuongDichVu}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Dịch Vụ
              </div>
            </div>
            
            <div className="text-center p-4 bg-gray-50 dark:bg-boxdark-2 rounded-lg">
              <div className="text-2xl font-bold text-red-500 mb-2">
                {usage.soLuongDonHang}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Đơn Hàng
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-6 flex justify-center space-x-4">
        <button
          onClick={() => navigate('/vaccine-manage')}
          className="px-6 py-2 border border-stroke rounded hover:bg-gray-50 dark:border-strokedark dark:hover:bg-boxdark-2"
        >
          Quay lại danh sách
        </button>
        
        <button
          onClick={() => navigate(`/vaccine-manage/edit/${vaccine.maVaccine}`)}
          className="px-6 py-2 bg-primary text-white rounded hover:bg-opacity-90"
        >
          Chỉnh sửa vaccine
        </button>
      </div>
    </div>
  );
};

export default VaccineDetailPage; 