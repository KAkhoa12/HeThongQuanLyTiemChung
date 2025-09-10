using System;
using System.Collections.Generic;

namespace server.Models;

public partial class DiaDiem
{
    public string MaDiaDiem { get; set; } = null!;

    public string Ten { get; set; } = null!;

    public string DiaChi { get; set; } = null!;

    public string? SoDienThoai { get; set; }

    public string? Email { get; set; }

    public string? MoTa { get; set; }

    public string? GioMoCua { get; set; }

    public int? SucChua { get; set; }

    public string? LoaiDiaDiem { get; set; }

    public bool? IsDelete { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? NgayTao { get; set; }

    public DateTime? NgayCapNhat { get; set; }

    public virtual ICollection<AnhDiaDiem> AnhDiaDiems { get; set; } = new List<AnhDiaDiem>();

    public virtual ICollection<BacSi> BacSis { get; set; } = new List<BacSi>();

    public virtual ICollection<DonHang> DonHangs { get; set; } = new List<DonHang>();

    public virtual ICollection<LichHen> LichHens { get; set; } = new List<LichHen>();

    public virtual ICollection<LichLamViec> LichLamViecs { get; set; } = new List<LichLamViec>();

    public virtual ICollection<NhanVien> NhanViens { get; set; } = new List<NhanVien>();

    public virtual ICollection<PhieuDangKyLichTiem> PhieuDangKyLichTiems { get; set; } = new List<PhieuDangKyLichTiem>();

    public virtual ICollection<PhieuThanhLy> PhieuThanhLies { get; set; } = new List<PhieuThanhLy>();

    public virtual ICollection<PhieuXuat> PhieuXuatMaDiaDiemNhapNavigations { get; set; } = new List<PhieuXuat>();

    public virtual ICollection<PhieuXuat> PhieuXuatMaDiaDiemXuatNavigations { get; set; } = new List<PhieuXuat>();

    public virtual ICollection<TonKhoLo> TonKhoLos { get; set; } = new List<TonKhoLo>();
}
