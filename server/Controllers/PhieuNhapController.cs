using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.DTOs.PhieuNhap;
using server.Helpers;
using server.Models;

namespace server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PhieuNhapController : ControllerBase
{
    private readonly HeThongQuanLyTiemChungContext _context;

    public PhieuNhapController(HeThongQuanLyTiemChungContext context)
    {
        _context = context;
    }

    // GET: api/PhieuNhap
    [HttpGet]
    public async Task<IActionResult> GetPhieuNhaps(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? trangThai = null,
        [FromQuery] string? maNhaCungCap = null,
        [FromQuery] DateTime? ngayNhapFrom = null,
        [FromQuery] DateTime? ngayNhapTo = null)
    {
        try
        {
            var query = _context.PhieuNhaps
                .Include(p => p.MaNhaCungCapNavigation)
                .Include(p => p.ChiTietNhaps)
                .ThenInclude(ct => ct.MaLoNavigation)
                .ThenInclude(l => l.MaVaccineNavigation)
                .Where(p => !p.IsDelete.HasValue || !p.IsDelete.Value)
                .AsQueryable();

            // Apply filters
            if (!string.IsNullOrEmpty(trangThai))
                query = query.Where(p => p.TrangThai == trangThai);

            if (!string.IsNullOrEmpty(maNhaCungCap))
                query = query.Where(p => p.MaNhaCungCap == maNhaCungCap);

            if (ngayNhapFrom.HasValue)
                query = query.Where(p => p.NgayNhap >= ngayNhapFrom.Value);

            if (ngayNhapTo.HasValue)
                query = query.Where(p => p.NgayNhap <= ngayNhapTo.Value);

            // Get total count
            var totalCount = await query.CountAsync();

            // Apply pagination
            var phieuNhaps = await query
                .OrderByDescending(p => p.NgayTao)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            // Map to DTOs
            var phieuNhapDtos = phieuNhaps.Select(p => new PhieuNhapResponseDto
            {
                MaPhieuNhap = p.MaPhieuNhap,
                MaNhaCungCap = p.MaNhaCungCap,
                TenNhaCungCap = p.MaNhaCungCapNavigation?.Ten,
                NgayNhap = p.NgayNhap,
                TongTien = p.TongTien,
                TrangThai = p.TrangThai,
                IsActive = p.IsActive,
                NgayTao = p.NgayTao,
                ChiTietNhaps = p.ChiTietNhaps.Select(ct => new ChiTietNhapResponseDto
                {
                    MaChiTiet = ct.MaChiTiet,
                    MaLo = ct.MaLo,
                    TenVaccine = ct.MaLoNavigation?.MaVaccineNavigation?.Ten,
                    SoLo = ct.MaLoNavigation?.SoLo,
                    SoLuong = ct.SoLuong,
                    Gia = ct.Gia,
                    NgayHetHan = ct.MaLoNavigation?.NgayHetHan
                }).ToList()
            }).ToList();

            var result = new
            {
                data = phieuNhapDtos,
                totalCount = totalCount,
                page = page,
                pageSize = pageSize,
                totalPages = (int)Math.Ceiling((double)totalCount / pageSize)
            };

            return ApiResponse.Success("Lấy danh sách phiếu nhập thành công", result);
        }
        catch (Exception ex)
        {
            return ApiResponse.Error($"Lỗi: {ex.Message}");
        }
    }

