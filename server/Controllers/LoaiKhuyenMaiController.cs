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
public class LoaiKhuyenMaiController : ControllerBase
{
    private readonly HeThongQuanLyTiemChungContext _context;

    public LoaiKhuyenMaiController(HeThongQuanLyTiemChungContext context)
    {
        _context = context;
    }

    // GET: api/LoaiKhuyenMai
    [HttpGet]
    public async Task<IActionResult> GetLoaiKhuyenMais(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? searchTerm = null,
        CancellationToken ct = default)
    {
        try
        {
            var query = _context.LoaiKhuyenMais
                .Where(l => l.IsDelete != true)
                .AsQueryable();

            // Apply search filter
            if (!string.IsNullOrEmpty(searchTerm))
            {
                query = query.Where(l => 
                    l.TenLoai!.Contains(searchTerm) || 
                    l.MoTa!.Contains(searchTerm));
            }

            // Apply pagination
            var result = await query.ToPagedAsync(page, pageSize, ct);

            // Map to DTO
            var loaiKhuyenMaiDtos = result.Data.Select(l => new LoaiKhuyenMaiDto
            {
                MaLoaiKhuyenMai = l.MaLoaiKhuyenMai,
                TenLoai = l.TenLoai,
                MoTa = l.MoTa,
                IsDelete = l.IsDelete,
                IsActive = l.IsActive,
                NgayTao = l.NgayTao,
                NgayCapNhat = l.NgayCapNhat
            }).ToList();

            var pagedResult = new PagedResultDto<LoaiKhuyenMaiDto>(
                result.TotalCount,
                result.Page,
                result.PageSize,
                result.TotalPages,
                loaiKhuyenMaiDtos
            );

            return ApiResponse.Success("Lấy danh sách loại khuyến mãi thành công", pagedResult);
        }
        catch (Exception ex)
        {
            return ApiResponse.Error($"Lỗi khi lấy danh sách loại khuyến mãi: {ex.Message}");
        }
    }

    // GET: api/LoaiKhuyenMai/all
    [HttpGet("all")]
    public async Task<IActionResult> GetAllLoaiKhuyenMais(CancellationToken ct = default)
    {
        try
        {
            var loaiKhuyenMais = await _context.LoaiKhuyenMais
                .Where(l => l.IsDelete != true && l.IsActive == true)
                .Select(l => new LoaiKhuyenMaiDto
                {
                    MaLoaiKhuyenMai = l.MaLoaiKhuyenMai,
                    TenLoai = l.TenLoai,
                    MoTa = l.MoTa,
                    IsDelete = l.IsDelete,
                    IsActive = l.IsActive,
                    NgayTao = l.NgayTao,
                    NgayCapNhat = l.NgayCapNhat
                })
                .ToListAsync(ct);

            return ApiResponse.Success("Lấy danh sách loại khuyến mãi thành công", loaiKhuyenMais);
        }
        catch (Exception ex)
        {
            return ApiResponse.Error($"Lỗi khi lấy danh sách loại khuyến mãi: {ex.Message}");
        }
    }

    // GET: api/LoaiKhuyenMai/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> GetLoaiKhuyenMai(string id, CancellationToken ct = default)
    {
        try
        {
            var loaiKhuyenMai = await _context.LoaiKhuyenMais
                .FirstOrDefaultAsync(l => l.MaLoaiKhuyenMai == id && l.IsDelete != true, ct);

            if (loaiKhuyenMai == null)
            {
                return ApiResponse.Error("Không tìm thấy loại khuyến mãi");
            }

            var loaiKhuyenMaiDto = new LoaiKhuyenMaiDto
            {
                MaLoaiKhuyenMai = loaiKhuyenMai.MaLoaiKhuyenMai,
                TenLoai = loaiKhuyenMai.TenLoai,
                MoTa = loaiKhuyenMai.MoTa,
                IsDelete = loaiKhuyenMai.IsDelete,
                IsActive = loaiKhuyenMai.IsActive,
                NgayTao = loaiKhuyenMai.NgayTao,
                NgayCapNhat = loaiKhuyenMai.NgayCapNhat
            };

            return ApiResponse.Success("Lấy thông tin loại khuyến mãi thành công", loaiKhuyenMaiDto);
        }
        catch (Exception ex)
        {
            return ApiResponse.Error($"Lỗi khi lấy thông tin loại khuyến mãi: {ex.Message}");
        }
    }

