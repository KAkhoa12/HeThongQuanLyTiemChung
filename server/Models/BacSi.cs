using System;
using System.Collections.Generic;

namespace server.Models;

public partial class BacSi
{
    public string MaBacSi { get; set; } = null!;

    public string MaNguoiDung { get; set; } = null!;

    public string? ChuyenMon { get; set; }

    public string? SoGiayPhep { get; set; }

    public bool? IsDelete { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? NgayTao { get; set; }

    public DateTime? NgayCapNhat { get; set; }

    public virtual ICollection<LichLamViec> LichLamViecs { get; set; } = new List<LichLamViec>();

    public virtual NguoiDung MaNguoiDungNavigation { get; set; } = null!;

    public virtual ICollection<PhieuTiem> PhieuTiems { get; set; } = new List<PhieuTiem>();
}
