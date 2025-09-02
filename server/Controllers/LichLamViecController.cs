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
        // Mặc định lấy tất cả lịch làm việc (không giới hạn ngày)
        var query = _ctx.LichLamViecs
            .Include(l => l.MaBacSiNavigation)
                .ThenInclude(b => b.MaNguoiDungNavigation)
            .Include(l => l.MaDiaDiemNavigation)
            .Where(l => l.IsDelete == false);

        // Chỉ lọc theo ngày nếu có truyền vào
        if (fromDate.HasValue)
            query = query.Where(l => l.NgayLam >= fromDate.Value);
        
        if (toDate.HasValue)
            query = query.Where(l => l.NgayLam <= toDate.Value);

        // Lọc theo địa điểm nếu có
        if (!string.IsNullOrEmpty(locationId))
            query = query.Where(l => l.MaDiaDiem == locationId);

        // Lọc theo bác sĩ nếu có
        if (!string.IsNullOrEmpty(doctorId))
            query = query.Where(l => l.MaBacSi == doctorId);

        // Sắp xếp theo ngày và giờ
        query = query.OrderBy(l => l.NgayLam).ThenBy(l => l.GioBatDau);

        // Debug: Log số lượng lịch trước khi phân trang
        var totalCount = await query.CountAsync(ct);
        Console.WriteLine($"[DEBUG] Tổng số lịch làm việc: {totalCount}");
        
        // Debug: Log một số lịch mẫu
        var sampleSchedules = await query.Take(5).ToListAsync(ct);
        foreach (var schedule in sampleSchedules)
        {
            Console.WriteLine($"[DEBUG] Lịch: ID={schedule.MaLichLamViec}, Ngày={schedule.NgayLam}, Bác sĩ={schedule.MaBacSi}, Địa điểm={schedule.MaDiaDiem}");
        }

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

    /* ---------- 1.1. Tất cả lịch làm việc (không phân trang) - để debug ---------- */
    [HttpGet("all")]
    public async Task<IActionResult> GetAllWithoutPaging(
        CancellationToken ct = default)
    {
        var schedules = await _ctx.LichLamViecs
            .Include(l => l.MaBacSiNavigation)
                .ThenInclude(b => b.MaNguoiDungNavigation)
            .Include(l => l.MaDiaDiemNavigation)
            .Where(l => l.IsDelete == false)
            .OrderBy(l => l.NgayLam)
            .ThenBy(l => l.GioBatDau)
            .ToListAsync(ct);

        Console.WriteLine($"[DEBUG] GetAllWithoutPaging: Tìm thấy {schedules.Count} lịch làm việc");
        
        foreach (var schedule in schedules.Take(10)) // Log 10 lịch đầu tiên
        {
            Console.WriteLine($"[DEBUG] Lịch: ID={schedule.MaLichLamViec}, Ngày={schedule.NgayLam}, Bác sĩ={schedule.MaBacSi}, Địa điểm={schedule.MaDiaDiem}, IsDelete={schedule.IsDelete}");
        }

        var data = schedules.Select(l => new WorkScheduleDto(
            l.MaLichLamViec,
            l.MaBacSi,
            l.MaBacSiNavigation?.MaNguoiDungNavigation?.Ten ?? "Không xác định",
            l.MaDiaDiem,
            l.MaDiaDiemNavigation?.Ten ?? "Không xác định",
            l.NgayLam,
            l.GioBatDau,
            l.GioKetThuc,
            l.SoLuongCho,
            l.DaDat ?? 0,
            l.TrangThai,
            l.NgayTao ?? DateTime.MinValue)).ToList();

        return ApiResponse.Success("Lấy tất cả lịch làm việc thành công", data);
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
                .Where(lh => lh.MaDiaDiem == schedule.MaDiaDiem && lh.IsDelete == false)
                .Select(lh => new AppointmentSlotDto(
                    lh.MaLichHen,
                    lh.MaDonHang,
                    lh.MaDonHangNavigation.MaNguoiDungNavigation.Ten,
                    null, // MaVaccine đã bị xóa
                    null, // TenVaccine đã bị xóa
                    1, // DoseNumber - mặc định là 1 vì MuiThu đã bị xóa
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
    // ... existing code ...

[HttpPost]
public async Task<IActionResult> Create(
    [FromBody] WorkScheduleCreateDto dto,
    CancellationToken ct)
{
    // Kiểm tra bác sĩ tồn tại
    if (!await _ctx.BacSis.AnyAsync(b => b.MaBacSi == dto.MaBacSi && b.IsDelete == false, ct))
        return ApiResponse.Error("Không tìm thấy bác sĩ", 404);

    // Kiểm tra địa điểm tồn tại
    if (!await _ctx.DiaDiems.AnyAsync(d => d.MaDiaDiem == dto.MaDiaDiem && d.IsDelete == false, ct))
        return ApiResponse.Error("Không tìm thấy địa điểm", 404);

    // Kiểm tra thời gian hợp lệ
    if (dto.GioKetThuc <= dto.GioBatDau)
        return ApiResponse.Error("Thời gian kết thúc phải sau thời gian bắt đầu", 400);

    // Debug: Log thông tin lịch đang tạo
    Console.WriteLine($"[DEBUG] Đang tạo lịch: Bác sĩ={dto.MaBacSi}, Ngày={dto.NgayLam}, Giờ={dto.GioBatDau}-{dto.GioKetThuc}");
    
    // Kiểm tra trùng lịch của bác sĩ (cho phép lịch liền kề)
    var existingSchedules = await _ctx.LichLamViecs
        .Where(l => l.MaBacSi == dto.MaBacSi &&
                   l.IsDelete == false &&
                   l.NgayLam == dto.NgayLam)
        .ToListAsync(ct);
        
    Console.WriteLine($"[DEBUG] Tìm thấy {existingSchedules.Count} lịch hiện có trong ngày {dto.NgayLam}");
    
    // Debug: Log tất cả lịch hiện có
    foreach (var existing in existingSchedules)
    {
        Console.WriteLine($"[DEBUG] Lịch hiện có: ID={existing.MaLichLamViec}, Giờ={existing.GioBatDau}-{existing.GioKetThuc}");
    }
    
    // Kiểm tra conflict chi tiết hơn - Logic mới chính xác hơn
    var conflictingSchedules = new List<LichLamViec>();
    foreach (var existing in existingSchedules)
    {
        // Logic conflict: Lịch mới chồng lấn với lịch cũ
        // Lịch mới bắt đầu trước khi lịch cũ kết thúc VÀ lịch mới kết thúc sau khi lịch cũ bắt đầu
        var isConflict = (dto.GioBatDau < existing.GioKetThuc && dto.GioKetThuc > existing.GioBatDau);
        
        Console.WriteLine($"[DEBUG] So sánh: Lịch hiện có {existing.GioBatDau}-{existing.GioKetThuc} vs Lịch mới {dto.GioBatDau}-{dto.GioKetThuc}");
        Console.WriteLine($"[DEBUG] Điều kiện 1: {dto.GioBatDau} < {existing.GioKetThuc} = {dto.GioBatDau < existing.GioKetThuc}");
        Console.WriteLine($"[DEBUG] Điều kiện 2: {dto.GioKetThuc} > {existing.GioBatDau} = {dto.GioKetThuc > existing.GioBatDau}");
        Console.WriteLine($"[DEBUG] Kết quả: {isConflict}");
        
        if (isConflict)
        {
            conflictingSchedules.Add(existing);
        }
    }
    
    var hasConflict = conflictingSchedules.Any();

    if (hasConflict)
    {
        Console.WriteLine($"[DEBUG] PHÁT HIỆN CONFLICT! Số lịch conflict: {conflictingSchedules.Count}");
        foreach (var conflict in conflictingSchedules)
        {
            Console.WriteLine($"[DEBUG] Lịch conflict: ID={conflict.MaLichLamViec}, Giờ={conflict.GioBatDau}-{conflict.GioKetThuc}");
        }
        return ApiResponse.Error("Bác sĩ đã có lịch làm việc trong khoảng thời gian này", 409);
    }

    var schedule = new LichLamViec
    {
        MaLichLamViec = Guid.NewGuid().ToString("N"),
        MaBacSi = dto.MaBacSi,
        MaDiaDiem = dto.MaDiaDiem,
        NgayLam = dto.NgayLam,
        GioBatDau = dto.GioBatDau,
        GioKetThuc = dto.GioKetThuc,
        SoLuongCho = dto.SoLuongCho,
        TrangThai = dto.TrangThai,
        DaDat = 0,
        IsActive = true,
        IsDelete = false,
        NgayTao = DateTime.UtcNow
    };

    _ctx.LichLamViecs.Add(schedule);
    await _ctx.SaveChangesAsync(ct);
    
    Console.WriteLine($"[DEBUG] TẠO LỊCH THÀNH CÔNG! ID={schedule.MaLichLamViec}");

    return ApiResponse.Success("Tạo lịch làm việc thành công",
        new { schedule.MaLichLamViec }, 201);
}

// ... existing code ...

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

        // Kiểm tra trùng lịch chỉ khi thời gian thực sự thay đổi
        var startTimeChanged = dto.StartTime != null && dto.StartTime != schedule.GioBatDau;
        var endTimeChanged = dto.EndTime != null && dto.EndTime != schedule.GioKetThuc;
        
        if (startTimeChanged || endTimeChanged)
        {
            var startTime = dto.StartTime ?? schedule.GioBatDau;
            var endTime = dto.EndTime ?? schedule.GioKetThuc;

            var hasConflict = await _ctx.LichLamViecs
                .AnyAsync(l => l.MaBacSi == schedule.MaBacSi &&
                              l.IsDelete == false &&
                              l.MaLichLamViec != id &&
                              (l.GioBatDau < endTime && l.GioKetThuc > startTime), ct);

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
            .FirstOrDefaultAsync(l => l.MaLichLamViec == id && l.IsDelete == false, ct);
        if (schedule == null)
            return ApiResponse.Error("Không tìm thấy lịch làm việc", 404);

        // Kiểm tra có lịch hẹn không (kiểm tra theo địa điểm)
        var hasAppointments = await _ctx.LichHens
            .AnyAsync(lh => lh.MaDiaDiem == schedule.MaDiaDiem && lh.IsDelete == false, ct);
        if (hasAppointments)
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