    // POST: api/LoaiKhuyenMai
    [HttpPost]
    public async Task<IActionResult> CreateLoaiKhuyenMai([FromBody] CreateLoaiKhuyenMaiDto createDto, CancellationToken ct = default)
    {
        try
        {
            if (string.IsNullOrEmpty(createDto.TenLoai))
            {
                return ApiResponse.Error("Tên loại khuyến mãi không được để trống");
            }

            // Check if name already exists
            var existingName = await _context.LoaiKhuyenMais
                .AnyAsync(l => l.TenLoai == createDto.TenLoai && l.IsDelete != true, ct);
            if (existingName)
            {
                return ApiResponse.Error("Tên loại khuyến mãi đã tồn tại");
            }

            var loaiKhuyenMai = new LoaiKhuyenMai
            {
                MaLoaiKhuyenMai = Guid.NewGuid().ToString(),
                TenLoai = createDto.TenLoai,
                MoTa = createDto.MoTa,
                IsDelete = false,
                IsActive = true,
                NgayTao = DateTime.Now,
                NgayCapNhat = DateTime.Now
            };

            _context.LoaiKhuyenMais.Add(loaiKhuyenMai);
            await _context.SaveChangesAsync(ct);

            return ApiResponse.Success("Tạo loại khuyến mãi thành công", loaiKhuyenMai.MaLoaiKhuyenMai);
        }
        catch (Exception ex)
        {
            return ApiResponse.Error($"Lỗi khi tạo loại khuyến mãi: {ex.Message}");
        }
    }

    // PUT: api/LoaiKhuyenMai/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateLoaiKhuyenMai(string id, [FromBody] UpdateLoaiKhuyenMaiDto updateDto, CancellationToken ct = default)
    {
        try
        {
            var loaiKhuyenMai = await _context.LoaiKhuyenMais
                .FirstOrDefaultAsync(l => l.MaLoaiKhuyenMai == id && l.IsDelete != true, ct);

            if (loaiKhuyenMai == null)
            {
                return ApiResponse.Error("Không tìm thấy loại khuyến mãi");
            }

            if (!string.IsNullOrEmpty(updateDto.TenLoai) && updateDto.TenLoai != loaiKhuyenMai.TenLoai)
            {
                // Check if new name already exists
                var existingName = await _context.LoaiKhuyenMais
                    .AnyAsync(l => l.TenLoai == updateDto.TenLoai && l.MaLoaiKhuyenMai != id && l.IsDelete != true, ct);
                if (existingName)
                {
                    return ApiResponse.Error("Tên loại khuyến mãi đã tồn tại");
                }
            }

            // Update properties
            if (!string.IsNullOrEmpty(updateDto.TenLoai))
                loaiKhuyenMai.TenLoai = updateDto.TenLoai;
            if (!string.IsNullOrEmpty(updateDto.MoTa))
                loaiKhuyenMai.MoTa = updateDto.MoTa;

            loaiKhuyenMai.NgayCapNhat = DateTime.Now;

            await _context.SaveChangesAsync(ct);

            return ApiResponse.Success("Cập nhật loại khuyến mãi thành công");
        }
        catch (Exception ex)
        {
            return ApiResponse.Error($"Lỗi khi cập nhật loại khuyến mãi: {ex.Message}");
        }
    }

    // DELETE: api/LoaiKhuyenMai/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteLoaiKhuyenMai(string id, CancellationToken ct = default)
    {
        try
        {
            var loaiKhuyenMai = await _context.LoaiKhuyenMais
                .FirstOrDefaultAsync(l => l.MaLoaiKhuyenMai == id && l.IsDelete != true, ct);

            if (loaiKhuyenMai == null)
            {
                return ApiResponse.Error("Không tìm thấy loại khuyến mãi");
            }

            // Check if this type is being used by any promotions
            var hasPromotions = await _context.KhuyenMais
                .AnyAsync(k => k.MaLoaiKhuyenMai == id && k.IsDelete != true, ct);
            if (hasPromotions)
            {
                return ApiResponse.Error("Không thể xóa loại khuyến mãi đang được sử dụng");
            }

            loaiKhuyenMai.IsDelete = true;
            loaiKhuyenMai.NgayCapNhat = DateTime.Now;

            await _context.SaveChangesAsync(ct);

            return ApiResponse.Success("Xóa loại khuyến mãi thành công");
        }
        catch (Exception ex)
        {
            return ApiResponse.Error($"Lỗi khi xóa loại khuyến mãi: {ex.Message}");
        }
    }

    // GET: api/LoaiKhuyenMai/{id}/khuyen-mai
    [HttpGet("{id}/khuyen-mai")]
    public async Task<IActionResult> GetKhuyenMaisByLoai(
        string id,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        CancellationToken ct = default)
    {
        try
        {
            var query = _context.KhuyenMais
                .Where(k => k.MaLoaiKhuyenMai == id && k.IsDelete != true)
                .AsQueryable();

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
                NgayCapNhat = k.NgayCapNhat
            }).ToList();

            var pagedResult = new PagedResultDto<KhuyenMaiDto>(
                result.TotalCount,
                result.Page,
                result.PageSize,
                result.TotalPages,
                khuyenMaiDtos
            );

            return ApiResponse.Success("Lấy danh sách khuyến mãi theo loại thành công", pagedResult);
        }
        catch (Exception ex)
        {
            return ApiResponse.Error($"Lỗi khi lấy danh sách khuyến mãi theo loại: {ex.Message}");
        }
    }
} 