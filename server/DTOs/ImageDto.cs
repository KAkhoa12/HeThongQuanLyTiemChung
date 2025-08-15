namespace server.DTOs.Image
{
    public record ImageUploadDto(IFormFile File, string? AltText, string? MaNhan);

    public record ImageUpdateDto(string? AltText, string? MaNhan, bool? IsActive);

    public record ImageResponseDto(
        string MaAnh,
        string UrlAnh,
        string? AltText,
        string? TenNhan,
        string? MaNhan,
        DateTime NgayTao
    );
    public record ImageLabelCreateDto(string TenNhan, string? MoTa);

    public record ImageLabelUpdateDto(string? TenNhan, string? MoTa, bool? IsActive);

    public record ImageLabelResponseDto(
        string MaNhan,
        string TenNhan,
        string? MoTa,
        bool IsActive,
        DateTime NgayTao
    );
    public record ImageLabelUpdateResponseDto(
        string MaNhan,
        string TenNhan,
        string? MoTa,
        bool IsActive,
        DateTime NgayCapNhap
    );
    public record ImageLabelCreateResponseDto(
        string MaNhan,
        string TenNhan,
        string? MoTa,
        DateTime NgayTao
    );
}