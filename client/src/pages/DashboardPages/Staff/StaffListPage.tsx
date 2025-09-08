import { useEffect, useState } from 'react';
import { getAllUsers, getUserById, createUserDoctor, createUserManager, updateUser, deleteUser } from '../../../services/user.service';
import { useAllLocations } from '../../../hooks/useLocations';
import { useToast } from '../../../hooks/useToast';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import type { UserCompleteProfileDto } from '../../../types/user.types';

export interface UserFormData {
  ten: string;
  email: string;
  matKhau: string;
  soDienThoai: string;
  ngaySinh: string;
  diaChi: string;
  gioiTinh: string;
  maVaiTro: string;
  // Doctor specific fields
  chuyenMon?: string;
  soGiayPhep?: string;
  maDiaDiem?: string;
  // Manager specific fields
  maQuanLy?: string;
}

const StaffListPage = () => {
  const { showSuccess, showError } = useToast();
  const { data: locations, execute: fetchLocations } = useAllLocations();
  
  // State for user list and pagination
  const [loading, setLoading] = useState<boolean>(true);
  const [userList, setUserList] = useState<UserCompleteProfileDto[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    pageSize: 10,
  });
  
  // State for filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>('VT002'); // Default to DOCTOR
  
  // State for form
  const [selectedUser, setSelectedUser] = useState<UserCompleteProfileDto | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState<UserFormData>({
    ten: '',
    email: '',
    matKhau: '',
    soDienThoai: '',
    ngaySinh: '',
    diaChi: '',
    gioiTinh: '',
    maVaiTro: 'VT002', // Default to DOCTOR
    chuyenMon: '',
    soGiayPhep: '',
    maDiaDiem: '',
    maQuanLy: ''
  });

  useEffect(() => {
    fetchUserList();
    fetchLocations();
  }, [pagination.currentPage, searchQuery, selectedRole]);

  const fetchUserList = async () => {
    try {
      setLoading(true);
      const response = await getAllUsers(
        pagination.currentPage,
        pagination.pageSize,
        searchQuery || undefined,
        selectedRole || undefined
      ) as any;
      
      setUserList(response.data);
      setPagination({
        ...pagination,
        totalPages: response.totalPages,
        totalItems: response.totalCount,
      });
    } catch (error) {
      console.error('Failed to fetch user list:', error);
      showError('Lỗi', 'Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setPagination({ ...pagination, currentPage: page });
  };

  const handleUserSelect = async (user: UserCompleteProfileDto) => {
    try {
      setLoading(true);
      // Call API to get detailed user information
      const detailedUser = await getUserById(user.maNguoiDung) as UserCompleteProfileDto;
      
      setSelectedUser(detailedUser);
      setIsEditing(true);
      
      const isDoctor = detailedUser.maVaiTro === 'VT002';
      const doctorInfo = isDoctor && detailedUser.info && 'maBacSi' in detailedUser.info ? detailedUser.info : null;
      
      setFormData({
        ten: detailedUser.ten,
        email: detailedUser.email,
        matKhau: '',
        soDienThoai: detailedUser.soDienThoai || '',
        ngaySinh: detailedUser.ngaySinh ? new Date(detailedUser.ngaySinh).toISOString().split('T')[0] : '',
        diaChi: detailedUser.diaChi || '',
        gioiTinh: '',
        maVaiTro: detailedUser.maVaiTro,
        chuyenMon: doctorInfo?.chuyenMon || '',
        soGiayPhep: doctorInfo?.soGiayPhep || '',
        maDiaDiem: doctorInfo?.maDiaDiem || '',
        maQuanLy: detailedUser.maNguoiDung // For manager, use user ID as manager code
      });
    } catch (error) {
      console.error('Failed to fetch user details:', error);
      showError('Lỗi', 'Không thể tải thông tin chi tiết người dùng');
    } finally {
      setLoading(false);
    }
  };


  const handleCreateUser = async () => {
    try {
      setLoading(true);
      const userData = {
        ten: formData.ten,
        email: formData.email,
        matKhau: formData.matKhau,
        soDienThoai: formData.soDienThoai,
        ngaySinh: formData.ngaySinh ? new Date(formData.ngaySinh).toISOString().split('T')[0] : undefined,
        diaChi: formData.diaChi,
        gioiTinh: formData.gioiTinh,
        maVaiTro: formData.maVaiTro
      };

      if (formData.maVaiTro === 'VT002') { // Doctor
        await createUserDoctor({
          ...userData,
          chuyenMon: formData.chuyenMon,
          soGiayPhep: formData.soGiayPhep,
          maDiaDiem: formData.maDiaDiem
        });
      } else {
        await createUserManager(userData);
      }

      showSuccess('Thành công', 'Tạo người dùng thành công');
      resetForm();
      fetchUserList();
    } catch (error) {
      console.error('Create user failed:', error);
      showError('Lỗi', 'Không thể tạo người dùng');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;
    
    try {
      setLoading(true);
      const updateData = {
        ten: formData.ten,
        soDienThoai: formData.soDienThoai,
        ngaySinh: formData.ngaySinh ? new Date(formData.ngaySinh).toISOString().split('T')[0] : undefined,
        diaChi: formData.diaChi,
        gioiTinh: formData.gioiTinh,
        isActive: selectedUser.isActive
      };

      // Add doctor-specific fields if user is a doctor
      if (selectedUser.maVaiTro === 'VT002') {
        (updateData as any).bacSiInfo = {
          chuyenMon: formData.chuyenMon,
          soGiayPhep: formData.soGiayPhep,
          maDiaDiem: formData.maDiaDiem
        };
      }

      await updateUser(selectedUser.maNguoiDung, updateData);
      showSuccess('Thành công', 'Cập nhật người dùng thành công');
      resetForm();
      fetchUserList();
    } catch (error) {
      console.error('Update user failed:', error);
      showError('Lỗi', 'Không thể cập nhật người dùng');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (user: UserCompleteProfileDto) => {
    try {
      setLoading(true);
      await deleteUser(user.maNguoiDung);
      showSuccess('Thành công', 'Xóa người dùng thành công');
      fetchUserList();
    } catch (error) {
      console.error('Delete user failed:', error);
      showError('Lỗi', 'Không thể xóa người dùng');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (user: UserCompleteProfileDto) => {
    try {
      setLoading(true);
      await updateUser(user.maNguoiDung, { isActive: !user.isActive });
      showSuccess('Thành công', `${user.isActive ? 'Ẩn' : 'Hiện'} tài khoản thành công`);
      fetchUserList();
    } catch (error) {
      console.error('Toggle active failed:', error);
      showError('Lỗi', 'Không thể cập nhật trạng thái tài khoản');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      ten: '',
      email: '',
      matKhau: '',
      soDienThoai: '',
      ngaySinh: '',
      diaChi: '',
      gioiTinh: '',
      maVaiTro: 'VT002',
      chuyenMon: '',
      soGiayPhep: '',
      maDiaDiem: '',
      maQuanLy: ''
    });
    setSelectedUser(null);
    setIsEditing(false);
  };


  return (
    <div className="p-5">
      <Breadcrumb pageName="Quản lý nhân viên" />

      <div className="grid grid-cols-12 gap-6 ">
        {/* Left Column - User Form (3 columns) */}
        <div className="col-span-12 lg:col-span-3">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6 dark:border-strokedark flex-row justify-between items-center"> 
              <h3 className="font-medium text-black dark:text-white">
                Quản lý nhân viên 
              </h3>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Thêm/ sửa thông tin cơ bản
              </span>
            </div>
            {/* Section Info User Doctor or Manager */}
            <section className="p-6">
              <form onSubmit={(e) => { e.preventDefault(); isEditing ? handleUpdateUser() : handleCreateUser(); }} className="space-y-4">
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
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:border-primary outline-none"
                    required
                    disabled={isEditing}
                  />
                </div>

                {!isEditing && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Mật khẩu *
                    </label>
                    <input
                      type="password"
                      value={formData.matKhau}
                      onChange={(e) => setFormData(prev => ({ ...prev, matKhau: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:border-primary outline-none"
                      required
                    />
                  </div>
                )}

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

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Vai trò *
                  </label>
                  <select
                    value={formData.maVaiTro}
                    onChange={(e) => setFormData(prev => ({ ...prev, maVaiTro: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:border-primary outline-none"
                    required
                    disabled={isEditing}
                  >
                    <option value="VT002">Bác sĩ</option>
                    <option value="VT003">Quản lý</option>
                  </select>
                </div>

                {/* Doctor-specific fields */}
                {formData.maVaiTro === 'VT002' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Mã bác sĩ
                      </label>
                      <input
                        type="text"
                        value={selectedUser?.info && 'maBacSi' in selectedUser.info ? selectedUser.info.maBacSi : ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100"
                        readOnly
                      />
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

                {/* Manager-specific fields */}
                {formData.maVaiTro === 'VT003' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Mã quản lý
                    </label>
                    <input
                      type="text"
                      value={formData.maQuanLy || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100"
                      readOnly
                    />
                  </div>
                )}

                <div className="flex space-x-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-primary text-white rounded hover:bg-opacity-90 disabled:opacity-50"
                  >
                    {loading ? 'Đang xử lý...' : (isEditing ? 'Cập nhật' : 'Thêm mới')}
                  </button>
                  {isEditing && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-opacity-90"
                    >
                      Hủy
                    </button>
                  )}
                </div>
              </form>
            </section>
          </div>
        </div>

        {/* Right Column - Filters and Table (9 columns) */}
        <div className="col-span-12 lg:col-span-9">
          <div className=" sticky top-24 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Danh sách người dùng
              </h3>
            </div>
            
            {/* Filters */}
            <div className="p-6 border-b border-stroke dark:border-strokedark">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Tìm kiếm theo tên hoặc email..."
                    className="w-full rounded-md border border-stroke bg-transparent py-2 px-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="md:w-48">
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="w-full rounded-md border border-stroke bg-transparent py-2 px-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  >
                    <option value="VT002">Bác sĩ</option>
                    <option value="VT003">Quản lý</option>
                  </select>
                </div>
                <button
                  onClick={resetForm}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90"
                >
                  Thêm mới
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="max-w-full overflow-x-auto">
              {loading ? (
                <div className="text-center py-10">
                  <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
                </div>
              ) : userList.length === 0 ? (
            <div className="text-center py-10">
                  <p className="text-lg text-gray-500">Không tìm thấy người dùng nào</p>
            </div>
          ) : (
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                  <th className="py-4 px-4 font-medium text-black dark:text-white">
                        Tên người dùng
                  </th>
                  <th className="py-4 px-4 font-medium text-black dark:text-white">
                    Email
                  </th>
                  <th className="py-4 px-4 font-medium text-black dark:text-white">
                    Số điện thoại
                  </th>
                  <th className="py-4 px-4 font-medium text-black dark:text-white">
                    Vai trò
                  </th>
                  <th className="py-4 px-4 font-medium text-black dark:text-white">
                    Ngày tạo
                  </th>
                  <th className="py-4 px-4 font-medium text-black dark:text-white">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                    {userList.map((user) => (
                      <tr 
                        key={user.maNguoiDung}
                        className={`cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 ${
                          selectedUser?.maNguoiDung === user.maNguoiDung ? 'bg-blue-50 dark:bg-blue-900' : ''
                        }`}
                        onClick={() => handleUserSelect(user)}
                      >
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-lg font-semibold text-gray-600">
                                {user.ten.charAt(0).toUpperCase()}
                            </span>
                            </div>
                            <p className="text-black dark:text-white">{user.ten}</p>
                      </div>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                          <p className="text-black dark:text-white">{user.email}</p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                          <p className="text-black dark:text-white">{user.soDienThoai || 'N/A'}</p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                          <p className="text-black dark:text-white">
                            {user.maVaiTro === 'VT002' ? 'Bác sĩ' : 
                             user.maVaiTro === 'VT003' ? 'Quản lý' : 'Người dùng'}
                          </p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                            {user.ngayTao ? new Date(user.ngayTao).toLocaleDateString('vi-VN') : 'N/A'}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <div className="flex items-center space-x-3.5">
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={user.isActive}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  handleToggleActive(user);
                                }}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                            </label>
                        <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteUser(user);
                              }}
                              className="hover:text-red-500"
                          title="Xóa"
                        >
                              <svg className="fill-current" width="18" height="18" viewBox="0 0 18 18" fill="none">
                                <path d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z" fill=""/>
                                <path d="M9.00039 9.11255C8.66289 9.11255 8.35352 9.3938 8.35352 9.75942V13.3313C8.35352 13.6688 8.63477 13.9782 9.00039 13.9782C9.33789 13.9782 9.64727 13.6969 9.64727 13.3313V9.75942C9.64727 9.3938 9.33789 9.11255 9.00039 9.11255Z" fill=""/>
                                <path d="M11.2502 9.67504C10.8846 9.64692 10.6033 9.90004 10.5752 10.2657L10.4064 12.7407C10.3783 13.0782 10.6314 13.3875 10.9971 13.4157C11.0252 13.4157 11.0252 13.4157 11.0533 13.4157C11.3908 13.4157 11.6721 13.1625 11.6721 12.825L11.8408 10.35C11.8408 9.98442 11.5877 9.70317 11.2502 9.67504Z" fill=""/>
                                <path d="M6.72245 9.67504C6.38495 9.70317 6.1037 10.0125 6.13182 10.35L6.3287 12.825C6.35683 13.1625 6.63808 13.4157 6.94745 13.4157C6.97558 13.4157 6.97558 13.4157 7.0037 13.4157C7.3412 13.3875 7.62245 13.0782 7.59433 12.7407L7.39745 10.2657C7.39745 9.90004 7.08808 9.64692 6.72245 9.67504Z" fill=""/>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center mt-6 mb-4">
            <nav>
              <ul className="flex space-x-1">
                <li>
                  <button
                    onClick={() => handlePageChange(Math.max(1, pagination.currentPage - 1))}
                    disabled={pagination.currentPage === 1}
                    className={`px-3 py-1 rounded-md ${
                      pagination.currentPage === 1
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    &laquo;
                  </button>
                </li>
                {[...Array(pagination.totalPages)].map((_, index) => (
                  <li key={index}>
                    <button
                      onClick={() => handlePageChange(index + 1)}
                      className={`px-3 py-1 rounded-md ${
                        pagination.currentPage === index + 1
                          ? 'bg-primary text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {index + 1}
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    onClick={() =>
                      handlePageChange(Math.min(pagination.totalPages, pagination.currentPage + 1))
                    }
                    disabled={pagination.currentPage === pagination.totalPages}
                    className={`px-3 py-1 rounded-md ${
                      pagination.currentPage === pagination.totalPages
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    &raquo;
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>
        </div>
      </div>

    </div>
  );
};




export default StaffListPage;