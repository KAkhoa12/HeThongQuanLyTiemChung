using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Models;
using server.Helpers;
using server.DTOs.Pagination;

namespace server.Controllers;

[ApiController]
[Route("api/statistics")]
public class StatisticsController : ControllerBase
{
    private readonly HeThongQuanLyTiemChungContext _context;
    private readonly ILogger<StatisticsController> _logger;

    public StatisticsController(HeThongQuanLyTiemChungContext context, ILogger<StatisticsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    /* ---------- 1. Thống kê doanh thu theo địa điểm ---------- */
    [HttpGet("revenue-by-location")]
    public async Task<IActionResult> GetRevenueByLocation(
        [FromQuery] DateTime? fromDate = null,
        [FromQuery] DateTime? toDate = null,
        [FromQuery] string? locationId = null,
        CancellationToken ct = default)
    {
        try
        {
            var query = _context.DonHangs
                .Include(dh => dh.MaDiaDiemYeuThichNavigation)
                .Include(dh => dh.DonHangChiTiets)
                .ThenInclude(ctdh => ctdh.MaDichVuNavigation)
                .Where(dh => dh.TrangThaiDon == "COMPLETED" || dh.TrangThaiDon == "PAID" && dh.IsDelete != true);

            // Filter by date range
            if (fromDate.HasValue)
            {
                query = query.Where(dh => dh.NgayTao >= fromDate.Value);
            }

            if (toDate.HasValue)
            {
                query = query.Where(dh => dh.NgayTao <= toDate.Value);
            }

            // Filter by location
            if (!string.IsNullOrEmpty(locationId))
            {
                query = query.Where(dh => dh.MaDiaDiemYeuThich == locationId);
            }

            var revenueData = await query
                .GroupBy(dh => new { dh.MaDiaDiemYeuThich, dh.MaDiaDiemYeuThichNavigation!.Ten })
                .Select(g => new
                {
                    LocationId = g.Key.MaDiaDiemYeuThich,
                    LocationName = g.Key.Ten,
                    TotalOrders = g.Count(),
                    TotalRevenue = g.Sum(dh => dh.TongTienThanhToan),
                    AverageOrderValue = g.Average(dh => dh.TongTienThanhToan)
                })
                .OrderByDescending(x => x.TotalRevenue)
                .ToListAsync(ct);

            return ApiResponse.Success("Lấy thống kê doanh thu theo địa điểm thành công", revenueData);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi lấy thống kê doanh thu theo địa điểm");
            return ApiResponse.Error("Lỗi server khi lấy thống kê doanh thu");
        }
    }

    /* ---------- 2. Thống kê kho tồn lô theo địa điểm ---------- */
    [HttpGet("inventory-by-location")]
    public async Task<IActionResult> GetInventoryByLocation(
        [FromQuery] string? locationId = null,
        CancellationToken ct = default)
    {
        try
        {
            var query = _context.TonKhoLos
                .Include(tkl => tkl.MaLoNavigation)
                .ThenInclude(lv => lv!.MaVaccineNavigation)
                .Include(tkl => tkl.MaDiaDiemNavigation)
                .Where(tkl => tkl.SoLuong > 0 && tkl.IsDelete != true);

            // Filter by location
            if (!string.IsNullOrEmpty(locationId))
            {
                query = query.Where(tkl => tkl.MaDiaDiem == locationId);
            }

            var inventoryData = await query
                .GroupBy(tkl => new { tkl.MaDiaDiem, tkl.MaDiaDiemNavigation!.Ten })
                .Select(g => new
                {
                    LocationId = g.Key.MaDiaDiem,
                    LocationName = g.Key.Ten,
                    TotalLots = g.Count(),
                    TotalQuantity = g.Sum(tkl => tkl.SoLuong),
                    TotalValue = g.Sum(tkl => tkl.SoLuong * tkl.MaLoNavigation!.GiaNhap),
                    ExpiredLots = g.Count(tkl => tkl.MaLoNavigation!.NgayHetHan < DateOnly.FromDateTime(DateTime.UtcNow)),
                    ExpiringSoonLots = g.Count(tkl => tkl.MaLoNavigation!.NgayHetHan <= DateOnly.FromDateTime(DateTime.UtcNow.AddDays(30)) && tkl.MaLoNavigation!.NgayHetHan > DateOnly.FromDateTime(DateTime.UtcNow))
                })
                .OrderByDescending(x => x.TotalValue)
                .ToListAsync(ct);

            return ApiResponse.Success("Lấy thống kê kho tồn lô theo địa điểm thành công", inventoryData);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi lấy thống kê kho tồn lô theo địa điểm");
            return ApiResponse.Error("Lỗi server khi lấy thống kê kho tồn lô");
        }
    }

    /* ---------- 3. Thống kê chi tiết vaccine theo địa điểm ---------- */
    [HttpGet("vaccine-details-by-location")]
    public async Task<IActionResult> GetVaccineDetailsByLocation(
        [FromQuery] string? locationId = null,
        CancellationToken ct = default)
    {
        try
        {
            var query = _context.TonKhoLos
                .Include(tkl => tkl.MaLoNavigation)
                .ThenInclude(lv => lv!.MaVaccineNavigation)
                .Include(tkl => tkl.MaDiaDiemNavigation)
                .Where(tkl => tkl.SoLuong > 0 && tkl.IsDelete != true);

            // Filter by location
            if (!string.IsNullOrEmpty(locationId))
            {
                query = query.Where(tkl => tkl.MaDiaDiem == locationId);
            }

            var vaccineDetails = await query
                .Select(tkl => new
                {
                    LocationId = tkl.MaDiaDiem,
                    LocationName = tkl.MaDiaDiemNavigation!.Ten,
                    VaccineId = tkl.MaLoNavigation!.MaVaccine,
                    VaccineName = tkl.MaLoNavigation!.MaVaccineNavigation!.Ten,
                    LotNumber = tkl.MaLoNavigation!.SoLo,
                    Quantity = tkl.SoLuong,
                    UnitPrice = tkl.MaLoNavigation!.GiaNhap,
                    TotalValue = tkl.SoLuong * tkl.MaLoNavigation!.GiaNhap,
                    ExpiryDate = tkl.MaLoNavigation!.NgayHetHan,
                    IsExpired = tkl.MaLoNavigation!.NgayHetHan < DateOnly.FromDateTime(DateTime.UtcNow),
                    IsExpiringSoon = tkl.MaLoNavigation!.NgayHetHan <= DateOnly.FromDateTime(DateTime.UtcNow.AddDays(30)) && tkl.MaLoNavigation!.NgayHetHan > DateOnly.FromDateTime(DateTime.UtcNow)
                })
                .OrderBy(x => x.LocationName)
                .ThenBy(x => x.VaccineName)
                .ThenBy(x => x.ExpiryDate)
                .ToListAsync(ct);

            return ApiResponse.Success("Lấy thống kê chi tiết vaccine theo địa điểm thành công", vaccineDetails);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi lấy thống kê chi tiết vaccine theo địa điểm");
            return ApiResponse.Error("Lỗi server khi lấy thống kê chi tiết vaccine");
        }
    }

    /* ---------- 4. Thống kê tổng quan hệ thống ---------- */
    [HttpGet("overview")]
    public async Task<IActionResult> GetOverview(
        [FromQuery] DateTime? fromDate = null,
        [FromQuery] DateTime? toDate = null,
        CancellationToken ct = default)
    {
        try
        {
            var fromDateValue = fromDate ?? DateTime.UtcNow.AddMonths(-1);
            var toDateValue = toDate ?? DateTime.UtcNow;

            // Thống kê doanh thu
            var totalRevenue = await _context.DonHangs
                .Where(dh => dh.TrangThaiDon == "COMPLETED" || dh.TrangThaiDon == "PAID" &&
                           dh.NgayTao >= fromDateValue && 
                           dh.NgayTao <= toDateValue && 
                           dh.IsDelete != true)
                .SumAsync(dh => dh.TongTienThanhToan, ct);

            var totalOrders = await _context.DonHangs
                .Where(dh => dh.TrangThaiDon == "COMPLETED" || dh.TrangThaiDon == "PAID" &&
                           dh.NgayTao >= fromDateValue && 
                           dh.NgayTao <= toDateValue && 
                           dh.IsDelete != true)
                .CountAsync(ct);

            // Thống kê kho
            var totalInventoryValue = await _context.TonKhoLos
                .Include(tkl => tkl.MaLoNavigation)
                .Where(tkl => tkl.SoLuong > 0 && tkl.IsDelete != true)
                .SumAsync(tkl => tkl.SoLuong * tkl.MaLoNavigation!.GiaNhap, ct);

            var totalLots = await _context.TonKhoLos
                .Where(tkl => tkl.SoLuong > 0 && tkl.IsDelete != true)
                .CountAsync(ct);

            // Thống kê lịch hẹn
            var totalAppointments = await _context.LichHens
                .Where(lh => lh.NgayHen >= fromDateValue && 
                           lh.NgayHen <= toDateValue && 
                           lh.IsDelete != true)
                .CountAsync(ct);

            var completedAppointments = await _context.LichHens
                .Where(lh => lh.TrangThai == "COMPLETED" && 
                           lh.NgayHen >= fromDateValue && 
                           lh.NgayHen <= toDateValue && 
                           lh.IsDelete != true)
                .CountAsync(ct);

            var result = new
            {
                Revenue = new
                {
                    TotalRevenue = totalRevenue,
                    TotalOrders = totalOrders,
                    AverageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0
                },
                Inventory = new
                {
                    TotalValue = totalInventoryValue,
                    TotalLots = totalLots
                },
                Appointments = new
                {
                    TotalAppointments = totalAppointments,
                    CompletedAppointments = completedAppointments,
                    CompletionRate = totalAppointments > 0 ? (double)completedAppointments / totalAppointments * 100 : 0
                },
                DateRange = new
                {
                    FromDate = fromDateValue,
                    ToDate = toDateValue
                }
            };

            return ApiResponse.Success("Lấy thống kê tổng quan thành công", result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi lấy thống kê tổng quan");
            return ApiResponse.Error("Lỗi server khi lấy thống kê tổng quan");
        }
    }

    /* ---------- 5. Thống kê doanh thu theo tháng ---------- */
    [HttpGet("revenue-by-month")]
    public async Task<IActionResult> GetRevenueByMonth(
        [FromQuery] int year = 0,
        [FromQuery] string? locationId = null,
        CancellationToken ct = default)
    {
        try
        {
            var targetYear = year == 0 ? DateTime.UtcNow.Year : year;
            var startDate = new DateTime(targetYear, 1, 1);
            var endDate = new DateTime(targetYear, 12, 31);

            var query = _context.DonHangs
                .Include(dh => dh.MaDiaDiemYeuThichNavigation)
                .Where(dh => dh.TrangThaiDon == "COMPLETED" || dh.TrangThaiDon == "PAID" &&
                           dh.NgayTao >= startDate && 
                           dh.NgayTao <= endDate && 
                           dh.IsDelete != true);

            // Filter by location
            if (!string.IsNullOrEmpty(locationId))
            {
                query = query.Where(dh => dh.MaDiaDiemYeuThich == locationId);
            }

            var monthlyRevenue = await query
                .GroupBy(dh => new { dh.NgayTao!.Value.Year, dh.NgayTao!.Value.Month })
                .Select(g => new
                {
                    Year = g.Key.Year,
                    Month = g.Key.Month,
                    MonthName = new DateTime(g.Key.Year, g.Key.Month, 1).ToString("MM/yyyy"),
                    TotalRevenue = g.Sum(dh => dh.TongTienThanhToan),
                    TotalOrders = g.Count()
                })
                .OrderBy(x => x.Year)
                .ThenBy(x => x.Month)
                .ToListAsync(ct);

            return ApiResponse.Success("Lấy thống kê doanh thu theo tháng thành công", monthlyRevenue);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi lấy thống kê doanh thu theo tháng");
            return ApiResponse.Error("Lỗi server khi lấy thống kê doanh thu theo tháng");
        }
    }
}

// DTOs
public class RevenueByLocationDto
{
    public string LocationId { get; set; } = null!;
    public string LocationName { get; set; } = null!;
    public int TotalOrders { get; set; }
    public decimal TotalRevenue { get; set; }
    public decimal AverageOrderValue { get; set; }
}

public class InventoryByLocationDto
{
    public string LocationId { get; set; } = null!;
    public string LocationName { get; set; } = null!;
    public int TotalLots { get; set; }
    public int TotalQuantity { get; set; }
    public decimal TotalValue { get; set; }
    public int ExpiredLots { get; set; }
    public int ExpiringSoonLots { get; set; }
}

public class VaccineDetailsByLocationDto
{
    public string LocationId { get; set; } = null!;
    public string LocationName { get; set; } = null!;
    public string VaccineId { get; set; } = null!;
    public string VaccineName { get; set; } = null!;
    public string LotNumber { get; set; } = null!;
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal TotalValue { get; set; }
    public DateTime ExpiryDate { get; set; }
    public bool IsExpired { get; set; }
    public bool IsExpiringSoon { get; set; }
}

public class OverviewStatisticsDto
{
    public RevenueStatisticsDto Revenue { get; set; } = null!;
    public InventoryStatisticsDto Inventory { get; set; } = null!;
    public AppointmentStatisticsDto Appointments { get; set; } = null!;
    public DateRangeDto DateRange { get; set; } = null!;
}

public class RevenueStatisticsDto
{
    public decimal TotalRevenue { get; set; }
    public int TotalOrders { get; set; }
    public decimal AverageOrderValue { get; set; }
}

public class InventoryStatisticsDto
{
    public decimal TotalValue { get; set; }
    public int TotalLots { get; set; }
}

public class AppointmentStatisticsDto
{
    public int TotalAppointments { get; set; }
    public int CompletedAppointments { get; set; }
    public double CompletionRate { get; set; }
}

public class DateRangeDto
{
    public DateTime FromDate { get; set; }
    public DateTime ToDate { get; set; }
}

public class MonthlyRevenueDto
{
    public int Year { get; set; }
    public int Month { get; set; }
    public string MonthName { get; set; } = null!;
    public decimal TotalRevenue { get; set; }
    public int TotalOrders { get; set; }
}