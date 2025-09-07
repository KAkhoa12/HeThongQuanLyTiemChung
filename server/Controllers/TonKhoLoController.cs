using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.DTOs.Kho;
using server.DTOs.Pagination;
using server.Helpers;
using server.Models;
using server.Types;

namespace server.Controllers;

[ApiController]
[Route("api/ton-kho-lo")]
public class TonKhoLoController : ControllerBase
{
    private readonly HeThongQuanLyTiemChungContext _ctx;

    public TonKhoLoController(HeThongQuanLyTiemChungContext ctx) => _ctx = ctx;

    /* ---------- 1. Lấy danh sách tồn kho lô (có phân trang) ---------- */
    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? search = null,
        [FromQuery] string? maDiaDiem = null,
        [FromQuery] string? maLo = null,
        CancellationToken ct = default)
    {
        var query = _ctx.TonKhoLos
            .Include(tk => tk.MaDiaDiemNavigation)
            .Include(tk => tk.MaLoNavigation)
                .ThenInclude(l => l.MaVaccineNavigation)
            .Where(tk => tk.IsDelete == false)
            // Step 1: Exclude TonKhoLo records where LoVaccine has been disposed of (thanh lý)
            .Where(tk => !tk.MaLoNavigation.ChiTietThanhLies.Any(ct => ct.IsDelete == false))
            // Step 2: Exclude TonKhoLo records where LoVaccine has pending or rejected phiếu nhập
            .Where(tk => !tk.MaLoNavigation.ChiTietNhaps.Any(chiTiet => chiTiet.IsDelete == false && 
                chiTiet.MaPhieuNhapNavigation != null && 
                (chiTiet.MaPhieuNhapNavigation.TrangThai == TrangThaiPhieuKho.Pending || 
                 chiTiet.MaPhieuNhapNavigation.TrangThai == TrangThaiPhieuKho.Rejected)))
            // Step 3: Only include TonKhoLo records where LoVaccine has at least one approved phiếu nhập
            .Where(tk => tk.MaLoNavigation.ChiTietNhaps.Any(chiTiet => chiTiet.IsDelete == false && 
                chiTiet.MaPhieuNhapNavigation != null && 
                chiTiet.MaPhieuNhapNavigation.TrangThai == TrangThaiPhieuKho.Approved));

        // Tìm kiếm theo từ khóa
        if (!string.IsNullOrEmpty(search))
        {
            query = query.Where(tk => 
                (tk.MaTonKho != null && tk.MaTonKho.Contains(search)) ||
                (tk.MaLoNavigation != null && tk.MaLoNavigation.SoLo != null && tk.MaLoNavigation.SoLo.Contains(search)) ||
                (tk.MaLoNavigation != null && tk.MaLoNavigation.MaVaccineNavigation != null && tk.MaLoNavigation.MaVaccineNavigation.Ten != null && tk.MaLoNavigation.MaVaccineNavigation.Ten.Contains(search)) ||
                (tk.MaDiaDiemNavigation != null && tk.MaDiaDiemNavigation.Ten != null && tk.MaDiaDiemNavigation.Ten.Contains(search)));
        }

        // Lọc theo địa điểm
        if (!string.IsNullOrEmpty(maDiaDiem))
        {
            query = query.Where(tk => tk.MaDiaDiem == maDiaDiem);
        }

        // Lọc theo lô
        if (!string.IsNullOrEmpty(maLo))
        {
            query = query.Where(tk => tk.MaLo == maLo);
        }

        var result = await query
            .OrderByDescending(tk => tk.NgayTao)
            .Select(tk => new TonKhoLoDto(
                tk.MaTonKho,
                tk.MaDiaDiem,
                tk.MaLo,
                tk.SoLuong,
                tk.NgayTao,
                tk.NgayCapNhat,
                tk.MaDiaDiemNavigation != null ? tk.MaDiaDiemNavigation != null ? tk.MaDiaDiemNavigation.Ten : "" : "",
                tk.MaLoNavigation != null ? tk.MaLoNavigation.SoLo : "",
                tk.MaLoNavigation != null && tk.MaLoNavigation.MaVaccineNavigation != null ? tk.MaLoNavigation != null && tk.MaLoNavigation.MaVaccineNavigation != null ? tk.MaLoNavigation.MaVaccineNavigation.Ten : "" : ""
            ))
            .ToPagedAsync(page, pageSize, ct);

        return ApiResponse.Success("Lấy danh sách tồn kho lô thành công", result);
    }

    /* ---------- 2. Lấy chi tiết tồn kho lô theo ID ---------- */
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id, CancellationToken ct = default)
    {
        var tonKhoLo = await _ctx.TonKhoLos
            .Include(tk => tk.MaDiaDiemNavigation)
            .Include(tk => tk.MaLoNavigation)
                .ThenInclude(l => l.MaVaccineNavigation)
            .Where(tk => tk.MaTonKho == id && tk.IsDelete == false)
            // Step 1: Exclude TonKhoLo records where LoVaccine has been disposed of (thanh lý)
            .Where(tk => !tk.MaLoNavigation.ChiTietThanhLies.Any(ct => ct.IsDelete == false))
            // Step 2: Exclude TonKhoLo records where LoVaccine has pending or rejected phiếu nhập
            .Where(tk => !tk.MaLoNavigation.ChiTietNhaps.Any(chiTiet => chiTiet.IsDelete == false && 
                chiTiet.MaPhieuNhapNavigation != null && 
                (chiTiet.MaPhieuNhapNavigation.TrangThai == TrangThaiPhieuKho.Pending || 
                 chiTiet.MaPhieuNhapNavigation.TrangThai == TrangThaiPhieuKho.Rejected)))
            // Step 3: Only include TonKhoLo records where LoVaccine has at least one approved phiếu nhập
            .Where(tk => tk.MaLoNavigation.ChiTietNhaps.Any(chiTiet => chiTiet.IsDelete == false && 
                chiTiet.MaPhieuNhapNavigation != null && 
                chiTiet.MaPhieuNhapNavigation.TrangThai == TrangThaiPhieuKho.Approved))
            .FirstOrDefaultAsync(ct);

        if (tonKhoLo == null)
            return ApiResponse.Error("Không tìm thấy tồn kho lô", 404);

        var result = new TonKhoLoDto(
            tonKhoLo.MaTonKho,
            tonKhoLo.MaDiaDiem,
            tonKhoLo.MaLo,
            tonKhoLo.SoLuong,
            tonKhoLo.NgayTao,
            tonKhoLo.NgayCapNhat,
            tonKhoLo.MaDiaDiemNavigation?.Ten,
            tonKhoLo.MaLoNavigation?.SoLo,
            tonKhoLo.MaLoNavigation?.MaVaccineNavigation?.Ten
        );

        return ApiResponse.Success("Lấy chi tiết tồn kho lô thành công", result);
    }

    /* ---------- 3. Tạo tồn kho lô mới ---------- */
    [HttpPost]
    public async Task<IActionResult> Create(
        [FromBody] TonKhoLoCreateDto dto,
        CancellationToken ct = default)
    {
        // Kiểm tra địa điểm tồn tại
        if (!await _ctx.DiaDiems.AnyAsync(dd => dd.MaDiaDiem == dto.MaDiaDiem && dd.IsDelete == false, ct))
            return ApiResponse.Error("Địa điểm không tồn tại", 404);

        // Kiểm tra lô vaccine tồn tại
        if (!await _ctx.LoVaccines.AnyAsync(l => l.MaLo == dto.MaLo && l.IsDelete == false, ct))
            return ApiResponse.Error("Lô vaccine không tồn tại", 404);

        // Kiểm tra đã tồn tại tồn kho cho lô này tại địa điểm này chưa
        var existingTonKho = await _ctx.TonKhoLos
            .FirstOrDefaultAsync(tk => tk.MaLo == dto.MaLo && tk.MaDiaDiem == dto.MaDiaDiem && tk.IsDelete == false, ct);

        if (existingTonKho != null)
            return ApiResponse.Error("Đã tồn tại tồn kho cho lô vaccine này tại địa điểm này", 409);

        var tonKhoLo = new TonKhoLo
        {
            MaTonKho = Guid.NewGuid().ToString("N"),
            MaDiaDiem = dto.MaDiaDiem,
            MaLo = dto.MaLo,
            SoLuong = dto.SoLuong,
            IsActive = true,
            IsDelete = false,
            NgayTao = DateTime.UtcNow
        };

        _ctx.TonKhoLos.Add(tonKhoLo);
        await _ctx.SaveChangesAsync(ct);

        return ApiResponse.Success("Tạo tồn kho lô thành công", 
            new { tonKhoLo.MaTonKho }, 201);
    }

    /* ---------- 4. Cập nhật tồn kho lô ---------- */
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(
        string id,
        [FromBody] TonKhoLoUpdateDto dto,
        CancellationToken ct = default)
    {
        var tonKhoLo = await _ctx.TonKhoLos
            .FirstOrDefaultAsync(tk => tk.MaTonKho == id && tk.IsDelete == false, ct);

        if (tonKhoLo == null)
            return ApiResponse.Error("Không tìm thấy tồn kho lô", 404);

        if (dto.SoLuong.HasValue)
        {
            // Kiểm tra số lượng không âm
            if (dto.SoLuong.Value < 0)
                return ApiResponse.Error("Số lượng không thể âm", 400);

            tonKhoLo.SoLuong = dto.SoLuong.Value;
        }

        tonKhoLo.NgayCapNhat = DateTime.UtcNow;

        await _ctx.SaveChangesAsync(ct);
        return ApiResponse.Success("Cập nhật tồn kho lô thành công", null);
    }

    /* ---------- 5. Xóa tồn kho lô (soft delete) ---------- */
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id, CancellationToken ct = default)
    {
        var tonKhoLo = await _ctx.TonKhoLos
            .FirstOrDefaultAsync(tk => tk.MaTonKho == id && tk.IsDelete == false, ct);

        if (tonKhoLo == null)
            return ApiResponse.Error("Không tìm thấy tồn kho lô", 404);

        tonKhoLo.IsDelete = true;
        tonKhoLo.NgayCapNhat = DateTime.UtcNow;

        await _ctx.SaveChangesAsync(ct);
        return ApiResponse.Success("Xóa tồn kho lô thành công", null);
    }

    /* ---------- 6. Lấy tồn kho theo địa điểm ---------- */
    [HttpGet("by-dia-diem/{diaDiemId}")]
    public async Task<IActionResult> GetByDiaDiem(
        string diaDiemId,
        CancellationToken ct = default)
    {
        var tonKhoLos = await _ctx.TonKhoLos
            .Include(tk => tk.MaDiaDiemNavigation)
            .Include(tk => tk.MaLoNavigation)
                .ThenInclude(l => l.MaVaccineNavigation)
            .Where(tk => tk.MaDiaDiem == diaDiemId && tk.IsDelete == false && tk.SoLuong > 0)
            // Step 1: Exclude TonKhoLo records where LoVaccine has been disposed of (thanh lý)
            .Where(tk => !tk.MaLoNavigation.ChiTietThanhLies.Any(ct => ct.IsDelete == false))
            // Step 2: Exclude TonKhoLo records where LoVaccine has pending or rejected phiếu nhập
            .Where(tk => !tk.MaLoNavigation.ChiTietNhaps.Any(chiTiet => chiTiet.IsDelete == false && 
                chiTiet.MaPhieuNhapNavigation != null && 
                (chiTiet.MaPhieuNhapNavigation.TrangThai == TrangThaiPhieuKho.Pending || 
                 chiTiet.MaPhieuNhapNavigation.TrangThai == TrangThaiPhieuKho.Rejected)))
            // Step 3: Only include TonKhoLo records where LoVaccine has at least one approved phiếu nhập
            .Where(tk => tk.MaLoNavigation.ChiTietNhaps.Any(chiTiet => chiTiet.IsDelete == false && 
                chiTiet.MaPhieuNhapNavigation != null && 
                chiTiet.MaPhieuNhapNavigation.TrangThai == TrangThaiPhieuKho.Approved))
            .OrderBy(tk => tk.MaLoNavigation != null && tk.MaLoNavigation.MaVaccineNavigation != null ? tk.MaLoNavigation.MaVaccineNavigation.Ten : "")
            .Select(tk => new TonKhoLoDto(
                tk.MaTonKho,
                tk.MaDiaDiem,
                tk.MaLo,
                tk.SoLuong,
                tk.NgayTao,
                tk.NgayCapNhat,
                tk.MaDiaDiemNavigation != null ? tk.MaDiaDiemNavigation != null ? tk.MaDiaDiemNavigation.Ten : "" : "",
                tk.MaLoNavigation != null ? tk.MaLoNavigation.SoLo : "",
                tk.MaLoNavigation != null && tk.MaLoNavigation.MaVaccineNavigation != null ? tk.MaLoNavigation != null && tk.MaLoNavigation.MaVaccineNavigation != null ? tk.MaLoNavigation.MaVaccineNavigation.Ten : "" : ""
            ))
            .ToListAsync(ct);

        return ApiResponse.Success("Lấy tồn kho theo địa điểm thành công", tonKhoLos);
    }

    /* ---------- 7. Lấy tồn kho theo lô vaccine ---------- */
    [HttpGet("by-lo/{loId}")]
    public async Task<IActionResult> GetByLo(
        string loId,
        CancellationToken ct = default)
    {
        var tonKhoLos = await _ctx.TonKhoLos
            .Include(tk => tk.MaDiaDiemNavigation)
            .Include(tk => tk.MaLoNavigation)
                .ThenInclude(l => l.MaVaccineNavigation)
            .Where(tk => tk.MaLo == loId && tk.IsDelete == false)
            // Step 1: Exclude TonKhoLo records where LoVaccine has been disposed of (thanh lý)
            .Where(tk => !tk.MaLoNavigation.ChiTietThanhLies.Any(ct => ct.IsDelete == false))
            // Step 2: Exclude TonKhoLo records where LoVaccine has pending or rejected phiếu nhập
            .Where(tk => !tk.MaLoNavigation.ChiTietNhaps.Any(chiTiet => chiTiet.IsDelete == false && 
                chiTiet.MaPhieuNhapNavigation != null && 
                (chiTiet.MaPhieuNhapNavigation.TrangThai == TrangThaiPhieuKho.Pending || 
                 chiTiet.MaPhieuNhapNavigation.TrangThai == TrangThaiPhieuKho.Rejected)))
            // Step 3: Only include TonKhoLo records where LoVaccine has at least one approved phiếu nhập
            .Where(tk => tk.MaLoNavigation.ChiTietNhaps.Any(chiTiet => chiTiet.IsDelete == false && 
                chiTiet.MaPhieuNhapNavigation != null && 
                chiTiet.MaPhieuNhapNavigation.TrangThai == TrangThaiPhieuKho.Approved))
            .OrderBy(tk => tk.MaDiaDiemNavigation != null ? tk.MaDiaDiemNavigation.Ten : "")
            .Select(tk => new TonKhoLoDto(
                tk.MaTonKho,
                tk.MaDiaDiem,
                tk.MaLo,
                tk.SoLuong,
                tk.NgayTao,
                tk.NgayCapNhat,
                tk.MaDiaDiemNavigation != null ? tk.MaDiaDiemNavigation != null ? tk.MaDiaDiemNavigation.Ten : "" : "",
                tk.MaLoNavigation != null ? tk.MaLoNavigation.SoLo : "",
                tk.MaLoNavigation != null && tk.MaLoNavigation.MaVaccineNavigation != null ? tk.MaLoNavigation != null && tk.MaLoNavigation.MaVaccineNavigation != null ? tk.MaLoNavigation.MaVaccineNavigation.Ten : "" : ""
            ))
            .ToListAsync(ct);

        return ApiResponse.Success("Lấy tồn kho theo lô vaccine thành công", tonKhoLos);
    }

    /* ---------- 8. Lấy tổng quan tồn kho ---------- */
    [HttpGet("summary")]
    public async Task<IActionResult> GetSummary(CancellationToken ct = default)
    {
        var summary = await _ctx.TonKhoLos
            .Include(tk => tk.MaDiaDiemNavigation)
            .Include(tk => tk.MaLoNavigation)
                .ThenInclude(l => l.MaVaccineNavigation)
            .Where(tk => tk.IsDelete == false && tk.SoLuong > 0)
            // Step 1: Exclude TonKhoLo records where LoVaccine has been disposed of (thanh lý)
            .Where(tk => !tk.MaLoNavigation.ChiTietThanhLies.Any(ct => ct.IsDelete == false))
            // Step 2: Exclude TonKhoLo records where LoVaccine has pending or rejected phiếu nhập
            .Where(tk => !tk.MaLoNavigation.ChiTietNhaps.Any(chiTiet => chiTiet.IsDelete == false && 
                chiTiet.MaPhieuNhapNavigation != null && 
                (chiTiet.MaPhieuNhapNavigation.TrangThai == TrangThaiPhieuKho.Pending || 
                 chiTiet.MaPhieuNhapNavigation.TrangThai == TrangThaiPhieuKho.Rejected)))
            // Step 3: Only include TonKhoLo records where LoVaccine has at least one approved phiếu nhập
            .Where(tk => tk.MaLoNavigation.ChiTietNhaps.Any(chiTiet => chiTiet.IsDelete == false && 
                chiTiet.MaPhieuNhapNavigation != null && 
                chiTiet.MaPhieuNhapNavigation.TrangThai == TrangThaiPhieuKho.Approved))
            .GroupBy(tk => new { MaDiaDiem = tk.MaDiaDiem, Ten = tk.MaDiaDiemNavigation != null ? tk.MaDiaDiemNavigation.Ten : "" })
            .Select(g => new TonKhoSummaryDto(
                g.Key.MaDiaDiem ?? "",
                g.Key.Ten ?? "",
                g.Count(),
                g.Sum(tk => tk.SoLuong ?? 0),
                g.Sum(tk => (tk.SoLuong ?? 0) * (tk.MaLoNavigation.GiaNhap ?? 0))
            ))
            .ToListAsync(ct);

        return ApiResponse.Success("Lấy tổng quan tồn kho thành công", summary);
    }

    /* ---------- 9. Cập nhật số lượng tồn kho (dùng cho nhập/xuất) ---------- */
    [HttpPost("update-quantity")]
    public async Task<IActionResult> UpdateQuantity(
        [FromBody] TonKhoLoUpdateDto dto,
        CancellationToken ct = default)
    {
        if (string.IsNullOrEmpty(dto.MaLo) || string.IsNullOrEmpty(dto.MaDiaDiem))
            return ApiResponse.Error("Mã lô và mã địa điểm không được để trống", 400);

        var tonKhoLo = await _ctx.TonKhoLos
            .FirstOrDefaultAsync(tk => tk.MaLo == dto.MaLo && tk.MaDiaDiem == dto.MaDiaDiem && tk.IsDelete == false, ct);

        if (tonKhoLo == null)
            return ApiResponse.Error("Không tìm thấy tồn kho lô", 404);

        if (dto.SoLuong.HasValue)
        {
            // Kiểm tra số lượng không âm
            if (dto.SoLuong.Value < 0)
                return ApiResponse.Error("Số lượng không thể âm", 400);

            tonKhoLo.SoLuong = dto.SoLuong.Value;
            tonKhoLo.NgayCapNhat = DateTime.UtcNow;
        }

        await _ctx.SaveChangesAsync(ct);
        return ApiResponse.Success("Cập nhật số lượng tồn kho thành công", null);
    }

    /* ---------- 10. Lấy danh sách lô vaccine sắp hết hạn ---------- */
    [HttpGet("expiring-soon")]
    public async Task<IActionResult> GetExpiringSoon(
        [FromQuery] int daysAhead = 30,
        [FromQuery] string? maDiaDiem = null,
        CancellationToken ct = default)
    {
        var cutoffDate = DateTime.UtcNow.AddDays(daysAhead);
        
        var query = _ctx.TonKhoLos
            .Include(tk => tk.MaDiaDiemNavigation)
            .Include(tk => tk.MaLoNavigation)
                .ThenInclude(l => l.MaVaccineNavigation)
            .Where(tk => tk.IsDelete == false && 
                        tk.SoLuong > 0 &&
                        tk.MaLoNavigation.NgayHetHan.HasValue &&
                        tk.MaLoNavigation.NgayHetHan.Value <= DateOnly.FromDateTime(cutoffDate))
            // Step 1: Exclude TonKhoLo records where LoVaccine has been disposed of (thanh lý)
            .Where(tk => !tk.MaLoNavigation.ChiTietThanhLies.Any(ct => ct.IsDelete == false))
            // Step 2: Exclude TonKhoLo records where LoVaccine has pending or rejected phiếu nhập
            .Where(tk => !tk.MaLoNavigation.ChiTietNhaps.Any(chiTiet => chiTiet.IsDelete == false && 
                chiTiet.MaPhieuNhapNavigation != null && 
                (chiTiet.MaPhieuNhapNavigation.TrangThai == TrangThaiPhieuKho.Pending || 
                 chiTiet.MaPhieuNhapNavigation.TrangThai == TrangThaiPhieuKho.Rejected)))
            // Step 3: Only include TonKhoLo records where LoVaccine has at least one approved phiếu nhập
            .Where(tk => tk.MaLoNavigation.ChiTietNhaps.Any(chiTiet => chiTiet.IsDelete == false && 
                chiTiet.MaPhieuNhapNavigation != null && 
                chiTiet.MaPhieuNhapNavigation.TrangThai == TrangThaiPhieuKho.Approved));

        if (!string.IsNullOrEmpty(maDiaDiem))
        {
            query = query.Where(tk => tk.MaDiaDiem == maDiaDiem);
        }

        var result = await query
            .OrderBy(tk => tk.MaLoNavigation.NgayHetHan)
            .Select(tk => new
            {
                tk.MaTonKho,
                tk.MaDiaDiem,
                tk.MaLo,
                tk.SoLuong,
                TenDiaDiem = tk.MaDiaDiemNavigation != null ? tk.MaDiaDiemNavigation.Ten : "",
                SoLo = tk.MaLoNavigation.SoLo,
                TenVaccine = tk.MaLoNavigation != null && tk.MaLoNavigation.MaVaccineNavigation != null ? tk.MaLoNavigation.MaVaccineNavigation.Ten : "",
                NgayHetHan = tk.MaLoNavigation.NgayHetHan,
                NgaySanXuat = tk.MaLoNavigation.NgaySanXuat,
                SoNgayConLai = tk.MaLoNavigation.NgayHetHan.HasValue ? 
                    EF.Functions.DateDiffDay(DateTime.UtcNow, tk.MaLoNavigation.NgayHetHan.Value.ToDateTime(TimeOnly.MinValue)) : (int?)null
            })
            .ToListAsync(ct);

        return ApiResponse.Success("Lấy danh sách lô vaccine sắp hết hạn thành công", result);
    }

    /* ---------- 11. Lấy danh sách vaccine có tồn kho thấp ---------- */
    [HttpGet("low-stock")]
    public async Task<IActionResult> GetLowStock(
        [FromQuery] int threshold = 50,
        [FromQuery] string? maDiaDiem = null,
        CancellationToken ct = default)
    {
        var query = _ctx.TonKhoLos
            .Include(tk => tk.MaDiaDiemNavigation)
            .Include(tk => tk.MaLoNavigation)
                .ThenInclude(l => l.MaVaccineNavigation)
            .Where(tk => tk.IsDelete == false && 
                        tk.SoLuong <= threshold &&
                        tk.SoLuong > 0)
            // Step 1: Exclude TonKhoLo records where LoVaccine has been disposed of (thanh lý)
            .Where(tk => !tk.MaLoNavigation.ChiTietThanhLies.Any(ct => ct.IsDelete == false))
            // Step 2: Exclude TonKhoLo records where LoVaccine has pending or rejected phiếu nhập
            .Where(tk => !tk.MaLoNavigation.ChiTietNhaps.Any(chiTiet => chiTiet.IsDelete == false && 
                chiTiet.MaPhieuNhapNavigation != null && 
                (chiTiet.MaPhieuNhapNavigation.TrangThai == TrangThaiPhieuKho.Pending || 
                 chiTiet.MaPhieuNhapNavigation.TrangThai == TrangThaiPhieuKho.Rejected)))
            // Step 3: Only include TonKhoLo records where LoVaccine has at least one approved phiếu nhập
            .Where(tk => tk.MaLoNavigation.ChiTietNhaps.Any(chiTiet => chiTiet.IsDelete == false && 
                chiTiet.MaPhieuNhapNavigation != null && 
                chiTiet.MaPhieuNhapNavigation.TrangThai == TrangThaiPhieuKho.Approved));

        if (!string.IsNullOrEmpty(maDiaDiem))
        {
            query = query.Where(tk => tk.MaDiaDiem == maDiaDiem);
        }

        var result = await query
            .OrderBy(tk => tk.SoLuong)
            .Select(tk => new
            {
                tk.MaTonKho,
                tk.MaDiaDiem,
                tk.MaLo,
                tk.SoLuong,
                TenDiaDiem = tk.MaDiaDiemNavigation != null ? tk.MaDiaDiemNavigation.Ten : "",
                SoLo = tk.MaLoNavigation.SoLo,
                TenVaccine = tk.MaLoNavigation != null && tk.MaLoNavigation.MaVaccineNavigation != null ? tk.MaLoNavigation.MaVaccineNavigation.Ten : "",
                NgayHetHan = tk.MaLoNavigation.NgayHetHan,
                GiaNhap = tk.MaLoNavigation.GiaNhap,
                TrangThai = tk.SoLuong == 0 ? "Hết hàng" : 
                           tk.SoLuong <= threshold * 0.2 ? "Cực thấp" :
                           tk.SoLuong <= threshold * 0.5 ? "Thấp" : "Bình thường"
            })
            .ToListAsync(ct);

        return ApiResponse.Success("Lấy danh sách vaccine có tồn kho thấp thành công", result);
    }

    /* ---------- 12. Lấy danh sách lô vaccine có thể xuất ---------- */
    [HttpGet("available-for-export")]
    public async Task<IActionResult> GetAvailableForExport(
        [FromQuery] string maDiaDiem,
        [FromQuery] string? maVaccine = null,
        CancellationToken ct = default)
    {
        var currentDate = DateTime.UtcNow;
        
        var query = _ctx.TonKhoLos
            .Include(tk => tk.MaDiaDiemNavigation)
            .Include(tk => tk.MaLoNavigation)
                .ThenInclude(l => l.MaVaccineNavigation)
            .Where(tk => tk.IsDelete == false && 
                        tk.MaDiaDiem == maDiaDiem &&
                        tk.SoLuong > 0 &&
                        (!tk.MaLoNavigation.NgayHetHan.HasValue || tk.MaLoNavigation.NgayHetHan > DateOnly.FromDateTime(currentDate)))
            // Step 1: Exclude TonKhoLo records where LoVaccine has been disposed of (thanh lý)
            .Where(tk => !tk.MaLoNavigation.ChiTietThanhLies.Any(ct => ct.IsDelete == false))
            // Step 2: Exclude TonKhoLo records where LoVaccine has pending or rejected phiếu nhập
            .Where(tk => !tk.MaLoNavigation.ChiTietNhaps.Any(chiTiet => chiTiet.IsDelete == false && 
                chiTiet.MaPhieuNhapNavigation != null && 
                (chiTiet.MaPhieuNhapNavigation.TrangThai == TrangThaiPhieuKho.Pending || 
                 chiTiet.MaPhieuNhapNavigation.TrangThai == TrangThaiPhieuKho.Rejected)))
            // Step 3: Only include TonKhoLo records where LoVaccine has at least one approved phiếu nhập
            .Where(tk => tk.MaLoNavigation.ChiTietNhaps.Any(chiTiet => chiTiet.IsDelete == false && 
                chiTiet.MaPhieuNhapNavigation != null && 
                chiTiet.MaPhieuNhapNavigation.TrangThai == TrangThaiPhieuKho.Approved));

        if (!string.IsNullOrEmpty(maVaccine))
        {
            query = query.Where(tk => tk.MaLoNavigation.MaVaccine == maVaccine);
        }

        var result = await query
            .OrderBy(tk => tk.MaLoNavigation != null && tk.MaLoNavigation.MaVaccineNavigation != null ? tk.MaLoNavigation.MaVaccineNavigation.Ten : "")
            .ThenBy(tk => tk.MaLoNavigation.NgayHetHan)
            .Select(tk => new
            {
                tk.MaTonKho,
                tk.MaDiaDiem,
                tk.MaLo,
                tk.SoLuong,
                TenDiaDiem = tk.MaDiaDiemNavigation != null ? tk.MaDiaDiemNavigation.Ten : "",
                SoLo = tk.MaLoNavigation.SoLo,
                TenVaccine = tk.MaLoNavigation != null && tk.MaLoNavigation.MaVaccineNavigation != null ? tk.MaLoNavigation.MaVaccineNavigation.Ten : "",
                NgayHetHan = tk.MaLoNavigation.NgayHetHan,
                NgaySanXuat = tk.MaLoNavigation.NgaySanXuat,
                GiaNhap = tk.MaLoNavigation.GiaNhap,
                SoNgayConLai = tk.MaLoNavigation.NgayHetHan.HasValue ? 
                    EF.Functions.DateDiffDay(currentDate, tk.MaLoNavigation.NgayHetHan.Value.ToDateTime(TimeOnly.MinValue)) : (int?)null
            })
            .ToListAsync(ct);

        return ApiResponse.Success("Lấy danh sách lô vaccine có thể xuất thành công", result);
    }

    /* ---------- 13. Thống kê tổng nhập/xuất/thanh lý/tồn theo thời gian ---------- */
    [HttpGet("statistics")]
    public async Task<IActionResult> GetStatistics(
        [FromQuery] DateTime? tuNgay = null,
        [FromQuery] DateTime? denNgay = null,
        [FromQuery] string? maDiaDiem = null,
        CancellationToken ct = default)
    {
        var startDate = tuNgay ?? DateTime.UtcNow.AddMonths(-1);
        var endDate = denNgay ?? DateTime.UtcNow;

        // Thống kê tồn kho hiện tại
        var tonKhoQuery = _ctx.TonKhoLos
            .Include(tk => tk.MaDiaDiemNavigation)
            .Include(tk => tk.MaLoNavigation)
                .ThenInclude(l => l.MaVaccineNavigation)
            .Where(tk => tk.IsDelete == false)
            // Step 1: Exclude TonKhoLo records where LoVaccine has been disposed of (thanh lý)
            .Where(tk => !tk.MaLoNavigation.ChiTietThanhLies.Any(ct => ct.IsDelete == false))
            // Step 2: Exclude TonKhoLo records where LoVaccine has pending or rejected phiếu nhập
            .Where(tk => !tk.MaLoNavigation.ChiTietNhaps.Any(chiTiet => chiTiet.IsDelete == false && 
                chiTiet.MaPhieuNhapNavigation != null && 
                (chiTiet.MaPhieuNhapNavigation.TrangThai == TrangThaiPhieuKho.Pending || 
                 chiTiet.MaPhieuNhapNavigation.TrangThai == TrangThaiPhieuKho.Rejected)))
            // Step 3: Only include TonKhoLo records where LoVaccine has at least one approved phiếu nhập
            .Where(tk => tk.MaLoNavigation.ChiTietNhaps.Any(chiTiet => chiTiet.IsDelete == false && 
                chiTiet.MaPhieuNhapNavigation != null && 
                chiTiet.MaPhieuNhapNavigation.TrangThai == TrangThaiPhieuKho.Approved));

        if (!string.IsNullOrEmpty(maDiaDiem))
        {
            tonKhoQuery = tonKhoQuery.Where(tk => tk.MaDiaDiem == maDiaDiem);
        }

        var tonKhoHienTai = await tonKhoQuery
            .GroupBy(tk => new { MaDiaDiem = tk.MaDiaDiem, Ten = tk.MaDiaDiemNavigation != null ? tk.MaDiaDiemNavigation.Ten : "" })
            .Select(g => new
            {
                MaDiaDiem = g.Key.MaDiaDiem,
                TenDiaDiem = g.Key.Ten,
                TongSoLo = g.Count(),
                TongSoLuong = g.Sum(tk => tk.SoLuong ?? 0),
                TongGiaTri = g.Sum(tk => (tk.SoLuong ?? 0) * (tk.MaLoNavigation.GiaNhap ?? 0))
            })
            .ToListAsync(ct);

        // Thống kê nhập kho
        var nhapKhoQuery = _ctx.ChiTietNhaps
            .Include(ct => ct.MaPhieuNhapNavigation)
            .Include(ct => ct.MaLoNavigation)
                .ThenInclude(l => l.MaVaccineNavigation)
            .Where(ct => ct.IsDelete == false && 
                        ct.MaPhieuNhapNavigation.NgayNhap >= startDate &&
                        ct.MaPhieuNhapNavigation.NgayNhap <= endDate);

        var nhapKho = await nhapKhoQuery
            .GroupBy(ct => ct.MaLoNavigation.MaVaccineNavigation.Ten)
            .Select(g => new
            {
                TenVaccine = g.Key,
                TongSoLuongNhap = g.Sum(ct => ct.SoLuong ?? 0),
                TongGiaTriNhap = g.Sum(ct => (ct.SoLuong ?? 0) * (ct.Gia ?? 0))
            })
            .ToListAsync(ct);

        // Thống kê xuất kho
        var xuatKhoQuery = _ctx.ChiTietXuats
            .Include(ct => ct.MaPhieuXuatNavigation)
            .Include(ct => ct.MaLoNavigation)
                .ThenInclude(l => l.MaVaccineNavigation)
            .Where(ct => ct.IsDelete == false && 
                        ct.MaPhieuXuatNavigation.NgayXuat >= startDate &&
                        ct.MaPhieuXuatNavigation.NgayXuat <= endDate);

        if (!string.IsNullOrEmpty(maDiaDiem))
        {
            xuatKhoQuery = xuatKhoQuery.Where(ct => ct.MaPhieuXuatNavigation.MaDiaDiemXuat == maDiaDiem);
        }

        var xuatKho = await xuatKhoQuery
            .GroupBy(ct => ct.MaLoNavigation.MaVaccineNavigation.Ten)
            .Select(g => new
            {
                TenVaccine = g.Key,
                TongSoLuongXuat = g.Sum(ct => ct.SoLuong ?? 0)
            })
            .ToListAsync(ct);

        // Thống kê thanh lý
        var thanhLyQuery = _ctx.ChiTietThanhLies
            .Include(ct => ct.MaPhieuThanhLyNavigation)
            .Include(ct => ct.MaLoNavigation)
                .ThenInclude(l => l.MaVaccineNavigation)
            .Where(ct => ct.IsDelete == false && 
                        ct.MaPhieuThanhLyNavigation.NgayThanhLy >= startDate &&
                        ct.MaPhieuThanhLyNavigation.NgayThanhLy <= endDate);

        if (!string.IsNullOrEmpty(maDiaDiem))
        {
            thanhLyQuery = thanhLyQuery.Where(ct => ct.MaPhieuThanhLyNavigation.MaDiaDiem == maDiaDiem);
        }

        var thanhLy = await thanhLyQuery
            .GroupBy(ct => ct.MaLoNavigation.MaVaccineNavigation.Ten)
            .Select(g => new
            {
                TenVaccine = g.Key,
                TongSoLuongThanhLy = g.Sum(ct => ct.SoLuong ?? 0)
            })
            .ToListAsync(ct);

        var result = new
        {
            ThoiGian = new { TuNgay = startDate, DenNgay = endDate },
            TonKhoHienTai = tonKhoHienTai,
            NhapKho = nhapKho,
            XuatKho = xuatKho,
            ThanhLy = thanhLy,
            TongKet = new
            {
                TongSoLuongNhap = nhapKho.Sum(n => n.TongSoLuongNhap),
                TongSoLuongXuat = xuatKho.Sum(x => x.TongSoLuongXuat),
                TongSoLuongThanhLy = thanhLy.Sum(t => t.TongSoLuongThanhLy),
                TongGiaTriNhap = nhapKho.Sum(n => n.TongGiaTriNhap)
            }
        };

        return ApiResponse.Success("Lấy thống kê tồn kho thành công", result);
    }
}   