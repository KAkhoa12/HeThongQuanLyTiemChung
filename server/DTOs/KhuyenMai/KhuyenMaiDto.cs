using System;

namespace server.DTOs.KhuyenMai;

public class KhuyenMaiDto
{
    public string MaKhuyenMai { get; set; } = null!;
    public string? MaLoaiKhuyenMai { get; set; }
    public string? TenKhuyenMai { get; set; }
    public string? Code { get; set; }
    public string? LoaiGiam { get; set; }
    public decimal? GiaTriGiam { get; set; }
    public decimal? GiamToiDa { get; set; }
    public decimal? DieuKienToiThieu { get; set; }
    public decimal? GiaTriToiThieu { get; set; }
    public DateOnly? NgayBatDau { get; set; }
    public DateOnly? NgayKetThuc { get; set; }
    public int? SoLuotDung { get; set; }
    public int? SoLuotDaDung { get; set; }
    public string? TrangThai { get; set; }
    public bool? IsDelete { get; set; }
    public bool? IsActive { get; set; }
    public DateTime? NgayTao { get; set; }
    public DateTime? NgayCapNhat { get; set; }
    
    // Navigation properties
    public string? TenLoaiKhuyenMai { get; set; }
}

public class CreateKhuyenMaiDto
{
    public string? MaLoaiKhuyenMai { get; set; }
    public string? TenKhuyenMai { get; set; }
    public string? Code { get; set; }
    public string? LoaiGiam { get; set; }
    public decimal? GiaTriGiam { get; set; }
    public decimal? GiamToiDa { get; set; }
    public decimal? DieuKienToiThieu { get; set; }
    public decimal? GiaTriToiThieu { get; set; }
    public DateOnly? NgayBatDau { get; set; }
    public DateOnly? NgayKetThuc { get; set; }
    public int? SoLuotDung { get; set; }
    public string? TrangThai { get; set; }
}

public class UpdateKhuyenMaiDto
{
    public string? MaLoaiKhuyenMai { get; set; }
    public string? TenKhuyenMai { get; set; }
    public string? Code { get; set; }
    public string? LoaiGiam { get; set; }
    public decimal? GiaTriGiam { get; set; }
    public decimal? GiamToiDa { get; set; }
    public decimal? DieuKienToiThieu { get; set; }
    public decimal? GiaTriToiThieu { get; set; }
    public DateOnly? NgayBatDau { get; set; }
    public DateOnly? NgayKetThuc { get; set; }
    public int? SoLuotDung { get; set; }
    public string? TrangThai { get; set; }
} 