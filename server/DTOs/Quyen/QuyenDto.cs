using System;

namespace server.DTOs.Quyen;

public class QuyenDto
{
    public string MaQuyen { get; set; } = null!;
    public string TenQuyen { get; set; } = null!;
    public string? MoTa { get; set; }
    public string Module { get; set; } = null!;
    public bool? IsDelete { get; set; }
    public bool? IsActive { get; set; }
    public DateTime? NgayTao { get; set; }
    public DateTime? NgayCapNhat { get; set; }
}
