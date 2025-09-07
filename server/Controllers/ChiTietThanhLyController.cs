using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.DTOs.Kho;
using server.DTOs.Pagination;
using server.Helpers;
using server.Models;
using server.Types;

namespace server.Controllers;

[ApiController]
[Route("api/chi-tiet-thanh-ly")]
public class ChiTietThanhLyController : ControllerBase
{
    private readonly HeThongQuanLyTiemChungContext _ctx;

    public ChiTietThanhLyController(HeThongQuanLyTiemChungContext ctx) => _ctx = ctx;

    /* ---------- 1. Lấy danh sách chi tiết thanh lý (có phân trang) ---------- */
    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? search = null,
        [FromQuery] string? maPhieuThanhLy = null,
        [FromQuery] string? maLo = null,
        CancellationToken ct = default)
    {
        var query = _ctx.ChiTietThanhLies
            .Include(c => c.MaPhieuThanhLyNavigation)
            .Include(c => c.MaLoNavigation)
                .ThenInclude(l => l.MaVaccineNavigation)
            .Where(c => c.IsDelete == false && c.MaLoNavigation != null);

        // Tìm kiếm theo từ khóa
        if (!string.IsNullOrEmpty(search))
        {
            query = query.Where(c =>
                c.MaChiTiet.Contains(search) ||
                (c.MaLoNavigation != null && c.MaLoNavigation.SoLo != null && c.MaLoNavigation.SoLo.Contains(search)) ||
                (c.MaLoNavigation != null && c.MaLoNavigation.MaVaccineNavigation != null && c.MaLoNavigation.MaVaccineNavigation.Ten != null && c.MaLoNavigation.MaVaccineNavigation.Ten.Contains(search)) ||
                (c.LyDo != null && c.LyDo.Contains(search)));
        }

        // Lọc theo phiếu thanh lý
        if (!string.IsNullOrEmpty(maPhieuThanhLy))
        {
            query = query.Where(c => c.MaPhieuThanhLy == maPhieuThanhLy);
        }

        // Lọc theo lô
        if (!string.IsNullOrEmpty(maLo))
        {
            query = query.Where(c => c.MaLo == maLo);
        }

        var result = await query.ToPagedAsync(page, pageSize, ct);

        var chiTietThanhLies = result.Data.Select(c => new ChiTietThanhLyDto(
            c.MaChiTiet,
            c.MaPhieuThanhLy ?? "",
            c.MaLo ?? "",
            c.SoLuong,
            c.LyDo,
            c.MaLoNavigation?.SoLo,
            c.MaLoNavigation?.MaVaccineNavigation?.Ten,
            c.IsDelete,
            c.IsActive,
            c.NgayTao,
            c.NgayCapNhat,
            c.MaLoNavigation?.NgayHetHan
        )).ToList();

        return ApiResponse.Success("Lấy danh sách chi tiết thanh lý thành công", new PagedResultDto<ChiTietThanhLyDto>(
            result.TotalCount,
            result.Page,
            result.PageSize,
            result.TotalPages,
            chiTietThanhLies
        ));
    }

    /* ---------- 2. Lấy chi tiết thanh lý theo ID ---------- */
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id, CancellationToken ct = default)
    {
        var chiTietThanhLy = await _ctx.ChiTietThanhLies
            .Include(c => c.MaPhieuThanhLyNavigation)
            .Include(c => c.MaLoNavigation)
                .ThenInclude(l => l.MaVaccineNavigation)
            .Where(c => c.MaChiTiet == id && c.IsDelete == false && c.MaLoNavigation != null)
            .FirstOrDefaultAsync(ct);

        if (chiTietThanhLy == null)
        {
            return ApiResponse.Error("Không tìm thấy chi tiết thanh lý", 404);
        }

        var chiTietThanhLyDto = new ChiTietThanhLyDto(
            chiTietThanhLy.MaChiTiet,
            chiTietThanhLy.MaPhieuThanhLy ?? "",
            chiTietThanhLy.MaLo ?? "",
            chiTietThanhLy.SoLuong,
            chiTietThanhLy.LyDo,
            chiTietThanhLy.MaLoNavigation?.SoLo,
            chiTietThanhLy.MaLoNavigation?.MaVaccineNavigation?.Ten,
            chiTietThanhLy.IsDelete,
            chiTietThanhLy.IsActive,
            chiTietThanhLy.NgayTao,
            chiTietThanhLy.NgayCapNhat,
            chiTietThanhLy.MaLoNavigation?.NgayHetHan
        );

        return ApiResponse.Success("Lấy chi tiết thanh lý thành công", chiTietThanhLyDto);
    }

    /* ---------- 3. Tạo chi tiết thanh lý mới ---------- */
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] ChiTietThanhLyCreateDto dto, CancellationToken ct = default)
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
            return ApiResponse.Error("Số lượng thanh lý vượt quá tồn kho", 400);
        }

        var chiTietThanhLy = new ChiTietThanhLy
        {
            MaChiTiet = Guid.NewGuid().ToString(),
            MaLo = dto.MaLo,
            SoLuong = dto.SoLuong,
            LyDo = dto.LyDo,
            IsDelete = false,
            IsActive = true,
            NgayTao = DateTime.Now,
            NgayCapNhat = DateTime.Now
        };

        _ctx.ChiTietThanhLies.Add(chiTietThanhLy);
        await _ctx.SaveChangesAsync(ct);

        return ApiResponse.Success("Tạo chi tiết thanh lý thành công", new { maChiTiet = chiTietThanhLy.MaChiTiet });
    }

    /* ---------- 4. Cập nhật chi tiết thanh lý ---------- */
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] ChiTietThanhLyCreateDto dto, CancellationToken ct = default)
    {
        var chiTietThanhLy = await _ctx.ChiTietThanhLies
            .Where(c => c.MaChiTiet == id && c.IsDelete == false)
            .FirstOrDefaultAsync(ct);

        if (chiTietThanhLy == null)
        {
            return ApiResponse.Error("Không tìm thấy chi tiết thanh lý", 404);
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

        var soLuongHienTai = chiTietThanhLy.SoLuong ?? 0;
        var tonKhoKhaDung = tonKho + soLuongHienTai;

        if (tonKhoKhaDung < dto.SoLuong)
        {
            return ApiResponse.Error("Số lượng thanh lý vượt quá tồn kho", 400);
        }

        chiTietThanhLy.MaLo = dto.MaLo;
        chiTietThanhLy.SoLuong = dto.SoLuong;
        chiTietThanhLy.LyDo = dto.LyDo;
        chiTietThanhLy.NgayCapNhat = DateTime.Now;

        await _ctx.SaveChangesAsync(ct);

        return ApiResponse.Success("Cập nhật chi tiết thanh lý thành công");
    }

    /* ---------- 5. Xóa chi tiết thanh lý (soft delete) ---------- */
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id, CancellationToken ct = default)
    {
        var chiTietThanhLy = await _ctx.ChiTietThanhLies
            .Where(c => c.MaChiTiet == id && c.IsDelete == false)
            .FirstOrDefaultAsync(ct);

        if (chiTietThanhLy == null)
        {
            return ApiResponse.Error("Không tìm thấy chi tiết thanh lý", 404);
        }

        chiTietThanhLy.IsDelete = true;
        chiTietThanhLy.NgayCapNhat = DateTime.Now;

        await _ctx.SaveChangesAsync(ct);

        return ApiResponse.Success("Xóa chi tiết thanh lý thành công");
    }

    /* ---------- 6. Lấy chi tiết thanh lý theo phiếu thanh lý ---------- */
    [HttpGet("phieu-thanh-ly/{maPhieuThanhLy}")]
    public async Task<IActionResult> GetByPhieuThanhLy(string maPhieuThanhLy, CancellationToken ct = default)
    {
        var chiTietThanhLies = await _ctx.ChiTietThanhLies
            .Include(c => c.MaLoNavigation)
                .ThenInclude(l => l.MaVaccineNavigation)
            .Where(c => c.MaPhieuThanhLy == maPhieuThanhLy && c.IsDelete == false && c.MaLoNavigation != null)
            .ToListAsync(ct);

        var chiTietThanhLyDtos = chiTietThanhLies.Select(c => new ChiTietThanhLyDto(
            c.MaChiTiet,
            c.MaPhieuThanhLy ?? "",
            c.MaLo ?? "",
            c.SoLuong,
            c.LyDo,
            c.MaLoNavigation?.SoLo,
            c.MaLoNavigation?.MaVaccineNavigation?.Ten,
            c.IsDelete,
            c.IsActive,
            c.NgayTao,
            c.NgayCapNhat,
            c.MaLoNavigation?.NgayHetHan
        )).ToList();

        return ApiResponse.Success("Lấy chi tiết thanh lý theo phiếu thanh lý thành công", chiTietThanhLyDtos);
    }

    /* ---------- 7. Lấy danh sách vaccine sắp hết hạn ---------- */
    [HttpGet("vaccine-sap-het-han")]
    public async Task<IActionResult> GetVaccinesExpiringSoon(
        [FromQuery] int days = 30,
        [FromQuery] string? maDiaDiem = null,
        CancellationToken ct = default)
    {
        var ngayHetHan = DateOnly.FromDateTime(DateTime.Now.AddDays(days));

        // Áp dụng điều kiện lọc 3 bước như LoVaccineController và TonKhoLoController
        var query = _ctx.TonKhoLos
            .Include(tk => tk.MaLoNavigation)
                .ThenInclude(l => l.MaVaccineNavigation)
            .Include(tk => tk.MaDiaDiemNavigation)
            .Include(tk => tk.MaLoNavigation)
                .ThenInclude(l => l.ChiTietNhaps)
                    .ThenInclude(cn => cn.MaPhieuNhapNavigation)
            .Where(tk => tk.IsDelete == false &&
                        tk.MaLoNavigation != null &&
                        tk.MaLoNavigation.NgayHetHan != null &&
                        tk.MaLoNavigation.NgayHetHan <= ngayHetHan &&
                        tk.SoLuong > 0);

        // Bước 1: Không loại bỏ ở đây, sẽ tính toán số lượng còn lại ở cuối

        // Bước 2: CHỈ lấy các lô thuộc phiếu nhập APPROVED và KHÔNG thuộc phiếu nào khác
        query = query.Where(tk =>
            tk.MaLoNavigation != null &&
            tk.MaLoNavigation.ChiTietNhaps.Any(cn =>
                // Phải có ít nhất 1 chi tiết nhập chưa xóa thuộc phiếu Approved
                cn.IsDelete == false &&
                cn.MaPhieuNhapNavigation != null &&
                cn.MaPhieuNhapNavigation.TrangThai == TrangThaiPhieuKho.Approved
            ) &&
            // KHÔNG có bất kỳ chi tiết nhập nào (kể cả đã xóa) thuộc phiếu Pending hoặc Rejected
            !tk.MaLoNavigation.ChiTietNhaps.Any(cn =>
                cn.MaPhieuNhapNavigation != null &&
                (cn.MaPhieuNhapNavigation.TrangThai == TrangThaiPhieuKho.Pending ||
                 cn.MaPhieuNhapNavigation.TrangThai == TrangThaiPhieuKho.Rejected)
            )
        );

        if (!string.IsNullOrEmpty(maDiaDiem))
        {
            query = query.Where(tk => tk.MaDiaDiem == maDiaDiem);
        }

        var vaccines = await query.ToListAsync(ct);

        var result = vaccines.Select(tk => {
            // Tính số lượng còn lại sau khi trừ đi các phiếu thanh lý đã được APPROVED
            var soLuongDaThanhLy = _ctx.ChiTietThanhLies
                .Where(ctl => ctl.MaLo == tk.MaLo && 
                             ctl.IsDelete == false &&
                             ctl.MaPhieuThanhLyNavigation != null &&
                             ctl.MaPhieuThanhLyNavigation.TrangThai == TrangThaiPhieuKho.Approved)
                .Sum(ctl => ctl.SoLuong ?? 0);
            
            var soLuongConLai = (tk.SoLuong ?? 0) - soLuongDaThanhLy;
            
            return new
            {
                MaTonKho = tk.MaTonKho,
                MaLo = tk.MaLo,
                SoLo = tk.MaLoNavigation?.SoLo ?? "",
                TenVaccine = tk.MaLoNavigation?.MaVaccineNavigation?.Ten ?? "",
                NgayHetHan = tk.MaLoNavigation?.NgayHetHan,
                SoLuong = soLuongConLai, // Số lượng còn lại sau khi trừ đi các phiếu thanh lý đã approved
                TenDiaDiem = tk.MaDiaDiemNavigation?.Ten ?? "",
                SoNgayConLai = tk.MaLoNavigation?.NgayHetHan?.ToDateTime(TimeOnly.MinValue) != null ?
                    (tk.MaLoNavigation.NgayHetHan.Value.ToDateTime(TimeOnly.MinValue) - DateTime.Now).Days : 0
            };
        }).Where(item => item.SoLuong > 0).ToList(); // Chỉ hiển thị những lô còn số lượng > 0 (kể cả đã có phiếu thanh lý approved)

        return ApiResponse.Success("Lấy danh sách vaccine sắp hết hạn thành công", result);
    }
}