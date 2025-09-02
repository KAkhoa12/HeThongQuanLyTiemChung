import React, { useState } from 'react';
import {
  useVaiTroQuyens,
  useQuyensByVaiTro,
  useQuyens,
  useModules,
  useActiveVaiTros,
} from '../../hooks';
import { 
  phanQuyen, 
  createVaiTroQuyen, 
  deleteVaiTroQuyen 
} from '../../services/vaiTroQuyen.service';
import { useToast } from '../../hooks';
import CardDataStats from '../../components/CardDataStats';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import PermissionSwitch from '../../components/Switchers/PermissionSwitch';

const VaiTroQuyenPage: React.FC = () => {
  console.log('VaiTroQuyenPage - Component rendered');
  
  const [selectedVaiTro, setSelectedVaiTro] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const { showSuccess, showError } = useToast();

  // Fetch data
  const {
    data: vaiTroQuyens,
    loading: loadingVaiTroQuyens,
    error: errorVaiTroQuyens,
    execute: refreshVaiTroQuyens,
  } = useVaiTroQuyens();
  const {
    data: quyens,
    loading: loadingQuyens,
    error: errorQuyens,
    execute: refreshQuyens,
  } = useQuyens({ page: 1, pageSize: 1000 });
  const { data: modules, loading: loadingModules } = useModules();
  const { 
    data: vaiTroQuyensList, 
    loading: loadingVaiTroQuyensList,
    execute: refreshVaiTroQuyensList,
  } = useQuyensByVaiTro(selectedVaiTro);
  const {
    data: vaiTros,
    loading: loadingVaiTros,
    error: errorVaiTros,
  } = useActiveVaiTros();

  const safeVaiTros = vaiTros || [];
  const safeQuyens = quyens || { data: [], totalCount: 0 };
  const safeModules = modules || [];
  // Handle vai trò selection
  const handleVaiTroChange = (maVaiTro: string) => {
    setSelectedVaiTro(maVaiTro);
  };

  // Handle quyền selection - thực hiện ngay lập tức
  const handleQuyenToggle = async (maQuyen: string) => {
    if (!selectedVaiTro) {
      showError('Lỗi', 'Vui lòng chọn vai trò trước');
      return;
    }

    const isCurrentlyAssigned = isQuyenAssigned(maQuyen);
    
    try {
      setIsLoading(true);
      
      // Nếu đang chọn quyền _ALL
      if (maQuyen.endsWith('_ALL')) {
        if (isCurrentlyAssigned) {
          // Xóa quyền _ALL
          await deleteVaiTroQuyen(selectedVaiTro, maQuyen);
          showSuccess('Thành công', 'Đã xóa quyền _ALL');
        } else {
          // Thêm quyền _ALL và xóa tất cả quyền khác trong module
          const quyen = safeQuyens.data.find(q => q.maQuyen === maQuyen);
          if (quyen) {
            const moduleQuyens = getQuyensByModule(quyen.module);
            const otherQuyens = moduleQuyens.filter(q => !q.maQuyen.endsWith('_ALL'));
            
            // Xóa tất cả quyền khác trong module
            for (const otherQuyen of otherQuyens) {
              if (isQuyenAssigned(otherQuyen.maQuyen)) {
                await deleteVaiTroQuyen(selectedVaiTro, otherQuyen.maQuyen);
              }
            }
            
            // Thêm quyền _ALL
            await createVaiTroQuyen({ maVaiTro: selectedVaiTro, maQuyen });
            showSuccess('Thành công', 'Đã thêm quyền _ALL và xóa các quyền khác');
          }
        }
      } else {
        // Xử lý quyền thường (_VIEW, _READ, _UPDATE, _DELETE)
        if (isCurrentlyAssigned) {
          // Xóa quyền này
          await deleteVaiTroQuyen(selectedVaiTro, maQuyen);
          showSuccess('Thành công', 'Đã xóa quyền');
        } else {
          // Kiểm tra xem có quyền _ALL trong module không
          const quyen = safeQuyens.data.find(q => q.maQuyen === maQuyen);
          if (quyen) {
            const moduleQuyens = getQuyensByModule(quyen.module);
            const allQuyen = moduleQuyens.find(q => q.maQuyen.endsWith('_ALL'));
            
            // Nếu có quyền _ALL đang được gán, xóa nó trước
            if (allQuyen && isQuyenAssigned(allQuyen.maQuyen)) {
              await deleteVaiTroQuyen(selectedVaiTro, allQuyen.maQuyen);
            }
          }
          
          // Thêm quyền này
          await createVaiTroQuyen({ maVaiTro: selectedVaiTro, maQuyen });
          showSuccess('Thành công', 'Đã thêm quyền');
        }
      }
      
             // Refresh data sau khi thay đổi
       if (selectedVaiTro) {
         await refreshVaiTroQuyensList(selectedVaiTro);
       }
    } catch (error) {
      showError('Lỗi', 'Có lỗi xảy ra khi thay đổi quyền');
    } finally {
      setIsLoading(false);
    }
  };



  // Get quyền by module
  const getQuyensByModule = (module: string) => {
    return safeQuyens.data.filter((q) => q.module === module) || [];
  };


  // Get vai trò by module
  const getVaiTrosByModule = (module: string) => {
    // Lấy tất cả vai trò có quyền trong module này
    const moduleQuyens = getQuyensByModule(module);
    const vaiTroIds = new Set<string>();
    
    // Lấy tất cả vai trò có quyền trong module
    vaiTroQuyens?.data?.forEach(vtq => {
      if (moduleQuyens.some(q => q.maQuyen === vtq.maQuyen)) {
        vaiTroIds.add(vtq.maVaiTro);
      }
    });
    
    return safeVaiTros.filter(vt => vaiTroIds.has(vt.maVaiTro));
  };

  // Check if quyền is assigned to vai trò
  const isQuyenAssigned = (maQuyen: string) => {
    return vaiTroQuyensList?.some((vtq) => vtq.maQuyen === maQuyen) || false;
  };

  if (
    loadingVaiTroQuyens ||
    loadingQuyens ||
    loadingModules ||
    loadingVaiTros
  ) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (errorVaiTroQuyens || errorQuyens || errorVaiTros) {
    return (
      <div className="text-center text-red-500 p-4">
        Có lỗi xảy ra khi tải dữ liệu:{' '}
        {errorVaiTroQuyens || errorQuyens || errorVaiTros}
      </div>
    );
  }

  return (
    <>
      <Breadcrumb pageName="Quản lý phân quyền vai trò" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <CardDataStats
          title="Tổng vai trò"
          total={safeVaiTros.length.toString()}
          rate=""
          levelUp
        >
          <i className="ri-user-group-line text-primary dark:text-white text-2xl"></i>
        </CardDataStats>
        <CardDataStats
          title="Tổng quyền"
          total={safeQuyens.totalCount.toString()}
          rate=""
          levelUp
        >
          <i className="ri-shield-check-line text-primary dark:text-white text-2xl"></i>
        </CardDataStats>
        <CardDataStats
          title="Tổng phân quyền"
          total={vaiTroQuyens?.totalCount?.toString() || '0'}
          rate=""
          levelUp
        >
          <i className="ri-check-line text-primary dark:text-white text-2xl"></i>
        </CardDataStats>
        <CardDataStats
          title="Modules"
          total={safeModules.length.toString()}
          rate=""
          levelUp
        >
          <i className="ri-add-line text-primary dark:text-white text-2xl"></i>
        </CardDataStats>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Vai trò Selection */}
        <div className="lg:col-span-3">
          <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
              Chọn vai trò
            </h4>
            <div className="mb-4">
              <select
                value={selectedVaiTro}
                onChange={(e) => handleVaiTroChange(e.target.value)}
                className="w-full rounded-lg border border-stroke bg-transparent px-5 py-3 pl-9 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              >
                <option value="">-- Chọn vai trò --</option>
                {safeVaiTros.map((vaiTro) => (
                  <option key={vaiTro.maVaiTro} value={vaiTro.maVaiTro}>
                    {vaiTro.tenVaiTro}
                  </option>
                ))}
              </select>
            </div>
            {selectedVaiTro && (
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="font-medium text-black dark:text-white">
                  {
                    safeVaiTros.find((vt) => vt.maVaiTro === selectedVaiTro)
                      ?.tenVaiTro
                  }
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {
                    safeVaiTros.find((vt) => vt.maVaiTro === selectedVaiTro)
                      ?.moTa
                  }
                </div>
              </div>
            )}
          </div>
        </div>

                 {/* Quyền Selection với Switch Buttons */}
         <div className="lg:col-span-3">
           <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
             <div className="flex justify-between items-center mb-6">
               <h4 className="text-xl font-semibold text-black dark:text-white">
                 Phân quyền cho vai trò:{' '}
                 {safeVaiTros.find((vt) => vt.maVaiTro === selectedVaiTro)
                   ?.tenVaiTro || 'Chưa chọn'}
               </h4>
               {isLoading && (
                 <div className="flex items-center gap-2 text-primary">
                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                   Đang xử lý...
                 </div>
               )}
             </div>

                         {!selectedVaiTro ? (
               <div className="text-center text-gray-500 py-8">
                 Vui lòng chọn một vai trò để phân quyền
               </div>
             ) : (
               <div className="grid grid-cols-3 gap-6">
                 {safeModules.map((module) => {
                   const moduleQuyens = getQuyensByModule(module);
                   const moduleVaiTros = getVaiTrosByModule(module);
                   
                   if (moduleQuyens.length === 0) return null;
                   
                   return (
                     <div key={module} className="border rounded-lg p-6">
                       <h4 className="text-lg font-semibold text-black dark:text-white mb-4 border-b pb-2">
                         Module: {module}
                       </h4>
                       
                       {/* Hiển thị vai trò trong module */}
                       <div className="mb-4">
                         <h5 className="text-md font-medium text-black dark:text-white mb-2">
                           Vai trò có quyền trong module này:
                         </h5>
                         <div className="flex flex-wrap gap-2">
                           {moduleVaiTros.length > 0 ? (
                             moduleVaiTros.map((vaiTro) => (
                               <span
                                 key={vaiTro.maVaiTro}
                                 className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium dark:bg-blue-900 dark:text-blue-200"
                               >
                                 {vaiTro.tenVaiTro}
                               </span>
                             ))
                           ) : (
                             <span className="text-gray-500 text-sm">
                               Chưa có vai trò nào được phân quyền
                             </span>
                           )}
                         </div>
                       </div>
                       
                       {/* Hiển thị quyền trong module */}
                       <div>
                         <h5 className="text-md font-medium text-black dark:text-white mb-2">
                           Quyền trong module:
                         </h5>
                                                   <ul className="space-y-3">
                            {moduleQuyens.map((quyen) => {
                              const isAllQuyen = quyen.maQuyen.endsWith('_ALL');
                              const hasAllQuyen = moduleQuyens.some(q => 
                                q.maQuyen.endsWith('_ALL') && isQuyenAssigned(q.maQuyen)
                              );
                              const isDisabled = !isAllQuyen && hasAllQuyen;
                              
                              return (
                                <li
                                  key={quyen.maQuyen}
                                  onClick={() => {
                                    if (!isDisabled) {
                                      handleQuyenToggle(quyen.maQuyen);
                                    }
                                  }}
                                  className={`flex ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'} items-center justify-between p-3 border rounded-lg ${
                                    isDisabled 
                                      ? 'bg-gray-100 dark:bg-gray-700 opacity-50' 
                                      : 'bg-gray-50 dark:bg-gray-800'
                                  }`}
                                >
                                  <div className="flex-1">
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
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <PermissionSwitch
                                      checked={isQuyenAssigned(quyen.maQuyen)}
                                      onChange={() => !isDisabled && handleQuyenToggle(quyen.maQuyen)}
                                      isAssigned={isQuyenAssigned(quyen.maQuyen)}
                                      disabled={isDisabled}
                                    />
                                  </div>
                                </li>
                              );
                            })}
                          </ul>
                       </div>
                     </div>
                   );
                 })}
               </div>
             )}
          </div>
        </div>
      </div>
    </>
  );
};

export default VaiTroQuyenPage;
