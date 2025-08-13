using System;
using System.Collections.Generic;

namespace server.Models;

public partial class AnhDichVu
{
    public string MaAnhDichVu { get; set; } = null!;

    public string? MaAnh { get; set; }

    public string? MaDichVu { get; set; }

    public bool? LaAnhChinh { get; set; }

    public int? ThuTuHienThi { get; set; }

    public bool? IsDelete { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? NgayTao { get; set; }

    public DateTime? NgayCapNhat { get; set; }

    public virtual NguonAnh? MaAnhNavigation { get; set; }

    public virtual DichVu? MaDichVuNavigation { get; set; }
}
