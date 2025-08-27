namespace server.DTOs.Kho
{
    public record PhieuXuatDto(
        string MaPhieuXuat,
        string? MaDiaDiemXuat,
        string? MaDiaDiemNhap,
        string? MaQuanLy,
        DateTime? NgayXuat,
        string? LoaiXuat,
        string? TrangThai,
        DateTime? NgayTao,
        DateTime? NgayCapNhat,
        string? TenDiaDiemXuat = null,
        string? TenDiaDiemNhap = null,
        string? TenQuanLy = null
    );

    public record PhieuXuatDetailDto(
        string MaPhieuXuat,
        string? MaDiaDiemXuat,
        string? MaDiaDiemNhap,
        string? MaQuanLy,
        DateTime? NgayXuat,
        string? LoaiXuat,
        string? TrangThai,
        DateTime? NgayTao,
        DateTime? NgayCapNhat,
        string? TenDiaDiemXuat = null,
        string? TenDiaDiemNhap = null,
        string? TenQuanLy = null,
        List<ChiTietXuatDto> ChiTietXuats = null
    );

    public record PhieuXuatCreateDto(
        string? MaDiaDiemXuat,
        string? MaDiaDiemNhap,
        string? MaQuanLy,
        DateTime? NgayXuat,
        string? LoaiXuat,
        List<ChiTietXuatCreateDto> ChiTietXuats
    );

    public record PhieuXuatUpdateDto(
        string? MaDiaDiemXuat = null,
        string? MaDiaDiemNhap = null,
        string? MaQuanLy = null,
        DateTime? NgayXuat = null,
        string? LoaiXuat = null,
        string? TrangThai = null
    );

    public record ChiTietXuatDto(
        string MaChiTietXuat,
        string MaPhieuXuat,
        string MaLo,
        int? SoLuong,
        string? SoLo = null,
        string? TenVaccine = null
    );

    public record ChiTietXuatCreateDto(
        string MaLo,
        int SoLuong
    );
} 