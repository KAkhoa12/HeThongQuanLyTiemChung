using System;
using System.Collections.Generic;

namespace server.Models;

public partial class NguoiDung
{
    public string MaNguoiDung { get; set; } = null!;

    public string MaVaiTro { get; set; } = null!;

    public string Ten { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string MatKhau { get; set; } = null!;

    public string? SoDienThoai { get; set; }

    public DateOnly? NgaySinh { get; set; }

    public string? DiaChi { get; set; }

    public bool? IsDelete { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? NgayTao { get; set; }

    public DateTime? NgayCapNhat { get; set; }

    public string? MaAnh { get; set; }

    public string? GioiTinh { get; set; }

    public virtual BacSi? BacSi { get; set; }

    public virtual ICollection<DonHang> DonHangs { get; set; } = new List<DonHang>();

    public virtual ICollection<KeHoachTiem> KeHoachTiems { get; set; } = new List<KeHoachTiem>();

    public virtual NguonAnh? MaAnhNavigation { get; set; }

    public virtual VaiTro MaVaiTroNavigation { get; set; } = null!;

    public virtual ICollection<NguoiDungQuyen> NguoiDungQuyens { get; set; } = new List<NguoiDungQuyen>();

    public virtual ICollection<NhanVien> NhanViens { get; set; } = new List<NhanVien>();

    public virtual ICollection<PhienDangNhap> PhienDangNhaps { get; set; } = new List<PhienDangNhap>();

    public virtual ICollection<PhieuDangKyLichTiem> PhieuDangKyLichTiems { get; set; } = new List<PhieuDangKyLichTiem>();

    public virtual ICollection<PhieuTiem> PhieuTiems { get; set; } = new List<PhieuTiem>();

    public virtual QuanLy? QuanLy { get; set; }

    public virtual ICollection<ThongTinNguoiDung> ThongTinNguoiDungs { get; set; } = new List<ThongTinNguoiDung>();
}
