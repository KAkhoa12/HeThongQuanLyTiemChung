import { UserCompleteProfileDto } from "../../../../services";

export const UserDeleteModal: React.FC<{
    user: UserCompleteProfileDto;
    onClose: () => void;
    onConfirm: () => void;
    loading: boolean;
  }> = ({ user, onClose, onConfirm, loading }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-boxdark rounded-lg p-6 max-w-md w-full mx-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-red-600">Xác nhận xóa</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Bạn có chắc chắn muốn xóa người dùng <strong>{user.ten}</strong>? 
            Hành động này không thể hoàn tác.
          </p>
          
          <div className="flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-opacity-90"
            >
              Hủy
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-opacity-90 disabled:opacity-50"
            >
              {loading ? 'Đang xóa...' : 'Xóa'}
            </button>
          </div>
        </div>
      </div>
    );
  };
  
export default UserDeleteModal;