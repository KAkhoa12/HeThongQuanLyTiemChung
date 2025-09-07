using System;
using System.Collections.Generic;

namespace server.Models;

public partial class LoVaccine
{
    public string MaLo { get; set; } = null!;

    public string MaVaccine { get; set; } = null!;

    public string MaNhaCungCap { get; set; } = null!;

    public string? SoLo { get; set; }

    public DateOnly? NgaySanXuat { get; set; }

    public DateOnly? NgayHetHan { get; set; }

    public int? SoLuongNhap { get; set; }

    public int? SoLuongHienTai { get; set; }

    public decimal? GiaNhap { get; set; }

    public bool? IsDelete { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? NgayTao { get; set; }

    public DateTime? NgayCapNhat { get; set; }

    public virtual ICollection<ChiTietNhap> ChiTietNhaps { get; set; } = new List<ChiTietNhap>();

    public virtual ICollection<ChiTietThanhLy> ChiTietThanhLies { get; set; } = new List<ChiTietThanhLy>();

    public virtual ICollection<ChiTietXuat> ChiTietXuats { get; set; } = new List<ChiTietXuat>();

    public virtual NhaCungCap MaNhaCungCapNavigation { get; set; } = null!;

    public virtual Vaccine MaVaccineNavigation { get; set; } = null!;

    public virtual ICollection<TonKhoLo> TonKhoLos { get; set; } = new List<TonKhoLo>();
}
