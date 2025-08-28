namespace server.DTOs.LichLamViec
{
    public record WorkScheduleDto(
        string Id,
        string DoctorId,
        string DoctorName,
        string LocationId,
        string LocationName,
        DateOnly WorkDate,
        TimeOnly StartTime,
        TimeOnly EndTime,
        int TotalSlots,
        int BookedSlots,
        string? Status,
        DateTime CreatedAt
    );

    public record WorkScheduleDetailDto(
        string Id,
        string DoctorId,
        string DoctorName,
        string? DoctorSpecialty,
        string? DoctorImageUrl,
        string LocationId,
        string LocationName,
        string? LocationAddress,
        DateOnly WorkDate,
        TimeOnly StartTime,
        TimeOnly EndTime,
        int TotalSlots,
        int BookedSlots,
        string? Status,
        DateTime CreatedAt,
        List<AppointmentSlotDto>? Appointments = null
    );

    public record AppointmentSlotDto(
        string Id,
        string OrderId,
        string CustomerName,
        string? VaccineId, // Có thể null vì MaVaccine đã bị xóa
        string? VaccineName, // Có thể null vì TenVaccine đã bị xóa
        int DoseNumber,
        DateTime AppointmentTime,
        string? Status
    );

    public record WorkScheduleCreateDto(
    string MaBacSi,
    string MaDiaDiem,
    DateOnly NgayLam,
    TimeOnly GioBatDau,
    TimeOnly GioKetThuc,
    int SoLuongCho,
    string? TrangThai = "Available"
);

    public record WorkScheduleUpdateDto(
        TimeOnly? StartTime = null,
        TimeOnly? EndTime = null,
        int? TotalSlots = null,
        string? Status = null
    );

    public record ScheduleAvailabilityDto(
        DateOnly Date,
        List<TimeSlotDto> AvailableTimeSlots
    );

    public record TimeSlotDto(
        string ScheduleId,
        TimeOnly StartTime,
        TimeOnly EndTime,
        int AvailableSlots
    );
}