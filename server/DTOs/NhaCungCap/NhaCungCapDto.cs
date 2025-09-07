namespace server.DTOs.NhaCungCap
{
    public record NhaCungCapDto(
        string MaNhaCungCap,
        string Ten,
        string? NguoiLienHe,
        string? SoDienThoai,
        string? DiaChi,
        string? MaAnh,
        bool? IsDelete,
        bool? IsActive,
        DateTime? NgayTao,
        DateTime? NgayCapNhat,
        string? TenAnh = null,
        string? UrlAnh = null
    );

    public record NhaCungCapDetailDto(
        string MaNhaCungCap,
        string Ten,
        string? NguoiLienHe,
        string? SoDienThoai,
        string? DiaChi,
        string? MaAnh,
        bool? IsDelete,
        bool? IsActive,
        DateTime? NgayTao,
        DateTime? NgayCapNhat,
        string? TenAnh = null,
        string? UrlAnh = null,
        List<AnhNhaCungCapDto> AnhNhaCungCaps = null
    );

    public record NhaCungCapCreateDto(
        string Ten,
        string? NguoiLienHe,
        string? SoDienThoai,
        string? DiaChi,
        string? MaAnh
    );

    public record NhaCungCapUpdateDto(
        string? Ten,
        string? NguoiLienHe,
        string? SoDienThoai,
        string? DiaChi,
        string? MaAnh
    );

    public record AnhNhaCungCapDto(
        string MaAnhNhaCungCap,
        string MaNhaCungCap,
        string MaAnh,
        int? ThuTuHienThi,
        bool? IsDelete,
        bool? IsActive,
        DateTime? NgayTao,
        DateTime? NgayCapNhat,
        string? TenAnh = null,
        string? UrlAnh = null
    );

    public record AnhNhaCungCapCreateDto(
        string MaNhaCungCap,
        string MaAnh,
        int? ThuTuHienThi
    );

    public record AnhNhaCungCapUpdateDto(
        string? MaAnh,
        int? ThuTuHienThi
    );
}