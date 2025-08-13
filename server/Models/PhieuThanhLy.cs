using System;
using System.Collections.Generic;

namespace server.Models;

public partial class PhieuThanhLy
{
    public string MaPhieuThanhLy { get; set; } = null!;

    public string? MaDiaDiem { get; set; }

    public DateTime? NgayThanhLy { get; set; }

    public string? TrangThai { get; set; }

    public bool? IsDelete { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? NgayTao { get; set; }

    public DateTime? NgayCapNhat { get; set; }

    public virtual ICollection<ChiTietThanhLy> ChiTietThanhLies { get; set; } = new List<ChiTietThanhLy>();

    public virtual DiaDiem? MaDiaDiemNavigation { get; set; }
}
