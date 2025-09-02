namespace server.DTOs.BacSi
{
    public record DoctorDto(
        string Id,
        string UserId,
        string Name,
        string? Phone,
        string? Email,
        string? Specialty,
        string? LicenseNumber,
        string? MaDiaDiem,
        string? ImageUrl,
        DateTime CreatedAt
    );

    public record DoctorDetailDto(
        string Id,
        string UserId,
        string Name,
        string? Phone,
        string? Email,
        string? Specialty,
        string? LicenseNumber,
        string? MaDiaDiem,
        string? ImageUrl,
        DateTime CreatedAt,
        List<DoctorScheduleSummaryDto> UpcomingSchedules
    );

    public record DoctorScheduleSummaryDto(
        string Id,
        DateOnly WorkDate,
        TimeOnly StartTime,
        TimeOnly EndTime,
        string LocationId,
        string LocationName,
        int TotalSlots,
        int BookedSlots,
        string? Status
    );

    public record DoctorCreateDto(
        string UserId,
        string? Specialty,
        string? LicenseNumber,
        string? MaDiaDiem
    );

    public record DoctorCreateWithUserDto(
        string Ten,
        string Email,
        string MatKhau,
        string? SoDienThoai,
        DateOnly? NgaySinh,
        string? DiaChi,
        string? ChuyenMon,
        string? SoGiayPhep,
        string? MaDiaDiem
    );

    public record DoctorUpdateDto(
        string? Specialty = null,
        string? LicenseNumber = null,
        string? MaDiaDiem = null
    );
}