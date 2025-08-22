 using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.DTOs.DichVu;
using server.DTOs.Pagination;
using server.Helpers;
using server.Models;

namespace server.Controllers;

[ApiController]
[Route("api/service-types")]
public class LoaiDichVuController : ControllerBase
{
    private readonly HeThongQuanLyTiemChungContext _ctx;

    public LoaiDichVuController(HeThongQuanLyTiemChungContext ctx) => _ctx = ctx;

    /* ---------- 1. Tất cả loại dịch vụ (paging) ---------- */
    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] int? page = 1,
        [FromQuery] int? pageSize = 20,
        CancellationToken ct = default)
    {
        var query = _ctx.LoaiDichVus
                        .Where(l => l.IsDelete == false)
                        .OrderByDescending(l => l.NgayTao);

        var paged = await query.ToPagedAsync(page!.Value, pageSize!.Value, ct);

        var data = paged.Data.Select(l => new ServiceTypeDto(
            l.MaLoaiDichVu,
            l.TenLoai ?? string.Empty,
            l.NgayTao!.Value)).ToList();

        return ApiResponse.Success(
            "Lấy danh sách loại dịch vụ thành công",
            new PagedResultDto<ServiceTypeDto>(
                paged.TotalCount,
                paged.Page,
                paged.PageSize,
                paged.TotalPages,
                data));
    }
    [HttpGet("print")]
    public async Task<IActionResult> PrintAws()
    {
        return ApiResponse.Success(
            "Xin chào bạn");
    }

    /* ---------- 2. Theo ID ---------- */
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id, CancellationToken ct)
    {
        var serviceType = await _ctx.LoaiDichVus
            .Include(l => l.DichVus.Where(d => d.IsDelete == false))
            .FirstOrDefaultAsync(l => l.MaLoaiDichVu == id && l.IsDelete == false, ct);

        if (serviceType == null)
            return ApiResponse.Error("Không tìm thấy loại dịch vụ", 404);

        var dto = new ServiceTypeDetailDto(
            serviceType.MaLoaiDichVu,
            serviceType.TenLoai ?? string.Empty,
            serviceType.NgayTao!.Value,
            serviceType.DichVus
                .Select(d => new ServiceBasicDto(
                    d.MaDichVu,
                    d.Ten,
                    d.MoTa,
                    d.Gia))
                .ToList());

        return ApiResponse.Success("Chi tiết loại dịch vụ", dto);
    }

    /* ---------- 3. Tạo mới ---------- */
    [HttpPost]
    public async Task<IActionResult> Create(
        [FromBody] ServiceTypeCreateDto dto,
        CancellationToken ct)
    {
        if (await _ctx.LoaiDichVus
                      .AnyAsync(l => l.TenLoai == dto.Name && l.IsDelete == false, ct))
            return ApiResponse.Error("Tên loại dịch vụ đã tồn tại", 409);

        var serviceType = new LoaiDichVu
        {
            MaLoaiDichVu = Guid.NewGuid().ToString("N"),
            TenLoai = dto.Name,
            IsActive = true,
            IsDelete = false,
            NgayTao = DateTime.UtcNow
        };

        _ctx.LoaiDichVus.Add(serviceType);
        await _ctx.SaveChangesAsync(ct);

        return ApiResponse.Success("Tạo loại dịch vụ thành công",
            new { serviceType.MaLoaiDichVu }, 201);
    }

    /* ---------- 4. Cập nhật ---------- */
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(
        string id,
        [FromBody] ServiceTypeUpdateDto dto,
        CancellationToken ct)
    {
        var serviceType = await _ctx.LoaiDichVus
            .FirstOrDefaultAsync(l => l.MaLoaiDichVu == id && l.IsDelete == false, ct);
        if (serviceType == null)
            return ApiResponse.Error("Không tìm thấy loại dịch vụ", 404);

        // Kiểm tra tên loại dịch vụ đã tồn tại chưa
        if (dto.Name != null && dto.Name != serviceType.TenLoai &&
            await _ctx.LoaiDichVus.AnyAsync(l => l.TenLoai == dto.Name && l.IsDelete == false && l.MaLoaiDichVu != id, ct))
            return ApiResponse.Error("Tên loại dịch vụ đã tồn tại", 409);

        serviceType.TenLoai = dto.Name ?? serviceType.TenLoai;
        serviceType.NgayCapNhat = DateTime.UtcNow;

        await _ctx.SaveChangesAsync(ct);
        return ApiResponse.Success("Cập nhật loại dịch vụ thành công", null, 200);
    }

    /* ---------- 5. Xóa mềm ---------- */
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id, CancellationToken ct)
    {
        var serviceType = await _ctx.LoaiDichVus
            .FirstOrDefaultAsync(l => l.MaLoaiDichVu == id && l.IsDelete == false, ct);
        if (serviceType == null)
            return ApiResponse.Error("Không tìm thấy loại dịch vụ", 404);

        // Kiểm tra xem có dịch vụ nào thuộc loại này không
        if (await _ctx.DichVus.AnyAsync(d => d.MaLoaiDichVu == id && d.IsDelete == false, ct))
            return ApiResponse.Error("Không thể xóa loại dịch vụ đang được sử dụng", 400);

        serviceType.IsDelete = true;
        serviceType.NgayCapNhat = DateTime.UtcNow;
        await _ctx.SaveChangesAsync(ct);
        return ApiResponse.Success("Xóa loại dịch vụ thành công", null, 200);
    }

    /* ---------- 6. Lấy tất cả loại dịch vụ (không phân trang) ---------- */
    [HttpGet("all")]
    public async Task<IActionResult> GetAllNoPage(CancellationToken ct)
    {
        var serviceTypes = await _ctx.LoaiDichVus
            .Where(l => l.IsDelete == false)
            .OrderBy(l => l.TenLoai)
            .Select(l => new ServiceTypeDto(
                l.MaLoaiDichVu,
                l.TenLoai ?? string.Empty,
                l.NgayTao!.Value))
            .ToListAsync(ct);

        return ApiResponse.Success("Lấy danh sách loại dịch vụ thành công", serviceTypes);
    }
}