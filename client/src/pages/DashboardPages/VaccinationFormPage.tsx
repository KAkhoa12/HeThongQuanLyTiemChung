import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useKeHoachTiemMinimumPendingByOrder, useKeHoachTiemCheckRemainingPending } from '../../hooks/useKeHoachTiem';
import { useAuth } from '../../hooks';
import apiService from '../../services/api.service';

interface VaccinationFormData {
  maBacSi: string;
  ngayTiem: string;
  phanUng?: string;
  moTaPhanUng?: string;
  chiTietPhieuTiems: {
    maVaccine: string;
    muiTiemThucTe: number;
    thuTu: number;
  }[];
}

const VaccinationFormPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  console.log(user);
  
  const [formData, setFormData] = useState<VaccinationFormData>({
    maBacSi: '',
    ngayTiem: new Date().toISOString().split('T')[0],
    phanUng: '',
    moTaPhanUng: '',
    chiTietPhieuTiems: []
  });
  
  const [doctorInfo, setDoctorInfo] = useState<any>(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasRemainingPending, setHasRemainingPending] = useState(false);
  const [nextAppointmentData, setNextAppointmentData] = useState({
    ngayHen: '',
    ghiChu: ''
  });

  const { data: keHoachData, loading: keHoachLoading, error: keHoachError, execute } = useKeHoachTiemMinimumPendingByOrder();
  const { data: remainingPendingData, execute: executeCheckRemaining } = useKeHoachTiemCheckRemainingPending();

  // Lấy thông tin bác sĩ từ API profile
  useEffect(() => {
    const fetchDoctorInfo = async () => {
      try {
        console.log('Fetching doctor profile...');
        const profileData = await apiService.get('/api/users/profile');
        console.log('Doctor profile data:', profileData);
        setDoctorInfo(profileData);
      } catch (err) {
        console.error('Error fetching doctor profile:', err);
      }
    };

    fetchDoctorInfo();
  }, []);

  // Lấy dữ liệu kế hoạch tiêm khi component mount
  useEffect(() => {
    if (orderId) {
      console.log('VaccinationFormPage - calling API for orderId:', orderId);
      execute({ orderId });
    }
  }, [execute, orderId]);

  // Cập nhật formData khi có dữ liệu kế hoạch và thông tin bác sĩ
  useEffect(() => {
    if (keHoachData?.plans && doctorInfo) {
      const chiTietPhieuTiems = keHoachData.plans.map((plan, index) => ({
        maVaccine: plan.maVaccine,
        muiTiemThucTe: plan.muiThu,
        thuTu: index + 1
      }));

      setFormData(prev => ({
        ...prev,
        maBacSi: doctorInfo.info?.maBacSi || '', // ✅ Sử dụng maBacSi từ doctorInfo.info
        chiTietPhieuTiems
      }));
    }
  }, [keHoachData, doctorInfo]);

  // Xử lý kết quả kiểm tra kế hoạch còn PENDING
  useEffect(() => {
    if (remainingPendingData) {
      console.log('Remaining pending data:', remainingPendingData);
      setHasRemainingPending(remainingPendingData.hasRemainingPending);
      
      // Nếu còn PENDING, set ngày hẹn mặc định là 7 ngày sau
      if (remainingPendingData.hasRemainingPending) {
        const nextDate = new Date();
        nextDate.setDate(nextDate.getDate() + 7);
        setNextAppointmentData(prev => ({
          ...prev,
          ngayHen: nextDate.toISOString().split('T')[0]
        }));
      }
    }
  }, [remainingPendingData]);

  // Xử lý submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Kiểm tra maBacSi có giá trị không
    if (!formData.maBacSi) {
      setError('Không tìm thấy thông tin bác sĩ. Vui lòng thử lại.');
      setLoading(false);
      return;
    }

    try {
      // Tạo phiếu tiêm mới
      const phieuTiemData = {
        ngayTiem: formData.ngayTiem,
        maBacSi: formData.maBacSi,
        maDichVu: keHoachData?.plans[0]?.maDichVu || '',
        maNguoiDung: keHoachData?.plans[0]?.maNguoiDung || '',
        maKeHoachTiem: keHoachData?.plans[0]?.maKeHoachTiem || '',
        trangThai: 'COMPLETED',
        phanUng: formData.phanUng || null,
        moTaPhanUng: formData.moTaPhanUng || null,
        chiTietPhieuTiems: formData.chiTietPhieuTiems.map((chiTiet) => ({
          maVaccine: chiTiet.maVaccine,
          muiTiemThucTe: chiTiet.muiTiemThucTe,
          thuTu: chiTiet.thuTu
        }))
      };

      console.log('Creating phiếu tiêm with data:', phieuTiemData);
      console.log('maBacSi value:', formData.maBacSi);
      console.log('doctorInfo.info:', doctorInfo?.info);

      const result = await apiService.create('/api/phieu-tiem', phieuTiemData);
      console.log('Phiếu tiêm created successfully:', result);

      // Cập nhật trạng thái tất cả kế hoạch tiêm có cùng mũi thứ thành COMPLETED
      if (keHoachData?.plans && keHoachData.plans.length > 0) {
        console.log('Updating all ke hoach tiem with mui thu:', keHoachData.minMuiThu, 'to COMPLETED');
        await apiService.update('/api/ke-hoach-tiem/update-status-by-mui-thu', {
          orderId: orderId,
          muiThu: keHoachData.minMuiThu,
          status: 'COMPLETED'
        });
      }

      // Cập nhật trạng thái lịch hẹn hiện tại thành COMPLETED
      if (orderId) {
        console.log('Updating current appointment status to COMPLETED for orderId:', orderId);
        try {
          await apiService.update('/api/lich-hen/update-status-by-order', {
            orderId: orderId,
            status: 'COMPLETED'
          });
          console.log('Appointment status updated successfully');
        } catch (err) {
          console.error('Error updating appointment status:', err);
          // Không throw error vì việc cập nhật lịch hẹn không quan trọng bằng việc tạo phiếu tiêm
        }
      }

      // Kiểm tra còn kế hoạch tiêm PENDING không
      if (orderId) {
        console.log('Checking remaining pending plans for orderId:', orderId);
        await executeCheckRemaining({ orderId });
      }

      alert('Lập phiếu tiêm thành công!');
    } catch (err: any) {
      console.error('Error creating phiếu tiêm:', err);
      setError(err?.message || 'Có lỗi xảy ra khi lập phiếu tiêm');
    } finally {
      setLoading(false);
    }
  };

  // Xử lý thay đổi input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Xử lý thay đổi input cho lịch hẹn tiếp theo
  const handleNextAppointmentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNextAppointmentData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Tạo lịch hẹn cho đợt tiếp theo
  const handleCreateNextAppointment = async () => {
    if (!orderId || !nextAppointmentData.ngayHen) {
      alert('Vui lòng nhập đầy đủ thông tin lịch hẹn');
      return;
    }

    try {
      setLoading(true);
      
      // Tạo lịch hẹn mới
      const lichHenData = {
        maDonHang: orderId,
        ngayHen: nextAppointmentData.ngayHen,
        trangThai: 'NOTIFICATION',
        ghiChu: nextAppointmentData.ghiChu || `Lịch hẹn tiêm mũi thứ ${remainingPendingData?.nextMuiThu || ''}`
      };

      console.log('Creating next appointment with data:', lichHenData);
      
      await apiService.create('/api/lich-hen', lichHenData);
      
      alert('Tạo lịch hẹn cho đợt tiếp theo thành công!');
      navigate('/dashboard/vaccination/schedule');
    } catch (err: any) {
      console.error('Error creating next appointment:', err);
      alert('Có lỗi xảy ra khi tạo lịch hẹn: ' + (err?.message || 'Lỗi không xác định'));
    } finally {
      setLoading(false);
    }
  };

  // Hoàn thành quá trình (không tạo lịch hẹn tiếp theo)
  const handleComplete = () => {
    alert('Hoàn thành quá trình tiêm chủng!');
    navigate('/dashboard/vaccination/schedule');
  };

  if (keHoachLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (keHoachError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Lỗi khi tải dữ liệu
            </h3>
            <div className="mt-2 text-sm text-red-700">
              {keHoachError}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          Lập Phiếu Tiêm
        </h2>
        <button
          onClick={() => navigate('/dashboard/vaccination/schedule')}
          className="inline-flex items-center justify-center rounded-md bg-gray-500 py-2 px-4 text-center font-medium text-white hover:bg-opacity-90"
        >
          Quay lại
        </button>
      </div>

      {/* Thông tin đơn hàng */}
      <div className="mb-6 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Thông tin Đơn hàng
          </h3>
        </div>
        <div className="p-6.5">
          {keHoachData && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2.5 block text-black dark:text-white">
                  Mã đơn hàng
                </label>
                <p className="text-black dark:text-white">{keHoachData.orderId}</p>
              </div>
              <div>
                <label className="mb-2.5 block text-black dark:text-white">
                  Khách hàng
                </label>
                <p className="text-black dark:text-white">{keHoachData.plans[0]?.customerName}</p>
              </div>
              <div>
                <label className="mb-2.5 block text-black dark:text-white">
                  Mũi tiêm hiện tại
                </label>
                <p className="text-black dark:text-white">Mũi thứ {keHoachData.minMuiThu}</p>
              </div>
              <div>
                <label className="mb-2.5 block text-black dark:text-white">
                  Số vaccine sẽ tiêm
                </label>
                <p className="text-black dark:text-white">{keHoachData.totalPlans} vaccine</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Form lập phiếu tiêm */}
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Thông tin Phiếu Tiêm
          </h3>
        </div>
        <div className="p-6.5">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2.5 block text-black dark:text-white">
                  Ngày tiêm <span className="text-meta-1">*</span>
                </label>
                <input
                  type="date"
                  name="ngayTiem"
                  value={formData.ngayTiem}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
              </div>
              <div>
                <label className="mb-2.5 block text-black dark:text-white">
                  Bác sĩ thực hiện
                </label>
                <input
                  type="text"
                  value={doctorInfo?.ten || ''}
                  disabled
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="mb-2.5 block text-black dark:text-white">
                Phản ứng phụ (nếu có)
              </label>
              <input
                type="text"
                name="phanUng"
                value={formData.phanUng}
                onChange={handleInputChange}
                placeholder="Nhập phản ứng phụ nếu có"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
            </div>

            <div className="mt-4">
              <label className="mb-2.5 block text-black dark:text-white">
                Mô tả phản ứng phụ
              </label>
              <textarea
                name="moTaPhanUng"
                value={formData.moTaPhanUng}
                onChange={handleInputChange}
                rows={3}
                placeholder="Mô tả chi tiết phản ứng phụ"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
            </div>

            {/* Danh sách vaccine sẽ tiêm */}
            <div className="mt-6">
              <h4 className="mb-4 text-lg font-medium text-black dark:text-white">
                Danh sách Vaccine sẽ tiêm
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-gray-2 text-left dark:bg-meta-4">
                      <th className="py-4 px-4 font-medium text-black dark:text-white">
                        Tên Vaccine
                      </th>
                      <th className="py-4 px-4 font-medium text-black dark:text-white">
                        Mũi thứ
                      </th>
                      <th className="py-4 px-4 font-medium text-black dark:text-white">
                        Dịch vụ
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {keHoachData?.plans.map((plan) => (
                      <tr key={plan.maKeHoachTiem} className="border-b border-stroke dark:border-strokedark">
                        <td className="py-5 px-4">
                          <p className="text-black dark:text-white">{plan.vaccineName}</p>
                        </td>
                        <td className="py-5 px-4">
                          <p className="text-black dark:text-white">{plan.muiThu}</p>
                        </td>
                        <td className="py-5 px-4">
                          <p className="text-black dark:text-white">{plan.serviceName}</p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            <div className="mt-6 flex justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate('/dashboard/vaccination/schedule')}
                className="rounded bg-gray-500 py-2 px-4 font-medium text-white hover:bg-opacity-90"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={loading}
                className="rounded bg-primary py-2 px-4 font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
              >
                {loading ? 'Đang xử lý...' : 'Lập Phiếu Tiêm'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Section tạo lịch hẹn cho đợt tiếp theo */}
      {hasRemainingPending && (
        <div className="mt-6 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Tạo Lịch Hẹn Cho Đợt Tiếp Theo
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Còn {remainingPendingData?.remainingCount} kế hoạch tiêm PENDING. Mũi tiếp theo: {remainingPendingData?.nextMuiThu}
            </p>
          </div>
          <div className="p-6.5">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2.5 block text-black dark:text-white">
                  Ngày hẹn tiếp theo <span className="text-meta-1">*</span>
                </label>
                <input
                  type="date"
                  name="ngayHen"
                  value={nextAppointmentData.ngayHen}
                  onChange={handleNextAppointmentChange}
                  required
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
              </div>
              <div>
                <label className="mb-2.5 block text-black dark:text-white">
                  Ghi chú
                </label>
                <input
                  type="text"
                  name="ghiChu"
                  value={nextAppointmentData.ghiChu}
                  onChange={handleNextAppointmentChange}
                  placeholder="Ghi chú cho lịch hẹn tiếp theo"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-4">
              <button
                type="button"
                onClick={handleComplete}
                className="rounded bg-gray-500 py-2 px-4 font-medium text-white hover:bg-opacity-90"
              >
                Hoàn thành (Không tạo lịch hẹn)
              </button>
              <button
                type="button"
                onClick={handleCreateNextAppointment}
                disabled={loading}
                className="rounded bg-green-600 py-2 px-4 font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
              >
                {loading ? 'Đang tạo...' : 'Tạo Lịch Hẹn Tiếp Theo'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Thông báo hoàn thành nếu không còn PENDING */}
      {!hasRemainingPending && remainingPendingData && (
        <div className="mt-6 rounded-sm border border-green-200 bg-green-50 shadow-default dark:border-green-800 dark:bg-green-900/20">
          <div className="p-6.5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800 dark:text-green-200">
                  Hoàn thành tất cả kế hoạch tiêm!
                </h3>
                <div className="mt-2 text-sm text-green-700 dark:text-green-300">
                  <p>Đã hoàn thành {remainingPendingData.completedPlans}/{remainingPendingData.totalPlans} kế hoạch tiêm.</p>
                  <p>Không còn kế hoạch tiêm PENDING nào.</p>
                </div>
                <div className="mt-4">
                  <button
                    onClick={handleComplete}
                    className="rounded bg-green-600 py-2 px-4 font-medium text-white hover:bg-opacity-90"
                  >
                    Hoàn thành
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VaccinationFormPage;