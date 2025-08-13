using System;
using System.Collections.Generic;

namespace server.Models;

public partial class NhaCungCap
{
    public string MaNhaCungCap { get; set; } = null!;

    public string Ten { get; set; } = null!;

    public string? NguoiLienHe { get; set; }

    public string? SoDienThoai { get; set; }

    public string? DiaChi { get; set; }

    public string? MaAnh { get; set; }

    public bool? IsDelete { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? NgayTao { get; set; }

    public DateTime? NgayCapNhat { get; set; }

    public virtual ICollection<AnhNhaCungCap> AnhNhaCungCaps { get; set; } = new List<AnhNhaCungCap>();

    public virtual ICollection<LoVaccine> LoVaccines { get; set; } = new List<LoVaccine>();

    public virtual NguonAnh? MaAnhNavigation { get; set; }

    public virtual ICollection<PhieuNhap> PhieuNhaps { get; set; } = new List<PhieuNhap>();
}
