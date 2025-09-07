using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.DTOs.Kho;
using server.DTOs.Pagination;
using server.Helpers;
using server.Models;

namespace server.Controllers;

[ApiController]
[Route("api/chi-tiet-nhap")]
public class ChiTietNhapController : ControllerBase
{
    private readonly HeThongQuanLyTiemChungContext _ctx;

    public ChiTietNhapController(HeThongQuanLyTiemChungContext ctx) => _ctx = ctx;

    /* ---------- 1. Lấy danh sách chi tiết nhập (có phân trang) ---------- */
    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? search = null,
        [FromQuery] string? maPhieuNhap = null,
        [FromQuery] string? maLo = null,
        CancellationToken ct = default)
    {
        var query = _ctx.ChiTietNhaps
            .Include(c => c.MaPhieuNhapNavigation)
            .Include(c => c.MaLoNavigation)
                .ThenInclude(l => l.MaVaccineNavigation)
            .Include(c => c.MaLoNavigation)
                .ThenInclude(l => l.MaNhaCungCapNavigation)
            .Where(c => c.IsDelete == false);

        // Tìm kiếm theo từ khóa
        if (!string.IsNullOrEmpty(search))
        {
            query = query.Where(c => 
                c.MaChiTiet.Contains(search) ||
                c.MaLoNavigation.SoLo.Contains(search) ||
                c.MaLoNavigation.MaVaccineNavigation.Ten.Contains(search));
        }

        // Lọc theo phiếu nhập
        if (!string.IsNullOrEmpty(maPhieuNhap))
        {
            query = query.Where(c => c.MaPhieuNhap == maPhieuNhap);
        }

        // Lọc theo lô
        if (!string.IsNullOrEmpty(maLo))
        {
            query = query.Where(c => c.MaLo == maLo);
        }

        var result = await query.ToPagedAsync(page, pageSize, ct);

        var chiTietNhaps = result.Data.Select(c => new ChiTietNhapDto(
            c.MaChiTiet,
            c.MaPhieuNhap ?? "",
            c.MaLo ?? "",
            c.SoLuong,
            c.Gia,
            c.MaLoNavigation?.SoLo,
            c.MaLoNavigation?.MaVaccineNavigation?.Ten,
            c.MaLoNavigation?.MaNhaCungCapNavigation?.Ten
        )).ToList();

        return ApiResponse.Success("Lấy danh sách chi tiết nhập thành công", new PagedResultDto<ChiTietNhapDto>(
            result.TotalCount,
            result.Page,
            result.PageSize,
            result.TotalPages,
            chiTietNhaps
        ));
    }

    /* ---------- 2. Lấy chi tiết nhập theo ID ---------- */
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id, CancellationToken ct = default)
    {
        var chiTietNhap = await _ctx.ChiTietNhaps
            .Include(c => c.MaPhieuNhapNavigation)
            .Include(c => c.MaLoNavigation)
                .ThenInclude(l => l.MaVaccineNavigation)
            .Include(c => c.MaLoNavigation)
                .ThenInclude(l => l.MaNhaCungCapNavigation)
            .Where(c => c.MaChiTiet == id && c.IsDelete == false)
            .FirstOrDefaultAsync(ct);

        if (chiTietNhap == null)
        {
            return ApiResponse.Error("Không tìm thấy chi tiết nhập", 404);
        }

        var chiTietNhapDto = new ChiTietNhapDto(
            chiTietNhap.MaChiTiet,
            chiTietNhap.MaPhieuNhap ?? "",
            chiTietNhap.MaLo ?? "",
            chiTietNhap.SoLuong,
            chiTietNhap.Gia,
            chiTietNhap.MaLoNavigation?.SoLo,
            chiTietNhap.MaLoNavigation?.MaVaccineNavigation?.Ten,
            chiTietNhap.MaLoNavigation?.MaNhaCungCapNavigation?.Ten
        );

        return ApiResponse.Success("Lấy chi tiết nhập thành công", chiTietNhapDto);
    }

    /* ---------- 3. Tạo chi tiết nhập mới ---------- */
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] ChiTietNhapCreateDto dto, CancellationToken ct = default)
    {
        // Kiểm tra lô vaccine có tồn tại không
        var loVaccine = await _ctx.LoVaccines
            .Where(l => l.MaLo == dto.MaLo && l.IsDelete == false)
            .FirstOrDefaultAsync(ct);

        if (loVaccine == null)
        {
            return ApiResponse.Error("Không tìm thấy lô vaccine", 404);
        }

        var chiTietNhap = new ChiTietNhap
        {
            MaChiTiet = Guid.NewGuid().ToString(),
            MaLo = dto.MaLo,
            SoLuong = dto.SoLuong,
            Gia = dto.Gia,
            IsDelete = false,
            IsActive = true,
            NgayTao = DateTime.Now,
            NgayCapNhat = DateTime.Now
        };

        _ctx.ChiTietNhaps.Add(chiTietNhap);
        await _ctx.SaveChangesAsync(ct);

        return ApiResponse.Success("Tạo chi tiết nhập thành công", new { maChiTiet = chiTietNhap.MaChiTiet });
    }

    /* ---------- 4. Cập nhật chi tiết nhập ---------- */
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] ChiTietNhapCreateDto dto, CancellationToken ct = default)
    {
        var chiTietNhap = await _ctx.ChiTietNhaps
            .Where(c => c.MaChiTiet == id && c.IsDelete == false)
            .FirstOrDefaultAsync(ct);

        if (chiTietNhap == null)
        {
            return ApiResponse.Error("Không tìm thấy chi tiết nhập", 404);
        }

        // Kiểm tra lô vaccine có tồn tại không
        var loVaccine = await _ctx.LoVaccines
            .Where(l => l.MaLo == dto.MaLo && l.IsDelete == false)
            .FirstOrDefaultAsync(ct);

        if (loVaccine == null)
        {
            return ApiResponse.Error("Không tìm thấy lô vaccine", 404);
        }

        chiTietNhap.MaLo = dto.MaLo;
        chiTietNhap.SoLuong = dto.SoLuong;
        chiTietNhap.Gia = dto.Gia;
        chiTietNhap.NgayCapNhat = DateTime.Now;

        await _ctx.SaveChangesAsync(ct);

        return ApiResponse.Success("Cập nhật chi tiết nhập thành công");
    }

    /* ---------- 5. Xóa chi tiết nhập (soft delete) ---------- */
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id, CancellationToken ct = default)
    {
        var chiTietNhap = await _ctx.ChiTietNhaps
            .Where(c => c.MaChiTiet == id && c.IsDelete == false)
            .FirstOrDefaultAsync(ct);

        if (chiTietNhap == null)
        {
            return ApiResponse.Error("Không tìm thấy chi tiết nhập", 404);
        }

        chiTietNhap.IsDelete = true;
        chiTietNhap.NgayCapNhat = DateTime.Now;

        await _ctx.SaveChangesAsync(ct);

        return ApiResponse.Success("Xóa chi tiết nhập thành công");
    }

    /* ---------- 6. Lấy chi tiết nhập theo phiếu nhập ---------- */
    [HttpGet("phieu-nhap/{maPhieuNhap}")]
    public async Task<IActionResult> GetByPhieuNhap(string maPhieuNhap, CancellationToken ct = default)
    {
        var chiTietNhaps = await _ctx.ChiTietNhaps
            .Include(c => c.MaLoNavigation)
                .ThenInclude(l => l.MaVaccineNavigation)
            .Include(c => c.MaLoNavigation)
                .ThenInclude(l => l.MaNhaCungCapNavigation)
            .Where(c => c.MaPhieuNhap == maPhieuNhap && c.IsDelete == false)
            .ToListAsync(ct);

        var chiTietNhapDtos = chiTietNhaps.Select(c => new ChiTietNhapDto(
            c.MaChiTiet,
            c.MaPhieuNhap ?? "",
            c.MaLo ?? "",
            c.SoLuong,
            c.Gia,
            c.MaLoNavigation?.SoLo,
            c.MaLoNavigation?.MaVaccineNavigation?.Ten,
            c.MaLoNavigation?.MaNhaCungCapNavigation?.Ten
        )).ToList();

        return ApiResponse.Success("Lấy chi tiết nhập theo phiếu nhập thành công", chiTietNhapDtos);
    }
}