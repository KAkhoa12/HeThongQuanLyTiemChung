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
public class VaiTroQuyenController : ControllerBase
{
    private readonly HeThongQuanLyTiemChungContext _context;

    public VaiTroQuyenController(HeThongQuanLyTiemChungContext context)
    {
        _context = context;
    }

    // GET: api/vaitroquyen
    [HttpGet]
    public async Task<IActionResult> GetVaiTroQuyens(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? maVaiTro = null,
        [FromQuery] string? maQuyen = null,
        CancellationToken ct = default)
    {
        try
        {
            var query = _context.VaiTroQuyens
                .Include(vtq => vtq.MaQuyenNavigation)
                .Where(vtq => vtq.IsDelete != true)
                .AsQueryable();

            // Filter by vai tro
            if (!string.IsNullOrEmpty(maVaiTro))
            {
                query = query.Where(vtq => vtq.MaVaiTro == maVaiTro);
            }

            // Filter by quyen
            if (!string.IsNullOrEmpty(maQuyen))
            {
                query = query.Where(vtq => vtq.MaQuyen == maQuyen);
            }

            var result = await query
                .OrderBy(vtq => vtq.MaVaiTro)
                .ThenBy(vtq => vtq.MaQuyen)
                .ToPagedAsync(page, pageSize, ct);

            // Map to DTO
            var vaiTroQuyenDtos = result.Data.Select(vtq => new VaiTroQuyenDto
            {
                MaVaiTro = vtq.MaVaiTro,
                MaQuyen = vtq.MaQuyen,
                NgayTao = vtq.NgayTao,
                IsDelete = vtq.IsDelete,
                IsActive = vtq.IsActive,
                NgayCapNhat = vtq.NgayCapNhat,
                TenQuyen = vtq.MaQuyenNavigation?.TenQuyen,
                Module = vtq.MaQuyenNavigation?.Module
            }).ToList();

            var pagedResult = new PagedResultDto<VaiTroQuyenDto>(
                result.TotalCount,
                result.Page,
                result.PageSize,
                result.TotalPages,
                vaiTroQuyenDtos
            );

            return ApiResponse.Success("Lấy danh sách phân quyền thành công", pagedResult);
        }
        catch (Exception ex)
        {
            return ApiResponse.Error($"Lỗi khi lấy danh sách phân quyền: {ex.Message}", 500);
        }
    }

    // GET: api/vaitroquyen/vaitro/{maVaiTro}
    [HttpGet("vaitro/{maVaiTro}")]
    public async Task<IActionResult> GetQuyensByVaiTro(string maVaiTro, CancellationToken ct = default)
    {
        try
        {
            var vaiTroQuyens = await _context.VaiTroQuyens
                .Include(vtq => vtq.MaQuyenNavigation)
                .Where(vtq => vtq.MaVaiTro == maVaiTro && vtq.IsDelete != true && vtq.IsActive == true)
                .OrderBy(vtq => vtq.MaQuyenNavigation.TenQuyen)
                .ToListAsync(ct);

            var quyenDtos = vaiTroQuyens.Select(vtq => new QuyenDto
            {
                MaQuyen = vtq.MaQuyen,
                TenQuyen = vtq.MaQuyenNavigation.TenQuyen,
                MoTa = vtq.MaQuyenNavigation.MoTa,
                Module = vtq.MaQuyenNavigation.Module,
                IsDelete = vtq.MaQuyenNavigation.IsDelete,
                IsActive = vtq.MaQuyenNavigation.IsActive,
                NgayTao = vtq.MaQuyenNavigation.NgayTao,
                NgayCapNhat = vtq.MaQuyenNavigation.NgayCapNhat
            }).ToList();

            return ApiResponse.Success("Lấy danh sách quyền của vai trò thành công", quyenDtos);
        }
        catch (Exception ex)
        {
            return ApiResponse.Error($"Lỗi khi lấy danh sách quyền của vai trò: {ex.Message}", 500);
        }
    }

