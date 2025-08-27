using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.DTOs.Kho;
using server.DTOs.Pagination;
using server.Helpers;
using server.Models;

namespace server.Controllers;

[ApiController]
[Route("api/ton-kho-lo")]
public class TonKhoLoController : ControllerBase
{
    private readonly HeThongQuanLyTiemChungContext _ctx;

    public TonKhoLoController(HeThongQuanLyTiemChungContext ctx) => _ctx = ctx;

    /* ---------- 1. Lấy danh sách tồn kho lô (có phân trang) ---------- */
    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? search = null,
        [FromQuery] string? maDiaDiem = null,
        [FromQuery] string? maLo = null,
        CancellationToken ct = default)
    {
        var query = _ctx.TonKhoLos
            .Include(tk => tk.MaDiaDiemNavigation)
            .Include(tk => tk.MaLoNavigation)
                .ThenInclude(l => l.MaVaccineNavigation)
            .Where(tk => tk.IsDelete == false);

        // Tìm kiếm theo từ khóa
        if (!string.IsNullOrEmpty(search))
        {
            query = query.Where(tk => 
                tk.MaTonKho.Contains(search) ||
                tk.MaLoNavigation.SoLo.Contains(search) ||
                tk.MaLoNavigation.MaVaccineNavigation.Ten.Contains(search) ||
                tk.MaDiaDiemNavigation.Ten.Contains(search));
        }

        // Lọc theo địa điểm
        if (!string.IsNullOrEmpty(maDiaDiem))
        {
            query = query.Where(tk => tk.MaDiaDiem == maDiaDiem);
        }

        // Lọc theo lô
        if (!string.IsNullOrEmpty(maLo))
        {
            query = query.Where(tk => tk.MaLo == maLo);
        }

        var result = await query
            .OrderByDescending(tk => tk.NgayTao)
            .Select(tk => new TonKhoLoDto(
                tk.MaTonKho,
                tk.MaDiaDiem,
                tk.MaLo,
                tk.SoLuong,
                tk.NgayTao,
                tk.NgayCapNhat,
                tk.MaDiaDiemNavigation.Ten,
                tk.MaLoNavigation.SoLo,
                tk.MaLoNavigation.MaVaccineNavigation.Ten
            ))
            .ToPagedAsync(page, pageSize, ct);

        return ApiResponse.Success("Lấy danh sách tồn kho lô thành công", result);
    }

    /* ---------- 2. Lấy chi tiết tồn kho lô theo ID ---------- */
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id, CancellationToken ct = default)
    {
        var tonKhoLo = await _ctx.TonKhoLos
            .Include(tk => tk.MaDiaDiemNavigation)
            .Include(tk => tk.MaLoNavigation)
                .ThenInclude(l => l.MaVaccineNavigation)
            .FirstOrDefaultAsync(tk => tk.MaTonKho == id && tk.IsDelete == false, ct);

        if (tonKhoLo == null)
            return ApiResponse.Error("Không tìm thấy tồn kho lô", 404);

        var result = new TonKhoLoDto(
            tonKhoLo.MaTonKho,
            tonKhoLo.MaDiaDiem,
            tonKhoLo.MaLo,
            tonKhoLo.SoLuong,
            tonKhoLo.NgayTao,
            tonKhoLo.NgayCapNhat,
            tonKhoLo.MaDiaDiemNavigation?.Ten,
            tonKhoLo.MaLoNavigation?.SoLo,
            tonKhoLo.MaLoNavigation?.MaVaccineNavigation?.Ten
        );

        return ApiResponse.Success("Lấy chi tiết tồn kho lô thành công", result);
    }

    /* ---------- 3. Tạo tồn kho lô mới ---------- */
    [HttpPost]
    public async Task<IActionResult> Create(
        [FromBody] TonKhoLoCreateDto dto,
        CancellationToken ct = default)
    {
        // Kiểm tra địa điểm tồn tại
        if (!await _ctx.DiaDiems.AnyAsync(dd => dd.MaDiaDiem == dto.MaDiaDiem && dd.IsDelete == false, ct))
            return ApiResponse.Error("Địa điểm không tồn tại", 404);

        // Kiểm tra lô vaccine tồn tại
        if (!await _ctx.LoVaccines.AnyAsync(l => l.MaLo == dto.MaLo && l.IsDelete == false, ct))
            return ApiResponse.Error("Lô vaccine không tồn tại", 404);

        // Kiểm tra đã tồn tại tồn kho cho lô này tại địa điểm này chưa
        var existingTonKho = await _ctx.TonKhoLos
            .FirstOrDefaultAsync(tk => tk.MaLo == dto.MaLo && tk.MaDiaDiem == dto.MaDiaDiem && tk.IsDelete == false, ct);

        if (existingTonKho != null)
            return ApiResponse.Error("Đã tồn tại tồn kho cho lô vaccine này tại địa điểm này", 409);

        var tonKhoLo = new TonKhoLo
        {
            MaTonKho = Guid.NewGuid().ToString("N"),
            MaDiaDiem = dto.MaDiaDiem,
            MaLo = dto.MaLo,
            SoLuong = dto.SoLuong,
            IsActive = true,
            IsDelete = false,
            NgayTao = DateTime.UtcNow
        };

        _ctx.TonKhoLos.Add(tonKhoLo);
        await _ctx.SaveChangesAsync(ct);

        return ApiResponse.Success("Tạo tồn kho lô thành công", 
            new { tonKhoLo.MaTonKho }, 201);
    }

    /* ---------- 4. Cập nhật tồn kho lô ---------- */
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(
        string id,
        [FromBody] TonKhoLoUpdateDto dto,
        CancellationToken ct = default)
    {
        var tonKhoLo = await _ctx.TonKhoLos
            .FirstOrDefaultAsync(tk => tk.MaTonKho == id && tk.IsDelete == false, ct);

        if (tonKhoLo == null)
            return ApiResponse.Error("Không tìm thấy tồn kho lô", 404);

        if (dto.SoLuong.HasValue)
        {
            // Kiểm tra số lượng không âm
            if (dto.SoLuong.Value < 0)
                return ApiResponse.Error("Số lượng không thể âm", 400);

            tonKhoLo.SoLuong = dto.SoLuong.Value;
        }

        tonKhoLo.NgayCapNhat = DateTime.UtcNow;

        await _ctx.SaveChangesAsync(ct);
        return ApiResponse.Success("Cập nhật tồn kho lô thành công", null);
    }

    /* ---------- 5. Xóa tồn kho lô (soft delete) ---------- */
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id, CancellationToken ct = default)
    {
        var tonKhoLo = await _ctx.TonKhoLos
            .FirstOrDefaultAsync(tk => tk.MaTonKho == id && tk.IsDelete == false, ct);

        if (tonKhoLo == null)
            return ApiResponse.Error("Không tìm thấy tồn kho lô", 404);

        tonKhoLo.IsDelete = true;
        tonKhoLo.NgayCapNhat = DateTime.UtcNow;

        await _ctx.SaveChangesAsync(ct);
        return ApiResponse.Success("Xóa tồn kho lô thành công", null);
    }

    /* ---------- 6. Lấy tồn kho theo địa điểm ---------- */
    [HttpGet("by-dia-diem/{diaDiemId}")]
    public async Task<IActionResult> GetByDiaDiem(
        string diaDiemId,
        CancellationToken ct = default)
    {
        var tonKhoLos = await _ctx.TonKhoLos
            .Include(tk => tk.MaDiaDiemNavigation)
            .Include(tk => tk.MaLoNavigation)
                .ThenInclude(l => l.MaVaccineNavigation)
            .Where(tk => tk.MaDiaDiem == diaDiemId && tk.IsDelete == false && tk.SoLuong > 0)
            .OrderBy(tk => tk.MaLoNavigation.MaVaccineNavigation.Ten)
            .Select(tk => new TonKhoLoDto(
                tk.MaTonKho,
                tk.MaDiaDiem,
                tk.MaLo,
                tk.SoLuong,
                tk.NgayTao,
                tk.NgayCapNhat,
                tk.MaDiaDiemNavigation.Ten,
                tk.MaLoNavigation.SoLo,
                tk.MaLoNavigation.MaVaccineNavigation.Ten
            ))
            .ToListAsync(ct);

        return ApiResponse.Success("Lấy tồn kho theo địa điểm thành công", tonKhoLos);
    }

    /* ---------- 7. Lấy tồn kho theo lô vaccine ---------- */
    [HttpGet("by-lo/{loId}")]
    public async Task<IActionResult> GetByLo(
        string loId,
        CancellationToken ct = default)
    {
        var tonKhoLos = await _ctx.TonKhoLos
            .Include(tk => tk.MaDiaDiemNavigation)
            .Include(tk => tk.MaLoNavigation)
                .ThenInclude(l => l.MaVaccineNavigation)
            .Where(tk => tk.MaLo == loId && tk.IsDelete == false)
            .OrderBy(tk => tk.MaDiaDiemNavigation.Ten)
            .Select(tk => new TonKhoLoDto(
                tk.MaTonKho,
                tk.MaDiaDiem,
                tk.MaLo,
                tk.SoLuong,
                tk.NgayTao,
                tk.NgayCapNhat,
                tk.MaDiaDiemNavigation.Ten,
                tk.MaLoNavigation.SoLo,
                tk.MaLoNavigation.MaVaccineNavigation.Ten
            ))
            .ToListAsync(ct);

        return ApiResponse.Success("Lấy tồn kho theo lô vaccine thành công", tonKhoLos);
    }

    /* ---------- 8. Lấy tổng quan tồn kho ---------- */
    [HttpGet("summary")]
    public async Task<IActionResult> GetSummary(CancellationToken ct = default)
    {
        var summary = await _ctx.TonKhoLos
            .Include(tk => tk.MaDiaDiemNavigation)
            .Include(tk => tk.MaLoNavigation)
                .ThenInclude(l => l.MaVaccineNavigation)
            .Where(tk => tk.IsDelete == false && tk.SoLuong > 0)
            .GroupBy(tk => new { tk.MaDiaDiem, tk.MaDiaDiemNavigation.Ten })
            .Select(g => new TonKhoSummaryDto(
                g.Key.MaDiaDiem,
                g.Key.Ten,
                g.Count(),
                g.Sum(tk => tk.SoLuong ?? 0),
                g.Sum(tk => (tk.SoLuong ?? 0) * (tk.MaLoNavigation.GiaNhap ?? 0))
            ))
            .ToListAsync(ct);

        return ApiResponse.Success("Lấy tổng quan tồn kho thành công", summary);
    }

    /* ---------- 9. Cập nhật số lượng tồn kho (dùng cho nhập/xuất) ---------- */
    [HttpPost("update-quantity")]
    public async Task<IActionResult> UpdateQuantity(
        [FromBody] TonKhoLoUpdateDto dto,
        CancellationToken ct = default)
    {
        if (string.IsNullOrEmpty(dto.MaLo) || string.IsNullOrEmpty(dto.MaDiaDiem))
            return ApiResponse.Error("Mã lô và mã địa điểm không được để trống", 400);

        var tonKhoLo = await _ctx.TonKhoLos
            .FirstOrDefaultAsync(tk => tk.MaLo == dto.MaLo && tk.MaDiaDiem == dto.MaDiaDiem && tk.IsDelete == false, ct);

        if (tonKhoLo == null)
            return ApiResponse.Error("Không tìm thấy tồn kho lô", 404);

        if (dto.SoLuong.HasValue)
        {
            // Kiểm tra số lượng không âm
            if (dto.SoLuong.Value < 0)
                return ApiResponse.Error("Số lượng không thể âm", 400);

            tonKhoLo.SoLuong = dto.SoLuong.Value;
            tonKhoLo.NgayCapNhat = DateTime.UtcNow;
        }

        await _ctx.SaveChangesAsync(ct);
        return ApiResponse.Success("Cập nhật số lượng tồn kho thành công", null);
    }
} 