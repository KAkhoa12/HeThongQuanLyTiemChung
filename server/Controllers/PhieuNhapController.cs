using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.DTOs.Kho;
using server.DTOs.Pagination;
using server.Helpers;
using server.Models;

namespace server.Controllers;

[ApiController]
[Route("api/phieu-nhap")]
public class PhieuNhapController : ControllerBase
{
    private readonly HeThongQuanLyTiemChungContext _ctx;

    public PhieuNhapController(HeThongQuanLyTiemChungContext ctx) => _ctx = ctx;

    /* ---------- 1. Lấy danh sách phiếu nhập (có phân trang) ---------- */
    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? search = null,
        [FromQuery] string? maNhaCungCap = null,
        [FromQuery] string? trangThai = null,
        CancellationToken ct = default)
    {
        var query = _ctx.PhieuNhaps
            .Include(p => p.MaNhaCungCapNavigation)
            .Include(p => p.MaQuanLyNavigation)
            .Where(p => p.IsDelete == false);

        // Tìm kiếm theo từ khóa
        if (!string.IsNullOrEmpty(search))
        {
            query = query.Where(p => 
                p.MaPhieuNhap.Contains(search) ||
                p.MaNhaCungCapNavigation.Ten.Contains(search));
        }

        // Lọc theo nhà cung cấp
        if (!string.IsNullOrEmpty(maNhaCungCap))
        {
            query = query.Where(p => p.MaNhaCungCap == maNhaCungCap);
        }

        // Lọc theo trạng thái
        if (!string.IsNullOrEmpty(trangThai))
        {
            query = query.Where(p => p.TrangThai == trangThai);
        }

        var result = await query
            .OrderByDescending(p => p.NgayTao)
            .Select(p => new PhieuNhapDto(
                p.MaPhieuNhap,
                p.MaNhaCungCap,
                p.MaQuanLy,
                p.NgayNhap,
                p.TongTien,
                p.TrangThai,
                p.NgayTao,
                p.NgayCapNhat,
                p.MaNhaCungCapNavigation.Ten,
                p.MaQuanLyNavigation.MaNguoiDungNavigation.Ten
            ))
            .ToPagedAsync(page, pageSize, ct);

        return ApiResponse.Success("Lấy danh sách phiếu nhập thành công", result);
    }

    /* ---------- 2. Lấy chi tiết phiếu nhập theo ID ---------- */
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id, CancellationToken ct = default)
    {
        var phieuNhap = await _ctx.PhieuNhaps
            .Include(p => p.MaNhaCungCapNavigation)
            .Include(p => p.MaQuanLyNavigation)
            .Include(p => p.ChiTietNhaps)
                .ThenInclude(ct => ct.MaLoNavigation)
                    .ThenInclude(l => l.MaVaccineNavigation)
            .Include(p => p.ChiTietNhaps)
                .ThenInclude(ct => ct.MaLoNavigation)
                    .ThenInclude(l => l.MaNhaCungCapNavigation)
            .FirstOrDefaultAsync(p => p.MaPhieuNhap == id && p.IsDelete == false, ct);

        if (phieuNhap == null)
            return ApiResponse.Error("Không tìm thấy phiếu nhập", 404);

        var chiTietNhaps = phieuNhap.ChiTietNhaps
            .Where(ct => ct.IsDelete == false)
            .Select(ct => new ChiTietNhapDto(
                ct.MaChiTiet,
                ct.MaPhieuNhap,
                ct.MaLo,
                ct.SoLuong,
                ct.Gia,
                ct.MaLoNavigation.SoLo,
                ct.MaLoNavigation.MaVaccineNavigation.Ten,
                ct.MaLoNavigation.MaNhaCungCapNavigation.Ten
            ))
            .ToList();

        var result = new PhieuNhapDetailDto(
            phieuNhap.MaPhieuNhap,
            phieuNhap.MaNhaCungCap,
            phieuNhap.MaQuanLy,
            phieuNhap.NgayNhap,
            phieuNhap.TongTien,
            phieuNhap.TrangThai,
            phieuNhap.NgayTao,
            phieuNhap.NgayCapNhat,
            phieuNhap.MaNhaCungCapNavigation?.Ten,
            phieuNhap.MaQuanLyNavigation?.MaNguoiDungNavigation?.Ten,
            chiTietNhaps
        );

        return ApiResponse.Success("Lấy chi tiết phiếu nhập thành công", result);
    }

    /* ---------- 3. Tạo phiếu nhập mới ---------- */
    [HttpPost]
    public async Task<IActionResult> Create(
        [FromBody] PhieuNhapCreateDto dto,
        CancellationToken ct = default)
    {
        // Kiểm tra nhà cung cấp tồn tại
        if (!string.IsNullOrEmpty(dto.MaNhaCungCap))
        {
            if (!await _ctx.NhaCungCaps.AnyAsync(ncc => ncc.MaNhaCungCap == dto.MaNhaCungCap && ncc.IsDelete == false, ct))
                return ApiResponse.Error("Nhà cung cấp không tồn tại", 404);
        }

        // Kiểm tra quản lý tồn tại
        if (!string.IsNullOrEmpty(dto.MaQuanLy))
        {
            if (!await _ctx.QuanLies.AnyAsync(q => q.MaQuanLy == dto.MaQuanLy && q.IsDelete == false, ct))
                return ApiResponse.Error("Quản lý không tồn tại", 404);
        }

        // Kiểm tra các lô vaccine tồn tại
        foreach (var chiTiet in dto.ChiTietNhaps)
        {
            if (!await _ctx.LoVaccines.AnyAsync(l => l.MaLo == chiTiet.MaLo && l.IsDelete == false, ct))
                return ApiResponse.Error($"Lô vaccine {chiTiet.MaLo} không tồn tại", 404);
        }

        var phieuNhap = new PhieuNhap
        {
            MaPhieuNhap = Guid.NewGuid().ToString("N"),
            MaNhaCungCap = dto.MaNhaCungCap,
            MaQuanLy = dto.MaQuanLy,
            NgayNhap = dto.NgayNhap ?? DateTime.UtcNow,
            TrangThai = "Chờ xác nhận",
            IsActive = true,
            IsDelete = false,
            NgayTao = DateTime.UtcNow
        };

        _ctx.PhieuNhaps.Add(phieuNhap);

        // Tạo chi tiết phiếu nhập
        var chiTietNhaps = new List<ChiTietNhap>();
        decimal tongTien = 0;

        foreach (var chiTietDto in dto.ChiTietNhaps)
        {
            var chiTiet = new ChiTietNhap
            {
                MaChiTiet = Guid.NewGuid().ToString("N"),
                MaPhieuNhap = phieuNhap.MaPhieuNhap,
                MaLo = chiTietDto.MaLo,
                SoLuong = chiTietDto.SoLuong,
                Gia = chiTietDto.Gia,
                IsActive = true,
                IsDelete = false,
                NgayTao = DateTime.UtcNow
            };

            chiTietNhaps.Add(chiTiet);
            tongTien += chiTietDto.SoLuong * chiTietDto.Gia;

            // Cập nhật số lượng hiện tại của lô vaccine
            var loVaccine = await _ctx.LoVaccines.FindAsync(chiTietDto.MaLo);
            if (loVaccine != null)
            {
                loVaccine.SoLuongHienTai = (loVaccine.SoLuongHienTai ?? 0) + chiTietDto.SoLuong;
                loVaccine.NgayCapNhat = DateTime.UtcNow;
            }
        }

        phieuNhap.TongTien = tongTien;
        _ctx.ChiTietNhaps.AddRange(chiTietNhaps);

        await _ctx.SaveChangesAsync(ct);

        return ApiResponse.Success("Tạo phiếu nhập thành công", 
            new { phieuNhap.MaPhieuNhap }, 201);
    }

    /* ---------- 4. Cập nhật phiếu nhập ---------- */
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(
        string id,
        [FromBody] PhieuNhapUpdateDto dto,
        CancellationToken ct = default)
    {
        var phieuNhap = await _ctx.PhieuNhaps
            .FirstOrDefaultAsync(p => p.MaPhieuNhap == id && p.IsDelete == false, ct);

        if (phieuNhap == null)
            return ApiResponse.Error("Không tìm thấy phiếu nhập", 404);

        // Kiểm tra nhà cung cấp tồn tại
        if (!string.IsNullOrEmpty(dto.MaNhaCungCap))
        {
            if (!await _ctx.NhaCungCaps.AnyAsync(ncc => ncc.MaNhaCungCap == dto.MaNhaCungCap && ncc.IsDelete == false, ct))
                return ApiResponse.Error("Nhà cung cấp không tồn tại", 404);
            phieuNhap.MaNhaCungCap = dto.MaNhaCungCap;
        }

        // Kiểm tra quản lý tồn tại
        if (!string.IsNullOrEmpty(dto.MaQuanLy))
        {
            if (!await _ctx.QuanLies.AnyAsync(q => q.MaQuanLy == dto.MaQuanLy && q.IsDelete == false, ct))
                return ApiResponse.Error("Quản lý không tồn tại", 404);
            phieuNhap.MaQuanLy = dto.MaQuanLy;
        }

        if (dto.NgayNhap.HasValue)
            phieuNhap.NgayNhap = dto.NgayNhap.Value;

        if (!string.IsNullOrEmpty(dto.TrangThai))
            phieuNhap.TrangThai = dto.TrangThai;

        phieuNhap.NgayCapNhat = DateTime.UtcNow;

        await _ctx.SaveChangesAsync(ct);
        return ApiResponse.Success("Cập nhật phiếu nhập thành công", null);
    }

    /* ---------- 5. Xóa phiếu nhập (soft delete) ---------- */
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id, CancellationToken ct = default)
    {
        var phieuNhap = await _ctx.PhieuNhaps
            .FirstOrDefaultAsync(p => p.MaPhieuNhap == id && p.IsDelete == false, ct);

        if (phieuNhap == null)
            return ApiResponse.Error("Không tìm thấy phiếu nhập", 404);

        phieuNhap.IsDelete = true;
        phieuNhap.NgayCapNhat = DateTime.UtcNow;

        // Xóa các chi tiết phiếu nhập
        var chiTietNhaps = await _ctx.ChiTietNhaps
            .Where(ct => ct.MaPhieuNhap == id && ct.IsDelete == false)
            .ToListAsync(ct);

        foreach (var chiTiet in chiTietNhaps)
        {
            chiTiet.IsDelete = true;
            chiTiet.NgayCapNhat = DateTime.UtcNow;
        }

        await _ctx.SaveChangesAsync(ct);
        return ApiResponse.Success("Xóa phiếu nhập thành công", null);
    }

    /* ---------- 6. Xác nhận phiếu nhập ---------- */
    [HttpPost("{id}/confirm")]
    public async Task<IActionResult> Confirm(string id, CancellationToken ct = default)
    {
        var phieuNhap = await _ctx.PhieuNhaps
            .FirstOrDefaultAsync(p => p.MaPhieuNhap == id && p.IsDelete == false, ct);

        if (phieuNhap == null)
            return ApiResponse.Error("Không tìm thấy phiếu nhập", 404);

        if (phieuNhap.TrangThai == "Đã xác nhận")
            return ApiResponse.Error("Phiếu nhập đã được xác nhận", 400);

        phieuNhap.TrangThai = "Đã xác nhận";
        phieuNhap.NgayCapNhat = DateTime.UtcNow;

        await _ctx.SaveChangesAsync(ct);
        return ApiResponse.Success("Xác nhận phiếu nhập thành công", null);
    }
} 