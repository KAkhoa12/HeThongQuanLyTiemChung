using System;
using System.ComponentModel.DataAnnotations;

namespace server.DTOs.KhachHang;

public record KhachHangDto
{
    public string MaNguoiDung { get; set; } = null!;
    public string Ten { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string? SoDienThoai { get; set; }
    public string? NgaySinh { get; set; }
    public string? DiaChi { get; set; }
    public string? GioiTinh { get; set; }
    public string? MaAnh { get; set; }
    public bool? IsActive { get; set; }
    public DateTime? NgayTao { get; set; }
    public DateTime? NgayCapNhat { get; set; }
    public ThongTinNguoiDungDto? ThongTinNguoiDung { get; set; }
}

public record ThongTinNguoiDungDto
{
    public string MaThongTin { get; set; } = null!;
    public string MaNguoiDung { get; set; } = null!;
    public decimal? ChieuCao { get; set; }
    public decimal? CanNang { get; set; }
    public decimal? Bmi { get; set; }
    public string? NhomMau { get; set; }
    public string? BenhNen { get; set; }
    public string? DiUng { get; set; }
    public string? ThuocDangDung { get; set; }
    public bool? TinhTrangMangThai { get; set; }
    public string? NgayKhamGanNhat { get; set; }
    public bool? IsActive { get; set; }
    public DateTime? NgayTao { get; set; }
    public DateTime? NgayCapNhat { get; set; }
}

public record CreateKhachHangDto
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
    public decimal? ChieuCao { get; set; }
    public decimal? CanNang { get; set; }
    public string? NhomMau { get; set; }
    public string? BenhNen { get; set; }
    public string? DiUng { get; set; }
    public string? ThuocDangDung { get; set; }
    public bool? TinhTrangMangThai { get; set; }
    public string? NgayKhamGanNhat { get; set; }
}

public record UpdateKhachHangDto
{
    [Required(ErrorMessage = "Tên là bắt buộc")]
    public string Ten { get; set; } = null!;
    public string? SoDienThoai { get; set; }
    public string? NgaySinh { get; set; }
    public string? DiaChi { get; set; }
    public string? GioiTinh { get; set; }
    public string? MaAnh { get; set; }
    public bool? IsActive { get; set; }
    public decimal? ChieuCao { get; set; }
    public decimal? CanNang { get; set; }
    public string? NhomMau { get; set; }
    public string? BenhNen { get; set; }
    public string? DiUng { get; set; }
    public string? ThuocDangDung { get; set; }
    public bool? TinhTrangMangThai { get; set; }
    public string? NgayKhamGanNhat { get; set; }
}