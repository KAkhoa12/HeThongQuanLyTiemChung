namespace server.DTOs.PhieuDangKyLichTiem;

public record CreateAppointmentFromOrderDto(
    string OrderId,
    string? GhiChu = null
); 