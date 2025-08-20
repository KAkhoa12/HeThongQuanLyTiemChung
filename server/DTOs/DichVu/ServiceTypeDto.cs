namespace server.DTOs.DichVu
{
    public record ServiceTypeDto(
        string Id,
        string Name,
        DateTime CreatedAt
    );

    public record ServiceTypeDetailDto(
        string Id,
        string Name,
        DateTime CreatedAt,
        List<ServiceBasicDto> Services
    );

    public record ServiceBasicDto(
        string Id,
        string Name,
        string? Description,
        decimal? Price
    );

    public record ServiceTypeCreateDto(
        string Name
    );

    public record ServiceTypeUpdateDto(
        string? Name = null
    );
}