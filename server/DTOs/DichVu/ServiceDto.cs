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
        List<ServiceVaccineDto>? Vaccines = null,
        List<ServiceConditionDto>? Conditions = null
    );

    public record ServiceImageDto(
        string? ImageId,
        string? ImageUrl,
        int Order,
        bool IsMain
    );

    public record ServiceVaccineDto(
        string MaDichVuVaccine,
        string MaVaccine,
        string TenVaccine,
        int SoMuiChuan,
        int? ThuTu,
        string? GhiChu
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

    public record ServiceConditionDto(
        string ConditionId,
        int? MinAgeInMonths,
        int? MaxAgeInMonths,
        string? Gender,
        string? Note,
        string ServiceId,
        string? ServiceName
    );

    public record ServiceConditionCreateDto(
        string ServiceId,
        int? MinAgeInMonths,
        int? MaxAgeInMonths,
        string? Gender,
        string? Note
    );

    public record ServiceConditionUpdateDto(
        int? MinAgeInMonths = null,
        int? MaxAgeInMonths = null,
        string? Gender = null,
        string? Note = null
    );

    public record ServiceConditionBatchCreateDto(
        string ServiceId,
        List<ServiceConditionCreateDto> Conditions
    );

    public record EligibilityCheckDto(
        string ServiceId,
        int AgeInMonths,
        string Gender
    );
}