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
    string Id,
    string Name,
    string Email,
    string? Phone,
    DateOnly? Dob,
    string? Address,
    string Role,
    DateTime RegisteredAt);
}