    // GET: api/PhieuNhap/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> GetPhieuNhap(string id)
    {
        try
        {
            var phieuNhap = await _context.PhieuNhaps
                .Include(p => p.MaNhaCungCapNavigation)
                .Include(p => p.ChiTietNhaps)
                .ThenInclude(ct => ct.MaLoNavigation)
                .ThenInclude(l => l.MaVaccineNavigation)
                .FirstOrDefaultAsync(p => p.MaPhieuNhap == id && (!p.IsDelete.HasValue || !p.IsDelete.Value));

            if (phieuNhap == null)
                return ApiResponse.Error("Không tìm thấy phiếu nhập");

            var phieuNhapDto = new PhieuNhapResponseDto
            {
                MaPhieuNhap = phieuNhap.MaPhieuNhap,
                MaNhaCungCap = phieuNhap.MaNhaCungCap,
                TenNhaCungCap = phieuNhap.MaNhaCungCapNavigation?.Ten,
                NgayNhap = phieuNhap.NgayNhap,
                TongTien = phieuNhap.TongTien,
                TrangThai = phieuNhap.TrangThai,
                IsActive = phieuNhap.IsActive,
                NgayTao = phieuNhap.NgayTao,
                ChiTietNhaps = phieuNhap.ChiTietNhaps.Select(ct => new ChiTietNhapResponseDto
                {
                    MaChiTiet = ct.MaChiTiet,
                    MaLo = ct.MaLo,
                    TenVaccine = ct.MaLoNavigation?.MaVaccineNavigation?.Ten,
                    SoLo = ct.MaLoNavigation?.SoLo,
                    SoLuong = ct.SoLuong,
                    Gia = ct.Gia,
                    NgayHetHan = ct.MaLoNavigation?.NgayHetHan
                }).ToList()
            };

            return ApiResponse.Success("Lấy thông tin phiếu nhập thành công", phieuNhapDto);
        }
        catch (Exception ex)
        {
            return ApiResponse.Error($"Lỗi: {ex.Message}");
        }
    }

    // POST: api/PhieuNhap
    [HttpPost]
    public async Task<IActionResult> CreatePhieuNhap(PhieuNhapCreateDto createDto)
    {
        try
        {
            if (!ModelState.IsValid)
                return ApiResponse.Error("Dữ liệu không hợp lệ");

            // Validate chi tiết
            if (createDto.ChiTietNhaps == null || !createDto.ChiTietNhaps.Any())
                return ApiResponse.Error("Phiếu nhập phải có ít nhất một chi tiết");

            // Generate mã phiếu nhập
            var maPhieuNhap = $"PN{DateTime.Now:yyyyMMddHHmmss}";

            // Create phiếu nhập
            var phieuNhap = new PhieuNhap
            {
                MaPhieuNhap = maPhieuNhap,
                MaNhaCungCap = createDto.MaNhaCungCap,
                NgayNhap = createDto.NgayNhap,
                TrangThai = createDto.TrangThai,
                IsDelete = false,
                IsActive = true,
                NgayTao = DateTime.UtcNow,
                NgayCapNhat = DateTime.UtcNow
            };

            _context.PhieuNhaps.Add(phieuNhap);

            // Create chi tiết nhập
            decimal tongTien = 0;
            foreach (var chiTietDto in createDto.ChiTietNhaps)
            {
                var chiTiet = new ChiTietNhap
                {
                    MaChiTiet = Guid.NewGuid().ToString(),
                    MaPhieuNhap = maPhieuNhap,
                    MaLo = chiTietDto.MaLo,
                    SoLuong = chiTietDto.SoLuong,
                    Gia = chiTietDto.Gia,
                    IsDelete = false,
                    IsActive = true,
                    NgayTao = DateTime.UtcNow,
                    NgayCapNhat = DateTime.UtcNow
                };

                _context.ChiTietNhaps.Add(chiTiet);
                tongTien += chiTietDto.Gia * chiTietDto.SoLuong;

                // Update số lượng lô vaccine
                var loVaccine = await _context.LoVaccines.FindAsync(chiTietDto.MaLo);
                if (loVaccine != null)
                {
                    loVaccine.SoLuongHienTai = (loVaccine.SoLuongHienTai ?? 0) + chiTietDto.SoLuong;
                    loVaccine.NgayCapNhat = DateTime.UtcNow;
                }
            }

            // Update tổng tiền
            phieuNhap.TongTien = tongTien;

            await _context.SaveChangesAsync();

            // Return created entity
            var createdPhieuNhap = await GetPhieuNhap(maPhieuNhap);
            if (createdPhieuNhap is ObjectResult objResult && objResult.Value != null)
            {
                var response = objResult.Value as dynamic;
                return ApiResponse.Success("Tạo phiếu nhập thành công", response?.payload);
            }
            return ApiResponse.Success("Tạo phiếu nhập thành công", null);
        }
        catch (Exception ex)
        {
            return ApiResponse.Error($"Lỗi: {ex.Message}");
        }
    }

