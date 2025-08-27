namespace server.DTOs.NguoiDung
{
    public record UserDto(
        string MaNguoiDung,
        string Ten,
        string Email,
        string SoDienThoai,
        DateOnly? NgaySinh,
        string DiaChi,
        string MaVaiTro
    );
    
    public record UserInfoDto(
        string MaNguoiDung,
        string Ten,
        string Email,
        string? SoDienThoai,
        DateOnly? NgaySinh,
        string? DiaChi,
        string Role,
        DateTime RegisteredAt,
        string? AvatarUrl
    );

    public record UserCreateDto(
        string Ten,
        string Email,
        string MatKhau,
        string? SoDienThoai,
        DateOnly? NgaySinh,
        string? DiaChi);

    public record UserUpdateDto(
        string MaNguoiDung,
        string? Ten,
        string? SoDienThoai,
        DateOnly? NgaySinh,
        string? DiaChi);

    // DTOs mới cho cập nhật thông tin cá nhân
    public record UserProfileUpdateDto(
        string? Ten,
        string? SoDienThoai,
        DateOnly? NgaySinh,
        string? DiaChi
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

    // DTO tổng hợp thông tin người dùng
    public record UserCompleteProfileDto(
        string MaNguoiDung,
        string Ten,
        string Email,
        string? SoDienThoai,
        DateOnly? NgaySinh,
        string? DiaChi,
        string MaVaiTro,
        DateTime? NgayTao,
        HealthInfoDto? HealthInfo
    );
}


