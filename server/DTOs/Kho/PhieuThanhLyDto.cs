namespace server.DTOs.Kho
{
    public record PhieuThanhLyDto(
        string MaPhieuThanhLy,
        string? MaDiaDiem,
        DateTime? NgayThanhLy,
        string? TrangThai,
        DateTime? NgayTao,
        DateTime? NgayCapNhat,
        string? TenDiaDiem = null
    );

    public record PhieuThanhLyDetailDto(
        string MaPhieuThanhLy,
        string? MaDiaDiem,
        DateTime? NgayThanhLy,
        string? TrangThai,
        DateTime? NgayTao,
        DateTime? NgayCapNhat,
        string? TenDiaDiem = null,
        List<ChiTietThanhLyDto> ChiTietThanhLies = null
    );

    public record PhieuThanhLyCreateDto(
        string? MaDiaDiem,
        DateTime? NgayThanhLy,
        List<ChiTietThanhLyCreateDto> ChiTietThanhLies
    );

    public record PhieuThanhLyUpdateDto(
        string? MaDiaDiem = null,
        DateTime? NgayThanhLy = null,
        string? TrangThai = null
    );

    public record ChiTietThanhLyDto(
        string MaChiTiet,
        string MaPhieuThanhLy,
        string MaLo,
        int? SoLuong,
        string? LyDo,
        string? SoLo = null,
        string? TenVaccine = null,
        bool? IsDelete = null,
        bool? IsActive = null,
        DateTime? NgayTao = null,
        DateTime? NgayCapNhat = null,
        DateOnly? NgayHetHan = null
    );

    public record ChiTietThanhLyCreateDto(
        string MaLo,
        int SoLuong,
        string? LyDo
    );

}