using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.DTOs.DichVu;
using server.Helpers;
using server.Models;

namespace server.Controllers;

[ApiController]
[Route("api/service-vaccines")]
public class DichVuVaccineController : ControllerBase
{
    private readonly HeThongQuanLyTiemChungContext _ctx;

    public DichVuVaccineController(HeThongQuanLyTiemChungContext ctx) => _ctx = ctx;

    /* ---------- 1. Lấy vaccine theo dịch vụ ---------- */
    [HttpGet("by-service/{serviceId}")]
    public async Task<IActionResult> GetByServiceId(string serviceId, CancellationToken ct)
    {
        // Kiểm tra dịch vụ tồn tại
        if (!await _ctx.DichVus.AnyAsync(d => d.MaDichVu == serviceId && d.IsDelete == false, ct))
            return ApiResponse.Error("Dịch vụ không tồn tại");

        var vaccines = await _ctx.DichVuVaccines
            .Include(dv => dv.MaVaccineNavigation)
            .Where(dv => dv.MaDichVu == serviceId && dv.IsDelete == false)
            .Select(dv => new ServiceVaccineDto(
                dv.MaDichVuVaccine,
                dv.MaVaccine,
                dv.MaVaccineNavigation.Ten,
                dv.SoMuiChuan,
                dv.ThuTu, // Now nullable in DTO
                dv.GhiChu))
            .ToListAsync(ct);

        return ApiResponse.Success("Lấy danh sách vaccine theo dịch vụ thành công", vaccines);
    }

    /* ---------- 2. Thêm vaccine vào dịch vụ ---------- */
    [HttpPost]
    public async Task<IActionResult> AddVaccineToService(
        [FromBody] ServiceVaccineCreateDto dto,
        CancellationToken ct)
    {
        // Kiểm tra dịch vụ tồn tại
        if (!await _ctx.DichVus.AnyAsync(d => d.MaDichVu == dto.MaDichVu && d.IsDelete == false, ct))
            return ApiResponse.Error("Dịch vụ không tồn tại");

        // Kiểm tra vaccine tồn tại
        if (!await _ctx.Vaccines.AnyAsync(v => v.MaVaccine == dto.MaVaccine && v.IsDelete == false, ct))
            return ApiResponse.Error("Vaccine không tồn tại");

        var serviceVaccine = new DichVuVaccine
        {
            MaDichVuVaccine = Guid.NewGuid().ToString("N"),
            MaDichVu = dto.MaDichVu,
            MaVaccine = dto.MaVaccine,
            SoMuiChuan = dto.SoMuiChuan,
            ThuTu = dto.ThuTu,
            GhiChu = dto.GhiChu,
            IsActive = true,
            IsDelete = false,
            NgayTao = DateTime.UtcNow
        };

        _ctx.DichVuVaccines.Add(serviceVaccine);
        await _ctx.SaveChangesAsync(ct);

        return ApiResponse.Success("Thêm vaccine vào dịch vụ thành công",
            new { serviceVaccine.MaDichVuVaccine });
    }

    /* ---------- 3. Cập nhật thông tin vaccine trong dịch vụ ---------- */
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(
        string id,
        [FromBody] ServiceVaccineUpdateDto dto,
        CancellationToken ct)
    {
        var serviceVaccine = await _ctx.DichVuVaccines
            .FirstOrDefaultAsync(dv => dv.MaDichVuVaccine == id && dv.IsDelete == false, ct);
        if (serviceVaccine == null)
            return ApiResponse.Error("Không tìm thấy liên kết dịch vụ-vaccine");

        serviceVaccine.SoMuiChuan = dto.SoMuiChuan ?? serviceVaccine.SoMuiChuan;
        serviceVaccine.ThuTu = dto.ThuTu ?? serviceVaccine.ThuTu;
        serviceVaccine.GhiChu = dto.GhiChu ?? serviceVaccine.GhiChu;
        serviceVaccine.NgayCapNhat = DateTime.UtcNow;

        await _ctx.SaveChangesAsync(ct);
        return ApiResponse.Success("Cập nhật thông tin vaccine trong dịch vụ thành công");
    }

    /* ---------- 4. Xóa vaccine khỏi dịch vụ ---------- */
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id, CancellationToken ct)
    {
        var serviceVaccine = await _ctx.DichVuVaccines
            .FirstOrDefaultAsync(dv => dv.MaDichVuVaccine == id && dv.IsDelete == false, ct);
        if (serviceVaccine == null)
            return ApiResponse.Error("Không tìm thấy liên kết dịch vụ-vaccine");

        serviceVaccine.IsDelete = true;
        serviceVaccine.NgayCapNhat = DateTime.UtcNow;
        await _ctx.SaveChangesAsync(ct);
        return ApiResponse.Success("Xóa vaccine khỏi dịch vụ thành công");
    }
}

// DTOs bổ sung
public record ServiceVaccineCreateDto(
    string MaDichVu,
    string MaVaccine,
    int SoMuiChuan,
    int? ThuTu,
    string? GhiChu
);

public record ServiceVaccineUpdateDto(
    int? SoMuiChuan = null,
    int? ThuTu = null,
    string? GhiChu = null
);