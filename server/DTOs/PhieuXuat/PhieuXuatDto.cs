using System.ComponentModel.DataAnnotations;

namespace server.DTOs.PhieuXuat;

public class PhieuXuatDto
{
    public string MaPhieuXuat { get; set; } = null!;
    public string? MaDiaDiemXuat { get; set; }
    public string? MaDiaDiemNhap { get; set; }
    public DateTime? NgayXuat { get; set; }
    public string? LoaiXuat { get; set; }
    public string? TrangThai { get; set; }
    public bool? IsDelete { get; set; }
    public bool? IsActive { get; set; }
    public DateTime? NgayTao { get; set; }
    public DateTime? NgayCapNhat { get; set; }
    
    // Navigation properties
    public string? TenDiaDiemXuat { get; set; }
    public string? TenDiaDiemNhap { get; set; }
    public List<ChiTietXuatDto> ChiTietXuats { get; set; } = new();
}

public class PhieuXuatCreateDto
{
    [Required(ErrorMessage = "Địa điểm xuất là bắt buộc")]
    public string MaDiaDiemXuat { get; set; } = null!;
    
    [Required(ErrorMessage = "Địa điểm nhập là bắt buộc")]
    public string MaDiaDiemNhap { get; set; } = null!;
    
    [Required(ErrorMessage = "Ngày xuất là bắt buộc")]
    public DateTime NgayXuat { get; set; }
    
    [Required(ErrorMessage = "Loại xuất là bắt buộc")]
    public string LoaiXuat { get; set; } = null!;
    
    public string? TrangThai { get; set; } = "Chờ xử lý";
    public List<ChiTietXuatCreateDto> ChiTietXuats { get; set; } = new();
}

public class PhieuXuatUpdateDto
{
    public string? MaDiaDiemXuat { get; set; }
    public string? MaDiaDiemNhap { get; set; }
    public DateTime? NgayXuat { get; set; }
    public string? LoaiXuat { get; set; }
    public string? TrangThai { get; set; }
    public bool? IsActive { get; set; }
}

public class ChiTietXuatDto
{
    public string MaChiTiet { get; set; } = null!;
    public string? MaPhieuXuat { get; set; }
    public string? MaLo { get; set; }
    public int? SoLuong { get; set; }
    public bool? IsDelete { get; set; }
    public bool? IsActive { get; set; }
    public DateTime? NgayTao { get; set; }
    public DateTime? NgayCapNhat { get; set; }
    
    // Navigation properties
    public string? TenVaccine { get; set; }
    public string? SoLo { get; set; }
    public DateOnly? NgayHetHan { get; set; }
}

public class ChiTietXuatCreateDto
{
    [Required(ErrorMessage = "Mã lô vaccine là bắt buộc")]
    public string MaLo { get; set; } = null!;
    
    [Required(ErrorMessage = "Số lượng là bắt buộc")]
    [Range(1, int.MaxValue, ErrorMessage = "Số lượng phải lớn hơn 0")]
    public int SoLuong { get; set; }
}

public class PhieuXuatResponseDto
{
    public string MaPhieuXuat { get; set; } = null!;
    public string? MaDiaDiemXuat { get; set; }
    public string? TenDiaDiemXuat { get; set; }
    public string? MaDiaDiemNhap { get; set; }
    public string? TenDiaDiemNhap { get; set; }
    public DateTime? NgayXuat { get; set; }
    public string? LoaiXuat { get; set; }
    public string? TrangThai { get; set; }
    public bool? IsActive { get; set; }
    public DateTime? NgayTao { get; set; }
    public List<ChiTietXuatResponseDto> ChiTietXuats { get; set; } = new();
}

public class ChiTietXuatResponseDto
{
    public string MaChiTiet { get; set; } = null!;
    public string? MaLo { get; set; }
    public string? TenVaccine { get; set; }
    public string? SoLo { get; set; }
    public int? SoLuong { get; set; }
    public DateOnly? NgayHetHan { get; set; }
} 