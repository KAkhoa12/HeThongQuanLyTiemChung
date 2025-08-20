namespace server.DTOs.DichVu
{
    public record ServiceDto(
        string Id,
        string Name,
        string? Description,
        decimal? Price,
        string? ServiceTypeId,
        string? ServiceTypeName,
        DateTime CreatedAt
    );

    public record ServiceDetailDto(
        string Id,
        string Name,
        string? Description,
        decimal? Price,
        string? ServiceTypeId,
        string? ServiceTypeName,
        DateTime CreatedAt,
        List<ServiceImageDto> Images,
        List<ServiceVaccineDto>? Vaccines = null
    );

    public record ServiceImageDto(
        string? ImageId,
        string? ImageUrl,
        int Order,
        bool IsMain
    );

    public record ServiceVaccineDto(
        string Id,
        string VaccineId,
        string VaccineName,
        int StandardDoses,
        string? Notes
    );

    public record ServiceCreateDto(
        string Name,
        string? Description,
        decimal? Price,
        string? ServiceTypeId
    );

    public record ServiceUpdateDto(
        string? Name = null,
        string? Description = null,
        decimal? Price = null,
        string? ServiceTypeId = null
    );

    public record ServiceImageUpdateDto(
        string ImageId,
        int Order,
        bool IsMain
    );
}