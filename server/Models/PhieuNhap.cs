using System;
using System.Collections.Generic;

namespace server.Models;

public partial class PhieuNhap
{
    public string MaPhieuNhap { get; set; } = null!;

    public string? MaNhaCungCap { get; set; }

    public string? MaQuanLy { get; set; }

    public DateTime? NgayNhap { get; set; }

    public decimal? TongTien { get; set; }

    public string? TrangThai { get; set; }

    public bool? IsDelete { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? NgayTao { get; set; }

    public DateTime? NgayCapNhat { get; set; }

    public virtual ICollection<ChiTietNhap> ChiTietNhaps { get; set; } = new List<ChiTietNhap>();

    public virtual NhaCungCap? MaNhaCungCapNavigation { get; set; }

    public virtual QuanLy? MaQuanLyNavigation { get; set; }
}
