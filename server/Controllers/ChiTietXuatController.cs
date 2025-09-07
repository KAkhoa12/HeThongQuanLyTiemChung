using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.DTOs.Kho;
using server.DTOs.Pagination;
using server.Helpers;
using server.Models;

namespace server.Controllers;

[ApiController]
[Route("api/chi-tiet-xuat")]
public class ChiTietXuatController : ControllerBase
{
    private readonly HeThongQuanLyTiemChungContext _ctx;

    public ChiTietXuatController(HeThongQuanLyTiemChungContext ctx) => _ctx = ctx;

    /* ---------- 1. Lấy danh sách chi tiết xuất (có phân trang) ---------- */
    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? search = null,
        [FromQuery] string? maPhieuXuat = null,
        [FromQuery] string? maLo = null,
        CancellationToken ct = default)
    {
        var query = _ctx.ChiTietXuats
            .Include(c => c.MaPhieuXuatNavigation)
            .Include(c => c.MaLoNavigation)
                .ThenInclude(l => l.MaVaccineNavigation)
            .Where(c => c.IsDelete == false);

        // Tìm kiếm theo từ khóa
        if (!string.IsNullOrEmpty(search))
        {
            query = query.Where(c => 
                c.MaChiTiet.Contains(search) ||
                c.MaLoNavigation.SoLo.Contains(search) ||
                c.MaLoNavigation.MaVaccineNavigation.Ten.Contains(search));
        }

        // Lọc theo phiếu xuất
        if (!string.IsNullOrEmpty(maPhieuXuat))
        {
            query = query.Where(c => c.MaPhieuXuat == maPhieuXuat);
        }

        // Lọc theo lô
        if (!string.IsNullOrEmpty(maLo))
        {
            query = query.Where(c => c.MaLo == maLo);
        }

        var result = await query.ToPagedAsync(page, pageSize, ct);

        var chiTietXuats = result.Data.Select(c => new ChiTietXuatDto(
            c.MaChiTiet,
            c.MaPhieuXuat ?? "",
            c.MaLo ?? "",
            c.SoLuong,
            c.MaLoNavigation?.SoLo,
            c.MaLoNavigation?.MaVaccineNavigation?.Ten
        )).ToList();

        return ApiResponse.Success("Lấy danh sách chi tiết xuất thành công", new PagedResultDto<ChiTietXuatDto>(
            result.TotalCount,
            result.Page,
            result.PageSize,
            result.TotalPages,
            chiTietXuats
        ));
    }

    /* ---------- 2. Lấy chi tiết xuất theo ID ---------- */
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id, CancellationToken ct = default)
    {
        var chiTietXuat = await _ctx.ChiTietXuats
            .Include(c => c.MaPhieuXuatNavigation)
            .Include(c => c.MaLoNavigation)
                .ThenInclude(l => l.MaVaccineNavigation)
            .Where(c => c.MaChiTiet == id && c.IsDelete == false)
            .FirstOrDefaultAsync(ct);

        if (chiTietXuat == null)
        {
            return ApiResponse.Error("Không tìm thấy chi tiết xuất", 404);
        }

        var chiTietXuatDto = new ChiTietXuatDto(
            chiTietXuat.MaChiTiet,
            chiTietXuat.MaPhieuXuat ?? "",
            chiTietXuat.MaLo ?? "",
            chiTietXuat.SoLuong,
            chiTietXuat.MaLoNavigation?.SoLo,
            chiTietXuat.MaLoNavigation?.MaVaccineNavigation?.Ten
        );

        return ApiResponse.Success("Lấy chi tiết xuất thành công", chiTietXuatDto);
    }

    /* ---------- 3. Tạo chi tiết xuất mới ---------- */
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] ChiTietXuatCreateDto dto, CancellationToken ct = default)
    {
        // Kiểm tra lô vaccine có tồn tại không
        var loVaccine = await _ctx.LoVaccines
            .Where(l => l.MaLo == dto.MaLo && l.IsDelete == false)
            .FirstOrDefaultAsync(ct);

        if (loVaccine == null)
        {
            return ApiResponse.Error("Không tìm thấy lô vaccine", 404);
        }

        // Kiểm tra tồn kho
        var tonKho = await _ctx.TonKhoLos
            .Where(tk => tk.MaLo == dto.MaLo && tk.IsDelete == false)
            .SumAsync(tk => tk.SoLuong, ct);

        if (tonKho < dto.SoLuong)
        {
            return ApiResponse.Error("Số lượng xuất vượt quá tồn kho", 400);
        }

        var chiTietXuat = new ChiTietXuat
        {
            MaChiTiet = Guid.NewGuid().ToString(),
            MaLo = dto.MaLo,
            SoLuong = dto.SoLuong,
            IsDelete = false,
            IsActive = true,
            NgayTao = DateTime.Now,
            NgayCapNhat = DateTime.Now
        };

        _ctx.ChiTietXuats.Add(chiTietXuat);
        await _ctx.SaveChangesAsync(ct);

        return ApiResponse.Success("Tạo chi tiết xuất thành công", new { maChiTiet = chiTietXuat.MaChiTiet });
    }

    /* ---------- 4. Cập nhật chi tiết xuất ---------- */
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] ChiTietXuatCreateDto dto, CancellationToken ct = default)
    {
        var chiTietXuat = await _ctx.ChiTietXuats
            .Where(c => c.MaChiTiet == id && c.IsDelete == false)
            .FirstOrDefaultAsync(ct);

        if (chiTietXuat == null)
        {
            return ApiResponse.Error("Không tìm thấy chi tiết xuất", 404);
        }

        // Kiểm tra lô vaccine có tồn tại không
        var loVaccine = await _ctx.LoVaccines
            .Where(l => l.MaLo == dto.MaLo && l.IsDelete == false)
            .FirstOrDefaultAsync(ct);

        if (loVaccine == null)
        {
            return ApiResponse.Error("Không tìm thấy lô vaccine", 404);
        }

        // Kiểm tra tồn kho (trừ số lượng hiện tại)
        var tonKho = await _ctx.TonKhoLos
            .Where(tk => tk.MaLo == dto.MaLo && tk.IsDelete == false)
            .SumAsync(tk => tk.SoLuong, ct);

        var soLuongHienTai = chiTietXuat.SoLuong ?? 0;
        var tonKhoKhaDung = tonKho + soLuongHienTai;

        if (tonKhoKhaDung < dto.SoLuong)
        {
            return ApiResponse.Error("Số lượng xuất vượt quá tồn kho", 400);
        }

        chiTietXuat.MaLo = dto.MaLo;
        chiTietXuat.SoLuong = dto.SoLuong;
        chiTietXuat.NgayCapNhat = DateTime.Now;

        await _ctx.SaveChangesAsync(ct);

        return ApiResponse.Success("Cập nhật chi tiết xuất thành công");
    }

    /* ---------- 5. Xóa chi tiết xuất (soft delete) ---------- */
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id, CancellationToken ct = default)
    {
        var chiTietXuat = await _ctx.ChiTietXuats
            .Where(c => c.MaChiTiet == id && c.IsDelete == false)
            .FirstOrDefaultAsync(ct);

        if (chiTietXuat == null)
        {
            return ApiResponse.Error("Không tìm thấy chi tiết xuất", 404);
        }

        chiTietXuat.IsDelete = true;
        chiTietXuat.NgayCapNhat = DateTime.Now;

        await _ctx.SaveChangesAsync(ct);

        return ApiResponse.Success("Xóa chi tiết xuất thành công");
    }

    /* ---------- 6. Lấy chi tiết xuất theo phiếu xuất ---------- */
    [HttpGet("phieu-xuat/{maPhieuXuat}")]
    public async Task<IActionResult> GetByPhieuXuat(string maPhieuXuat, CancellationToken ct = default)
    {
        var chiTietXuats = await _ctx.ChiTietXuats
            .Include(c => c.MaLoNavigation)
                .ThenInclude(l => l.MaVaccineNavigation)
            .Where(c => c.MaPhieuXuat == maPhieuXuat && c.IsDelete == false)
            .ToListAsync(ct);

        var chiTietXuatDtos = chiTietXuats.Select(c => new ChiTietXuatDto(
            c.MaChiTiet,
            c.MaPhieuXuat ?? "",
            c.MaLo ?? "",
            c.SoLuong,
            c.MaLoNavigation?.SoLo,
            c.MaLoNavigation?.MaVaccineNavigation?.Ten
        )).ToList();

        return ApiResponse.Success("Lấy chi tiết xuất theo phiếu xuất thành công", chiTietXuatDtos);
    }
}