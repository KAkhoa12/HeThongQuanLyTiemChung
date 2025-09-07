namespace server.DTOs.PhieuDangKyLichTiem;

public record CreatePhieuDangKyLichTiemDto(
    string MaKhachHang,
    string MaDichVu,
    string? MaDiaDiem = null,
    DateTime? NgayDangKy = null,
    string? GhiChu = null
); 