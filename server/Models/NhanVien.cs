using System;
using System.Collections.Generic;

namespace server.Models;

public partial class NhanVien
{
    public string MaNhanVien { get; set; } = null!;

    public string? MaNguoiDung { get; set; }

    public string? ChucVu { get; set; }

    public string? MaDiaDiem { get; set; }

    public virtual DiaDiem? MaDiaDiemNavigation { get; set; }

    public virtual NguoiDung? MaNguoiDungNavigation { get; set; }
}
