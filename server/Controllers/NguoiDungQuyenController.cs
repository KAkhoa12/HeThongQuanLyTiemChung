using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.DTOs.Quyen;
using server.DTOs.Pagination;
using server.Helpers;
using server.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class NguoiDungQuyenController : ControllerBase
{
    private readonly HeThongQuanLyTiemChungContext _context;

    public NguoiDungQuyenController(HeThongQuanLyTiemChungContext context)
    {
        _context = context;
    }

    // GET: api/nguoidungquyen
    [HttpGet]
    public async Task<IActionResult> GetNguoiDungQuyens(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? maNguoiDung = null,
        [FromQuery] string? maQuyen = null,
        CancellationToken ct = default)
    {
        try
        {
            var query = _context.NguoiDungQuyens
                .Include(ndq => ndq.MaNguoiDungNavigation)
                .Include(ndq => ndq.MaQuyenNavigation)
                .Where(ndq => ndq.IsDelete != true)
                .AsQueryable();

            // Filter by nguoi dung
            if (!string.IsNullOrEmpty(maNguoiDung))
            {
                query = query.Where(ndq => ndq.MaNguoiDung == maNguoiDung);
            }

            // Filter by quyen
            if (!string.IsNullOrEmpty(maQuyen))
            {
                query = query.Where(ndq => ndq.MaQuyen == maQuyen);
            }

            var result = await query
                .OrderBy(ndq => ndq.MaNguoiDung)
                .ThenBy(ndq => ndq.MaQuyen)
                .ToPagedAsync(page, pageSize, ct);

            // Map to DTO
            var nguoiDungQuyenDtos = result.Data.Select(ndq => new NguoiDungQuyenDto
            {
                MaNguoiDung = ndq.MaNguoiDung,
                MaQuyen = ndq.MaQuyen,
                NgayTao = ndq.NgayTao,
                IsDelete = ndq.IsDelete,
                IsActive = ndq.IsActive,
                NgayCapNhat = ndq.NgayCapNhat,
                TenNguoiDung = ndq.MaNguoiDungNavigation?.Ten,
                Email = ndq.MaNguoiDungNavigation?.Email,
                TenQuyen = ndq.MaQuyenNavigation?.TenQuyen,
                Module = ndq.MaQuyenNavigation?.Module
            }).ToList();

            var pagedResult = new PagedResultDto<NguoiDungQuyenDto>(
                result.TotalCount,
                result.Page,
                result.PageSize,
                result.TotalPages,
                nguoiDungQuyenDtos
            );

            return ApiResponse.Success("Lấy danh sách quyền người dùng thành công", pagedResult);
        }
        catch (Exception ex)
        {
            return ApiResponse.Error($"Lỗi khi lấy danh sách quyền người dùng: {ex.Message}", 500);
        }
    }

    // GET: api/nguoidungquyen/nguoidung/{maNguoiDung}
    [HttpGet("nguoidung/{maNguoiDung}")]
    public async Task<IActionResult> GetQuyensByNguoiDung(string maNguoiDung, CancellationToken ct = default)
    {
        try
        {
            var nguoiDungQuyens = await _context.NguoiDungQuyens
                .Include(ndq => ndq.MaQuyenNavigation)
                .Where(ndq => ndq.MaNguoiDung == maNguoiDung && ndq.IsDelete != true && ndq.IsActive == true)
                .OrderBy(ndq => ndq.MaQuyenNavigation.TenQuyen)
                .ToListAsync(ct);

            var quyenDtos = nguoiDungQuyens.Select(ndq => new QuyenDto
            {
                MaQuyen = ndq.MaQuyen,
                TenQuyen = ndq.MaQuyenNavigation.TenQuyen,
                MoTa = ndq.MaQuyenNavigation.MoTa,
                Module = ndq.MaQuyenNavigation.Module,
                IsDelete = ndq.MaQuyenNavigation.IsDelete,
                IsActive = ndq.MaQuyenNavigation.IsActive,
                NgayTao = ndq.MaQuyenNavigation.NgayTao,
                NgayCapNhat = ndq.MaQuyenNavigation.NgayCapNhat
            }).ToList();

            return ApiResponse.Success("Lấy danh sách quyền của người dùng thành công", quyenDtos);
        }
        catch (Exception ex)
        {
            return ApiResponse.Error($"Lỗi khi lấy danh sách quyền của người dùng: {ex.Message}", 500);
        }
    }

    // GET: api/nguoidungquyen/nguoidung/{maNguoiDung}/all
    [HttpGet("nguoidung/{maNguoiDung}/all")]
    public async Task<IActionResult> GetAllQuyensByNguoiDung(string maNguoiDung, CancellationToken ct = default)
    {
        try
        {
            // Get all quyens
            var allQuyens = await _context.Quyens
                .Where(q => q.IsDelete != true && q.IsActive == true)
                .OrderBy(q => q.TenQuyen)
                .ToListAsync(ct);

            // Get nguoi dung quyens
            var nguoiDungQuyens = await _context.NguoiDungQuyens
                .Where(ndq => ndq.MaNguoiDung == maNguoiDung && ndq.IsDelete != true && ndq.IsActive == true)
                .Select(ndq => ndq.MaQuyen)
                .ToListAsync(ct);

            // Get vai tro quyens
            var nguoiDung = await _context.NguoiDungs
                .Where(nd => nd.MaNguoiDung == maNguoiDung && nd.IsDelete != true)
                .FirstOrDefaultAsync(ct);

            var vaiTroQuyens = new List<string>();
            if (nguoiDung != null && !string.IsNullOrEmpty(nguoiDung.MaVaiTro))
            {
                vaiTroQuyens = await _context.VaiTroQuyens
                    .Where(vtq => vtq.MaVaiTro == nguoiDung.MaVaiTro && vtq.IsDelete != true && vtq.IsActive == true)
                    .Select(vtq => vtq.MaQuyen)
                    .ToListAsync(ct);
            }

            // Combine all quyens with status
            var quyenNguoiDungDtos = allQuyens.Select(q => new QuyenNguoiDungDto
            {
                MaQuyen = q.MaQuyen,
                TenQuyen = q.TenQuyen,
                MoTa = q.MoTa,
                Module = q.Module,
                IsDelete = q.IsDelete,
                IsActive = q.IsActive,
                NgayTao = q.NgayTao,
                NgayCapNhat = q.NgayCapNhat,
                CoQuyen = nguoiDungQuyens.Contains(q.MaQuyen) || vaiTroQuyens.Contains(q.MaQuyen)
            }).ToList();

            return ApiResponse.Success("Lấy danh sách tất cả quyền của người dùng thành công", quyenNguoiDungDtos);
        }
        catch (Exception ex)
        {
            return ApiResponse.Error($"Lỗi khi lấy danh sách tất cả quyền của người dùng: {ex.Message}", 500);
        }
    }

    // POST: api/nguoidungquyen
    [HttpPost]
    public async Task<IActionResult> CreateNguoiDungQuyen([FromBody] NguoiDungQuyenCreateRequest request, CancellationToken ct = default)
    {
        try
        {
            if (string.IsNullOrEmpty(request.MaNguoiDung))
            {
                return ApiResponse.Error("Mã người dùng không được để trống", 400);
            }

            if (string.IsNullOrEmpty(request.MaQuyen))
            {
                return ApiResponse.Error("Mã quyền không được để trống", 400);
            }

            // Check if nguoi dung exists
            var nguoiDung = await _context.NguoiDungs
                .Where(nd => nd.MaNguoiDung == request.MaNguoiDung && nd.IsDelete != true)
                .FirstOrDefaultAsync(ct);

            if (nguoiDung == null)
            {
                return ApiResponse.Error("Người dùng không tồn tại", 404);
            }

            // Check if quyen exists
            var quyen = await _context.Quyens
                .Where(q => q.MaQuyen == request.MaQuyen && q.IsDelete != true)
                .FirstOrDefaultAsync(ct);

            if (quyen == null)
            {
                return ApiResponse.Error("Quyền không tồn tại", 404);
            }

            // Check if nguoi dung quyen already exists
            var existingNguoiDungQuyen = await _context.NguoiDungQuyens
                .Where(ndq => ndq.MaNguoiDung == request.MaNguoiDung && ndq.MaQuyen == request.MaQuyen && ndq.IsDelete != true)
                .FirstOrDefaultAsync(ct);

            if (existingNguoiDungQuyen != null)
            {
                return ApiResponse.Error("Quyền người dùng đã tồn tại", 400);
            }

            var nguoiDungQuyen = new NguoiDungQuyen
            {
                MaNguoiDung = request.MaNguoiDung,
                MaQuyen = request.MaQuyen,
                NgayTao = DateTime.Now,
                IsDelete = false,
                IsActive = true
            };

            _context.NguoiDungQuyens.Add(nguoiDungQuyen);
            await _context.SaveChangesAsync(ct);

            var nguoiDungQuyenDto = new NguoiDungQuyenDto
            {
                MaNguoiDung = nguoiDungQuyen.MaNguoiDung,
                MaQuyen = nguoiDungQuyen.MaQuyen,
                NgayTao = nguoiDungQuyen.NgayTao,
                IsDelete = nguoiDungQuyen.IsDelete,
                IsActive = nguoiDungQuyen.IsActive,
                NgayCapNhat = nguoiDungQuyen.NgayCapNhat,
                TenNguoiDung = nguoiDung.Ten,
                Email = nguoiDung.Email,
                TenQuyen = quyen.TenQuyen,
                Module = quyen.Module
            };

            return ApiResponse.Success("Tạo quyền người dùng thành công", nguoiDungQuyenDto);
        }
        catch (Exception ex)
        {
            return ApiResponse.Error($"Lỗi khi tạo quyền người dùng: {ex.Message}", 500);
        }
    }

    // POST: api/nguoidungquyen/phanquyen
    [HttpPost("phanquyen")]
    public async Task<IActionResult> PhanQuyenNguoiDung([FromBody] PhanQuyenNguoiDungRequest request, CancellationToken ct = default)
    {
        try
        {
            if (string.IsNullOrEmpty(request.MaNguoiDung))
            {
                return ApiResponse.Error("Mã người dùng không được để trống", 400);
            }

            // Check if nguoi dung exists
            var nguoiDung = await _context.NguoiDungs
                .Where(nd => nd.MaNguoiDung == request.MaNguoiDung && nd.IsDelete != true)
                .FirstOrDefaultAsync(ct);

            if (nguoiDung == null)
            {
                return ApiResponse.Error("Người dùng không tồn tại", 404);
            }

            // Check if all quyens exist
            var quyens = await _context.Quyens
                .Where(q => request.DanhSachMaQuyen.Contains(q.MaQuyen) && q.IsDelete != true)
                .ToListAsync(ct);

            if (quyens.Count != request.DanhSachMaQuyen.Count)
            {
                return ApiResponse.Error("Một số quyền không tồn tại", 400);
            }

            // Remove existing nguoi dung quyens
            var existingNguoiDungQuyens = await _context.NguoiDungQuyens
                .Where(ndq => ndq.MaNguoiDung == request.MaNguoiDung && ndq.IsDelete != true)
                .ToListAsync(ct);

            foreach (var existingNguoiDungQuyen in existingNguoiDungQuyens)
            {
                existingNguoiDungQuyen.IsDelete = true;
                existingNguoiDungQuyen.NgayCapNhat = DateTime.Now;
            }

            // Add new nguoi dung quyens
            var newNguoiDungQuyens = request.DanhSachMaQuyen.Select(maQuyen => new NguoiDungQuyen
            {
                MaNguoiDung = request.MaNguoiDung,
                MaQuyen = maQuyen,
                NgayTao = DateTime.Now,
                IsDelete = false,
                IsActive = true
            }).ToList();

            _context.NguoiDungQuyens.AddRange(newNguoiDungQuyens);
            await _context.SaveChangesAsync(ct);

            return ApiResponse.Success("Phân quyền người dùng thành công", null);
        }
        catch (Exception ex)
        {
            return ApiResponse.Error($"Lỗi khi phân quyền người dùng: {ex.Message}", 500);
        }
    }

    // PUT: api/nguoidungquyen/{maNguoiDung}/{maQuyen}
    [HttpPut("{maNguoiDung}/{maQuyen}")]
    public async Task<IActionResult> UpdateNguoiDungQuyen(string maNguoiDung, string maQuyen, [FromBody] NguoiDungQuyenUpdateRequest request, CancellationToken ct = default)
    {
        try
        {
            var nguoiDungQuyen = await _context.NguoiDungQuyens
                .Where(ndq => ndq.MaNguoiDung == maNguoiDung && ndq.MaQuyen == maQuyen && ndq.IsDelete != true)
                .FirstOrDefaultAsync(ct);

            if (nguoiDungQuyen == null)
            {
                return ApiResponse.Error("Không tìm thấy quyền người dùng", 404);
            }

            nguoiDungQuyen.IsActive = request.IsActive ?? nguoiDungQuyen.IsActive;
            nguoiDungQuyen.NgayCapNhat = DateTime.Now;

            await _context.SaveChangesAsync(ct);

            var nguoiDungQuyenDto = new NguoiDungQuyenDto
            {
                MaNguoiDung = nguoiDungQuyen.MaNguoiDung,
                MaQuyen = nguoiDungQuyen.MaQuyen,
                NgayTao = nguoiDungQuyen.NgayTao,
                IsDelete = nguoiDungQuyen.IsDelete,
                IsActive = nguoiDungQuyen.IsActive,
                NgayCapNhat = nguoiDungQuyen.NgayCapNhat
            };

            return ApiResponse.Success("Cập nhật quyền người dùng thành công", nguoiDungQuyenDto);
        }
        catch (Exception ex)
        {
            return ApiResponse.Error($"Lỗi khi cập nhật quyền người dùng: {ex.Message}", 500);
        }
    }

    // DELETE: api/nguoidungquyen/{maNguoiDung}/{maQuyen}
    [HttpDelete("{maNguoiDung}/{maQuyen}")]
    public async Task<IActionResult> DeleteNguoiDungQuyen(string maNguoiDung, string maQuyen, CancellationToken ct = default)
    {
        try
        {
            var nguoiDungQuyen = await _context.NguoiDungQuyens
                .Where(ndq => ndq.MaNguoiDung == maNguoiDung && ndq.MaQuyen == maQuyen && ndq.IsDelete != true)
                .FirstOrDefaultAsync(ct);

            if (nguoiDungQuyen == null)
            {
                return ApiResponse.Error("Không tìm thấy quyền người dùng", 404);
            }

            nguoiDungQuyen.IsDelete = true;
            nguoiDungQuyen.NgayCapNhat = DateTime.Now;

            await _context.SaveChangesAsync(ct);

            return ApiResponse.Success("Xóa quyền người dùng thành công", null);
        }
        catch (Exception ex)
        {
            return ApiResponse.Error($"Lỗi khi xóa quyền người dùng: {ex.Message}", 500);
        }
    }

    // GET: api/nguoidungquyen/check/{maNguoiDung}/{maQuyen}
    [HttpGet("check/{maNguoiDung}/{maQuyen}")]
    public async Task<IActionResult> CheckNguoiDungQuyen(string maNguoiDung, string maQuyen, CancellationToken ct = default)
    {
        try
        {
            // Check direct quyen
            var hasDirectQuyen = await _context.NguoiDungQuyens
                .Where(ndq => ndq.MaNguoiDung == maNguoiDung && ndq.MaQuyen == maQuyen && ndq.IsDelete != true && ndq.IsActive == true)
                .AnyAsync(ct);

            if (hasDirectQuyen)
            {
                return ApiResponse.Success("Kiểm tra quyền thành công", new { hasQuyen = true, source = "direct" });
            }

            // Check vai tro quyen
            var nguoiDung = await _context.NguoiDungs
                .Where(nd => nd.MaNguoiDung == maNguoiDung && nd.IsDelete != true)
                .FirstOrDefaultAsync(ct);

            if (nguoiDung != null && !string.IsNullOrEmpty(nguoiDung.MaVaiTro))
            {
                var hasVaiTroQuyen = await _context.VaiTroQuyens
                    .Where(vtq => vtq.MaVaiTro == nguoiDung.MaVaiTro && vtq.MaQuyen == maQuyen && vtq.IsDelete != true && vtq.IsActive == true)
                    .AnyAsync(ct);

                if (hasVaiTroQuyen)
                {
                    return ApiResponse.Success("Kiểm tra quyền thành công", new { hasQuyen = true, source = "vaiTro" });
                }
            }

            return ApiResponse.Success("Kiểm tra quyền thành công", new { hasQuyen = false, source = "none" });
        }
        catch (Exception ex)
        {
            return ApiResponse.Error($"Lỗi khi kiểm tra quyền: {ex.Message}", 500);
        }
    }
} 