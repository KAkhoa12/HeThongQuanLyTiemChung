using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.DTOs.Kho;
using server.DTOs.Pagination;
using server.Helpers;
using server.Models;

namespace server.Controllers;

[ApiController]
[Route("api/phieu-thanh-ly")]
public class PhieuThanhLyController : ControllerBase
{
    private readonly HeThongQuanLyTiemChungContext _ctx;

    public PhieuThanhLyController(HeThongQuanLyTiemChungContext ctx) => _ctx = ctx;

    /* ---------- 1. Lấy danh sách phiếu thanh lý (có phân trang) ---------- */
    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? search = null,
        [FromQuery] string? maDiaDiem = null,
        [FromQuery] string? trangThai = null,
        CancellationToken ct = default)
    {
        var query = _ctx.PhieuThanhLies
            .Include(p => p.MaDiaDiemNavigation)
            .Where(p => p.IsDelete == false);

        // Tìm kiếm theo từ khóa
        if (!string.IsNullOrEmpty(search))
        {
            query = query.Where(p => 
                p.MaPhieuThanhLy.Contains(search) ||
                p.MaDiaDiemNavigation.Ten.Contains(search));
        }

        // Lọc theo địa điểm
        if (!string.IsNullOrEmpty(maDiaDiem))
        {
            query = query.Where(p => p.MaDiaDiem == maDiaDiem);
        }

        // Lọc theo trạng thái
        if (!string.IsNullOrEmpty(trangThai))
        {
            query = query.Where(p => p.TrangThai == trangThai);
        }

        var result = await query
            .OrderByDescending(p => p.NgayTao)
            .Select(p => new PhieuThanhLyDto(
                p.MaPhieuThanhLy,
                p.MaDiaDiem,
                p.NgayThanhLy,
                p.TrangThai,
                p.NgayTao,
                p.NgayCapNhat,
                p.MaDiaDiemNavigation.Ten
            ))
            .ToPagedAsync(page, pageSize, ct);

        return ApiResponse.Success("Lấy danh sách phiếu thanh lý thành công", result);
    }

    /* ---------- 2. Lấy chi tiết phiếu thanh lý theo ID ---------- */
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id, CancellationToken ct = default)
    {
        var phieuThanhLy = await _ctx.PhieuThanhLies
            .Include(p => p.MaDiaDiemNavigation)
            .Include(p => p.ChiTietThanhLies)
                .ThenInclude(ct => ct.MaLoNavigation)
                    .ThenInclude(l => l.MaVaccineNavigation)
            .FirstOrDefaultAsync(p => p.MaPhieuThanhLy == id && p.IsDelete == false, ct);

        if (phieuThanhLy == null)
            return ApiResponse.Error("Không tìm thấy phiếu thanh lý", 404);

        var chiTietThanhLies = phieuThanhLy.ChiTietThanhLies
            .Where(ct => ct.IsDelete == false)
            .Select(ct => new ChiTietThanhLyDto(
                ct.MaChiTiet,
                ct.MaPhieuThanhLy,
                ct.MaLo,
                ct.SoLuong,
                ct.LyDo,
                ct.MaLoNavigation.SoLo,
                ct.MaLoNavigation.MaVaccineNavigation.Ten
            ))
            .ToList();

        var result = new PhieuThanhLyDetailDto(
            phieuThanhLy.MaPhieuThanhLy,
            phieuThanhLy.MaDiaDiem,
            phieuThanhLy.NgayThanhLy,
            phieuThanhLy.TrangThai,
            phieuThanhLy.NgayTao,
            phieuThanhLy.NgayCapNhat,
            phieuThanhLy.MaDiaDiemNavigation?.Ten,
            chiTietThanhLies
        );

        return ApiResponse.Success("Lấy chi tiết phiếu thanh lý thành công", result);
    }

    /* ---------- 3. Tạo phiếu thanh lý mới ---------- */
    [HttpPost]
    public async Task<IActionResult> Create(
        [FromBody] PhieuThanhLyCreateDto dto,
        CancellationToken ct = default)
    {
        // Kiểm tra địa điểm tồn tại
        if (!string.IsNullOrEmpty(dto.MaDiaDiem))
        {
            if (!await _ctx.DiaDiems.AnyAsync(dd => dd.MaDiaDiem == dto.MaDiaDiem && dd.IsDelete == false, ct))
                return ApiResponse.Error("Địa điểm không tồn tại", 404);
        }

        // Kiểm tra các lô vaccine có đủ số lượng để thanh lý
        foreach (var chiTiet in dto.ChiTietThanhLies)
        {
            var tonKho = await _ctx.TonKhoLos
                .FirstOrDefaultAsync(tk => tk.MaLo == chiTiet.MaLo && tk.MaDiaDiem == dto.MaDiaDiem && tk.IsDelete == false, ct);
            
            if (tonKho == null || (tonKho.SoLuong ?? 0) < chiTiet.SoLuong)
                return ApiResponse.Error($"Lô vaccine {chiTiet.MaLo} không đủ số lượng để thanh lý", 400);
        }

        var phieuThanhLy = new PhieuThanhLy
        {
            MaPhieuThanhLy = Guid.NewGuid().ToString("N"),
            MaDiaDiem = dto.MaDiaDiem,
            NgayThanhLy = dto.NgayThanhLy ?? DateTime.UtcNow,
            TrangThai = "Chờ xác nhận",
            IsActive = true,
            IsDelete = false,
            NgayTao = DateTime.UtcNow
        };

        _ctx.PhieuThanhLies.Add(phieuThanhLy);

        // Tạo chi tiết phiếu thanh lý
        var chiTietThanhLies = new List<ChiTietThanhLy>();

        foreach (var chiTietDto in dto.ChiTietThanhLies)
        {
            var chiTiet = new ChiTietThanhLy
            {
                MaChiTiet = Guid.NewGuid().ToString("N"),
                MaPhieuThanhLy = phieuThanhLy.MaPhieuThanhLy,
                MaLo = chiTietDto.MaLo,
                SoLuong = chiTietDto.SoLuong,
                LyDo = chiTietDto.LyDo,
                IsActive = true,
                IsDelete = false,
                NgayTao = DateTime.UtcNow
            };

            chiTietThanhLies.Add(chiTiet);

            // Cập nhật số lượng tồn kho
            var tonKho = await _ctx.TonKhoLos
                .FirstOrDefaultAsync(tk => tk.MaLo == chiTietDto.MaLo && tk.MaDiaDiem == dto.MaDiaDiem && tk.IsDelete == false, ct);
            
            if (tonKho != null)
            {
                tonKho.SoLuong = (tonKho.SoLuong ?? 0) - chiTietDto.SoLuong;
                tonKho.NgayCapNhat = DateTime.UtcNow;
            }
        }

        _ctx.ChiTietThanhLies.AddRange(chiTietThanhLies);

        await _ctx.SaveChangesAsync(ct);

        return ApiResponse.Success("Tạo phiếu thanh lý thành công", 
            new { phieuThanhLy.MaPhieuThanhLy }, 201);
    }

    /* ---------- 4. Cập nhật phiếu thanh lý ---------- */
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(
        string id,
        [FromBody] PhieuThanhLyUpdateDto dto,
        CancellationToken ct = default)
    {
        var phieuThanhLy = await _ctx.PhieuThanhLies
            .FirstOrDefaultAsync(p => p.MaPhieuThanhLy == id && p.IsDelete == false, ct);

        if (phieuThanhLy == null)
            return ApiResponse.Error("Không tìm thấy phiếu thanh lý", 404);

        // Kiểm tra địa điểm tồn tại
        if (!string.IsNullOrEmpty(dto.MaDiaDiem))
        {
            if (!await _ctx.DiaDiems.AnyAsync(dd => dd.MaDiaDiem == dto.MaDiaDiem && dd.IsDelete == false, ct))
                return ApiResponse.Error("Địa điểm không tồn tại", 404);
            phieuThanhLy.MaDiaDiem = dto.MaDiaDiem;
        }

        if (dto.NgayThanhLy.HasValue)
            phieuThanhLy.NgayThanhLy = dto.NgayThanhLy.Value;

        if (!string.IsNullOrEmpty(dto.TrangThai))
            phieuThanhLy.TrangThai = dto.TrangThai;

        phieuThanhLy.NgayCapNhat = DateTime.UtcNow;

        await _ctx.SaveChangesAsync(ct);
        return ApiResponse.Success("Cập nhật phiếu thanh lý thành công", null);
    }

    /* ---------- 5. Xóa phiếu thanh lý (soft delete) ---------- */
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id, CancellationToken ct = default)
    {
        var phieuThanhLy = await _ctx.PhieuThanhLies
            .FirstOrDefaultAsync(p => p.MaPhieuThanhLy == id && p.IsDelete == false, ct);

        if (phieuThanhLy == null)
            return ApiResponse.Error("Không tìm thấy phiếu thanh lý", 404);

        phieuThanhLy.IsDelete = true;
        phieuThanhLy.NgayCapNhat = DateTime.UtcNow;

        // Xóa các chi tiết phiếu thanh lý
        var chiTietThanhLies = await _ctx.ChiTietThanhLies
            .Where(ct => ct.MaPhieuThanhLy == id && ct.IsDelete == false)
            .ToListAsync(ct);

        foreach (var chiTiet in chiTietThanhLies)
        {
            chiTiet.IsDelete = true;
            chiTiet.NgayCapNhat = DateTime.UtcNow;
        }

        await _ctx.SaveChangesAsync(ct);
        return ApiResponse.Success("Xóa phiếu thanh lý thành công", null);
    }

    /* ---------- 6. Xác nhận phiếu thanh lý ---------- */
    [HttpPost("{id}/confirm")]
    public async Task<IActionResult> Confirm(string id, CancellationToken ct = default)
    {
        var phieuThanhLy = await _ctx.PhieuThanhLies
            .FirstOrDefaultAsync(p => p.MaPhieuThanhLy == id && p.IsDelete == false, ct);

        if (phieuThanhLy == null)
            return ApiResponse.Error("Không tìm thấy phiếu thanh lý", 404);

        if (phieuThanhLy.TrangThai == "Đã xác nhận")
            return ApiResponse.Error("Phiếu thanh lý đã được xác nhận", 400);

        phieuThanhLy.TrangThai = "Đã xác nhận";
        phieuThanhLy.NgayCapNhat = DateTime.UtcNow;

        await _ctx.SaveChangesAsync(ct);
        return ApiResponse.Success("Xác nhận phiếu thanh lý thành công", null);
    }
} 