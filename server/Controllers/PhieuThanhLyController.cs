using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.DTOs.PhieuThanhLy;
using server.Helpers;
using server.Models;

namespace server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PhieuThanhLyController : ControllerBase
{
    private readonly HeThongQuanLyTiemChungContext _context;

    public PhieuThanhLyController(HeThongQuanLyTiemChungContext context)
    {
        _context = context;
    }

    // GET: api/PhieuThanhLy
    [HttpGet]
    public async Task<IActionResult> GetPhieuThanhLies(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? trangThai = null,
        [FromQuery] string? maDiaDiem = null,
        [FromQuery] DateTime? ngayThanhLyFrom = null,
        [FromQuery] DateTime? ngayThanhLyTo = null)
    {
        try
        {
            var query = _context.PhieuThanhLies
                .Include(p => p.MaDiaDiemNavigation)
                .Include(p => p.ChiTietThanhLies)
                .ThenInclude(ct => ct.MaLoNavigation)
                .ThenInclude(l => l.MaVaccineNavigation)
                .Where(p => !p.IsDelete.HasValue || !p.IsDelete.Value)
                .AsQueryable();

            // Apply filters
            if (!string.IsNullOrEmpty(trangThai))
                query = query.Where(p => p.TrangThai == trangThai);

            if (!string.IsNullOrEmpty(maDiaDiem))
                query = query.Where(p => p.MaDiaDiem == maDiaDiem);

            if (ngayThanhLyFrom.HasValue)
                query = query.Where(p => p.NgayThanhLy >= ngayThanhLyFrom.Value);

            if (ngayThanhLyTo.HasValue)
                query = query.Where(p => p.NgayThanhLy <= ngayThanhLyTo.Value);

            // Get total count
            var totalCount = await query.CountAsync();

            // Apply pagination
            var phieuThanhLies = await query
                .OrderByDescending(p => p.NgayTao)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            // Map to DTOs
            var phieuThanhLyDtos = phieuThanhLies.Select(p => new PhieuThanhLyResponseDto
            {
                MaPhieuThanhLy = p.MaPhieuThanhLy,
                MaDiaDiem = p.MaDiaDiem,
                TenDiaDiem = p.MaDiaDiemNavigation?.Ten,
                NgayThanhLy = p.NgayThanhLy,
                TrangThai = p.TrangThai,
                IsActive = p.IsActive,
                NgayTao = p.NgayTao,
                ChiTietThanhLies = p.ChiTietThanhLies.Select(ct => new ChiTietThanhLyResponseDto
                {
                    MaChiTiet = ct.MaChiTiet,
                    MaLo = ct.MaLo,
                    TenVaccine = ct.MaLoNavigation?.MaVaccineNavigation?.Ten,
                    SoLo = ct.MaLoNavigation?.SoLo,
                    SoLuong = ct.SoLuong,
                    LyDo = ct.LyDo,
                    NgayHetHan = ct.MaLoNavigation?.NgayHetHan
                }).ToList()
            }).ToList();

            var result = new
            {
                data = phieuThanhLyDtos,
                totalCount = totalCount,
                page = page,
                pageSize = pageSize,
                totalPages = (int)Math.Ceiling((double)totalCount / pageSize)
            };

            return ApiResponse.Success("Lấy danh sách phiếu thanh lý thành công", result);
        }
        catch (Exception ex)
        {
            return ApiResponse.Error($"Lỗi: {ex.Message}");
        }
    }

