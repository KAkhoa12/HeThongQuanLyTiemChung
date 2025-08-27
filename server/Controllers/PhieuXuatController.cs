using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.DTOs.Kho;
using server.DTOs.Pagination;
using server.Helpers;
using server.Models;

namespace server.Controllers;

[ApiController]
[Route("api/phieu-xuat")]
public class PhieuXuatController : ControllerBase
{
    private readonly HeThongQuanLyTiemChungContext _ctx;

    public PhieuXuatController(HeThongQuanLyTiemChungContext ctx) => _ctx = ctx;

    /* ---------- 1. Lấy danh sách phiếu xuất (có phân trang) ---------- */
    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? search = null,
        [FromQuery] string? loaiXuat = null,
        [FromQuery] string? trangThai = null,
        CancellationToken ct = default)
    {
        var query = _ctx.PhieuXuats
            .Include(p => p.MaDiaDiemXuatNavigation)
            .Include(p => p.MaDiaDiemNhapNavigation)
            .Include(p => p.MaQuanLyNavigation)
            .Where(p => p.IsDelete == false);

        // Tìm kiếm theo từ khóa
        if (!string.IsNullOrEmpty(search))
        {
            query = query.Where(p => 
                p.MaPhieuXuat.Contains(search) ||
                p.MaDiaDiemXuatNavigation.Ten.Contains(search) ||
                p.MaDiaDiemNhapNavigation.Ten.Contains(search));
        }

        // Lọc theo loại xuất
        if (!string.IsNullOrEmpty(loaiXuat))
        {
            query = query.Where(p => p.LoaiXuat == loaiXuat);
        }

        // Lọc theo trạng thái
        if (!string.IsNullOrEmpty(trangThai))
        {
            query = query.Where(p => p.TrangThai == trangThai);
        }

        var result = await query
            .OrderByDescending(p => p.NgayTao)
            .Select(p => new PhieuXuatDto(
                p.MaPhieuXuat,
                p.MaDiaDiemXuat,
                p.MaDiaDiemNhap,
                p.MaQuanLy,
                p.NgayXuat,
                p.LoaiXuat,
                p.TrangThai,
                p.NgayTao,
                p.NgayCapNhat,
                p.MaDiaDiemXuatNavigation.Ten,
                p.MaDiaDiemNhapNavigation.Ten,
                p.MaQuanLyNavigation.MaNguoiDungNavigation.Ten
            ))
            .ToPagedAsync(page, pageSize, ct);

        return ApiResponse.Success("Lấy danh sách phiếu xuất thành công", result);
    }

    /* ---------- 2. Lấy chi tiết phiếu xuất theo ID ---------- */
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id, CancellationToken ct = default)
    {
        var phieuXuat = await _ctx.PhieuXuats
            .Include(p => p.MaDiaDiemXuatNavigation)
            .Include(p => p.MaDiaDiemNhapNavigation)
            .Include(p => p.MaQuanLyNavigation)
            .Include(p => p.ChiTietXuats)
                .ThenInclude(ct => ct.MaLoNavigation)
                    .ThenInclude(l => l.MaVaccineNavigation)
            .FirstOrDefaultAsync(p => p.MaPhieuXuat == id && p.IsDelete == false, ct);

        if (phieuXuat == null)
            return ApiResponse.Error("Không tìm thấy phiếu xuất", 404);

        var chiTietXuats = phieuXuat.ChiTietXuats
            .Where(ct => ct.IsDelete == false)
            .Select(ct => new ChiTietXuatDto(
                ct.MaChiTiet,
                ct.MaPhieuXuat,
                ct.MaLo,
                ct.SoLuong,
                ct.MaLoNavigation.SoLo,
                ct.MaLoNavigation.MaVaccineNavigation.Ten
            ))
            .ToList();

        var result = new PhieuXuatDetailDto(
            phieuXuat.MaPhieuXuat,
            phieuXuat.MaDiaDiemXuat,
            phieuXuat.MaDiaDiemNhap,
            phieuXuat.MaQuanLy,
            phieuXuat.NgayXuat,
            phieuXuat.LoaiXuat,
            phieuXuat.TrangThai,
            phieuXuat.NgayTao,
            phieuXuat.NgayCapNhat,
            phieuXuat.MaDiaDiemXuatNavigation?.Ten,
            phieuXuat.MaDiaDiemNhapNavigation?.Ten,
            phieuXuat.MaQuanLyNavigation?.MaNguoiDungNavigation?.Ten,
            chiTietXuats
        );

        return ApiResponse.Success("Lấy chi tiết phiếu xuất thành công", result);
    }

    /* ---------- 3. Tạo phiếu xuất mới ---------- */
    [HttpPost]
    public async Task<IActionResult> Create(
        [FromBody] PhieuXuatCreateDto dto,
        CancellationToken ct = default)
    {
        // Kiểm tra địa điểm xuất tồn tại
        if (!string.IsNullOrEmpty(dto.MaDiaDiemXuat))
        {
            if (!await _ctx.DiaDiems.AnyAsync(dd => dd.MaDiaDiem == dto.MaDiaDiemXuat && dd.IsDelete == false, ct))
                return ApiResponse.Error("Địa điểm xuất không tồn tại", 404);
        }

        // Kiểm tra địa điểm nhập tồn tại
        if (!string.IsNullOrEmpty(dto.MaDiaDiemNhap))
        {
            if (!await _ctx.DiaDiems.AnyAsync(dd => dd.MaDiaDiem == dto.MaDiaDiemNhap && dd.IsDelete == false, ct))
                return ApiResponse.Error("Địa điểm nhập không tồn tại", 404);
        }

        // Kiểm tra quản lý tồn tại
        if (!string.IsNullOrEmpty(dto.MaQuanLy))
        {
            if (!await _ctx.QuanLies.AnyAsync(q => q.MaQuanLy == dto.MaQuanLy && q.IsDelete == false, ct))
                return ApiResponse.Error("Quản lý không tồn tại", 404);
        }

        // Kiểm tra các lô vaccine có đủ số lượng để xuất
        foreach (var chiTiet in dto.ChiTietXuats)
        {
            var tonKho = await _ctx.TonKhoLos
                .FirstOrDefaultAsync(tk => tk.MaLo == chiTiet.MaLo && tk.MaDiaDiem == dto.MaDiaDiemXuat && tk.IsDelete == false, ct);
            
            if (tonKho == null || (tonKho.SoLuong ?? 0) < chiTiet.SoLuong)
                return ApiResponse.Error($"Lô vaccine {chiTiet.MaLo} không đủ số lượng để xuất", 400);
        }

        var phieuXuat = new PhieuXuat
        {
            MaPhieuXuat = Guid.NewGuid().ToString("N"),
            MaDiaDiemXuat = dto.MaDiaDiemXuat,
            MaDiaDiemNhap = dto.MaDiaDiemNhap,
            MaQuanLy = dto.MaQuanLy,
            NgayXuat = dto.NgayXuat ?? DateTime.UtcNow,
            LoaiXuat = dto.LoaiXuat,
            TrangThai = "Chờ xác nhận",
            IsActive = true,
            IsDelete = false,
            NgayTao = DateTime.UtcNow
        };

        _ctx.PhieuXuats.Add(phieuXuat);

        // Tạo chi tiết phiếu xuất
        var chiTietXuats = new List<ChiTietXuat>();

        foreach (var chiTietDto in dto.ChiTietXuats)
        {
            var chiTiet = new ChiTietXuat
            {
                    MaChiTiet = Guid.NewGuid().ToString("N"),
                MaPhieuXuat = phieuXuat.MaPhieuXuat,
                MaLo = chiTietDto.MaLo,
                SoLuong = chiTietDto.SoLuong,
                IsActive = true,
                IsDelete = false,
                NgayTao = DateTime.UtcNow
            };

            chiTietXuats.Add(chiTiet);

            // Cập nhật số lượng tồn kho
            var tonKho = await _ctx.TonKhoLos
                .FirstOrDefaultAsync(tk => tk.MaLo == chiTietDto.MaLo && tk.MaDiaDiem == dto.MaDiaDiemXuat && tk.IsDelete == false, ct);
            
            if (tonKho != null)
            {
                tonKho.SoLuong = (tonKho.SoLuong ?? 0) - chiTietDto.SoLuong;
                tonKho.NgayCapNhat = DateTime.UtcNow;
            }
        }

        _ctx.ChiTietXuats.AddRange(chiTietXuats);

        await _ctx.SaveChangesAsync(ct);

        return ApiResponse.Success("Tạo phiếu xuất thành công", 
            new { phieuXuat.MaPhieuXuat }, 201);
    }

    /* ---------- 4. Cập nhật phiếu xuất ---------- */
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(
        string id,
        [FromBody] PhieuXuatUpdateDto dto,
        CancellationToken ct = default)
    {
        var phieuXuat = await _ctx.PhieuXuats
            .FirstOrDefaultAsync(p => p.MaPhieuXuat == id && p.IsDelete == false, ct);

        if (phieuXuat == null)
            return ApiResponse.Error("Không tìm thấy phiếu xuất", 404);

        // Kiểm tra địa điểm xuất tồn tại
        if (!string.IsNullOrEmpty(dto.MaDiaDiemXuat))
        {
            if (!await _ctx.DiaDiems.AnyAsync(dd => dd.MaDiaDiem == dto.MaDiaDiemXuat && dd.IsDelete == false, ct))
                return ApiResponse.Error("Địa điểm xuất không tồn tại", 404);
            phieuXuat.MaDiaDiemXuat = dto.MaDiaDiemXuat;
        }

        // Kiểm tra địa điểm nhập tồn tại
        if (!string.IsNullOrEmpty(dto.MaDiaDiemNhap))
        {
            if (!await _ctx.DiaDiems.AnyAsync(dd => dd.MaDiaDiem == dto.MaDiaDiemNhap && dd.IsDelete == false, ct))
                return ApiResponse.Error("Địa điểm nhập không tồn tại", 404);
            phieuXuat.MaDiaDiemNhap = dto.MaDiaDiemNhap;
        }

        // Kiểm tra quản lý tồn tại
        if (!string.IsNullOrEmpty(dto.MaQuanLy))
        {
            if (!await _ctx.QuanLies.AnyAsync(q => q.MaQuanLy == dto.MaQuanLy && q.IsDelete == false, ct))
                return ApiResponse.Error("Quản lý không tồn tại", 404);
            phieuXuat.MaQuanLy = dto.MaQuanLy;
        }

        if (dto.NgayXuat.HasValue)
            phieuXuat.NgayXuat = dto.NgayXuat.Value;

        if (!string.IsNullOrEmpty(dto.LoaiXuat))
            phieuXuat.LoaiXuat = dto.LoaiXuat;

        if (!string.IsNullOrEmpty(dto.TrangThai))
            phieuXuat.TrangThai = dto.TrangThai;

        phieuXuat.NgayCapNhat = DateTime.UtcNow;

        await _ctx.SaveChangesAsync(ct);
        return ApiResponse.Success("Cập nhật phiếu xuất thành công", null);
    }

    /* ---------- 5. Xóa phiếu xuất (soft delete) ---------- */
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id, CancellationToken ct = default)
    {
        var phieuXuat = await _ctx.PhieuXuats
            .FirstOrDefaultAsync(p => p.MaPhieuXuat == id && p.IsDelete == false, ct);

        if (phieuXuat == null)
            return ApiResponse.Error("Không tìm thấy phiếu xuất", 404);

        phieuXuat.IsDelete = true;
        phieuXuat.NgayCapNhat = DateTime.UtcNow;

        // Xóa các chi tiết phiếu xuất
        var chiTietXuats = await _ctx.ChiTietXuats
            .Where(ct => ct.MaPhieuXuat == id && ct.IsDelete == false)
            .ToListAsync(ct);

        foreach (var chiTiet in chiTietXuats)
        {
            chiTiet.IsDelete = true;
            chiTiet.NgayCapNhat = DateTime.UtcNow;
        }

        await _ctx.SaveChangesAsync(ct);
        return ApiResponse.Success("Xóa phiếu xuất thành công", null);
    }

    /* ---------- 6. Xác nhận phiếu xuất ---------- */
    [HttpPost("{id}/confirm")]
    public async Task<IActionResult> Confirm(string id, CancellationToken ct = default)
    {
        var phieuXuat = await _ctx.PhieuXuats
            .FirstOrDefaultAsync(p => p.MaPhieuXuat == id && p.IsDelete == false, ct);

        if (phieuXuat == null)
            return ApiResponse.Error("Không tìm thấy phiếu xuất", 404);

        if (phieuXuat.TrangThai == "Đã xác nhận")
            return ApiResponse.Error("Phiếu xuất đã được xác nhận", 400);

        phieuXuat.TrangThai = "Đã xác nhận";
        phieuXuat.NgayCapNhat = DateTime.UtcNow;

        await _ctx.SaveChangesAsync(ct);
        return ApiResponse.Success("Xác nhận phiếu xuất thành công", null);
    }
} 