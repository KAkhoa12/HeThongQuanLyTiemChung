using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.DTOs.LichLamViec;
using server.DTOs.Pagination;
using server.Helpers;
using server.Models;

namespace server.Controllers;

[ApiController]
[Route("api/schedules")]
public class LichLamViecController : ControllerBase
{
    private readonly HeThongQuanLyTiemChungContext _ctx;

    public LichLamViecController(HeThongQuanLyTiemChungContext ctx) => _ctx = ctx;

    /* ---------- 1. Tất cả lịch làm việc (paging) ---------- */
    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] DateOnly? fromDate = null,
        [FromQuery] DateOnly? toDate = null,
        [FromQuery] string? locationId = null,
        [FromQuery] string? doctorId = null,
        [FromQuery] int? page = 1,
        [FromQuery] int? pageSize = 20,
        CancellationToken ct = default)
    {
        // Mặc định lấy lịch từ ngày hiện tại đến 30 ngày sau
        var today = DateOnly.FromDateTime(DateTime.Today);
        fromDate ??= today;
        toDate ??= today.AddDays(30);

        var query = _ctx.LichLamViecs
            .Include(l => l.MaBacSiNavigation)
                .ThenInclude(b => b.MaNguoiDungNavigation)
            .Include(l => l.MaDiaDiemNavigation)
            .Where(l => l.IsDelete == false &&
                       l.NgayLam >= fromDate &&
                       l.NgayLam <= toDate);

        // Lọc theo địa điểm nếu có
        if (!string.IsNullOrEmpty(locationId))
            query = query.Where(l => l.MaDiaDiem == locationId);

        // Lọc theo bác sĩ nếu có
        if (!string.IsNullOrEmpty(doctorId))
            query = query.Where(l => l.MaBacSi == doctorId);

        // Sắp xếp theo ngày và giờ
        query = query.OrderBy(l => l.NgayLam).ThenBy(l => l.GioBatDau);

        var paged = await query.ToPagedAsync(page!.Value, pageSize!.Value, ct);

        var data = paged.Data.Select(l => new WorkScheduleDto(
            l.MaLichLamViec,
            l.MaBacSi,
            l.MaBacSiNavigation.MaNguoiDungNavigation.Ten,
            l.MaDiaDiem,
            l.MaDiaDiemNavigation.Ten,
            l.NgayLam,
            l.GioBatDau,
            l.GioKetThuc,
            l.SoLuongCho,
            l.DaDat ?? 0,
            l.TrangThai,
            l.NgayTao!.Value)).ToList();

        return ApiResponse.Success(
            "Lấy danh sách lịch làm việc thành công",
            new PagedResultDto<WorkScheduleDto>(
                paged.TotalCount,
                paged.Page,
                paged.PageSize,
                paged.TotalPages,
                data));
    }

    /* ---------- 2. Theo ID ---------- */
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(
        string id, 
        [FromQuery] bool includeAppointments = false,
        CancellationToken ct = default)
    {
        var schedule = await _ctx.LichLamViecs
            .Include(l => l.MaBacSiNavigation)
                .ThenInclude(b => b.MaNguoiDungNavigation)
                    .ThenInclude(n => n.MaAnhNavigation)
            .Include(l => l.MaDiaDiemNavigation)
            .FirstOrDefaultAsync(l => l.MaLichLamViec == id && l.IsDelete == false, ct);

        if (schedule == null)
            return ApiResponse.Error("Không tìm thấy lịch làm việc", 404);

        // Lấy danh sách lịch hẹn nếu yêu cầu
        List<AppointmentSlotDto>? appointments = null;
        if (includeAppointments)
        {
            appointments = await _ctx.LichHens
                .Include(lh => lh.MaDonHangNavigation)
                    .ThenInclude(dh => dh.MaNguoiDungNavigation)
                .Include(lh => lh.MaVaccineNavigation)
                .Where(lh => lh.MaLichLamViec == id && lh.IsDelete == false)
                .Select(lh => new AppointmentSlotDto(
                    lh.MaLichHen,
                    lh.MaDonHang,
                    lh.MaDonHangNavigation.MaNguoiDungNavigation.Ten,
                    lh.MaVaccine,
                    lh.MaVaccineNavigation.Ten,
                    lh.MuiThu,
                    lh.NgayHen,
                    lh.TrangThai))
                .ToListAsync(ct);
        }

        var dto = new WorkScheduleDetailDto(
            schedule.MaLichLamViec,
            schedule.MaBacSi,
            schedule.MaBacSiNavigation.MaNguoiDungNavigation.Ten,
            schedule.MaBacSiNavigation.ChuyenMon,
            schedule.MaBacSiNavigation.MaNguoiDungNavigation.MaAnhNavigation?.UrlAnh,
            schedule.MaDiaDiem,
            schedule.MaDiaDiemNavigation.Ten,
            schedule.MaDiaDiemNavigation.DiaChi,
            schedule.NgayLam,
            schedule.GioBatDau,
            schedule.GioKetThuc,
            schedule.SoLuongCho,
            schedule.DaDat ?? 0,
            schedule.TrangThai,
            schedule.NgayTao!.Value,
            appointments);

        return ApiResponse.Success("Chi tiết lịch làm việc", dto);
    }

    /* ---------- 3. Tạo mới ---------- */
    [HttpPost]
    public async Task<IActionResult> Create(
        [FromBody] WorkScheduleCreateDto dto,
        CancellationToken ct)
    {
        // Kiểm tra bác sĩ tồn tại
        if (!await _ctx.BacSis.AnyAsync(b => b.MaBacSi == dto.DoctorId && b.IsDelete == false, ct))
            return ApiResponse.Error("Không tìm thấy bác sĩ", 404);

        // Kiểm tra địa điểm tồn tại
        if (!await _ctx.DiaDiems.AnyAsync(d => d.MaDiaDiem == dto.LocationId && d.IsDelete == false, ct))
            return ApiResponse.Error("Không tìm thấy địa điểm", 404);

        // Kiểm tra thời gian hợp lệ
        if (dto.EndTime <= dto.StartTime)
            return ApiResponse.Error("Thời gian kết thúc phải sau thời gian bắt đầu", 400);

        // Kiểm tra trùng lịch của bác sĩ
        var hasConflict = await _ctx.LichLamViecs
            .AnyAsync(l => l.MaBacSi == dto.DoctorId &&
                          l.IsDelete == false &&
                          l.NgayLam == dto.WorkDate &&
                          ((l.GioBatDau <= dto.StartTime && l.GioKetThuc > dto.StartTime) ||
                           (l.GioBatDau < dto.EndTime && l.GioKetThuc >= dto.EndTime) ||
                           (l.GioBatDau >= dto.StartTime && l.GioKetThuc <= dto.EndTime)), ct);

        if (hasConflict)
            return ApiResponse.Error("Bác sĩ đã có lịch làm việc trong khoảng thời gian này", 409);

        var schedule = new LichLamViec
        {
            MaLichLamViec = Guid.NewGuid().ToString("N"),
            MaBacSi = dto.DoctorId,
            MaDiaDiem = dto.LocationId,
            NgayLam = dto.WorkDate,
            GioBatDau = dto.StartTime,
            GioKetThuc = dto.EndTime,
            SoLuongCho = dto.TotalSlots,
            DaDat = 0,
            TrangThai = dto.Status,
            IsActive = true,
            IsDelete = false,
            NgayTao = DateTime.UtcNow
        };

        _ctx.LichLamViecs.Add(schedule);
        await _ctx.SaveChangesAsync(ct);

        return ApiResponse.Success("Tạo lịch làm việc thành công",
            new { schedule.MaLichLamViec }, 201);
    }

    /* ---------- 4. Cập nhật ---------- */
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(
        string id,
        [FromBody] WorkScheduleUpdateDto dto,
        CancellationToken ct)
    {
        var schedule = await _ctx.LichLamViecs
            .FirstOrDefaultAsync(l => l.MaLichLamViec == id && l.IsDelete == false, ct);
        if (schedule == null)
            return ApiResponse.Error("Không tìm thấy lịch làm việc", 404);

        // Kiểm tra thời gian hợp lệ nếu có cập nhật
        if (dto.StartTime != null && dto.EndTime != null && dto.EndTime <= dto.StartTime)
            return ApiResponse.Error("Thời gian kết thúc phải sau thời gian bắt đầu", 400);
        else if (dto.StartTime != null && dto.EndTime == null && dto.StartTime >= schedule.GioKetThuc)
            return ApiResponse.Error("Thời gian bắt đầu phải trước thời gian kết thúc", 400);
        else if (dto.EndTime != null && dto.StartTime == null && dto.EndTime <= schedule.GioBatDau)
            return ApiResponse.Error("Thời gian kết thúc phải sau thời gian bắt đầu", 400);

        // Kiểm tra số lượng chỗ không nhỏ hơn số đã đặt
        if (dto.TotalSlots != null && dto.TotalSlots < (schedule.DaDat ?? 0))
            return ApiResponse.Error("Số lượng chỗ không thể nhỏ hơn số chỗ đã đặt", 400);

        // Kiểm tra trùng lịch nếu có cập nhật thời gian
        if (dto.StartTime != null || dto.EndTime != null)
        {
            var startTime = dto.StartTime ?? schedule.GioBatDau;
            var endTime = dto.EndTime ?? schedule.GioKetThuc;

            var hasConflict = await _ctx.LichLamViecs
                .AnyAsync(l => l.MaBacSi == schedule.MaBacSi &&
                              l.IsDelete == false &&
                              l.MaLichLamViec != id &&
                              l.NgayLam == schedule.NgayLam &&
                              ((l.GioBatDau <= startTime && l.GioKetThuc > startTime) ||
                               (l.GioBatDau < endTime && l.GioKetThuc >= endTime) ||
                               (l.GioBatDau >= startTime && l.GioKetThuc <= endTime)), ct);

            if (hasConflict)
                return ApiResponse.Error("Bác sĩ đã có lịch làm việc trong khoảng thời gian này", 409);
        }

        schedule.GioBatDau = dto.StartTime ?? schedule.GioBatDau;
        schedule.GioKetThuc = dto.EndTime ?? schedule.GioKetThuc;
        schedule.SoLuongCho = dto.TotalSlots ?? schedule.SoLuongCho;
        schedule.TrangThai = dto.Status ?? schedule.TrangThai;
        schedule.NgayCapNhat = DateTime.UtcNow;

        await _ctx.SaveChangesAsync(ct);
        return ApiResponse.Success("Cập nhật lịch làm việc thành công", null, 200);
    }

    /* ---------- 5. Xóa mềm ---------- */
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id, CancellationToken ct)
    {
        var schedule = await _ctx.LichLamViecs
            .Include(l => l.LichHens.Where(lh => lh.IsDelete == false))
            .FirstOrDefaultAsync(l => l.MaLichLamViec == id && l.IsDelete == false, ct);
        if (schedule == null)
            return ApiResponse.Error("Không tìm thấy lịch làm việc", 404);

        // Kiểm tra có lịch hẹn không
        if (schedule.LichHens.Any())
            return ApiResponse.Error("Không thể xóa lịch làm việc đã có lịch hẹn", 400);

        schedule.IsDelete = true;
        schedule.NgayCapNhat = DateTime.UtcNow;
        await _ctx.SaveChangesAsync(ct);
        return ApiResponse.Success("Xóa lịch làm việc thành công", null, 200);
    }

    /* ---------- 6. Lấy lịch trống theo ngày ---------- */
    [HttpGet("availability")]
    public async Task<IActionResult> GetAvailability(
        [FromQuery] DateOnly? fromDate = null,
        [FromQuery] DateOnly? toDate = null,
        [FromQuery] string? locationId = null,
        [FromQuery] string? doctorId = null,
        CancellationToken ct = default)
    {
        // Mặc định lấy lịch từ ngày hiện tại đến 7 ngày sau
        var today = DateOnly.FromDateTime(DateTime.Today);
        fromDate ??= today;
        toDate ??= today.AddDays(7);

        // Giới hạn khoảng thời gian tìm kiếm tối đa 30 ngày
        if (toDate.HasValue && fromDate.HasValue && toDate.Value > fromDate.Value.AddDays(30))
            toDate = DateOnly.FromDateTime(fromDate.Value.ToDateTime(TimeOnly.MinValue).AddDays(30));

        var query = _ctx.LichLamViecs
            .Include(l => l.MaBacSiNavigation)
                .ThenInclude(b => b.MaNguoiDungNavigation)
            .Include(l => l.MaDiaDiemNavigation)
            .Where(l => l.IsDelete == false &&
                       l.IsActive == true &&
                       l.NgayLam >= fromDate &&
                       l.NgayLam <= toDate &&
                       l.TrangThai == "Available" &&
                       l.SoLuongCho > (l.DaDat ?? 0));

        // Lọc theo địa điểm nếu có
        if (!string.IsNullOrEmpty(locationId))
            query = query.Where(l => l.MaDiaDiem == locationId);

        // Lọc theo bác sĩ nếu có
        if (!string.IsNullOrEmpty(doctorId))
            query = query.Where(l => l.MaBacSi == doctorId);

        // Sắp xếp theo ngày và giờ
        query = query.OrderBy(l => l.NgayLam).ThenBy(l => l.GioBatDau);

        var schedules = await query.ToListAsync(ct);

        // Nhóm lịch theo ngày
        var result = schedules
            .GroupBy(l => l.NgayLam)
            .Select(g => new ScheduleAvailabilityDto(
                g.Key,
                g.Select(l => new TimeSlotDto(
                    l.MaLichLamViec,
                    l.GioBatDau,
                    l.GioKetThuc,
                    l.SoLuongCho - (l.DaDat ?? 0)))
                .ToList()))
            .ToList();

        return ApiResponse.Success("Lấy lịch trống thành công", result);
    }

    /* ---------- 7. Lấy lịch làm việc của bác sĩ theo địa điểm ---------- */
    [HttpGet("by-doctor-location")]
    public async Task<IActionResult> GetByDoctorAndLocation(
        [FromQuery] string doctorId,
        [FromQuery] string locationId,
        [FromQuery] DateOnly? fromDate = null,
        [FromQuery] DateOnly? toDate = null,
        [FromQuery] int? page = 1,
        [FromQuery] int? pageSize = 20,
        CancellationToken ct = default)
    {
        // Kiểm tra bác sĩ tồn tại
        if (!await _ctx.BacSis.AnyAsync(b => b.MaBacSi == doctorId && b.IsDelete == false, ct))
            return ApiResponse.Error("Không tìm thấy bác sĩ", 404);

        // Kiểm tra địa điểm tồn tại
        if (!await _ctx.DiaDiems.AnyAsync(d => d.MaDiaDiem == locationId && d.IsDelete == false, ct))
            return ApiResponse.Error("Không tìm thấy địa điểm", 404);

        // Mặc định lấy lịch từ ngày hiện tại đến 30 ngày sau
        var today = DateOnly.FromDateTime(DateTime.Today);
        fromDate ??= today;
        toDate ??= today.AddDays(30);

        var query = _ctx.LichLamViecs
            .Include(l => l.MaBacSiNavigation)
                .ThenInclude(b => b.MaNguoiDungNavigation)
            .Include(l => l.MaDiaDiemNavigation)
            .Where(l => l.IsDelete == false &&
                       l.MaBacSi == doctorId &&
                       l.MaDiaDiem == locationId &&
                       l.NgayLam >= fromDate &&
                       l.NgayLam <= toDate)
            .OrderBy(l => l.NgayLam)
            .ThenBy(l => l.GioBatDau);

        var paged = await query.ToPagedAsync(page!.Value, pageSize!.Value, ct);

        var data = paged.Data.Select(l => new WorkScheduleDto(
            l.MaLichLamViec,
            l.MaBacSi,
            l.MaBacSiNavigation.MaNguoiDungNavigation.Ten,
            l.MaDiaDiem,
            l.MaDiaDiemNavigation.Ten,
            l.NgayLam,
            l.GioBatDau,
            l.GioKetThuc,
            l.SoLuongCho,
            l.DaDat ?? 0,
            l.TrangThai,
            l.NgayTao!.Value)).ToList();

        return ApiResponse.Success(
            "Lấy lịch làm việc của bác sĩ theo địa điểm thành công",
            new PagedResultDto<WorkScheduleDto>(
                paged.TotalCount,
                paged.Page,
                paged.PageSize,
                paged.TotalPages,
                data));
    }
}