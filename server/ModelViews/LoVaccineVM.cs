using System;
using System.Collections.Generic;

namespace server.ModelViews;

public partial class LoVaccineVM
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



}
