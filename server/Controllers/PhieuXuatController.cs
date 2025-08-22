using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.DTOs.PhieuXuat;
using server.Helpers;
using server.Models;

namespace server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PhieuXuatController : ControllerBase
{
    private readonly HeThongQuanLyTiemChungContext _context;

    public PhieuXuatController(HeThongQuanLyTiemChungContext context)
    {
        _context = context;
    }

    // GET: api/PhieuXuat
    [HttpGet]
    public async Task<IActionResult> GetPhieuXuats(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? trangThai = null,
        [FromQuery] string? loaiXuat = null,
        [FromQuery] string? maDiaDiemXuat = null,
        [FromQuery] string? maDiaDiemNhap = null,
        [FromQuery] DateTime? ngayXuatFrom = null,
        [FromQuery] DateTime? ngayXuatTo = null)
    {
        try
        {
            var query = _context.PhieuXuats
                .Include(p => p.MaDiaDiemXuatNavigation)
                .Include(p => p.MaDiaDiemNhapNavigation)
                .Include(p => p.ChiTietXuats)
                .ThenInclude(ct => ct.MaLoNavigation)
                .ThenInclude(l => l.MaVaccineNavigation)
                .Where(p => !p.IsDelete.HasValue || !p.IsDelete.Value)
                .AsQueryable();

            // Apply filters
            if (!string.IsNullOrEmpty(trangThai))
                query = query.Where(p => p.TrangThai == trangThai);

            if (!string.IsNullOrEmpty(loaiXuat))
                query = query.Where(p => p.LoaiXuat == loaiXuat);

            if (!string.IsNullOrEmpty(maDiaDiemXuat))
                query = query.Where(p => p.MaDiaDiemXuat == maDiaDiemXuat);

            if (!string.IsNullOrEmpty(maDiaDiemNhap))
                query = query.Where(p => p.MaDiaDiemNhap == maDiaDiemNhap);

            if (ngayXuatFrom.HasValue)
                query = query.Where(p => p.NgayXuat >= ngayXuatFrom.Value);

            if (ngayXuatTo.HasValue)
                query = query.Where(p => p.NgayXuat <= ngayXuatTo.Value);

            // Get total count
            var totalCount = await query.CountAsync();

            // Apply pagination
            var phieuXuats = await query
                .OrderByDescending(p => p.NgayTao)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            // Map to DTOs
            var phieuXuatDtos = phieuXuats.Select(p => new PhieuXuatResponseDto
            {
                MaPhieuXuat = p.MaPhieuXuat,
                MaDiaDiemXuat = p.MaDiaDiemXuat,
                TenDiaDiemXuat = p.MaDiaDiemXuatNavigation?.Ten,
                MaDiaDiemNhap = p.MaDiaDiemNhap,
                TenDiaDiemNhap = p.MaDiaDiemNhapNavigation?.Ten,
                NgayXuat = p.NgayXuat,
                LoaiXuat = p.LoaiXuat,
                TrangThai = p.TrangThai,
                IsActive = p.IsActive,
                NgayTao = p.NgayTao,
                ChiTietXuats = p.ChiTietXuats.Select(ct => new ChiTietXuatResponseDto
                {
                    MaChiTiet = ct.MaChiTiet,
                    MaLo = ct.MaLo,
                    TenVaccine = ct.MaLoNavigation?.MaVaccineNavigation?.Ten,
                    SoLo = ct.MaLoNavigation?.SoLo,
                    SoLuong = ct.SoLuong,
                    NgayHetHan = ct.MaLoNavigation?.NgayHetHan
                }).ToList()
            }).ToList();

            var result = new
            {
                data = phieuXuatDtos,
                totalCount = totalCount,
                page = page,
                pageSize = pageSize,
                totalPages = (int)Math.Ceiling((double)totalCount / pageSize)
            };

            return ApiResponse.Success("Lấy danh sách phiếu xuất thành công", result);
        }
        catch (Exception ex)
        {
            return ApiResponse.Error($"Lỗi: {ex.Message}");
        }
    }

