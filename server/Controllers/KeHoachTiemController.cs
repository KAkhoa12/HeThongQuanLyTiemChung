using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Models;
using server.DTOs;
using server.Helpers;
using server.DTOs.Pagination;

namespace server.Controllers;

[ApiController]
[Route("api/ke-hoach-tiem")]
public class KeHoachTiemController : ControllerBase
{
    private readonly HeThongQuanLyTiemChungContext _context;
    private readonly ILogger<KeHoachTiemController> _logger;

    public KeHoachTiemController(HeThongQuanLyTiemChungContext context, ILogger<KeHoachTiemController> logger)
    {
        _context = context;
        _logger = logger;
    }

    /* ---------- 1. Lấy danh sách kế hoạch tiêm (có phân trang) ---------- */
    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] int? page = 1,
        [FromQuery] int? pageSize = 20,
        [FromQuery] string? customerId = null,
        [FromQuery] string? orderId = null,
        [FromQuery] string? status = null,
        CancellationToken ct = default)
    {
        try
        {
            var query = _context.KeHoachTiems
                .Include(kht => kht.MaNguoiDungNavigation)
                .Include(kht => kht.MaDichVuNavigation)
                .Include(kht => kht.MaVaccineNavigation)
                .Include(kht => kht.MaDonHangNavigation)
                .Where(kht => true); // KeHoachTiem model doesn't have IsDelete property

            // Filter by customer
            if (!string.IsNullOrEmpty(customerId))
            {
                query = query.Where(kht => kht.MaNguoiDung == customerId);
            }

            // Filter by order
            if (!string.IsNullOrEmpty(orderId))
            {
                query = query.Where(kht => kht.MaDonHang == orderId);
            }

            // Filter by status
            if (!string.IsNullOrEmpty(status))
            {
                query = query.Where(kht => kht.TrangThai == status);
            }

            query = query.OrderBy(kht => kht.NgayDuKien)
                        .ThenBy(kht => kht.MuiThu);

            var paged = await query.ToPagedAsync(page!.Value, pageSize!.Value, ct);

            var data = paged.Data.Select(kht => new
            {
                kht.MaKeHoachTiem,
                kht.MaNguoiDung,
                CustomerName = kht.MaNguoiDungNavigation?.Ten,
                kht.MaDichVu,
                ServiceName = kht.MaDichVuNavigation?.Ten,
                kht.MaDonHang,
                kht.MaVaccine,
                VaccineName = kht.MaVaccineNavigation?.Ten,
                kht.MuiThu,
                kht.NgayDuKien,
                kht.TrangThai,
                NgayTao = (DateTime?)null // NgayTao property doesn't exist in KeHoachTiem model
            }).ToList();

            return ApiResponse.Success(
                "Lấy danh sách kế hoạch tiêm thành công",
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
            _logger.LogError(ex, "Lỗi khi lấy danh sách kế hoạch tiêm");
            return ApiResponse.Error("Lỗi server khi lấy danh sách kế hoạch tiêm");
        }
    }

    /* ---------- 2. Lấy kế hoạch tiêm theo ID ---------- */
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id, CancellationToken ct = default)
    {
        try
        {
            var keHoachTiem = await _context.KeHoachTiems
                .Include(kht => kht.MaNguoiDungNavigation)
                .Include(kht => kht.MaDichVuNavigation)
                .Include(kht => kht.MaVaccineNavigation)
                .Include(kht => kht.MaDonHangNavigation)
                .Include(kht => kht.PhieuTiems)
                .ThenInclude(pt => pt.ChiTietPhieuTiems)
                .FirstOrDefaultAsync(kht => kht.MaKeHoachTiem == id, ct);

            if (keHoachTiem == null)
            {
                return ApiResponse.Error("Không tìm thấy kế hoạch tiêm");
            }

            var result = new
            {
                keHoachTiem.MaKeHoachTiem,
                keHoachTiem.MaNguoiDung,
                CustomerName = keHoachTiem.MaNguoiDungNavigation?.Ten,
                keHoachTiem.MaDichVu,
                ServiceName = keHoachTiem.MaDichVuNavigation?.Ten,
                keHoachTiem.MaDonHang,
                keHoachTiem.MaVaccine,
                VaccineName = keHoachTiem.MaVaccineNavigation?.Ten,
                keHoachTiem.MuiThu,
                keHoachTiem.NgayDuKien,
                keHoachTiem.TrangThai,
                NgayTao = (DateTime?)null, // NgayTao property doesn't exist in KeHoachTiem model
                PhieuTiems = keHoachTiem.PhieuTiems.Select(pt => new
                {
                    pt.MaPhieuTiem,
                    pt.NgayTiem,
                    pt.TrangThai,
                    ChiTietPhieuTiems = pt.ChiTietPhieuTiems.Select(ctpt => new
                    {
                        ctpt.MaChiTietPhieuTiem,
                        ctpt.MaVaccine,
                        ctpt.MuiTiemThucTe,
                        ctpt.ThuTu
                    })
                })
            };

            return ApiResponse.Success("Lấy thông tin kế hoạch tiêm thành công", result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi lấy thông tin kế hoạch tiêm");
            return ApiResponse.Error("Lỗi server khi lấy thông tin kế hoạch tiêm");
        }
    }

    /* ---------- 3. Cập nhật trạng thái kế hoạch tiêm ---------- */
    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateStatus(string id, [FromBody] UpdateKeHoachTiemStatusDto dto, CancellationToken ct = default)
    {
        try
        {
            var keHoachTiem = await _context.KeHoachTiems.FindAsync(id);
            if (keHoachTiem == null)
            {
                return ApiResponse.Error("Không tìm thấy kế hoạch tiêm");
            }

            keHoachTiem.TrangThai = dto.Status;
            // NgayCapNhat property doesn't exist in KeHoachTiem model

            _context.KeHoachTiems.Update(keHoachTiem);
            await _context.SaveChangesAsync(ct);

            return ApiResponse.Success($"Cập nhật trạng thái kế hoạch tiêm thành công - Trạng thái: {dto.Status}");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi cập nhật trạng thái kế hoạch tiêm");
            return ApiResponse.Error("Lỗi server khi cập nhật trạng thái kế hoạch tiêm");
        }
    }

    /* ---------- 4. Lấy kế hoạch tiêm theo đơn hàng ---------- */
    [HttpGet("by-order/{orderId}")]
    public async Task<IActionResult> GetByOrder(string orderId, CancellationToken ct = default)
    {
        try
        {
            var keHoachTiems = await _context.KeHoachTiems
                .Include(kht => kht.MaNguoiDungNavigation)
                .Include(kht => kht.MaDichVuNavigation)
                .Include(kht => kht.MaVaccineNavigation)
                .Include(kht => kht.MaDonHangNavigation)
                .Where(kht => kht.MaDonHang == orderId)
                .OrderBy(kht => kht.NgayDuKien)
                .ThenBy(kht => kht.MaVaccine)
                .ThenBy(kht => kht.MuiThu)
                .ToListAsync(ct);

            if (!keHoachTiems.Any())
            {
                return ApiResponse.Error("Không tìm thấy kế hoạch tiêm cho đơn hàng này");
            }

            var result = keHoachTiems.Select(kht => new
            {
                kht.MaKeHoachTiem,
                kht.MaNguoiDung,
                CustomerName = kht.MaNguoiDungNavigation?.Ten,
                kht.MaDichVu,
                ServiceName = kht.MaDichVuNavigation?.Ten,
                kht.MaVaccine,
                VaccineName = kht.MaVaccineNavigation?.Ten,
                kht.MuiThu,
                kht.NgayDuKien,
                kht.TrangThai,
                OrderInfo = new
                {
                    kht.MaDonHang,
                    OrderDate = kht.MaDonHangNavigation?.NgayDat,
                    OrderStatus = kht.MaDonHangNavigation?.TrangThaiDon,
                    TotalAmount = kht.MaDonHangNavigation?.TongTienThanhToan
                },
                NgayTao = (DateTime?)null // NgayTao property doesn't exist in KeHoachTiem model
            }).ToList();

            // Nhóm theo mũi thứ để dễ hiển thị
            var groupedByMuiThu = result.GroupBy(kht => kht.MuiThu)
                .Select(g => new
                {
                    muiThu = g.Key,
                    vaccines = g.Select(v => new
                    {
                        maKeHoachTiem = v.MaKeHoachTiem,
                        vaccineName = v.VaccineName,
                        muiThu = v.MuiThu,
                        ngayDuKien = v.NgayDuKien,
                        trangThai = v.TrangThai
                    }).ToList(),
                    totalVaccines = g.Count()
                })
                .OrderBy(g => g.muiThu)
                .ToList();

            return ApiResponse.Success("Lấy kế hoạch tiêm theo đơn hàng thành công", new
            {
                orderId = orderId,
                totalPlans = result.Count,
                plans = result,
                scheduleByMuiThu = groupedByMuiThu
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi lấy kế hoạch tiêm theo đơn hàng {orderId}", orderId);
            return ApiResponse.Error("Lỗi server khi lấy kế hoạch tiêm theo đơn hàng");
        }
    }

    /* ---------- 5. Lấy kế hoạch tiêm có mũi thứ nhỏ nhất với trạng thái PENDING theo đơn hàng ---------- */
    [HttpGet("minimum-pending-by-order/{orderId}")]
    public async Task<IActionResult> GetMinimumPendingByOrder(string orderId, CancellationToken ct = default)
    {
        try
        {
            // Lấy tất cả kế hoạch tiêm của đơn hàng có trạng thái PENDING
            var pendingKeHoach = await _context.KeHoachTiems
                .Include(kht => kht.MaNguoiDungNavigation)
                .Include(kht => kht.MaDichVuNavigation)
                .Include(kht => kht.MaVaccineNavigation)
                .Include(kht => kht.MaDonHangNavigation)
                .Where(kht => kht.MaDonHang == orderId && kht.TrangThai == "PENDING")
                .OrderBy(kht => kht.MuiThu)
                .ToListAsync(ct);

            if (!pendingKeHoach.Any())
            {
                return ApiResponse.Error("Không tìm thấy kế hoạch tiêm PENDING cho đơn hàng này");
            }

            // Tìm mũi thứ nhỏ nhất
            var minMuiThu = pendingKeHoach.Min(kht => kht.MuiThu);

            // Lấy tất cả kế hoạch có mũi thứ nhỏ nhất
            var minimumPendingKeHoach = pendingKeHoach
                .Where(kht => kht.MuiThu == minMuiThu)
                .Select(kht => new
                {
                    kht.MaKeHoachTiem,
                    kht.MaNguoiDung,
                    CustomerName = kht.MaNguoiDungNavigation?.Ten,
                    kht.MaDichVu,
                    ServiceName = kht.MaDichVuNavigation?.Ten,
                    kht.MaVaccine,
                    VaccineName = kht.MaVaccineNavigation?.Ten,
                    kht.MuiThu,
                    kht.NgayDuKien,
                    kht.TrangThai,
                    OrderInfo = new
                    {
                        kht.MaDonHang,
                        OrderDate = kht.MaDonHangNavigation?.NgayDat,
                        OrderStatus = kht.MaDonHangNavigation?.TrangThaiDon,
                        TotalAmount = kht.MaDonHangNavigation?.TongTienThanhToan
                    }
                }).ToList();

            return ApiResponse.Success("Lấy kế hoạch tiêm mũi thứ nhỏ nhất PENDING thành công", new
            {
                orderId = orderId,
                minMuiThu = minMuiThu,
                totalPlans = minimumPendingKeHoach.Count,
                plans = minimumPendingKeHoach
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi lấy kế hoạch tiêm mũi thứ nhỏ nhất PENDING cho đơn hàng {orderId}", orderId);
            return ApiResponse.Error("Lỗi server khi lấy kế hoạch tiêm mũi thứ nhỏ nhất PENDING");
        }
    }

    /* ---------- 6. Cập nhật trạng thái tất cả kế hoạch tiêm có cùng mũi thứ ---------- */
    [HttpPut("update-status-by-mui-thu")]
    public async Task<IActionResult> UpdateStatusByMuiThu([FromBody] UpdateKeHoachTiemStatusByMuiThuDto dto, CancellationToken ct = default)
    {
        try
        {
            // Lấy tất cả kế hoạch tiêm có cùng mũi thứ và trạng thái PENDING
            var keHoachTiems = await _context.KeHoachTiems
                .Where(kht => kht.MaDonHang == dto.OrderId 
                           && kht.MuiThu == dto.MuiThu 
                           && kht.TrangThai == "PENDING")
                .ToListAsync(ct);

            if (!keHoachTiems.Any())
            {
                return ApiResponse.Error("Không tìm thấy kế hoạch tiêm PENDING với mũi thứ này");
            }

            // Cập nhật trạng thái cho tất cả kế hoạch
            foreach (var keHoach in keHoachTiems)
            {
                keHoach.TrangThai = dto.Status;
            }

            _context.KeHoachTiems.UpdateRange(keHoachTiems);
            await _context.SaveChangesAsync(ct);

            return ApiResponse.Success($"Cập nhật trạng thái {keHoachTiems.Count} kế hoạch tiêm thành công - Trạng thái: {dto.Status}");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi cập nhật trạng thái kế hoạch tiêm theo mũi thứ");
            return ApiResponse.Error("Lỗi server khi cập nhật trạng thái kế hoạch tiêm");
        }
    }

    /* ---------- 7. Kiểm tra kế hoạch tiêm còn PENDING sau khi cập nhật mũi thứ ---------- */
    [HttpGet("check-remaining-pending/{orderId}")]
    public async Task<IActionResult> CheckRemainingPending(string orderId, CancellationToken ct = default)
    {
        try
        {
            // Lấy tất cả kế hoạch tiêm của đơn hàng
            var allKeHoachTiems = await _context.KeHoachTiems
                .Where(kht => kht.MaDonHang == orderId)
                .ToListAsync(ct);

            // Kiểm tra còn kế hoạch PENDING không
            var remainingPending = allKeHoachTiems
                .Where(kht => kht.TrangThai == "PENDING")
                .ToList();

            var result = new
            {
                hasRemainingPending = remainingPending.Any(),
                remainingCount = remainingPending.Count,
                nextMuiThu = remainingPending.Any() ? remainingPending.Min(kht => kht.MuiThu) : (int?)null,
                totalPlans = allKeHoachTiems.Count,
                completedPlans = allKeHoachTiems.Count(kht => kht.TrangThai == "COMPLETED")
            };

            return ApiResponse.Success("Kiểm tra kế hoạch tiêm còn PENDING thành công", result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi kiểm tra kế hoạch tiêm còn PENDING cho đơn hàng {orderId}", orderId);
            return ApiResponse.Error("Lỗi server khi kiểm tra kế hoạch tiêm còn PENDING");
        }
    }

    /* ---------- 8. Lấy kế hoạch tiêm theo khách hàng ---------- */
    [HttpGet("by-customer/{customerId}")]
    public async Task<IActionResult> GetByCustomer(string customerId, CancellationToken ct = default)
    {
        try
        {
            var keHoachTiems = await _context.KeHoachTiems
                .Include(kht => kht.MaDichVuNavigation)
                .Include(kht => kht.MaVaccineNavigation)
                .Include(kht => kht.MaDonHangNavigation)
                .Where(kht => kht.MaNguoiDung == customerId)
                .OrderBy(kht => kht.NgayDuKien)
                .ThenBy(kht => kht.MuiThu)
                .ToListAsync(ct);

            var result = keHoachTiems.Select(kht => new
            {
                kht.MaKeHoachTiem,
                kht.MaDichVu,
                ServiceName = kht.MaDichVuNavigation?.Ten,
                kht.MaVaccine,
                VaccineName = kht.MaVaccineNavigation?.Ten,
                kht.MuiThu,
                kht.NgayDuKien,
                kht.TrangThai,
                NgayTao = (DateTime?)null,// NgayTao property doesn't exist in KeHoachTiem model,
                OrderId = kht.MaDonHang
            }).ToList();

            return ApiResponse.Success("Lấy kế hoạch tiêm theo khách hàng thành công", result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi lấy kế hoạch tiêm theo khách hàng");
            return ApiResponse.Error("Lỗi server khi lấy kế hoạch tiêm theo khách hàng");
        }
    }
}

// DTO cho việc cập nhật trạng thái kế hoạch tiêm
public class UpdateKeHoachTiemStatusDto
{
    public string Status { get; set; } = null!; // PENDING, SCHEDULED, COMPLETED, MISSED, CANCELLED
    public string? Note { get; set; }
}

// DTO cho việc cập nhật trạng thái kế hoạch tiêm theo mũi thứ
public class UpdateKeHoachTiemStatusByMuiThuDto
{
    public string OrderId { get; set; } = null!;
    public int MuiThu { get; set; }
    public string Status { get; set; } = null!; // PENDING, SCHEDULED, COMPLETED, MISSED, CANCELLED
    public string? Note { get; set; }
}