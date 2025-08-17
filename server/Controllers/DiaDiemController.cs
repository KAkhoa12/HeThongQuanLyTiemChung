// File: server/Controllers/DiaDiemController.cs
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.DTOs.DiaDiem;
using server.DTOs.Pagination;
using server.Helpers;
using server.Models;

namespace server.Controllers;

[ApiController]
[Route("api/locations")]
public class DiaDiemController : ControllerBase
{
    private readonly HeThongQuanLyTiemChungContext _ctx;

    public DiaDiemController(HeThongQuanLyTiemChungContext ctx) => _ctx = ctx;

    /* ---------- 1. Tất cả địa điểm (paging) ---------- */
    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] int? page = 1,
        [FromQuery] int? pageSize = 20,
        CancellationToken ct = default)
    {
        var query = _ctx.DiaDiems
                        .Where(d => d.IsDelete == false)
                        .OrderByDescending(d => d.NgayTao);

        var paged = await query.ToPagedAsync(page!.Value, pageSize!.Value, ct);

        var data = paged.Data.Select(d => new LocationDto(
            d.MaDiaDiem,
            d.Ten,
            d.DiaChi,
            d.SoDienThoai,
            d.Email,
            d.MoTa,
            d.GioMoCua,
            d.SucChua,
            d.LoaiDiaDiem,
            d.NgayTao!.Value)).ToList();

        return ApiResponse.Success(
            "Lấy danh sách địa điểm thành công",
            new PagedResultDto<LocationDto>(
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
        var location = await _ctx.DiaDiems
            .Include(d => d.AnhDiaDiems.Where(a => a.IsDelete == false))
                .ThenInclude(a => a.MaAnhNavigation)
            .FirstOrDefaultAsync(d => d.MaDiaDiem == id && d.IsDelete == false, ct);

        if (location == null)
            return ApiResponse.Error("Không tìm thấy địa điểm", 404);

        var dto = new LocationDetailDto(
            location.MaDiaDiem,
            location.Ten,
            location.DiaChi,
            location.SoDienThoai,
            location.Email,
            location.MoTa,
            location.GioMoCua,
            location.SucChua,
            location.LoaiDiaDiem,
            location.NgayTao!.Value,
            location.AnhDiaDiems
                .OrderBy(a => a.ThuTuHienThi)
                .Select(a => new ImageRefDto(
                    a.MaAnh,
                    a.MaAnhNavigation.UrlAnh,
                    a.ThuTuHienThi ?? 0))
                .ToList());

        return ApiResponse.Success("Chi tiết địa điểm", dto);
    }

    /* ---------- 3. Tạo mới ---------- */
    [HttpPost]
    public async Task<IActionResult> Create(
        [FromBody] LocationCreateDto dto,
        CancellationToken ct)
    {
        if (await _ctx.DiaDiems
                      .AnyAsync(d => d.Ten == dto.Name && d.IsDelete == false, ct))
            return ApiResponse.Error("Tên địa điểm đã tồn tại", 409);

        var location = new DiaDiem
        {
            MaDiaDiem = Guid.NewGuid().ToString("N"),
            Ten = dto.Name,
            DiaChi = dto.Address,
            SoDienThoai = dto.Phone,
            Email = dto.Email,
            MoTa = dto.Description,
            GioMoCua = dto.OpeningHours,
            SucChua = dto.Capacity,
            LoaiDiaDiem = dto.Type,
            IsActive = true,
            IsDelete = false,
            NgayTao = DateTime.UtcNow
        };

        _ctx.DiaDiems.Add(location);
        await _ctx.SaveChangesAsync(ct);

        return ApiResponse.Success("Tạo địa điểm thành công",
            new { location.MaDiaDiem }, 201);
    }

    /* ---------- 4. Cập nhật ---------- */
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(
        string id,
        [FromBody] LocationUpdateDto dto,
        CancellationToken ct)
    {
        var location = await _ctx.DiaDiems
            .FirstOrDefaultAsync(d => d.MaDiaDiem == id && d.IsDelete == false, ct);
        if (location == null)
            return ApiResponse.Error("Không tìm thấy địa điểm", 404);

        location.Ten = dto.Name ?? location.Ten;
        location.DiaChi = dto.Address ?? location.DiaChi;
        location.SoDienThoai = dto.Phone ?? location.SoDienThoai;
        location.Email = dto.Email ?? location.Email;
        location.MoTa = dto.Description ?? location.MoTa;
        location.GioMoCua = dto.OpeningHours ?? location.GioMoCua;
        location.SucChua = dto.Capacity ?? location.SucChua;
        location.LoaiDiaDiem = dto.Type ?? location.LoaiDiaDiem;
        location.NgayCapNhat = DateTime.UtcNow;

        await _ctx.SaveChangesAsync(ct);
        return ApiResponse.Success("Cập nhật địa điểm thành công", null, 200);
    }

    /* ---------- 5. Xóa mềm ---------- */
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id, CancellationToken ct)
    {
        var location = await _ctx.DiaDiems
            .FirstOrDefaultAsync(d => d.MaDiaDiem == id && d.IsDelete == false, ct);
        if (location == null)
            return ApiResponse.Error("Không tìm thấy địa điểm", 404);

        location.IsDelete = true;
        location.NgayCapNhat = DateTime.UtcNow;
        await _ctx.SaveChangesAsync(ct);
        return ApiResponse.Success("Xóa địa điểm thành công", null, 200);
    }

    /* ---------- 6. Cập nhật danh sách ảnh ---------- */
    [HttpPut("{id}/images")]
    public async Task<IActionResult> UpdateImages(
        string id,
        [FromBody] List<LocationImageUpdateDto> dtoList,
        CancellationToken ct)
    {
        var location = await _ctx.DiaDiems
            .Include(d => d.AnhDiaDiems)
            .FirstOrDefaultAsync(d => d.MaDiaDiem == id && d.IsDelete == false, ct);
        if (location == null)
            return ApiResponse.Error("Không tìm thấy địa điểm", 404);

        // Soft-delete ảnh cũ
        foreach (var old in location.AnhDiaDiems.Where(a => a.IsDelete == false))
        {
            old.IsDelete = true;
            old.NgayCapNhat = DateTime.UtcNow;
        }

        // Thêm ảnh mới
        foreach (var item in dtoList.OrderBy(i => i.Order))
        {
            var img = new AnhDiaDiem
            {
                MaAnhDiaDiem = Guid.NewGuid().ToString("N"),
                MaDiaDiem = id,
                MaAnh = item.ImageId,
                ThuTuHienThi = item.Order,
                IsActive = true,
                IsDelete = false,
                NgayTao = DateTime.UtcNow
            };
            _ctx.AnhDiaDiems.Add(img);
        }

        await _ctx.SaveChangesAsync(ct);
        return ApiResponse.Success("Cập nhật ảnh địa điểm thành công", null, 200);
    }
}