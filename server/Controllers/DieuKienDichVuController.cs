using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.DTOs.DichVu;
using server.DTOs.Pagination;
using server.Helpers;
using server.Models;
using server.Filters;

namespace server.Controllers;

[ApiController]
[Route("api/service-conditions")]
public class DieuKienDichVuController : ControllerBase
{
    private readonly HeThongQuanLyTiemChungContext _ctx;
    private readonly ILogger<DieuKienDichVuController> _logger;

    public DieuKienDichVuController(HeThongQuanLyTiemChungContext ctx, ILogger<DieuKienDichVuController> logger)
    {
        _ctx = ctx;
        _logger = logger;
    }

    /* ---------- 1. Lấy tất cả điều kiện dịch vụ (có phân trang) ---------- */
    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] int? page = 1,
        [FromQuery] int? pageSize = 20,
        CancellationToken ct = default)
    {
        try
        {
            var query = _ctx.DieuKienDichVus
                .Include(d => d.MaDichVuNavigation)
                .OrderBy(d => d.MaDichVuNavigation.Ten)
                .ThenBy(d => d.TuoiThangToiThieu);

            var paged = await query.ToPagedAsync(page!.Value, pageSize!.Value, ct);

            var data = paged.Data.Select(d => new ServiceConditionDto(
                d.MaDieuKien,
                d.TuoiThangToiThieu,
                d.TuoiThangToiDa,
                d.GioiTinh,
                d.GhiChu,
                d.MaDichVu,
                d.MaDichVuNavigation?.Ten
            )).ToList();

            return ApiResponse.Success(
                "Lấy danh sách điều kiện dịch vụ thành công",
                new PagedResultDto<ServiceConditionDto>(
                    paged.TotalCount,
                    paged.Page,
                    paged.PageSize,
                    paged.TotalPages,
                    data));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi lấy danh sách điều kiện dịch vụ");
            return ApiResponse.Error("Có lỗi xảy ra khi lấy danh sách điều kiện dịch vụ", 500);
        }
    }

    /* ---------- 2. Lấy điều kiện theo ID ---------- */
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id, CancellationToken ct)
    {
        try
        {
            var condition = await _ctx.DieuKienDichVus
                .Include(d => d.MaDichVuNavigation)
                .FirstOrDefaultAsync(d => d.MaDieuKien == id, ct);

            if (condition == null)
                return ApiResponse.Error("Không tìm thấy điều kiện dịch vụ", 404);

            var dto = new ServiceConditionDto(
                condition.MaDieuKien,
                condition.TuoiThangToiThieu,
                condition.TuoiThangToiDa,
                condition.GioiTinh,
                condition.GhiChu,
                condition.MaDichVu,
                condition.MaDichVuNavigation?.Ten
            );

            return ApiResponse.Success("Lấy thông tin điều kiện dịch vụ thành công", dto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi lấy thông tin điều kiện dịch vụ {Id}", id);
            return ApiResponse.Error("Có lỗi xảy ra khi lấy thông tin điều kiện dịch vụ", 500);
        }
    }

    /* ---------- 3. Lấy điều kiện theo dịch vụ ---------- */
    [HttpGet("by-service/{serviceId}")]
    public async Task<IActionResult> GetByService(string serviceId, CancellationToken ct)
    {
        try
        {
            // Kiểm tra dịch vụ tồn tại
            if (!await _ctx.DichVus.AnyAsync(d => d.MaDichVu == serviceId && d.IsDelete == false, ct))
                return ApiResponse.Error("Dịch vụ không tồn tại", 404);

            var conditions = await _ctx.DieuKienDichVus
                .Where(d => d.MaDichVu == serviceId)
                .OrderBy(d => d.TuoiThangToiThieu)
                .Select(d => new ServiceConditionDto(
                    d.MaDieuKien,
                    d.TuoiThangToiThieu,
                    d.TuoiThangToiDa,
                    d.GioiTinh,
                    d.GhiChu,
                    d.MaDichVu,
                    null // Không cần tên dịch vụ vì đã biết serviceId
                ))
                .ToListAsync(ct);

            return ApiResponse.Success("Lấy điều kiện dịch vụ thành công", conditions);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi lấy điều kiện dịch vụ cho service {ServiceId}", serviceId);
            return ApiResponse.Error("Có lỗi xảy ra khi lấy điều kiện dịch vụ", 500);
        }
    }

    /* ---------- 4. Tạo điều kiện mới ---------- */
    [HttpPost]
    [ConfigAuthorize]
    public async Task<IActionResult> Create(
        [FromBody] ServiceConditionCreateDto dto,
        CancellationToken ct)
    {
        try
        {
            // Kiểm tra dịch vụ tồn tại
            if (!await _ctx.DichVus.AnyAsync(d => d.MaDichVu == dto.ServiceId && d.IsDelete == false, ct))
                return ApiResponse.Error("Dịch vụ không tồn tại", 404);

            // Kiểm tra điều kiện trùng lặp
            var existingCondition = await _ctx.DieuKienDichVus
                .FirstOrDefaultAsync(d => 
                    d.MaDichVu == dto.ServiceId &&
                    d.TuoiThangToiThieu == dto.MinAgeInMonths &&
                    d.TuoiThangToiDa == dto.MaxAgeInMonths &&
                    d.GioiTinh == dto.Gender, ct);

            if (existingCondition != null)
                return ApiResponse.Error("Điều kiện dịch vụ đã tồn tại", 409);

            var condition = new DieuKienDichVu
            {
                MaDieuKien = Guid.NewGuid().ToString("N"),
                MaDichVu = dto.ServiceId,
                TuoiThangToiThieu = dto.MinAgeInMonths,
                TuoiThangToiDa = dto.MaxAgeInMonths,
                GioiTinh = dto.Gender,
                GhiChu = dto.Note
            };

            _ctx.DieuKienDichVus.Add(condition);
            await _ctx.SaveChangesAsync(ct);

            return ApiResponse.Success("Tạo điều kiện dịch vụ thành công", 
                new { Id = condition.MaDieuKien }, 201);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi tạo điều kiện dịch vụ");
            return ApiResponse.Error("Có lỗi xảy ra khi tạo điều kiện dịch vụ", 500);
        }
    }

    /* ---------- 5. Tạo nhiều điều kiện cùng lúc cho một dịch vụ ---------- */
    [HttpPost("batch")]
    [ConfigAuthorize]
    public async Task<IActionResult> CreateBatch(
        [FromBody] ServiceConditionBatchCreateDto dto,
        CancellationToken ct)
    {
        try
        {
            // Kiểm tra dịch vụ tồn tại
            if (!await _ctx.DichVus.AnyAsync(d => d.MaDichVu == dto.ServiceId && d.IsDelete == false, ct))
                return ApiResponse.Error("Dịch vụ không tồn tại", 404);

            // Xóa điều kiện cũ nếu có
            var existingConditions = await _ctx.DieuKienDichVus
                .Where(d => d.MaDichVu == dto.ServiceId)
                .ToListAsync(ct);

            if (existingConditions.Any())
            {
                _ctx.DieuKienDichVus.RemoveRange(existingConditions);
            }

            // Tạo điều kiện mới
            var newConditions = dto.Conditions.Select(c => new DieuKienDichVu
            {
                MaDieuKien = Guid.NewGuid().ToString("N"),
                MaDichVu = dto.ServiceId,
                TuoiThangToiThieu = c.MinAgeInMonths,
                TuoiThangToiDa = c.MaxAgeInMonths,
                GioiTinh = c.Gender,
                GhiChu = c.Note
            }).ToList();

            _ctx.DieuKienDichVus.AddRange(newConditions);
            await _ctx.SaveChangesAsync(ct);

            return ApiResponse.Success("Tạo điều kiện dịch vụ hàng loạt thành công", 
                new { Count = newConditions.Count });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi tạo điều kiện dịch vụ hàng loạt cho service {ServiceId}", dto.ServiceId);
            return ApiResponse.Error("Có lỗi xảy ra khi tạo điều kiện dịch vụ hàng loạt", 500);
        }
    }

    /* ---------- 6. Cập nhật điều kiện ---------- */
    [HttpPut("{id}")]
    [ConfigAuthorize]
    public async Task<IActionResult> Update(
        string id,
        [FromBody] ServiceConditionUpdateDto dto,
        CancellationToken ct)
    {
        try
        {
            var condition = await _ctx.DieuKienDichVus
                .FirstOrDefaultAsync(d => d.MaDieuKien == id, ct);

            if (condition == null)
                return ApiResponse.Error("Không tìm thấy điều kiện dịch vụ", 404);

            // Kiểm tra điều kiện trùng lặp nếu thay đổi thông tin
            if (dto.MinAgeInMonths.HasValue || dto.MaxAgeInMonths.HasValue || dto.Gender != null)
            {
                var minAge = dto.MinAgeInMonths ?? condition.TuoiThangToiThieu;
                var maxAge = dto.MaxAgeInMonths ?? condition.TuoiThangToiDa;
                var gender = dto.Gender ?? condition.GioiTinh;

                var duplicateCondition = await _ctx.DieuKienDichVus
                    .FirstOrDefaultAsync(d => 
                        d.MaDieuKien != id &&
                        d.MaDichVu == condition.MaDichVu &&
                        d.TuoiThangToiThieu == minAge &&
                        d.TuoiThangToiDa == maxAge &&
                        d.GioiTinh == gender, ct);

                if (duplicateCondition != null)
                    return ApiResponse.Error("Điều kiện dịch vụ đã tồn tại", 409);
            }

            // Cập nhật thông tin
            if (dto.MinAgeInMonths.HasValue)
                condition.TuoiThangToiThieu = dto.MinAgeInMonths.Value;
            if (dto.MaxAgeInMonths.HasValue)
                condition.TuoiThangToiDa = dto.MaxAgeInMonths.Value;
            if (dto.Gender != null)
                condition.GioiTinh = dto.Gender;
            if (dto.Note != null)
                condition.GhiChu = dto.Note;

            await _ctx.SaveChangesAsync(ct);
            return ApiResponse.Success("Cập nhật điều kiện dịch vụ thành công", null);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi cập nhật điều kiện dịch vụ {Id}", id);
            return ApiResponse.Error("Có lỗi xảy ra khi cập nhật điều kiện dịch vụ", 500);
        }
    }

    /* ---------- 7. Xóa điều kiện ---------- */
    [HttpDelete("{id}")]
    [ConfigAuthorize]
    public async Task<IActionResult> Delete(string id, CancellationToken ct)
    {
        try
        {
            var condition = await _ctx.DieuKienDichVus
                .FirstOrDefaultAsync(d => d.MaDieuKien == id, ct);

            if (condition == null)
                return ApiResponse.Error("Không tìm thấy điều kiện dịch vụ", 404);

            _ctx.DieuKienDichVus.Remove(condition);
            await _ctx.SaveChangesAsync(ct);

            return ApiResponse.Success("Xóa điều kiện dịch vụ thành công", null);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi xóa điều kiện dịch vụ {Id}", id);
            return ApiResponse.Error("Có lỗi xảy ra khi xóa điều kiện dịch vụ", 500);
        }
    }

    /* ---------- 8. Kiểm tra điều kiện cho một người dùng ---------- */
    [HttpPost("check-eligibility")]
    public async Task<IActionResult> CheckEligibility(
        [FromBody] EligibilityCheckDto dto,
        CancellationToken ct)
    {
        try
        {
            // Kiểm tra dịch vụ tồn tại
            if (!await _ctx.DichVus.AnyAsync(d => d.MaDichVu == dto.ServiceId && d.IsDelete == false, ct))
                return ApiResponse.Error("Dịch vụ không tồn tại", 404);

            var conditions = await _ctx.DieuKienDichVus
                .Where(d => d.MaDichVu == dto.ServiceId)
                .ToListAsync(ct);

            if (!conditions.Any())
            {
                return ApiResponse.Success("Dịch vụ không có điều kiện đặc biệt", 
                    new { IsEligible = true, Message = "Không có điều kiện đặc biệt" });
            }

            // Kiểm tra từng điều kiện
            var eligibleConditions = new List<object>();
            var ineligibleConditions = new List<object>();

            foreach (var condition in conditions)
            {
                var isEligible = true;
                var reasons = new List<string>();

                // Kiểm tra độ tuổi
                if (condition.TuoiThangToiThieu.HasValue && dto.AgeInMonths < condition.TuoiThangToiThieu.Value)
                {
                    isEligible = false;
                    reasons.Add($"Độ tuổi tối thiểu: {condition.TuoiThangToiThieu.Value} tháng");
                }

                if (condition.TuoiThangToiDa.HasValue && dto.AgeInMonths > condition.TuoiThangToiDa.Value)
                {
                    isEligible = false;
                    reasons.Add($"Độ tuổi tối đa: {condition.TuoiThangToiDa.Value} tháng");
                }

                // Kiểm tra giới tính
                if (!string.IsNullOrEmpty(condition.GioiTinh) && 
                    !string.Equals(condition.GioiTinh, dto.Gender, StringComparison.OrdinalIgnoreCase))
                {
                    isEligible = false;
                    reasons.Add($"Giới tính yêu cầu: {condition.GioiTinh}");
                }

                var conditionResult = new
                {
                    ConditionId = condition.MaDieuKien,
                    IsEligible = isEligible,
                    Reasons = reasons,
                    Note = condition.GhiChu
                };

                if (isEligible)
                    eligibleConditions.Add(conditionResult);
                else
                    ineligibleConditions.Add(conditionResult);
            }

            var overallEligible = ineligibleConditions.Count == 0;
            var message = overallEligible 
                ? "Đáp ứng tất cả điều kiện" 
                : "Không đáp ứng một số điều kiện";

            return ApiResponse.Success("Kiểm tra điều kiện thành công", new
            {
                IsEligible = overallEligible,
                Message = message,
                EligibleConditions = eligibleConditions,
                IneligibleConditions = ineligibleConditions
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi kiểm tra điều kiện cho service {ServiceId}", dto.ServiceId);
            return ApiResponse.Error("Có lỗi xảy ra khi kiểm tra điều kiện", 500);
        }
    }
} 