namespace server.DTOs.PhieuDangKyLichTiem;

public record CreatePhieuDangKyLichTiemDto(
    string MaKhachHang,
    string MaDichVu,
    DateTime NgayDangKy,
    string? GhiChu = null
); 