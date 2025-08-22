using System.ComponentModel.DataAnnotations;

namespace server.DTOs.PhieuThanhLy;

public class PhieuThanhLyDto
{
    public string MaPhieuThanhLy { get; set; } = null!;
    public string? MaDiaDiem { get; set; }
    public DateTime? NgayThanhLy { get; set; }
    public string? TrangThai { get; set; }
    public bool? IsDelete { get; set; }
    public bool? IsActive { get; set; }
    public DateTime? NgayTao { get; set; }
    public DateTime? NgayCapNhat { get; set; }
    
    // Navigation properties
    public string? TenDiaDiem { get; set; }
    public List<ChiTietThanhLyDto> ChiTietThanhLies { get; set; } = new();
}

public class PhieuThanhLyCreateDto
{
    [Required(ErrorMessage = "Địa điểm là bắt buộc")]
    public string MaDiaDiem { get; set; } = null!;
    
    [Required(ErrorMessage = "Ngày thanh lý là bắt buộc")]
    public DateTime NgayThanhLy { get; set; }
    
    public string? TrangThai { get; set; } = "Chờ xử lý";
    public List<ChiTietThanhLyCreateDto> ChiTietThanhLies { get; set; } = new();
}

public class PhieuThanhLyUpdateDto
{
    public string? MaDiaDiem { get; set; }
    public DateTime? NgayThanhLy { get; set; }
    public string? TrangThai { get; set; }
    public bool? IsActive { get; set; }
}

public class ChiTietThanhLyDto
{
    public string MaChiTiet { get; set; } = null!;
    public string? MaPhieuThanhLy { get; set; }
    public string? MaLo { get; set; }
    public int? SoLuong { get; set; }
    public string? LyDo { get; set; }
    public bool? IsDelete { get; set; }
    public bool? IsActive { get; set; }
    public DateTime? NgayTao { get; set; }
    public DateTime? NgayCapNhat { get; set; }
    
    // Navigation properties
    public string? TenVaccine { get; set; }
    public string? SoLo { get; set; }
    public DateOnly? NgayHetHan { get; set; }
}

public class ChiTietThanhLyCreateDto
{
    [Required(ErrorMessage = "Mã lô vaccine là bắt buộc")]
    public string MaLo { get; set; } = null!;
    
    [Required(ErrorMessage = "Số lượng là bắt buộc")]
    [Range(1, int.MaxValue, ErrorMessage = "Số lượng phải lớn hơn 0")]
    public int SoLuong { get; set; }
    
    [Required(ErrorMessage = "Lý do thanh lý là bắt buộc")]
    public string LyDo { get; set; } = null!;
}

public class PhieuThanhLyResponseDto
{
    public string MaPhieuThanhLy { get; set; } = null!;
    public string? MaDiaDiem { get; set; }
    public string? TenDiaDiem { get; set; }
    public DateTime? NgayThanhLy { get; set; }
    public string? TrangThai { get; set; }
    public bool? IsActive { get; set; }
    public DateTime? NgayTao { get; set; }
    public List<ChiTietThanhLyResponseDto> ChiTietThanhLies { get; set; } = new();
}

public class ChiTietThanhLyResponseDto
{
    public string MaChiTiet { get; set; } = null!;
    public string? MaLo { get; set; }
    public string? TenVaccine { get; set; }
    public string? SoLo { get; set; }
    public int? SoLuong { get; set; }
    public string? LyDo { get; set; }
    public DateOnly? NgayHetHan { get; set; }
} 