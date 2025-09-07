using System.Text.Json.Serialization;

namespace server.DTOs.PhieuDangKyLichTiem;

public record CreateAppointmentFromOrderDto(
    [property: JsonPropertyName("orderId")] string OrderId,
    [property: JsonPropertyName("maDiaDiem")] string MaDiaDiem,
    [property: JsonPropertyName("ngayDangKy")] DateTime? NgayDangKy = null,
    [property: JsonPropertyName("ghiChu")] string? GhiChu = null
); 