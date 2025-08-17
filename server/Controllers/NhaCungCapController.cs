// File: server/Controllers/NhaCungCapController.cs
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.DTOs.NhaCungCap;
using server.Helpers;
using server.DTOs.Pagination;
using server.Models;

namespace server.Controllers;

[ApiController]
[Route("api/suppliers")]
public class NhaCungCapController : ControllerBase
{
    private readonly HeThongQuanLyTiemChungContext _ctx;

    public NhaCungCapController(HeThongQuanLyTiemChungContext ctx) => _ctx = ctx;

    /* ---------- 1. Tất cả nhà cung cấp (paging) ---------- */
    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] int? page = 1,
        [FromQuery] int? pageSize = 20,
        CancellationToken ct = default)
    {
        var query = _ctx.NhaCungCaps
                        .Where(s => s.IsDelete == false)
                        .OrderByDescending(s => s.NgayTao);

        var paged = await query.ToPagedAsync(page!.Value, pageSize!.Value, ct);

        var data = paged.Data
            .Select(s => new SupplierDto(
                s.MaNhaCungCap,
                s.Ten,
                s.SoDienThoai,
                s.DiaChi,
                s.MaAnhNavigation?.UrlAnh,
                s.NgayTao!.Value))
            .ToList();

        return ApiResponse.Success(
            "Lấy danh sách nhà cung cấp thành công",
            new PagedResultDto<SupplierDto>(
                paged.TotalCount,
                paged.Page,
                paged.PageSize,
                paged.TotalPages,
                data));
    }

    /* ---------- 2. Theo ID ---------- */
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id, CancellationToken ct)
    {
        var supplier = await _ctx.NhaCungCaps
            .Include(s => s.MaAnhNavigation)
            .Include(s => s.AnhNhaCungCaps.Where(a => a.IsDelete == false))
                .ThenInclude(a => a.MaAnhNavigation)
            .FirstOrDefaultAsync(s => s.MaNhaCungCap == id && s.IsDelete == false, ct);

        if (supplier == null)
            return ApiResponse.Error("Không tìm thấy nhà cung cấp", 404);

        var dto = new SupplierDetailDto(
            supplier.MaNhaCungCap,
            supplier.Ten,
            supplier.SoDienThoai,
            supplier.DiaChi,
            supplier.MaAnhNavigation?.UrlAnh,
            supplier.NgayTao!.Value,
            supplier.AnhNhaCungCaps.Select(a => new ImageRefDto(
                a.MaAnh,
                a.MaAnhNavigation.UrlAnh,
                a.ThuTuHienThi ?? 0)).ToList());

        return ApiResponse.Success("Chi tiết nhà cung cấp", dto);
    }

    /* ---------- 3. Tạo mới ---------- */
    [HttpPost]
    public async Task<IActionResult> Create(
        [FromBody] SupplierCreateDto dto,
        CancellationToken ct)
    {
        if (await _ctx.NhaCungCaps
                      .AnyAsync(s => s.Ten == dto.Ten && s.IsDelete == false, ct))
            return ApiResponse.Error("Tên nhà cung cấp đã tồn tại", 409);

        var supplier = new NhaCungCap
        {
            MaNhaCungCap = Guid.NewGuid().ToString("N"),
            Ten = dto.Ten,
            SoDienThoai = dto.Phone,
            DiaChi = dto.Address,
            MaAnh = dto.ImageId,
            IsActive = true,
            IsDelete = false,
            NgayTao = DateTime.UtcNow
        };

        _ctx.NhaCungCaps.Add(supplier);
        await _ctx.SaveChangesAsync(ct);

        return ApiResponse.Success("Tạo nhà cung cấp thành công",
            new { supplier.MaNhaCungCap }, 201);
    }

    /* ---------- 4. Cập nhật ---------- */
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id,
                                            [FromBody] SupplierUpdateDto dto,
                                            CancellationToken ct)
    {
        var supplier = await _ctx.NhaCungCaps
            .FirstOrDefaultAsync(s => s.MaNhaCungCap == id && s.IsDelete == false, ct);
        if (supplier == null)
            return ApiResponse.Error("Không tìm thấy nhà cung cấp", 404);

        supplier.Ten = dto.Ten ?? supplier.Ten;
        supplier.SoDienThoai = dto.Phone ?? supplier.SoDienThoai;
        supplier.DiaChi = dto.Address ?? supplier.DiaChi;
        supplier.MaAnh = dto.ImageId ?? supplier.MaAnh;
        supplier.NgayCapNhat = DateTime.UtcNow;

        await _ctx.SaveChangesAsync(ct);
        return ApiResponse.Success("Cập nhật nhà cung cấp thành công");
    }

    /* ---------- 5. Xóa mềm ---------- */
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id, CancellationToken ct)
    {
        var supplier = await _ctx.NhaCungCaps
            .FirstOrDefaultAsync(s => s.MaNhaCungCap == id && s.IsDelete == false, ct);
        if (supplier == null)
            return ApiResponse.Error("Không tìm thấy nhà cung cấp", 404);

        supplier.IsDelete = true;
        supplier.NgayCapNhat = DateTime.UtcNow;
        await _ctx.SaveChangesAsync(ct);
        return ApiResponse.Success("Xóa nhà cung cấp thành công");
    }

    /* ---------- 6. Cập nhật danh sách ảnh ---------- */
    [HttpPut("{id}/images")]
    public async Task<IActionResult> UpdateImages(
        string id,
        [FromBody] List<SupplierImageUpdateDto> dtoList,
        CancellationToken ct)
    {
        var supplier = await _ctx.NhaCungCaps
            .Include(s => s.AnhNhaCungCaps)
            .FirstOrDefaultAsync(s => s.MaNhaCungCap == id && s.IsDelete == false, ct);
        if (supplier == null)
            return ApiResponse.Error("Không tìm thấy nhà cung cấp", 404);

        // Xoá ảnh cũ (soft-delete)
        foreach (var old in supplier.AnhNhaCungCaps.Where(a => a.IsDelete == false))
        {
            old.IsDelete = true;
            old.NgayCapNhat = DateTime.UtcNow;
        }

        // Thêm ảnh mới
        foreach (var item in dtoList.OrderBy(i => i.Order))
        {
            var img = new AnhNhaCungCap
            {
                MaAnhNhaCungCap = Guid.NewGuid().ToString("N"),
                MaNhaCungCap = id,
                MaAnh = item.ImageId,
                ThuTuHienThi = item.Order,
                IsActive = true,
                IsDelete = false,
                NgayTao = DateTime.UtcNow
            };
            _ctx.AnhNhaCungCaps.Add(img);
        }

        await _ctx.SaveChangesAsync(ct);
        return ApiResponse.Success("Cập nhật ảnh nhà cung cấp thành công");
    }
}