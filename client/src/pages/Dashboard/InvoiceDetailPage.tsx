import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaPrint, FaDownload, FaEdit, FaCheck, FaTimes } from 'react-icons/fa';
import { useInvoice } from '../../hooks';



const InvoiceDetailPage: React.FC = () => {
  const { invoiceId } = useParams<{ invoiceId: string }>();
  const navigate = useNavigate();
  
  const {
    currentInvoice: invoice,
    loading,
    updating,
    fetchInvoiceById,
    updateInvoiceStatus
  } = useInvoice();

  React.useEffect(() => {
    if (invoiceId) {
      fetchInvoiceById(invoiceId);
    }
  }, [invoiceId, fetchInvoiceById]);

  const handleUpdateOrderStatus = async (newStatus: string) => {
    if (!invoice) return;
    
    try {
      await updateInvoiceStatus(invoice.maDonHang, newStatus);
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: { text: string; className: string } } = {
      'PENDING': { text: 'Chờ xử lý', className: 'bg-yellow-100 text-yellow-800' },
      'CONFIRMED': { text: 'Đã xác nhận', className: 'bg-blue-100 text-blue-800' },
      'SHIPPING': { text: 'Đang giao', className: 'bg-purple-100 text-purple-800' },
      'DELIVERED': { text: 'Đã giao', className: 'bg-green-100 text-green-800' },
      'CANCELLED': { text: 'Đã hủy', className: 'bg-red-100 text-red-800' },
      'PAID': { text: 'Đã thanh toán', className: 'bg-green-100 text-green-800' },
      'PAYMENT_PENDING': { text: 'Chờ thanh toán', className: 'bg-orange-100 text-orange-800' },
      'PAYMENT_FAILED': { text: 'Thanh toán thất bại', className: 'bg-red-100 text-red-800' }
    };

    const statusInfo = statusMap[status] || { text: status, className: 'bg-gray-100 text-gray-800' };
    
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.className}`}>
        {statusInfo.text}
      </span>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Helper functions để extract thông tin từ ghiChu
  const extractCustomerName = (ghiChu?: string): string => {
    if (!ghiChu) return 'Không có';
    const match = ghiChu.match(/Khách hàng: ([^,]+)/);
    return match ? match[1].trim() : 'Không có';
  };

  const extractCustomerPhone = (ghiChu?: string): string => {
    if (!ghiChu) return 'Không có';
    const match = ghiChu.match(/SĐT: ([^,]+)/);
    return match ? match[1].trim() : 'Không có';
  };

  const extractCustomerEmail = (ghiChu?: string): string => {
    if (!ghiChu) return 'Không có';
    const match = ghiChu.match(/Email: ([^,]+)/);
    return match ? match[1].trim() : 'Không có';
  };

  const extractCustomerAddress = (ghiChu?: string): string => {
    if (!ghiChu) return 'Không có';
    const match = ghiChu.match(/Địa chỉ: (.+)/);
    return match ? match[1].trim() : 'Không có';
  };

  const printInvoice = () => {
    window.print();
  };

  const exportInvoice = () => {
    // TODO: Implement export functionality
    console.log('Export invoice');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Không tìm thấy hóa đơn</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard/invoices')}
            className="inline-flex items-center justify-center rounded-md border border-stroke bg-white py-2 px-4 text-center font-medium text-black hover:bg-opacity-90 lg:px-6"
          >
            <FaArrowLeft className="mr-2" />
            Quay lại
          </button>
          <h2 className="text-title-md2 font-semibold text-black dark:text-white">
            Chi tiết Hóa đơn: {invoice.maDonHang}
          </h2>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={printInvoice}
            className="inline-flex items-center justify-center rounded-md bg-primary py-2 px-6 text-center font-medium text-white hover:bg-opacity-90"
          >
            <FaPrint className="mr-2" />
            In hóa đơn
          </button>
          <button
            onClick={exportInvoice}
            className="inline-flex items-center justify-center rounded-md bg-success py-2 px-6 text-center font-medium text-white hover:bg-opacity-90"
          >
            <FaDownload className="mr-2" />
            Xuất PDF
          </button>
        </div>
      </div>

      {/* Invoice Information */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left Column - Order Info */}
        <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h3 className="mb-4 text-lg font-semibold text-black dark:text-white">
            Thông tin đơn hàng
          </h3>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Mã đơn hàng:</span>
              <span className="font-medium text-black dark:text-white">{invoice.maDonHang}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Ngày tạo:</span>
              <span className="text-black dark:text-white">{formatDate(invoice.ngayTao)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Trạng thái:</span>
              {getStatusBadge(invoice.trangThaiDon)}
            </div>
            
                         <div className="flex justify-between">
               <span className="text-gray-600 dark:text-gray-400">Phương thức thanh toán:</span>
               <span className="text-black dark:text-white">
                 {invoice.trangThaiDon === 'PAID' ? 'Đã thanh toán' : 'Chưa thanh toán'}
               </span>
             </div>
            
                                 <div className="flex justify-between">
                       <span className="text-gray-600 dark:text-gray-400">Tổng tiền:</span>
                       <span className="text-lg font-bold text-primary">
                         {formatCurrency(invoice.tongTienThanhToan)}
                       </span>
                     </div>
          </div>

          {/* Status Update Buttons */}
          <div className="mt-6 border-t pt-4">
            <h4 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
              Cập nhật trạng thái
            </h4>
            <div className="flex flex-wrap gap-2">
                             {invoice.trangThaiDon === 'PENDING' && (
                 <button
                   onClick={() => handleUpdateOrderStatus('CONFIRMED')}
                   disabled={updating}
                   className="inline-flex items-center rounded-md bg-blue-500 px-3 py-2 text-sm font-medium text-white hover:bg-blue-600 disabled:opacity-50"
                 >
                   <FaCheck className="mr-1" />
                   Xác nhận
                 </button>
               )}
               
               {invoice.trangThaiDon === 'CONFIRMED' && (
                 <button
                   onClick={() => handleUpdateOrderStatus('SHIPPING')}
                   disabled={updating}
                   className="inline-flex items-center rounded-md bg-purple-500 px-3 py-2 text-sm font-medium text-white hover:bg-purple-600 disabled:opacity-50"
                 >
                   <FaEdit className="mr-1" />
                   Bắt đầu giao
                 </button>
               )}
               
               {invoice.trangThaiDon === 'SHIPPING' && (
                 <button
                   onClick={() => handleUpdateOrderStatus('DELIVERED')}
                   disabled={updating}
                   className="inline-flex items-center rounded-md bg-green-500 px-3 py-2 text-sm font-medium text-white hover:bg-green-600 disabled:opacity-50"
                 >
                   <FaCheck className="mr-1" />
                   Hoàn thành
                 </button>
               )}
               
               {['PENDING', 'CONFIRMED', 'SHIPPING'].includes(invoice.trangThaiDon) && (
                 <button
                   onClick={() => handleUpdateOrderStatus('CANCELLED')}
                   disabled={updating}
                   className="inline-flex items-center rounded-md bg-red-500 px-3 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50"
                 >
                   <FaTimes className="mr-1" />
                   Hủy đơn
                 </button>
               )}
            </div>
          </div>
        </div>

        {/* Right Column - Customer Info */}
        <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h3 className="mb-4 text-lg font-semibold text-black dark:text-white">
            Thông tin khách hàng
          </h3>
          
          <div className="space-y-3">
                         <div className="flex justify-between">
               <span className="text-gray-600 dark:text-gray-400">Họ tên:</span>
               <span className="font-medium text-black dark:text-white">{extractCustomerName(invoice.ghiChu)}</span>
             </div>
             
             <div className="flex justify-between">
               <span className="text-gray-600 dark:text-gray-400">Số điện thoại:</span>
               <span className="text-black dark:text-white">{extractCustomerPhone(invoice.ghiChu)}</span>
             </div>
             
             <div className="flex justify-between">
               <span className="text-gray-600 dark:text-gray-400">Email:</span>
               <span className="text-black dark:text-white">{extractCustomerEmail(invoice.ghiChu)}</span>
             </div>
             
             <div className="flex justify-between">
               <span className="text-gray-600 dark:text-gray-400">Địa chỉ:</span>
               <span className="text-black dark:text-white">{extractCustomerAddress(invoice.ghiChu)}</span>
             </div>
          </div>

          {/* Notes */}
          {invoice.ghiChu && (
            <div className="mt-6 border-t pt-4">
              <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Ghi chú
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {invoice.ghiChu}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Order Items */}
      <div className="mt-6 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke px-6 py-4 dark:border-strokedark">
          <h3 className="text-lg font-semibold text-black dark:text-white">
            Chi tiết sản phẩm
          </h3>
        </div>
        
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                  <th className="py-3 px-4 font-medium text-black dark:text-white">
                    Sản phẩm
                  </th>
                  <th className="py-3 px-4 font-medium text-black dark:text-white text-center">
                    Số lượng
                  </th>
                  <th className="py-3 px-4 font-medium text-black dark:text-white text-right">
                    Đơn giá
                  </th>
                  <th className="py-3 px-4 font-medium text-black dark:text-white text-right">
                    Thành tiền
                  </th>
                </tr>
              </thead>
              <tbody>
                                 {invoice.donHangChiTiets.map((item: any, index: number) => (
                   <tr key={index} className="border-b border-[#eee] dark:border-strokedark">
                     <td className="py-4 px-4">
                       <h5 className="font-medium text-black dark:text-white">
                         {item.maDichVuNavigation?.tenDichVu || 'Không có tên'}
                       </h5>
                     </td>
                     <td className="py-4 px-4 text-center">
                       <span className="text-black dark:text-white">
                         {item.soMuiChuan}
                       </span>
                     </td>
                     <td className="py-4 px-4 text-right">
                       <span className="text-black dark:text-white">
                         {formatCurrency(item.donGiaMui)}
                       </span>
                     </td>
                     <td className="py-4 px-4 text-right">
                       <span className="font-medium text-black dark:text-white">
                         {formatCurrency(item.thanhTien)}
                       </span>
                     </td>
                   </tr>
                 ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-primary">
                  <td colSpan={3} className="py-4 px-4 text-right font-bold text-lg">
                    Tổng cộng:
                  </td>
                                     <td className="py-4 px-4 text-right font-bold text-lg text-primary">
                     {formatCurrency(invoice.tongTienThanhToan)}
                   </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetailPage; 