    // GET: api/PhieuThanhLy/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> GetPhieuThanhLy(string id)
    {
        try
        {
            var phieuThanhLy = await _context.PhieuThanhLies
                .Include(p => p.MaDiaDiemNavigation)
                .Include(p => p.ChiTietThanhLies)
                .ThenInclude(ct => ct.MaLoNavigation)
                .ThenInclude(l => l.MaVaccineNavigation)
                .FirstOrDefaultAsync(p => p.MaPhieuThanhLy == id && (!p.IsDelete.HasValue || !p.IsDelete.Value));

            if (phieuThanhLy == null)
                return ApiResponse.Error("Không tìm thấy phiếu thanh lý");

            var phieuThanhLyDto = new PhieuThanhLyResponseDto
            {
                MaPhieuThanhLy = phieuThanhLy.MaPhieuThanhLy,
                MaDiaDiem = phieuThanhLy.MaDiaDiem,
                TenDiaDiem = phieuThanhLy.MaDiaDiemNavigation?.Ten,
                NgayThanhLy = phieuThanhLy.NgayThanhLy,
                TrangThai = phieuThanhLy.TrangThai,
                IsActive = phieuThanhLy.IsActive,
                NgayTao = phieuThanhLy.NgayTao,
                ChiTietThanhLies = phieuThanhLy.ChiTietThanhLies.Select(ct => new ChiTietThanhLyResponseDto
                {
                    MaChiTiet = ct.MaChiTiet,
                    MaLo = ct.MaLo,
                    TenVaccine = ct.MaLoNavigation?.MaVaccineNavigation?.Ten,
                    SoLo = ct.MaLoNavigation?.SoLo,
                    SoLuong = ct.SoLuong,
                    LyDo = ct.LyDo,
                    NgayHetHan = ct.MaLoNavigation?.NgayHetHan
                }).ToList()
            };

            return ApiResponse.Success("Lấy thông tin phiếu thanh lý thành công", phieuThanhLyDto);
        }
        catch (Exception ex)
        {
            return ApiResponse.Error($"Lỗi: {ex.Message}");
        }
    }

    // POST: api/PhieuThanhLy
    [HttpPost]
    public async Task<IActionResult> CreatePhieuThanhLy(PhieuThanhLyCreateDto createDto)
    {
        try
        {
            if (!ModelState.IsValid)
                return ApiResponse.Error("Dữ liệu không hợp lệ");

            // Validate chi tiết
            if (createDto.ChiTietThanhLies == null || !createDto.ChiTietThanhLies.Any())
                return ApiResponse.Error("Phiếu thanh lý phải có ít nhất một chi tiết");

            // Generate mã phiếu thanh lý
            var maPhieuThanhLy = $"PTL{DateTime.Now:yyyyMMddHHmmss}";

            // Create phiếu thanh lý
            var phieuThanhLy = new PhieuThanhLy
            {
                MaPhieuThanhLy = maPhieuThanhLy,
                MaDiaDiem = createDto.MaDiaDiem,
                NgayThanhLy = createDto.NgayThanhLy,
                TrangThai = createDto.TrangThai,
                IsDelete = false,
                IsActive = true,
                NgayTao = DateTime.UtcNow,
                NgayCapNhat = DateTime.UtcNow
            };

            _context.PhieuThanhLies.Add(phieuThanhLy);

            // Create chi tiết thanh lý và update số lượng lô vaccine
            foreach (var chiTietDto in createDto.ChiTietThanhLies)
            {
                var chiTiet = new ChiTietThanhLy
                {
                    MaChiTiet = Guid.NewGuid().ToString(),
                    MaPhieuThanhLy = maPhieuThanhLy,
                    MaLo = chiTietDto.MaLo,
                    SoLuong = chiTietDto.SoLuong,
                    LyDo = chiTietDto.LyDo,
                    IsDelete = false,
                    IsActive = true,
                    NgayTao = DateTime.UtcNow,
                    NgayCapNhat = DateTime.UtcNow
                };

                _context.ChiTietThanhLies.Add(chiTiet);

                // Update số lượng lô vaccine (giảm số lượng)
                var loVaccine = await _context.LoVaccines.FindAsync(chiTietDto.MaLo);
                if (loVaccine != null)
                {
                    if (loVaccine.SoLuongHienTai < chiTietDto.SoLuong)
                        return ApiResponse.Error($"Lô vaccine {loVaccine.SoLo} không đủ số lượng để thanh lý");

                    loVaccine.SoLuongHienTai = loVaccine.SoLuongHienTai - chiTietDto.SoLuong;
                    loVaccine.NgayCapNhat = DateTime.UtcNow;
                }
            }

            await _context.SaveChangesAsync();

            // Return created entity
            var createdPhieuThanhLy = await GetPhieuThanhLy(maPhieuThanhLy);
            if (createdPhieuThanhLy is ObjectResult objResult && objResult.Value != null)
            {
                var response = objResult.Value as dynamic;
                return ApiResponse.Success("Tạo phiếu thanh lý thành công", response?.payload);
            }
            return ApiResponse.Success("Tạo phiếu thanh lý thành công", null);
        }
        catch (Exception ex)
        {
            return ApiResponse.Error($"Lỗi: {ex.Message}");
        }
    }

    // PUT: api/PhieuThanhLy/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdatePhieuThanhLy(string id, PhieuThanhLyUpdateDto updateDto)
    {
        try
        {
            var phieuThanhLy = await _context.PhieuThanhLies
                .FirstOrDefaultAsync(p => p.MaPhieuThanhLy == id && (!p.IsDelete.HasValue || !p.IsDelete.Value));

            if (phieuThanhLy == null)
                return ApiResponse.Error("Không tìm thấy phiếu thanh lý");

            // Update fields
            if (updateDto.MaDiaDiem != null)
                phieuThanhLy.MaDiaDiem = updateDto.MaDiaDiem;

            if (updateDto.NgayThanhLy.HasValue)
                phieuThanhLy.NgayThanhLy = updateDto.NgayThanhLy.Value;

            if (updateDto.TrangThai != null)
                phieuThanhLy.TrangThai = updateDto.TrangThai;

            if (updateDto.IsActive.HasValue)
                phieuThanhLy.IsActive = updateDto.IsActive.Value;

            phieuThanhLy.NgayCapNhat = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            // Return updated entity
            var updatedPhieuThanhLy = await GetPhieuThanhLy(id);
            if (updatedPhieuThanhLy is ObjectResult objResult && objResult.Value != null)
            {
                var response = objResult.Value as dynamic;
                return ApiResponse.Success("Cập nhật phiếu thanh lý thành công", response?.payload);
            }
            return ApiResponse.Success("Cập nhật phiếu thanh lý thành công", null);
        }
        catch (Exception ex)
        {
            return ApiResponse.Error($"Lỗi: {ex.Message}");
        }
    }

    // DELETE: api/PhieuThanhLy/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePhieuThanhLy(string id)
    {
        try
        {
            var phieuThanhLy = await _context.PhieuThanhLies
                .Include(p => p.ChiTietThanhLies)
                .FirstOrDefaultAsync(p => p.MaPhieuThanhLy == id && (!p.IsDelete.HasValue || !p.IsDelete.Value));

            if (phieuThanhLy == null)
                return ApiResponse.Error("Không tìm thấy phiếu thanh lý");

            // Soft delete phiếu thanh lý
            phieuThanhLy.IsDelete = true;
            phieuThanhLy.NgayCapNhat = DateTime.UtcNow;

            // Soft delete chi tiết
            foreach (var chiTiet in phieuThanhLy.ChiTietThanhLies)
            {
                chiTiet.IsDelete = true;
                chiTiet.NgayCapNhat = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();

            return ApiResponse.Success("Xóa phiếu thanh lý thành công", id);
        }
        catch (Exception ex)
        {
            return ApiResponse.Error($"Lỗi: {ex.Message}");
        }
    }

    // PUT: api/PhieuThanhLy/{id}/status
    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdatePhieuThanhLyStatus(string id, [FromBody] string trangThai)
    {
        try
        {
            var phieuThanhLy = await _context.PhieuThanhLies
                .FirstOrDefaultAsync(p => p.MaPhieuThanhLy == id && (!p.IsDelete.HasValue || !p.IsDelete.Value));

            if (phieuThanhLy == null)
                return ApiResponse.Error("Không tìm thấy phiếu thanh lý");

            phieuThanhLy.TrangThai = trangThai;
            phieuThanhLy.NgayCapNhat = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return ApiResponse.Success("Cập nhật trạng thái phiếu thanh lý thành công", trangThai);
        }
        catch (Exception ex)
        {
            return ApiResponse.Error($"Lỗi: {ex.Message}");
        }
    }
} 