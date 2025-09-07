using System;
using System.Collections.Generic;

namespace server.Models;

public partial class PhieuXuat
{
    public string MaPhieuXuat { get; set; } = null!;

    public string? MaDiaDiemXuat { get; set; }

    public string? MaDiaDiemNhap { get; set; }

    public DateTime? NgayXuat { get; set; }

    public string? LoaiXuat { get; set; }

    public string? TrangThai { get; set; }

    public bool? IsDelete { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? NgayTao { get; set; }

    public DateTime? NgayCapNhat { get; set; }

    public string? MaQuanLy { get; set; }

    public virtual ICollection<ChiTietXuat> ChiTietXuats { get; set; } = new List<ChiTietXuat>();

    public virtual DiaDiem? MaDiaDiemNhapNavigation { get; set; }

    public virtual DiaDiem? MaDiaDiemXuatNavigation { get; set; }

    public virtual QuanLy? MaQuanLyNavigation { get; set; }
}
