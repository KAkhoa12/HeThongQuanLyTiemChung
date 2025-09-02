using System;

namespace server.DTOs.VaiTro;

public class VaiTroDto
{
    public string MaVaiTro { get; set; } = null!;
    public string TenVaiTro { get; set; } = null!;
    public string? MoTa { get; set; }
    public bool? IsDelete { get; set; }
    public bool? IsActive { get; set; }
    public DateTime? NgayTao { get; set; }
    public DateTime? NgayCapNhat { get; set; }
} 