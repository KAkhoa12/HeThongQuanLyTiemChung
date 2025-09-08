import { UserCompleteProfileDto } from "../../../../services";
import { UserFormData } from "../StaffListPage";

export const UserUpdateModal: React.FC<{
    user: UserCompleteProfileDto;
    formData: UserFormData;
    setFormData: React.Dispatch<React.SetStateAction<UserFormData>>;
    locations: any[];
    onClose: () => void;    
    onSave: () => void;
    loading: boolean;
  }> = ({ user, formData, setFormData, locations, onClose, onSave, loading }) => {
    const isDoctor = user.maVaiTro === 'VT002';
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-boxdark rounded-lg p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Chỉnh sửa người dùng</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <form onSubmit={(e) => { e.preventDefault(); onSave(); }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tên *
              </label>
              <input
                type="text"
                value={formData.ten}
                onChange={(e) => setFormData(prev => ({ ...prev, ten: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:border-primary outline-none"
                required
              />
            </div>
  
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Số điện thoại
              </label>
              <input
                type="text"
                value={formData.soDienThoai}
                onChange={(e) => setFormData(prev => ({ ...prev, soDienThoai: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:border-primary outline-none"
              />
            </div>
  
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Ngày sinh
              </label>
              <input
                type="date"
                value={formData.ngaySinh}
                onChange={(e) => setFormData(prev => ({ ...prev, ngaySinh: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:border-primary outline-none"
              />
            </div>
  
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Địa chỉ
              </label>
              <input
                type="text"
                value={formData.diaChi}
                onChange={(e) => setFormData(prev => ({ ...prev, diaChi: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:border-primary outline-none"
              />
            </div>
  
            {/* Doctor-specific fields */}
            {isDoctor && (
              <>
                <div className="border-t pt-4">
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">
                    Thông tin bác sĩ
                  </h4>
                </div>
  
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Chuyên môn
                  </label>
                  <input
                    type="text"
                    value={formData.chuyenMon || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, chuyenMon: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:border-primary outline-none"
                  />
                </div>
  
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Số giấy phép
                  </label>
                  <input
                    type="text"
                    value={formData.soGiayPhep || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, soGiayPhep: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:border-primary outline-none"
                  />
                </div>
  
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Địa điểm làm việc
                  </label>
                  <select
                    value={formData.maDiaDiem || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, maDiaDiem: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:border-primary outline-none"
                  >
                    <option value="">Chọn địa điểm</option>
                    {locations?.map((location) => (
                      <option key={location.id} value={location.id}>
                        {location.name}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}
  
            <div className="flex justify-end space-x-2 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-opacity-90"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-primary text-white rounded hover:bg-opacity-90 disabled:opacity-50"
              >
                {loading ? 'Đang lưu...' : 'Lưu'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

export default UserUpdateModal;