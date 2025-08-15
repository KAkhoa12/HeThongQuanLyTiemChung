namespace server.DTOs.Pagination
{
    public record PagedResultDto<T>(
        int TotalCount,
        int Page,
        int PageSize,
        int TotalPages,
        IReadOnlyList<T> Data);
}