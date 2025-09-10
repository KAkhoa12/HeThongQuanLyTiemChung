using System;
using System.Collections.Generic;

namespace server.Models;

public partial class DonHang
{
    public string MaDonHang { get; set; } = null!;

    public string MaNguoiDung { get; set; } = null!;

    public string? MaDiaDiemYeuThich { get; set; }

    public DateTime? NgayDat { get; set; }

    public decimal TongTienGoc { get; set; }

    public decimal TongTienThanhToan { get; set; }

    public string? TrangThaiDon { get; set; }

    public string? GhiChu { get; set; }

    public bool? IsDelete { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? NgayTao { get; set; }

    public DateTime? NgayCapNhat { get; set; }

    public virtual ICollection<DonHangChiTiet> DonHangChiTiets { get; set; } = new List<DonHangChiTiet>();

    public virtual ICollection<DonHangKhuyenMai> DonHangKhuyenMais { get; set; } = new List<DonHangKhuyenMai>();

    public virtual ICollection<KeHoachTiem> KeHoachTiems { get; set; } = new List<KeHoachTiem>();

    public virtual ICollection<LichHen> LichHens { get; set; } = new List<LichHen>();

    public virtual DiaDiem? MaDiaDiemYeuThichNavigation { get; set; }

    public virtual NguoiDung MaNguoiDungNavigation { get; set; } = null!;
}
