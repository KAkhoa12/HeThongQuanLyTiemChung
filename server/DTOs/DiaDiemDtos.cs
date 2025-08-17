namespace server.DTOs.DiaDiem
{


    public record LocationDto(
        string Id,
        string Name,
        string Address,
        string? Phone,
        string? Email,
        string? Description,
        string? OpeningHours,
        int? Capacity,
        string? Type,
        DateTime CreatedAt);


    public record LocationDetailDto(
        string Id,
        string Name,
        string Address,
        string? Phone,
        string? Email,
        string? Description,
        string? OpeningHours,
        int? Capacity,
        string? Type,
        DateTime CreatedAt,
        List<ImageRefDto> Images);

    public record ImageRefDto(string ImageId, string Url, int Order);


    public record LocationCreateDto(
        string Name,
        string Address,
        string? Phone,
        string? Email,
        string? Description,
        string? OpeningHours,
        int? Capacity,
        string? Type);


    public record LocationUpdateDto(
        string? Name,
        string? Address,
        string? Phone,
        string? Email,
        string? Description,
        string? OpeningHours,
        int? Capacity,
        string? Type);


    public record LocationImageUpdateDto(string ImageId, int Order);
}