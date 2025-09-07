import React, { useEffect } from 'react';
import { usePhieuThanhLy } from '../../hooks';
import { ChiTietThanhLyDto } from '../../services/phieuThanhLy.service';
import { generatePDF, downloadPDF, formatDate } from '../../utils/pdfUtils';
import { TrangThaiPhieuKho } from '../../types/khoTypes';

interface PhieuThanhLyDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  phieuThanhLyId: string;
}

const PhieuThanhLyDetailModal: React.FC<PhieuThanhLyDetailModalProps> = ({
  isOpen,
  onClose,
  phieuThanhLyId
}) => {
  const { data: phieuThanhLyDetail, loading, execute: fetchPhieuThanhLyDetail } = usePhieuThanhLy(phieuThanhLyId);

  useEffect(() => {
    if (isOpen && phieuThanhLyId) {
      fetchPhieuThanhLyDetail(phieuThanhLyId);
    }
  }, [isOpen, phieuThanhLyId]);

  const handleExportPDF = async () => {
    if (!phieuThanhLyDetail) return;
    
    // Basic information
    const basicInfo = {
      'Mã phiếu thanh lý': phieuThanhLyDetail.maPhieuThanhLy,
      'Địa điểm': phieuThanhLyDetail.tenDiaDiem || '-',
      'Ngày thanh lý': phieuThanhLyDetail.ngayThanhLy ? formatDate(phieuThanhLyDetail.ngayThanhLy) : '-',
      'Trạng thái': getStatusText(phieuThanhLyDetail.trangThai || ''),
      'Ngày tạo': phieuThanhLyDetail.ngayTao ? formatDate(phieuThanhLyDetail.ngayTao) : '-',
      'Ngày cập nhật': phieuThanhLyDetail.ngayCapNhat ? formatDate(phieuThanhLyDetail.ngayCapNhat) : '-'
    };
    
    // Table data
    let tableData = undefined;
    if (phieuThanhLyDetail.chiTietThanhLies && phieuThanhLyDetail.chiTietThanhLies.length > 0) {
      tableData = {
        headers: ['Mã chi tiết', 'Số lô', 'Tên vaccine', 'Số lượng', 'Lý do thanh lý'],
        rows: phieuThanhLyDetail.chiTietThanhLies.map((chiTiet: ChiTietThanhLyDto) => [
          chiTiet.maChiTietThanhLy,
          chiTiet.soLo || '-',
          chiTiet.tenVaccine || '-',
          chiTiet.soLuong || 0,
          chiTiet.lyDo || '-'
        ])
      };
    }
    
    // Summary data
    const summaryData = {
      'Tổng số lượng thanh lý': phieuThanhLyDetail.chiTietThanhLies?.reduce((sum, ct) => sum + (ct.soLuong || 0), 0) || 0,
      'Số loại vaccine': phieuThanhLyDetail.chiTietThanhLies?.length || 0
    };
    
    const doc = generatePDF(
      'PHIEU THANH LY VACCINE',
      basicInfo,
      tableData,
      summaryData
    );
    
    await downloadPDF(doc, `PhieuThanhLy_${phieuThanhLyDetail.maPhieuThanhLy}.pdf`);
  };

  const getStatusText = (status: string) => {
    return status === 'Approved' ? 'Đã duyệt' : 
           status === 'Pending' ? 'Chờ duyệt' : 
           status === 'Rejected' ? 'Từ chối' : status;
  };

  const getStatusColor = (status: string) => {
    return status === 'Approved' 
      ? 'bg-success bg-opacity-10 text-success' 
      : status === 'Pending' 
      ? 'bg-warning bg-opacity-10 text-warning' 
      : status === 'Rejected'
      ? 'bg-danger bg-opacity-10 text-danger'
      : 'bg-gray bg-opacity-10 text-gray';
  };

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-[95vh] max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl relative">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              Chi tiết Phiếu Thanh Lý
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : phieuThanhLyDetail ? (
            <div className="space-y-6">
              {/* Thông tin cơ bản */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Thông tin cơ bản</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mã phiếu thanh lý
                    </label>
                    <p className="text-sm text-gray-900 font-medium">
                      {phieuThanhLyDetail.maPhieuThanhLy}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Địa điểm
                    </label>
                    <p className="text-sm text-gray-900">
                      {phieuThanhLyDetail.tenDiaDiem || '-'}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ngày thanh lý
                    </label>
                    <p className="text-sm text-gray-900">
                      {phieuThanhLyDetail.ngayThanhLy ? formatDate(phieuThanhLyDetail.ngayThanhLy) : '-'}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Trạng thái
                    </label>
                    <p className={`inline-flex rounded-full py-1 px-3 text-sm font-medium ${getStatusColor(phieuThanhLyDetail.trangThai || '')}`}>
                      {getStatusText(phieuThanhLyDetail.trangThai || '')}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ngày tạo
                    </label>
                    <p className="text-sm text-gray-900">
                      {phieuThanhLyDetail.ngayTao ? formatDate(phieuThanhLyDetail.ngayTao) : '-'}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ngày cập nhật
                    </label>
                    <p className="text-sm text-gray-900">
                      {phieuThanhLyDetail.ngayCapNhat ? formatDate(phieuThanhLyDetail.ngayCapNhat) : '-'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Chi tiết thanh lý */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Chi tiết thanh lý</h4>
                {phieuThanhLyDetail.chiTietThanhLies && phieuThanhLyDetail.chiTietThanhLies.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full table-auto">
                      <thead>
                        <tr className="bg-gray-2 text-left dark:bg-meta-4">
                          <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                            Mã chi tiết
                          </th>
                          <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                            Số lô
                          </th>
                          <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                            Tên vaccine
                          </th>
                          <th className="min-w-[100px] py-4 px-4 font-medium text-black dark:text-white">
                            Số lượng
                          </th>
                          <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                            Lý do thanh lý
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {phieuThanhLyDetail.chiTietThanhLies.map((chiTiet: ChiTietThanhLyDto, index: number) => (
                          <tr 
                            key={chiTiet.maChiTietThanhLy} 
                            className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-1 dark:bg-meta-4'}`}
                          >
                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark xl:pl-11">
                              <h5 className="font-medium text-black dark:text-white">
                                {chiTiet.maChiTietThanhLy}
                              </h5>
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
                              <p className="inline-flex rounded-full bg-info bg-opacity-10 py-1 px-3 text-sm font-medium text-info">
                                {chiTiet.soLuong || 0}
                              </p>
                            </td>
                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                              <p className="text-black dark:text-white">
                                {chiTiet.lyDo || '-'}
                              </p>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <i className="ri-file-list-line text-6xl text-gray-400 mb-4"></i>
                    <h3 className="text-lg font-medium text-black dark:text-white mb-2">
                      Không có chi tiết thanh lý
                    </h3>
                    <p className="text-body dark:text-bodydark">
                      Phiếu thanh lý này chưa có chi tiết nào
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <i className="ri-error-warning-line text-6xl text-red-400 mb-4"></i>
              <h3 className="text-lg font-medium text-black dark:text-white mb-2">
                Không tìm thấy phiếu thanh lý
              </h3>
              <p className="text-body dark:text-bodydark">
                Phiếu thanh lý không tồn tại hoặc đã bị xóa
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between pt-6 border-t mt-6">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Đóng
            </button>
            {
              phieuThanhLyDetail && phieuThanhLyDetail.trangThai === TrangThaiPhieuKho.Approved && (
              <button
                onClick={handleExportPDF}
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                <i className="ri-file-pdf-line mr-2"></i>
                Xuất PDF
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhieuThanhLyDetailModal;