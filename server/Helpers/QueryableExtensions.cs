using server.DTOs.Pagination;
using Microsoft.EntityFrameworkCore;
namespace server.Helpers
{
    public static class QueryableExtensions
    {
        public static async Task<PagedResultDto<T>> ToPagedAsync<T>(
            this IQueryable<T> query,
            int page,
            int pageSize,
            CancellationToken ct = default)
        {
            var total = await query.CountAsync(ct);
            var data = await query
                              .Skip((page - 1) * pageSize)
                              .Take(pageSize)
                              .ToListAsync(ct);

            return new PagedResultDto<T>(
                total,
                page,
                pageSize,
                (int)Math.Ceiling((double)total / pageSize),
                data);
        }
    }
}