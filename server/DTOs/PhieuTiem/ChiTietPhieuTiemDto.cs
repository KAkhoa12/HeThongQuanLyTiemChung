using System.ComponentModel.DataAnnotations;

namespace server.DTOs.PhieuTiem;

public class ChiTietPhieuTiemDto
{
    public string MaChiTietPhieuTiem { get; set; } = null!;
    public string MaPhieuTiem { get; set; } = null!;
    public string MaVaccine { get; set; } = null!;
    public int MuiTiemThucTe { get; set; }
    public int ThuTu { get; set; }
    public bool? IsDelete { get; set; }
    public bool? IsActive { get; set; }
    public DateTime? NgayTao { get; set; }
    public DateTime? NgayCapNhat { get; set; }
    
    // Navigation properties
    public string? TenVaccine { get; set; }
    public string? NhaSanXuat { get; set; }
}

public class ChiTietPhieuTiemCreateDto
{
    [Required(ErrorMessage = "Mã phiếu tiêm là bắt buộc")]
    public string MaPhieuTiem { get; set; } = null!;
    
    [Required(ErrorMessage = "Mã vaccine là bắt buộc")]
    public string MaVaccine { get; set; } = null!;
    
    [Required(ErrorMessage = "Mũi tiêm thực tế là bắt buộc")]
    [Range(1, int.MaxValue, ErrorMessage = "Mũi tiêm thực tế phải lớn hơn 0")]
    public int MuiTiemThucTe { get; set; }
    
    [Required(ErrorMessage = "Thứ tự là bắt buộc")]
    [Range(1, int.MaxValue, ErrorMessage = "Thứ tự phải lớn hơn 0")]
    public int ThuTu { get; set; }
}

public class ChiTietPhieuTiemForCreateDto
{
    [Required(ErrorMessage = "Mã vaccine là bắt buộc")]
    public string MaVaccine { get; set; } = null!;
    
    [Required(ErrorMessage = "Mũi tiêm thực tế là bắt buộc")]
    [Range(1, int.MaxValue, ErrorMessage = "Mũi tiêm thực tế phải lớn hơn 0")]
    public int MuiTiemThucTe { get; set; }
    
    [Required(ErrorMessage = "Thứ tự là bắt buộc")]
    [Range(1, int.MaxValue, ErrorMessage = "Thứ tự phải lớn hơn 0")]
    public int ThuTu { get; set; }
}

public class ChiTietPhieuTiemUpdateDto
{
    public string? MaVaccine { get; set; }
    public int? MuiTiemThucTe { get; set; }
    public int? ThuTu { get; set; }
    public bool? IsActive { get; set; }
}

public class PhieuTiemDto
{
    public string MaPhieuTiem { get; set; } = null!;
    public DateTime? NgayTiem { get; set; }
    public string? MaBacSi { get; set; }
    public string? MaDichVu { get; set; }
    public string? MaNguoiDung { get; set; }
    public string? TrangThai { get; set; }
    public string? PhanUng { get; set; }
    public string? MoTaPhanUng { get; set; }
    public bool? IsDelete { get; set; }
    public bool? IsActive { get; set; }
    public DateTime? NgayTao { get; set; }
    public DateTime? NgayCapNhat { get; set; }
    
    // Navigation properties
    public string? TenBacSi { get; set; }
    public string? TenDichVu { get; set; }
    public string? TenNguoiDung { get; set; }
    public List<ChiTietPhieuTiemDto> ChiTietPhieuTiems { get; set; } = new();
}

public class PhieuTiemCreateDto
{
    [Required(ErrorMessage = "Ngày tiêm là bắt buộc")]
    public DateTime NgayTiem { get; set; }
    
    public string? MaBacSi { get; set; }
    
    [Required(ErrorMessage = "Mã dịch vụ là bắt buộc")]
    public string MaDichVu { get; set; } = null!;
    
    [Required(ErrorMessage = "Mã người dùng là bắt buộc")]
    public string MaNguoiDung { get; set; } = null!;
    
    [Required(ErrorMessage = "Trạng thái là bắt buộc")]
    public string TrangThai { get; set; } = null!;
    
    public string? PhanUng { get; set; }
    public string? MoTaPhanUng { get; set; }
    
    [Required(ErrorMessage = "Danh sách chi tiết phiếu tiêm là bắt buộc")]
    public List<ChiTietPhieuTiemCreateDto> ChiTietPhieuTiems { get; set; } = new();
}

public class PhieuTiemUpdateDto
{
    public DateTime? NgayTiem { get; set; }
    public string? MaBacSi { get; set; }
    public string? MaDichVu { get; set; }
    public string? TrangThai { get; set; }
    public string? PhanUng { get; set; }
    public string? MoTaPhanUng { get; set; }
    public bool? IsActive { get; set; }
} 