    // PUT: api/PhieuNhap/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdatePhieuNhap(string id, PhieuNhapUpdateDto updateDto)
    {
        try
        {
            var phieuNhap = await _context.PhieuNhaps
                .FirstOrDefaultAsync(p => p.MaPhieuNhap == id && (!p.IsDelete.HasValue || !p.IsDelete.Value));

            if (phieuNhap == null)
                return ApiResponse.Error("Không tìm thấy phiếu nhập");

            // Update fields
            if (updateDto.MaNhaCungCap != null)
                phieuNhap.MaNhaCungCap = updateDto.MaNhaCungCap;

            if (updateDto.NgayNhap.HasValue)
                phieuNhap.NgayNhap = updateDto.NgayNhap.Value;

            if (updateDto.TrangThai != null)
                phieuNhap.TrangThai = updateDto.TrangThai;

            if (updateDto.IsActive.HasValue)
                phieuNhap.IsActive = updateDto.IsActive.Value;

            phieuNhap.NgayCapNhat = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            // Return updated entity
            var updatedPhieuNhap = await GetPhieuNhap(id);
            if (updatedPhieuNhap is ObjectResult objResult && objResult.Value != null)
            {
                var response = objResult.Value as dynamic;
                return ApiResponse.Success("Cập nhật phiếu nhập thành công", response?.payload);
            }
            return ApiResponse.Success("Cập nhật phiếu nhập thành công", null);
        }
        catch (Exception ex)
        {
            return ApiResponse.Error($"Lỗi: {ex.Message}");
        }
    }

    // DELETE: api/PhieuNhap/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePhieuNhap(string id)
    {
        try
        {
            var phieuNhap = await _context.PhieuNhaps
                .Include(p => p.ChiTietNhaps)
                .FirstOrDefaultAsync(p => p.MaPhieuNhap == id && (!p.IsDelete.HasValue || !p.IsDelete.Value));

            if (phieuNhap == null)
                return ApiResponse.Error("Không tìm thấy phiếu nhập");

            // Soft delete phiếu nhập
            phieuNhap.IsDelete = true;
            phieuNhap.NgayCapNhat = DateTime.UtcNow;

            // Soft delete chi tiết
            foreach (var chiTiet in phieuNhap.ChiTietNhaps)
            {
                chiTiet.IsDelete = true;
                chiTiet.NgayCapNhat = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();

            return ApiResponse.Success("Xóa phiếu nhập thành công", id);
        }
        catch (Exception ex)
        {
            return ApiResponse.Error($"Lỗi: {ex.Message}");
        }
    }

    // PUT: api/PhieuNhap/{id}/status
    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdatePhieuNhapStatus(string id, [FromBody] string trangThai)
    {
        try
        {
            var phieuNhap = await _context.PhieuNhaps
                .FirstOrDefaultAsync(p => p.MaPhieuNhap == id && (!p.IsDelete.HasValue || !p.IsDelete.Value));

            if (phieuNhap == null)
                return ApiResponse.Error("Không tìm thấy phiếu nhập");

            phieuNhap.TrangThai = trangThai;
            phieuNhap.NgayCapNhat = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return ApiResponse.Success("Cập nhật trạng thái phiếu nhập thành công", trangThai);
        }
        catch (Exception ex)
        {
            return ApiResponse.Error($"Lỗi: {ex.Message}");
        }
    }
} 