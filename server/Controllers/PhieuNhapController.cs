using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.DTOs.Kho;
using server.DTOs.Pagination;
using server.Helpers;
using server.Models;
using server.Types;

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
            .Include(p => p.ChiTietNhaps)
                .ThenInclude(ct => ct.MaLoNavigation)
                    .ThenInclude(l => l.TonKhoLos)
                        .ThenInclude(tk => tk.MaDiaDiemNavigation)
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
            .OrderByDescending(p => p.NgayNhap)
            .Select(p => new PhieuNhapDto(
                p.MaPhieuNhap,
                p.MaNhaCungCap,
                p.MaQuanLy,
                p.NgayNhap,
                p.TongTien,
                p.TrangThai,
                p.NgayCapNhat,
                p.MaNhaCungCapNavigation.Ten,
                p.MaQuanLyNavigation.MaNguoiDungNavigation.Ten,
                p.ChiTietNhaps.FirstOrDefault().MaLoNavigation.TonKhoLos.FirstOrDefault().MaDiaDiemNavigation.Ten
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
            .Include(p => p.MaQuanLyNavigation.MaNguoiDungNavigation)
            .Include(p => p.ChiTietNhaps)
                .ThenInclude(ct => ct.MaLoNavigation)
                    .ThenInclude(l => l.MaVaccineNavigation)
            .Include(p => p.ChiTietNhaps)
                .ThenInclude(ct => ct.MaLoNavigation)
                    .ThenInclude(l => l.MaNhaCungCapNavigation)
            .Include(p => p.ChiTietNhaps)
                .ThenInclude(ct => ct.MaLoNavigation)
                    .ThenInclude(l => l.TonKhoLos)
                        .ThenInclude(tk => tk.MaDiaDiemNavigation)
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
            phieuNhap.NgayCapNhat,
            phieuNhap.MaNhaCungCapNavigation?.Ten,
            phieuNhap.MaQuanLyNavigation.MaNguoiDungNavigation.Ten,
            phieuNhap.ChiTietNhaps.FirstOrDefault()?.MaLoNavigation?.TonKhoLos?.FirstOrDefault()?.MaDiaDiemNavigation?.Ten,
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

        // Kiểm tra địa điểm tồn tại
        if (!string.IsNullOrEmpty(dto.MaDiaDiem))
        {
            if (!await _ctx.DiaDiems.AnyAsync(dd => dd.MaDiaDiem == dto.MaDiaDiem && dd.IsDelete == false, ct))
                return ApiResponse.Error("Địa điểm không tồn tại", 404);
        }

        // Kiểm tra và tạo quản lý nếu chưa tồn tại
        string? maQuanLyFinal = null;
        if (!string.IsNullOrEmpty(dto.MaQuanLy))
        {
            // Kiểm tra xem đã có quản lý nào cho người dùng này chưa
            var quanLy = await _ctx.QuanLies
                .FirstOrDefaultAsync(q => q.MaNguoiDung == dto.MaQuanLy && q.IsDelete == false, ct);
            
            if (quanLy == null)
            {
                // Kiểm tra người dùng có tồn tại không
                var nguoiDung = await _ctx.NguoiDungs
                    .FirstOrDefaultAsync(nd => nd.MaNguoiDung == dto.MaQuanLy && nd.IsDelete == false, ct);
                
                if (nguoiDung == null)
                    return ApiResponse.Error("Người dùng không tồn tại", 404);
                
                // Tạo quản lý mới với mã quản lý mới
                var maQuanLyMoi = Guid.NewGuid().ToString("N");
                quanLy = new QuanLy
                {
                    MaQuanLy = maQuanLyMoi,
                    MaNguoiDung = dto.MaQuanLy, // MaNguoiDung từ DTO
                    IsActive = true,
                    IsDelete = false,
                    NgayTao = DateTime.UtcNow
                };
                
                _ctx.QuanLies.Add(quanLy);
                maQuanLyFinal = maQuanLyMoi;
            }
            else
            {
                maQuanLyFinal = quanLy.MaQuanLy;
            }
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
            MaQuanLy = maQuanLyFinal, // Sử dụng mã quản lý đã tạo hoặc tìm thấy
            NgayNhap = dto.NgayNhap ?? DateTime.UtcNow,
            TrangThai = TrangThaiPhieuKho.Pending,
            IsActive = true,
            IsDelete = false,
            NgayTao = DateTime.UtcNow
        };

        // Lưu maDiaDiem vào một trường tạm thời (có thể lưu vào description hoặc tạo bảng riêng)
        // Ở đây tôi sẽ tạo TonKhoLo ngay khi tạo phiếu nhập
        if (!string.IsNullOrEmpty(dto.MaDiaDiem))
        {
            // Tạo hoặc cập nhật tồn kho cho từng lô vaccine
            foreach (var chiTietDto in dto.ChiTietNhaps)
            {
                // Tìm tồn kho hiện tại của lô vaccine tại địa điểm
                var tonKho = await _ctx.TonKhoLos
                    .FirstOrDefaultAsync(tk => tk.MaLo == chiTietDto.MaLo && 
                                              tk.MaDiaDiem == dto.MaDiaDiem && 
                                              tk.IsDelete == false, ct);

                if (tonKho == null)
                {
                    // Tạo mới tồn kho nếu chưa có
                    tonKho = new TonKhoLo
                    {
                        MaTonKho = Guid.NewGuid().ToString("N"),
                        MaLo = chiTietDto.MaLo,
                        MaDiaDiem = dto.MaDiaDiem,
                        SoLuong = chiTietDto.SoLuong,
                        IsActive = true,
                        IsDelete = false,
                        NgayTao = DateTime.UtcNow,
                        NgayCapNhat = DateTime.UtcNow
                    };
                    _ctx.TonKhoLos.Add(tonKho);
                }
                else
                {
                    // Cập nhật số lượng tồn kho
                    tonKho.SoLuong = (tonKho.SoLuong ?? 0) + chiTietDto.SoLuong;
                    tonKho.NgayCapNhat = DateTime.UtcNow;
                }
            }
        }

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

            // Không cần cập nhật soLuongHienTai vì đã được set đúng khi tạo LoVaccine
            // Chỉ cập nhật ngày cập nhật
            var loVaccine = await _ctx.LoVaccines.FindAsync(chiTietDto.MaLo);
            if (loVaccine != null)
            {
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

        // Kiểm tra và tạo quản lý nếu chưa tồn tại
        if (!string.IsNullOrEmpty(dto.MaQuanLy))
        {
            // Kiểm tra xem đã có quản lý nào cho người dùng này chưa
            var quanLy = await _ctx.QuanLies
                .FirstOrDefaultAsync(q => q.MaNguoiDung == dto.MaQuanLy && q.IsDelete == false, ct);
            
            if (quanLy == null)
            {
                // Kiểm tra người dùng có tồn tại không
                var nguoiDung = await _ctx.NguoiDungs
                    .FirstOrDefaultAsync(nd => nd.MaNguoiDung == dto.MaQuanLy && nd.IsDelete == false, ct);
                
                if (nguoiDung == null)
                    return ApiResponse.Error("Người dùng không tồn tại", 404);
                
                // Tạo quản lý mới với mã quản lý mới
                var maQuanLyMoi = Guid.NewGuid().ToString("N");
                quanLy = new QuanLy
                {
                    MaQuanLy = maQuanLyMoi,
                    MaNguoiDung = dto.MaQuanLy, // MaNguoiDung từ DTO
                    IsActive = true,
                    IsDelete = false,
                    NgayTao = DateTime.UtcNow
                };
                
                _ctx.QuanLies.Add(quanLy);
                phieuNhap.MaQuanLy = maQuanLyMoi;
            }
            else
            {
                phieuNhap.MaQuanLy = quanLy.MaQuanLy;
            }
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

        if (phieuNhap.TrangThai == TrangThaiPhieuKho.Approved)
            return ApiResponse.Error("Phiếu nhập đã được xác nhận", 400);

        // Cập nhật trạng thái phiếu nhập
        phieuNhap.TrangThai = TrangThaiPhieuKho.Approved;
        phieuNhap.NgayCapNhat = DateTime.UtcNow;

        // TonKhoLo đã được tạo khi tạo phiếu nhập, không cần tạo lại

        await _ctx.SaveChangesAsync(ct);
        return ApiResponse.Success("Xác nhận phiếu nhập thành công");
    }

    /* ---------- 7. Từ chối phiếu nhập ---------- */
    [HttpPost("{id}/reject")]
    public async Task<IActionResult> Reject(string id, [FromBody] RejectDto dto, CancellationToken ct = default)
    {
        var phieuNhap = await _ctx.PhieuNhaps
            .FirstOrDefaultAsync(p => p.MaPhieuNhap == id && p.IsDelete == false, ct);

        if (phieuNhap == null)
            return ApiResponse.Error("Không tìm thấy phiếu nhập", 404);

        if (phieuNhap.TrangThai == TrangThaiPhieuKho.Rejected)
            return ApiResponse.Error("Phiếu nhập đã được từ chối", 400);

        phieuNhap.TrangThai = TrangThaiPhieuKho.Rejected;
        phieuNhap.NgayCapNhat = DateTime.UtcNow;

        await _ctx.SaveChangesAsync(ct);
        return ApiResponse.Success("Từ chối phiếu nhập thành công", null);
    }

    /* ---------- 8. Lấy danh sách phiếu chờ duyệt ---------- */
    [HttpGet("pending")]
    public async Task<IActionResult> GetPending(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        CancellationToken ct = default)
    {
        var query = _ctx.PhieuNhaps
            .Include(p => p.MaNhaCungCapNavigation)
            .Include(p => p.MaQuanLyNavigation)
            .Include(p => p.ChiTietNhaps)
                .ThenInclude(ct => ct.MaLoNavigation)
                    .ThenInclude(l => l.TonKhoLos)
                        .ThenInclude(tk => tk.MaDiaDiemNavigation)
            .Where(p => p.IsDelete == false && p.TrangThai == TrangThaiPhieuKho.Pending);

        var result = await query
            .OrderByDescending(p => p.NgayNhap)
            .Select(p => new PhieuNhapDto(
                p.MaPhieuNhap,
                p.MaNhaCungCap,
                p.MaQuanLy,
                p.NgayNhap,
                p.TongTien,
                p.TrangThai,
                p.NgayCapNhat,
                p.MaNhaCungCapNavigation.Ten,
                p.MaQuanLyNavigation.MaNguoiDungNavigation.Ten,
                p.ChiTietNhaps.FirstOrDefault().MaLoNavigation.TonKhoLos.FirstOrDefault().MaDiaDiemNavigation.Ten
            ))
            .ToPagedAsync(page, pageSize, ct);

        return ApiResponse.Success("Lấy danh sách phiếu nhập chờ duyệt thành công", result);
    }
} 