    // GET: api/PhieuXuat/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> GetPhieuXuat(string id)
    {
        try
        {
            var phieuXuat = await _context.PhieuXuats
                .Include(p => p.MaDiaDiemXuatNavigation)
                .Include(p => p.MaDiaDiemNhapNavigation)
                .Include(p => p.ChiTietXuats)
                .ThenInclude(ct => ct.MaLoNavigation)
                .ThenInclude(l => l.MaVaccineNavigation)
                .FirstOrDefaultAsync(p => p.MaPhieuXuat == id && (!p.IsDelete.HasValue || !p.IsDelete.Value));

            if (phieuXuat == null)
                return ApiResponse.Error("Không tìm thấy phiếu xuất");

            var phieuXuatDto = new PhieuXuatResponseDto
            {
                MaPhieuXuat = phieuXuat.MaPhieuXuat,
                MaDiaDiemXuat = phieuXuat.MaDiaDiemXuat,
                TenDiaDiemXuat = phieuXuat.MaDiaDiemXuatNavigation?.Ten,
                MaDiaDiemNhap = phieuXuat.MaDiaDiemNhap,
                TenDiaDiemNhap = phieuXuat.MaDiaDiemNhapNavigation?.Ten,
                NgayXuat = phieuXuat.NgayXuat,
                LoaiXuat = phieuXuat.LoaiXuat,
                TrangThai = phieuXuat.TrangThai,
                IsActive = phieuXuat.IsActive,
                NgayTao = phieuXuat.NgayTao,
                ChiTietXuats = phieuXuat.ChiTietXuats.Select(ct => new ChiTietXuatResponseDto
                {
                    MaChiTiet = ct.MaChiTiet,
                    MaLo = ct.MaLo,
                    TenVaccine = ct.MaLoNavigation?.MaVaccineNavigation?.Ten,
                    SoLo = ct.MaLoNavigation?.SoLo,
                    SoLuong = ct.SoLuong,
                    NgayHetHan = ct.MaLoNavigation?.NgayHetHan
                }).ToList()
            };

            return ApiResponse.Success("Lấy thông tin phiếu xuất thành công", phieuXuatDto);
        }
        catch (Exception ex)
        {
            return ApiResponse.Error($"Lỗi: {ex.Message}");
        }
    }

    // POST: api/PhieuXuat
    [HttpPost]
    public async Task<IActionResult> CreatePhieuXuat(PhieuXuatCreateDto createDto)
    {
        try
        {
            if (!ModelState.IsValid)
                return ApiResponse.Error("Dữ liệu không hợp lệ");

            // Validate chi tiết
            if (createDto.ChiTietXuats == null || !createDto.ChiTietXuats.Any())
                return ApiResponse.Error("Phiếu xuất phải có ít nhất một chi tiết");

            // Generate mã phiếu xuất
            var maPhieuXuat = $"PX{DateTime.Now:yyyyMMddHHmmss}";

            // Create phiếu xuất
            var phieuXuat = new PhieuXuat
            {
                MaPhieuXuat = maPhieuXuat,
                MaDiaDiemXuat = createDto.MaDiaDiemXuat,
                MaDiaDiemNhap = createDto.MaDiaDiemNhap,
                NgayXuat = createDto.NgayXuat,
                LoaiXuat = createDto.LoaiXuat,
                TrangThai = createDto.TrangThai,
                IsDelete = false,
                IsActive = true,
                NgayTao = DateTime.UtcNow,
                NgayCapNhat = DateTime.UtcNow
            };

            _context.PhieuXuats.Add(phieuXuat);

            // Create chi tiết xuất và update số lượng lô vaccine
            foreach (var chiTietDto in createDto.ChiTietXuats)
            {
                var chiTiet = new ChiTietXuat
                {
                    MaChiTiet = Guid.NewGuid().ToString(),
                    MaPhieuXuat = maPhieuXuat,
                    MaLo = chiTietDto.MaLo,
                    SoLuong = chiTietDto.SoLuong,
                    IsDelete = false,
                    IsActive = true,
                    NgayTao = DateTime.UtcNow,
                    NgayCapNhat = DateTime.UtcNow
                };

                _context.ChiTietXuats.Add(chiTiet);

                // Update số lượng lô vaccine (giảm số lượng)
                var loVaccine = await _context.LoVaccines.FindAsync(chiTietDto.MaLo);
                if (loVaccine != null)
                {
                    if (loVaccine.SoLuongHienTai < chiTietDto.SoLuong)
                        return ApiResponse.Error($"Lô vaccine {loVaccine.SoLo} không đủ số lượng để xuất");

                    loVaccine.SoLuongHienTai = loVaccine.SoLuongHienTai - chiTietDto.SoLuong;
                    loVaccine.NgayCapNhat = DateTime.UtcNow;
                }
            }

            await _context.SaveChangesAsync();

            // Return created entity
            var createdPhieuXuat = await GetPhieuXuat(maPhieuXuat);
            if (createdPhieuXuat is ObjectResult objResult && objResult.Value != null)
            {
                var response = objResult.Value as dynamic;
                return ApiResponse.Success("Tạo phiếu xuất thành công", response?.payload);
            }
            return ApiResponse.Success("Tạo phiếu xuất thành công", null);
        }
        catch (Exception ex)
        {
            return ApiResponse.Error($"Lỗi: {ex.Message}");
        }
    }

