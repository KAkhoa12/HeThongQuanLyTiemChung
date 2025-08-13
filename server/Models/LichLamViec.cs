using System;
using System.Collections.Generic;

namespace server.Models;

public partial class LichLamViec
{
    public string MaLichLamViec { get; set; } = null!;

    public string MaBacSi { get; set; } = null!;

    public string MaDiaDiem { get; set; } = null!;

    public DateOnly NgayLam { get; set; }

    public TimeOnly GioBatDau { get; set; }

    public TimeOnly GioKetThuc { get; set; }

    public int SoLuongCho { get; set; }

    public int? DaDat { get; set; }

    public string? TrangThai { get; set; }

    public bool? IsDelete { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? NgayTao { get; set; }

    public DateTime? NgayCapNhat { get; set; }

    public virtual ICollection<LichHen> LichHens { get; set; } = new List<LichHen>();

    public virtual BacSi MaBacSiNavigation { get; set; } = null!;

    public virtual DiaDiem MaDiaDiemNavigation { get; set; } = null!;
}
