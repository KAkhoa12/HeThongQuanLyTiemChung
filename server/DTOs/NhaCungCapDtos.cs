namespace server.DTOs.NhaCungCap
{
    // DTOs/Supplier/SupplierDto.cs
    public record SupplierDto(
        string Id,
        string Ten,
        string? Phone,
        string? Address,
        string? ImageUrl,
        DateTime Created);

    // DTOs/Supplier/SupplierCreateDto.cs
    public record SupplierCreateDto(
        string Ten,
        string? Phone,
        string? Address,
        string? ImageId);

    public record SupplierUpdateDto(
        string? Ten,
        string? Phone,
        string? Address,
        string? ImageId);

    public record SupplierDetailDto(
        string Id,
        string Name,
        string? Phone,
        string? Address,
        string? AvatarUrl,
        DateTime CreatedAt,
        List<ImageRefDto> Images);

    public record ImageRefDto(string ImageId, string Url, int Order);


    public record SupplierImageUpdateDto(string ImageId, int Order);
}