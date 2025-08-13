using System;
using System.Collections.Generic;

namespace server.Models;

public partial class NguonAnh
{
    public string MaAnh { get; set; } = null!;

    public string? MaNhan { get; set; }

    public string UrlAnh { get; set; } = null!;

    public string? AltText { get; set; }

    public string? NguoiTai { get; set; }

    public bool? IsDelete { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? NgayTao { get; set; }

    public DateTime? NgayCapNhat { get; set; }

    public virtual ICollection<AnhDiaDiem> AnhDiaDiems { get; set; } = new List<AnhDiaDiem>();

    public virtual ICollection<AnhDichVu> AnhDichVus { get; set; } = new List<AnhDichVu>();

    public virtual ICollection<AnhNhaCungCap> AnhNhaCungCaps { get; set; } = new List<AnhNhaCungCap>();

    public virtual ICollection<AnhVaccine> AnhVaccines { get; set; } = new List<AnhVaccine>();

    public virtual NhanAnh? MaNhanNavigation { get; set; }

    public virtual ICollection<NguoiDung> NguoiDungs { get; set; } = new List<NguoiDung>();

    public virtual ICollection<NhaCungCap> NhaCungCaps { get; set; } = new List<NhaCungCap>();
}
