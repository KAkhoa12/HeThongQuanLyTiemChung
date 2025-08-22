using System.ComponentModel.DataAnnotations;

namespace server.DTOs.PhieuNhap;

public class PhieuNhapDto
{
    public string MaPhieuNhap { get; set; } = null!;
    public string? MaNhaCungCap { get; set; }
    public DateTime? NgayNhap { get; set; }
    public decimal? TongTien { get; set; }
    public string? TrangThai { get; set; }
    public bool? IsDelete { get; set; }
    public bool? IsActive { get; set; }
    public DateTime? NgayTao { get; set; }
    public DateTime? NgayCapNhat { get; set; }
    
    // Navigation properties
    public string? TenNhaCungCap { get; set; }
    public List<ChiTietNhapDto> ChiTietNhaps { get; set; } = new();
}

public class PhieuNhapCreateDto
{
    [Required(ErrorMessage = "Mã nhà cung cấp là bắt buộc")]
    public string MaNhaCungCap { get; set; } = null!;
    
    [Required(ErrorMessage = "Ngày nhập là bắt buộc")]
    public DateTime NgayNhap { get; set; }
    
    public string? TrangThai { get; set; } = "Chờ xử lý";
    public List<ChiTietNhapCreateDto> ChiTietNhaps { get; set; } = new();
}

public class PhieuNhapUpdateDto
{
    public string? MaNhaCungCap { get; set; }
    public DateTime? NgayNhap { get; set; }
    public string? TrangThai { get; set; }
    public bool? IsActive { get; set; }
}

public class ChiTietNhapDto
{
    public string MaChiTiet { get; set; } = null!;
    public string? MaPhieuNhap { get; set; }
    public string? MaLo { get; set; }
    public int? SoLuong { get; set; }
    public decimal? Gia { get; set; }
    public bool? IsDelete { get; set; }
    public bool? IsActive { get; set; }
    public DateTime? NgayTao { get; set; }
    public DateTime? NgayCapNhat { get; set; }
    
    // Navigation properties
    public string? TenVaccine { get; set; }
    public string? SoLo { get; set; }
    public DateOnly? NgayHetHan { get; set; }
}

public class ChiTietNhapCreateDto
{
    [Required(ErrorMessage = "Mã lô vaccine là bắt buộc")]
    public string MaLo { get; set; } = null!;
    
    [Required(ErrorMessage = "Số lượng là bắt buộc")]
    [Range(1, int.MaxValue, ErrorMessage = "Số lượng phải lớn hơn 0")]
    public int SoLuong { get; set; }
    
    [Required(ErrorMessage = "Giá là bắt buộc")]
    [Range(0, double.MaxValue, ErrorMessage = "Giá phải lớn hơn hoặc bằng 0")]
    public decimal Gia { get; set; }
}

public class PhieuNhapResponseDto
{
    public string MaPhieuNhap { get; set; } = null!;
    public string? MaNhaCungCap { get; set; }
    public string? TenNhaCungCap { get; set; }
    public DateTime? NgayNhap { get; set; }
    public decimal? TongTien { get; set; }
    public string? TrangThai { get; set; }
    public bool? IsActive { get; set; }
    public DateTime? NgayTao { get; set; }
    public List<ChiTietNhapResponseDto> ChiTietNhaps { get; set; } = new();
}

public class ChiTietNhapResponseDto
{
    public string MaChiTiet { get; set; } = null!;
    public string? MaLo { get; set; }
    public string? TenVaccine { get; set; }
    public string? SoLo { get; set; }
    public int? SoLuong { get; set; }
    public decimal? Gia { get; set; }
    public DateOnly? NgayHetHan { get; set; }
} 