using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.DTOs.PhieuTiem;
using server.Helpers;
using server.Models;
using server.Helpers;

namespace server.Controllers;

[ApiController]
[Route("api/phieu-tiem")]
public class PhieuTiemController : ControllerBase
{
    private readonly HeThongQuanLyTiemChungContext _ctx;
    private readonly ILogger<PhieuTiemController> _logger;

    public PhieuTiemController(HeThongQuanLyTiemChungContext ctx, ILogger<PhieuTiemController> logger)
    {
        _ctx = ctx;
        _logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 10, CancellationToken ct = default)
    {
        try
        {
            var query = _ctx.PhieuTiems
                .Include(p => p.MaBacSiNavigation)
                .Include(p => p.MaDichVuNavigation)
                .Include(p => p.MaNguoiDungNavigation)
                .Include(p => p.ChiTietPhieuTiems)
                .Where(p => p.IsDelete == false)
                .OrderByDescending(p => p.NgayTao);

            var result = await query.Select(p => new PhieuTiemDto
            {
                MaPhieuTiem = p.MaPhieuTiem,
                NgayTiem = p.NgayTiem,
                MaBacSi = p.MaBacSi,
                MaDichVu = p.MaDichVu,
                MaNguoiDung = p.MaNguoiDung,
                TrangThai = p.TrangThai,
                PhanUng = p.PhanUng,
                MoTaPhanUng = p.MoTaPhanUng,
                IsDelete = p.IsDelete,
                IsActive = p.IsActive,
                NgayTao = p.NgayTao,
                NgayCapNhat = p.NgayCapNhat,
                TenBacSi = p.MaBacSiNavigation != null && p.MaBacSiNavigation.MaNguoiDungNavigation != null ? p.MaBacSiNavigation.MaNguoiDungNavigation.Ten : null,
                TenDichVu = p.MaDichVuNavigation != null ? p.MaDichVuNavigation.Ten : null,
                TenNguoiDung = p.MaNguoiDungNavigation != null ? p.MaNguoiDungNavigation.Ten : null,
                ChiTietPhieuTiems = p.ChiTietPhieuTiems.Select(c => new ChiTietPhieuTiemDto
                {
                    MaChiTietPhieuTiem = c.MaChiTietPhieuTiem,
                    MaPhieuTiem = c.MaPhieuTiem,
                    MaVaccine = c.MaVaccine,
                    MuiTiemThucTe = c.MuiTiemThucTe,
                    ThuTu = c.ThuTu,
                    IsDelete = c.IsDelete,
                    IsActive = c.IsActive,
                    NgayTao = c.NgayTao,
                    NgayCapNhat = c.NgayCapNhat,
                    TenVaccine = c.MaVaccineNavigation != null ? c.MaVaccineNavigation.Ten : null,
                    NhaSanXuat = c.MaVaccineNavigation != null ? c.MaVaccineNavigation.NhaSanXuat : null
                }).ToList()
            }).ToPagedAsync(page, pageSize, ct);

            return ApiResponse.Success("Lấy danh sách phiếu tiêm thành công", result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi lấy danh sách phiếu tiêm");
            return ApiResponse.Error("Có lỗi xảy ra khi lấy danh sách phiếu tiêm", 500);
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id, CancellationToken ct = default)
    {
        try
        {
            var phieuTiem = await _ctx.PhieuTiems
                .Include(p => p.MaBacSiNavigation)
                .Include(p => p.MaDichVuNavigation)
                .Include(p => p.MaNguoiDungNavigation)
                .Include(p => p.ChiTietPhieuTiems)
                .FirstOrDefaultAsync(p => p.MaPhieuTiem == id && p.IsDelete == false, ct);

            if (phieuTiem == null)
                return ApiResponse.Error("Không tìm thấy phiếu tiêm", 404);

            var dto = new PhieuTiemDto
            {
                MaPhieuTiem = phieuTiem.MaPhieuTiem,
                NgayTiem = phieuTiem.NgayTiem,
                MaBacSi = phieuTiem.MaBacSi,
                MaDichVu = phieuTiem.MaDichVu,
                MaNguoiDung = phieuTiem.MaNguoiDung,
                TrangThai = phieuTiem.TrangThai,
                PhanUng = phieuTiem.PhanUng,
                MoTaPhanUng = phieuTiem.MoTaPhanUng,
                IsDelete = phieuTiem.IsDelete,
                IsActive = phieuTiem.IsActive,
                NgayTao = phieuTiem.NgayTao,
                NgayCapNhat = phieuTiem.NgayCapNhat,
                TenBacSi = phieuTiem.MaBacSiNavigation != null && phieuTiem.MaBacSiNavigation.MaNguoiDungNavigation != null ? phieuTiem.MaBacSiNavigation.MaNguoiDungNavigation.Ten : null,
                TenDichVu = phieuTiem.MaDichVuNavigation != null ? phieuTiem.MaDichVuNavigation.Ten : null,
                TenNguoiDung = phieuTiem.MaNguoiDungNavigation != null ? phieuTiem.MaNguoiDungNavigation.Ten : null,
                ChiTietPhieuTiems = phieuTiem.ChiTietPhieuTiems.Select(c => new ChiTietPhieuTiemDto
                {
                    MaChiTietPhieuTiem = c.MaChiTietPhieuTiem,
                    MaPhieuTiem = c.MaPhieuTiem,
                    MaVaccine = c.MaVaccine,
                    MuiTiemThucTe = c.MuiTiemThucTe,
                    ThuTu = c.ThuTu,
                    IsDelete = c.IsDelete,
                    IsActive = c.IsActive,
                    NgayTao = c.NgayTao,
                    NgayCapNhat = c.NgayCapNhat,
                    TenVaccine = c.MaVaccineNavigation != null ? c.MaVaccineNavigation.Ten : null,
                    NhaSanXuat = c.MaVaccineNavigation != null ? c.MaVaccineNavigation.NhaSanXuat : null
                }).ToList()
            };

            return ApiResponse.Success("Lấy thông tin phiếu tiêm thành công", dto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi lấy thông tin phiếu tiêm {Id}", id);
            return ApiResponse.Error("Có lỗi xảy ra khi lấy thông tin phiếu tiêm", 500);
        }
    }

    [HttpGet("by-user/{maNguoiDung}")]
    public async Task<IActionResult> GetByUser(string maNguoiDung, [FromQuery] int page = 1, [FromQuery] int pageSize = 10, CancellationToken ct = default)
    {
        try
        {
            var query = _ctx.PhieuTiems
                .Include(p => p.MaBacSiNavigation)
                .Include(p => p.MaDichVuNavigation)
                .Include(p => p.MaNguoiDungNavigation)
                .Include(p => p.ChiTietPhieuTiems)
                .Where(p => p.MaNguoiDung == maNguoiDung && p.IsDelete == false)
                .OrderByDescending(p => p.NgayTao);

            var result = await query.Select(p => new PhieuTiemDto
            {
                MaPhieuTiem = p.MaPhieuTiem,
                NgayTiem = p.NgayTiem,
                MaBacSi = p.MaBacSi,
                MaDichVu = p.MaDichVu,
                MaNguoiDung = p.MaNguoiDung,
                TrangThai = p.TrangThai,
                PhanUng = p.PhanUng,
                MoTaPhanUng = p.MoTaPhanUng,
                IsDelete = p.IsDelete,
                IsActive = p.IsActive,
                NgayTao = p.NgayTao,
                NgayCapNhat = p.NgayCapNhat,
                TenBacSi = p.MaBacSiNavigation != null && p.MaBacSiNavigation.MaNguoiDungNavigation != null ? p.MaBacSiNavigation.MaNguoiDungNavigation.Ten : null,
                TenDichVu = p.MaDichVuNavigation != null ? p.MaDichVuNavigation.Ten : null,
                TenNguoiDung = p.MaNguoiDungNavigation != null ? p.MaNguoiDungNavigation.Ten : null,
                ChiTietPhieuTiems = p.ChiTietPhieuTiems.Select(c => new ChiTietPhieuTiemDto
                {
                    MaChiTietPhieuTiem = c.MaChiTietPhieuTiem,
                    MaPhieuTiem = c.MaPhieuTiem,
                    MaVaccine = c.MaVaccine,
                    MuiTiemThucTe = c.MuiTiemThucTe,
                    ThuTu = c.ThuTu,
                    IsDelete = c.IsDelete,
                    IsActive = c.IsActive,
                    NgayTao = c.NgayTao,
                    NgayCapNhat = c.NgayCapNhat,
                    TenVaccine = c.MaVaccineNavigation != null ? c.MaVaccineNavigation.Ten : null,
                    NhaSanXuat = c.MaVaccineNavigation != null ? c.MaVaccineNavigation.NhaSanXuat : null
                }).ToList()
            }).ToPagedAsync(page, pageSize, ct);

            return ApiResponse.Success("Lấy danh sách phiếu tiêm của người dùng thành công", result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi lấy danh sách phiếu tiêm của người dùng {MaNguoiDung}", maNguoiDung);
            return ApiResponse.Error("Có lỗi xảy ra khi lấy danh sách phiếu tiêm của người dùng", 500);
        }
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] PhieuTiemCreateDto dto, CancellationToken ct = default)
    {
        try
        {
            var phieuTiem = new PhieuTiem
            {
                MaPhieuTiem = Guid.NewGuid().ToString(),
                NgayTiem = dto.NgayTiem,
                MaBacSi = dto.MaBacSi,
                MaDichVu = dto.MaDichVu,
                MaNguoiDung = dto.MaNguoiDung,
                TrangThai = dto.TrangThai,
                PhanUng = dto.PhanUng,
                MoTaPhanUng = dto.MoTaPhanUng,
                IsActive = true,
                IsDelete = false,
                NgayTao = DateTime.UtcNow,
                NgayCapNhat = DateTime.UtcNow
            };

            _ctx.PhieuTiems.Add(phieuTiem);
            await _ctx.SaveChangesAsync(ct);

            // Tạo chi tiết phiếu tiêm
            foreach (var chiTietDto in dto.ChiTietPhieuTiems)
            {
                var chiTiet = new ChiTietPhieuTiem
                {
                    MaChiTietPhieuTiem = Guid.NewGuid().ToString(),
                    MaPhieuTiem = phieuTiem.MaPhieuTiem,
                    MaVaccine = chiTietDto.MaVaccine,
                    MuiTiemThucTe = chiTietDto.MuiTiemThucTe,
                    ThuTu = chiTietDto.ThuTu,
                    IsActive = true,
                    IsDelete = false,
                    NgayTao = DateTime.UtcNow,
                    NgayCapNhat = DateTime.UtcNow
                };
                _ctx.ChiTietPhieuTiems.Add(chiTiet);
            }

            await _ctx.SaveChangesAsync(ct);

            return ApiResponse.Success("Tạo phiếu tiêm thành công", phieuTiem.MaPhieuTiem);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi tạo phiếu tiêm");
            return ApiResponse.Error("Có lỗi xảy ra khi tạo phiếu tiêm", 500);
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] PhieuTiemUpdateDto dto, CancellationToken ct = default)
    {
        try
        {
            var phieuTiem = await _ctx.PhieuTiems
                .FirstOrDefaultAsync(p => p.MaPhieuTiem == id && p.IsDelete == false, ct);

            if (phieuTiem == null)
                return ApiResponse.Error("Không tìm thấy phiếu tiêm", 404);

            phieuTiem.NgayTiem = dto.NgayTiem;
            phieuTiem.MaBacSi = dto.MaBacSi;
            phieuTiem.MaDichVu = dto.MaDichVu;
            phieuTiem.PhanUng = dto.PhanUng;
            phieuTiem.MoTaPhanUng = dto.MoTaPhanUng;
            phieuTiem.IsActive = dto.IsActive;
            phieuTiem.NgayCapNhat = DateTime.UtcNow;

            await _ctx.SaveChangesAsync(ct);

            return ApiResponse.Success("Cập nhật phiếu tiêm thành công", null);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi cập nhật phiếu tiêm {Id}", id);
            return ApiResponse.Error("Có lỗi xảy ra khi cập nhật phiếu tiêm", 500);
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id, CancellationToken ct = default)
    {
        try
        {
            var phieuTiem = await _ctx.PhieuTiems
                .FirstOrDefaultAsync(p => p.MaPhieuTiem == id && p.IsDelete == false, ct);

            if (phieuTiem == null)
                return ApiResponse.Error("Không tìm thấy phiếu tiêm", 404);

            phieuTiem.IsDelete = true;
            phieuTiem.NgayCapNhat = DateTime.UtcNow;

            await _ctx.SaveChangesAsync(ct);

            return ApiResponse.Success("Xóa phiếu tiêm thành công", null);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi xóa phiếu tiêm {Id}", id);
            return ApiResponse.Error("Có lỗi xảy ra khi xóa phiếu tiêm", 500);
        }
    }
} 