using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.DTOs.Kho;
using server.DTOs.Pagination;
using server.Helpers;
using server.Models;
using server.Types;

namespace server.Controllers;

[ApiController]
[Route("api/lo-vaccine")]
public class LoVaccineController : ControllerBase
{
    private readonly HeThongQuanLyTiemChungContext _ctx;

    public LoVaccineController(HeThongQuanLyTiemChungContext ctx) => _ctx = ctx;

    /* ---------- 1. Lấy danh sách lô vaccine (có phân trang) ---------- */
    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? search = null,
        [FromQuery] string? maVaccine = null,
        [FromQuery] string? maNhaCungCap = null,
        CancellationToken ct = default)
    {
        var query = _ctx.LoVaccines
            .Include(l => l.MaVaccineNavigation)
            .Include(l => l.MaNhaCungCapNavigation)
            .Where(l => l.IsDelete == false)
            // Step 1: Exclude LoVaccine records that have been disposed of (thanh lý)
            .Where(l => !l.ChiTietThanhLies.Any(ct => ct.IsDelete == false))
            // Step 2: Exclude LoVaccine records that have pending or rejected phiếu nhập
            .Where(l => !l.ChiTietNhaps.Any(chiTiet => chiTiet.IsDelete == false && 
                chiTiet.MaPhieuNhapNavigation != null && 
                (chiTiet.MaPhieuNhapNavigation.TrangThai == TrangThaiPhieuKho.Pending || 
                 chiTiet.MaPhieuNhapNavigation.TrangThai == TrangThaiPhieuKho.Rejected)))
            // Step 3: Only include LoVaccine records that have at least one approved phiếu nhập
            .Where(l => l.ChiTietNhaps.Any(chiTiet => chiTiet.IsDelete == false && 
                chiTiet.MaPhieuNhapNavigation != null && 
                chiTiet.MaPhieuNhapNavigation.TrangThai == TrangThaiPhieuKho.Approved));

        // Tìm kiếm theo từ khóa
        if (!string.IsNullOrEmpty(search))
        {
            query = query.Where(l => 
                (l.MaLo != null && l.MaLo.Contains(search)) ||
                (l.SoLo != null && l.SoLo.Contains(search)) ||
                (l.MaVaccineNavigation != null && l.MaVaccineNavigation.Ten.Contains(search)) ||
                (l.MaNhaCungCapNavigation != null && l.MaNhaCungCapNavigation.Ten.Contains(search)));
        }

        // Lọc theo vaccine
        if (!string.IsNullOrEmpty(maVaccine))
        {
            query = query.Where(l => l.MaVaccine == maVaccine);
        }

        // Lọc theo nhà cung cấp
        if (!string.IsNullOrEmpty(maNhaCungCap))
        {
            query = query.Where(l => l.MaNhaCungCap == maNhaCungCap);
        }

        var result = await query
            .OrderByDescending(l => l.NgayTao)
            .Select(l => new LoVaccineDto(
                l.MaLo,
                l.MaVaccine,
                l.MaNhaCungCap,
                l.SoLo,
                l.NgaySanXuat,
                l.NgayHetHan,
                l.SoLuongNhap,
                l.SoLuongHienTai,
                l.GiaNhap,
                l.NgayTao,
                l.NgayCapNhat,
                l.MaVaccineNavigation.Ten,
                l.MaNhaCungCapNavigation.Ten
            ))
            .ToPagedAsync(page, pageSize, ct);

        return ApiResponse.Success("Lấy danh sách lô vaccine thành công", result);
    }

    /* ---------- 2. Lấy chi tiết lô vaccine theo ID ---------- */
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id, CancellationToken ct = default)
    {
        var loVaccine = await _ctx.LoVaccines
            .Include(l => l.MaVaccineNavigation)
            .Include(l => l.MaNhaCungCapNavigation)
            .Include(l => l.TonKhoLos)
                .ThenInclude(tk => tk.MaDiaDiemNavigation)
            .Where(l => l.MaLo == id && l.IsDelete == false)
            // Step 1: Exclude LoVaccine records that have been disposed of (thanh lý)
            .Where(l => !l.ChiTietThanhLies.Any(ct => ct.IsDelete == false))
            // Step 2: Exclude LoVaccine records that have pending or rejected phiếu nhập
            .Where(l => !l.ChiTietNhaps.Any(chiTiet => chiTiet.IsDelete == false && 
                chiTiet.MaPhieuNhapNavigation != null && 
                (chiTiet.MaPhieuNhapNavigation.TrangThai == TrangThaiPhieuKho.Pending || 
                 chiTiet.MaPhieuNhapNavigation.TrangThai == TrangThaiPhieuKho.Rejected)))
            // Step 3: Only include LoVaccine records that have at least one approved phiếu nhập
            .Where(l => l.ChiTietNhaps.Any(chiTiet => chiTiet.IsDelete == false && 
                chiTiet.MaPhieuNhapNavigation != null && 
                chiTiet.MaPhieuNhapNavigation.TrangThai == TrangThaiPhieuKho.Approved))
            .FirstOrDefaultAsync(ct);

        if (loVaccine == null)
            return ApiResponse.Error("Không tìm thấy lô vaccine", 404);

        var tonKhoLos = loVaccine.TonKhoLos
            .Where(tk => tk.IsDelete == false)
            .Select(tk => new TonKhoLoDto(
                tk.MaTonKho,
                tk.MaDiaDiem,
                tk.MaLo,
                tk.SoLuong,
                tk.NgayTao,
                tk.NgayCapNhat,
                tk.MaDiaDiemNavigation != null ? tk.MaDiaDiemNavigation.Ten : "",
                loVaccine.SoLo,
                loVaccine.MaVaccineNavigation != null ? loVaccine.MaVaccineNavigation.Ten : ""
            ))
            .ToList();

        var result = new LoVaccineDetailDto(
            loVaccine.MaLo,
            loVaccine.MaVaccine,
            loVaccine.MaNhaCungCap,
            loVaccine.SoLo,
            loVaccine.NgaySanXuat,
            loVaccine.NgayHetHan,
            loVaccine.SoLuongNhap,
            loVaccine.SoLuongHienTai,
            loVaccine.GiaNhap,
            loVaccine.NgayTao,
            loVaccine.NgayCapNhat,
            loVaccine.MaVaccineNavigation.Ten,
            loVaccine.MaNhaCungCapNavigation.Ten,
            tonKhoLos
        );

        return ApiResponse.Success("Lấy chi tiết lô vaccine thành công", result);
    }

    /* ---------- 3. Tạo lô vaccine mới ---------- */
    [HttpPost]
    public async Task<IActionResult> Create(
        [FromBody] LoVaccineCreateDto dto,
        CancellationToken ct = default)
    {
        // Kiểm tra vaccine tồn tại
        if (!await _ctx.Vaccines.AnyAsync(v => v.MaVaccine == dto.MaVaccine && v.IsDelete == false, ct))
            return ApiResponse.Error("Vaccine không tồn tại", 404);

        // Kiểm tra nhà cung cấp tồn tại
        if (!await _ctx.NhaCungCaps.AnyAsync(ncc => ncc.MaNhaCungCap == dto.MaNhaCungCap && ncc.IsDelete == false, ct))
            return ApiResponse.Error("Nhà cung cấp không tồn tại", 404);

        // Kiểm tra số lô đã tồn tại
        if (!string.IsNullOrEmpty(dto.SoLo))
        {
            if (await _ctx.LoVaccines.AnyAsync(l => l.SoLo == dto.SoLo && l.IsDelete == false, ct))
                return ApiResponse.Error("Số lô đã tồn tại", 409);
        }

        var loVaccine = new LoVaccine
        {
            MaLo = Guid.NewGuid().ToString("N"),
            MaVaccine = dto.MaVaccine,
            MaNhaCungCap = dto.MaNhaCungCap,
            SoLo = dto.SoLo,
            NgaySanXuat = dto.NgaySanXuat,
            NgayHetHan = dto.NgayHetHan,
            SoLuongNhap = dto.SoLuongNhap,
            SoLuongHienTai = dto.SoLuongNhap,
            GiaNhap = dto.GiaNhap,
            IsActive = true,
            IsDelete = false,
            NgayTao = DateTime.UtcNow
        };

        _ctx.LoVaccines.Add(loVaccine);
        await _ctx.SaveChangesAsync(ct);

        return ApiResponse.Success("Tạo lô vaccine thành công", 
            new { loVaccine.MaLo }, 201);
    }

    /* ---------- 4. Cập nhật lô vaccine ---------- */
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(
        string id,
        [FromBody] LoVaccineUpdateDto dto,
        CancellationToken ct = default)
    {
        var loVaccine = await _ctx.LoVaccines
            .FirstOrDefaultAsync(l => l.MaLo == id && l.IsDelete == false, ct);

        if (loVaccine == null)
            return ApiResponse.Error("Không tìm thấy lô vaccine", 404);

        // Kiểm tra số lô đã tồn tại (nếu thay đổi)
        if (!string.IsNullOrEmpty(dto.SoLo) && dto.SoLo != loVaccine.SoLo)
        {
            if (await _ctx.LoVaccines.AnyAsync(l => l.SoLo == dto.SoLo && l.MaLo != id && l.IsDelete == false, ct))
                return ApiResponse.Error("Số lô đã tồn tại", 409);
            loVaccine.SoLo = dto.SoLo;
        }

        if (dto.NgaySanXuat.HasValue)
            loVaccine.NgaySanXuat = dto.NgaySanXuat.Value;

        if (dto.NgayHetHan.HasValue)
            loVaccine.NgayHetHan = dto.NgayHetHan.Value;

        if (dto.SoLuongHienTai.HasValue)
            loVaccine.SoLuongHienTai = dto.SoLuongHienTai.Value;

        if (dto.GiaNhap.HasValue)
            loVaccine.GiaNhap = dto.GiaNhap.Value;

        loVaccine.NgayCapNhat = DateTime.UtcNow;

        await _ctx.SaveChangesAsync(ct);
        return ApiResponse.Success("Cập nhật lô vaccine thành công", null);
    }

    /* ---------- 5. Xóa lô vaccine (soft delete) ---------- */
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id, CancellationToken ct = default)
    {
        var loVaccine = await _ctx.LoVaccines
            .FirstOrDefaultAsync(l => l.MaLo == id && l.IsDelete == false, ct);

        if (loVaccine == null)
            return ApiResponse.Error("Không tìm thấy lô vaccine", 404);

        // Kiểm tra lô vaccine có đang được sử dụng không
        if (await _ctx.ChiTietNhaps.AnyAsync(ct => ct.MaLo == id && ct.IsDelete == false, ct))
            return ApiResponse.Error("Không thể xóa lô vaccine đang được sử dụng trong phiếu nhập", 400);

        if (await _ctx.ChiTietXuats.AnyAsync(ct => ct.MaLo == id && ct.IsDelete == false, ct))
            return ApiResponse.Error("Không thể xóa lô vaccine đang được sử dụng trong phiếu xuất", 400);

        if (await _ctx.ChiTietThanhLies.AnyAsync(ct => ct.MaLo == id && ct.IsDelete == false, ct))
            return ApiResponse.Error("Không thể xóa lô vaccine đang được sử dụng trong phiếu thanh lý", 400);

        // Check if this vaccine batch is being used in any injection records
        var vaccineInBatch = await _ctx.LoVaccines
            .Where(lv => lv.MaLo == id)
            .Select(lv => lv.MaVaccine)
            .FirstOrDefaultAsync(ct);
            
        if (vaccineInBatch != null && await _ctx.ChiTietPhieuTiems.AnyAsync(ctpt => ctpt.MaVaccine == vaccineInBatch, ct))
            return ApiResponse.Error("Không thể xóa lô vaccine đang được sử dụng trong phiếu tiêm", 400);

        loVaccine.IsDelete = true;
        loVaccine.NgayCapNhat = DateTime.UtcNow;

        await _ctx.SaveChangesAsync(ct);
        return ApiResponse.Success("Xóa lô vaccine thành công", null);
    }

    /* ---------- 6. Lấy danh sách lô vaccine theo vaccine ---------- */
    [HttpGet("by-vaccine/{vaccineId}")]
    public async Task<IActionResult> GetByVaccine(
        string vaccineId,
        CancellationToken ct = default)
    {
        var loVaccines = await _ctx.LoVaccines
            .Include(l => l.MaVaccineNavigation)
            .Include(l => l.MaNhaCungCapNavigation)
            .Where(l => l.MaVaccine == vaccineId && l.IsDelete == false)
            // Step 1: Exclude LoVaccine records that have been disposed of (thanh lý)
            .Where(l => !l.ChiTietThanhLies.Any(ct => ct.IsDelete == false))
            // Step 2: Exclude LoVaccine records that have pending or rejected phiếu nhập
            .Where(l => !l.ChiTietNhaps.Any(chiTiet => chiTiet.IsDelete == false && 
                chiTiet.MaPhieuNhapNavigation != null && 
                (chiTiet.MaPhieuNhapNavigation.TrangThai == TrangThaiPhieuKho.Pending || 
                 chiTiet.MaPhieuNhapNavigation.TrangThai == TrangThaiPhieuKho.Rejected)))
            // Step 3: Only include LoVaccine records that have at least one approved phiếu nhập
            .Where(l => l.ChiTietNhaps.Any(chiTiet => chiTiet.IsDelete == false && 
                chiTiet.MaPhieuNhapNavigation != null && 
                chiTiet.MaPhieuNhapNavigation.TrangThai == TrangThaiPhieuKho.Approved))
            .OrderByDescending(l => l.NgayTao)
            .Select(l => new LoVaccineDto(
                l.MaLo,
                l.MaVaccine,
                l.MaNhaCungCap,
                l.SoLo,
                l.NgaySanXuat,
                l.NgayHetHan,
                l.SoLuongNhap,
                l.SoLuongHienTai,
                l.GiaNhap,
                l.NgayTao,
                l.NgayCapNhat,
                l.MaVaccineNavigation.Ten,
                l.MaNhaCungCapNavigation.Ten
            ))
            .ToListAsync(ct);

        return ApiResponse.Success("Lấy danh sách lô vaccine theo vaccine thành công", loVaccines);
    }

    /* ---------- 7. Kiểm tra hạn sử dụng ---------- */
    [HttpGet("expiring-soon")]
    public async Task<IActionResult> GetExpiringSoon(
        [FromQuery] int days = 30,
        CancellationToken ct = default)
    {
        var expiringDate = DateOnly.FromDateTime(DateTime.Today.AddDays(days));

        var expiringLoVaccines = await _ctx.LoVaccines
            .Include(l => l.MaVaccineNavigation)
            .Include(l => l.MaNhaCungCapNavigation)
            .Where(l => l.NgayHetHan.HasValue && 
                       l.NgayHetHan <= expiringDate && 
                       l.IsDelete == false &&
                       l.SoLuongHienTai > 0)
            // Step 1: Exclude LoVaccine records that have been disposed of (thanh lý)
            .Where(l => !l.ChiTietThanhLies.Any(ct => ct.IsDelete == false))
            // Step 2: Exclude LoVaccine records that have pending or rejected phiếu nhập
            .Where(l => !l.ChiTietNhaps.Any(chiTiet => chiTiet.IsDelete == false && 
                chiTiet.MaPhieuNhapNavigation != null && 
                (chiTiet.MaPhieuNhapNavigation.TrangThai == TrangThaiPhieuKho.Pending || 
                 chiTiet.MaPhieuNhapNavigation.TrangThai == TrangThaiPhieuKho.Rejected)))
            // Step 3: Only include LoVaccine records that have at least one approved phiếu nhập
            .Where(l => l.ChiTietNhaps.Any(chiTiet => chiTiet.IsDelete == false && 
                chiTiet.MaPhieuNhapNavigation != null && 
                chiTiet.MaPhieuNhapNavigation.TrangThai == TrangThaiPhieuKho.Approved))
            .OrderBy(l => l.NgayHetHan)
            .Select(l => new LoVaccineDto(
                l.MaLo,
                l.MaVaccine,
                l.MaNhaCungCap,
                l.SoLo,
                l.NgaySanXuat,
                l.NgayHetHan,
                l.SoLuongNhap,
                l.SoLuongHienTai,
                l.GiaNhap,
                l.NgayTao,
                l.NgayCapNhat,
                l.MaVaccineNavigation.Ten,
                l.MaNhaCungCapNavigation.Ten
            ))
            .ToListAsync(ct);

        return ApiResponse.Success($"Lấy danh sách lô vaccine sắp hết hạn (trong {days} ngày) thành công", expiringLoVaccines);
    }
} 