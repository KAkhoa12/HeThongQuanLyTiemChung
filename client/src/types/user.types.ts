// Types cho User - tương ứng với DTOs từ backend

export interface UserCompleteProfileDto {
  maNguoiDung: string;
  ten: string;
  email: string;
  soDienThoai?: string;
  ngaySinh?: string; // DateOnly từ backend
  diaChi?: string;
  maVaiTro: string;
  ngayTao?: string; // DateTime từ backend
  healthInfo?: HealthInfoDto;
}

export interface UserProfileUpdateDto {
  ten?: string;
  soDienThoai?: string;
  ngaySinh?: string; // DateOnly
  diaChi?: string;
}

export interface HealthInfoDto {
  maThongTin: string;
  chieuCao?: number;
  canNang?: number;
  bmi?: number;
  nhomMau?: string;
  benhNen?: string;
  diUng?: string;
  thuocDangDung?: string;
  tinhTrangMangThai?: boolean;
  ngayKhamGanNhat?: string; // DateOnly
}

export interface HealthInfoUpdateDto {
  chieuCao?: number;
  canNang?: number;
  nhomMau?: string;
  benhNen?: string;
  diUng?: string;
  thuocDangDung?: string;
  tinhTrangMangThai?: boolean;
  ngayKhamGanNhat?: string; // DateOnly
}

export interface ChangePasswordDto {
  oldPassword: string;
  newPassword: string;
}

// Types cũ để tương thích ngược
export interface UserDto {
  maNguoiDung: string;
  ten: string;
  email: string;
  soDienThoai: string;
  ngaySinh?: string;
  diaChi: string;
  maVaiTro: string;
}

export interface UserInfoDto {
  maNguoiDung: string;
  ten: string;
  email: string;
  soDienThoai?: string;
  ngaySinh?: string;
  diaChi?: string;
  role: string;
  registeredAt: string;
  avatarUrl?: string;
}

export interface UserCreateDto {
  ten: string;
  email: string;
  matKhau: string;
  soDienThoai?: string;
  ngaySinh?: string;
  diaChi?: string;
}

export interface UserUpdateDto {
  maNguoiDung: string;
  ten?: string;
  soDienThoai?: string;
  ngaySinh?: string;
  diaChi?: string;
} 