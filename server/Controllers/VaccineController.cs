using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.DTOs.Pagination;
using server.DTOs.Vaccine;
using server.Helpers;
using server.Models;

namespace server.Controllers;

[ApiController]
[Route("api/vaccines")]
public class VaccineController : ControllerBase
{
    private readonly HeThongQuanLyTiemChungContext _ctx;

    public VaccineController(HeThongQuanLyTiemChungContext ctx) => _ctx = ctx;

    /* ---------- 1. Tất cả vaccine (paging) ---------- */
    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] int? page = 1,
        [FromQuery] int? pageSize = 20,
        CancellationToken ct = default)
    {
        var query = _ctx.Vaccines
                        .Where(v => v.IsDelete == false)
                        .OrderByDescending(v => v.NgayTao);

        var paged = await query.ToPagedAsync(page!.Value, pageSize!.Value, ct);

        var data = paged.Data.Select(v => new VaccineDto(
            v.MaVaccine,
            v.Ten,
            v.NhaSanXuat,
            v.TuoiBatDauTiem,
            v.TuoiKetThucTiem,
            v.PhongNgua,
            v.NgayTao!.Value)).ToList();

        return ApiResponse.Success(
            "Lấy danh sách vaccine thành công",
            new PagedResultDto<VaccineDto>(
                paged.TotalCount,
                paged.Page,
                paged.PageSize,
                paged.TotalPages,
                data));
    }

    /* ---------- 2. Theo ID ---------- */
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id, CancellationToken ct)
    {
        var vaccine = await _ctx.Vaccines
            .Include(v => v.AnhVaccines.Where(a => a.IsDelete == false))
                .ThenInclude(a => a.MaAnhNavigation)
            .FirstOrDefaultAsync(v => v.MaVaccine == id && v.IsDelete == false, ct);

        if (vaccine == null)
            return ApiResponse.Error("Không tìm thấy vaccine", 404);

        var dto = new VaccineDetailDto(
            vaccine.MaVaccine,
            vaccine.Ten,
            vaccine.NhaSanXuat,
            vaccine.TuoiBatDauTiem,
            vaccine.TuoiKetThucTiem,
            vaccine.HuongDanSuDung,
            vaccine.PhongNgua,
            vaccine.NgayTao!.Value,
            vaccine.AnhVaccines
                .OrderBy(a => a.ThuTuHienThi)
                .Select(a => new VaccineImageDto(
                    a.MaAnh,
                    a.MaAnhNavigation?.UrlAnh,
                    a.ThuTuHienThi ?? 0,
                    a.LaAnhChinh ?? false))
                .ToList());

        return ApiResponse.Success("Chi tiết vaccine", dto);
    }

    /* ---------- 3. Tạo mới ---------- */
    [HttpPost]
    public async Task<IActionResult> Create(
        [FromBody] VaccineCreateDto dto,
        CancellationToken ct)
    {
        if (await _ctx.Vaccines
                      .AnyAsync(v => v.Ten == dto.Name && v.IsDelete == false, ct))
            return ApiResponse.Error("Tên vaccine đã tồn tại", 409);

        var vaccine = new Vaccine
        {
            MaVaccine = Guid.NewGuid().ToString("N"),
            Ten = dto.Name,
            NhaSanXuat = dto.Manufacturer,
            TuoiBatDauTiem = dto.StartAge,
            TuoiKetThucTiem = dto.EndAge,
            HuongDanSuDung = dto.Usage,
            PhongNgua = dto.Prevention,
            IsActive = true,
            IsDelete = false,
            NgayTao = DateTime.UtcNow
        };

        _ctx.Vaccines.Add(vaccine);
        await _ctx.SaveChangesAsync(ct);

        return ApiResponse.Success("Tạo vaccine thành công",
            new { vaccine.MaVaccine }, 201);
    }

    /* ---------- 4. Cập nhật ---------- */
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(
        string id,
        [FromBody] VaccineUpdateDto dto,
        CancellationToken ct)
    {
        var vaccine = await _ctx.Vaccines
            .FirstOrDefaultAsync(v => v.MaVaccine == id && v.IsDelete == false, ct);
        if (vaccine == null)
            return ApiResponse.Error("Không tìm thấy vaccine", 404);

        // Kiểm tra tên vaccine đã tồn tại chưa
        if (dto.Name != null && dto.Name != vaccine.Ten &&
            await _ctx.Vaccines.AnyAsync(v => v.Ten == dto.Name && v.IsDelete == false && v.MaVaccine != id, ct))
            return ApiResponse.Error("Tên vaccine đã tồn tại", 409);

        vaccine.Ten = dto.Name ?? vaccine.Ten;
        vaccine.NhaSanXuat = dto.Manufacturer ?? vaccine.NhaSanXuat;
        vaccine.TuoiBatDauTiem = dto.StartAge ?? vaccine.TuoiBatDauTiem;
        vaccine.TuoiKetThucTiem = dto.EndAge ?? vaccine.TuoiKetThucTiem;
        vaccine.HuongDanSuDung = dto.Usage ?? vaccine.HuongDanSuDung;
        vaccine.PhongNgua = dto.Prevention ?? vaccine.PhongNgua;
        vaccine.NgayCapNhat = DateTime.UtcNow;

        await _ctx.SaveChangesAsync(ct);
        return ApiResponse.Success("Cập nhật vaccine thành công", null, 200);
    }

    /* ---------- 5. Xóa mềm ---------- */
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id, CancellationToken ct)
    {
        var vaccine = await _ctx.Vaccines
            .FirstOrDefaultAsync(v => v.MaVaccine == id && v.IsDelete == false, ct);
        if (vaccine == null)
            return ApiResponse.Error("Không tìm thấy vaccine", 404);

        // Kiểm tra xem vaccine có đang được sử dụng không
        if (await _ctx.DichVuVaccines.AnyAsync(dv => dv.MaVaccine == id && dv.IsDelete == false, ct))
            return ApiResponse.Error("Không thể xóa vaccine đang được sử dụng trong dịch vụ", 400);

        if (await _ctx.LoVaccines.AnyAsync(lv => lv.MaVaccine == id && lv.IsDelete == false, ct))
            return ApiResponse.Error("Không thể xóa vaccine đang có lô trong kho", 400);

        vaccine.IsDelete = true;
        vaccine.NgayCapNhat = DateTime.UtcNow;
        await _ctx.SaveChangesAsync(ct);
        return ApiResponse.Success("Xóa vaccine thành công", null, 200);
    }

    /* ---------- 6. Cập nhật danh sách ảnh ---------- */
    [HttpPut("{id}/images")]
    public async Task<IActionResult> UpdateImages(
        string id,
        [FromBody] List<VaccineImageUpdateDto> dtoList,
        CancellationToken ct)
    {
        var vaccine = await _ctx.Vaccines
            .Include(v => v.AnhVaccines)
            .FirstOrDefaultAsync(v => v.MaVaccine == id && v.IsDelete == false, ct);
        if (vaccine == null)
            return ApiResponse.Error("Không tìm thấy vaccine", 404);

        // Kiểm tra ảnh chính
        var mainImages = dtoList.Count(i => i.IsMain);
        if (mainImages > 1)
            return ApiResponse.Error("Chỉ được chọn một ảnh chính", 400);
        if (mainImages == 0 && dtoList.Any())
            return ApiResponse.Error("Phải chọn ít nhất một ảnh chính", 400);

        // Soft-delete ảnh cũ
        foreach (var old in vaccine.AnhVaccines.Where(a => a.IsDelete == false))
        {
            old.IsDelete = true;
            old.NgayCapNhat = DateTime.UtcNow;
        }

        // Thêm ảnh mới
        foreach (var item in dtoList.OrderBy(i => i.Order))
        {
            var img = new AnhVaccine
            {
                MaAnhVaccine = Guid.NewGuid().ToString("N"),
                MaVaccine = id,
                MaAnh = item.ImageId,
                LaAnhChinh = item.IsMain,
                ThuTuHienThi = item.Order,
                IsActive = true,
                IsDelete = false,
                NgayTao = DateTime.UtcNow
            };
            _ctx.AnhVaccines.Add(img);
        }

        await _ctx.SaveChangesAsync(ct);
        return ApiResponse.Success("Cập nhật ảnh vaccine thành công", null, 200);
    }

    /* ---------- 7. Lấy tất cả vaccine (không phân trang) ---------- */
    [HttpGet("all")]
    public async Task<IActionResult> GetAllNoPage(CancellationToken ct)
    {
        var vaccines = await _ctx.Vaccines
            .Where(v => v.IsDelete == false)
            .OrderBy(v => v.Ten)
            .Select(v => new VaccineDto(
                v.MaVaccine,
                v.Ten,
                v.NhaSanXuat,
                v.TuoiBatDauTiem,
                v.TuoiKetThucTiem,
                v.PhongNgua,
                v.NgayTao!.Value))
            .ToListAsync(ct);

        return ApiResponse.Success("Lấy danh sách vaccine thành công", vaccines);
    }
}