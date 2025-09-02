using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.DTOs.KhuyenMai;
using server.DTOs.Pagination;
using server.Helpers;
using server.Models;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class KhuyenMaiController : ControllerBase
{
    private readonly HeThongQuanLyTiemChungContext _context;

    public KhuyenMaiController(HeThongQuanLyTiemChungContext context)
    {
        _context = context;
    }

    // GET: api/KhuyenMai
    [HttpGet]
    public async Task<IActionResult> GetKhuyenMais(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? searchTerm = null,
        [FromQuery] string? maLoaiKhuyenMai = null,
        [FromQuery] string? trangThai = null,
        CancellationToken ct = default)
    {
        try
        {
            var query = _context.KhuyenMais
                .Include(k => k.MaLoaiKhuyenMaiNavigation)
                .Where(k => k.IsDelete != true)
                .AsQueryable();

            // Apply filters
            if (!string.IsNullOrEmpty(searchTerm))
            {
                query = query.Where(k => 
                    k.TenKhuyenMai!.Contains(searchTerm) || 
                    k.Code!.Contains(searchTerm));
            }

            if (!string.IsNullOrEmpty(maLoaiKhuyenMai))
            {
                query = query.Where(k => k.MaLoaiKhuyenMai == maLoaiKhuyenMai);
            }

            if (!string.IsNullOrEmpty(trangThai))
            {
                query = query.Where(k => k.TrangThai == trangThai);
            }

            // Apply pagination
            var result = await query.ToPagedAsync(page, pageSize, ct);

            // Map to DTO
            var khuyenMaiDtos = result.Data.Select(k => new KhuyenMaiDto
            {
                MaKhuyenMai = k.MaKhuyenMai,
                MaLoaiKhuyenMai = k.MaLoaiKhuyenMai,
                TenKhuyenMai = k.TenKhuyenMai,
                Code = k.Code,
                LoaiGiam = k.LoaiGiam,
                GiaTriGiam = k.GiaTriGiam,
                GiamToiDa = k.GiamToiDa,
                DieuKienToiThieu = k.DieuKienToiThieu,
                GiaTriToiThieu = k.GiaTriToiThieu,
                NgayBatDau = k.NgayBatDau,
                NgayKetThuc = k.NgayKetThuc,
                SoLuotDung = k.SoLuotDung,
                SoLuotDaDung = k.SoLuotDaDung,
                TrangThai = k.TrangThai,
                IsDelete = k.IsDelete,
                IsActive = k.IsActive,
                NgayTao = k.NgayTao,
                NgayCapNhat = k.NgayCapNhat,
                TenLoaiKhuyenMai = k.MaLoaiKhuyenMaiNavigation?.TenLoai
            }).ToList();

            var pagedResult = new PagedResultDto<KhuyenMaiDto>(
                result.TotalCount,
                result.Page,
                result.PageSize,
                result.TotalPages,
                khuyenMaiDtos
            );

            return ApiResponse.Success("Lấy danh sách khuyến mãi thành công", pagedResult);
        }
        catch (Exception ex)
        {
            return ApiResponse.Error($"Lỗi khi lấy danh sách khuyến mãi: {ex.Message}");
        }
    }

    // GET: api/KhuyenMai/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> GetKhuyenMai(string id, CancellationToken ct = default)
    {
        try
        {
            var khuyenMai = await _context.KhuyenMais
                .Include(k => k.MaLoaiKhuyenMaiNavigation)
                .FirstOrDefaultAsync(k => k.MaKhuyenMai == id && k.IsDelete != true, ct);

            if (khuyenMai == null)
            {
                return ApiResponse.Error("Không tìm thấy khuyến mãi");
            }

            var khuyenMaiDto = new KhuyenMaiDto
            {
                MaKhuyenMai = khuyenMai.MaKhuyenMai,
                MaLoaiKhuyenMai = khuyenMai.MaLoaiKhuyenMai,
                TenKhuyenMai = khuyenMai.TenKhuyenMai,
                Code = khuyenMai.Code,
                LoaiGiam = khuyenMai.LoaiGiam,
                GiaTriGiam = khuyenMai.GiaTriGiam,
                GiamToiDa = khuyenMai.GiamToiDa,
                DieuKienToiThieu = khuyenMai.DieuKienToiThieu,
                GiaTriToiThieu = khuyenMai.GiaTriToiThieu,
                NgayBatDau = khuyenMai.NgayBatDau,
                NgayKetThuc = khuyenMai.NgayKetThuc,
                SoLuotDung = khuyenMai.SoLuotDung,
                SoLuotDaDung = khuyenMai.SoLuotDaDung,
                TrangThai = khuyenMai.TrangThai,
                IsDelete = khuyenMai.IsDelete,
                IsActive = khuyenMai.IsActive,
                NgayTao = khuyenMai.NgayTao,
                NgayCapNhat = khuyenMai.NgayCapNhat,
                TenLoaiKhuyenMai = khuyenMai.MaLoaiKhuyenMaiNavigation?.TenLoai
            };

            return ApiResponse.Success("Lấy thông tin khuyến mãi thành công", khuyenMaiDto);
        }
        catch (Exception ex)
        {
            return ApiResponse.Error($"Lỗi khi lấy thông tin khuyến mãi: {ex.Message}");
        }
    }

    // POST: api/KhuyenMai
    [HttpPost]
    public async Task<IActionResult> CreateKhuyenMai([FromBody] CreateKhuyenMaiDto createDto, CancellationToken ct = default)
    {
        try
        {
            if (string.IsNullOrEmpty(createDto.TenKhuyenMai))
            {
                return ApiResponse.Error("Tên khuyến mãi không được để trống");
            }

            if (string.IsNullOrEmpty(createDto.Code))
            {
                return ApiResponse.Error("Mã code khuyến mãi không được để trống");
            }

            // Check if code already exists
            var existingCode = await _context.KhuyenMais
                .AnyAsync(k => k.Code == createDto.Code && k.IsDelete != true, ct);
            if (existingCode)
            {
                return ApiResponse.Error("Mã code khuyến mãi đã tồn tại");
            }

            var khuyenMai = new KhuyenMai
            {
                MaKhuyenMai = Guid.NewGuid().ToString(),
                MaLoaiKhuyenMai = createDto.MaLoaiKhuyenMai,
                TenKhuyenMai = createDto.TenKhuyenMai,
                Code = createDto.Code,
                LoaiGiam = createDto.LoaiGiam,
                GiaTriGiam = createDto.GiaTriGiam,
                GiamToiDa = createDto.GiamToiDa,
                DieuKienToiThieu = createDto.DieuKienToiThieu,
                GiaTriToiThieu = createDto.GiaTriToiThieu,
                NgayBatDau = createDto.NgayBatDau,
                NgayKetThuc = createDto.NgayKetThuc,
                SoLuotDung = createDto.SoLuotDung,
                SoLuotDaDung = 0,
                TrangThai = createDto.TrangThai ?? "Active",
                IsDelete = false,
                IsActive = true,
                NgayTao = DateTime.Now,
                NgayCapNhat = DateTime.Now
            };

            _context.KhuyenMais.Add(khuyenMai);
            await _context.SaveChangesAsync(ct);

            return ApiResponse.Success("Tạo khuyến mãi thành công", khuyenMai.MaKhuyenMai);
        }
        catch (Exception ex)
        {
            return ApiResponse.Error($"Lỗi khi tạo khuyến mãi: {ex.Message}");
        }
    }

    // PUT: api/KhuyenMai/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateKhuyenMai(string id, [FromBody] UpdateKhuyenMaiDto updateDto, CancellationToken ct = default)
    {
        try
        {
            var khuyenMai = await _context.KhuyenMais
                .FirstOrDefaultAsync(k => k.MaKhuyenMai == id && k.IsDelete != true, ct);

            if (khuyenMai == null)
            {
                return ApiResponse.Error("Không tìm thấy khuyến mãi");
            }

            if (!string.IsNullOrEmpty(updateDto.Code) && updateDto.Code != khuyenMai.Code)
            {
                // Check if new code already exists
                var existingCode = await _context.KhuyenMais
                    .AnyAsync(k => k.Code == updateDto.Code && k.MaKhuyenMai != id && k.IsDelete != true, ct);
                if (existingCode)
                {
                    return ApiResponse.Error("Mã code khuyến mãi đã tồn tại");
                }
            }

            // Update properties
            if (!string.IsNullOrEmpty(updateDto.MaLoaiKhuyenMai))
                khuyenMai.MaLoaiKhuyenMai = updateDto.MaLoaiKhuyenMai;
            if (!string.IsNullOrEmpty(updateDto.TenKhuyenMai))
                khuyenMai.TenKhuyenMai = updateDto.TenKhuyenMai;
            if (!string.IsNullOrEmpty(updateDto.Code))
                khuyenMai.Code = updateDto.Code;
            if (!string.IsNullOrEmpty(updateDto.LoaiGiam))
                khuyenMai.LoaiGiam = updateDto.LoaiGiam;
            if (updateDto.GiaTriGiam.HasValue)
                khuyenMai.GiaTriGiam = updateDto.GiaTriGiam;
            if (updateDto.GiamToiDa.HasValue)
                khuyenMai.GiamToiDa = updateDto.GiamToiDa;
            if (updateDto.DieuKienToiThieu.HasValue)
                khuyenMai.DieuKienToiThieu = updateDto.DieuKienToiThieu;
            if (updateDto.GiaTriToiThieu.HasValue)
                khuyenMai.GiaTriToiThieu = updateDto.GiaTriToiThieu;
            if (updateDto.NgayBatDau.HasValue)
                khuyenMai.NgayBatDau = updateDto.NgayBatDau;
            if (updateDto.NgayKetThuc.HasValue)
                khuyenMai.NgayKetThuc = updateDto.NgayKetThuc;
            if (updateDto.SoLuotDung.HasValue)
                khuyenMai.SoLuotDung = updateDto.SoLuotDung;
            if (!string.IsNullOrEmpty(updateDto.TrangThai))
                khuyenMai.TrangThai = updateDto.TrangThai;

            khuyenMai.NgayCapNhat = DateTime.Now;

            await _context.SaveChangesAsync(ct);

            return ApiResponse.Success("Cập nhật khuyến mãi thành công");
        }
        catch (Exception ex)
        {
            return ApiResponse.Error($"Lỗi khi cập nhật khuyến mãi: {ex.Message}");
        }
    }

    // DELETE: api/KhuyenMai/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteKhuyenMai(string id, CancellationToken ct = default)
    {
        try
        {
            var khuyenMai = await _context.KhuyenMais
                .FirstOrDefaultAsync(k => k.MaKhuyenMai == id && k.IsDelete != true, ct);

            if (khuyenMai == null)
            {
                return ApiResponse.Error("Không tìm thấy khuyến mãi");
            }

            khuyenMai.IsDelete = true;
            khuyenMai.NgayCapNhat = DateTime.Now;

            await _context.SaveChangesAsync(ct);

            return ApiResponse.Success("Xóa khuyến mãi thành công");
        }
        catch (Exception ex)
        {
            return ApiResponse.Error($"Lỗi khi xóa khuyến mãi: {ex.Message}");
        }
    }

    // GET: api/KhuyenMai/validate-code/{code}
    [HttpGet("validate-code/{code}")]
    public async Task<IActionResult> ValidateCode(string code, CancellationToken ct = default)
    {
        try
        {
            var khuyenMai = await _context.KhuyenMais
                .Include(k => k.MaLoaiKhuyenMaiNavigation)
                .FirstOrDefaultAsync(k => k.Code == code && k.IsDelete != true && k.IsActive == true, ct);

            if (khuyenMai == null)
            {
                return ApiResponse.Error("Mã khuyến mãi không tồn tại hoặc đã bị vô hiệu hóa");
            }

            // Check if promotion is still valid
            var currentDate = DateOnly.FromDateTime(DateTime.Now);
            if (khuyenMai.NgayBatDau.HasValue && currentDate < khuyenMai.NgayBatDau)
            {
                return ApiResponse.Error("Khuyến mãi chưa bắt đầu");
            }

            if (khuyenMai.NgayKetThuc.HasValue && currentDate > khuyenMai.NgayKetThuc)
            {
                return ApiResponse.Error("Khuyến mãi đã kết thúc");
            }

            if (khuyenMai.SoLuotDung.HasValue && khuyenMai.SoLuotDaDung >= khuyenMai.SoLuotDung)
            {
                return ApiResponse.Error("Khuyến mãi đã hết lượt sử dụng");
            }

            var khuyenMaiDto = new KhuyenMaiDto
            {
                MaKhuyenMai = khuyenMai.MaKhuyenMai,
                MaLoaiKhuyenMai = khuyenMai.MaLoaiKhuyenMai,
                TenKhuyenMai = khuyenMai.TenKhuyenMai,
                Code = khuyenMai.Code,
                LoaiGiam = khuyenMai.LoaiGiam,
                GiaTriGiam = khuyenMai.GiaTriGiam,
                GiamToiDa = khuyenMai.GiamToiDa,
                DieuKienToiThieu = khuyenMai.DieuKienToiThieu,
                GiaTriToiThieu = khuyenMai.GiaTriToiThieu,
                NgayBatDau = khuyenMai.NgayBatDau,
                NgayKetThuc = khuyenMai.NgayKetThuc,
                SoLuotDung = khuyenMai.SoLuotDung,
                SoLuotDaDung = khuyenMai.SoLuotDaDung,
                TrangThai = khuyenMai.TrangThai,
                TenLoaiKhuyenMai = khuyenMai.MaLoaiKhuyenMaiNavigation?.TenLoai
            };

            return ApiResponse.Success("Mã khuyến mãi hợp lệ", khuyenMaiDto);
        }
        catch (Exception ex)
        {
            return ApiResponse.Error($"Lỗi khi kiểm tra mã khuyến mãi: {ex.Message}");
        }
    }
} 