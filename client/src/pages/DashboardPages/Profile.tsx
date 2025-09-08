import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { getMyProfile, updateProfile, updateHealthInfo, uploadAvatar } from '../../services/user.service';
import { useToast } from '../../hooks/useToast';
import { useAllLocations } from '../../hooks/useLocations';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import CoverOne from '../../images/cover/cover-01.png';
import userSix from '../../images/user/user-06.png';
import type { UserCompleteProfileDto, UserProfileUpdateDto, HealthInfoUpdateDto } from '../../types/user.types';

const Profile = () => {
  const { user } = useAuthStore();
  const { showSuccess, showError } = useToast();
  
  const [profile, setProfile] = useState<UserCompleteProfileDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // Form states
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<UserProfileUpdateDto>({});
  const [healthData, setHealthData] = useState<HealthInfoUpdateDto>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  
  // Hook for getting locations
  const { data: locations, execute: fetchLocations } = useAllLocations();

  // Load profile data
  useEffect(() => {
    loadProfile();
  }, []);

  // Load locations
  useEffect(() => {
    fetchLocations();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await getMyProfile();
      setProfile(data);
      setFormData({
        ten: data.ten,
        soDienThoai: data.soDienThoai,
        ngaySinh: data.ngaySinh,
        diaChi: data.diaChi,
        maAnh: data.maAnh,
        bacSiInfo: data.info && 'maBacSi' in data.info ? {
          chuyenMon: data.info.chuyenMon,
          soGiayPhep: data.info.soGiayPhep,
          maDiaDiem: data.info.maDiaDiem
        } : undefined
      });
      
      // Set health data if user has health info
      if (data.info && 'maThongTin' in data.info) {
        setHealthData({
          chieuCao: data.info.chieuCao,
          canNang: data.info.canNang,
          nhomMau: data.info.nhomMau,
          benhNen: data.info.benhNen,
          diUng: data.info.diUng,
          thuocDangDung: data.info.thuocDangDung,
          tinhTrangMangThai: data.info.tinhTrangMangThai,
          ngayKhamGanNhat: data.info.ngayKhamGanNhat
        });
      }
    } catch (error) {
      showError('Lỗi', 'Không thể tải thông tin profile');
    } finally {
      setLoading(false);
    }
  };

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  // Upload avatar
  const handleUploadAvatar = async () => {
    if (!selectedFile) return;

    try {
      setUploading(true);
      const result = await uploadAvatar(selectedFile);
      
      // Update form data with new image
      setFormData(prev => ({ ...prev, maAnh: result.maAnh }));
      setProfile(prev => prev ? { ...prev, maAnh: result.maAnh } : null);
      
      showSuccess('Thành công', 'Upload ảnh đại diện thành công');
      setSelectedFile(null);
      setPreviewUrl('');
    } catch (error) {
      showError('Lỗi', 'Không thể upload ảnh');
    } finally {
      setUploading(false);
    }
  };

  // Save profile
  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      
      // Update profile
      await updateProfile(formData);
      
      // Update health info if user role is USER
      if (user?.role === 'USER' && profile?.info && 'maThongTin' in profile.info) {
        await updateHealthInfo(healthData);
      }
      
      showSuccess('Thành công', 'Cập nhật thông tin thành công');
      setEditMode(false);
      await loadProfile(); // Reload data
    } catch (error) {
      showError('Lỗi', 'Không thể cập nhật thông tin');
    } finally {
      setSaving(false);
    }
  };

  // Cancel edit
  const handleCancelEdit = () => {
    setEditMode(false);
    loadProfile(); // Reset form data
    setSelectedFile(null);
    setPreviewUrl('');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center text-red-500 p-4">
        Không thể tải thông tin profile
      </div>
    );
  }

  const avatarUrl = profile.maAnh || userSix;
  const isDoctor = user?.role === 'DOCTOR';
  const isManager = user?.role === 'MANAGER';
  const isUser = user?.role === 'USER';

  return (
    <>
      <Breadcrumb pageName="Profile" />

      <div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="relative z-20 h-35 md:h-65">
          <img
            src={CoverOne}
            alt="profile cover"
            className="h-full w-full rounded-tl-sm rounded-tr-sm object-cover object-center"
          />
        </div>
        
        <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
          <div className="relative z-30 mx-auto -mt-22 h-30 w-full max-w-30 rounded-full bg-white/20 p-1 backdrop-blur sm:h-44 sm:max-w-44 sm:p-3">
            <div className="relative drop-shadow-2">
              <img 
                src={previewUrl || avatarUrl} 
                alt="profile" 
                className="w-full h-full rounded-full object-cover"
              />
              {editMode && (
                <label
                  htmlFor="profile"
                  className="absolute bottom-0 right-0 flex h-8.5 w-8.5 cursor-pointer items-center justify-center rounded-full bg-primary text-white hover:bg-opacity-90 sm:bottom-2 sm:right-2"
                >
                  <svg
                    className="fill-current"
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M4.76464 1.42638C4.87283 1.2641 5.05496 1.16663 5.25 1.16663H8.75C8.94504 1.16663 9.12717 1.2641 9.23536 1.42638L10.2289 2.91663H12.25C12.7141 2.91663 13.1592 3.101 13.4874 3.42919C13.8156 3.75738 14 4.2025 14 4.66663V11.0833C14 11.5474 13.8156 11.9925 13.4874 12.3207C13.1592 12.6489 12.7141 12.8333 12.25 12.8333H1.75C1.28587 12.8333 0.840752 12.6489 0.512563 12.3207C0.184375 11.9925 0 11.5474 0 11.0833V4.66663C0 4.2025 0.184374 3.75738 0.512563 3.42919C0.840752 3.101 1.28587 2.91663 1.75 2.91663H3.77114L4.76464 1.42638ZM5.56219 2.33329L4.5687 3.82353C4.46051 3.98582 4.27837 4.08329 4.08333 4.08329H1.75C1.59529 4.08329 1.44692 4.14475 1.33752 4.25415C1.22812 4.36354 1.16667 4.51192 1.16667 4.66663V11.0833C1.16667 11.238 1.22812 11.3864 1.33752 11.4958C1.44692 11.6052 1.59529 11.6666 1.75 11.6666H12.25C12.4047 11.6666 12.5531 11.6052 12.6625 11.4958C12.7719 11.3864 12.8333 11.238 12.8333 11.0833V4.66663C12.8333 4.51192 12.7719 4.36354 12.6625 4.25415C12.5531 4.14475 12.4047 4.08329 12.25 4.08329H9.91667C9.72163 4.08329 9.53949 3.98582 9.4313 3.82353L8.43781 2.33329H5.56219Z"
                      fill=""
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M7.00004 5.83329C6.03354 5.83329 5.25004 6.61679 5.25004 7.58329C5.25004 8.54979 6.03354 9.33329 7.00004 9.33329C7.96654 9.33329 8.75004 8.54979 8.75004 7.58329C8.75004 6.61679 7.96654 5.83329 7.00004 5.83329ZM4.08337 7.58329C4.08337 5.97246 5.38921 4.66663 7.00004 4.66663C8.61087 4.66663 9.91671 5.97246 9.91671 7.58329C9.91671 9.19412 8.61087 10.5 7.00004 10.5C5.38921 10.5 4.08337 9.19412 4.08337 7.58329Z"
                      fill=""
                    />
                  </svg>
                  <input
                    type="file"
                    name="profile"
                    id="profile"
                    className="sr-only"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </label>
              )}
            </div>
          </div>

          {/* Upload button for selected file */}
          {editMode && selectedFile && (
            <div className="mt-4">
              <button
                onClick={handleUploadAvatar}
                disabled={uploading}
                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 disabled:opacity-50"
              >
                {uploading ? 'Đang upload...' : 'Upload ảnh'}
              </button>
            </div>
          )}

          <div className="mt-4">
            <div className="flex items-center justify-center gap-4 mb-4">
              <h3 className="text-2xl font-semibold text-black dark:text-white">
                {editMode ? (
                  <input
                    type="text"
                    value={formData.ten || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, ten: e.target.value }))}
                    className="text-center bg-transparent border-b border-gray-300 focus:border-primary outline-none"
                  />
                ) : (
                  profile.ten
                )}
              </h3>
              
              {!editMode && (
                <button
                  onClick={() => setEditMode(true)}
                  className="px-3 py-1 text-sm bg-primary text-white rounded hover:bg-primary/90"
                >
                  <i className="ri-edit-line mr-1"></i>
                  Chỉnh sửa
                </button>
              )}
            </div>

            <p className="font-medium text-gray-600 dark:text-gray-400 mb-4">
              {isDoctor ? 'Bác sĩ' : isManager ? 'Quản lý' : 'Người dùng'}
            </p>

            {/* Profile Information */}
            <div className="mx-auto max-w-180">
              <h4 className="font-semibold text-black dark:text-white mb-4">
                Thông tin cá nhân
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <p className="text-gray-900 dark:text-white">{profile.email}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Số điện thoại
                  </label>
                  {editMode ? (
                    <input
                      type="text"
                      value={formData.soDienThoai || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, soDienThoai: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:border-primary outline-none"
                    />
                  ) : (
                    <p className="text-gray-900 dark:text-white">{profile.soDienThoai || 'Chưa cập nhật'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Ngày sinh
                  </label>
                  {editMode ? (
                    <input
                      type="date"
                      value={formData.ngaySinh || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, ngaySinh: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:border-primary outline-none"
                    />
                  ) : (
                    <p className="text-gray-900 dark:text-white">{profile.ngaySinh || 'Chưa cập nhật'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Địa chỉ
                  </label>
                  {editMode ? (
                    <input
                      type="text"
                      value={formData.diaChi || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, diaChi: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:border-primary outline-none"
                    />
                  ) : (
                    <p className="text-gray-900 dark:text-white">{profile.diaChi || 'Chưa cập nhật'}</p>
                  )}
                </div>
              </div>

              {/* Doctor Information */}
              {(isDoctor || isManager) && profile.info && 'maBacSi' in profile.info && (
                <div className="mt-6">
                  <h4 className="font-semibold text-black dark:text-white mb-4">
                    Thông tin bác sĩ
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Chuyên môn
                      </label>
                      <p className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded">
                        {profile.info.chuyenMon || 'Chưa cập nhật'}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Số giấy phép
                      </label>
                      <p className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded">
                        {profile.info.soGiayPhep || 'Chưa cập nhật'}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Địa điểm làm việc
                      </label>
                      {editMode ? (
                        <select
                          value={formData.bacSiInfo?.maDiaDiem || ''}
                          onChange={(e) => setFormData(prev => ({ 
                            ...prev, 
                            bacSiInfo: { ...prev.bacSiInfo, maDiaDiem: e.target.value }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:border-primary outline-none"
                        >
                          <option value="">Chọn địa điểm làm việc</option>
                          {locations?.map((location) => (
                            <option key={location.id} value={location.id}>
                              {location.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <p className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded">
                          {profile.info.tenDiaDiem || 'Chưa cập nhật'}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    <i className="ri-information-line mr-1"></i>
                    Thông tin bác sĩ chỉ có thể được cập nhật bởi quản trị viên
                  </div>
                </div>
              )}

              {/* Health Information for users */}
              {isUser && profile.info && 'maThongTin' in profile.info && (
                <div className="mt-6">
                  <h4 className="font-semibold text-black dark:text-white mb-4">
                    Thông tin sức khỏe
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Chiều cao (cm)
                      </label>
                      {editMode ? (
                        <input
                          type="number"
                          value={healthData.chieuCao || ''}
                          onChange={(e) => setHealthData(prev => ({ ...prev, chieuCao: Number(e.target.value) }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:border-primary outline-none"
                        />
                      ) : (
                                                 <p className="text-gray-900 dark:text-white">{profile.info.chieuCao || 'Chưa cập nhật'}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Cân nặng (kg)
                      </label>
                      {editMode ? (
                        <input
                          type="number"
                          value={healthData.canNang || ''}
                          onChange={(e) => setHealthData(prev => ({ ...prev, canNang: Number(e.target.value) }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:border-primary outline-none"
                        />
                      ) : (
                                                 <p className="text-gray-900 dark:text-white">{profile.info.canNang || 'Chưa cập nhật'}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Nhóm máu
                      </label>
                      {editMode ? (
                        <input
                          type="text"
                          value={healthData.nhomMau || ''}
                          onChange={(e) => setHealthData(prev => ({ ...prev, nhomMau: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:border-primary outline-none"
                        />
                      ) : (
                                                 <p className="text-gray-900 dark:text-white">{profile.info.nhomMau || 'Chưa cập nhật'}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Bệnh nền
                      </label>
                      {editMode ? (
                        <textarea
                          value={healthData.benhNen || ''}
                          onChange={(e) => setHealthData(prev => ({ ...prev, benhNen: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:border-primary outline-none"
                          rows={3}
                        />
                      ) : (
                                                 <p className="text-gray-900 dark:text-white">{profile.info.benhNen || 'Chưa cập nhật'}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action buttons */}
            {editMode && (
              <div className="mt-6 flex justify-center gap-4">
                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="px-6 py-2 bg-primary text-white rounded hover:bg-primary/90 disabled:opacity-50"
                >
                  {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Hủy
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