    // POST: api/vaitroquyen
    [HttpPost]
    public async Task<IActionResult> CreateVaiTroQuyen([FromBody] VaiTroQuyenCreateRequest request, CancellationToken ct = default)
    {
        try
        {
            if (string.IsNullOrEmpty(request.MaVaiTro))
            {
                return ApiResponse.Error("Mã vai trò không được để trống", 400);
            }

            if (string.IsNullOrEmpty(request.MaQuyen))
            {
                return ApiResponse.Error("Mã quyền không được để trống", 400);
            }

            // Check if vai tro exists
            var vaiTro = await _context.VaiTros
                .Where(vt => vt.MaVaiTro == request.MaVaiTro && vt.IsDelete != true)
                .FirstOrDefaultAsync(ct);

            if (vaiTro == null)
            {
                return ApiResponse.Error("Vai trò không tồn tại", 404);
            }

            // Check if quyen exists
            var quyen = await _context.Quyens
                .Where(q => q.MaQuyen == request.MaQuyen && q.IsDelete != true)
                .FirstOrDefaultAsync(ct);

            if (quyen == null)
            {
                return ApiResponse.Error("Quyền không tồn tại", 404);
            }

            // Check if vai tro quyen already exists
            var existingVaiTroQuyen = await _context.VaiTroQuyens
                .Where(vtq => vtq.MaVaiTro == request.MaVaiTro && vtq.MaQuyen == request.MaQuyen && vtq.IsDelete != true)
                .FirstOrDefaultAsync(ct);

            if (existingVaiTroQuyen != null)
            {
                return ApiResponse.Error("Phân quyền đã tồn tại", 400);
            }

            var vaiTroQuyen = new VaiTroQuyen
            {
                MaVaiTro = request.MaVaiTro,
                MaQuyen = request.MaQuyen,
                NgayTao = DateTime.Now,
                IsDelete = false,
                IsActive = true
            };

            _context.VaiTroQuyens.Add(vaiTroQuyen);
            await _context.SaveChangesAsync(ct);

            var vaiTroQuyenDto = new VaiTroQuyenDto
            {
                MaVaiTro = vaiTroQuyen.MaVaiTro,
                MaQuyen = vaiTroQuyen.MaQuyen,
                NgayTao = vaiTroQuyen.NgayTao,
                IsDelete = vaiTroQuyen.IsDelete,
                IsActive = vaiTroQuyen.IsActive,
                NgayCapNhat = vaiTroQuyen.NgayCapNhat,
                TenQuyen = quyen.TenQuyen,
                Module = quyen.Module
            };

            return ApiResponse.Success("Tạo phân quyền thành công", vaiTroQuyenDto);
        }
        catch (Exception ex)
        {
            return ApiResponse.Error($"Lỗi khi tạo phân quyền: {ex.Message}", 500);
        }
    }

    // POST: api/vaitroquyen/phanquyen
    [HttpPost("phanquyen")]
    public async Task<IActionResult> PhanQuyen([FromBody] PhanQuyenRequest request, CancellationToken ct = default)
    {
        try
        {
            if (string.IsNullOrEmpty(request.MaVaiTro))
            {
                return ApiResponse.Error("Mã vai trò không được để trống", 400);
            }

            // Check if vai tro exists
            var vaiTro = await _context.VaiTros
                .Where(vt => vt.MaVaiTro == request.MaVaiTro && vt.IsDelete != true)
                .FirstOrDefaultAsync(ct);

            if (vaiTro == null)
            {
                return ApiResponse.Error("Vai trò không tồn tại", 404);
            }

            // Check if all quyens exist
            var quyens = await _context.Quyens
                .Where(q => request.DanhSachMaQuyen.Contains(q.MaQuyen) && q.IsDelete != true)
                .ToListAsync(ct);

            if (quyens.Count != request.DanhSachMaQuyen.Count)
            {
                return ApiResponse.Error("Một số quyền không tồn tại", 400);
            }

            // Remove existing vai tro quyens
            var existingVaiTroQuyens = await _context.VaiTroQuyens
                .Where(vtq => vtq.MaVaiTro == request.MaVaiTro && vtq.IsDelete != true)
                .ToListAsync(ct);

            foreach (var existingVaiTroQuyen in existingVaiTroQuyens)
            {
                existingVaiTroQuyen.IsDelete = true;
                existingVaiTroQuyen.NgayCapNhat = DateTime.Now;
            }

            // Add new vai tro quyens
            var newVaiTroQuyens = request.DanhSachMaQuyen.Select(maQuyen => new VaiTroQuyen
            {
                MaVaiTro = request.MaVaiTro,
                MaQuyen = maQuyen,
                NgayTao = DateTime.Now,
                IsDelete = false,
                IsActive = true
            }).ToList();

            _context.VaiTroQuyens.AddRange(newVaiTroQuyens);
            await _context.SaveChangesAsync(ct);

            return ApiResponse.Success("Phân quyền thành công", null);
        }
        catch (Exception ex)
        {
            return ApiResponse.Error($"Lỗi khi phân quyền: {ex.Message}", 500);
        }
    }

