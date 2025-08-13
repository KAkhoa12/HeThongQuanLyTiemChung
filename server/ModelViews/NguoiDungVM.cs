using System;
using System.Collections.Generic;

namespace server.ModelViews;

public partial class NguoiDungVM
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




}
