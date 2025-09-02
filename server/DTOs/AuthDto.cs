namespace server.DTOs.Auth
{
    public record RegisterDto(
        string Ten,
        string Email,
        string MatKhau,
        string? SoDienThoai,
        DateOnly? NgaySinh,
        string? DiaChi,
        string? GioiTinh);

    public record LoginDto(string Email, string MatKhau);

    public record TokenResponseDto(
        string AccessToken,
        string RefreshToken,
        DateTime ExpiresAt,
        string UserId);
    public record RefreshRequestDto(string RefreshToken);
}

