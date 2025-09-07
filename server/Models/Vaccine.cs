using System;
using System.Collections.Generic;

namespace server.Models;

public partial class Vaccine
{
    public string MaVaccine { get; set; } = null!;

    public string Ten { get; set; } = null!;

    public string? NhaSanXuat { get; set; }

    public int? TuoiBatDauTiem { get; set; }

    public int? TuoiKetThucTiem { get; set; }

    public string? HuongDanSuDung { get; set; }

    public string? PhongNgua { get; set; }

    public bool? IsDelete { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? NgayTao { get; set; }

    public DateTime? NgayCapNhat { get; set; }

    public virtual ICollection<AnhVaccine> AnhVaccines { get; set; } = new List<AnhVaccine>();

    public virtual ICollection<ChiTietPhieuTiem> ChiTietPhieuTiems { get; set; } = new List<ChiTietPhieuTiem>();

    public virtual ICollection<DichVuVaccine> DichVuVaccines { get; set; } = new List<DichVuVaccine>();

    public virtual ICollection<KeHoachTiem> KeHoachTiems { get; set; } = new List<KeHoachTiem>();

    public virtual ICollection<LichTiemChuan> LichTiemChuans { get; set; } = new List<LichTiemChuan>();

    public virtual ICollection<LoVaccine> LoVaccines { get; set; } = new List<LoVaccine>();
}
