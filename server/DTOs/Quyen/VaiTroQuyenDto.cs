using System;

namespace server.DTOs.Quyen;

public class VaiTroQuyenDto
{
    public string MaVaiTro { get; set; } = null!;
    public string MaQuyen { get; set; } = null!;
    public DateTime? NgayTao { get; set; }
    public bool? IsDelete { get; set; }
    public bool? IsActive { get; set; }
    public DateTime? NgayCapNhat { get; set; }
    
    // Navigation properties
    public QuyenDto? Quyen { get; set; }
    public string? TenQuyen { get; set; }
    public string? Module { get; set; }
}

public class VaiTroQuyenCreateRequest
{
    public string MaVaiTro { get; set; } = null!;
    public string MaQuyen { get; set; } = null!;
}

public class VaiTroQuyenUpdateRequest
{
    public bool? IsActive { get; set; }
}

public class PhanQuyenRequest
{
    public string MaVaiTro { get; set; } = null!;
    public List<string> DanhSachMaQuyen { get; set; } = new List<string>();
} 