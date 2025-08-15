using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.DTOs.Image;
using server.Models;
using server.Helpers;

namespace server.Controllers;

[ApiController]
[Route("api/image_labels")]
public class ImageLabelController : ControllerBase
{
    private readonly HeThongQuanLyTiemChungContext _ctx;

    public ImageLabelController(HeThongQuanLyTiemChungContext ctx)
    {
        _ctx = ctx;
    }

    /* ---------- 1. Xem tất cả ---------- */
    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken ct)
    {
        var labels = await _ctx.NhanAnhs
            .Where(l => l.IsDelete == false)
            .OrderBy(l => l.TenNhan)
            .Select(l => new ImageLabelResponseDto(
                l.MaNhan,
                l.TenNhan,
                l.MoTa,
                l.IsActive ?? true,
                l.NgayTao ?? DateTime.MinValue))
            .ToListAsync(ct);

        return ApiResponse.Success("Lấy nhãn thành công", labels);
    }

    /* ---------- 2. Xem chi tiết ---------- */
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id, CancellationToken ct)
    {
        var label = await _ctx.NhanAnhs
            .FirstOrDefaultAsync(l => l.MaNhan == id && l.IsDelete == false, ct);

        if (label == null) return NotFound();

        return ApiResponse.Success("Lấy nhãn thành công", new ImageLabelResponseDto(
            label.MaNhan,
            label.TenNhan,
            label.MoTa,
            label.IsActive ?? true,
            label.NgayTao ?? DateTime.MinValue));
    }

    /* ---------- 3. Thêm mới ---------- */
    [HttpPost]
    public async Task<IActionResult> Create(
        [FromBody] ImageLabelUpdateDto dto,
        CancellationToken ct)
    {
        if (await _ctx.NhanAnhs.AnyAsync(l => l.TenNhan == dto.TenNhan && l.IsDelete == false, ct))
            return ApiResponse.Error("Nhãn đã tồn tại");

        var label = new NhanAnh
        {
            MaNhan = Guid.NewGuid().ToString("N"),
            TenNhan = dto.TenNhan,
            MoTa = dto.MoTa,
            IsActive = true,
            IsDelete = false,
            NgayTao = DateTime.UtcNow
        };

        _ctx.NhanAnhs.Add(label);
        await _ctx.SaveChangesAsync(ct);
        var labelDto = new ImageLabelCreateResponseDto(
                        label.MaNhan,
                        label.TenNhan,
                        label.MoTa,
                        label.NgayTao ?? DateTime.UtcNow
                    );
        return ApiResponse.Success("Tạo nhãn thành công", labelDto);
    }

    /* ---------- 4. Cập nhật ---------- */
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(
    string id,
    [FromBody] ImageLabelUpdateDto dto,
    CancellationToken ct)
    {
        var label = await _ctx.NhanAnhs
            .FirstOrDefaultAsync(l => l.MaNhan == id && l.IsDelete == false, ct);

        if (label == null)
            return ApiResponse.Error("Không tìm thấy nhãn");

        if (await _ctx.NguonAnhs.AnyAsync(i => i.MaNhan == id && i.IsDelete == false, ct))
            return ApiResponse.Error("Không thể sửa nhãn vì còn ảnh đang sử dụng.");

        label.TenNhan = dto.TenNhan ?? label.TenNhan;
        label.MoTa = dto.MoTa ?? label.MoTa;
        label.IsActive = dto.IsActive ?? label.IsActive;
        label.NgayCapNhat = DateTime.UtcNow;

        await _ctx.SaveChangesAsync(ct);

        var labelImageDto = new ImageLabelUpdateResponseDto(
            label.MaNhan,
            label.TenNhan ?? string.Empty,
            label.MoTa,
            label.IsActive ?? true,
            label.NgayCapNhat.Value);

        return ApiResponse.Success("Cập nhật nhãn thành công", labelImageDto);
    }

    /* ---------- 5. Xoá (soft delete) ---------- */
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id, CancellationToken ct)
    {
        var label = await _ctx.NhanAnhs
            .FirstOrDefaultAsync(l => l.MaNhan == id, ct);   // không cần IsDelete check nữa

        if (label == null)
            return ApiResponse.Error("Không tìm thấy nhãn");

        // Kiểm tra còn ảnh gán?
        var hasImages = await _ctx.NguonAnhs
            .AnyAsync(i => i.MaNhan == id, ct);

        if (hasImages)
            return ApiResponse.Error("Không thể xóa nhãn vì còn ảnh đang sử dụng");

        _ctx.NhanAnhs.Remove(label);   // xóa cứng
        await _ctx.SaveChangesAsync(ct);

        return ApiResponse.Success("Xóa nhãn thành công");
    }
}