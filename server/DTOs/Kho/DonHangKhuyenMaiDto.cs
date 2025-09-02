using System;

namespace server.DTOs.Kho;

public class DonHangKhuyenMaiDto
{
    public string MaDonHangKhuyenMai { get; set; } = null!;
    public string MaDonHang { get; set; } = null!;
    public string MaKhuyenMai { get; set; } = null!;
    public decimal? GiamGiaGoc { get; set; }
    public decimal? GiamGiaThucTe { get; set; }
    public DateTime? NgayApDung { get; set; }
    public bool? IsDelete { get; set; }
    public bool? IsActive { get; set; }
    public DateTime? NgayTao { get; set; }
    public DateTime? NgayCapNhat { get; set; }
}

public class CreateDonHangKhuyenMaiRequest
{
    public string MaDonHang { get; set; } = null!;
    public string MaKhuyenMai { get; set; } = null!;
    public decimal GiamGiaGoc { get; set; }
    public decimal GiamGiaThucTe { get; set; }
}

// DTO để trả về thông tin khuyến mãi cho đơn hàng
public class DonHangKhuyenMaiResponseDto
{
    public string MaDonHangKhuyenMai { get; set; } = null!;
    public string MaDonHang { get; set; } = null!;
    public string MaKhuyenMai { get; set; } = null!;
    public decimal? GiamGiaGoc { get; set; }
    public decimal? GiamGiaThucTe { get; set; }
    public DateTime? NgayApDung { get; set; }
    public KhuyenMaiInfoDto KhuyenMai { get; set; } = null!;
}

// DTO để trả về thông tin đơn hàng sử dụng khuyến mãi
public class DonHangKhuyenMaiOrderResponseDto
{
    public string MaDonHangKhuyenMai { get; set; } = null!;
    public string MaDonHang { get; set; } = null!;
    public string MaKhuyenMai { get; set; } = null!;
    public decimal? GiamGiaGoc { get; set; }
    public decimal? GiamGiaThucTe { get; set; }
    public DateTime? NgayApDung { get; set; }
    public DonHangInfoDto DonHang { get; set; } = null!;
}

// DTO cho thông tin khuyến mãi
public class KhuyenMaiInfoDto
{
    public string Code { get; set; } = null!;
    public string TenKhuyenMai { get; set; } = null!;
    public string? LoaiGiam { get; set; }
    public decimal? GiaTriGiam { get; set; }
}

// DTO cho thông tin đơn hàng
public class DonHangInfoDto
{
    public string MaDonHang { get; set; } = null!;
    public string MaNguoiDung { get; set; } = null!;
    public decimal TongTienGoc { get; set; }
    public decimal TongTienThanhToan { get; set; }
    public string? TrangThaiDon { get; set; }
} 