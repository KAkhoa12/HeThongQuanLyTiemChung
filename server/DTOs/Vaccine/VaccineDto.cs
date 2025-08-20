namespace server.DTOs.Vaccine
{
    public record VaccineDto(
        string Id,
        string Name,
        string? Manufacturer,
        int? StartAge,
        int? EndAge,
        string? Prevention,
        DateTime CreatedAt
    );

    public record VaccineDetailDto(
        string Id,
        string Name,
        string? Manufacturer,
        int? StartAge,
        int? EndAge,
        string? Usage,
        string? Prevention,
        DateTime CreatedAt,
        List<VaccineImageDto> Images
    );

    public record VaccineImageDto(
        string? ImageId,
        string? ImageUrl,
        int Order,
        bool IsMain
    );

    public record VaccineCreateDto(
        string Name,
        string? Manufacturer,
        int? StartAge,
        int? EndAge,
        string? Usage,
        string? Prevention
    );

    public record VaccineUpdateDto(
        string? Name = null,
        string? Manufacturer = null,
        int? StartAge = null,
        int? EndAge = null,
        string? Usage = null,
        string? Prevention = null
    );

    public record VaccineImageUpdateDto(
        string ImageId,
        int Order,
        bool IsMain
    );
}