using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Models;
using server.DTOs;
using server.Helpers;
using server.DTOs.Pagination;

namespace server.Controllers;

[ApiController]
[Route("api/lich-hen")]
public class LichHenController : ControllerBase
{
    private readonly HeThongQuanLyTiemChungContext _context;
    private readonly ILogger<LichHenController> _logger;

    public LichHenController(HeThongQuanLyTiemChungContext context, ILogger<LichHenController> logger)
    {
        _context = context;
        _logger = logger;
    }

    /* ---------- 1. Lấy danh sách lịch hẹn (có phân trang) ---------- */
    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] int? page = 1,
        [FromQuery] int? pageSize = 20,
        [FromQuery] string? orderId = null,
        [FromQuery] string? locationId = null,
        [FromQuery] string? status = null,
        [FromQuery] DateTime? fromDate = null,
        [FromQuery] DateTime? toDate = null,
        [FromQuery] string? userId = null,
        CancellationToken ct = default)
    {
        try
        {
            var query = _context.LichHens
                .Include(lh => lh.MaDonHangNavigation)
                .ThenInclude(dh => dh.MaNguoiDungNavigation)
                .Include(lh => lh.MaDiaDiemNavigation)
                .Where(lh => lh.IsDelete != true);

            // Filter by order
            if (!string.IsNullOrEmpty(orderId))
            {
                query = query.Where(lh => lh.MaDonHang == orderId);
            }

            // Filter by location
            if (!string.IsNullOrEmpty(locationId))
            {
                query = query.Where(lh => lh.MaDiaDiem == locationId);
            }

            // Filter by status
            if (!string.IsNullOrEmpty(status))
            {
                query = query.Where(lh => lh.TrangThai == status);
            }

            // Filter by date range
            if (fromDate.HasValue)
            {
                query = query.Where(lh => lh.NgayHen >= fromDate.Value);
            }

            if (toDate.HasValue)
            {
                query = query.Where(lh => lh.NgayHen <= toDate.Value);
            }

            // Filter by user ID
            if (!string.IsNullOrEmpty(userId))
            {
                query = query.Where(lh => lh.MaDonHangNavigation.MaNguoiDung == userId);
            }

            query = query.OrderBy(lh => lh.NgayHen);

            var paged = await query.ToPagedAsync(page!.Value, pageSize!.Value, ct);

            var data = paged.Data.Select(lh => new
            {
                lh.MaLichHen,
                lh.MaDonHang,
                CustomerName = lh.MaDonHangNavigation?.MaNguoiDungNavigation?.Ten,
                lh.MaDiaDiem,
                LocationName = lh.MaDiaDiemNavigation?.Ten,
                lh.NgayHen,
                lh.TrangThai,
                lh.GhiChu,
                lh.NgayTao
            }).ToList();

            return ApiResponse.Success(
                "Lấy danh sách lịch hẹn thành công",
                new
                {
                    Data = data,
                    TotalCount = paged.TotalCount,
                    Page = paged.Page,
                    PageSize = paged.PageSize,
                    TotalPages = paged.TotalPages
                }
            );
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi lấy danh sách lịch hẹn");
            return ApiResponse.Error("Lỗi server khi lấy danh sách lịch hẹn");
        }
    }

    /* ---------- 2. Lấy lịch hẹn theo ID ---------- */
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id, CancellationToken ct = default)
    {
        try
        {
            var lichHen = await _context.LichHens
                .Include(lh => lh.MaDonHangNavigation)
                .ThenInclude(dh => dh.MaNguoiDungNavigation)
                .Include(lh => lh.MaDiaDiemNavigation)
                .FirstOrDefaultAsync(lh => lh.MaLichHen == id, ct);

            if (lichHen == null)
            {
                return ApiResponse.Error("Không tìm thấy lịch hẹn");
            }

            var result = new
            {
                lichHen.MaLichHen,
                lichHen.MaDonHang,
                CustomerName = lichHen.MaDonHangNavigation?.MaNguoiDungNavigation?.Ten,
                CustomerPhone = lichHen.MaDonHangNavigation?.MaNguoiDungNavigation?.SoDienThoai,
                lichHen.MaDiaDiem,
                LocationName = lichHen.MaDiaDiemNavigation?.Ten,
                LocationAddress = lichHen.MaDiaDiemNavigation?.DiaChi,
                lichHen.NgayHen,
                lichHen.TrangThai,
                lichHen.GhiChu,
                lichHen.NgayTao
            };

            return ApiResponse.Success("Lấy thông tin lịch hẹn thành công", result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi lấy thông tin lịch hẹn");
            return ApiResponse.Error("Lỗi server khi lấy thông tin lịch hẹn");
        }
    }

    /* ---------- 3. Cập nhật trạng thái lịch hẹn ---------- */
    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateStatus(string id, [FromBody] UpdateLichHenStatusDto dto, CancellationToken ct = default)
    {
        try
        {
            var lichHen = await _context.LichHens.FindAsync(id);
            if (lichHen == null)
            {
                return ApiResponse.Error("Không tìm thấy lịch hẹn");
            }

            lichHen.TrangThai = dto.Status;
            lichHen.GhiChu = dto.Note;
            lichHen.NgayCapNhat = DateTime.UtcNow;

            _context.LichHens.Update(lichHen);
            await _context.SaveChangesAsync(ct);

            return ApiResponse.Success($"Cập nhật trạng thái lịch hẹn thành công - Trạng thái: {dto.Status}");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi cập nhật trạng thái lịch hẹn");
            return ApiResponse.Error("Lỗi server khi cập nhật trạng thái lịch hẹn");
        }
    }

    /* ---------- 4. Lấy lịch hẹn theo đơn hàng ---------- */
    [HttpGet("by-order/{orderId}")]
    public async Task<IActionResult> GetByOrder(string orderId, CancellationToken ct = default)
    {
        try
        {
            var lichHens = await _context.LichHens
                .Include(lh => lh.MaDiaDiemNavigation)
                .Where(lh => lh.MaDonHang == orderId && lh.IsDelete != true)
                .OrderBy(lh => lh.NgayHen)
                .ToListAsync(ct);

            var result = lichHens.Select(lh => new
            {
                lh.MaLichHen,
                lh.MaDiaDiem,
                LocationName = lh.MaDiaDiemNavigation?.Ten,
                lh.NgayHen,
                lh.TrangThai,
                lh.GhiChu,
                lh.NgayTao
            }).ToList();

            return ApiResponse.Success("Lấy lịch hẹn theo đơn hàng thành công", result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi lấy lịch hẹn theo đơn hàng");
            return ApiResponse.Error("Lỗi server khi lấy lịch hẹn theo đơn hàng");
        }
    }

    /* ---------- 5. Lấy lịch hẹn theo địa điểm và ngày ---------- */
    [HttpGet("by-location-date")]
    public async Task<IActionResult> GetByLocationAndDate(
        [FromQuery] string locationId,
        [FromQuery] DateTime date,
        CancellationToken ct = default)
    {
        try
        {
            var lichHens = await _context.LichHens
                .Include(lh => lh.MaDonHangNavigation)
                .ThenInclude(dh => dh.MaNguoiDungNavigation)
                .Where(lh => lh.MaDiaDiem == locationId 
                           && lh.NgayHen.Date == date.Date 
                           && lh.IsDelete != true)
                .OrderBy(lh => lh.NgayHen)
                .ToListAsync(ct);

            var result = lichHens.Select(lh => new
            {
                lh.MaLichHen,
                lh.MaDonHang,
                CustomerName = lh.MaDonHangNavigation?.MaNguoiDungNavigation?.Ten,
                CustomerPhone = lh.MaDonHangNavigation?.MaNguoiDungNavigation?.SoDienThoai,
                lh.NgayHen,
                lh.TrangThai,
                lh.GhiChu
            }).ToList();

            return ApiResponse.Success("Lấy lịch hẹn theo địa điểm và ngày thành công", result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi lấy lịch hẹn theo địa điểm và ngày");
            return ApiResponse.Error("Lỗi server khi lấy lịch hẹn theo địa điểm và ngày");
        }
    }

    /* ---------- 6. Tạo lịch hẹn mới ---------- */
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateLichHenDto dto, CancellationToken ct = default)
    {
        try
        {
            var lichHen = new LichHen
            {
                MaLichHen = Guid.NewGuid().ToString("N"),
                MaDonHang = dto.OrderId,
                MaDiaDiem = dto.LocationId,
                NgayHen = dto.AppointmentDate,
                TrangThai = "SCHEDULED",
                GhiChu = dto.Note,
                IsActive = true,
                IsDelete = false,
                NgayTao = DateTime.UtcNow,
                NgayCapNhat = DateTime.UtcNow
            };

            _context.LichHens.Add(lichHen);
            await _context.SaveChangesAsync(ct);

            return ApiResponse.Success("Tạo lịch hẹn thành công", lichHen.MaLichHen);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi tạo lịch hẹn");
            return ApiResponse.Error("Lỗi server khi tạo lịch hẹn");
        }
    }

    /* ---------- 6. Cập nhật trạng thái lịch hẹn theo đơn hàng ---------- */
    [HttpPut("update-status-by-order")]
    public async Task<IActionResult> UpdateStatusByOrder([FromBody] UpdateLichHenStatusByOrderDto dto, CancellationToken ct = default)
    {
        try
        {
            // Lấy tất cả lịch hẹn của đơn hàng có trạng thái NOTIFICATION
            var lichHens = await _context.LichHens
                .Where(lh => lh.MaDonHang == dto.OrderId && lh.TrangThai == "NOTIFICATION")
                .ToListAsync(ct);

            if (!lichHens.Any())
            {
                return ApiResponse.Error("Không tìm thấy lịch hẹn NOTIFICATION cho đơn hàng này");
            }

            // Cập nhật trạng thái cho tất cả lịch hẹn
            foreach (var lichHen in lichHens)
            {
                lichHen.TrangThai = dto.Status;
                lichHen.NgayCapNhat = DateTime.UtcNow;
            }

            _context.LichHens.UpdateRange(lichHens);
            await _context.SaveChangesAsync(ct);

            return ApiResponse.Success($"Cập nhật trạng thái {lichHens.Count} lịch hẹn thành công - Trạng thái: {dto.Status}");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi cập nhật trạng thái lịch hẹn theo đơn hàng");
            return ApiResponse.Error("Lỗi server khi cập nhật trạng thái lịch hẹn");
        }
    }

    /* ---------- 7. Xóa lịch hẹn ---------- */
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id, CancellationToken ct = default)
    {
        try
        {
            var lichHen = await _context.LichHens.FindAsync(id);
            if (lichHen == null)
            {
                return ApiResponse.Error("Không tìm thấy lịch hẹn");
            }

            lichHen.IsDelete = true;
            lichHen.NgayCapNhat = DateTime.UtcNow;

            _context.LichHens.Update(lichHen);
            await _context.SaveChangesAsync(ct);

            return ApiResponse.Success("Xóa lịch hẹn thành công");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi xóa lịch hẹn");
            return ApiResponse.Error("Lỗi server khi xóa lịch hẹn");
        }
    }
}

// DTOs
public class UpdateLichHenStatusDto
{
    public string Status { get; set; } = null!; // SCHEDULED, CONFIRMED, COMPLETED, CANCELLED, NO_SHOW
    public string? Note { get; set; }
}

public class CreateLichHenDto
{
    public string OrderId { get; set; } = null!;
    public string LocationId { get; set; } = null!;
    public DateTime AppointmentDate { get; set; }
    public string? Note { get; set; }
}

public class UpdateLichHenStatusByOrderDto
{
    public string OrderId { get; set; } = null!;
    public string Status { get; set; } = null!; // NOTIFICATION, COMPLETED, MISSED, CANCELLED
    public string? Note { get; set; }
}