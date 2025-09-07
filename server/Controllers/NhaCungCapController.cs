using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.DTOs.NhaCungCap;
using server.DTOs.Pagination;
using server.Helpers;
using server.Models;

namespace server.Controllers;

[ApiController]
[Route("api/nha-cung-cap")]
public class NhaCungCapController : ControllerBase
{
    private readonly HeThongQuanLyTiemChungContext _ctx;

    public NhaCungCapController(HeThongQuanLyTiemChungContext ctx) => _ctx = ctx;

    /* ---------- 1. Lấy danh sách nhà cung cấp (có phân trang) ---------- */
    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? search = null,
        CancellationToken ct = default)
    {
        var query = _ctx.NhaCungCaps
            .Include(ncc => ncc.MaAnhNavigation)
            .Where(ncc => ncc.IsDelete == false);

        // Tìm kiếm theo từ khóa
        if (!string.IsNullOrEmpty(search))
        {
            query = query.Where(ncc => 
                ncc.Ten.Contains(search) ||
                ncc.NguoiLienHe.Contains(search) ||
                ncc.SoDienThoai.Contains(search) ||
                ncc.DiaChi.Contains(search));
        }

        var result = await query
            .OrderByDescending(ncc => ncc.NgayTao)
            .Select(ncc => new NhaCungCapDto(
                ncc.MaNhaCungCap,
                ncc.Ten,
                ncc.NguoiLienHe,
                ncc.SoDienThoai,
                ncc.DiaChi,
                ncc.MaAnh,
                ncc.IsDelete,
                ncc.IsActive,
                ncc.NgayTao,
                ncc.NgayCapNhat,
                ncc.MaAnhNavigation.AltText,
                ncc.MaAnhNavigation.UrlAnh
            ))
            .ToPagedAsync(page, pageSize, ct);

        return ApiResponse.Success("Lấy danh sách nhà cung cấp thành công", result);
    }

    /* ---------- 2. Lấy chi tiết nhà cung cấp theo ID ---------- */
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id, CancellationToken ct = default)
    {
        var nhaCungCap = await _ctx.NhaCungCaps
            .Include(ncc => ncc.MaAnhNavigation)
            .Include(ncc => ncc.AnhNhaCungCaps)
                .ThenInclude(anh => anh.MaAnhNavigation)
            .FirstOrDefaultAsync(ncc => ncc.MaNhaCungCap == id && ncc.IsDelete == false, ct);

        if (nhaCungCap == null)
            return ApiResponse.Error("Không tìm thấy nhà cung cấp", 404);

        var anhNhaCungCaps = nhaCungCap.AnhNhaCungCaps
            .Where(anh => anh.IsDelete == false)
            .Select(anh => new AnhNhaCungCapDto(
                anh.MaAnhNhaCungCap,
                anh.MaNhaCungCap,
                anh.MaAnh,
                anh.ThuTuHienThi,
                anh.IsDelete,
                anh.IsActive,
                anh.NgayTao,
                anh.NgayCapNhat,
                anh.MaAnhNavigation.AltText,
                anh.MaAnhNavigation.UrlAnh
            ))
            .ToList();

        var result = new NhaCungCapDetailDto(
            nhaCungCap.MaNhaCungCap,
            nhaCungCap.Ten,
            nhaCungCap.NguoiLienHe,
            nhaCungCap.SoDienThoai,
            nhaCungCap.DiaChi,
            nhaCungCap.MaAnh,
            nhaCungCap.IsDelete,
            nhaCungCap.IsActive,
            nhaCungCap.NgayTao,
            nhaCungCap.NgayCapNhat,
            nhaCungCap.MaAnhNavigation?.AltText,
            nhaCungCap.MaAnhNavigation?.UrlAnh,
            anhNhaCungCaps
        );

        return ApiResponse.Success("Lấy chi tiết nhà cung cấp thành công", result);
    }

    /* ---------- 3. Tạo nhà cung cấp mới ---------- */
    [HttpPost]
    public async Task<IActionResult> Create(
        [FromBody] NhaCungCapCreateDto dto,
        CancellationToken ct = default)
    {
        // Kiểm tra tên nhà cung cấp đã tồn tại chưa
        if (await _ctx.NhaCungCaps.AnyAsync(ncc => ncc.Ten == dto.Ten && ncc.IsDelete == false, ct))
            return ApiResponse.Error("Tên nhà cung cấp đã tồn tại", 400);

        // Kiểm tra ảnh tồn tại (nếu có)
        if (!string.IsNullOrEmpty(dto.MaAnh))
        {
            if (!await _ctx.NguonAnhs.AnyAsync(anh => anh.MaAnh == dto.MaAnh && anh.IsDelete == false, ct))
                return ApiResponse.Error("Ảnh không tồn tại", 404);
        }

        var nhaCungCap = new NhaCungCap
        {
            MaNhaCungCap = Guid.NewGuid().ToString("N"),
            Ten = dto.Ten,
            NguoiLienHe = dto.NguoiLienHe,
            SoDienThoai = dto.SoDienThoai,
            DiaChi = dto.DiaChi,
            MaAnh = string.IsNullOrEmpty(dto.MaAnh) ? null : dto.MaAnh,
            IsActive = true,
            IsDelete = false,
            NgayTao = DateTime.UtcNow
        };

        _ctx.NhaCungCaps.Add(nhaCungCap);
        await _ctx.SaveChangesAsync(ct);

        return ApiResponse.Success("Tạo nhà cung cấp thành công", 
            new { nhaCungCap.MaNhaCungCap }, 201);
    }

    /* ---------- 4. Cập nhật nhà cung cấp ---------- */
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(
        string id,
        [FromBody] NhaCungCapUpdateDto dto,
        CancellationToken ct = default)
    {
        var nhaCungCap = await _ctx.NhaCungCaps
            .FirstOrDefaultAsync(ncc => ncc.MaNhaCungCap == id && ncc.IsDelete == false, ct);

        if (nhaCungCap == null)
            return ApiResponse.Error("Không tìm thấy nhà cung cấp", 404);

        // Kiểm tra tên nhà cung cấp đã tồn tại chưa (nếu thay đổi tên)
        if (!string.IsNullOrEmpty(dto.Ten) && dto.Ten != nhaCungCap.Ten)
        {
            if (await _ctx.NhaCungCaps.AnyAsync(ncc => ncc.Ten == dto.Ten && ncc.MaNhaCungCap != id && ncc.IsDelete == false, ct))
                return ApiResponse.Error("Tên nhà cung cấp đã tồn tại", 400);
            nhaCungCap.Ten = dto.Ten;
        }

        // Kiểm tra ảnh tồn tại (nếu có)
        if (!string.IsNullOrEmpty(dto.MaAnh))
        {
            if (!await _ctx.NguonAnhs.AnyAsync(anh => anh.MaAnh == dto.MaAnh && anh.IsDelete == false, ct))
                return ApiResponse.Error("Ảnh không tồn tại", 404);
            nhaCungCap.MaAnh = dto.MaAnh;
        }

        if (!string.IsNullOrEmpty(dto.NguoiLienHe))
            nhaCungCap.NguoiLienHe = dto.NguoiLienHe;

        if (!string.IsNullOrEmpty(dto.SoDienThoai))
            nhaCungCap.SoDienThoai = dto.SoDienThoai;

        if (!string.IsNullOrEmpty(dto.DiaChi))
            nhaCungCap.DiaChi = dto.DiaChi;

        nhaCungCap.NgayCapNhat = DateTime.UtcNow;

        await _ctx.SaveChangesAsync(ct);
        return ApiResponse.Success("Cập nhật nhà cung cấp thành công", null);
    }

    /* ---------- 5. Xóa nhà cung cấp (soft delete) ---------- */
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id, CancellationToken ct = default)
    {
        var nhaCungCap = await _ctx.NhaCungCaps
            .FirstOrDefaultAsync(ncc => ncc.MaNhaCungCap == id && ncc.IsDelete == false, ct);

        if (nhaCungCap == null)
            return ApiResponse.Error("Không tìm thấy nhà cung cấp", 404);

        // Kiểm tra xem nhà cung cấp có đang được sử dụng không
        var hasLoVaccines = await _ctx.LoVaccines.AnyAsync(lv => lv.MaNhaCungCap == id && lv.IsDelete == false, ct);
        var hasPhieuNhaps = await _ctx.PhieuNhaps.AnyAsync(pn => pn.MaNhaCungCap == id && pn.IsDelete == false, ct);

        if (hasLoVaccines || hasPhieuNhaps)
            return ApiResponse.Error("Không thể xóa nhà cung cấp đang được sử dụng", 400);

        nhaCungCap.IsDelete = true;
        nhaCungCap.NgayCapNhat = DateTime.UtcNow;

        // Xóa các ảnh liên quan
        var anhNhaCungCaps = await _ctx.AnhNhaCungCaps
            .Where(anh => anh.MaNhaCungCap == id && anh.IsDelete == false)
            .ToListAsync(ct);

        foreach (var anh in anhNhaCungCaps)
        {
            anh.IsDelete = true;
            anh.NgayCapNhat = DateTime.UtcNow;
        }

        await _ctx.SaveChangesAsync(ct);
        return ApiResponse.Success("Xóa nhà cung cấp thành công", null);
    }

    /* ---------- 6. Thêm ảnh cho nhà cung cấp ---------- */
    [HttpPost("{id}/images")]
    public async Task<IActionResult> AddImage(
        string id,
        [FromBody] AnhNhaCungCapCreateDto dto,
        CancellationToken ct = default)
    {
        // Kiểm tra nhà cung cấp tồn tại
        if (!await _ctx.NhaCungCaps.AnyAsync(ncc => ncc.MaNhaCungCap == id && ncc.IsDelete == false, ct))
            return ApiResponse.Error("Nhà cung cấp không tồn tại", 404);

        // Kiểm tra ảnh tồn tại
        if (!await _ctx.NguonAnhs.AnyAsync(anh => anh.MaAnh == dto.MaAnh && anh.IsDelete == false, ct))
            return ApiResponse.Error("Ảnh không tồn tại", 404);

        var anhNhaCungCap = new AnhNhaCungCap
        {
            MaAnhNhaCungCap = Guid.NewGuid().ToString("N"),
            MaNhaCungCap = id,
            MaAnh = dto.MaAnh,
            ThuTuHienThi = dto.ThuTuHienThi ?? 0,
            IsActive = true,
            IsDelete = false,
            NgayTao = DateTime.UtcNow
        };

        _ctx.AnhNhaCungCaps.Add(anhNhaCungCap);
        await _ctx.SaveChangesAsync(ct);

        return ApiResponse.Success("Thêm ảnh thành công", 
            new { anhNhaCungCap.MaAnhNhaCungCap }, 201);
    }

    /* ---------- 7. Cập nhật ảnh nhà cung cấp ---------- */
    [HttpPut("{id}/images/{imageId}")]
    public async Task<IActionResult> UpdateImage(
        string id,
        string imageId,
        [FromBody] AnhNhaCungCapUpdateDto dto,
        CancellationToken ct = default)
    {
        var anhNhaCungCap = await _ctx.AnhNhaCungCaps
            .FirstOrDefaultAsync(anh => anh.MaAnhNhaCungCap == imageId && 
                                      anh.MaNhaCungCap == id && 
                                      anh.IsDelete == false, ct);

        if (anhNhaCungCap == null)
            return ApiResponse.Error("Không tìm thấy ảnh", 404);

        // Kiểm tra ảnh tồn tại (nếu thay đổi)
        if (!string.IsNullOrEmpty(dto.MaAnh))
        {
            if (!await _ctx.NguonAnhs.AnyAsync(anh => anh.MaAnh == dto.MaAnh && anh.IsDelete == false, ct))
                return ApiResponse.Error("Ảnh không tồn tại", 404);
            anhNhaCungCap.MaAnh = dto.MaAnh;
        }

        if (dto.ThuTuHienThi.HasValue)
            anhNhaCungCap.ThuTuHienThi = dto.ThuTuHienThi.Value;

        anhNhaCungCap.NgayCapNhat = DateTime.UtcNow;

        await _ctx.SaveChangesAsync(ct);
        return ApiResponse.Success("Cập nhật ảnh thành công", null);
    }

    /* ---------- 8. Xóa ảnh nhà cung cấp ---------- */
    [HttpDelete("{id}/images/{imageId}")]
    public async Task<IActionResult> DeleteImage(
        string id,
        string imageId,
        CancellationToken ct = default)
    {
        var anhNhaCungCap = await _ctx.AnhNhaCungCaps
            .FirstOrDefaultAsync(anh => anh.MaAnhNhaCungCap == imageId && 
                                      anh.MaNhaCungCap == id && 
                                      anh.IsDelete == false, ct);

        if (anhNhaCungCap == null)
            return ApiResponse.Error("Không tìm thấy ảnh", 404);

        anhNhaCungCap.IsDelete = true;
        anhNhaCungCap.NgayCapNhat = DateTime.UtcNow;

        await _ctx.SaveChangesAsync(ct);
        return ApiResponse.Success("Xóa ảnh thành công", null);
    }
}