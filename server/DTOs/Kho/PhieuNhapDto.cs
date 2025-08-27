namespace server.DTOs.Kho
{
    public record PhieuNhapDto(
        string MaPhieuNhap,
        string? MaNhaCungCap,
        string? MaQuanLy,
        DateTime? NgayNhap,
        decimal? TongTien,
        string? TrangThai,
        DateTime? NgayTao,
        DateTime? NgayCapNhat,
        string? TenNhaCungCap = null,
        string? TenQuanLy = null
    );

    public record PhieuNhapDetailDto(
        string MaPhieuNhap,
        string? MaNhaCungCap,
        string? MaQuanLy,
        DateTime? NgayNhap,
        decimal? TongTien,
        string? TrangThai,
        DateTime? NgayTao,
        DateTime? NgayCapNhat,
        string? TenNhaCungCap = null,
        string? TenQuanLy = null,
        List<ChiTietNhapDto> ChiTietNhaps = null
    );

    public record PhieuNhapCreateDto(
        string? MaNhaCungCap,
        string? MaQuanLy,
        DateTime? NgayNhap,
        List<ChiTietNhapCreateDto> ChiTietNhaps
    );

    public record PhieuNhapUpdateDto(
        string? MaNhaCungCap = null,
        string? MaQuanLy = null,
        DateTime? NgayNhap = null,
        string? TrangThai = null
    );

    public record ChiTietNhapDto(
        string MaChiTiet,
        string MaPhieuNhap,
        string MaLo,
        int? SoLuong,
        decimal? Gia,
        string? SoLo = null,
        string? TenVaccine = null,
        string? TenNhaCungCap = null
    );

    public record ChiTietNhapCreateDto(
        string MaLo,
        int SoLuong,
        decimal Gia
    );
} 