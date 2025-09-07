import React, { useEffect } from 'react';
import { usePhieuNhap } from '../../hooks';
import { ChiTietNhapDto } from '../../services/phieuNhap.service';
import { TrangThaiPhieuKho } from '../../types/khoTypes';
import { generatePDF, downloadPDF, formatDate, formatCurrency } from '../../utils/pdfUtils';

interface PhieuNhapDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  phieuNhapId: string;
}

const PhieuNhapDetailModal: React.FC<PhieuNhapDetailModalProps> = ({
  isOpen,
  onClose,
  phieuNhapId
}) => {
  const { data: phieuNhapDetail, loading, execute: fetchPhieuNhapDetail } = usePhieuNhap();

  useEffect(() => {
    if (isOpen && phieuNhapId) {
      fetchPhieuNhapDetail(phieuNhapId);
    }
  }, [isOpen, phieuNhapId]);

  const handleExportPDF = async () => {
    if (!phieuNhapDetail) return;
    
    // Basic information
    const basicInfo = {
      'Mã phiếu nhập': phieuNhapDetail.maPhieuNhap,
      'Nhà cung cấp': phieuNhapDetail.tenNhaCungCap || '-',
      'Quản lý': phieuNhapDetail.tenQuanLy || '-',
      'Ngày nhập': phieuNhapDetail.ngayNhap ? formatDate(phieuNhapDetail.ngayNhap) : '-',
      'Tổng tiền': phieuNhapDetail.tongTien ? formatCurrency(phieuNhapDetail.tongTien) : '-',
      'Trạng thái': getStatusText(phieuNhapDetail.trangThai || ''),
      'Địa điểm nhập': phieuNhapDetail.tenDiaDiem || '-'
    };
    
    // Table data
    let tableData = undefined;
    if (phieuNhapDetail.chiTietNhaps && phieuNhapDetail.chiTietNhaps.length > 0) {
      tableData = {
        headers: ['Mã chi tiết', 'Số lô', 'Tên vaccine', 'Số lượng', 'Giá nhập', 'Thành tiền'],
        rows: phieuNhapDetail.chiTietNhaps.map((chiTiet: ChiTietNhapDto) => [
          chiTiet.maChiTiet,
          chiTiet.soLo || '-',
          chiTiet.tenVaccine || '-',
          chiTiet.soLuong || 0,
          chiTiet.gia ? formatCurrency(chiTiet.gia) : '-',
          chiTiet.soLuong && chiTiet.gia ? formatCurrency(chiTiet.soLuong * chiTiet.gia) : '-'
        ])
      };
    }
    
    // Summary data
    const totalQuantity = phieuNhapDetail.chiTietNhaps?.reduce((sum, ct) => sum + (ct.soLuong || 0), 0) || 0;
    const totalAmount = phieuNhapDetail.chiTietNhaps?.reduce((sum, ct) => sum + ((ct.soLuong || 0) * (ct.gia || 0)), 0) || 0;
    
    const summaryData = {
      'Tổng số lượng': totalQuantity,
      'Tổng tiền': formatCurrency(totalAmount),
      'Số loại vaccine': phieuNhapDetail.chiTietNhaps?.length || 0
    };
    
    const doc = generatePDF(
      'PHIEU NHAP VACCINE',
      basicInfo,
      tableData,
      summaryData
    );
    
    await downloadPDF(doc, `PhieuNhap_${phieuNhapDetail.maPhieuNhap}.pdf`);
  };

  const getStatusText = (status: string) => {
    return status === TrangThaiPhieuKho.Approved ? 'Đã xác nhận' : status === TrangThaiPhieuKho.Pending ? 'Chờ xác nhận' : 'Đã hủy';
  };

  const getStatusColor = (status: string) => {
    return status === TrangThaiPhieuKho.Approved 
      ? 'bg-success bg-opacity-10 text-success' 
      : status === TrangThaiPhieuKho.Pending ? 'bg-warning bg-opacity-10 text-warning' : 'bg-danger bg-opacity-10 text-danger';
  };

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-[95vh] max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl relative">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              Chi tiết Phiếu Nhập
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
          ) : phieuNhapDetail ? (
            <div className="space-y-6">
              {/* Thông tin cơ bản */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Thông tin cơ bản</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mã phiếu nhập
                    </label>
                    <p className="text-sm text-gray-900 font-medium">
                      {phieuNhapDetail.maPhieuNhap}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nhà cung cấp
                    </label>
                    <p className="text-sm text-gray-900">
                      {phieuNhapDetail.tenNhaCungCap || '-'}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quản lý 
                    </label>
                    <p className="text-sm text-gray-900">
                      {phieuNhapDetail.tenQuanLy || '-'}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ngày nhập
                    </label>
                    <p className="text-sm text-gray-900">
                      {phieuNhapDetail.ngayNhap ? formatDate(phieuNhapDetail.ngayNhap) : '-'}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tổng tiền
                    </label>
                    <p className="text-sm text-gray-900 font-medium">
                      {phieuNhapDetail.tongTien ? formatCurrency(phieuNhapDetail.tongTien) : '-'}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Trạng thái
                    </label>
                    <p className={`inline-flex rounded-full py-1 px-3 text-sm font-medium ${getStatusColor(phieuNhapDetail.trangThai || '')}`}>
                      {getStatusText(phieuNhapDetail.trangThai || '')}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Địa điểm nhập
                    </label>
                    <p className="text-sm text-gray-900">
                      {phieuNhapDetail.tenDiaDiem ? phieuNhapDetail.tenDiaDiem : '-'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Chi tiết nhập */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Chi tiết nhập</h4>
                {phieuNhapDetail.chiTietNhaps && phieuNhapDetail.chiTietNhaps.length > 0 ? (
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
                          <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                            Giá nhập
                          </th>
                          <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                            Thành tiền
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {phieuNhapDetail.chiTietNhaps.map((chiTiet: ChiTietNhapDto, index: number) => (
                          <tr key={chiTiet.maChiTiet} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-1 dark:bg-meta-4'}>
                            <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                              <h5 className="font-medium text-black dark:text-white">
                                {chiTiet.maChiTiet}
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
                              <p className="inline-flex rounded-full bg-success bg-opacity-10 py-1 px-3 text-sm font-medium text-success">
                                {chiTiet.soLuong || 0}
                              </p>
                            </td>
                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                              <p className="text-black dark:text-white">
                                {chiTiet.gia ? formatCurrency(chiTiet.gia) : '-'}
                              </p>
                            </td>
                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                              <p className="text-black dark:text-white font-medium">
                                {chiTiet.soLuong && chiTiet.gia ? formatCurrency(chiTiet.soLuong * chiTiet.gia) : '-'}
                              </p>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Không có chi tiết nhập nào
                  </div>
                )}
              </div>

              {/* Tổng kết */}
              {phieuNhapDetail.chiTietNhaps && phieuNhapDetail.chiTietNhaps.length > 0 && (
                <div className="bg-blue-50 rounded-lg p-6">
                  <div className="flex justify-between items-center">
                    <h4 className="text-lg font-medium text-gray-900">Tổng kết</h4>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Tổng số lượng:</p>
                      <p className="text-lg font-bold text-blue-600">
                        {phieuNhapDetail.chiTietNhaps.reduce((sum, ct) => sum + (ct.soLuong || 0), 0)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Tổng tiền:</p>
                      <p className="text-lg font-bold text-blue-600">
                        {formatCurrency(phieuNhapDetail.chiTietNhaps.reduce((sum, ct) => sum + ((ct.soLuong || 0) * (ct.gia || 0)), 0))}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="flex justify-end space-x-4 pt-6 border-t">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Đóng
                </button>
                {
                  phieuNhapDetail.trangThai === TrangThaiPhieuKho.Approved && (
                    <button
                      type="button"
                      className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                      onClick={handleExportPDF}
                    >
                      <i className="ri-file-pdf-line mr-2"></i>
                      Xuất PDF
                    </button>
                  )
                }
                  
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Không tìm thấy thông tin phiếu nhập
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PhieuNhapDetailModal;