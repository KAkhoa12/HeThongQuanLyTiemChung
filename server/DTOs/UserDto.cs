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
    DateTime RegisteredAt
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
}


