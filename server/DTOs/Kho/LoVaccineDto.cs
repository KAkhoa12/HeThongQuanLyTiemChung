namespace server.DTOs.Kho
{
    public record LoVaccineDto(
        string MaLo,
        string MaVaccine,
        string MaNhaCungCap,
        string? SoLo,
        DateOnly? NgaySanXuat,
        DateOnly? NgayHetHan,
        int? SoLuongNhap,
        int? SoLuongHienTai,
        decimal? GiaNhap,
        DateTime? NgayTao,
        DateTime? NgayCapNhat,
        string? TenVaccine = null,
        string? TenNhaCungCap = null
    );

    public record LoVaccineDetailDto(
        string MaLo,
        string MaVaccine,
        string MaNhaCungCap,
        string? SoLo,
        DateOnly? NgaySanXuat,
        DateOnly? NgayHetHan,
        int? SoLuongNhap,
        int? SoLuongHienTai,
        decimal? GiaNhap,
        DateTime? NgayTao,
        DateTime? NgayCapNhat,
        string? TenVaccine = null,
        string? TenNhaCungCap = null,
        List<TonKhoLoDto> TonKhoLos = null
    );

    public record LoVaccineCreateDto(
        string MaVaccine,
        string MaNhaCungCap,
        string? SoLo,
        DateOnly? NgaySanXuat,
        DateOnly? NgayHetHan,
        int SoLuongNhap,
        decimal GiaNhap
    );

    public record LoVaccineUpdateDto(
        string? SoLo = null,
        DateOnly? NgaySanXuat = null,
        DateOnly? NgayHetHan = null,
        int? SoLuongHienTai = null,
        decimal? GiaNhap = null
    );
} 