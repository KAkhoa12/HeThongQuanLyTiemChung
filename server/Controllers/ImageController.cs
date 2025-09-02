using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.DTOs.Image;
using server.Models;
using server.Helpers;
using server.DTOs.Pagination;
namespace server.Controllers;

[ApiController]
[Route("api/images")]
public class ImageController : ControllerBase
{
    private readonly HeThongQuanLyTiemChungContext _ctx;
    private readonly IWebHostEnvironment _env;
    private readonly ILogger<ImageController> _log;

    public ImageController(HeThongQuanLyTiemChungContext ctx,
                           IWebHostEnvironment env,
                           ILogger<ImageController> log)
    {
        _ctx = ctx;
        _env = env;
        _log = log;
    }

    /* ---------- 4.1 Upload nhiều ảnh ---------- */
    [HttpPost("upload")]
    public async Task<IActionResult> UploadMany(
        [FromForm] List<IFormFile> files,
        [FromForm] string? altText,
        [FromForm] string? maNhan,
        CancellationToken ct = default)
    {
        if (files == null || files.Count == 0)
            return ApiResponse.Error("Không có file nào!");
        if (maNhan == null || maNhan.Trim() == "")
        {
            var nhanKhac = _ctx.NhanAnhs.FirstOrDefault(n => n.TenNhan == "Khác");
            if (nhanKhac == null)
            {
                return ApiResponse.Error("Không tìm thấy nhãn Khác!");
            }
            maNhan = nhanKhac.MaNhan;
        }

        var mediaPath = Path.Combine(_env.ContentRootPath, "media");
        Directory.CreateDirectory(mediaPath);

        var results = new List<ImageResponseDto>();

        foreach (var file in files)
        {
            if (file.Length == 0) continue;

            var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
            var id = Guid.NewGuid().ToString("N");
            var fileName = $"{id}{ext}";
            var filePath = Path.Combine(mediaPath, fileName);

            await using var stream = new FileStream(filePath, FileMode.Create);
            await file.CopyToAsync(stream, ct);

            var img = new NguonAnh
            {
                MaAnh = id,
                UrlAnh = $"/media/{fileName}",
                AltText = altText,
                MaNhan = maNhan,
                NgayTao = DateTime.UtcNow,
                IsActive = true,
                IsDelete = false
            };

            _ctx.NguonAnhs.Add(img);
            await _ctx.SaveChangesAsync(ct);

            var dto = new ImageResponseDto(
                img.MaAnh,
                img.UrlAnh,
                img.AltText,
                img.MaNhanNavigation?.MaNhan,
                img.MaNhanNavigation?.TenNhan,
                img.NgayTao.Value);

            results.Add(dto);
        }

        return ApiResponse.Success("Upload ảnh thảnh công", results);
    }

    /* ---------- 4.2 Xem ảnh chi tiết ---------- */
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id, CancellationToken ct)
    {
        var img = await _ctx.NguonAnhs
            .Include(i => i.MaNhanNavigation)
            .FirstOrDefaultAsync(i => i.MaAnh == id && i.IsDelete == false, ct);

        if (img == null) return NotFound();

        var dto = new ImageResponseDto(
            img.MaAnh,
            img.UrlAnh,
            img.AltText,
            img.MaNhanNavigation?.TenNhan,
            img.MaNhanNavigation?.MaNhan,
            img.NgayTao.Value);

        return ApiResponse.Success("Lấy ảnh thành công", dto);
    }
    [HttpGet]
    public async Task<IActionResult> GetAll(
    [FromQuery] int? page = 1,
    [FromQuery] int? pageSize = 20,
    CancellationToken ct = default)
    {
        var query = _ctx.NguonAnhs
                        .Where(i => i.IsDelete == false)
                        .OrderByDescending(i => i.NgayTao);

        var paged = await query.ToPagedAsync(page!.Value, pageSize!.Value, ct);

        var data = paged.Data.Select(i => new ImageResponseDto(
            i.MaAnh,
            i.UrlAnh,
            i.AltText,
            i.MaNhanNavigation?.TenNhan,
            i.MaNhanNavigation?.MaNhan,
            i.NgayTao!.Value)).ToList();

        return ApiResponse.Success("Lấy ảnh thành công",
            new PagedResultDto<ImageResponseDto>(
                paged.TotalCount,
                paged.Page,
                paged.PageSize,
                paged.TotalPages,
                data));
    }
    [HttpGet("by-label/{labelId}")]
    public async Task<IActionResult> GetByLabel(
    string labelId,
    [FromQuery] int? page = 1,
    [FromQuery] int? pageSize = 20,
    CancellationToken ct = default)
    {
        var query = _ctx.NguonAnhs
                        .Include(i => i.MaNhanNavigation)   // đảm bảo join
                        .Where(i => i.MaNhan == labelId && i.IsDelete == false)
                        .OrderByDescending(i => i.NgayTao);

        var paged = await query.ToPagedAsync(page!.Value, pageSize!.Value, ct);

        var data = paged.Data.Select(i => new ImageResponseDto(
            i.MaAnh,
            i.UrlAnh,
            i.AltText,
            i.MaNhanNavigation?.TenNhan ?? string.Empty,
            i.MaNhanNavigation?.MaNhan ?? string.Empty,
            i.NgayTao!.Value)).ToList();

        return ApiResponse.Success("Lấy ảnh theo nhãn thành công",
            new PagedResultDto<ImageResponseDto>(
                paged.TotalCount,
                paged.Page,
                paged.PageSize,
                paged.TotalPages,
                data));
    }

    /* ---------- 4.4 Cập nhật 1 ảnh ---------- */
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(
        string id,
        [FromBody] ImageUpdateDto dto,
        CancellationToken ct)
    {
        var img = await _ctx.NguonAnhs
            .FirstOrDefaultAsync(i => i.MaAnh == id && i.IsDelete == false, ct);

        if (img == null) return ApiResponse.Error("Không tìm thấy ảnh!");

        img.AltText = dto.AltText;
        img.MaNhan = dto.MaNhan;
        img.IsActive = dto.IsActive;
        img.NgayCapNhat = DateTime.UtcNow;

        await _ctx.SaveChangesAsync(ct);

        return ApiResponse.Success("Cập nhập ảnh thảnh công", img);
    }

    [HttpDelete("batch")]
    public async Task<IActionResult> DeleteMany(
    [FromBody] List<string> ids,
    CancellationToken ct)
    {
        if (ids == null || ids.Count == 0)
            return ApiResponse.Error("Danh sách rỗng");

        var images = await _ctx.NguonAnhs
            .Where(i => ids.Contains(i.MaAnh))
            .ToListAsync(ct);

        var result = new
        {
            Deleted = new List<string>(),
            Skipped = new List<string>()
        };

        foreach (var img in images)
        {
            var hasRef = await _ctx.AnhDiaDiems.AnyAsync(a => a.MaAnh == img.MaAnh, ct) ||
                         await _ctx.AnhDichVus.AnyAsync(a => a.MaAnh == img.MaAnh, ct) ||
                         await _ctx.AnhNhaCungCaps.AnyAsync(a => a.MaAnh == img.MaAnh, ct) ||
                         await _ctx.AnhVaccines.AnyAsync(a => a.MaAnh == img.MaAnh, ct);

            if (hasRef)
            {
                result.Skipped.Add(img.MaAnh);
            }
            else
            {
                result.Deleted.Add(img.MaAnh);
                _ctx.NguonAnhs.Remove(img);
            }
        }

        await _ctx.SaveChangesAsync(ct);

        return ApiResponse.Success("Xóa ảnh thành công", result);
    }


}