using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.DTOs.VaiTro;
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
public class VaiTroController : ControllerBase
{
    private readonly HeThongQuanLyTiemChungContext _context;

    public VaiTroController(HeThongQuanLyTiemChungContext context)
    {
        _context = context;
    }

    // GET: api/vaitro
    [HttpGet]
    public async Task<IActionResult> GetVaiTros(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? search = null,
        CancellationToken ct = default)
    {
        try
        {
            var query = _context.VaiTros
                .Where(vt => vt.IsDelete != true)
                .AsQueryable();

            // Apply search filter
            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(vt => 
                    vt.TenVaiTro.Contains(search) || 
                    vt.MoTa.Contains(search));
            }

            // Apply pagination
            var result = await query
                .OrderBy(vt => vt.TenVaiTro)
                .ToPagedAsync(page, pageSize, ct);

            // Map to DTOs
            var vaiTroDtos = result.Data.Select(vt => new VaiTroDto
            {
                MaVaiTro = vt.MaVaiTro,
                TenVaiTro = vt.TenVaiTro,
                MoTa = vt.MoTa,
                IsDelete = vt.IsDelete,
                IsActive = vt.IsActive,
                NgayTao = vt.NgayTao,
                NgayCapNhat = vt.NgayCapNhat
            }).ToList();

            var pagedResult = new PagedResultDto<VaiTroDto>(
                result.TotalCount,
                result.Page,
                result.PageSize,
                result.TotalPages,
                vaiTroDtos
            );

            return ApiResponse.Success("Lấy danh sách vai trò thành công", pagedResult);
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse.Error($"Lỗi server: {ex.Message}", 500));
        }
    }

    // GET: api/vaitro/{maVaiTro}
    [HttpGet("{maVaiTro}")]
    public async Task<IActionResult> GetVaiTro(string maVaiTro, CancellationToken ct = default)
    {
        try
        {
            var vaiTro = await _context.VaiTros
                .Where(vt => vt.MaVaiTro == maVaiTro && vt.IsDelete != true)
                .FirstOrDefaultAsync(ct);

            if (vaiTro == null)
            {
                return NotFound(ApiResponse.Error("Không tìm thấy vai trò", 404));
            }

            var vaiTroDto = new VaiTroDto
            {
                MaVaiTro = vaiTro.MaVaiTro,
                TenVaiTro = vaiTro.TenVaiTro,
                MoTa = vaiTro.MoTa,
                IsDelete = vaiTro.IsDelete,
                IsActive = vaiTro.IsActive,
                NgayTao = vaiTro.NgayTao,
                NgayCapNhat = vaiTro.NgayCapNhat
            };

            return ApiResponse.Success("Lấy thông tin vai trò thành công", vaiTroDto);
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse.Error($"Lỗi server: {ex.Message}", 500));
        }
    }

    // GET: api/vaitro/active
    [HttpGet("active")]
    public async Task<IActionResult> GetActiveVaiTros(CancellationToken ct = default)
    {
        try
        {
            var vaiTros = await _context.VaiTros
                .Where(vt => vt.IsDelete != true && vt.IsActive == true)
                .OrderBy(vt => vt.TenVaiTro)
                .Select(vt => new VaiTroDto
                {
                    MaVaiTro = vt.MaVaiTro,
                    TenVaiTro = vt.TenVaiTro,
                    MoTa = vt.MoTa,
                    IsDelete = vt.IsDelete,
                    IsActive = vt.IsActive,
                    NgayTao = vt.NgayTao,
                    NgayCapNhat = vt.NgayCapNhat
                })
                .ToListAsync(ct);

            return ApiResponse.Success("Lấy danh sách vai trò đang hoạt động thành công", vaiTros);
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse.Error($"Lỗi server: {ex.Message}", 500));
        }
    }
} 