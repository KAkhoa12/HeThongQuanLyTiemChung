using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.DTOs.PhieuTiem;
using server.DTOs.Pagination;
using server.Helpers;
using server.Models;

namespace server.Controllers;

[ApiController]
[Route("api/chi-tiet-phieu-tiem")]
public class ChiTietPhieuTiemController : ControllerBase
{
    private readonly HeThongQuanLyTiemChungContext _ctx;

    public ChiTietPhieuTiemController(HeThongQuanLyTiemChungContext ctx) => _ctx = ctx;

    /* ---------- 1. Lấy danh sách chi tiết phiếu tiêm (có phân trang) ---------- */
    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? maPhieuTiem = null,
        [FromQuery] string? maVaccine = null,
        CancellationToken ct = default)
    {
        var query = _ctx.ChiTietPhieuTiems
            .Include(c => c.MaVaccineNavigation)
            .Where(c => c.IsDelete == false);

        // Filter by maPhieuTiem
        if (!string.IsNullOrEmpty(maPhieuTiem))
        {
            query = query.Where(c => c.MaPhieuTiem == maPhieuTiem);
        }

        // Filter by maVaccine
        if (!string.IsNullOrEmpty(maVaccine))
        {
            query = query.Where(c => c.MaVaccine == maVaccine);
        }

        var result = await query
            .OrderBy(c => c.MaPhieuTiem)
            .ThenBy(c => c.ThuTu)
            .ToPagedAsync(page, pageSize, ct);

        var data = result.Data.Select(c => new ChiTietPhieuTiemDto
        {
            MaChiTietPhieuTiem = c.MaChiTietPhieuTiem,
            MaPhieuTiem = c.MaPhieuTiem,
            MaVaccine = c.MaVaccine,
            MuiTiemThucTe = c.MuiTiemThucTe,
            ThuTu = c.ThuTu,
            IsDelete = c.IsDelete,
            IsActive = c.IsActive,
            NgayTao = c.NgayTao,
            NgayCapNhat = c.NgayCapNhat,
            TenVaccine = c.MaVaccineNavigation?.Ten,
            NhaSanXuat = c.MaVaccineNavigation?.NhaSanXuat
        }).ToList();

        var pagedResult = new PagedResultDto<ChiTietPhieuTiemDto>(
            result.TotalCount,
            result.Page,
            result.PageSize,
            result.TotalPages,
            data
        );

        return ApiResponse.Success("Lấy danh sách chi tiết phiếu tiêm thành công", pagedResult);
    }

    /* ---------- 2. Lấy chi tiết theo ID ---------- */
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id, CancellationToken ct)
    {
        var chiTiet = await _ctx.ChiTietPhieuTiems
            .Include(c => c.MaVaccineNavigation)
            .FirstOrDefaultAsync(c => c.MaChiTietPhieuTiem == id && c.IsDelete == false, ct);

        if (chiTiet == null)
            return ApiResponse.Error("Không tìm thấy chi tiết phiếu tiêm", 404);

        var dto = new ChiTietPhieuTiemDto
        {
            MaChiTietPhieuTiem = chiTiet.MaChiTietPhieuTiem,
            MaPhieuTiem = chiTiet.MaPhieuTiem,
            MaVaccine = chiTiet.MaVaccine,
            MuiTiemThucTe = chiTiet.MuiTiemThucTe,
            ThuTu = chiTiet.ThuTu,
            IsDelete = chiTiet.IsDelete,
            IsActive = chiTiet.IsActive,
            NgayTao = chiTiet.NgayTao,
            NgayCapNhat = chiTiet.NgayCapNhat,
            TenVaccine = chiTiet.MaVaccineNavigation?.Ten,
            NhaSanXuat = chiTiet.MaVaccineNavigation?.NhaSanXuat
        };

        return ApiResponse.Success("Lấy chi tiết phiếu tiêm thành công", dto);
    }

    /* ---------- 3. Tạo mới ---------- */
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] ChiTietPhieuTiemCreateDto dto, CancellationToken ct)
    {
        // Kiểm tra phiếu tiêm tồn tại
        if (!await _ctx.PhieuTiems.AnyAsync(p => p.MaPhieuTiem == dto.MaPhieuTiem && p.IsDelete == false, ct))
            return ApiResponse.Error("Phiếu tiêm không tồn tại", 404);

        // Kiểm tra vaccine tồn tại
        if (!await _ctx.Vaccines.AnyAsync(v => v.MaVaccine == dto.MaVaccine && v.IsDelete == false, ct))
            return ApiResponse.Error("Vaccine không tồn tại", 404);

        // Kiểm tra thứ tự không trùng lặp trong cùng phiếu tiêm
        if (await _ctx.ChiTietPhieuTiems.AnyAsync(c => 
            c.MaPhieuTiem == dto.MaPhieuTiem && 
            c.ThuTu == dto.ThuTu && 
            c.IsDelete == false, ct))
            return ApiResponse.Error("Thứ tự đã tồn tại trong phiếu tiêm này", 409);

        var chiTiet = new ChiTietPhieuTiem
        {
            MaChiTietPhieuTiem = Guid.NewGuid().ToString("N"),
            MaPhieuTiem = dto.MaPhieuTiem,
            MaVaccine = dto.MaVaccine,
            MuiTiemThucTe = dto.MuiTiemThucTe,
            ThuTu = dto.ThuTu,
            IsActive = true,
            IsDelete = false,
            NgayTao = DateTime.UtcNow
        };

        _ctx.ChiTietPhieuTiems.Add(chiTiet);
        await _ctx.SaveChangesAsync(ct);

        return ApiResponse.Success("Tạo chi tiết phiếu tiêm thành công", new { chiTiet.MaChiTietPhieuTiem }, 201);
    }

    /* ---------- 4. Cập nhật ---------- */
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] ChiTietPhieuTiemUpdateDto dto, CancellationToken ct)
    {
        var chiTiet = await _ctx.ChiTietPhieuTiems
            .FirstOrDefaultAsync(c => c.MaChiTietPhieuTiem == id && c.IsDelete == false, ct);

        if (chiTiet == null)
            return ApiResponse.Error("Không tìm thấy chi tiết phiếu tiêm", 404);

        // Kiểm tra vaccine tồn tại nếu có cập nhật
        if (!string.IsNullOrEmpty(dto.MaVaccine))
        {
            if (!await _ctx.Vaccines.AnyAsync(v => v.MaVaccine == dto.MaVaccine && v.IsDelete == false, ct))
                return ApiResponse.Error("Vaccine không tồn tại", 404);
            chiTiet.MaVaccine = dto.MaVaccine;
        }

        // Kiểm tra thứ tự không trùng lặp nếu có cập nhật
        if (dto.ThuTu.HasValue)
        {
            if (await _ctx.ChiTietPhieuTiems.AnyAsync(c => 
                c.MaPhieuTiem == chiTiet.MaPhieuTiem && 
                c.ThuTu == dto.ThuTu.Value && 
                c.MaChiTietPhieuTiem != id &&
                c.IsDelete == false, ct))
                return ApiResponse.Error("Thứ tự đã tồn tại trong phiếu tiêm này", 409);
            chiTiet.ThuTu = dto.ThuTu.Value;
        }

        if (dto.MuiTiemThucTe.HasValue)
            chiTiet.MuiTiemThucTe = dto.MuiTiemThucTe.Value;

        if (dto.IsActive.HasValue)
            chiTiet.IsActive = dto.IsActive.Value;

        chiTiet.NgayCapNhat = DateTime.UtcNow;
        await _ctx.SaveChangesAsync(ct);

        return ApiResponse.Success("Cập nhật chi tiết phiếu tiêm thành công");
    }

    /* ---------- 5. Xóa (soft delete) ---------- */
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id, CancellationToken ct)
    {
        var chiTiet = await _ctx.ChiTietPhieuTiems
            .FirstOrDefaultAsync(c => c.MaChiTietPhieuTiem == id && c.IsDelete == false, ct);

        if (chiTiet == null)
            return ApiResponse.Error("Không tìm thấy chi tiết phiếu tiêm", 404);

        chiTiet.IsDelete = true;
        chiTiet.NgayCapNhat = DateTime.UtcNow;
        await _ctx.SaveChangesAsync(ct);

        return ApiResponse.Success("Xóa chi tiết phiếu tiêm thành công");
    }

    /* ---------- 6. Lấy chi tiết theo phiếu tiêm ---------- */
    [HttpGet("by-phieu-tiem/{maPhieuTiem}")]
    public async Task<IActionResult> GetByPhieuTiem(string maPhieuTiem, CancellationToken ct)
    {
        var chiTiets = await _ctx.ChiTietPhieuTiems
            .Include(c => c.MaVaccineNavigation)
            .Where(c => c.MaPhieuTiem == maPhieuTiem && c.IsDelete == false)
            .OrderBy(c => c.ThuTu)
            .Select(c => new ChiTietPhieuTiemDto
            {
                MaChiTietPhieuTiem = c.MaChiTietPhieuTiem,
                MaPhieuTiem = c.MaPhieuTiem,
                MaVaccine = c.MaVaccine,
                MuiTiemThucTe = c.MuiTiemThucTe,
                ThuTu = c.ThuTu,
                IsDelete = c.IsDelete,
                IsActive = c.IsActive,
                NgayTao = c.NgayTao,
                NgayCapNhat = c.NgayCapNhat,
                TenVaccine = c.MaVaccineNavigation.Ten,
                NhaSanXuat = c.MaVaccineNavigation.NhaSanXuat
            })
            .ToListAsync(ct);

        return ApiResponse.Success("Lấy danh sách chi tiết phiếu tiêm thành công", chiTiets);
    }
} 