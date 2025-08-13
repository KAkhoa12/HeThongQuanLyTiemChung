using System;
using System.Collections.Generic;

namespace server.ModelViews;

public partial class PhieuXuatVM
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

}
