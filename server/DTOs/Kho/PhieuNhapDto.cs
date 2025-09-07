namespace server.DTOs.Kho
{
    public record PhieuNhapDto(
        string MaPhieuNhap,
        string? MaNhaCungCap,
        string? MaQuanLy,
        DateTime? NgayNhap,
        decimal? TongTien,
        string? TrangThai,
        DateTime? NgayCapNhat,
        string? TenNhaCungCap = null,
        string? TenQuanLy = null,
        string? TenDiaDiem = null
    );

    public record PhieuNhapDetailDto(
        string MaPhieuNhap,
        string? MaNhaCungCap,
        string? MaQuanLy,
        DateTime? NgayNhap,
        decimal? TongTien,
        string? TrangThai,
        DateTime? NgayCapNhat,
        string? TenNhaCungCap = null,
        string? TenQuanLy = null,
        string? TenDiaDiem = null,
        List<ChiTietNhapDto>? ChiTietNhaps = null
    );

    public class PhieuNhapCreateDto
    {
        public string? MaNhaCungCap { get; set; }
        public string? MaQuanLy { get; set; }
        public string? MaDiaDiem { get; set; }
        public DateTime? NgayNhap { get; set; }
        public List<ChiTietNhapCreateDto> ChiTietNhaps { get; set; } = new List<ChiTietNhapCreateDto>();
    }

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

    public class ChiTietNhapCreateDto
    {
        public string MaLo { get; set; } = string.Empty;
        public int SoLuong { get; set; }
        public decimal Gia { get; set; }
    }

}