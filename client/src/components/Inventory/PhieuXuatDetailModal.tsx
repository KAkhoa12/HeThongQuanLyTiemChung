import React, { useEffect, useState } from 'react';
import { usePhieuXuat } from '../../hooks';
import { ChiTietXuatDto } from '../../services/phieuXuat.service';
import { TrangThaiPhieuKho } from '../../types/khoTypes';
import NotificationModal from './NotificationModal';
import { generatePDF, downloadPDF, formatDate } from '../../utils/pdfUtils';

interface PhieuXuatDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  phieuXuatId: string;
}

const PhieuXuatDetailModal: React.FC<PhieuXuatDetailModalProps> = ({
  isOpen,
  onClose,
  phieuXuatId,
}) => {
  const {
    data: phieuXuatDetail,
    loading,
    execute: fetchPhieuXuatDetail,
  } = usePhieuXuat(null);
  const [notification, setNotification] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
  });

  useEffect(() => {
    if (isOpen && phieuXuatId) {
      fetchPhieuXuatDetail(phieuXuatId);
    }
  }, [isOpen, phieuXuatId]);

  const getStatusText = (status: string) => {
    return status === TrangThaiPhieuKho.Approved
      ? 'Đã xác nhận'
      : status === TrangThaiPhieuKho.Pending
      ? 'Chờ xác nhận'
      : 'Đã hủy';
  };

  const handleExportPDF = async () => {
    if (!phieuXuatDetail) return;

    // Basic information
    const basicInfo = {
      'Mã phiếu xuất': phieuXuatDetail.maPhieuXuat,
      'Trạng thái': getStatusText(phieuXuatDetail.trangThai || ''),
      'Địa điểm xuất': phieuXuatDetail.tenDiaDiemXuat || '-',
      'Địa điểm nhập': phieuXuatDetail.tenDiaDiemNhap || '-',
      'Ngày xuất': phieuXuatDetail.ngayXuat
        ? formatDate(phieuXuatDetail.ngayXuat)
        : '-',
      'Loại xuất': phieuXuatDetail.loaiXuat || '-',
      'Người quản lý': phieuXuatDetail.tenQuanLy || '-',
      'Ngày tạo': phieuXuatDetail.ngayTao
        ? formatDate(phieuXuatDetail.ngayTao)
        : '-',
    };

    // Table data
    let tableData = undefined;
    if (
      phieuXuatDetail.chiTietXuats &&
      phieuXuatDetail.chiTietXuats.length > 0
    ) {
      tableData = {
        headers: ['Mã chi tiết', 'Số lô', 'Tên vaccine', 'Số lượng'],
        rows: phieuXuatDetail.chiTietXuats.map((chiTiet: ChiTietXuatDto) => [
          chiTiet.maChiTietXuat,
          chiTiet.soLo || '-',
          chiTiet.tenVaccine || '-',
          chiTiet.soLuong || 0,
        ]),
      };
    }

    // Summary data
    const summaryData = {
      'Tổng số lượng xuất':
        phieuXuatDetail.chiTietXuats?.reduce(
          (sum, ct) => sum + (ct.soLuong || 0),
          0,
        ) || 0,
      'Số loại vaccine': phieuXuatDetail.chiTietXuats?.length || 0,
    };

    const doc = generatePDF(
      'PHIEU XUAT VACCINE',
      basicInfo,
      tableData,
      summaryData,
    );

    await downloadPDF(doc, `PhieuXuat_${phieuXuatDetail.maPhieuXuat}.pdf`);
  };

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl relative">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              Chi tiết Phiếu Xuất
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : phieuXuatDetail ? (
            <div className="space-y-6">
              {/* Thông tin cơ bản */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-lg font-medium text-gray-900 mb-4">
                  Thông tin cơ bản
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Mã phiếu xuất
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {phieuXuatDetail.maPhieuXuat}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Trạng thái
                    </label>
                    <p
                      className={`inline-flex rounded-full py-1 px-3 text-sm font-medium mt-1 ${
                        phieuXuatDetail.trangThai === TrangThaiPhieuKho.Approved
                          ? 'bg-success bg-opacity-10 text-success'
                          : phieuXuatDetail.trangThai ===
                            TrangThaiPhieuKho.Pending
                          ? 'bg-warning bg-opacity-10 text-warning'
                          : 'bg-danger bg-opacity-10 text-danger'
                      }`}
                    >
                      {phieuXuatDetail.trangThai === TrangThaiPhieuKho.Approved
                        ? 'Đã xác nhận'
                        : phieuXuatDetail.trangThai ===
                          TrangThaiPhieuKho.Pending
                        ? 'Chờ xác nhận'
                        : 'Đã hủy'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Địa điểm xuất
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {phieuXuatDetail.tenDiaDiemXuat || '-'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Địa điểm nhập
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {phieuXuatDetail.tenDiaDiemNhap || '-'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Ngày xuất
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {phieuXuatDetail.ngayXuat
                        ? formatDate(phieuXuatDetail.ngayXuat)
                        : '-'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Loại xuất
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {phieuXuatDetail.loaiXuat || '-'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Người quản lý
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {phieuXuatDetail.tenQuanLy || '-'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Ngày tạo
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {phieuXuatDetail.ngayTao
                        ? formatDate(phieuXuatDetail.ngayTao)
                        : '-'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Chi tiết xuất */}
              {phieuXuatDetail.chiTietXuats &&
                phieuXuatDetail.chiTietXuats.length > 0 && (
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">
                      Chi tiết xuất
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="w-full table-auto">
                        <thead>
                          <tr className="bg-gray-2 text-left dark:bg-meta-4">
                            <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                              Mã chi tiết
                            </th>
                            <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                              Số lô
                            </th>
                            <th className="min-w-[200px] py-4 px-4 font-medium text-black dark:text-white">
                              Tên vaccine
                            </th>
                            <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                              Số lượng
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {phieuXuatDetail.chiTietXuats.map(
                            (chiTiet: ChiTietXuatDto, index: number) => (
                              <tr
                                key={chiTiet.maChiTietXuat}
                                className={
                                  index % 2 === 0
                                    ? 'bg-white'
                                    : 'bg-gray-1 dark:bg-meta-4'
                                }
                              >
                                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                  <p className="text-black dark:text-white">
                                    {chiTiet.maChiTietXuat}
                                  </p>
                                </td>
                                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                  <p className="text-black dark:text-white">
                                    {chiTiet.soLo || '-'}
                                  </p>
                                </td>
                                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                  <p className="text-black dark:text-white">
                                    {chiTiet.tenVaccine || '-'}
                                  </p>
                                </td>
                                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                  <p className="text-black dark:text-white">
                                    {chiTiet.soLuong || 0}
                                  </p>
                                </td>
                              </tr>
                            ),
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

              {/* Buttons */}
              <div className="flex justify-end space-x-4 pt-6 border-t">
                <button
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Đóng
                </button>
                {phieuXuatDetail &&
                  phieuXuatDetail.trangThai === TrangThaiPhieuKho.Approved && (
                    <button
                      onClick={handleExportPDF}
                      className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      <i className="ri-file-pdf-line mr-2"></i>
                      Xuất PDF
                    </button>
                  )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">
                Không tìm thấy thông tin phiếu xuất
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Notification Modal */}
      <NotificationModal
        isOpen={notification.isOpen}
        onClose={() => setNotification((prev) => ({ ...prev, isOpen: false }))}
        title={notification.title}
        message={notification.message}
        type={notification.type}
      />
    </div>
  );
};

export default PhieuXuatDetailModal;
