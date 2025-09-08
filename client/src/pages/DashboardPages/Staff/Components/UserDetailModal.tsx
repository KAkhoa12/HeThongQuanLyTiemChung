import { UserCompleteProfileDto } from "../../../../services";

// Modal components (simplified versions)
export const UserDetailModal: React.FC<{
    user: UserCompleteProfileDto;
    onClose: () => void;
    onEdit: () => void;
    onDelete: () => void;
  }> = ({ user, onClose, onEdit, onDelete }) => {
    const isDoctor = user.maVaiTro === 'VT002';
    const doctorInfo = isDoctor && user.info && 'maBacSi' in user.info ? user.info : null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-boxdark rounded-lg p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Chi tiết người dùng</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-gray-300 flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-semibold text-gray-600">
                  {user.ten.charAt(0).toUpperCase()}
                </span>
              </div>
              <h4 className="text-lg font-semibold text-black dark:text-white">{user.ten}</h4>
              <p className="text-sm text-gray-500">
                {user.maVaiTro === 'VT002' ? 'Bác sĩ' : 
                 user.maVaiTro === 'VT003' ? 'Quản lý' : 'Người dùng'}
              </p>
            </div>
  
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <p className="text-sm text-gray-900 dark:text-white">{user.email}</p>
              </div>
  
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Số điện thoại
                </label>
                <p className="text-sm text-gray-900 dark:text-white">{user.soDienThoai || 'Chưa cập nhật'}</p>
              </div>
  
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Ngày sinh
                </label>
                <p className="text-sm text-gray-900 dark:text-white">
                  {user.ngaySinh ? new Date(user.ngaySinh).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}
                </p>
              </div>
  
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Địa chỉ
                </label>
                <p className="text-sm text-gray-900 dark:text-white">{user.diaChi || 'Chưa cập nhật'}</p>
              </div>
  
              {isDoctor && doctorInfo && (
                <>
                  <div className="border-t pt-4">
                    <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">
                      Thông tin bác sĩ
                    </h4>
                  </div>
  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Chuyên môn
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white">{doctorInfo.chuyenMon || 'Chưa cập nhật'}</p>
                  </div>
  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Số giấy phép
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white">{doctorInfo.soGiayPhep || 'Chưa cập nhật'}</p>
                  </div>
  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Địa điểm làm việc
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white">{doctorInfo.tenDiaDiem || 'Chưa cập nhật'}</p>
                  </div>
                </>
              )}
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 mt-6">
            <button
              onClick={onEdit}
              className="px-4 py-2 bg-primary text-white rounded hover:bg-opacity-90"
            >
              Chỉnh sửa
            </button>
            <button
              onClick={onDelete}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-opacity-90"
            >
              Xóa
            </button>
          </div>
        </div>
      </div>
    );
  };

export default UserDetailModal;