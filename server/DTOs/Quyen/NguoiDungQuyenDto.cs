using System;

namespace server.DTOs.Quyen;

public class NguoiDungQuyenDto
{
    public string MaNguoiDung { get; set; } = null!;
    public string MaQuyen { get; set; } = null!;
    public DateTime? NgayTao { get; set; }
    public bool? IsDelete { get; set; }
    public bool? IsActive { get; set; }
    public DateTime? NgayCapNhat { get; set; }
    
    // Navigation properties
    public string? TenNguoiDung { get; set; }
    public string? Email { get; set; }
    public string? TenQuyen { get; set; }
    public string? Module { get; set; }
}

public class NguoiDungQuyenCreateRequest
{
    public string MaNguoiDung { get; set; } = null!;
    public string MaQuyen { get; set; } = null!;
}

public class NguoiDungQuyenUpdateRequest
{
    public bool? IsActive { get; set; }
}

public class PhanQuyenNguoiDungRequest
{
    public string MaNguoiDung { get; set; } = null!;
    public List<string> DanhSachMaQuyen { get; set; } = new List<string>();
}

public class QuyenNguoiDungDto
{
    public string MaQuyen { get; set; } = null!;
    public string TenQuyen { get; set; } = null!;
    public string? MoTa { get; set; }
    public string Module { get; set; } = null!;
    public bool? IsDelete { get; set; }
    public bool? IsActive { get; set; }
    public DateTime? NgayTao { get; set; }
    public DateTime? NgayCapNhat { get; set; }
    public bool CoQuyen { get; set; } = false;
} 