    // PUT: api/vaitroquyen/{maVaiTro}/{maQuyen}
    [HttpPut("{maVaiTro}/{maQuyen}")]
    public async Task<IActionResult> UpdateVaiTroQuyen(string maVaiTro, string maQuyen, [FromBody] VaiTroQuyenUpdateRequest request, CancellationToken ct = default)
    {
        try
        {
            var vaiTroQuyen = await _context.VaiTroQuyens
                .Where(vtq => vtq.MaVaiTro == maVaiTro && vtq.MaQuyen == maQuyen && vtq.IsDelete != true)
                .FirstOrDefaultAsync(ct);

            if (vaiTroQuyen == null)
            {
                return ApiResponse.Error("Không tìm thấy phân quyền", 404);
            }

            vaiTroQuyen.IsActive = request.IsActive ?? vaiTroQuyen.IsActive;
            vaiTroQuyen.NgayCapNhat = DateTime.Now;

            await _context.SaveChangesAsync(ct);

            var vaiTroQuyenDto = new VaiTroQuyenDto
            {
                MaVaiTro = vaiTroQuyen.MaVaiTro,
                MaQuyen = vaiTroQuyen.MaQuyen,
                NgayTao = vaiTroQuyen.NgayTao,
                IsDelete = vaiTroQuyen.IsDelete,
                IsActive = vaiTroQuyen.IsActive,
                NgayCapNhat = vaiTroQuyen.NgayCapNhat
            };

            return ApiResponse.Success("Cập nhật phân quyền thành công", vaiTroQuyenDto);
        }
        catch (Exception ex)
        {
            return ApiResponse.Error($"Lỗi khi cập nhật phân quyền: {ex.Message}", 500);
        }
    }

    // DELETE: api/vaitroquyen/{maVaiTro}/{maQuyen}
    [HttpDelete("{maVaiTro}/{maQuyen}")]
    public async Task<IActionResult> DeleteVaiTroQuyen(string maVaiTro, string maQuyen, CancellationToken ct = default)
    {
        try
        {
            var vaiTroQuyen = await _context.VaiTroQuyens
                .Where(vtq => vtq.MaVaiTro == maVaiTro && vtq.MaQuyen == maQuyen)
                .FirstOrDefaultAsync(ct);

            if (vaiTroQuyen == null)
            {
                return ApiResponse.Error("Không tìm thấy phân quyền", 404);
            }

            _context.VaiTroQuyens.Remove(vaiTroQuyen);
            await _context.SaveChangesAsync(ct);

            return ApiResponse.Success("Xóa phân quyền thành công", null);
        }
        catch (Exception ex)
        {
            return ApiResponse.Error($"Lỗi khi xóa phân quyền: {ex.Message}", 500);
        }
    }

    // GET: api/vaitroquyen/check/{maVaiTro}/{maQuyen}
    [HttpGet("check/{maVaiTro}/{maQuyen}")]
    public async Task<IActionResult> CheckVaiTroQuyen(string maVaiTro, string maQuyen, CancellationToken ct = default)
    {
        try
        {
            var hasQuyen = await _context.VaiTroQuyens
                .Where(vtq => vtq.MaVaiTro == maVaiTro && vtq.MaQuyen == maQuyen && vtq.IsDelete != true && vtq.IsActive == true)
                .AnyAsync(ct);

            return ApiResponse.Success("Kiểm tra quyền thành công", new { hasQuyen });
        }
        catch (Exception ex)
        {
            return ApiResponse.Error($"Lỗi khi kiểm tra quyền: {ex.Message}", 500);
        }
    }
} 