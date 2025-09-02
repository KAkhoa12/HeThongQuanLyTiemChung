using System;

namespace server.DTOs.KhuyenMai;

public class LoaiKhuyenMaiDto
{
    public string MaLoaiKhuyenMai { get; set; } = null!;
    public string? TenLoai { get; set; }
    public string? MoTa { get; set; }
    public bool? IsDelete { get; set; }
    public bool? IsActive { get; set; }
    public DateTime? NgayTao { get; set; }
    public DateTime? NgayCapNhat { get; set; }
}

public class CreateLoaiKhuyenMaiDto
{
    public string? TenLoai { get; set; }
    public string? MoTa { get; set; }
}

public class UpdateLoaiKhuyenMaiDto
{
    public string? TenLoai { get; set; }
    public string? MoTa { get; set; }
} 