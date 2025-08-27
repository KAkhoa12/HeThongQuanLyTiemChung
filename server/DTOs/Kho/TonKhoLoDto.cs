namespace server.DTOs.Kho
{
    public record TonKhoLoDto(
        string MaTonKho,
        string? MaDiaDiem,
        string? MaLo,
        int? SoLuong,
        DateTime? NgayTao,
        DateTime? NgayCapNhat,
        string? TenDiaDiem = null,
        string? SoLo = null,
        string? TenVaccine = null
    );

    public record TonKhoLoCreateDto(
        string MaDiaDiem,
        string MaLo,
        int SoLuong
    );

    public record TonKhoLoUpdateDto(
        int? SoLuong = null,
        string? MaDiaDiem = null,
        string? MaLo = null
    );

    public record TonKhoSummaryDto(
        string MaDiaDiem,
        string TenDiaDiem,
        int TongSoLo,
        int TongSoLuong,
        decimal TongGiaTri
    );
} 