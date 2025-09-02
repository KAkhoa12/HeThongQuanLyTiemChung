namespace server.DTOs.NguoiDung
{
    public record UserDto(
        string MaNguoiDung,
        string Ten,
        string Email,
        string SoDienThoai,
        DateOnly? NgaySinh,
        string DiaChi,
        string? GioiTinh,
        string MaVaiTro
    );

    public record UserInfoDto(
        string MaNguoiDung,
        string Ten,
        string Email,
        string? SoDienThoai,
        DateOnly? NgaySinh,
        string? DiaChi,
        string? GioiTinh,
        string Role,
        string? MoTaVaiTro,
        DateTime RegisteredAt,
        string? AvatarUrl
    );

    public record UserInfoWithPermissionsDto
    {
        public string MaNguoiDung { get; init; }
        public string Ten { get; init; }
        public string Email { get; init; }
        public string? SoDienThoai { get; init; }
        public DateOnly? NgaySinh { get; init; }
        public string? DiaChi { get; init; }
        public string Role { get; init; }
        public string? MoTaVaiTro { get; init; }
        public DateTime RegisteredAt { get; init; }
        public string? AvatarUrl { get; init; }
        public List<string> Permissions { get; init; } = new();
    }


    public record UserCreateDto(
        string Ten,
        string Email,
        string MatKhau,
        string? SoDienThoai,
        DateOnly? NgaySinh,
        string? DiaChi,
        string? GioiTinh);

    public record UserUpdateDto(
        string MaNguoiDung,
        string? Ten,
        string? SoDienThoai,
        DateOnly? NgaySinh,
        string? DiaChi,
        string? GioiTinh);

    // DTOs mới cho cập nhật thông tin cá nhân
    public record UserProfileUpdateDto(
        string? Ten,
        string? SoDienThoai,
        DateOnly? NgaySinh,
        string? DiaChi,
        string? GioiTinh,
        string? MaAnh,
        BacSiUpdateDto? BacSiInfo
    );

    // DTO cho cập nhật thông tin bác sĩ
    public record BacSiUpdateDto(
        string? ChuyenMon,
        string? SoGiayPhep
    );

    // DTOs cho thông tin sức khỏe
    public record HealthInfoDto(
        string MaThongTin,
        decimal? ChieuCao,
        decimal? CanNang,
        decimal? Bmi,
        string? NhomMau,
        string? BenhNen,
        string? DiUng,
        string? ThuocDangDung,
        bool? TinhTrangMangThai,
        DateOnly? NgayKhamGanNhat
    );

    public record HealthInfoUpdateDto(
        decimal? ChieuCao,
        decimal? CanNang,
        string? NhomMau,
        string? BenhNen,
        string? DiUng,
        string? ThuocDangDung,
        bool? TinhTrangMangThai,
        DateOnly? NgayKhamGanNhat
    );

    // DTO cho thông tin bác sĩ
    public record BacSiInfoDto(
        string MaBacSi,
        string? ChuyenMon,
        string? SoGiayPhep
    );

    // DTO cho thông tin quản lý
    public record QuanLyInfoDto(
        string MaQuanLy
    );

    // DTO cho thông tin người dùng thường (health info)
    public record UserHealthInfoDto(
        string MaThongTin,
        decimal? ChieuCao,
        decimal? CanNang,
        decimal? Bmi,
        string? NhomMau,
        string? BenhNen,
        string? DiUng,
        string? ThuocDangDung,
        bool? TinhTrangMangThai,
        DateOnly? NgayKhamGanNhat
    );

    // DTO tổng hợp thông tin người dùng với info theo vai trò
    public record UserCompleteProfileDto(
        string MaNguoiDung,
        string Ten,
        string Email,
        string? SoDienThoai,
        DateOnly? NgaySinh,
        string? DiaChi,
        string MaVaiTro,
        DateTime? NgayTao,
        string? MaAnh,
        object? Info // Thông tin theo vai trò: BacSiInfoDto, QuanLyInfoDto, hoặc UserInfoDto
    );
}


