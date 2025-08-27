using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.DTOs.BacSi;
using server.DTOs.Pagination;
using server.Helpers;
using server.Models;
using BCrypt.Net;

namespace server.Controllers;

[ApiController]
[Route("api/doctors")]
public class BacSiController : ControllerBase
{
    private readonly HeThongQuanLyTiemChungContext _ctx;

    public BacSiController(HeThongQuanLyTiemChungContext ctx) => _ctx = ctx;

    /* ---------- 1. Tất cả bác sĩ (paging) ---------- */
    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] int? page = 1,
        [FromQuery] int? pageSize = 20,
        CancellationToken ct = default)
    {
        var query = _ctx.BacSis
                        .Include(b => b.MaNguoiDungNavigation)
                            .ThenInclude(n => n.MaAnhNavigation)
                        .Where(b => b.IsDelete == false)
                        .OrderByDescending(b => b.NgayTao);

        var paged = await query.ToPagedAsync(page!.Value, pageSize!.Value, ct);

        var data = paged.Data.Select(b => new DoctorDto(
            b.MaBacSi,
            b.MaNguoiDung,
            b.MaNguoiDungNavigation.Ten,
            b.MaNguoiDungNavigation.SoDienThoai,
            b.MaNguoiDungNavigation.Email,
            b.ChuyenMon,
            b.SoGiayPhep,
            b.MaNguoiDungNavigation.MaAnhNavigation?.UrlAnh,
            b.NgayTao!.Value)).ToList();

        return ApiResponse.Success(
            "Lấy danh sách bác sĩ thành công",
            new PagedResultDto<DoctorDto>(
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
        var doctor = await _ctx.BacSis
            .Include(b => b.MaNguoiDungNavigation)
                .ThenInclude(n => n.MaAnhNavigation)
            .Include(b => b.LichLamViecs
                .Where(l => l.IsDelete == false && l.NgayLam >= DateOnly.FromDateTime(DateTime.Today)))
                .ThenInclude(l => l.MaDiaDiemNavigation)
            .FirstOrDefaultAsync(b => b.MaBacSi == id && b.IsDelete == false, ct);

        if (doctor == null)
            return ApiResponse.Error("Không tìm thấy bác sĩ", 404);

        var dto = new DoctorDetailDto(
            doctor.MaBacSi,
            doctor.MaNguoiDung,
            doctor.MaNguoiDungNavigation.Ten,
            doctor.MaNguoiDungNavigation.SoDienThoai,
            doctor.MaNguoiDungNavigation.Email,
            doctor.ChuyenMon,
            doctor.SoGiayPhep,
            doctor.MaNguoiDungNavigation.MaAnhNavigation?.UrlAnh,
            doctor.NgayTao!.Value,
            doctor.LichLamViecs
                .OrderBy(l => l.NgayLam)
                .ThenBy(l => l.GioBatDau)
                .Select(l => new DoctorScheduleSummaryDto(
                    l.MaLichLamViec,
                    l.NgayLam,
                    l.GioBatDau,
                    l.GioKetThuc,
                    l.MaDiaDiem,
                    l.MaDiaDiemNavigation.Ten,
                    l.SoLuongCho,
                    l.DaDat ?? 0,
                    l.TrangThai))
                .ToList());

        return ApiResponse.Success("Chi tiết bác sĩ", dto);
    }

    /* ---------- 3. Tạo mới ---------- */
    [HttpPost]
    public async Task<IActionResult> Create(
        [FromBody] DoctorCreateDto dto,
        CancellationToken ct)
    {
        // Kiểm tra người dùng tồn tại
        var user = await _ctx.NguoiDungs
            .FirstOrDefaultAsync(n => n.MaNguoiDung == dto.UserId && n.IsDelete == false, ct);
        if (user == null)
            return ApiResponse.Error("Người dùng không tồn tại", 404);

        // Kiểm tra người dùng đã là bác sĩ chưa
        if (await _ctx.BacSis.AnyAsync(b => b.MaNguoiDung == dto.UserId && b.IsDelete == false, ct))
            return ApiResponse.Error("Người dùng này đã là bác sĩ", 409);

        var doctor = new BacSi
        {
            MaBacSi = Guid.NewGuid().ToString("N"),
            MaNguoiDung = dto.UserId,
            ChuyenMon = dto.Specialty,
            SoGiayPhep = dto.LicenseNumber,
            IsActive = true,
            IsDelete = false,
            NgayTao = DateTime.UtcNow
        };

        _ctx.BacSis.Add(doctor);
        await _ctx.SaveChangesAsync(ct);

        return ApiResponse.Success("Tạo bác sĩ thành công",
            new { doctor.MaBacSi }, 201);
    }

    /* ---------- 3.1. Tạo mới bác sĩ với người dùng mới ---------- */
    [HttpPost("create-with-user")]
    public async Task<IActionResult> CreateWithUser(
        [FromBody] DoctorCreateWithUserDto dto,
        CancellationToken ct)
    {
        // Kiểm tra email đã tồn tại
        if (await _ctx.NguoiDungs.AnyAsync(u => u.Email == dto.Email && u.IsDelete == false, ct))
            return ApiResponse.Error("Email đã tồn tại", 409);
        
        // Kiểm tra số điện thoại đã tồn tại
        if (!string.IsNullOrEmpty(dto.SoDienThoai) && 
            await _ctx.NguoiDungs.AnyAsync(u => u.SoDienThoai == dto.SoDienThoai && u.IsDelete == false, ct))
            return ApiResponse.Error("Số điện thoại đã tồn tại", 409);

        // Tạo người dùng mới
        var user = new NguoiDung
        {
            MaNguoiDung = Guid.NewGuid().ToString("N"),
            Ten = dto.Ten,
            Email = dto.Email,
            MatKhau = BCrypt.Net.BCrypt.HashPassword(dto.MatKhau),
            SoDienThoai = dto.SoDienThoai,
            NgaySinh = dto.NgaySinh,
            DiaChi = dto.DiaChi,
            MaVaiTro = "VT002", // Vai trò bác sĩ
            IsActive = true,
            IsDelete = false,
            NgayTao = DateTime.UtcNow
        };

        _ctx.NguoiDungs.Add(user);

        // Tạo bác sĩ mới
        var doctor = new BacSi
        {
            MaBacSi = Guid.NewGuid().ToString("N"),
            MaNguoiDung = user.MaNguoiDung,
            ChuyenMon = dto.ChuyenMon,
            SoGiayPhep = dto.SoGiayPhep,
            IsActive = true,
            IsDelete = false,
            NgayTao = DateTime.UtcNow
        };

        _ctx.BacSis.Add(doctor);
        await _ctx.SaveChangesAsync(ct);

        return ApiResponse.Success("Tạo bác sĩ thành công",
            new { 
                doctorId = doctor.MaBacSi, 
                userId = user.MaNguoiDung,
                userName = user.Ten,
                email = user.Email
            }, 201);
    }

    /* ---------- 4. Cập nhật ---------- */
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(
        string id,
        [FromBody] DoctorUpdateDto dto,
        CancellationToken ct)
    {
        var doctor = await _ctx.BacSis
            .FirstOrDefaultAsync(b => b.MaBacSi == id && b.IsDelete == false, ct);
        if (doctor == null)
            return ApiResponse.Error("Không tìm thấy bác sĩ", 404);

        doctor.ChuyenMon = dto.Specialty ?? doctor.ChuyenMon;
        doctor.SoGiayPhep = dto.LicenseNumber ?? doctor.SoGiayPhep;
        doctor.NgayCapNhat = DateTime.UtcNow;

        await _ctx.SaveChangesAsync(ct);
        return ApiResponse.Success("Cập nhật bác sĩ thành công", null, 200);
    }

    /* ---------- 5. Xóa mềm ---------- */
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id, CancellationToken ct)
    {
        var doctor = await _ctx.BacSis
            .FirstOrDefaultAsync(b => b.MaBacSi == id && b.IsDelete == false, ct);
        if (doctor == null)
            return ApiResponse.Error("Không tìm thấy bác sĩ", 404);

        // Kiểm tra bác sĩ có lịch làm việc trong tương lai không
        var hasUpcomingSchedules = await _ctx.LichLamViecs
            .AnyAsync(l => l.MaBacSi == id && 
                           l.IsDelete == false && 
                           l.NgayLam >= DateOnly.FromDateTime(DateTime.Today), ct);
        if (hasUpcomingSchedules)
            return ApiResponse.Error("Không thể xóa bác sĩ có lịch làm việc trong tương lai", 400);

        doctor.IsDelete = true;
        doctor.NgayCapNhat = DateTime.UtcNow;
        await _ctx.SaveChangesAsync(ct);
        return ApiResponse.Success("Xóa bác sĩ thành công", null, 200);
    }

    /* ---------- 6. Lấy lịch làm việc của bác sĩ ---------- */
    [HttpGet("{id}/schedules")]
    public async Task<IActionResult> GetSchedules(
        string id,
        [FromQuery] DateOnly? fromDate = null,
        [FromQuery] DateOnly? toDate = null,
        [FromQuery] int? page = 1,
        [FromQuery] int? pageSize = 20,
        CancellationToken ct = default)
    {
        if (!await _ctx.BacSis.AnyAsync(b => b.MaBacSi == id && b.IsDelete == false, ct))
            return ApiResponse.Error("Không tìm thấy bác sĩ", 404);

        // Mặc định lấy lịch từ ngày hiện tại đến 30 ngày sau
        var today = DateOnly.FromDateTime(DateTime.Today);
        fromDate ??= today;
        toDate ??= today.AddDays(30);

        var query = _ctx.LichLamViecs
            .Include(l => l.MaDiaDiemNavigation)
            .Where(l => l.MaBacSi == id && 
                        l.IsDelete == false &&
                        l.NgayLam >= fromDate &&
                        l.NgayLam <= toDate)
            .OrderBy(l => l.NgayLam)
            .ThenBy(l => l.GioBatDau);

        var paged = await query.ToPagedAsync(page!.Value, pageSize!.Value, ct);

        var data = paged.Data.Select(l => new DoctorScheduleSummaryDto(
            l.MaLichLamViec,
            l.NgayLam,
            l.GioBatDau,
            l.GioKetThuc,
            l.MaDiaDiem,
            l.MaDiaDiemNavigation.Ten,
            l.SoLuongCho,
            l.DaDat ?? 0,
            l.TrangThai)).ToList();

        return ApiResponse.Success(
            "Lấy lịch làm việc của bác sĩ thành công",
            new PagedResultDto<DoctorScheduleSummaryDto>(
                paged.TotalCount,
                paged.Page,
                paged.PageSize,
                paged.TotalPages,
                data));
    }

    /* ---------- 7. Lấy tất cả bác sĩ (không phân trang) ---------- */
    [HttpGet("all")]
    public async Task<IActionResult> GetAllNoPage(CancellationToken ct)
    {
        var doctors = await _ctx.BacSis
            .Include(b => b.MaNguoiDungNavigation)
                .ThenInclude(n => n.MaAnhNavigation)
            .Where(b => b.IsDelete == false)
            .OrderBy(b => b.MaNguoiDungNavigation.Ten)
            .Select(b => new DoctorDto(
                b.MaBacSi,
                b.MaNguoiDung,
                b.MaNguoiDungNavigation.Ten,
                b.MaNguoiDungNavigation.SoDienThoai,
                b.MaNguoiDungNavigation.Email,
                b.ChuyenMon,
                b.SoGiayPhep,
                b.MaNguoiDungNavigation.MaAnhNavigation.UrlAnh,
                b.NgayTao!.Value))
            .ToListAsync(ct);

        return ApiResponse.Success("Lấy danh sách bác sĩ thành công", doctors);
    }

    /* ---------- 8. Tìm kiếm bác sĩ theo tên hoặc chuyên môn ---------- */
    [HttpGet("search")]
    public async Task<IActionResult> Search(
        [FromQuery] string? query = "",
        [FromQuery] int? page = 1,
        [FromQuery] int? pageSize = 20,
        CancellationToken ct = default)
    {
        var searchQuery = _ctx.BacSis
            .Include(b => b.MaNguoiDungNavigation)
                .ThenInclude(n => n.MaAnhNavigation)
            .Where(b => b.IsDelete == false &&
                       (string.IsNullOrEmpty(query) ||
                        b.MaNguoiDungNavigation.Ten.Contains(query) ||
                        (b.ChuyenMon != null && b.ChuyenMon.Contains(query))))
            .OrderBy(b => b.MaNguoiDungNavigation.Ten);

        var paged = await searchQuery.ToPagedAsync(page!.Value, pageSize!.Value, ct);

        var data = paged.Data.Select(b => new DoctorDto(
            b.MaBacSi,
            b.MaNguoiDung,
            b.MaNguoiDungNavigation.Ten,
            b.MaNguoiDungNavigation.SoDienThoai,
            b.MaNguoiDungNavigation.Email,
            b.ChuyenMon,
            b.SoGiayPhep,
            b.MaNguoiDungNavigation.MaAnhNavigation?.UrlAnh,
            b.NgayTao!.Value)).ToList();

        return ApiResponse.Success(
            "Tìm kiếm bác sĩ thành công",
            new PagedResultDto<DoctorDto>(
                paged.TotalCount,
                paged.Page,
                paged.PageSize,
                paged.TotalPages,
                data));
    }
}