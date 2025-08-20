namespace server.DTOs.Pagination
{
    public class PagedResultDto<T>
    {
        public int TotalCount { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalPages { get; set; }
        public List<T> Data { get; set; }

        public PagedResultDto(int totalCount, int page, int pageSize, int totalPages, List<T> data)
        {
            TotalCount = totalCount;
            Page = page;
            PageSize = pageSize;
            TotalPages = totalPages;
            Data = data;
        }
    }
}