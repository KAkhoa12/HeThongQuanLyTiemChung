using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.DTOs.DichVu;
using server.DTOs.Pagination;
using server.Helpers;
using server.Models;
using server.Filters;

namespace server.Controllers;

[ApiController]
[Route("api/services")]

public class DichVuController : ControllerBase
{
    private readonly HeThongQuanLyTiemChungContext _ctx;

    public DichVuController(HeThongQuanLyTiemChungContext ctx) => _ctx = ctx;

    /* ---------- 1. Tất cả dịch vụ (paging) ---------- */
    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] int? page = 1,
        [FromQuery] int? pageSize = 20,
        CancellationToken ct = default)
    {
        var query = _ctx.DichVus
                        .Include(d => d.MaLoaiDichVuNavigation)
                        .Where(d => d.IsDelete == false)
                        .OrderByDescending(d => d.NgayTao);

        var paged = await query.ToPagedAsync(page!.Value, pageSize!.Value, ct);

        var data = paged.Data.Select(d => new ServiceDto(
            d.MaDichVu,
            d.Ten,
            d.MoTa,
            d.Gia,
            d.MaLoaiDichVu,
            d.MaLoaiDichVuNavigation?.TenLoai,
            d.NgayTao!.Value)).ToList();

        return ApiResponse.Success(
            "Lấy danh sách dịch vụ thành công",
            new PagedResultDto<ServiceDto>(
                paged.TotalCount,
                paged.Page,
                paged.PageSize,
                paged.TotalPages,
                data));
    }

    /* ---------- 1.1. Tất cả dịch vụ (không paging) ---------- */
    [HttpGet("all")]
    public async Task<IActionResult> GetAllNoPage(CancellationToken ct = default)
    {
        var services = await _ctx.DichVus
                        .Include(d => d.MaLoaiDichVuNavigation)
                        .Where(d => d.IsDelete == false)
                        .OrderByDescending(d => d.NgayTao)
                        .Select(d => new ServiceDto(
                            d.MaDichVu,
                            d.Ten,
                            d.MoTa,
                            d.Gia,
                            d.MaLoaiDichVu,
                            d.MaLoaiDichVuNavigation != null ? d.MaLoaiDichVuNavigation.TenLoai : null,
                            d.NgayTao!.Value))
                        .ToListAsync(ct);

        return ApiResponse.Success("Lấy danh sách dịch vụ thành công", services);
    }

    /* ---------- 2. Theo ID ---------- */
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id, CancellationToken ct)
    {
        var service = await _ctx.DichVus
            .Include(d => d.MaLoaiDichVuNavigation)
            .Include(d => d.AnhDichVus.Where(a => a.IsDelete == false))
                .ThenInclude(a => a.MaAnhNavigation)
            .Include(d => d.DichVuVaccines.Where(v => v.IsDelete == false))
                .ThenInclude(v => v.MaVaccineNavigation)
            .FirstOrDefaultAsync(d => d.MaDichVu == id && d.IsDelete == false, ct);

        if (service == null)
            return ApiResponse.Error("Không tìm thấy dịch vụ", 404);

        var dto = new ServiceDetailDto(
            service.MaDichVu,
            service.Ten,
            service.MoTa,
            service.Gia,
            service.MaLoaiDichVu,
            service.MaLoaiDichVuNavigation?.TenLoai,
            service.NgayTao!.Value,
            service.AnhDichVus
                .OrderBy(a => a.ThuTuHienThi)
                .Select(a => new ServiceImageDto(
                    a.MaAnh,
                    a.MaAnhNavigation?.UrlAnh,
                    a.ThuTuHienThi ?? 0,
                    a.LaAnhChinh ?? false))
                .ToList(),
            service.DichVuVaccines
                .Select(v => new ServiceVaccineDto(
                    v.MaDichVuVaccine,
                    v.MaVaccine,
                    v.MaVaccineNavigation.Ten,
                    v.SoMuiChuan,
                    v.ThuTu,
                    v.GhiChu))
                .ToList());

        return ApiResponse.Success("Chi tiết dịch vụ", dto);
    }

    /* ---------- 3. Tạo mới ---------- */
    [HttpPost]
    [ConfigAuthorize]
    public async Task<IActionResult> Create(
        [FromBody] ServiceCreateDto dto,
        CancellationToken ct)
    {
        if (await _ctx.DichVus
                      .AnyAsync(d => d.Ten == dto.Name && d.IsDelete == false, ct))
            return ApiResponse.Error("Tên dịch vụ đã tồn tại", 409);

        // Kiểm tra loại dịch vụ nếu có
        if (dto.ServiceTypeId != null && 
            !await _ctx.LoaiDichVus.AnyAsync(l => l.MaLoaiDichVu == dto.ServiceTypeId && l.IsDelete == false, ct))
            return ApiResponse.Error("Loại dịch vụ không tồn tại", 404);

        var service = new DichVu
        {
            MaDichVu = Guid.NewGuid().ToString("N"),
            Ten = dto.Name,
            MoTa = dto.Description,
            Gia = dto.Price,
            MaLoaiDichVu = dto.ServiceTypeId,
            IsActive = true,
            IsDelete = false,
            NgayTao = DateTime.UtcNow
        };

        _ctx.DichVus.Add(service);
        await _ctx.SaveChangesAsync(ct);

        return ApiResponse.Success("Tạo dịch vụ thành công",
            new { service.MaDichVu }, 201);
    }

    /* ---------- 4. Cập nhật ---------- */
    [HttpPut("{id}")]
    [ConfigAuthorize]
    public async Task<IActionResult> Update(
        string id,
        [FromBody] ServiceUpdateDto dto,
        CancellationToken ct)
    {
        var service = await _ctx.DichVus
            .FirstOrDefaultAsync(d => d.MaDichVu == id && d.IsDelete == false, ct);
        if (service == null)
            return ApiResponse.Error("Không tìm thấy dịch vụ", 404);

        // Kiểm tra tên dịch vụ đã tồn tại chưa
        if (dto.Name != null && dto.Name != service.Ten &&
            await _ctx.DichVus.AnyAsync(d => d.Ten == dto.Name && d.IsDelete == false && d.MaDichVu != id, ct))
            return ApiResponse.Error("Tên dịch vụ đã tồn tại", 409);

        // Kiểm tra loại dịch vụ nếu có
        if (dto.ServiceTypeId != null && dto.ServiceTypeId != service.MaLoaiDichVu &&
            !await _ctx.LoaiDichVus.AnyAsync(l => l.MaLoaiDichVu == dto.ServiceTypeId && l.IsDelete == false, ct))
            return ApiResponse.Error("Loại dịch vụ không tồn tại", 404);

        service.Ten = dto.Name ?? service.Ten;
        service.MoTa = dto.Description ?? service.MoTa;
        service.Gia = dto.Price ?? service.Gia;
        service.MaLoaiDichVu = dto.ServiceTypeId ?? service.MaLoaiDichVu;
        service.NgayCapNhat = DateTime.UtcNow;

        await _ctx.SaveChangesAsync(ct);
        return ApiResponse.Success("Cập nhật dịch vụ thành công", null, 200);
    }

    /* ---------- 5. Xóa mềm ---------- */
    [HttpDelete("{id}")]
    [ConfigAuthorize]
    public async Task<IActionResult> Delete(string id, CancellationToken ct)
    {
        var service = await _ctx.DichVus
            .FirstOrDefaultAsync(d => d.MaDichVu == id && d.IsDelete == false, ct);
        if (service == null)
            return ApiResponse.Error("Không tìm thấy dịch vụ", 404);

        service.IsDelete = true;
        service.NgayCapNhat = DateTime.UtcNow;
        await _ctx.SaveChangesAsync(ct);
        return ApiResponse.Success("Xóa dịch vụ thành công", null, 200);
    }

    /* ---------- 6. Cập nhật danh sách ảnh ---------- */
    [HttpPut("{id}/images")]
    [ConfigAuthorize]
    public async Task<IActionResult> UpdateImages(
        string id,
        [FromBody] List<ServiceImageUpdateDto> dtoList,
        CancellationToken ct)
    {
        var service = await _ctx.DichVus
            .Include(d => d.AnhDichVus)
            .FirstOrDefaultAsync(d => d.MaDichVu == id && d.IsDelete == false, ct);
        if (service == null)
            return ApiResponse.Error("Không tìm thấy dịch vụ", 404);

        // Kiểm tra ảnh chính
        var mainImages = dtoList.Count(i => i.IsMain);
        if (mainImages > 1)
            return ApiResponse.Error("Chỉ được chọn một ảnh chính", 400);
        if (mainImages == 0 && dtoList.Any())
            return ApiResponse.Error("Phải chọn ít nhất một ảnh chính", 400);

        // Soft-delete ảnh cũ
        foreach (var old in service.AnhDichVus.Where(a => a.IsDelete == false))
        {
            old.IsDelete = true;
            old.NgayCapNhat = DateTime.UtcNow;
        }

        // Thêm ảnh mới
        foreach (var item in dtoList.OrderBy(i => i.Order))
        {
            var img = new AnhDichVu
            {
                MaAnhDichVu = Guid.NewGuid().ToString("N"),
                MaDichVu = id,
                MaAnh = item.ImageId,
                LaAnhChinh = item.IsMain,
                ThuTuHienThi = item.Order,
                IsActive = true,
                IsDelete = false,
                NgayTao = DateTime.UtcNow
            };
            _ctx.AnhDichVus.Add(img);
        }

        await _ctx.SaveChangesAsync(ct);
        return ApiResponse.Success("Cập nhật ảnh dịch vụ thành công", null, 200);
    }

    /* ---------- 7. Lấy dịch vụ theo loại ---------- */
    [HttpGet("by-type/{typeId}")]
    [ConfigAuthorize]
    public async Task<IActionResult> GetByType(
        string typeId,
        [FromQuery] int? page = 1,
        [FromQuery] int? pageSize = 20,
        CancellationToken ct = default)
    {
        // Kiểm tra loại dịch vụ tồn tại
        if (!await _ctx.LoaiDichVus.AnyAsync(l => l.MaLoaiDichVu == typeId && l.IsDelete == false, ct))
            return ApiResponse.Error("Loại dịch vụ không tồn tại", 404);

        var query = _ctx.DichVus
                        .Where(d => d.MaLoaiDichVu == typeId && d.IsDelete == false)
                        .OrderByDescending(d => d.NgayTao);

        var paged = await query.ToPagedAsync(page!.Value, pageSize!.Value, ct);

        var data = paged.Data.Select(d => new ServiceDto(
            d.MaDichVu,
            d.Ten,
            d.MoTa,
            d.Gia,
            d.MaLoaiDichVu,
            null, // Không cần load lại tên loại vì đã biết typeId
            d.NgayTao!.Value)).ToList();

        return ApiResponse.Success(
            "Lấy danh sách dịch vụ theo loại thành công",
            new PagedResultDto<ServiceDto>(
                paged.TotalCount,
                paged.Page,
                paged.PageSize,
                paged.TotalPages,
                data));
    }
}