    // PUT: api/PhieuXuat/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdatePhieuXuat(string id, PhieuXuatUpdateDto updateDto)
    {
        try
        {
            var phieuXuat = await _context.PhieuXuats
                .FirstOrDefaultAsync(p => p.MaPhieuXuat == id && (!p.IsDelete.HasValue || !p.IsDelete.Value));

            if (phieuXuat == null)
                return ApiResponse.Error("Không tìm thấy phiếu xuất");

            // Update fields
            if (updateDto.MaDiaDiemXuat != null)
                phieuXuat.MaDiaDiemXuat = updateDto.MaDiaDiemXuat;

            if (updateDto.MaDiaDiemNhap != null)
                phieuXuat.MaDiaDiemNhap = updateDto.MaDiaDiemNhap;

            if (updateDto.NgayXuat.HasValue)
                phieuXuat.NgayXuat = updateDto.NgayXuat.Value;

            if (updateDto.LoaiXuat != null)
                phieuXuat.LoaiXuat = updateDto.LoaiXuat;

            if (updateDto.TrangThai != null)
                phieuXuat.TrangThai = updateDto.TrangThai;

            if (updateDto.IsActive.HasValue)
                phieuXuat.IsActive = updateDto.IsActive.Value;

            phieuXuat.NgayCapNhat = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            // Return updated entity
            var updatedPhieuXuat = await GetPhieuXuat(id);
            if (updatedPhieuXuat is ObjectResult objResult && objResult.Value != null)
            {
                var response = objResult.Value as dynamic;
                return ApiResponse.Success("Cập nhật phiếu xuất thành công", response?.payload);
            }
            return ApiResponse.Success("Cập nhật phiếu xuất thành công", null);
        }
        catch (Exception ex)
        {
            return ApiResponse.Error($"Lỗi: {ex.Message}");
        }
    }

    // DELETE: api/PhieuXuat/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePhieuXuat(string id)
    {
        try
        {
            var phieuXuat = await _context.PhieuXuats
                .Include(p => p.ChiTietXuats)
                .FirstOrDefaultAsync(p => p.MaPhieuXuat == id && (!p.IsDelete.HasValue || !p.IsDelete.Value));

            if (phieuXuat == null)
                return ApiResponse.Error("Không tìm thấy phiếu xuất");

            // Soft delete phiếu xuất
            phieuXuat.IsDelete = true;
            phieuXuat.NgayCapNhat = DateTime.UtcNow;

            // Soft delete chi tiết
            foreach (var chiTiet in phieuXuat.ChiTietXuats)
            {
                chiTiet.IsDelete = true;
                chiTiet.NgayCapNhat = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();

            return ApiResponse.Success("Xóa phiếu xuất thành công", id);
        }
        catch (Exception ex)
        {
            return ApiResponse.Error($"Lỗi: {ex.Message}");
        }
    }

    // PUT: api/PhieuXuat/{id}/status
    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdatePhieuXuatStatus(string id, [FromBody] string trangThai)
    {
        try
        {
            var phieuXuat = await _context.PhieuXuats
                .FirstOrDefaultAsync(p => p.MaPhieuXuat == id && (!p.IsDelete.HasValue || !p.IsDelete.Value));

            if (phieuXuat == null)
                return ApiResponse.Error("Không tìm thấy phiếu xuất");

            phieuXuat.TrangThai = trangThai;
            phieuXuat.NgayCapNhat = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return ApiResponse.Success("Cập nhật trạng thái phiếu xuất thành công", trangThai);
        }
        catch (Exception ex)
        {
            return ApiResponse.Error($"Lỗi: {ex.Message}");
        }
    }
} 