import React, { useState, useEffect } from 'react';
import { useVaccinesExpiringSoon, useLocations, usePhieuThanhLies, useDeletePhieuThanhLy } from '../../../hooks';
import { PhieuThanhLyCreateModal, NotificationModal } from '../../../components/Inventory';
import PhieuThanhLyDetailModal from '../../../components/Inventory/PhieuThanhLyDetailModal';
import PhieuThanhLyEditModal from '../../../components/Inventory/PhieuThanhLyEditModal';

interface ThanhLyPageProps {}

const ThanhLyPage: React.FC<ThanhLyPageProps> = () => {
  const [activeTab, setActiveTab] = useState<'expiring' | 'disposal-list'>('expiring');
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [daysUntilExpiry, setDaysUntilExpiry] = useState<number>(30);
  const [selectedVaccines, setSelectedVaccines] = useState<any[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedDisposalId, setSelectedDisposalId] = useState<string>('');
  const [notification, setNotification] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });

  // Fetch data
  const { data: expiringVaccines, loading: expiringLoading, execute: fetchExpiringVaccines } = useVaccinesExpiringSoon(daysUntilExpiry, selectedLocation);
  const { data: locations, execute: fetchLocations } = useLocations();
  const { data: disposalRecords, loading: disposalLoading, execute: fetchDisposalRecords } = usePhieuThanhLies({ page: 1, pageSize: 20 });
  const { execute: deletePhieuThanhLy, loading: deleteLoading } = useDeletePhieuThanhLy();

  useEffect(() => {
    fetchLocations({ page: 1, pageSize: 1000 });
  }, []);

  useEffect(() => {
    fetchExpiringVaccines({ days: daysUntilExpiry, maDiaDiem: selectedLocation || undefined });
  }, [daysUntilExpiry, selectedLocation]);

  useEffect(() => {
    if (activeTab === 'disposal-list') {
      fetchDisposalRecords({ page: 1, pageSize: 20 });
    }
  }, [activeTab]);

  const handleLocationChange = (locationId: string) => {
    setSelectedLocation(locationId);
  };

  const handleDaysChange = (days: number) => {
    setDaysUntilExpiry(days);
  };

  const handleSelectVaccine = (vaccine: any) => {
    setSelectedVaccines(prev => {
      const isSelected = prev.some(v => v.maTonKho === vaccine.maTonKho);
      if (isSelected) {
        return prev.filter(v => v.maTonKho !== vaccine.maTonKho);
      } else {
        return [...prev, vaccine];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedVaccines.length === expiringVaccines?.length) {
      setSelectedVaccines([]);
    } else {
      setSelectedVaccines(expiringVaccines || []);
    }
  };

  const handleCreatePhieuThanhLy = () => {
    if (selectedVaccines.length === 0) {
      setNotification({
        isOpen: true,
        title: 'Cảnh báo',
        message: 'Vui lòng chọn ít nhất một vaccine để thanh lý',
        type: 'warning'
      });
      return;
    }
    setIsCreateModalOpen(true);
  };

  const handleViewDisposal = (disposalId: string) => {
    setSelectedDisposalId(disposalId);
    setIsDetailModalOpen(true);
  };

  const handleEditDisposal = (disposalId: string) => {
    setSelectedDisposalId(disposalId);
    setIsEditModalOpen(true);
  };

  const handleDeleteDisposal = async (disposalId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa phiếu thanh lý này?')) {
      try {
        await deletePhieuThanhLy(disposalId);
        setNotification({
          isOpen: true,
          title: 'Thành công',
          message: 'Xóa phiếu thanh lý thành công',
          type: 'success'
        });
        fetchDisposalRecords({ page: 1, pageSize: 20 });
      } catch (error) {
        setNotification({
          isOpen: true,
          title: 'Lỗi',
          message: 'Có lỗi xảy ra khi xóa phiếu thanh lý',
          type: 'error'
        });
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getDaysUntilExpiry = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getExpiryStatus = (expiryDate: string) => {
    const days = getDaysUntilExpiry(expiryDate);
    if (days < 0) return { status: 'expired', text: 'Đã hết hạn', color: 'bg-danger bg-opacity-10 text-danger' };
    if (days <= 7) return { status: 'critical', text: 'Sắp hết hạn', color: 'bg-warning bg-opacity-10 text-warning' };
    if (days <= 30) return { status: 'warning', text: 'Cảnh báo', color: 'bg-info bg-opacity-10 text-info' };
    return { status: 'normal', text: 'Bình thường', color: 'bg-success bg-opacity-10 text-success' };
  };

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          Quản lý Thanh lý Vaccine
        </h2>
        {activeTab === 'expiring' && selectedVaccines.length > 0 && (
          <button
            onClick={handleCreatePhieuThanhLy}
            className="inline-flex items-center justify-center rounded-md bg-danger py-4 px-10 text-center font-medium text-white hover:bg-opacity-90"
          >
            <i className="ri-delete-bin-line mr-2"></i>
            Tạo phiếu thanh lý ({selectedVaccines.length})
          </button>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('expiring')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'expiring'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <i className="ri-time-line mr-2"></i>
              Thanh lý vaccine hết hạn
            </button>
            <button
              onClick={() => setActiveTab('disposal-list')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'disposal-list'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <i className="ri-list-check-2 mr-2"></i>
              Danh sách phiếu thanh lý
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'expiring' && (
        <>
          {/* Filters */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark mb-6">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">Bộ lọc</h3>
        </div>
        <div className="p-6.5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="mb-2.5 block text-black dark:text-white">
                Địa điểm
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => handleLocationChange(e.target.value)}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              >
                <option value="">Tất cả địa điểm</option>
                {locations?.data?.map((location: any) => (
                  <option key={location.id} value={location.id}>
                    {location.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2.5 block text-black dark:text-white">
                Số ngày trước khi hết hạn
              </label>
              <select
                value={daysUntilExpiry}
                onChange={(e) => handleDaysChange(parseInt(e.target.value))}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              >
                <option value={7}>7 ngày</option>
                <option value={15}>15 ngày</option>
                <option value={30}>30 ngày</option>
                <option value={60}>60 ngày</option>
                <option value={90}>90 ngày</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => handleSelectAll()}
                className="w-full inline-flex items-center justify-center rounded-md bg-primary py-3 px-5 text-center font-medium text-white hover:bg-opacity-90"
              >
                <i className="ri-checkbox-line mr-2"></i>
                {selectedVaccines.length === expiringVaccines?.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Expiring Vaccines Table */}
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Danh sách Vaccine sắp hết hạn ({expiringVaccines?.length || 0} vaccine)
          </h3>
        </div>
        <div className="p-6.5">
          {expiringLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              {expiringVaccines && expiringVaccines.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full table-auto">
                    <thead>
                      <tr className="bg-gray-2 text-left dark:bg-meta-4">
                        <th className="min-w-[50px] py-4 px-4 font-medium text-black dark:text-white">
                          <input
                            type="checkbox"
                            checked={expiringVaccines.length > 0 && selectedVaccines.length === expiringVaccines.length}
                            onChange={handleSelectAll}
                            className="rounded border-gray-300"
                          />
                        </th>
                        <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                          Mã tồn kho
                        </th>
                        <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                          Địa điểm
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
                          Ngày hết hạn
                        </th>
                        <th className="min-w-[100px] py-4 px-4 font-medium text-black dark:text-white">
                          Còn lại
                        </th>
                        <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                          Trạng thái
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {expiringVaccines.map((item: any, index: number) => {
                        const isSelected = selectedVaccines.some(v => v.maTonKho === item.maTonKho);
                        const expiryStatus = getExpiryStatus(item.ngayHetHan);
                        const daysLeft = getDaysUntilExpiry(item.ngayHetHan);
                        
                        return (
                          <tr 
                            key={item.maTonKho} 
                            className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-1 dark:bg-meta-4'} ${isSelected ? 'bg-blue-50 dark:bg-blue-900' : ''}`}
                          >
                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleSelectVaccine(item)}
                                className="rounded border-gray-300"
                              />
                            </td>
                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                              <h5 className="font-medium text-black dark:text-white">
                                {item.maTonKho}
                              </h5>
                            </td>
                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                              <p className="text-black dark:text-white">
                                {item.tenDiaDiem}
                              </p>
                            </td>
                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                              <p className="text-black dark:text-white">
                                {item.soLo}
                              </p>
                            </td>
                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                              <p className="text-black dark:text-white">
                                {item.tenVaccine}
                              </p>
                            </td>
                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                              <p className="inline-flex rounded-full bg-info bg-opacity-10 py-1 px-3 text-sm font-medium text-info">
                                {item.soLuong}
                              </p>
                            </td>
                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                              <p className="text-black dark:text-white">
                                {formatDate(item.ngayHetHan)}
                              </p>
                            </td>
                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                              <p className={`font-medium ${daysLeft < 0 ? 'text-danger' : daysLeft <= 7 ? 'text-warning' : 'text-info'}`}>
                                {daysLeft < 0 ? 'Đã hết hạn' : `${daysLeft} ngày`}
                              </p>
                            </td>
                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                              <p className={`inline-flex rounded-full py-1 px-3 text-sm font-medium ${expiryStatus.color}`}>
                                {expiryStatus.text}
                              </p>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <i className="ri-checkbox-circle-line text-6xl text-success mb-4"></i>
                  <h3 className="text-lg font-medium text-black dark:text-white mb-2">
                    Không có vaccine sắp hết hạn
                  </h3>
                  <p className="text-body dark:text-bodydark">
                    Tất cả vaccine đều còn hạn sử dụng trong {daysUntilExpiry} ngày tới
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
        </>
      )}

      {/* Disposal List Tab */}
      {activeTab === 'disposal-list' && (
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Danh sách phiếu thanh lý ({disposalRecords?.totalCount || 0} phiếu)
            </h3>
          </div>
          <div className="p-6.5">
            {disposalLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <>
                {disposalRecords && disposalRecords.data && disposalRecords.data.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full table-auto">
                      <thead>
                        <tr className="bg-gray-2 text-left dark:bg-meta-4">
                          <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                            Mã phiếu
                          </th>
                          <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                            Địa điểm
                          </th>
                          <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                            Ngày thanh lý
                          </th>
                          <th className="min-w-[100px] py-4 px-4 font-medium text-black dark:text-white">
                            Trạng thái
                          </th>
                          <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                            Ngày tạo
                          </th>
                          <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                            Thao tác
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {disposalRecords.data.map((record: any, index: number) => (
                          <tr 
                            key={record.maPhieuThanhLy} 
                            className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-1 dark:bg-meta-4'}`}
                          >
                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                              <h5 className="font-medium text-black dark:text-white">
                                {record.maPhieuThanhLy}
                              </h5>
                            </td>
                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                              <p className="text-black dark:text-white">
                                {record.tenDiaDiem}
                              </p>
                            </td>
                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                              <p className="text-black dark:text-white">
                                {record.ngayThanhLy ? new Date(record.ngayThanhLy).toLocaleDateString('vi-VN') : '-'}
                              </p>
                            </td>
                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                              <p className={`inline-flex rounded-full py-1 px-3 text-sm font-medium ${
                                record.trangThai === 'Approved' ? 'bg-success bg-opacity-10 text-success' :
                                record.trangThai === 'Pending' ? 'bg-warning bg-opacity-10 text-warning' :
                                record.trangThai === 'Rejected' ? 'bg-danger bg-opacity-10 text-danger' :
                                'bg-gray bg-opacity-10 text-gray'
                              }`}>
                                {record.trangThai === 'Approved' ? 'Đã duyệt' :
                                 record.trangThai === 'Pending' ? 'Chờ duyệt' :
                                 record.trangThai === 'Rejected' ? 'Từ chối' :
                                 record.trangThai}
                              </p>
                            </td>
                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                              <p className="text-black dark:text-white">
                                {record.ngayTao ? new Date(record.ngayTao).toLocaleDateString('vi-VN') : '-'}
                              </p>
                            </td>
                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => handleViewDisposal(record.maPhieuThanhLy)}
                                  className="inline-flex items-center justify-center rounded-md bg-info py-2 px-3 text-center font-medium text-white hover:bg-opacity-90"
                                >
                                  <i className="ri-eye-line mr-1"></i>
                                  Xem
                                </button>
                                {record.trangThai === 'Pending' && (
                                  <>
                                    <button
                                      onClick={() => handleEditDisposal(record.maPhieuThanhLy)}
                                      className="inline-flex items-center justify-center rounded-md bg-warning py-2 px-3 text-center font-medium text-white hover:bg-opacity-90"
                                    >
                                      <i className="ri-edit-line mr-1"></i>
                                      Sửa
                                    </button>
                                    <button
                                      onClick={() => handleDeleteDisposal(record.maPhieuThanhLy)}
                                      disabled={deleteLoading}
                                      className="inline-flex items-center justify-center rounded-md bg-danger py-2 px-3 text-center font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
                                    >
                                      <i className="ri-delete-bin-line mr-1"></i>
                                      Xóa
                                    </button>
                                  </>
                                )}
                              </div>
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
                      Chưa có phiếu thanh lý nào
                    </h3>
                    <p className="text-body dark:text-bodydark">
                      Tạo phiếu thanh lý đầu tiên từ tab "Thanh lý vaccine hết hạn"
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Create Modal */}
      <PhieuThanhLyCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          fetchExpiringVaccines({ days: daysUntilExpiry, maDiaDiem: selectedLocation || undefined });
          if (activeTab === 'disposal-list') {
            fetchDisposalRecords({ page: 1, pageSize: 20 });
          }
          setIsCreateModalOpen(false);
        }}
        selectedVaccines={selectedVaccines}
      />

      {/* Detail Modal */}
      <PhieuThanhLyDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        phieuThanhLyId={selectedDisposalId}
      />

      {/* Edit Modal */}
      <PhieuThanhLyEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={() => {
          fetchDisposalRecords({ page: 1, pageSize: 20 });
          setIsEditModalOpen(false);
        }}
        phieuThanhLyId={selectedDisposalId}
      />

      {/* Notification Modal */}
      <NotificationModal
        isOpen={notification.isOpen}
        onClose={() => setNotification(prev => ({ ...prev, isOpen: false }))}
        title={notification.title}
        message={notification.message}
        type={notification.type}
      />
    </div>
  );
};

export default ThanhLyPage;