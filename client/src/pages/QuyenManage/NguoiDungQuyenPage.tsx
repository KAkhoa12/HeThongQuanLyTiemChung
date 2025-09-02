import React, { useState, useEffect, useCallback } from 'react';
import { useNguoiDungQuyens, useAllQuyensByNguoiDung, useQuyens, useModules, useUsers, useActiveVaiTros } from '../../hooks';
import { 
  phanQuyenNguoiDung, 
  createNguoiDungQuyen, 
  deleteNguoiDungQuyen 
} from '../../services/nguoiDungQuyen.service';
import { useToast } from '../../hooks';
import CardDataStats from '../../components/CardDataStats';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import PermissionSwitch from '../../components/Switchers/PermissionSwitch';

// Component phân quyền riêng biệt
const PermissionManagement: React.FC<{
  selectedNguoiDung: string;
  onBack: () => void;
  selectedUserName: string;
}> = ({ selectedNguoiDung, onBack, selectedUserName }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { showSuccess, showError } = useToast();
  
  // Fetch data cho phân quyền
  const { data: nguoiDungQuyens, loading: loadingNguoiDungQuyens, error: errorNguoiDungQuyens, execute: refreshNguoiDungQuyens } = useNguoiDungQuyens();
  const { data: quyens, loading: loadingQuyens, error: errorQuyens } = useQuyens();
  const { data: modules, loading: loadingModules } = useModules();
  const { data: allQuyensByNguoiDung, loading: loadingAllQuyens, execute: refreshAllQuyensByNguoiDung } = useAllQuyensByNguoiDung(selectedNguoiDung);

  // Auto refresh permissions when selectedNguoiDung changes
  const refreshPermissions = useCallback(() => {
    if (selectedNguoiDung && refreshAllQuyensByNguoiDung) {
      refreshAllQuyensByNguoiDung();
    }
  }, [selectedNguoiDung, refreshAllQuyensByNguoiDung]);

  useEffect(() => {
    refreshPermissions();
  }, [selectedNguoiDung, refreshPermissions]);

  // Handle quyền selection - thực hiện ngay lập tức
  const handleQuyenToggle = async (maQuyen: string) => {
    if (!selectedNguoiDung) {
      showError('Lỗi', 'Vui lòng chọn người dùng trước');
      return;
    }

    const isCurrentlyAssigned = isQuyenAssigned(maQuyen);
    
    try {
      setIsLoading(true);
      
      // Nếu đang chọn quyền _ALL
      if (maQuyen.endsWith('_ALL')) {
        if (isCurrentlyAssigned) {
          // Xóa quyền _ALL
          await deleteNguoiDungQuyen(selectedNguoiDung, maQuyen);
          showSuccess('Thành công', 'Đã xóa quyền _ALL');
        } else {
          // Thêm quyền _ALL và xóa tất cả quyền khác trong module
          const quyen = quyens?.data?.find(q => q.maQuyen === maQuyen);
          if (quyen) {
            const moduleQuyens = getQuyensByModule(quyen.module);
            const otherQuyens = moduleQuyens.filter(q => !q.maQuyen.endsWith('_ALL'));
            
            // Xóa tất cả quyền khác trong module
            for (const otherQuyen of otherQuyens) {
              if (isQuyenAssigned(otherQuyen.maQuyen)) {
                await deleteNguoiDungQuyen(selectedNguoiDung, otherQuyen.maQuyen);
              }
            }
            
            // Thêm quyền _ALL
            await createNguoiDungQuyen({ maNguoiDung: selectedNguoiDung, maQuyen });
            showSuccess('Thành công', 'Đã thêm quyền _ALL và xóa các quyền khác');
          }
        }
      } else {
        // Xử lý quyền thường (_VIEW, _READ, _UPDATE, _DELETE)
        if (isCurrentlyAssigned) {
          // Xóa quyền này
          await deleteNguoiDungQuyen(selectedNguoiDung, maQuyen);
          showSuccess('Thành công', 'Đã xóa quyền');
        } else {
          // Kiểm tra xem có quyền _ALL trong module không
          const quyen = quyens?.data?.find(q => q.maQuyen === maQuyen);
          if (quyen) {
            const moduleQuyens = getQuyensByModule(quyen.module);
            const allQuyen = moduleQuyens.find(q => q.maQuyen.endsWith('_ALL'));
            
            // Nếu có quyền _ALL đang được gán, xóa nó trước
            if (allQuyen && isQuyenAssigned(allQuyen.maQuyen)) {
              await deleteNguoiDungQuyen(selectedNguoiDung, allQuyen.maQuyen);
            }
          }
          
          // Thêm quyền này
          await createNguoiDungQuyen({ maNguoiDung: selectedNguoiDung, maQuyen });
          showSuccess('Thành công', 'Đã thêm quyền');
        }
      }
      
      // Refresh data sau khi thay đổi
      if (selectedNguoiDung) {
        await refreshAllQuyensByNguoiDung();
      }
      
    } catch (error) {
      showError('Lỗi', 'Có lỗi xảy ra khi thay đổi quyền');
    } finally {
      setIsLoading(false);
    }
  };

  // Get quyền by module
  const getQuyensByModule = (module: string) => {
    return quyens?.data.filter(q => q.module === module) || [];
  };

  // Check if quyền is assigned to người dùng (including role permissions)
  const isQuyenAssigned = (maQuyen: string) => {
    return allQuyensByNguoiDung?.find(q => q.maQuyen === maQuyen)?.coQuyen || false;
  };

  // Get source of permission (role or direct)
  const getPermissionSource = (maQuyen: string) => {
    const quyen = allQuyensByNguoiDung?.find(q => q.maQuyen === maQuyen);
    if (!quyen) return null;
    
    // Check if it's from role (not directly assigned)
    const isFromRole = !nguoiDungQuyens?.data.some(ndq => 
      ndq.maNguoiDung === selectedNguoiDung && ndq.maQuyen === maQuyen
    );
    
    return isFromRole ? 'role' : 'direct';
  };

  if (loadingNguoiDungQuyens || loadingQuyens || loadingModules || loadingAllQuyens) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (errorNguoiDungQuyens || errorQuyens) {
    return (
      <div className="text-center text-red-500 p-4">
        Có lỗi xảy ra khi tải dữ liệu phân quyền
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header với nút back */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-3 py-2 text-sm border rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <i className="ri-arrow-left-s-line"></i>
            Quay lại danh sách
          </button>
          <h4 className="text-xl font-semibold text-black dark:text-white">
            Phân quyền cho: {selectedUserName}
          </h4>
        </div>
        {isLoading && (
          <div className="flex items-center gap-2 text-primary">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            Đang xử lý...
          </div>
        )}
      </div>

      {/* Danh sách phân quyền */}
      <div className="space-y-6">
        {modules?.map((module) => (
          <div key={module} className="border rounded-lg p-4">
            <h5 className="font-medium text-black dark:text-white mb-3">
              Module: {module}
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {getQuyensByModule(module).map((quyen) => {
                const isAssigned = isQuyenAssigned(quyen.maQuyen);
                const source = getPermissionSource(quyen.maQuyen);
                const isAllQuyen = quyen.maQuyen.endsWith('_ALL');
                const hasAllQuyen = getQuyensByModule(module).some(q => 
                  q.maQuyen.endsWith('_ALL') && isQuyenAssigned(q.maQuyen)
                );
                const isDisabled = !isAllQuyen && hasAllQuyen;
                
                return (
                  <div
                    key={quyen.maQuyen}
                    onClick={() => {
                      if (!isDisabled) {
                        handleQuyenToggle(quyen.maQuyen);
                      }
                    }}
                    className={`p-3 rounded-lg border transition-colors ${
                      isDisabled 
                        ? 'cursor-not-allowed bg-gray-100 dark:bg-gray-700 opacity-50' 
                        : 'cursor-pointer border-gray-200 hover:border-primary/50'
                    } ${
                      isAssigned
                        ? source === 'role'
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-green-500 bg-green-50 dark:bg-green-900/20'
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className={`font-medium ${
                          isDisabled 
                            ? 'text-gray-400 dark:text-gray-500' 
                            : 'text-black dark:text-white'
                        }`}>
                          {quyen.tenQuyen}
                        </div>
                        <div className={`text-sm ${
                          isDisabled 
                            ? 'text-gray-300 dark:text-gray-600' 
                            : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {quyen.moTa}
                        </div>
                        {isAssigned && source && (
                          <div className={`text-xs mt-1 ${
                            source === 'role' 
                              ? 'text-blue-600 dark:text-blue-400' 
                              : 'text-green-600 dark:text-green-400'
                          }`}>
                            {source === 'role' ? 'Từ vai trò' : 'Trực tiếp'}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <PermissionSwitch
                          checked={isAssigned}
                          onChange={() => !isDisabled && handleQuyenToggle(quyen.maQuyen)}
                          isAssigned={isAssigned}
                          disabled={isDisabled}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const NguoiDungQuyenPage: React.FC = () => {
  const [selectedNguoiDung, setSelectedNguoiDung] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoleId, setSelectedRoleId] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  
  // Fetch data
  const { data: nguoiDungQuyens, loading: loadingNguoiDungQuyens, error: errorNguoiDungQuyens } = useNguoiDungQuyens();
  const { data: quyens, loading: loadingQuyens, error: errorQuyens } = useQuyens();
  const { data: modules, loading: loadingModules } = useModules();
  const { data: vaiTros, loading: loadingVaiTros } = useActiveVaiTros();
  const { data: users, loading: loadingUsers, error: errorUsers } = useUsers({ 
    page: currentPage, 
    pageSize, 
    search: searchTerm || undefined,
    roleId: selectedRoleId || undefined
  });

  // Reset to page 1 when search or role changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedRoleId]);

  // Handle search and role filter changes
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleRoleChange = (roleId: string) => {
    setSelectedRoleId(roleId);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle người dùng selection
  const handleNguoiDungChange = (maNguoiDung: string) => {
    setSelectedNguoiDung(maNguoiDung);
  };

  // Handle back to user list
  const handleBackToList = () => {
    setSelectedNguoiDung('');
  };

  // Loading state cho toàn bộ trang
  if (loadingNguoiDungQuyens || loadingQuyens || loadingModules || loadingVaiTros) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (errorNguoiDungQuyens || errorQuyens) {
    return (
      <div className="text-center text-red-500 p-4">
        Có lỗi xảy ra khi tải dữ liệu
      </div>
    );
  }

  return (
    <>
      <Breadcrumb pageName="Quản lý phân quyền người dùng" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <CardDataStats
          title="Tổng người dùng"
          total={users?.totalCount?.toString() || "0"}
          rate=""
          levelUp
        >
          <i className="ri-user-line text-primary dark:text-white text-2xl"></i>
        </CardDataStats>
        <CardDataStats
          title="Tổng quyền"
          total={quyens?.totalCount?.toString() || "0"}
          rate=""
          levelUp
        >
          <i className="ri-shield-check-line text-primary dark:text-white text-2xl"></i>
        </CardDataStats>
        <CardDataStats
          title="Tổng phân quyền"
          total={nguoiDungQuyens?.totalCount?.toString() || "0"}
          rate=""
          levelUp
        >
          <i className="ri-check-line text-primary dark:text-white text-2xl"></i>
        </CardDataStats>
        <CardDataStats
          title="Modules"
          total={modules?.length?.toString() || "0"}
          rate=""
          levelUp
        >
          <i className="ri-add-line text-primary dark:text-white text-2xl"></i>
        </CardDataStats>
      </div>

      {/* Nếu đã chọn người dùng, hiển thị component phân quyền */}
      {selectedNguoiDung ? (
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <PermissionManagement
            selectedNguoiDung={selectedNguoiDung}
            onBack={handleBackToList}
            selectedUserName={users?.data?.find(nd => nd.maNguoiDung === selectedNguoiDung)?.ten || 'Không xác định'}
          />
        </div>
      ) : (
        /* Hiển thị danh sách người dùng */
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
            Danh sách người dùng
          </h4>
          
          {/* Search và Filter */}
          <div className="space-y-4 mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm người dùng..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full rounded-lg border border-stroke bg-transparent py-2 pl-10 pr-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
              <i className="ri-search-line absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            
            <div>
              <select
                value={selectedRoleId}
                onChange={(e) => handleRoleChange(e.target.value)}
                className="w-full rounded-lg border border-stroke bg-transparent py-2 px-3 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              >
                <option value="">Tất cả vai trò</option>
                {vaiTros?.map((vaiTro) => (
                  <option key={vaiTro.maVaiTro} value={vaiTro.maVaiTro}>
                    {vaiTro.tenVaiTro}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Danh sách người dùng với loading */}
          <div className="space-y-3">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th className="px-3 py-2">Tên</th>
                    <th className="px-3 py-2">Email</th>
                    <th className="px-3 py-2">Vai trò</th>
                    <th className="px-3 py-2">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingUsers ? (
                    // Loading state cho table
                    <tr>
                      <td colSpan={4} className="px-3 py-8 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                          <span className="text-gray-500">Đang tải danh sách người dùng...</span>
                        </div>
                      </td>
                    </tr>
                  ) : users?.data && users.data.length > 0 ? (
                    users.data.map((nguoiDung) => (
                      <tr
                        key={nguoiDung.maNguoiDung}
                        className="border-b hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <td className="px-3 py-3 font-medium text-black dark:text-white">
                          {nguoiDung.ten}
                        </td>
                        <td className="px-3 py-3 text-gray-600 dark:text-gray-300">
                          {nguoiDung.email}
                        </td>
                        <td className="px-3 py-3">
                          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full dark:bg-blue-900 dark:text-blue-200">
                            {vaiTros?.find(v => v.maVaiTro === nguoiDung.maVaiTro)?.tenVaiTro || nguoiDung.maVaiTro}
                          </span>
                        </td>
                        <td className="px-3 py-3">
                          <button
                            onClick={() => handleNguoiDungChange(nguoiDung.maNguoiDung)}
                            className="px-3 py-1 text-sm bg-primary text-white rounded hover:bg-primary/90 transition-colors"
                          >
                            Phân quyền
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-3 py-8 text-center text-gray-500">
                        Không tìm thấy người dùng nào
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {users && users.totalPages > 1 && (
            <div className="flex justify-between items-center mt-4 pt-4 border-t">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Trang {currentPage} / {users.totalPages} ({users.totalCount} người dùng)
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage <= 1}
                  className="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <i className="ri-arrow-left-s-line"></i>
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= users.totalPages}
                  className="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <i className="ri-arrow-right-s-line"></i>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default NguoiDungQuyenPage; 