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
}
