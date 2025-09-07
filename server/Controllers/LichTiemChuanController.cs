using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.DTOs.Vaccine;
using server.DTOs.Pagination;
using server.Helpers;
using server.Models;
using server.Filters;

namespace server.Controllers;

[ApiController]
[Route("api/vaccine-schedules")]
public class LichTiemChuanController : ControllerBase
{
    private readonly HeThongQuanLyTiemChungContext _ctx;
    private readonly ILogger<LichTiemChuanController> _logger;

    public LichTiemChuanController(HeThongQuanLyTiemChungContext ctx, ILogger<LichTiemChuanController> logger)
    {
        _ctx = ctx;
        _logger = logger;
    }

    /* ---------- 1. Lấy tất cả lịch tiêm chuẩn (có phân trang) ---------- */
    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] int? page = 1,
        [FromQuery] int? pageSize = 20,
        CancellationToken ct = default)
    {
        try
        {
            var query = _ctx.LichTiemChuans
                .Include(l => l.MaVaccineNavigation)
                .Where(l => l.IsDelete != true)
                .OrderBy(l => l.TuoiThangToiThieu ?? 0)
                .ThenBy(l => l.MaVaccine)
                .ThenBy(l => l.MuiThu);

            var paged = await query.ToPagedAsync(page!.Value, pageSize!.Value, ct);

            var data = paged.Data.Select(l => new LichTiemChuanDto(
                l.MaLichTiemChuan,
                l.MaVaccine,
                l.MaVaccineNavigation.Ten,
                l.MuiThu,
                l.TuoiThangToiThieu,
                l.TuoiThangToiDa,
                l.SoNgaySauMuiTruoc,
                l.GhiChu,
                l.IsActive ?? true,
                l.NgayTao
            )).ToList();

            return ApiResponse.Success(
                "Lấy danh sách lịch tiêm chuẩn thành công",
                new PagedResultDto<LichTiemChuanDto>(
                    paged.TotalCount,
                    paged.Page,
                    paged.PageSize,
                    paged.TotalPages,
                    data));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi lấy danh sách lịch tiêm chuẩn");
            return ApiResponse.Error("Lỗi khi lấy danh sách lịch tiêm chuẩn", 500);
        }
    }

    /* ---------- 2. Lấy lịch tiêm chuẩn theo ID ---------- */
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id, CancellationToken ct)
    {
        try
        {
            var lichTiemChuan = await _ctx.LichTiemChuans
                .Include(l => l.MaVaccineNavigation)
                .FirstOrDefaultAsync(l => l.MaLichTiemChuan == id && l.IsDelete != true, ct);

            if (lichTiemChuan == null)
                return ApiResponse.Error("Không tìm thấy lịch tiêm chuẩn", 404);

            var dto = new LichTiemChuanDto(
                lichTiemChuan.MaLichTiemChuan,
                lichTiemChuan.MaVaccine,
                lichTiemChuan.MaVaccineNavigation.Ten,
                lichTiemChuan.MuiThu,
                lichTiemChuan.TuoiThangToiThieu,
                lichTiemChuan.TuoiThangToiDa,
                lichTiemChuan.SoNgaySauMuiTruoc,
                lichTiemChuan.GhiChu,
                lichTiemChuan.IsActive ?? true,
                lichTiemChuan.NgayTao
            );

            return ApiResponse.Success("Lấy lịch tiêm chuẩn thành công", dto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi lấy lịch tiêm chuẩn theo ID: {Id}", id);
            return ApiResponse.Error("Lỗi khi lấy lịch tiêm chuẩn", 500);
        }
    }

    /* ---------- 3. Lấy lịch tiêm chuẩn theo vaccine ---------- */
    [HttpGet("by-vaccine/{vaccineId}")]
    public async Task<IActionResult> GetByVaccine(
        string vaccineId, 
        [FromQuery] int? minAgeInMonths = null,
        CancellationToken ct = default)
    {
        try
        {
            var vaccine = await _ctx.Vaccines
                .Include(v => v.LichTiemChuans.Where(l => l.IsDelete != true))
                .FirstOrDefaultAsync(v => v.MaVaccine == vaccineId && v.IsDelete != true, ct);

            if (vaccine == null)
                return ApiResponse.Error("Không tìm thấy vaccine");

            var query = vaccine.LichTiemChuans.AsQueryable();

            // Nếu có tham số độ tuổi tối thiểu, lọc theo điều kiện
            if (minAgeInMonths.HasValue)
            {
                query = query.Where(l => l.TuoiThangToiThieu >= minAgeInMonths.Value);
            }

            var lichTiemChuans = query
                .OrderBy(l => l.TuoiThangToiThieu ?? 0)
                .ThenBy(l => l.MuiThu)
                .Select(l => new LichTiemChuanDto(
                    l.MaLichTiemChuan,
                    l.MaVaccine,
                    vaccine.Ten,
                    l.MuiThu,
                    l.TuoiThangToiThieu,
                    l.TuoiThangToiDa,
                    l.SoNgaySauMuiTruoc,
                    l.GhiChu,
                    l.IsActive ?? true,
                    l.NgayTao
                )).ToList();

            var result = new LichTiemChuanByVaccineDto(
                vaccine.MaVaccine,
                vaccine.Ten,
                lichTiemChuans
            );

            return ApiResponse.Success("Lấy lịch tiêm chuẩn theo vaccine thành công", result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi lấy lịch tiêm chuẩn theo vaccine: {VaccineId}", vaccineId);
            return ApiResponse.Error("Lỗi khi lấy lịch tiêm chuẩn theo vaccine", 500);
        }
    }

    /* ---------- 4. Tạo lịch tiêm chuẩn mới ---------- */
    [HttpPost]
    [ConfigAuthorize]
    public async Task<IActionResult> Create([FromBody] LichTiemChuanCreateDto dto, CancellationToken ct)
    {
        try
        {
            // Kiểm tra vaccine tồn tại
            if (!await _ctx.Vaccines.AnyAsync(v => v.MaVaccine == dto.MaVaccine && v.IsDelete != true, ct))
                return ApiResponse.Error("Vaccine không tồn tại", 404);


            var lichTiemChuan = new LichTiemChuan
            {
                MaLichTiemChuan = Guid.NewGuid().ToString("N"),
                MaVaccine = dto.MaVaccine,
                MuiThu = dto.MuiThu,
                TuoiThangToiThieu = dto.TuoiThangToiThieu,
                TuoiThangToiDa = dto.TuoiThangToiDa,
                SoNgaySauMuiTruoc = dto.SoNgaySauMuiTruoc,
                GhiChu = dto.GhiChu,
                IsActive = true,
                IsDelete = false,
                NgayTao = DateTime.UtcNow
            };

            _ctx.LichTiemChuans.Add(lichTiemChuan);
            await _ctx.SaveChangesAsync(ct);

            return ApiResponse.Success("Tạo lịch tiêm chuẩn thành công", 
                new { Id = lichTiemChuan.MaLichTiemChuan }, 201);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi tạo lịch tiêm chuẩn");
            return ApiResponse.Error("Lỗi khi tạo lịch tiêm chuẩn", 500);
        }
    }

    /* ---------- 5. Tạo nhiều lịch tiêm chuẩn cùng lúc ---------- */
    [HttpPost("batch")]
    [ConfigAuthorize]
    public async Task<IActionResult> CreateBatch([FromBody] LichTiemChuanBatchCreateDto dto, CancellationToken ct)
    {
        try
        {
            // Kiểm tra vaccine tồn tại
            if (!await _ctx.Vaccines.AnyAsync(v => v.MaVaccine == dto.MaVaccine && v.IsDelete != true, ct))
                return ApiResponse.Error("Vaccine không tồn tại", 404);

            var existingMuiThu = await _ctx.LichTiemChuans
                .Where(l => l.MaVaccine == dto.MaVaccine && l.IsDelete != true)
                .Select(l => l.MuiThu)
                .ToListAsync(ct);

            var duplicateMuiThu = dto.LichTiemChuans
                .Where(l => existingMuiThu.Contains(l.MuiThu))
                .Select(l => l.MuiThu)
                .ToList();

            if (duplicateMuiThu.Any())
                return ApiResponse.Error($"Các số mũi tiêm sau đã tồn tại: {string.Join(", ", duplicateMuiThu)}", 409);

            var lichTiemChuans = dto.LichTiemChuans.Select(l => new LichTiemChuan
            {
                MaLichTiemChuan = Guid.NewGuid().ToString("N"),
                MaVaccine = dto.MaVaccine,
                MuiThu = l.MuiThu,
                TuoiThangToiThieu = l.TuoiThangToiThieu,
                TuoiThangToiDa = l.TuoiThangToiDa,
                SoNgaySauMuiTruoc = l.SoNgaySauMuiTruoc,
                GhiChu = l.GhiChu,
                IsActive = true,
                IsDelete = false,
                NgayTao = DateTime.UtcNow
            }).ToList();

            _ctx.LichTiemChuans.AddRange(lichTiemChuans);
            await _ctx.SaveChangesAsync(ct);

            return ApiResponse.Success("Tạo lịch tiêm chuẩn hàng loạt thành công", 
                new { Count = lichTiemChuans.Count }, 201);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi tạo lịch tiêm chuẩn hàng loạt");
            return ApiResponse.Error("Lỗi khi tạo lịch tiêm chuẩn hàng loạt", 500);
        }
    }

    /* ---------- 6. Cập nhật lịch tiêm chuẩn ---------- */
    [HttpPut("{id}")]
    [ConfigAuthorize]
    public async Task<IActionResult> Update(string id, [FromBody] LichTiemChuanUpdateDto dto, CancellationToken ct)
    {
        try
        {
            var lichTiemChuan = await _ctx.LichTiemChuans
                .FirstOrDefaultAsync(l => l.MaLichTiemChuan == id && l.IsDelete != true, ct);

            if (lichTiemChuan == null)
                return ApiResponse.Error("Không tìm thấy lịch tiêm chuẩn", 404);


            // Cập nhật các trường
            if (dto.MuiThu.HasValue) lichTiemChuan.MuiThu = dto.MuiThu.Value;
            if (dto.TuoiThangToiThieu.HasValue) lichTiemChuan.TuoiThangToiThieu = dto.TuoiThangToiThieu.Value;
            if (dto.TuoiThangToiDa.HasValue) lichTiemChuan.TuoiThangToiDa = dto.TuoiThangToiDa.Value;
            if (dto.SoNgaySauMuiTruoc.HasValue) lichTiemChuan.SoNgaySauMuiTruoc = dto.SoNgaySauMuiTruoc.Value;
            if (dto.GhiChu != null) lichTiemChuan.GhiChu = dto.GhiChu;
            if (dto.IsActive.HasValue) lichTiemChuan.IsActive = dto.IsActive.Value;

            lichTiemChuan.NgayCapNhat = DateTime.UtcNow;

            await _ctx.SaveChangesAsync(ct);

            return ApiResponse.Success("Cập nhật lịch tiêm chuẩn thành công", null);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi cập nhật lịch tiêm chuẩn: {Id}", id);
            return ApiResponse.Error("Lỗi khi cập nhật lịch tiêm chuẩn", 500);
        }
    }

    /* ---------- 7. Xóa lịch tiêm chuẩn ---------- */
    [HttpDelete("{id}")]
    [ConfigAuthorize]
    public async Task<IActionResult> Delete(string id, CancellationToken ct)
    {
        try
        {
            var lichTiemChuan = await _ctx.LichTiemChuans
                .FirstOrDefaultAsync(l => l.MaLichTiemChuan == id && l.IsDelete != true, ct);

            if (lichTiemChuan == null)
                return ApiResponse.Error("Không tìm thấy lịch tiêm chuẩn", 404);

            // Soft delete
            lichTiemChuan.IsDelete = true;
            lichTiemChuan.NgayCapNhat = DateTime.UtcNow;

            await _ctx.SaveChangesAsync(ct);

            return ApiResponse.Success("Xóa lịch tiêm chuẩn thành công", null);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi xóa lịch tiêm chuẩn: {Id}", id);
            return ApiResponse.Error("Lỗi khi xóa lịch tiêm chuẩn", 500);
        }
    }

    /* ---------- 8. Lấy lịch tiêm chuẩn theo độ tuổi và vaccine ---------- */
    [HttpGet("by-age-and-vaccine")]
    public async Task<IActionResult> GetByAgeAndVaccine(
        [FromQuery] string vaccineId,
        [FromQuery] int ageInMonths,
        CancellationToken ct)
    {
        try
        {
            var lichTiemChuans = await _ctx.LichTiemChuans
                .Include(l => l.MaVaccineNavigation)
                .Where(l => l.MaVaccine == vaccineId && 
                           l.IsDelete != true && 
                           l.IsActive == true &&
                           (l.TuoiThangToiThieu == null || ageInMonths >= l.TuoiThangToiThieu) &&
                           (l.TuoiThangToiDa == null || ageInMonths <= l.TuoiThangToiDa))
                .OrderBy(l => l.TuoiThangToiThieu ?? 0)
                .ThenBy(l => l.MuiThu)
                .Select(l => new LichTiemChuanDto(
                    l.MaLichTiemChuan,
                    l.MaVaccine,
                    l.MaVaccineNavigation.Ten,
                    l.MuiThu,
                    l.TuoiThangToiThieu,
                    l.TuoiThangToiDa,
                    l.SoNgaySauMuiTruoc,
                    l.GhiChu,
                    l.IsActive ?? true,
                    l.NgayTao
                ))
                .ToListAsync(ct);

            return ApiResponse.Success("Lấy lịch tiêm chuẩn theo độ tuổi và vaccine thành công", lichTiemChuans);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi lấy lịch tiêm chuẩn theo độ tuổi và vaccine");
            return ApiResponse.Error("Lỗi khi lấy lịch tiêm chuẩn theo độ tuổi và vaccine", 500);
        }
    }
} 