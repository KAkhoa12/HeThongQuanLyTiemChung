using System.Text.Json.Serialization;

namespace server.DTOs.PhieuDangKyLichTiem;

public record CreateVaccinationPlanFromOrderDto(
    [property: JsonPropertyName("orderId")] string OrderId,
    [property: JsonPropertyName("maDiaDiem")] string MaDiaDiem,
    [property: JsonPropertyName("ghiChu")] string? GhiChu = null
);