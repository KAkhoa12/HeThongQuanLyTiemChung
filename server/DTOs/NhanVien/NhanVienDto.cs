using System;
using System.ComponentModel.DataAnnotations;

namespace server.DTOs.NhanVien;

public record NhanVienDto
{
    public string MaNhanVien { get; set; } = null!;
    public string? MaNguoiDung { get; set; }
    public string? ChucVu { get; set; }
    public string? MaDiaDiem { get; set; }
    public string? TenDiaDiem { get; set; }
    public string? Ten { get; set; }
    public string? Email { get; set; }
    public string? SoDienThoai { get; set; }
    public string? NgaySinh { get; set; }
    public string? DiaChi { get; set; }
    public string? GioiTinh { get; set; }
    public string? MaAnh { get; set; }
    public bool? IsActive { get; set; }
    public DateTime? NgayTao { get; set; }
    public DateTime? NgayCapNhat { get; set; }
}

public record CreateNhanVienDto
{
    [Required(ErrorMessage = "Tên là bắt buộc")]
    public string Ten { get; set; } = null!;
    
    [Required(ErrorMessage = "Email là bắt buộc")]
    [EmailAddress(ErrorMessage = "Email không hợp lệ")]
    public string Email { get; set; } = null!;
    
    [Required(ErrorMessage = "Mật khẩu là bắt buộc")]
    [MinLength(6, ErrorMessage = "Mật khẩu phải có ít nhất 6 ký tự")]
    public string MatKhau { get; set; } = null!;
    public string? SoDienThoai { get; set; }
    public string? NgaySinh { get; set; }
    public string? DiaChi { get; set; }
    public string? GioiTinh { get; set; }
    public string? MaAnh { get; set; }
    public string? ChucVu { get; set; }
    public string? MaDiaDiem { get; set; }
}

public record UpdateNhanVienDto
{
    [Required(ErrorMessage = "Tên là bắt buộc")]
    public string Ten { get; set; } = null!;
    public string? SoDienThoai { get; set; }
    public string? NgaySinh { get; set; }
    public string? DiaChi { get; set; }
    public string? GioiTinh { get; set; }
    public string? MaAnh { get; set; }
    public string? ChucVu { get; set; }
    public string? MaDiaDiem { get; set; }
    public bool? IsActive { get; set; }
}